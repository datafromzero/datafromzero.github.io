/**
 * Placement tests at the stage gates (SPEC D67). Each stage page in PLACEMENT_TESTS (src/lib/roadmap.ts) has a
 * "## Placement test" section in src/content/docs/{stage}/index.md. This test keeps the page, the roadmap constant and the
 * lessons the questions send a learner to in step: a retitled, renumbered or unpublished lesson fails here, and so does a
 * code written from an order number instead of `lessonCode`.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { lessonCode, PLACEMENT_TESTS, ROADMAP_STAGES } from '../src/lib/roadmap.ts';

const DOCS = 'src/content/docs';

function lessonFile(path: string): string | undefined {
	return ['.mdx', '.md'].map((ext) => `${DOCS}/${path}${ext}`).find((f) => existsSync(f));
}

function frontmatter(file: string): { title: string; stage: string; order: number; status: string } {
	return parse(readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)![1]);
}

/** The text of the "## Placement test" section, or undefined. */
function section(stage: string): string | undefined {
	const text = readFileSync(`${DOCS}/${stage}/index.md`, 'utf8');
	const start = text.indexOf('\n## Placement test\n');
	if (start < 0) return undefined;
	const rest = text.slice(start + 1);
	const next = rest.slice(3).search(/\n## /);
	return next < 0 ? rest : rest.slice(0, next + 3);
}

/** The numbered questions of a section: the text from "N. " at the start of a line to the next one. */
function questions(sec: string): string[] {
	const parts = sec.split(/\n(?=\d+\. )/);
	return parts.slice(1);
}

describe('placement tests (SPEC D67)', () => {
	test('exactly the stages in PLACEMENT_TESTS have a test, and all of them are real stages', () => {
		for (const s of ROADMAP_STAGES) {
			const sec = section(s.id);
			assert.equal(sec !== undefined, s.id in PLACEMENT_TESTS, `${s.id}: page and PLACEMENT_TESTS disagree`);
		}
		for (const id of Object.keys(PLACEMENT_TESTS)) assert.ok(ROADMAP_STAGES.some((s) => s.id === id), id);
	});

	for (const [stage, { next }] of Object.entries(PLACEMENT_TESTS)) {
		describe(stage, () => {
			const sec = section(stage)!;
			const qs = questions(sec);

			test('has 6 to 8 questions, numbered 1, 2, 3 ...', () => {
				assert.ok(qs.length >= 6 && qs.length <= 8, `${qs.length} questions`);
				qs.forEach((q, i) => assert.ok(q.startsWith(`${i + 1}. `), `question ${i + 1} is numbered ${q.slice(0, 4)}`));
			});

			test('the rule sends a learner who is right everywhere to the next lesson, and that lesson exists', () => {
				const rule = sec.slice(0, sec.search(/\n\d+\. /));
				assert.match(rule, /All \w+ right/, 'rule bullet "All N right"');
				assert.match(rule, /One or more wrong/, 'rule bullet "One or more wrong"');
				assert.ok(rule.includes(`](${next})`), `the rule links ${next}`);
				const file = lessonFile(next.replace(/^\/|\/$/g, ''));
				assert.ok(file, `${next} is a lesson`);
				assert.notEqual(frontmatter(file!).status, 'draft', `${next} is a draft`);
			});

			test('every question has one answer box with "Missed it? Study [*Title*](url) (code)." for a published lesson', () => {
				qs.forEach((q, i) => {
					const n = i + 1;
					assert.equal((q.match(/<details>/g) ?? []).length, 1, `question ${n}: one <details>`);
					assert.equal((q.match(/<\/details>/g) ?? []).length, 1, `question ${n}: one </details>`);
					assert.ok(q.includes('<summary>Answer</summary>'), `question ${n}: summary is "Answer"`);
					const links = [...q.matchAll(/Missed it\? Study \[\*([^\]]+)\*\]\((\/[^)]+\/)\) \(([A-Za-z]+[0-9a-z.]*)\)\./g)];
					assert.equal(links.length, 1, `question ${n}: one "Missed it?" line in the exact format`);
					const [, title, url, code] = links[0];
					const file = lessonFile(url.replace(/^\/|\/$/g, ''));
					assert.ok(file, `question ${n}: ${url} is a lesson`);
					const fm = frontmatter(file!);
					assert.equal(fm.stage, stage, `question ${n}: ${url} is in the ${stage} stage`);
					assert.notEqual(fm.status, 'draft', `question ${n}: ${url} is a draft`);
					assert.equal(title, fm.title, `question ${n}: link text is the lesson title`);
					assert.equal(code, lessonCode(stage, fm.order), `question ${n}: code of ${url}`);
				});
			});

			test('the questions send a learner to at least four different lessons', () => {
				const urls = new Set(qs.map((q) => q.match(/Missed it\? Study \[\*[^\]]+\*\]\((\/[^)]+\/)\)/)![1]));
				assert.ok(urls.size >= 4, `${urls.size} lessons`);
			});

			test('no placeholder text and no British spelling in the test', () => {
				assert.doesNotMatch(sec, /\b(TODO|TBD|XX)\b/);
				// cspell:disable-next-line
				assert.doesNotMatch(sec, /\b(grey|colour|favour|centre|cancelled|analyse)\w*\b/i);
			});
		});
	}
});

/**
 * The glossary (SPEC D68): every entry file keeps the shape of SPEC §5.3 and sends a learner to real lessons under the
 * right title and code, no entry is an orphan, the A to Z list groups the terms the way a reader looks them up, and the
 * `<Term>` rules of scripts/lib/term-rules.mjs hold for every lesson. The build already fails on an unknown Term id and on
 * a `short` over 140 characters; these tests give the reason in words and cover what the build does not.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { glossaryGroups } from '../src/lib/glossary.ts';
import { lessonCode, ROADMAP_STAGES } from '../src/lib/roadmap.ts';
import { MAX_TERMS, termProblems, termUses } from '../scripts/lib/term-rules.mjs';

const DOCS = 'src/content/docs';
const GLOSSARY = `${DOCS}/reference/glossary`;

interface Entry {
	file: string;
	slug: string;
	fm: { id: string; term: string; short: string; aliases: string[]; reviewed: string | Date };
	body: string;
}

function split(text: string): { fm: Record<string, unknown>; body: string } {
	const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)!;
	return { fm: parse(m[1]), body: m[2] };
}

const entries: Entry[] = readdirSync(GLOSSARY)
	.filter((f) => f.endsWith('.md') && f !== 'index.md')
	.map((f) => {
		const { fm, body } = split(readFileSync(`${GLOSSARY}/${f}`, 'utf8'));
		return { file: f, slug: f.replace(/\.md$/, ''), fm: fm as Entry['fm'], body };
	});
const ids = new Set(entries.map((e) => e.fm.id));

interface Lesson {
	file: string;
	stage: string;
	slug: string;
	title: string;
	status: string;
	code: string | undefined;
	lines: string[];
}
const lessons: Lesson[] = [];
for (const s of ROADMAP_STAGES) {
	for (const f of existsSync(`${DOCS}/${s.id}`) ? readdirSync(`${DOCS}/${s.id}`) : []) {
		if (!/\.mdx?$/.test(f) || /^index\.mdx?$/.test(f)) continue;
		const text = readFileSync(`${DOCS}/${s.id}/${f}`, 'utf8');
		const { fm } = split(text);
		lessons.push({
			file: `${s.id}/${f}`,
			stage: s.id,
			slug: f.replace(/\.mdx?$/, ''),
			title: String(fm.title),
			status: String(fm.status),
			code: lessonCode(s.id, Number(fm.order)),
			lines: text.split('\n'),
		});
	}
}

describe('glossary entries (SPEC §5.3)', () => {
	test('the glossary has entries', () => {
		assert.ok(entries.length >= 30, `${entries.length} entries`);
	});

	for (const e of entries) {
		describe(e.slug, () => {
			test('id, term, short and aliases follow the schema', () => {
				assert.equal(e.fm.id, `glossary-${e.slug}`, 'id must be glossary- plus the file name');
				assert.ok(typeof e.fm.term === 'string' && e.fm.term.length > 0);
				assert.ok(typeof e.fm.short === 'string' && e.fm.short.length > 0 && e.fm.short.length <= 140, `short is ${e.fm.short?.length} characters`);
				assert.ok(Array.isArray(e.fm.aliases));
				assert.match(String(e.fm.reviewed), /^\d{4}-\d{2}-\d{2}/, 'reviewed is a date');
			});

			test('the body defines the word and ends with "Where you meet it" and "Source"', () => {
				const sentences = e.body.split(/\n## /)[0].trim().split(/(?<=[.!?])\s+/);
				assert.ok(sentences.length >= 2 && sentences.length <= 6, `${sentences.length} sentences before the first heading`);
				assert.match(e.body, /\n## Where you meet it\n/);
				assert.match(e.body, /\n## Source\n/);
				const source = e.body.split('\n## Source\n')[1];
				assert.match(source, /\]\((https:\/\/|\/)/, 'the source is a link');
			});

			test('every lesson it points to is published, under its title and code', () => {
				const section = e.body.split('\n## Where you meet it\n')[1].split('\n## ')[0];
				const items = section.split('\n').filter((l) => l.startsWith('- '));
				assert.ok(items.length >= 1);
				for (const item of items) {
					const m = item.match(/^- \[\*(.+?)\*\]\((\/[a-z-]+\/[a-z0-9-]+\/)\) \(([A-Z]+\d+[a-z]?)\): .+\.$/);
					assert.ok(m, `not "- [*Title*](/stage/slug/) (CODE): note.": ${item}`);
					const [, title, url, code] = m;
					const [, stage, slug] = url.split('/');
					const l = lessons.find((x) => x.stage === stage && x.slug === slug);
					assert.ok(l, `${url} is not a lesson`);
					assert.equal(l.status, 'published', `${url} is not published`);
					assert.equal(l.title, title, `${url}: the link text must be the lesson's title`);
					assert.equal(l.code, code, `${url}: the code is ${l.code}`);
				}
			});

			test('links to other glossary pages name an entry that exists', () => {
				for (const m of e.body.matchAll(/\]\(\/reference\/glossary\/([a-z0-9-]+)\/\)/g)) assert.ok(ids.has(`glossary-${m[1]}`), `no entry ${m[1]}`);
			});

			test('it names nothing made in China (SPEC D62) and no Vietnamese', () => {
				const text = readFileSync(`${GLOSSARY}/${e.file}`, 'utf8');
				assert.doesNotMatch(text, /\b(qwen|deepseek|glm|kimi|minimax|ernie|hunyuan|doubao|internlm|bge|tiktok|wechat|alibaba|tencent|baidu|bytedance)\b/i);
				assert.doesNotMatch(text, /[\u0102\u0103\u00C2\u00E2\u00CA\u00EA\u00D4\u00F4\u01A0\u01A1\u01AF\u01B0\u0110\u0111]/);
			});
		});
	}

	test('ids are unique', () => {
		assert.equal(ids.size, entries.length);
	});
});

describe('no entry is an orphan', () => {
	// An entry is reachable from the A to Z list always; it must also be linked from a lesson's Term or from another entry.
	const usedInLessons = new Set<string>();
	for (const l of lessons) for (const u of termUses(l.lines)) usedInLessons.add(u.id);
	const linkedFromEntries = new Set<string>();
	for (const e of entries) for (const m of e.body.matchAll(/\]\(\/reference\/glossary\/([a-z0-9-]+)\/\)/g)) if (m[1] !== e.slug) linkedFromEntries.add(`glossary-${m[1]}`);

	test('every entry is used by a Term in a lesson or linked from another entry', () => {
		const orphans = [...ids].filter((id) => !usedInLessons.has(id) && !linkedFromEntries.has(id));
		assert.deepEqual(orphans, []);
	});

	test('most entries are linked from a lesson', () => {
		assert.ok(usedInLessons.size >= entries.length * 0.8, `${usedInLessons.size} of ${entries.length}`);
	});
});

describe('the A to Z list', () => {
	test('it groups by first letter, ignoring case and punctuation, and keeps every term', () => {
		const terms = [{ term: 'uv' }, { term: 'p-value' }, { term: 'README' }, { term: 'Pipeline' }, { term: 'Commit (Git)' }, { term: 'CSV' }, { term: 'Commit (database)' }];
		const groups = glossaryGroups(terms);
		assert.deepEqual(groups.map((g) => g.letter), ['C', 'P', 'R', 'U']);
		assert.deepEqual(groups[0].terms.map((t) => t.term), ['Commit (database)', 'Commit (Git)', 'CSV']);
		assert.deepEqual(groups[1].terms.map((t) => t.term), ['Pipeline', 'p-value']);
		assert.equal(groups.flatMap((g) => g.terms).length, terms.length);
	});

	test('the real glossary has no term that sorts to a non-letter', () => {
		for (const g of glossaryGroups(entries.map((e) => ({ term: e.fm.term })))) assert.match(g.letter, /^[A-Z]$/);
	});
});

describe('Term placement (scripts/lib/term-rules.mjs)', () => {
	const known = new Set(['glossary-grain', 'glossary-join']);
	const lesson = (...body: string[]) => ['---', 'id: x', '---', ...body];
	const T = (id: string, w: string) => `<Term id="glossary-${id}">${w}</Term>`;

	test('a Term in a sentence of Learn by doing is fine', () => {
		const lines = lesson('## Learn by doing', '', `Say the ${T('grain', 'grain')} first.`);
		assert.deepEqual(termProblems(lines, known), []);
	});

	test('an unknown id, a repeat and a heading fail', () => {
		const p = termProblems(lesson('## The question', `A ${T('nope', 'word')} and ${T('grain', 'grain')} and ${T('grain', 'grain')}.`, `### Unit ${T('join', 'join')}`), known);
		assert.equal(p.length, 3);
		assert.match(p[0].msg, /not a glossary id/);
		assert.match(p[1].msg, /already used/);
		assert.match(p[2].msg, /heading/);
	});

	test('code, figures, details, exercises and warm-ups fail', () => {
		const bad = [
			lesson('```', T('grain', 'grain'), '```'),
			lesson('<figure>', T('grain', 'grain'), '</figure>'),
			lesson('<details>', '<summary>', T('grain', 'grain'), '</summary>', '</details>'),
			lesson('<Exercise id="x-1">', T('grain', 'grain'), '</Exercise>'),
			lesson('## Warm-up', '', T('grain', 'grain')),
			lesson('## Check yourself', '', T('grain', 'grain')),
			lesson('## Learn by doing', '*Why:* the ' + T('grain', 'grain') + ' is one order.'),
			lesson('## Learn by doing', '**Predict:** what is the ' + T('grain', 'grain') + '?'),
		];
		for (const lines of bad) assert.equal(termProblems(lines, known).length, 1, lines.slice(3).join(' | '));
	});

	test('a one-line details block does not hide the lines after it', () => {
		const lines = lesson('## Learn by doing', '<details><summary>Hint</summary>x</details>', `Say the ${T('grain', 'grain')} first.`);
		assert.deepEqual(termProblems(lines, known), []);
	});

	test(`more than ${MAX_TERMS} Terms in one lesson fail`, () => {
		const many = new Set(Array.from({ length: MAX_TERMS + 1 }, (_, i) => `glossary-t${i}`));
		const lines = lesson('## Learn by doing', ...[...many].map((id) => `A ${T(id.replace('glossary-', ''), 'word')}.`));
		const p = termProblems(lines, many);
		assert.equal(p.length, 1);
		assert.match(p[0].msg, /at most/);
	});
});

describe('every lesson', () => {
	test('Terms are in good places, and a .md lesson uses none', () => {
		const problems: string[] = [];
		for (const l of lessons) {
			for (const p of termProblems(l.lines, ids)) problems.push(`${l.file}:${p.line}: ${p.msg}`);
			if (l.file.endsWith('.md') && termUses(l.lines).length > 0) problems.push(`${l.file}: a .md lesson cannot use components`);
		}
		assert.deepEqual(problems, []);
	});
});

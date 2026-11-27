/**
 * Placement tests (SPEC D67). Each of Excel, SQL and Python ends its stage page with "## Placement test" in two parts
 * ("### Placement test, part 1" and "part 2"); the core stage page holds the gate test for Part 1; Parts 2 to 6 of the core open
 * with "## Can you skip Part N?" inside C8, C16, C22, C30 and C36. This test keeps the pages, the roadmap constant and the lessons
 * the questions send a learner to in step: a retitled, renumbered or unpublished lesson fails here, and so does a code written
 * from an order number instead of `lessonCode`.
 *
 * Coverage rule: a test says which lessons it covers ("This part covers E1, E3 ...") and those must be exactly the lessons its
 * "Missed it?" lines point to; the lessons no question tests are listed ("Not tested ...") and every lesson of the stage or part is
 * either covered or listed, never both. The same lists sit in a hidden element, `<div hidden data-placement-test="excel-1"
 * data-covers="E1 E3 ...">`, for scripts that read the page; this test keeps the element and the sentence in step.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { lessonCode, PLACEMENT_TESTS, ROADMAP_STAGES } from '../src/lib/roadmap.ts';

const DOCS = 'src/content/docs';
const NUMBER_WORDS: Record<number, string> = { 5: 'five', 6: 'six', 7: 'seven', 8: 'eight' };

interface Lesson {
	slug: string;
	title: string;
	stage: string;
	order: number;
	status: string;
	code: string;
}

function lessonFile(path: string): string | undefined {
	return ['.mdx', '.md'].map((ext) => `${DOCS}/${path}${ext}`).find((f) => existsSync(f));
}

function frontmatter(file: string): { title: string; stage: string; order: number; status: string } {
	return parse(readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)![1]);
}

/** The lessons of a stage that are not drafts, in study order. */
function lessonsOf(stage: string): Lesson[] {
	const out: Lesson[] = [];
	for (const f of readdirSync(`${DOCS}/${stage}`)) {
		if (/^index\./.test(f)) continue;
		const fm = frontmatter(`${DOCS}/${stage}/${f}`);
		if (fm.status === 'draft') continue;
		out.push({ slug: f.replace(/\.mdx?$/, ''), title: fm.title, stage, order: fm.order, status: fm.status, code: lessonCode(stage, fm.order)! });
	}
	return out.sort((a, b) => a.order - b.order);
}

/**
 * The lesson codes named in a sentence: "E2, E12 and E20 to E22" gives E2, E12, E20, E21, E22. A range runs through the lessons
 * of the stage in study order (`all`).
 */
function codesIn(text: string, all: string[]): string[] {
	const out: string[] = [];
	for (const m of text.matchAll(/\b([A-Z]{1,2}\d+[a-z]?)(?: to ([A-Z]{1,2}\d+[a-z]?))?/g)) {
		const from = all.indexOf(m[1]);
		assert.ok(from >= 0, `${m[1]} is not a lesson of this stage`);
		if (!m[2]) {
			out.push(m[1]);
			continue;
		}
		const to = all.indexOf(m[2]);
		assert.ok(to >= from, `${m[1]} to ${m[2]} is not a range`);
		out.push(...all.slice(from, to + 1));
	}
	return out;
}

/** The hidden marker with `data-placement-test="id"`: its attributes, or undefined. */
function testMarker(text: string, id: string): Record<string, string> | undefined {
	const m = text.match(new RegExp(`<div hidden data-placement-test="${id}"([^>]*)></div>`));
	return m ? attributes(m[1]) : undefined;
}

function attributes(raw: string): Record<string, string> {
	const out: Record<string, string> = {};
	for (const m of raw.matchAll(/([a-z-]+)="([^"]*)"/g)) out[m[1]] = m[2];
	return out;
}

function words(attr: string | undefined): string[] {
	return (attr ?? '').split(/\s+/).filter(Boolean);
}

/** The numbered questions of a section: the text from "N. " at the start of a line to the next one. */
function questions(sec: string): string[] {
	return sec.split(/\n(?=\d+\. )/).slice(1);
}

/** The text of the "## Placement test" section of a stage page, or undefined. */
function stageSection(stage: string): string | undefined {
	const text = readFileSync(`${DOCS}/${stage}/index.md`, 'utf8');
	const start = text.indexOf('\n## Placement test\n');
	if (start < 0) return undefined;
	const rest = text.slice(start + 1);
	const next = rest.slice(3).search(/\n## /);
	return next < 0 ? rest : rest.slice(0, next + 3);
}

/** The text of a "## Can you skip Part N?" section of a core lesson. */
function partSection(file: string, n: number): string {
	const text = readFileSync(`${DOCS}/${file}.mdx`, 'utf8');
	const start = text.indexOf(`\n## Can you skip Part ${n}?\n`);
	assert.ok(start >= 0, `${file}: no "Can you skip Part ${n}?" section`);
	const rest = text.slice(start + 1);
	const next = rest.slice(3).search(/\n## /);
	return next < 0 ? rest : rest.slice(0, next + 3);
}

interface Check {
	/** Display name, e.g. "excel part 1". */
	name: string;
	stage: string;
	/** The section text from the heading's line to the end of the test. */
	sec: string;
	/** The `data-placement-test` id of its hidden marker. */
	id: string;
	/** Where the all-right rule must lead: a lesson path, or `#placement-test-part-2`. */
	next: string;
	/** The lessons this test can point to (the stage, or the part), in study order. */
	range: Lesson[];
	/** True when the lessons of `range` that no question tests are listed in this test (core parts), not at the stage level. */
	listsUntested: boolean;
	/** Numbers of questions allowed. */
	count: [number, number];
}

/** Everything one test must satisfy; returns the lessons it covers. */
function checkOneTest(c: Check): { covers: string[]; notTested: string[] } {
	const { sec, stage } = c;
	const all = c.range.map((l) => l.code);
	const qs = questions(sec);
	const rule = sec.slice(0, sec.search(/\n\d+\. /));

	assert.ok(qs.length >= c.count[0] && qs.length <= c.count[1], `${c.name}: ${qs.length} questions`);
	qs.forEach((q, i) => assert.ok(q.startsWith(`${i + 1}. `), `${c.name}: question ${i + 1} is numbered ${q.slice(0, 4)}`));

	// the rule
	assert.match(rule, /All \w+ right/, `${c.name}: rule bullet "All N right"`);
	assert.match(rule, /One or more wrong/, `${c.name}: rule bullet "One or more wrong"`);
	assert.ok(rule.includes(`All ${NUMBER_WORDS[qs.length]} right`), `${c.name}: the rule says "All ${NUMBER_WORDS[qs.length]} right" for ${qs.length} questions`);
	assert.match(rule, /study (?:the stage|Part \d) from there, in order/, `${c.name}: the wrong-answer bullet sends a learner to the earliest lesson`);
	assert.ok(rule.includes('Start at the earliest of those lessons (the lowest code)'), `${c.name}: the wrong-answer bullet names the earliest missed lesson`);
	if (c.next.startsWith('#')) {
		assert.ok(rule.includes(`](${c.next})`), `${c.name}: the all-right bullet links ${c.next}`);
	} else {
		assert.ok(rule.includes(`](${c.next})`), `${c.name}: the all-right bullet links ${c.next}`);
		const file = lessonFile(c.next.replace(/^\/|\/$/g, ''));
		assert.ok(file, `${c.name}: ${c.next} is a lesson`);
		assert.notEqual(frontmatter(file!).status, 'draft', `${c.next} is a draft`);
	}

	// every question: one answer box and one "Missed it?" line in the exact format
	const targets: Lesson[] = [];
	qs.forEach((q, i) => {
		const n = i + 1;
		assert.equal((q.match(/<details>/g) ?? []).length, 1, `${c.name} question ${n}: one <details>`);
		assert.equal((q.match(/<\/details>/g) ?? []).length, 1, `${c.name} question ${n}: one </details>`);
		assert.ok(q.includes('<summary>Answer</summary>'), `${c.name} question ${n}: summary is "Answer"`);
		const links = [...q.matchAll(/Missed it\? Study \[\*([^\]]+)\*\]\((\/[^)]+\/)\) \(([A-Za-z]+[0-9a-z.]*)\)\./g)];
		assert.equal(links.length, 1, `${c.name} question ${n}: one "Missed it?" line in the exact format`);
		const [, title, url, code] = links[0];
		const file = lessonFile(url.replace(/^\/|\/$/g, ''));
		assert.ok(file, `${c.name} question ${n}: ${url} is a lesson`);
		const fm = frontmatter(file!);
		assert.equal(fm.stage, stage, `${c.name} question ${n}: ${url} is in the ${stage} stage`);
		assert.notEqual(fm.status, 'draft', `${c.name} question ${n}: ${url} is a draft`);
		assert.equal(title, fm.title, `${c.name} question ${n}: link text is the lesson title`);
		assert.equal(code, lessonCode(stage, fm.order), `${c.name} question ${n}: code of ${url}`);
		const lesson = c.range.find((l) => l.code === code);
		assert.ok(lesson, `${c.name} question ${n}: ${code} is outside the lessons this test is about`);
		targets.push(lesson!);
	});
	targets.forEach((l, i) => {
		if (i > 0) assert.ok(l.order >= targets[i - 1].order, `${c.name}: question ${i + 1} (${l.code}) comes before question ${i} (${targets[i - 1].code}); keep the questions in lesson order`);
	});

	// the coverage claim: sentence, hidden marker and "Missed it?" targets say the same
	const claim = sec.match(/This (?:test|part) covers ([^.]+)\./);
	assert.ok(claim, `${c.name}: a sentence "This part covers ..."`);
	const covers = codesIn(claim![1], all);
	const targetCodes = [...new Set(targets.map((l) => l.code))];
	assert.deepEqual([...covers].sort(), [...targetCodes].sort(), `${c.name}: the lessons it says it covers are the lessons its "Missed it?" lines point to`);
	const marker = testMarker(sec, c.id);
	assert.ok(marker, `${c.name}: hidden marker <div hidden data-placement-test="${c.id}" data-covers="...">`);
	assert.deepEqual(words(marker!['data-covers']), covers, `${c.name}: data-covers equals the sentence, in study order`);
	assert.deepEqual(covers, all.filter((code) => covers.includes(code)), `${c.name}: the covers list is in study order`);

	// the lessons of a core part that no question tests
	let notTested: string[] = [];
	if (c.listsUntested) {
		const missing = all.filter((code) => !covers.includes(code));
		const said = sec.match(/does not test (.+?), so passing/);
		if (missing.length === 0) {
			assert.equal(said, null, `${c.name}: says some lessons are not tested, and every lesson is`);
			assert.equal(marker!['data-not-tested'], undefined, `${c.name}: data-not-tested on a test that covers everything`);
		} else {
			assert.ok(said, `${c.name}: a sentence "It does not test ..., so passing does not skip them"`);
			notTested = codesIn(said![1], all);
			assert.deepEqual(notTested, missing, `${c.name}: the lessons it says it does not test are exactly the lessons no question covers`);
			assert.deepEqual(words(marker!['data-not-tested']), missing, `${c.name}: data-not-tested equals the sentence`);
		}
	}

	assert.doesNotMatch(sec, /\b(TODO|TBD|XX)\b/);
	// cspell:disable-next-line
	assert.doesNotMatch(sec, /\b(grey|colour|favour|centre|cancelled|analyse)\w*\b/i);
	return { covers, notTested };
}

describe('placement tests (SPEC D67)', () => {
	test('exactly the stages in PLACEMENT_TESTS have a test, and all of them are real stages', () => {
		for (const s of ROADMAP_STAGES) {
			const sec = stageSection(s.id);
			assert.equal(sec !== undefined, s.id in PLACEMENT_TESTS, `${s.id}: page and PLACEMENT_TESTS disagree`);
		}
		for (const id of Object.keys(PLACEMENT_TESTS)) assert.ok(ROADMAP_STAGES.some((s) => s.id === id), id);
	});

	for (const [stage, { next }] of Object.entries(PLACEMENT_TESTS)) {
		describe(stage, () => {
			const sec = stageSection(stage)!;
			const lessons = lessonsOf(stage);
			const all = lessons.map((l) => l.code);
			const twoParts = stage !== 'core';

			if (!twoParts) {
				// The core stage page holds the gate test for Part 1 only (C1 to C7); Parts 2 to 6 are tested in their lessons.
				test('the gate test covers all of Part 1 (C1 to C7) and sends a learner on to C8', () => {
					const part1 = lessons.filter((l) => l.order >= 10 && l.order <= 70);
					assert.equal(part1.length, 7);
					const { covers } = checkOneTest({ name: 'core gate test', stage, sec, id: 'core-1', next, range: part1, listsUntested: true, count: [6, 8] });
					assert.deepEqual(covers, part1.map((l) => l.code), 'the gate test checks every lesson of Part 1');
				});
				test('a kind line tells a beginner to skip the test', () => {
					assert.ok(sec.includes('New to statistics? Skip this test and start at'), 'the kind line for beginners');
					assert.ok(sec.indexOf('New to statistics?') < sec.indexOf('\n- **All seven right:**'), 'it comes before the rule');
				});
				return;
			}

			const parts = sec.split(/\n### Placement test, part (\d)\n/);
			// parts = [intro, "1", text1, "2", text2]
			test('has exactly two parts, "Placement test, part 1" and "part 2"', () => {
				assert.equal(parts.length, 5, `${stage}: ${(parts.length - 1) / 2} parts`);
				assert.equal(parts[1], '1');
				assert.equal(parts[3], '2');
			});
			const intro = parts[0];
			const part1 = parts[2];
			const part2 = parts[4];
			const checked: { covers: string[] }[] = [];

			test('part 1 and part 2 each satisfy the question format, the rule and the coverage claim', () => {
				checked.push(checkOneTest({ name: `${stage} part 1`, stage, sec: part1, id: `${stage}-1`, next: '#placement-test-part-2', range: lessons, listsUntested: false, count: [6, 8] }));
				checked.push(checkOneTest({ name: `${stage} part 2`, stage, sec: part2, id: `${stage}-2`, next, range: lessons, listsUntested: false, count: [6, 8] }));
			});

			test('part 2 tells a learner who is right everywhere to go on to the next stage, after skimming the lessons not tested', () => {
				assert.match(part2, /if part 1 was all right too, go on to the first/, 'the all-right sentence names both parts');
				assert.match(part2, /Before you rely on the lessons that are not tested \(listed above part 1\), skim each one/, 'and says to skim the lessons not tested');
				assert.doesNotMatch(part2, /you can skip this stage/, 'it does not contradict "passing does not skip"');
			});

			test('every lesson of the stage is covered by a question or listed as not tested, and none is both', () => {
				const [one, two] = checked.length === 2 ? checked : [
					checkOneTest({ name: `${stage} part 1`, stage, sec: part1, id: `${stage}-1`, next: '#placement-test-part-2', range: lessons, listsUntested: false, count: [6, 8] }),
					checkOneTest({ name: `${stage} part 2`, stage, sec: part2, id: `${stage}-2`, next, range: lessons, listsUntested: false, count: [6, 8] }),
				];
				const said = intro.match(/\*\*Not tested in either part:\*\* (.+?)\. Passing does not skip those (\w+)\./);
				assert.ok(said, `${stage}: a sentence "Not tested in either part: ... Passing does not skip those N."`);
				const notTested = codesIn(said![1], all);
				const spoken = Object.entries(NUMBER_WORDS).find(([, w]) => w === said![2])?.[0] ?? said![2];
				assert.equal(Number(spoken), notTested.length, `${stage}: the count in the sentence`);
				const stageMarker = intro.match(/<div hidden data-placement-stage="([^"]+)" data-not-tested="([^"]*)"><\/div>/);
				assert.ok(stageMarker, `${stage}: hidden marker <div hidden data-placement-stage="${stage}" data-not-tested="...">`);
				assert.equal(stageMarker![1], stage);
				assert.deepEqual(words(stageMarker![2]), notTested, `${stage}: data-not-tested equals the sentence`);
				const covered = [...one.covers, ...two.covers];
				assert.equal(new Set(covered).size, covered.length, `${stage}: a lesson is covered by both parts`);
				for (const code of notTested) assert.ok(!covered.includes(code), `${stage}: ${code} is listed as not tested and also has a question`);
				assert.deepEqual([...covered, ...notTested].sort(), [...all].sort(), `${stage}: covered plus not tested is exactly the ${all.length} lessons of the stage`);
				const total = intro.match(/Together the two parts test (\d+) of the (\d+) lessons/);
				assert.ok(total, `${stage}: a sentence "Together the two parts test N of the M lessons"`);
				assert.equal(Number(total![1]), covered.length, `${stage}: lessons tested`);
				assert.equal(Number(total![2]), all.length, `${stage}: lessons in the stage`);
			});

			test('the all-right rule of part 2 sends a learner to the first lesson of the next stage', () => {
				const first = lessonFile(next.replace(/^\/|\/$/g, ''));
				assert.ok(first, `${next} is a lesson`);
				assert.ok(frontmatter(first!).order <= 10, `${next} is the first lesson of its stage`);
			});

			test('the questions of each part send a learner to at least four different lessons', () => {
				for (const part of [part1, part2]) {
					const urls = new Set(questions(part).map((q) => q.match(/Missed it\? Study \[\*[^\]]+\*\]\((\/[^)]+\/)\)/)![1]));
					assert.ok(urls.size >= 4, `${urls.size} lessons`);
				}
			});
		});
	}

	// Parts 2 to 6 of the core: "## Can you skip Part N?" in the lesson that opens the part.
	const PARTS = [
		{ n: 2, file: 'core/hypothesis-testing', from: 80, to: 150, next: '/core/modeling-the-domain/' },
		{ n: 3, file: 'core/modeling-the-domain', from: 160, to: 210, next: '/core/laptop-setup-and-terminal/' },
		{ n: 4, file: 'core/laptop-setup-and-terminal', from: 220, to: 290, next: '/core/git-branches-and-pull-requests/' },
		{ n: 5, file: 'core/git-branches-and-pull-requests', from: 300, to: 350, next: '/core/what-ai-can-and-cannot-do/' },
		{ n: 6, file: 'core/what-ai-can-and-cannot-do', from: 360, to: 430, next: '/core/capstone-two-quiet-weeks/' },
	];
	describe('the "Can you skip Part N?" tests of the core', () => {
		const core = lessonsOf('core');
		for (const p of PARTS) {
			test(`Part ${p.n} (${p.file}): format, rule, routing and coverage`, () => {
				const range = core.filter((l) => l.order >= p.from && l.order <= p.to);
				assert.ok(range.length >= 6, `Part ${p.n} has ${range.length} lessons`);
				assert.equal(range[0].slug, p.file.replace('core/', ''), `the test sits in the first lesson of Part ${p.n}`);
				const sec = partSection(p.file, p.n);
				checkOneTest({ name: `core part ${p.n}`, stage: 'core', sec, id: `core-${p.n}`, next: p.next, range, listsUntested: true, count: [5, 8] });
			});
		}
		test('Part 6 sends a learner on to the capstone and then to the track choice', () => {
			assert.ok(partSection('core/what-ai-can-and-cannot-do', 6).includes('](/choose-your-track/)'));
		});
		test('every placement marker id is unique across the site', () => {
			const ids = new Map<string, string>();
			const files = [...['excel', 'sql', 'python', 'core'].map((s) => `${DOCS}/${s}/index.md`), ...PARTS.map((p) => `${DOCS}/${p.file}.mdx`)];
			for (const f of files) {
				for (const m of readFileSync(f, 'utf8').matchAll(/data-placement-test="([^"]+)"/g)) {
					assert.ok(!ids.has(m[1]), `${m[1]} appears in ${ids.get(m[1])} and ${f}`);
					ids.set(m[1], f);
				}
			}
			assert.deepEqual([...ids.keys()].sort(), ['core-1', 'core-2', 'core-3', 'core-4', 'core-5', 'core-6', 'excel-1', 'excel-2', 'python-1', 'python-2', 'sql-1', 'sql-2']);
		});
	});
});

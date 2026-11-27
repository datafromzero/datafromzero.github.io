import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { WARMUP_OPENING, headingIds, questionProblems, slugify, warmupExempt, warmupProblems, warmupSection } from '../scripts/lib/warmup-links.mjs';

const lessons = [
	{ code: 'E8', url: '/excel/xlookup/', title: 'Bring in a value by key with XLOOKUP', ids: ['the-picture', 'worked-example'] },
	{ code: 'S4', url: '/sql/null-handling/', title: 'NULL: unknown is not zero', short: 'NULL handling', ids: ['1-find-the-missing-value'] },
	{ code: 'S8', url: '/sql/group-by-having/', title: 'GROUP BY and HAVING', ids: ['1-one-group-per-store', '4-having-clears-groups-after-the-count'] },
	{ code: 'S11', url: '/sql/dates-and-time/', title: 'Working with dates and time', ids: ['3-cut-to-the-start-of-a-period'] },
	{ code: 'S18', url: '/sql/relational-model/', title: 'Tables, keys and grain', ids: ['1-say', '2-a-primary-key'] },
	{ code: 'DA8a', url: '/data-analyst/dashboard-design/', title: 'Designing a dashboard people will use', ids: ['3-say'] },
];
const index = { byCode: {}, byUrl: {} };
for (const l of lessons) {
	const info = { ...l, ids: new Set(l.ids) };
	index.byCode[l.code] = info;
	index.byUrl[l.url] = info;
}
const MARK = '{/*warmup: not-taught-earlier*/}';
const S18 = '[*Tables, keys and grain*](/sql/relational-model/#2-a-primary-key)';
const lesson = (...questions) =>
	['## Warm-up', '', WARMUP_OPENING, '', ...questions.flatMap((q, i) => [`${i + 1}. ${q}`, '', '   <details>', '   <summary>Answer</summary>', '', '   An answer that names S18 without a link.', '', '   </details>', '']), '## The question'];

describe('questionProblems: links', () => {
	test('a linked title, with or without an anchor, then the code is fine', () => {
		assert.deepEqual(questionProblems(`In ${S18} (S18), which column?`, 'sql', index), []);
		assert.deepEqual(questionProblems('In [*Tables, keys and grain*](/sql/relational-model/) (S18), which column?', 'sql', index), []);
	});

	test('the code after a comma, inside parentheses or across a line break, is fine', () => {
		const q = 'Count the orders ([*Working with dates and time*](/sql/dates-and-time/#3-cut-to-the-start-of-a-period), S11, and [*GROUP BY and HAVING*](/sql/group-by-having/#1-one-group-per-store),\n   S8). Expected: 6 rows.';
		assert.deepEqual(questionProblems(q, 'sql', index), []);
		assert.deepEqual(questionProblems(`From a table (lesson ${S18}, S18).`, 'sql', index), []);
	});

	test('a question names the lesson in the appended form too', () => {
		assert.deepEqual(questionProblems(`Write a query (from ${S18}, S18).`, 'sql', index), []);
	});

	test('a question with no link is a problem, and so is a link to a page that is not a lesson', () => {
		assert.match(questionProblems('Write a query.', 'sql', index)[0], /no link to an earlier lesson/);
		assert.match(questionProblems('See [*the cheatsheet*](/sql/cheatsheet/).', 'sql', index)[0], /not a lesson/);
	});

	test('an anchor that the lesson does not have is a problem', () => {
		const p = questionProblems('In [*Tables, keys and grain*](/sql/relational-model/#9-nothing) (S18), which column?', 'sql', index);
		assert.equal(p.length, 1);
		assert.match(p[0], /no such heading/);
	});

	test('the link text is the title, the part before its colon, or the short title', () => {
		assert.deepEqual(questionProblems('In [*NULL*](/sql/null-handling/#1-find-the-missing-value) (S4), why?', 'sql', index), []);
		assert.deepEqual(questionProblems('In [*NULL: unknown is not zero*](/sql/null-handling/) (S4), why?', 'sql', index), []);
		assert.deepEqual(questionProblems('In [*NULL handling*](/sql/null-handling/) (S4), why?', 'sql', index), []);
		assert.match(questionProblems('In [*Nulls*](/sql/null-handling/) (S4), why?', 'sql', index)[0], /not a title of S4/);
		assert.match(questionProblems('In [*Tables and keys*](/sql/relational-model/) (S18), which column?', 'sql', index)[0], /not a title of S18/);
	});
});

describe('questionProblems: codes', () => {
	test('a code with no link is a problem, wherever in the sentence it stands', () => {
		for (const q of ['In S8, what is the grain?', 'In [*GROUP BY and HAVING*](/sql/group-by-having/) the grain is S8.', 'In *GROUP BY and HAVING* (S8), what is the grain?', 'Count them (*GROUP BY and HAVING*, S8).', 'In lesson S8 the query counts. Why?', 'The same as in the lesson (S8), then S11 as well.', 'Why does S8 count so?']) {
			const p = questionProblems(`${q} [*A*](/sql/group-by-having/)`, 'sql', index).filter((m) => /without a link/.test(m));
			assert.ok(p.length >= 1, q);
		}
	});

	test('a link to another lesson than the code names is a problem', () => {
		const p = questionProblems('In [*Working with dates and time*](/sql/dates-and-time/#3-cut-to-the-start-of-a-period) (S8), what happens?', 'sql', index);
		assert.equal(p.length, 1);
		assert.match(p[0], /S8.*\/sql\/dates-and-time\//);
	});

	test('a chapter reference needs a link too', () => {
		const link = '[*Designing a dashboard people will use*](/data-analyst/dashboard-design/#3-say)';
		assert.ok(questionProblems(`In *Designing a dashboard* (chapter 2), what two things? ${link}`, 'data-analyst', index).some((m) => /chapter 2/.test(m)));
		assert.deepEqual(questionProblems(`In ${link} (chapter 2), what two things?`, 'data-analyst', index), []);
	});

	test('code spans, cell names and unknown codes are not lesson codes', () => {
		assert.deepEqual(questionProblems(`Write \`=S8*E8\` for the cell. Then use \`S18\` (from ${S18}, S18).`, 'sql', index), []);
		assert.deepEqual(questionProblems(`In the cell C7 and for the code in S4, the range E8:E9 and P99 (from ${S18}, S18).`, 'sql', index), []);
		assert.deepEqual(questionProblems('In E8 you multiply the amount in D2 by the rate in H1. {/*warmup: not-taught-earlier*/}', 'excel', index), []);
	});
});

describe('the not-taught-earlier marker', () => {
	test('a marked question needs no link, and has none', () => {
		assert.deepEqual(questionProblems(`Write a query. ${MARK}`, 'sql', index), []);
		assert.deepEqual(questionProblems('Write a query. <!-- warmup: not-taught-earlier -->', 'sql', index), []);
		assert.match(questionProblems(`Write a query (from ${S18}, S18). ${MARK}`, 'sql', index)[0], /marked not-taught-earlier but links/);
	});

	test('warmupExempt lists the marked questions by line', () => {
		const lines = lesson('Fine (from ' + S18 + ', S18).', `Not taught. ${MARK}`);
		assert.deepEqual(warmupExempt(lines), [{ line: 14 }]);
	});
});

describe('warmupProblems', () => {
	test('a lesson that follows the rules has none', () => {
		const lines = lesson(`In ${S18} (S18), which column?`, `Write a query (from ${S18}, S18).`);
		assert.deepEqual(warmupProblems(lines, 'sql', index), []);
	});

	test('the answers in <details> are not checked', () => {
		assert.equal(warmupSection(lesson('Write a query.')).questions.length, 1);
	});

	test('another opening line is a problem, on the line that holds it', () => {
		const lines = lesson(`Write a query ${MARK}`);
		lines[2] = 'From memory first, then click to check.';
		const p = warmupProblems(lines, 'sql', index);
		assert.equal(p.length, 1);
		assert.equal(p[0].line, 3);
		assert.match(p[0].msg, /standard line/);
	});

	test('an unwritten warm-up and a lesson without one are skipped', () => {
		assert.deepEqual(warmupProblems(['## Warm-up', '', 'Draft: the owner writes this section.', '', '## The question'], 'ml-engineer', index), []);
		assert.deepEqual(warmupProblems(['## The question', 'Text.'], 'sql', index), []);
	});

	test('a problem names its question line', () => {
		const p = warmupProblems(lesson(`Fine (from ${S18}, S18).`, 'In S8, what is the grain?'), 'sql', index);
		assert.ok(p.length >= 1);
		assert.ok(p.every((x) => x.line === 14)); // the second question: line 5 holds the first, and each question block takes nine lines
	});
});

describe('heading ids', () => {
	test('slugify follows the Starlight rule', () => {
		assert.equal(slugify('4. `HAVING` clears groups after the count'), '4-having-clears-groups-after-the-count');
		assert.equal(slugify('2. K-fold: a score and its spread'), '2-k-fold-a-score-and-its-spread');
		assert.equal(slugify('5. Is it memorizing, and the verdict'), '5-is-it-memorizing-and-the-verdict');
		assert.equal(slugify('1. `seaborn` on an axes, and what `barplot` does with rows'), '1-seaborn-on-an-axes-and-what-barplot-does-with-rows');
	});

	test('headingIds skips code fences and numbers a repeated heading', () => {
		const ids = headingIds(['## The picture', '```', '# not a heading', '```', '### Check', '### Check']);
		assert.deepEqual([...ids], ['the-picture', 'check', 'check-1']);
	});
});

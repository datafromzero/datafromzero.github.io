// Stage cheatsheets (SPEC D44): every entry cites a published lesson of its stage, inside the part's code range, and
// the text rules hold. Reads the real lesson files, so a lesson that is unpublished or renamed fails here.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { codeRange, entriesOf, isFigure, sheetProblems } from '../src/lib/cheatsheet.ts';
import { sqlCheatsheet } from '../src/data/cheatsheets/sql.ts';
import { excelCheatsheet } from '../src/data/cheatsheets/excel.ts';
import { CHEATSHEETS } from '../src/lib/roadmap.ts';

function published(stage: string): Map<string, number> {
	const dir = `src/content/docs/${stage}`;
	const out = new Map<string, number>();
	for (const f of readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
		const fm = readFileSync(`${dir}/${f}`, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
		const order = fm.match(/^order: (\d+)/m)?.[1];
		if (/^status: published$/m.test(fm) && order) out.set(f.replace(/\.mdx?$/, ''), Number(order));
	}
	return out;
}

describe('SQL cheatsheet', () => {
	test('cites only published lessons inside each part, with well-formed text', () => {
		assert.deepEqual(sheetProblems(sqlCheatsheet, published('sql')), []);
	});
	test('the three parts follow D40 and every part has entries', () => {
		assert.deepEqual(sqlCheatsheet.parts.map((p) => codeRange(p.codes)), [[1, 17], [18, 30], [31, 35]]);
		for (const p of sqlCheatsheet.parts) assert.ok(p.items.some((i) => !isFigure(i)));
	});
	test('has the three drawings and a pattern for every part of the stage', () => {
		const figs = sqlCheatsheet.parts.flatMap((p) => p.items.filter(isFigure).map((f) => f.figure));
		assert.deepEqual(figs.sort(), ['joins', 'order', 'window']);
		assert.ok(entriesOf(sqlCheatsheet).length >= 30);
	});
	test('is registered for the sidebar and /start/', () => {
		assert.equal(CHEATSHEETS.sql.href, '/sql/cheatsheet/');
	});
});

describe('Excel cheatsheet', () => {
	const excel = published('excel');
	const sql = published('sql');
	const entries = entriesOf(excelCheatsheet);

	test('cites only published lessons, each part labeled with exactly the lessons it cites', () => {
		assert.deepEqual(sheetProblems(excelCheatsheet, excel, sql), []);
	});
	test('follows the data flow in six parts, each with cards', () => {
		assert.deepEqual(
			excelCheatsheet.parts.map((p) => p.id),
			['shape', 'clean', 'query', 'combine', 'repeat', 'communicate'],
		);
		for (const p of excelCheatsheet.parts) assert.ok(p.items.some((i) => !isFigure(i)), p.id);
	});
	test('every card has a pattern, a trap and a Next line with a SQL twin and a pandas twin', () => {
		for (const e of entries) {
			assert.ok(e.trap, `${e.lesson}: a trap`);
			assert.ok(e.next?.sql?.length, `${e.lesson}: a SQL twin`);
			assert.ok(e.next?.pandas, `${e.lesson}: a pandas twin`);
		}
	});
	test('cites every data-flow topic of the owner request, and has the three drawings', () => {
		const cited = new Set(entries.map((e) => e.lesson));
		for (const l of [
			'grid-and-tidy-layout', 'numbers-dates-text-types', 'tables-sort-filter', 'conditional-totals', 'xlookup', 'legacy-lookups',
			'pivottables-build', 'pivot-grouping-and-share', 'dynamic-arrays', 'cleaning-workflow', 'power-query-basics',
			'rules-and-validation', 'charts-that-tell-the-truth', 'sheets-query-bridge', 'ai-draft-and-verify',
		]) assert.ok(cited.has(l), l);
		const figs = excelCheatsheet.parts.flatMap((p) => p.items.filter(isFigure).map((f) => f.figure));
		assert.deepEqual(figs.sort(), ['lookup', 'pivot', 'tidy']);
	});
	test('every formula is the lesson\'s own text (whitespace aside)', () => {
		const norm = (t: string) => t.replace(/\\\$/g, '$').replace(/\s+/g, '');
		for (const e of entries) {
			const lesson = norm(readFileSync(`src/content/docs/excel/${e.lesson}.mdx`, 'utf8'));
			const units = e.code.split('\n').reduce<string[]>((acc, line) => {
				const open = (acc.at(-1) ?? '').split('(').length > (acc.at(-1) ?? '').split(')').length;
				if (line.trimStart().startsWith('=') && !open) acc.push(line);
				else if (open) acc[acc.length - 1] += line;
				return acc;
			}, []);
			for (const u of units) for (const part of norm(u).split('...')) assert.ok(!part || lesson.includes(part), `${e.lesson}: ${u.trim()}`);
		}
	});
	test('is registered for the sidebar and /start/', () => {
		assert.equal(CHEATSHEETS.excel.href, '/excel/cheatsheet/');
	});
});

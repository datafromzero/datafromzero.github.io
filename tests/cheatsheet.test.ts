// Stage cheatsheets (SPEC D44): every entry cites a published lesson of its stage, inside the part's code range, and
// the text rules hold. Reads the real lesson files, so a lesson that is unpublished or renamed fails here.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { codeRange, entriesOf, isFigure, sheetProblems } from '../src/lib/cheatsheet.ts';
import { sqlCheatsheet } from '../src/data/cheatsheets/sql.ts';
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

/**
 * Fixture tests: the valid set builds and passes the graph check; each invalid case fails with its
 * expected message. Cases with `via.txt` = `graph` run scripts/check-graph.ts, the rest run the build.
 * Slow (one site build per build case): run with `npm run test:fixtures`.
 */
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES, build, checkGraph, createSandbox, exists, read, removeSandbox, useDocs } from './lib/sandbox.mjs';

const valid = join(FIXTURES, 'valid');
let sandbox;
before(() => {
	sandbox = createSandbox();
});
after(() => removeSandbox(sandbox));

describe('valid fixtures', () => {
	test('graph check passes', () => {
		useDocs(sandbox, valid);
		const r = checkGraph(sandbox);
		assert.ok(r.ok, r.output);
		assert.match(r.output, /4 lessons, 2 reference/);
	});

	test('build passes and the footer lists what a lesson unlocks', () => {
		useDocs(sandbox, valid);
		const r = build(sandbox);
		assert.ok(r.ok, r.output);
		const page = (p) => read(join(sandbox, 'dist', p, 'index.html'));
		const basics = page('excel/excel-basics');
		assert.match(basics, /Unlocks next/);
		assert.match(basics, /href="\/excel\/excel-formulas\/"/);
		assert.ok(!page('sql/sql-joins').includes('Unlocks next'));
		assert.ok(exists(join(sandbox, 'dist', 'reference', 'sql', 'inner-join', 'index.html')));
		const joins = page('sql/sql-joins');
		assert.match(joins, /<math/); // formulas render as MathML
		assert.match(joins, /<math [^>]*display="block"/); // a $$ block is display math
		assert.match(joins, /<annotation encoding="application\/x-tex">r = \\frac\{m\}\{n\}/); // TeX source kept for readers
		assert.ok(!joins.includes('katex.min.css') && !joins.includes('KaTeX_')); // no KaTeX CSS or fonts
		// D51: a single $ is money, never math ("$3.50 or $5" keeps both signs as text).
		assert.match(joins, /costs \$3\.50 or \$5, and/);
		assert.equal((joins.match(/<math/g) ?? []).length, 3); // one inline and two display formulas, nothing from the dollar amounts
		// SPEC D44: the cheatsheet exists and its own content ships no script.
		const sheet = page('sql/cheatsheet');
		assert.match(sheet, /SQL in a nutshell/);
		const body = sheet.slice(sheet.indexOf('class="cs not-content"'), sheet.indexOf('cs-foot'));
		assert.ok(body.length > 1000 && !body.includes('<script'));
		assert.match(sheet, /<svg class="csf/);
		// The Excel cheatsheet (data first, with "Next" bridges) builds the same way and ships no script either.
		const excel = page('excel/cheatsheet');
		assert.match(excel, /Excel in a nutshell/);
		const excelBody = excel.slice(excel.indexOf('class="cs not-content"'), excel.indexOf('cs-foot'));
		assert.ok(excelBody.length > 1000 && !excelBody.includes('<script'));
		assert.equal((excelBody.match(/<svg class="csf/g) ?? []).length, 3);
		assert.match(excelBody, /class="cs-next"/);
	});
});

describe('invalid fixtures', () => {
	const cases = readdirSync(join(FIXTURES, 'invalid'), { withFileTypes: true }).filter((e) => e.isDirectory());
	for (const { name } of cases) {
		const dir = join(FIXTURES, 'invalid', name);
		const expected = read(join(dir, 'expect.txt')).trim();
		const via = read(join(dir, 'via.txt')).trim();
		test(`${name} fails (${via}) with "${expected}"`, () => {
			useDocs(sandbox, valid, dir);
			const r = via === 'graph' ? checkGraph(sandbox) : build(sandbox);
			assert.equal(r.ok, false, `expected a failure but it passed:\n${r.output}`);
			assert.ok(r.output.includes(expected), `expected message fragment not found: ${expected}\n---\n${r.output}`);
		});
	}
});

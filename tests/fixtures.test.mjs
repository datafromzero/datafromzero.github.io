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
		assert.match(joins, /rate is <span class="katex"><math xmlns="[^"]+"><semantics>/); // inline $$…$$: no display attribute
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

	// SPEC D59: code is never machine-translated. Block code, inline code, kbd and the SQL runner carry translate="no";
	// prose and Term links do not.
	test('code carries translate="no" and prose does not', () => {
		useDocs(sandbox, valid);
		const r = build(sandbox);
		assert.ok(r.ok, r.output);
		const html = read(join(sandbox, 'dist', 'sql', 'sql-joins', 'index.html'));
		assert.match(html, /<figure class="frame[^"]*"[^>]*translate="no"/); // a fenced block (Expressive Code frame)
		assert.match(html, /<code[^>]*translate="no"[^>]*>ON o\.customer_id/); // inline code
		assert.match(html, /<kbd[^>]*translate="no"[^>]*>Ctrl<\/kbd>/);
		assert.match(html, /<textarea translate="no"/); // the RunSQL editor
		assert.match(html, /class="dfz-sql-out"[^>]*translate="no"/); // its output box, where column names appear
		assert.match(html, /<p>A join combines rows/); // prose is not marked
		assert.doesNotMatch(html, /<a class="term"[^>]*translate=/); // nor is the Term link
		// Every pre, code, kbd and samp on every built page is marked, itself or through an ancestor (the attribute is inherited).
		const unmarked = [];
		const check = (file) => {
			const raw = read(file);
			if (raw.includes('http-equiv="refresh"')) return; // Astro's own redirect stubs (the old /vi/ URLs)
			const page = raw.replace(/<(script|style)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->/g, '');
			const marks = []; // open elements that carry translate="no": { tag, depth of same-tag nesting }
			for (const m of page.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b([^>]*)>/g)) {
				const [, close, tag, attrs] = m;
				const top = marks.at(-1);
				if (close) {
					if (top && top.tag === tag && --top.depth === 0) marks.pop();
					continue;
				}
				const marked = /\btranslate="no"/.test(attrs);
				if (/^(pre|code|kbd|samp)$/.test(tag) && !marked && !marks.length) unmarked.push(`${file.slice(sandbox.length)}: <${tag}${attrs}>`);
				if (top && top.tag === tag) top.depth++;
				else if (marked) marks.push({ tag, depth: 1 });
			}
		};
		const walk = (dir) => {
			for (const e of readdirSync(dir, { withFileTypes: true })) {
				const f = join(dir, e.name);
				if (e.isDirectory()) walk(f);
				else if (e.name.endsWith('.html')) check(f);
			}
		};
		walk(join(sandbox, 'dist'));
		assert.deepEqual(unmarked, []);
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

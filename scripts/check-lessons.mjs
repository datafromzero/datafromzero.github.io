/**
 * `npm run check:lessons`: catches lesson mistakes the team has made before (.claude/MISTAKES.md), so a rule that
 * was broken once fails the build instead of waiting for a reviewer. Checks every lesson in the stage folders:
 *   - British spellings (American English only, D30)
 *   - first-person research notes or process notes outside a TODO(owner) paragraph
 *   - a bare `$` inside an inline SVG (use &#36;)
 *   - `datasets:` naming a folder that does not exist in datasets/
 *   - a placeholder line left in a written lesson (`XX`, `TBD`, `TODO` outside a TODO(owner) note)
 *   - a source that points at this repository's GitHub issues (learners need primary sources, owner rule 2026-11-20)
 *   - a published lesson whose name in the sidebar (short_title, else title) too wide for one line (D47; measured glyph widths)
 *   - a warm-up that does not open with the standard line, or a warm-up question that names an earlier lesson (a code such as
 *     S18, or "(chapter 3)") without a link to it (D66; scripts/lib/warmup-links.mjs)
 *   - a `<Term>` with an unknown glossary id, in a heading, code, figure, details, exercise, warm-up or answer, used twice for the same
 *     word in one lesson, or more than six times in a lesson (D68; scripts/lib/term-rules.mjs)
 * Code spans, fenced code and SVG text (which shows data values as they are) are ignored for the spelling check.
 * Lessons that are still unwritten stubs are skipped: their planned datasets may not exist yet.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lessonCode } from '../src/lib/roadmap.ts';
import { headingIds, warmupExempt, warmupProblems } from './lib/warmup-links.mjs';
import { termProblems } from './lib/term-rules.mjs';

const STAGES = ['excel', 'sql', 'python', 'core', 'data-analyst', 'data-engineer', 'data-scientist', 'ml-engineer'];
const DOCS = 'src/content/docs';
// Advance widths in px of Geist at 14 px, the sidebar label font, measured in Chromium (2026-11-24); other characters 8.5.
const GLYPH_PX = {"0":9.28,"1":5.38,"2":8.67,"3":8.58,"4":8.61,"5":8.76,"6":8.3,"7":7.34,"8":8.46,"9":8.3," ":3.5,"!":2.98,"\"":4.84,"#":6.69,"$":8.81,"%":11.23,"&":8.68,"'":2.49,"(":3.84,")":3.84,"*":6.02,"+":7.81,",":2.81,"-":5.87,".":2.81,"/":6.72,":":4.16,";":4.16,"<":7.62,"=":7.56,">":7.62,"?":7.83,"@":12.68,"A":9.35,"B":9.52,"C":9.84,"D":9.72,"E":8.44,"F":8.26,"G":9.8,"H":9.98,"I":3.78,"J":8.36,"K":8.96,"L":8.12,"M":12.28,"N":10.4,"O":10.35,"P":9.1,"Q":10.26,"R":9.41,"S":8.96,"T":7.73,"U":9.65,"V":9.34,"W":13.23,"X":8.48,"Y":8.06,"Z":7.62,"[":4.86,"\\":6.37,"]":4.86,"^":5.96,"_":7.8,"`":3.47,"a":7.71,"b":8.33,"c":7.64,"d":8.33,"e":7.85,"f":5.53,"g":8.32,"h":8.13,"i":3.42,"j":3.64,"k":8.26,"l":3.74,"m":12.28,"n":8.13,"o":8.02,"p":8.33,"q":8.33,"r":5.31,"s":7.28,"t":5.49,"u":8.05,"v":7.5,"w":11.47,"x":8.19,"y":7.52,"z":7.52,"{":5.45,"|":3.7,"}":5.45,"~":7.32};
const SIDEBAR_LINE_PX = 185;

const BRITISH = /\b(grey(ed|s)?|colour(s|ed|ful)?|favour(s|ite)?|behaviour(s)?|centre(s|d)?|licence|cancelled|cancelling|organis(e|ed|es|ing|ation)|analys(e|ed|es|ing)|summaris(e|ed|es|ing)|recognis(e|ed|es|ing)|optimis(e|ed|es|ing))\b/i;
const FIRST_PERSON = /\bI (could not|couldn't|did not|didn't|was not able|wasn't able|have not|haven't) (find|verify|run|test|open|confirm|check)\b|\bchecked as SQL\b/i;

// The published lessons by code and by URL, with the titles they go by and their heading ids: the warm-up check needs them (D66).
// A draft has no page yet, so it cannot be linked.
const index = { byCode: {}, byUrl: {} };
for (const stage of STAGES) {
	const dir = join(DOCS, stage);
	if (!existsSync(dir)) continue;
	for (const name of readdirSync(dir)) {
		if (!/\.mdx?$/.test(name)) continue;
		const text = readFileSync(join(dir, name), 'utf8');
		const fm = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
		const order = Number(fm.match(/^order:\s*(\d+)\s*$/m)?.[1]);
		const code = Number.isNaN(order) ? undefined : lessonCode(stage, order);
		if (!code || /^status:\s*draft\s*$/m.test(fm)) continue;
		const field = (key) => {
			const v = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
			if (v === undefined) return undefined;
			return /^'.*'$/.test(v) ? v.slice(1, -1).replace(/''/g, "'") : /^".*"$/.test(v) ? v.slice(1, -1) : v;
		};
		const url = `/${stage}/${name.replace(/\.mdx?$/, '')}/`;
		const info = { code, url, title: field('title'), short: field('short_title'), ids: headingIds(text.slice(fm.length + 8).split('\n')) };
		index.byCode[code] = info;
		index.byUrl[url] = info;
	}
}
const notTaught = [];
// The glossary ids a `<Term>` may name (D68): the `id` of every entry file in the glossary folder.
const glossaryIds = new Set();
for (const name of existsSync(join(DOCS, 'reference', 'glossary')) ? readdirSync(join(DOCS, 'reference', 'glossary')) : []) {
	if (name === 'index.md' || !name.endsWith('.md')) continue;
	const id = readFileSync(join(DOCS, 'reference', 'glossary', name), 'utf8').match(/^id:\s*(\S+)\s*$/m)?.[1];
	if (id) glossaryIds.add(id);
}

const problems = [];
const report = (file, line, msg) => problems.push(`${file}:${line}: ${msg}`);

for (const stage of STAGES) {
	const dir = join(DOCS, stage);
	if (!existsSync(dir)) continue;
	for (const name of readdirSync(dir)) {
		if (!/\.mdx?$/.test(name)) continue;
		const file = join(dir, name);
		const text = readFileSync(file, 'utf8');
		if (text.includes('Draft: the owner writes this section.')) continue; // unwritten stub
		const lines = text.split('\n');

		const fm = text.match(/^---\n([\s\S]*?)\n---/);
		if (fm) {
			if (/url:\s*https:\/\/github\.com\/datafromzero\/datafromzero\.github\.io\/issues\//.test(fm[1]))
				report(file, 1, 'a source cites a GitHub issue of this site; cite the primary source instead (owner rule, 2026-11-20)');
			// The sidebar label is Geist 14px. With the 20rem sidebar a line holds at least 182.9 px of text (measured 2026-11-24;
			// summed advance widths run about 2 percent over the kerned width, so the limit is 185). Widths: Geist at 14 px (D47).
			const width = (t) => [...t].reduce((w, c) => w + (GLYPH_PX[c] ?? 8.5), 0);
			const unquote = (t) => (t ?? '').trim().replace(/^(['"])(.*)\1$/, '$2');
			const title = unquote(fm[1].match(/^title:\s*(.+)$/m)?.[1]);
			const short = fm[1].match(/^short_title:\s*(.+)$/m)?.[1];
			if (/^status:\s*published\s*$/m.test(fm[1])) {
				const shown = short ? unquote(short) : title;
				if (width(shown) > SIDEBAR_LINE_PX)
					report(file, 1, `"${shown}" does not fit one sidebar line: ${short ? 'shorten the short_title' : 'add a short_title of at most 24 characters'} (D47; ${width(shown).toFixed(0)} px, a line holds ${SIDEBAR_LINE_PX})`);
			}
			const block = fm[1].match(/^datasets:\s*\n((?:\s+-\s+.+\n?)+)/m);
			const inline = fm[1].match(/^datasets:\s*\[(.*)\]/m);
			const names = block
				? [...block[1].matchAll(/-\s+(.+)/g)].map((m) => m[1].trim())
				: inline
					? inline[1].split(',').map((s) => s.trim()).filter(Boolean)
					: [];
			for (const d of names) {
				if (!existsSync(join('datasets', d))) report(file, 1, `datasets names "${d}", but datasets/${d}/ does not exist`);
			}
		}

		for (const p of warmupProblems(lines, stage, index)) report(file, p.line, p.msg);
		for (const e of warmupExempt(lines)) notTaught.push(`${file}:${e.line}`);
		for (const p of termProblems(lines, glossaryIds)) report(file, p.line, p.msg);

		let inFence = false;
		let inSvg = false;
		let inMath = false; // a $$ display block (SPEC D51): TeX source is not prose
		let inTodo = false;
		lines.forEach((raw, i) => {
			const n = i + 1;
			if (/^\s*```/.test(raw)) {
				inFence = !inFence;
				return;
			}
			if (inFence) return;
			if (/^\s*\$\$\s*$/.test(raw)) {
				inMath = !inMath;
				return;
			}
			if (inMath) return;
			if (/<svg\b/.test(raw)) inSvg = true;
			if (inSvg && /\$/.test(raw.replace(/\\\$/g, ''))) report(file, n, 'bare $ inside an SVG; write &#36;');
			if (/<\/svg>/.test(raw)) inSvg = false;

			// A TODO(owner) paragraph runs until the next blank line.
			if (/TODO\(owner\)/.test(raw)) inTodo = true;
			if (raw.trim() === '') inTodo = false;

			const prose = raw.replace(/`[^`]*`/g, '').replace(/\$\$.*?\$\$/g, '');
			if (!inSvg && /^\s*(XX+|TBD)\s*$/i.test(raw)) report(file, n, `placeholder line "${raw.trim()}"; finish the text`);
			if (!inSvg && !inTodo && /\bTODO\b(?!\(owner\))/.test(prose)) report(file, n, 'TODO outside a TODO(owner) note; finish the text or write TODO(owner)');
			const m = !inSvg && prose.match(BRITISH);
			if (m) report(file, n, `British spelling "${m[0]}"; use American English`);
			if (!inTodo && FIRST_PERSON.test(prose)) report(file, n, 'first-person or process note in learner text; move it to TODO(owner)');
		});
	}
}

if (problems.length) {
	console.error(`Lesson checks failed (rules in .claude/MISTAKES.md):\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log('Lesson checks passed.');
if (notTaught.length) console.log(`Warm-up questions marked "not taught earlier" (${notTaught.length}; SPEC D66, no earlier lesson teaches them):\n${notTaught.map((n) => `  - ${n}`).join('\n')}`);

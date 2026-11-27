/**
 * Guard: every lesson figure is centered in its viewBox and nothing is cut off (MISTAKES.md, "a figure's content extent must be
 * centered in its viewBox"). Deterministic, no browser: it builds every spec in scripts/animations/ and measures the finished
 * markup with scripts/lib/figure-extent.mjs (the union of everything drawn across all steps against the middle of the viewBox),
 * then does the same for every figure pasted into any stage folder.
 *   node scripts/check-figure-centering.mjs
 * Part of `npm run check`. Tolerance: 3 px of viewBox (the generator rounds the shift to a whole pixel; text widths are estimates).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { figureCentering } from './lib/figure-extent.mjs';

const root = new URL('../', import.meta.url);
const maker = new URL('scripts/make-animation.mjs', root).pathname;
const TOL = 3;
const names = execFileSync('node', [maker, '--list'], { encoding: 'utf8' }).split('\n').filter((n) => n.startsWith('concept-') || n.startsWith('sql-') || n.startsWith('step-'));
const keys = names.flatMap((n) => (n === 'concept-join' ? ['inner', 'left', 'right', 'full', 'cross', 'all'].map((v) => `${n}:${v}`) : [n]));

const bad = [];
const judge = (where, markup) => {
	const r = figureCentering(markup);
	if (!r) return bad.push(`${where}: no viewBox or nothing drawn`);
	const span = `drawn ${r.min.toFixed(0)} to ${r.max.toFixed(0)}, viewBox ${r.left} to ${r.left + r.width}`;
	if (Math.abs(r.offset) > TOL) bad.push(`${where}: content is ${r.offset.toFixed(1)} px off the middle of its viewBox (${span})`);
	if (r.clipped) bad.push(`${where}: the drawing runs past its viewBox (${span})`);
};

for (const k of keys) {
	try {
		judge(`spec ${k}`, execFileSync('node', [maker, k], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
	} catch (e) {
		bad.push(`spec ${k}: ${String(e.stderr).match(/Error: .*/)?.[0] ?? e.message}`);
	}
}
let embedded = 0;
for (const d of ['excel', 'sql', 'python', 'core', 'data-analyst', 'data-engineer', 'data-scientist', 'ml-engineer']) {
	const dir = new URL(`src/content/docs/${d}/`, root);
	for (const f of readdirSync(dir).filter((x) => x.endsWith('.mdx'))) {
		for (const m of readFileSync(new URL(f, dir), 'utf8').matchAll(/<figure class="(?:ca )?sa[^"]*">[\s\S]*?<\/figure>/g)) {
			embedded++;
			judge(`${d}/${f} figure ${m[0].match(/<title id="([^"]+)"/)?.[1] ?? '?'}`, m[0]);
		}
	}
}
console.log(`${keys.length} specs and ${embedded} embedded figures measured; ${bad.length} problem(s)`);
for (const b of bad) console.log(`  ${b}`);
process.exit(bad.length ? 1 : 0);

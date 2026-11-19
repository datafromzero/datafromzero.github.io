/**
 * Re-pastes every concept figure in the lessons from the current generators (SPEC D41), so a change to a spec or to
 * scripts/lib/step-animation.mjs reaches the lessons. Safe to repeat.
 *   node scripts/refresh-concept-figures.mjs          rewrite src/content/docs/sql/*.mdx
 *   node scripts/refresh-concept-figures.mjs --check  change nothing; exit 1 if a lesson is out of date
 * A "CONCEPT: <key>" MDX comment line becomes the generator's markup. A `<figure class="ca ...">` is found by the id of its
 * pause checkbox (`id="<id>-pp"`), matched to the key whose generated figure has that id, and replaced up to its `</figure>`.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const lessons = new URL('src/content/docs/sql/', root);
const maker = new URL('scripts/make-animation.mjs', root).pathname;
const check = process.argv.includes('--check');

const gen = (key) => execFileSync('node', [maker, key], { encoding: 'utf8' }).replace(/\n$/, '');
const names = execFileSync('node', [maker, '--list'], { encoding: 'utf8' }).split('\n').filter((n) => n.startsWith('concept-'));
const keys = names.flatMap((n) => (n === 'concept-join' ? ['inner', 'left', 'right', 'full', 'cross', 'all'].map((v) => `${n}:${v}`) : [n]));
const cache = new Map();
const markup = (key) => (cache.has(key) ? cache.get(key) : cache.set(key, gen(key)).get(key));
const idOf = (m) => m.match(/id="([a-z0-9-]+)-pp"/)?.[1];
const keyById = new Map(keys.map((k) => [idOf(markup(k)), k]));

let stale = 0;
let figures = 0;
let markers = 0;
for (const f of readdirSync(lessons).filter((x) => x.endsWith('.mdx'))) {
	const file = new URL(f, lessons);
	const src = readFileSync(file, 'utf8');
	let out = src.replace(/^\{\/\* CONCEPT: ([a-z:-]+) \*\/\}$/gm, (_, key) => {
		if (!keys.includes(key)) throw new Error(`${f}: unknown concept key "${key}"`);
		markers++;
		return markup(key);
	});
	out = out.replace(/<figure class="ca[^"]*">\n<input class="ca-pp"[^\n]*? id="([a-z0-9-]+)-pp"[\s\S]*?<\/figure>/g, (old, id) => {
		const key = keyById.get(id);
		if (!key) return old; // a stepper figure (a sql-*.mjs spec), not a concept animation
		figures++;
		return markup(key);
	});
	if (out !== src) {
		stale++;
		if (!check) writeFileSync(file, out);
	}
}
console.log(`${markers} markers, ${figures} figures checked; ${stale} lesson(s) ${check ? 'out of date' : 'rewritten'}`);
if (check && stale) process.exit(1);

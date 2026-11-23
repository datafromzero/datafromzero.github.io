/**
 * Re-pastes every concept figure and every data stepper in the lessons from the current generators (SPEC D41), so a change to a spec
 * or to scripts/lib/step-animation.mjs reaches the lessons. Safe to repeat.
 *   node scripts/refresh-concept-figures.mjs          rewrite src/content/docs/sql/*.mdx and src/content/docs/core/*.mdx
 *   node scripts/refresh-concept-figures.mjs --check  change nothing; exit 1 if a lesson is out of date
 * A "CONCEPT: <key>" MDX comment line becomes the generator's markup. A `<figure class="ca ...">` is found by the id of its
 * pause checkbox (`id="<id>-pp"`), matched to the key whose generated figure has that id, and replaced up to its `</figure>`.
 * A data stepper (`<figure class="sa not-content">`, a `sql-*.mjs` spec) is found by the `name` of its radios the same way.
 * A hand-drawn static figure (`<figure class="sa not-content">` straight into its `<svg>`, no spec) keeps its drawing; only its viewBox
 * is set so that the drawing is centered (scripts/lib/figure-extent.mjs).
 * Several specs share an id (cs: concept-case and concept-columnar-scan; ij: concept-injection and sql-inner-join; rt:
 * concept-rank-ties and concept-retry), so an id alone is ambiguous. The figure's `<title>` text tells them apart; matching on
 * the id alone let the last spec with an id overwrite the figures of the others (case-expressions, rank-top-n). An id that
 * two specs share, with a title that does not identify one of them, stops the run instead of guessing.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { centeredViewX } from './lib/figure-extent.mjs';

const root = new URL('../', import.meta.url);
const lessonDirs = ['sql', 'core'].map((d) => new URL(`src/content/docs/${d}/`, root)); // core: the Statistics I concept animations (D49)
const maker = new URL('scripts/make-animation.mjs', root).pathname;
const check = process.argv.includes('--check');

const gen = (key) => execFileSync('node', [maker, key], { encoding: 'utf8' }).replace(/\n$/, '');
const names = execFileSync('node', [maker, '--list'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const keys = names.filter((n) => n.startsWith('concept-')).flatMap((n) => (n === 'concept-join' ? ['inner', 'left', 'right', 'full', 'cross', 'all'].map((v) => `${n}:${v}`) : [n]));
const cache = new Map();
const markup = (key) => (cache.has(key) ? cache.get(key) : cache.set(key, gen(key)).get(key));
const idOf = (m) => m.match(/id="([a-z0-9-]+)-pp"/)?.[1];
const titleOf = (m) => m.match(/<title id="[^"]*">([^<]*)<\/title>/)?.[1];
/** The spec of an old figure: by id, and by its title when several specs use the id. */
const pick = (candidates, old, f, what) => {
	if (candidates.length === 1) return candidates[0][1];
	const hit = candidates.filter(([, k]) => titleOf(markup(k)) === titleOf(old));
	if (hit.length !== 1) throw new Error(`${f}: ${what} is shared by ${candidates.map((c) => c[1]).join(', ')} and its title "${titleOf(old)}" matches ${hit.length}; give one spec a new id`);
	return hit[0][1];
};
const conceptSpecs = keys.map((k) => [idOf(markup(k)), k]);
const steppers = names.filter((n) => n.startsWith('sql-'));
const nameOf = (m) => m.match(/<input class="sa-r r1" type="radio" name="([a-z0-9-]+)"/)?.[1];
const stepperSpecs = steppers.map((k) => [nameOf(markup(k)), k]);

let stale = 0;
let figures = 0;
let stepperCount = 0;
let markers = 0;
for (const { lessons, f } of lessonDirs.flatMap((lessons) => readdirSync(lessons).filter((x) => x.endsWith('.mdx')).map((f) => ({ lessons, f })))) {
	const file = new URL(f, lessons);
	const src = readFileSync(file, 'utf8');
	let out = src.replace(/^\{\/\* CONCEPT: ([a-z:-]+) \*\/\}$/gm, (_, key) => {
		if (!keys.includes(key)) throw new Error(`${f}: unknown concept key "${key}"`);
		markers++;
		return markup(key);
	});
	out = out.replace(/<figure class="ca[^"]*">\n<input class="ca-pp"[^\n]*? id="([a-z0-9-]+)-pp"[\s\S]*?<\/figure>/g, (old, id) => {
		const same = conceptSpecs.filter(([i]) => i === id);
		if (!same.length) return old; // a stepper figure (a sql-*.mjs spec), not a concept animation
		const key = pick(same, old, f, `the figure id "${id}"`);
		figures++;
		return markup(key);
	});
	out = out.replace(/<figure class="sa not-content">\n<input class="sa-r r1" type="radio" name="([a-z0-9-]+)"[\s\S]*?<\/figure>/g, (old, name) => {
		const same = stepperSpecs.filter(([n]) => n === name);
		if (!same.length) throw new Error(`${f}: a data stepper named "${name}" has no spec in scripts/animations/`);
		const key = pick(same, old, f, `the stepper name "${name}"`);
		stepperCount++;
		return markup(key);
	});
	// a hand-drawn static figure (no spec): only its viewBox is set, so the drawing is centered like a generated one
	out = out.replace(/(<figure class="sa not-content">\n<svg class="sa-svg" viewBox=")-?[\d.]+( 0 (\d+) \d+"[\s\S]*?<\/desc>)([\s\S]*?)(<\/svg>)/g, (_, a, b, w, body, c) => `${a}${centeredViewX(body, Number(w))}${b}${body}${c}`);
	const ids = [...out.matchAll(/ id="([a-z0-9-]+)"/g)].map((m) => m[1]);
	const twice = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
	if (twice.length) throw new Error(`${f}: element id(s) used twice on one page: ${twice.join(', ')}`);
	if (out !== src) {
		stale++;
		if (!check) writeFileSync(file, out);
	}
}
console.log(`${markers} markers, ${figures} concept figures and ${stepperCount} steppers checked; ${stale} lesson(s) ${check ? 'out of date' : 'rewritten'}`);
if (check && stale) process.exit(1);

/**
 * Prints the markup of a lesson step animation (SPEC D41, .claude/agents/LESSON-STANDARD.md).
 *   node scripts/make-animation.mjs <name>          print the <figure> markup to paste into the lesson
 *   node scripts/make-animation.mjs <name> --stats  also print its size and length (on stderr)
 *   node scripts/make-animation.mjs --list
 * A spec is scripts/animations/<name>.mjs and default-exports `() => anim(...)` (see scripts/lib/step-animation.mjs).
 */
import { readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const dir = new URL('./animations/', import.meta.url);
const names = readdirSync(dir)
	.filter((f) => f.endsWith('.mjs'))
	.map((f) => f.slice(0, -4));
const [name, flag] = process.argv.slice(2);
if (!name || name === '--list') {
	console.log(names.join('\n'));
	process.exit(name ? 0 : 1);
}
if (!names.includes(name)) {
	console.error(`No spec "${name}". Specs: ${names.join(', ')}`);
	process.exit(1);
}
const { default: make } = await import(new URL(`${name}.mjs`, dir));
const { markup, seconds } = make().build();
console.log(markup);
if (flag === '--stats') {
	console.error(`${markup.length} bytes (${gzipSync(markup).length} gzipped), about ${seconds.toFixed(1)} s`);
}

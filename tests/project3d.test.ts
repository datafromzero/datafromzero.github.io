// The 3D lesson figures (SPEC D41) draw with the projection of the homepage career figures, run at build time. The formula lives in two places
// (the canvas figure in src/scripts/home/careers-figures.ts and scripts/lib/project3d.mjs), so this test runs the homepage's own `P` and compares.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { camera, boxFaces } from '../scripts/lib/project3d.mjs';
import blk from '../scripts/animations/concept-table-block.mjs';
import emb from '../scripts/animations/concept-embedding-space.mjs';
import reg from '../scripts/animations/concept-loss-bowl.mjs';

const src = readFileSync(new URL('../src/scripts/home/careers-figures.ts', import.meta.url), 'utf8');
const body = src.match(/const P = \(x: number, y: number, z: number, a: number, tilt: number\): Pt => \{([\s\S]*?)\n\t\};/)?.[1];

test('the homepage projection is found in careers-figures.ts', () => {
	assert.ok(body, 'the `const P = (x, y, z, a, tilt) => { ... }` of careers-figures.ts moved or changed shape: update this test and scripts/lib/project3d.mjs together');
	assert.match(body, /3\.2 \/ \(Z \+ 4\.2\)/);
});

test('camera().P matches the homepage P for the same angle, tilt and canvas', () => {
	const homepage = new Function('W', 'H', 'x', 'y', 'z', 'a', 'tilt', body!.replace(/: number/g, '') + '');
	const run = (W: number, H: number, x: number, y: number, z: number, a: number, tilt: number) => homepage(W, H, x, y, z, a, tilt) as number[];
	for (const [a, tilt] of [[0, 0], [0.5, 0.42], [-0.55, 0.38], [1.2, -0.3]]) {
		const W = 360;
		const H = 300;
		const s = Math.min(W, H) * 0.5;
		const cam = camera({ a, tilt, s, cx: W / 2, cy: H / 2 });
		for (const [x, y, z] of [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [0.3, -0.7, 0.9], [-1, 0.5, -0.4]]) {
			const [hx, hy, hf] = run(W, H, x, y, z, a, tilt);
			const [px, py, , pf] = cam.P(x, y, z);
			assert.ok(Math.abs(hx - px) < 1e-9 && Math.abs(hy - py) < 1e-9 && Math.abs(hf - pf) < 1e-9, `${[a, tilt, x, y, z]}: homepage ${[hx, hy, hf]}, figure ${[px, py, pf]}`);
		}
	}
});

test('a box shows the faces that turn toward the eye', () => {
	const cam = camera({ a: -0.55, tilt: 0.38, s: 100 });
	const names = boxFaces(cam, { x: -1, y: -1, z: -1, w: 2, h: 2, d: 2 }).map((f) => f.name).sort();
	assert.deepEqual(names, ['front', 'right', 'top']); // seen from the right and above, with y pointing down
	const none = camera({ a: 0, tilt: 0 });
	assert.deepEqual(boxFaces(none, { x: -1, y: -1, z: -1, w: 2, h: 2, d: 2 }).map((f) => f.name), ['front']);
});

test('the three 3D figures are plain markup of about 15 KB or less, with no script, style or filter, and a title and description', () => {
	for (const [name, make] of [['concept-table-block', blk], ['concept-embedding-space', emb], ['concept-loss-bowl', reg]] as const) {
		const m = make().build().markup as string;
		assert.ok(m.length < 15000, `${name}: ${m.length} bytes`);
		assert.doesNotMatch(m, /<script|<style|style="|<filter|<image|<foreignObject/);
		assert.match(m, /<title id="[^"]+">[^<]+<\/title>\n<desc id="[^"]+">[^<]+<\/desc>/);
		assert.match(m, /<input class="ca-pp" type="checkbox"/); // the Pause / Play button of D41
		assert.match(m, /class="sa-now"/); // a Key idea for every step
	}
});

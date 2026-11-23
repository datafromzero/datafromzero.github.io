// Figure centering (MISTAKES.md, "a figure's content extent must be centered in its viewBox"): the generator shifts the viewBox so the
// middle of everything a figure draws, across all steps, is the middle of the viewBox; scripts/check-figure-centering.mjs re-measures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anim } from '../scripts/lib/step-animation.mjs';
import { contentExtent, figureCentering, pathXs, textWidth } from '../scripts/lib/figure-extent.mjs';

const stepper = (draw: (a: ReturnType<typeof anim>) => void) => {
	const a = anim({ id: 't', h: 40, title: 't', desc: 'd', steps: [{ role: 'src', clause: 'A', text: 'a' }, { role: 'src', clause: 'B', text: 'b' }] });
	draw(a);
	return a.build().markup;
};

test('a drawing that uses the left part of its canvas is centered by the viewBox, not by the drawing', () => {
	const m = stepper((a) => a.rect(10, 10, 200, 20, 'bx'));
	assert.match(m, /viewBox="-70 0 360 40"/); // 10 to 210 has its middle at 110, the canvas middle is 180
	const r = figureCentering(m)!;
	assert.ok(Math.abs(r.offset) <= 0.5);
});

test('a part that only appears in a later step still counts (an empty result column in step 1 does not pull the drawing left)', () => {
	const m = stepper((a) => {
		a.rect(10, 10, 100, 20, 'bx');
		a.rect(250, 10, 100, 20, 'bx', { in: 2 });
	});
	assert.match(m, /viewBox="0 0 360 40"/); // 10 to 350
});

test('a figure that is off-center fails the check (the old fixed viewBox 0 0 360)', () => {
	const old = stepper((a) => a.rect(10, 10, 200, 20, 'bx')).replace('viewBox="-70 0', 'viewBox="0 0');
	assert.ok(Math.abs(figureCentering(old)!.offset) > 50);
});

test('a part that slides is measured where it is while it is on, and one that leaves the picture does not count', () => {
	const body =
		'<g class="w8"><g class="mv m2 x23 y0"><rect x="10" y="0" width="50" height="10" /></g></g>' + // slides 230 px right, off a 360 px canvas
		'<rect x="10" y="20" width="60" height="10" />';
	assert.deepEqual(contentExtent(body, { loop: true, clip: { left: 0, right: 360 } }), { min: 10, max: 290 });
	assert.deepEqual(contentExtent(body, { loop: true }), { min: 10, max: 290 }); // 10 + 50 + 230 = 290: it ends inside the canvas
});

test('a part is on from its delay for its length, whichever order the classes come in', () => {
	const body = '<rect class="w1 d3" x="100" y="0" width="10" height="10" /><g class="mv m1 x30 y0"><rect class="w2 d6" x="0" y="0" width="10" height="10" /></g>';
	// the second rect is on from phase 6, when its slide (phase 1) is long done: it is at x = 300
	assert.deepEqual(contentExtent(body, { loop: true }), { min: 100, max: 310 });
});

test('text width tracks the real font within a few pixels per label; paths include arc extremes', () => {
	assert.ok(Math.abs(textWidth('f11 b', 'order_items: 7 lines') - 105) < 12);
	assert.equal(textWidth('f10 mo', 'abcd'), 24);
	const xs = pathXs('M100 0A50 50 0 0 0 100 100'); // a left half circle bulges to x = 50
	assert.ok(Math.min(...xs) < 51);
});

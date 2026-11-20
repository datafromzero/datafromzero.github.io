// Concept animation (SPEC D41, no real data) for confidence intervals (core lesson C7). Metaphor: a 95 percent interval is a recipe, and you judge a recipe
// by running it many times. One vertical ochre line is the true value (in real work it is unknown); each row is one sample's interval, a blue bar with a blue dot
// for its estimate. The offsets and widths are invented for the picture; the geometry asserts that exactly 1 of the 20 intervals misses the line.
// 8 s loop of 8 phases: 1 one interval; 2 three more; 3 six more; 4 and 5 ten more (20 in all); 6 the interval that misses the line turns red and is
// labeled; 7 a count, 19 of 20 cross, which is what a 95 percent recipe promises in the long run; 8 holds.
// Colors by meaning, the same in C5 to C7: ochre = the true value, blue = a sample's estimate and interval, red = a miss.
import { anim, tint } from '../lib/step-animation.mjs';

const TRUE_X = 180;
const OFFSETS = [8, -14, 22, -6, 16, -24, -62, 4, -18, 26, -2, 12, -24, 20, -10, 30, -4, 14, -22, 6];
const HALF = [30, 34, 28, 32, 30, 26, 28, 34, 30, 30, 32, 30, 26, 32, 34, 34, 30, 32, 28, 30];
const MISSES = OFFSETS.map((o, i) => Math.abs(o) > HALF[i]);
if (MISSES.filter(Boolean).length !== 1) throw new Error('concept-coverage: exactly one interval must miss the true value');
const PHASE_OF = (i) => (i === 0 ? 1 : i < 4 ? 2 : i < 10 ? 3 : i < 15 ? 4 : 5);
const Y = (i) => 52 + 9 * i;

export default function make({ id = 'cov' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'Twenty 95 percent intervals from twenty samples, and the true value',
		desc:
			'Twenty horizontal blue bars, one above the other, each the interval from one sample with a blue dot at its estimate. A vertical ochre line marks the true value. Nineteen of the intervals cross the line; one lies to its left, is drawn in red and is labeled miss. A note counts 19 of 20 crossing.',
		caption: 'A 95 percent interval is a recipe. Run it on many samples and about 95 in every 100 intervals cross the true value; any single interval either does or does not.',
		phases: [
			[1, 'One sample, one interval', { role: 'src', key: 'A sample gives an estimate, and the interval around it is the estimate plus and minus a margin.', changes: [['+', '1 interval']] }],
			[2, 'Another sample, another interval', { role: 'src', key: 'A new sample gives a new estimate and a new interval, in a different place.', changes: [['+', '3 more intervals']] }],
			[3, 'Repeat: 20 samples in all', { role: 'grp', key: 'Run the same recipe on sample after sample and the intervals stack up.', changes: [['+', '16 more intervals']] }],
			[6, 'Most cross the true value', { role: 'flt', key: 'Most intervals cross the true value; an interval that does not is a miss.', changes: [['~', '1 interval turns red']] }],
			[7, '95% is the long-run share that cross', { role: 'out', key: 'The 95 percent describes the recipe, the share that cross in the long run, not one interval.', changes: [['+', '19 of 20 cross']] }],
		],
		counters: [
			{ label: 'samples', role: 'src', values: [[1, 1], [2, 4], [3, 10], [4, 15], [5, 20]] },
			{ label: 'cross', role: 'out', values: [[6, 19], [7, '19 of 20']] },
			{ label: 'miss', role: 'flt', values: [[6, 1]] },
		],
	});
	a.text(10, 14, 'Judge the recipe by repeating it', 'f11 b');
	a.path(`M${TRUE_X} 44V${Y(19) + 10}`, 's-out');
	a.text(TRUE_X, 246, 'the true value', 'f10 b', undefined, 'm');
	OFFSETS.forEach((o, i) => {
		const x0 = TRUE_X + o - HALF[i];
		// the interval that misses is drawn blue until phase 6, then red
		const fx = MISSES[i] ? { in: PHASE_OF(i), hide: 6 } : i === 0 ? undefined : { in: PHASE_OF(i) };
		a.rect(x0, Y(i) - 2, 2 * HALF[i], 4, tint('src', 4), fx, 2);
		a.circle(TRUE_X + o, Y(i), 4, tint('src', 4), fx);
	});
	const m = MISSES.indexOf(true);
	a.rect(TRUE_X + OFFSETS[m] - HALF[m], Y(m) - 2, 2 * HALF[m], 4, tint('flt', 4), { in: 6 }, 2);
	a.circle(TRUE_X + OFFSETS[m], Y(m), 4, tint('flt', 4), { in: 6 });
	a.text(TRUE_X + OFFSETS[m] - HALF[m] - 6, Y(m) + 3.5, 'miss', 'f10 b', { in: 6 }, 'e');
	a.text(340, 246, '19 of 20 cross', 'f11 b', { in: 7 }, 'e');
	return a;
}

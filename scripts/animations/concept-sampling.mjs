// Concept animation (SPEC D41, no real data) for samples and bias (core lesson C5). Metaphor: a sample can only speak for the cases it could reach.
// A population of 24 orders as dots (a bigger dot is a bigger order), drawn in 8 columns, the 2 left columns being the mornings. The marks are schematic,
// not cafe-sales values. 8 s loop of 8 phases: 1 the population and its true mean (ochre line on the value axis); 2 and 3 six orders are drawn at random
// (blue rings, spread over the columns); 4 their mean lands on the axis, close to the true mean (blue dot); 5 and 6 the rings go and the six morning orders
// are drawn instead (the gray band is the easy-to-reach corner); 7 their mean lands far to the left, and a red bracket marks the gap to the true mean; 8 holds.
// Colors by meaning, the same in C5 to C7: ochre = the true value, blue = a sample's estimate, red = a miss.
// The values below are invented for the picture; the geometry asserts that the random draw lands near the true mean and the morning draw does not.
import { anim, tint } from '../lib/step-animation.mjs';

const COLS = [
	[8, 9, 7],
	[10, 8, 11],
	[12, 15, 14],
	[13, 17, 12],
	[11, 14, 19],
	[15, 13, 22],
	[10, 16, 14],
	[12, 18, 13],
]; // value of the order in each column, rows 0 to 2
const RANDOM = [[1, 1], [2, 0], [3, 2], [4, 1], [5, 0], [7, 2]]; // [column, row] of the six random orders
const MORNING = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];
const cx = (c) => 46 + 38 * c;
const cy = (r) => 78 + 26 * r;
const rad = (v) => 3.5 + (v - 5) * 0.33;
const xv = (v) => 30 + ((v - 5) / 17) * 300; // value to x on the axis
const val = ([c, r]) => COLS[c][r];
const mean = (list) => list.reduce((s, p) => s + val(p), 0) / list.length;
const ALL = COLS.flatMap((col, c) => col.map((_, r) => [c, r]));
const TRUE = mean(ALL);
if (Math.abs(mean(RANDOM) - TRUE) > 1 || TRUE - mean(MORNING) < 3) throw new Error('concept-sampling: the schematic draws no longer show the idea');

export default function make({ id = 'smp' } = {}) {
	const a = anim({
		id,
		h: 254,
		loop: { cycle: 8 },
		title: 'A random sample and a sample of the easiest orders to reach',
		desc:
			'A grid of 24 dots, each one an order, in eight columns; the two left columns are the morning orders and a bigger dot is a bigger order. Below it, a line for the average order value with an ochre mark for the true mean of all 24 orders. Six orders drawn at random are ringed in blue and their mean, a blue dot, lands close to the true mean. Six morning orders, inside a gray band, are then ringed in blue and their mean lands far to the left of the true mean, with a red bracket marking the gap.',
		caption: 'A random draw gives every order the same chance, so its average lands near the true one. A draw from the easiest corner to reach lands to one side, and drawing more from that corner does not move it.',
		phases: [
			[1, '24 orders, the whole population', { role: 'src', key: 'The population is every order we care about; its mean is the true value.', changes: [['+', '24 orders'], ['+', 'the true mean']] }],
			[2, 'Draw 6 at random', { role: 'grp', key: 'In a random draw every order has the same chance, wherever it sits.', changes: [['+', '6 orders drawn']] }],
			[4, 'Their mean is an estimate', { role: 'out', key: 'The sample mean is an estimate of the true mean, a little off by luck.', changes: [['+', '1 estimate']] }],
			[5, 'Now draw the 6 easiest to reach', { role: 'grp', key: 'An easy-to-reach sample comes from one corner of the population.', changes: [['~', 'draw moved to mornings']] }],
			[7, 'Its mean misses to one side', { role: 'flt', key: 'This estimate sits to one side, and a bigger sample from the same corner would too.', changes: [['+', 'a gap to the true mean']] }],
		],
		counters: [
			{ label: 'orders', role: 'src', values: [[1, 24]] },
			{ label: 'drawn', role: 'grp', values: [[2, 6], [5, 6]] },
			{ label: 'estimates', role: 'out', values: [[4, 1], [7, 2]] },
		],
	});
	a.text(10, 14, 'Who could be in the sample?', 'f11 b');
	// the morning band (the easy-to-reach corner) and the population
	a.rect(cx(0) - 20, 60, 2 * 38 - 2, 90, tint('ord', 1), { in: 5 }, 8);
	a.text(cx(0) + 17, 56, 'mornings', 'f10 b', { in: 5 }, 'm');
	for (const p of ALL) a.circle(cx(p[0]), cy(p[1]), rad(val(p)), tint('ord', 3));
	for (const p of RANDOM) a.circle(cx(p[0]), cy(p[1]), rad(val(p)) + 4, 's-src', { in: 2, hide: 5 });
	for (const p of MORNING) a.circle(cx(p[0]), cy(p[1]), rad(val(p)) + 4, 's-src', { in: 5 });
	// the value axis and the three marks
	a.path('M20 206H340', 'ln');
	a.text(20, 246, 'lower', 'f10 mu');
	a.text(340, 246, 'higher', 'f10 mu', undefined, 'e');
	a.text(180, 246, 'average order value', 'f10 mu', undefined, 'm');
	a.path(`M${xv(TRUE)} 168V214`, 's-out');
	a.text(xv(TRUE), 164, 'true mean', 'f10 b', undefined, 'm');
	a.circle(xv(mean(RANDOM)), 206, 5, tint('src', 4), { in: 4 });
	a.text(xv(mean(RANDOM)) + 8, 224, 'random 6', 'f10', { in: 4 }, 'm');
	a.circle(xv(mean(MORNING)), 206, 5, tint('src', 4), { in: 7 });
	a.text(xv(mean(MORNING)), 224, 'mornings 6', 'f10', { in: 7 }, 'm');
	a.path(`M${xv(mean(MORNING))} 190H${xv(TRUE)}`, 's-flt', { in: 7, draw: true });
	a.text((xv(mean(MORNING)) + xv(TRUE)) / 2, 184, 'gap', 'f10 b', { in: 7 }, 'm');
	return a;
}

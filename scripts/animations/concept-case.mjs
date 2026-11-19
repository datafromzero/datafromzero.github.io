// Concept animation (SPEC D41, no real data) for CASE. Metaphor: each row walks down the WHEN tests; the first yes stops the walk.
// 8 s loop of 8 phases: 1 three rows wait; 2 all three step to WHEN 1 and 3 its verdict shows (Row 1 yes: gold and stops, label A;
// Rows 2 and 3 no: red); 4 Rows 2 and 3 step to WHEN 2 and 5 its verdict (Row 2 yes, label B; Row 3 no); 6 Row 3 steps to ELSE and
// 7 gets label C; 8 hold. Facts (DuckDB 2.0.0, concept2/facts.out): CASE returns the result of the first WHEN that is true; a row
// whose test is NULL counts as not true and goes on (10, NULL, 30 with WHEN v>20 / WHEN v>5 / ELSE gave mid, other, hi); with no
// ELSE and no true test the result is NULL.
import { anim } from '../lib/step-animation.mjs';

const ROWS = [['Row 1', 1, 'A'], ['Row 2', 2, 'B'], ['Row 3', 3, 'C']]; // row, the column it stops at, its label
const Y = (i) => 62 + 32 * i;

export default function make({ id = 'cs' } = {}) {
	const a = anim({
		id,
		h: 186,
		loop: { cycle: 8 },
		title: 'CASE: each row walks down the tests, the first yes wins',
		desc:
			'Three rows wait on the left; three columns of tests follow: WHEN 1, WHEN 2 and ELSE. All rows step to WHEN 1. Row 1 passes: it is marked yes, stops, and gets label A. Rows 2 and 3 fail: they are marked no and step on to WHEN 2. Row 2 passes and gets label B. Row 3 fails again and steps on to ELSE, where it gets label C.',
		caption: 'CASE walks each row down the WHEN tests in order. The first test that is true gives the row its label and the walk stops. A row that passes none gets ELSE.',
	});
	a.text(10, 14, 'Walk down the tests, first yes wins', 'f11 b');
	a.tags(10, 29, [[1, '1 · rows wait'], [2, '2 · every row tries WHEN 1'], [4, '3 · the rest try WHEN 2'], [6, '4 · what is left gets ELSE']]);
	[['WHEN 1', 117], ['WHEN 2', 187], ['ELSE', 257]].forEach(([t, x]) => a.text(x, 52, t, 'f10 b mo', undefined, 'm'));
	a.grid(82, 58, [70, 70, 70], 3, 32);
	ROWS.forEach(([t, stop, label], i) => {
		const y = Y(i);
		const flags = [];
		for (let k = 1; k < stop; k++) flags.push({ role: 'flt', level: 3, fx: { in: 2 * k + 1, hide: 2 * k + 2 } });
		flags.push({ role: 'out', level: 3, fx: { in: 2 * stop + 1 } });
		const walk = (k) => (k > stop ? a.chip(10, y, t, { role: 'src', level: 2, w: 54, flags }) : a.move({ dx: k === 1 ? 80 : 70, at: 2 * k }, () => walk(k + 1)));
		walk(1);
		a.chip(298, y, label, { role: 'out', level: 3, w: 52, fx: { in: 2 * stop + 1 } });
	});
	a.text(10, 176, 'gold: yes, stop here · red: no, go on', 'f10 mu');
	return a;
}

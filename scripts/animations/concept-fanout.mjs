// Concept animation (SPEC D41, no real data) for join fan-out. Metaphor: one row meets three, and becomes three, so a SUM counts it three times.
// 8 s loop of 8 phases: 1 one order row O1 with an amount a, and three item rows I1 to I3; 2 O1 matches all three (arrows); 3 to 5 the join
// makes one result row per match: each item slides into the result and gets a copy of O1's amount; 6 SUM(a) adds a three times;
// 7 a note: a is counted 3 times; 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): orders (1, 10), (2, 20) joined to items (1,x), (1,y), (1,z), (2,x) give order 1 three times;
// SUM(amt) over the join is 50 while SUM(amt) over orders is 30.
import { anim } from '../lib/step-animation.mjs';

const IY = (i) => 60 + 30 * i; // item row i in the top area
const RY = (i) => 170 + 30 * i; // result row i

export default function make({ id = 'fo' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'A join can multiply a row, and then a SUM counts it again',
		desc:
			'One order row O1 with an amount a, and three item rows I1, I2 and I3 that all belong to it. Arrows connect O1 to each item. The join makes one result row per match, so there are three result rows, each holding a copy of the amount a next to one item. SUM of a adds a three times, even though O1 has one amount.',
		caption: 'When one row matches several rows, a join returns it once per match. Adding up a column of the one-side then counts each value several times.',
		phases: [[1, 'One order row, three item rows'], [2, 'The order matches all three items'], [3, 'The join makes one row per match'], [6, 'SUM adds the amount three times'], [7, 'The amount a is counted 3 times']],
	});
	a.text(10, 14, 'One row meets three, and becomes three', 'f11 b');
	a.chip(10, 56, 'O1 · amount a', { role: 'src', level: 3, w: 90 });
	[0, 1, 2].forEach((i) => {
		a.ghost(250, IY(i), 90, 24);
		a.arrow(102, 68, 246, IY(i) + 12, 's-mat', { in: 2, draw: true });
		a.ghost(100, RY(i), 90, 24);
		a.chip(10, RY(i), 'O1 · a', { role: 'src', level: 3, w: 80, fx: { in: 3 + i } });
		a.move({ dx: -150, dy: 110, at: 3 + i }, () => a.chip(250, IY(i), `I${i + 1}`, { role: 'src', level: 2, w: 90 }));
	});
	a.text(10, 160, 'result of the join', 'f10 b');
	a.chip(210, 200, 'SUM = a + a + a', { role: 'out', level: 3, w: 140, fx: { in: 6 } });
	a.text(210, 242, 'a is counted 3 times', 'f10 b f-flt', { in: 7 });
	return a;
}

// Concept animation (SPEC D41, no real data) for a recursive CTE. Metaphor: round after round, the newest rows find the next rows,
// until a round finds none. 8 s loop of 8 phases: 1 the anchor row waits in the "new rows" box; 2 it joins the result; 3 round 1 finds
// two rows (an arrow reads from the result); 4 they join the result; 5 round 2 finds one row; 6 it joins the result; 7 round 3 finds
// nothing, so it stops; 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): WITH RECURSIVE r(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM r WHERE n < 3) returns 1, 2, 3:
// the anchor first, then each round builds on the previous round's rows, and it ends when a round returns no rows.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const SLOT = (i) => 62 + 30 * i;

export default function make({ id = 'rc' } = {}) {
	const a = anim({
		id,
		h: 198,
		loop: { cycle: 8 },
		title: 'A recursive query repeats until a round adds nothing',
		desc:
			'A box of new rows holds the anchor row, which joins the result column on the right. Round 1 reads that row and finds two new rows, which join the result. Round 2 reads those and finds one new row, which joins the result. Round 3 finds nothing new, so a badge says it adds nothing and it stops. The result holds four rows.',
		caption: 'A recursive CTE starts from an anchor row. Each round uses the rows the last round added to find more. It stops when a round adds no rows.',
		phases: [
			[1, 'The anchor row is the start', { role: 'src', key: 'A recursive CTE starts from an anchor: the first row or rows, written by hand.', changes: [['+', 'anchor: 1 row']] }],
			[2, 'The anchor joins the result', { role: 'out', key: 'Before any round runs, the anchor row is already in the result.', changes: [['+', 'result: 1 row']] }],
			[3, 'Round 1 finds two rows, they join', { role: 'mat', key: 'Round 1 uses the newest rows, here the anchor, to find the next ones.', changes: [['+', '2 new rows found'], ['+', 'result: 3 rows']] }],
			[5, 'Round 2 finds one row, it joins', { role: 'mat', key: 'Each round works only from the rows the previous round added.', changes: [['+', '1 new row found'], ['+', 'result: 4 rows']] }],
			[7, 'Round 3 finds nothing: stop', { role: 'flt', key: 'When a round finds no new rows, the recursion ends and the result is complete.', changes: [['+', 'round 3: 0 new rows'], ['~', 'final result: 4 rows']] }],
		],
		counters: [
			{ label: 'round', role: 'mat', values: [[3, 1], [5, 2], [7, 3]] },
			{ label: 'new rows', role: 'src', values: [[1, 1], [3, 2], [5, 1], [7, 0]] },
			{ label: 'result rows', role: 'out', values: [[2, 1], [4, 3], [6, 4]] },
		],
	});
	a.text(10, 14, 'Round after round, until nothing new', 'f11 b');
	a.box(10, 44, 110, 92, { role: 'src', title: 'new rows' });
	a.text(240, 54, 'result', 'f10 b', undefined, 'm');
	[0, 1, 2, 3].forEach((i) => a.ghost(220, SLOT(i), 80, 24));
	a.arrow(216, 74, 124, 86, 's-src', { in: 3, hide: 4, draw: true });
	a.arrow(216, 104, 124, 90, 's-src', { in: 5, hide: 6, draw: true });
	a.move({ dx: 200, dy: -10, at: 2 }, () => a.chip(20, 72, 'anchor', { role: 'out', level: 3, w: 80 }));
	a.move({ dx: 200, dy: 20, at: 4, fx: { in: 3 } }, () => a.chip(20, 72, 'Row 2', { role: 'out', level: 3, w: 80 }));
	a.move({ dx: 200, dy: 20, at: 4, fx: { in: 3 } }, () => a.chip(20, 102, 'Row 3', { role: 'out', level: 3, w: 80 }));
	a.move({ dx: 200, dy: 80, at: 6, fx: { in: 5 } }, () => a.chip(20, 72, 'Row 4', { role: 'out', level: 3, w: 80 }));
	a.badge(10, 150, 'adds nothing → stop', 'flt', { in: 7 });
	return a;
}

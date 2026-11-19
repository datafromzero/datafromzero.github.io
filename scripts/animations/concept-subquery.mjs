// Concept animation (SPEC D41, no real data) for a subquery. Metaphor: the inner query answers first, and its answer feeds the outer one.
// 8 s loop of 8 phases: 1 the outer query has four rows (3, 8, 2, 9) and an empty slot in its test "x >"; the inner query box says AVG(x);
// 2 the inner query runs and produces one value v; 3 v slides down into the empty slot; 4 the outer query now has its test;
// 5 the rows are tested against v: 3 and 2 fail (red), 8 and 9 stay; 6 to 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out and facts2.out): SELECT x FROM t WHERE x > (SELECT AVG(x) FROM t) over 3, 8, 2, 9 gives 8 and 9 (the average
// is 5.5); the inner query is evaluated first and gives one value.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const X = [3, 8, 2, 9];

export default function make({ id = 'sq' } = {}) {
	const a = anim({
		id,
		h: 226,
		loop: { cycle: 8 },
		title: 'A subquery runs first and hands its answer to the outer query',
		desc:
			'An outer query box holds four rows with x equal to 3, 8, 2 and 9, and a test x greater than, with an empty slot. An inner query box above it computes the average of x, which is 5.5, and shows it as a value v. The value slides down into the empty slot. The outer query then tests each row against it: 3 and 2 fail and turn red, 8 and 9 stay.',
		caption: 'A subquery is a query inside a query. The inner one runs first, and its result is used by the outer one, here as the value to compare with.',
		phases: [
			[1, 'The outer test has an empty slot', { role: 'src', key: 'The outer query’s test has a gap: it needs a value from somewhere else.', changes: [['+', 'outer test: x > (empty slot)']] }],
			[2, 'The inner query runs first', { role: 'src', key: 'The inner query runs first and works out one value, here AVG(x).', changes: [['+', 'inner result: one value v']] }],
			[3, 'Its answer slides into the slot', { role: 'out', key: 'That value is plugged into the outer query’s test.', changes: [['~', 'the empty slot is filled with v']] }],
			[5, 'The outer query tests its rows', { role: 'flt', key: 'Now the outer query tests every row against v and keeps only the rows that pass.', changes: [['−', '2 rows fail the test'], ['~', '2 rows kept']] }],
		],
		counters: [
			{ label: 'outer rows', role: 'src', values: [[1, 4]] },
			{ label: 'inner value', role: 'src', values: [[2, 1]] },
			{ label: 'kept', role: 'out', values: [[5, 2]] },
			{ label: 'dropped', role: 'flt', values: [[5, 2]] },
		],
	});
	a.text(10, 14, 'The inner answer feeds the outer query', 'f11 b');
	a.box(190, 40, 160, 62, { role: 'src', title: 'inner query' });
	a.text(200, 88, 'AVG(x) → one value', 'f10');
	a.rect(186, 36, 168, 70, 's-out', { in: 2, hide: 3, pulse: true }, 8);
	a.box(10, 120, 340, 96, { role: 'out', title: 'outer query' });
	X.forEach((x, i) => a.chip(20 + 54 * i, 150, `x = ${x}`, { role: 'src', level: 2, w: 48, flags: x < 5 ? [{ role: 'flt', level: 3, fx: { in: 5 } }] : [] }));
	a.text(240, 167, 'keep x >', 'f11 b');
	a.ghost(300, 154, 40, 24);
	a.move({ dy: 90, at: 3, fx: { in: 2 } }, () => a.chip(300, 64, 'v', { role: 'out', level: 3, w: 40 }));
	return a;
}

// Concept animation (SPEC D41, no real data) for a subquery. Metaphor: the inner query answers first, and its answer feeds the outer one.
// 8 s loop of 8 phases: 1 the outer query has four rows (3, 8, 2, 9) and an empty slot in its test "x >"; the inner query box says AVG(x);
// 2 the inner query runs and produces one value v; 3 v slides down into the empty slot; 4 the outer query now has its test;
// 5 the rows are tested against v: 3 and 2 fail (red), 8 and 9 stay; 6 to 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out and facts2.out): SELECT x FROM t WHERE x > (SELECT AVG(x) FROM t) over 3, 8, 2, 9 gives 8 and 9 (the average
// is 5.5); the inner query is evaluated first and gives one value.
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
		phases: ['The outer query has an empty slot in its test', 'The inner query runs first', 'Its answer slides into the slot', 'The outer query has everything it needs', 'Rows are tested against the answer', 'Rows 3 and 2 fail', 'Rows 8 and 9 stay', 'Inner answer, outer test'],
	});
	a.text(10, 14, 'The inner answer feeds the outer query', 'f11 b');
	a.tags(10, 29, [[1, '1 · the outer test has an empty slot'], [2, '2 · the inner query runs first'], [3, '3 · its answer slides in'], [4, '4 · the outer query has what it needs'], [5, '5 · rows are tested against it']]);
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

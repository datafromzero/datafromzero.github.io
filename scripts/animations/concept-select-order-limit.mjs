// Concept animation (SPEC D41, no real data) for SELECT, ORDER BY and LIMIT. Metaphor: pick, deal out in order, keep the top.
// 8 s loop of 8 phases: 1 a table of four rows with columns A, B, C (B is the sort key); 2 SELECT keeps columns A and B, C fades;
// 3 to 6 ORDER BY deals the rows one at a time into a new table, smallest key first (r2, r4, r1, r3), each sliding on its own
// phase so no two rows cross; 7 LIMIT 2 draws a cut line under the second slot; 8 the rows below it fade, the top 2 stay.
// Facts (DuckDB 2.0.0, concept2/facts2.out): the engine sorts first and LIMIT then keeps the first rows of the sorted result.
import { anim, tint } from '../lib/step-animation.mjs';

const ROWS = [['r1', 3, 'c1', 2, 5], ['r2', 1, 'c2', 0, 3], ['r3', 4, 'c3', 3, 6], ['r4', 2, 'c4', 1, 4]]; // id, key, C value, slot in the sorted table, phase it moves
const Y = (i) => 58 + 30 * i;

export default function make({ id = 'sol' } = {}) {
	const a = anim({
		id,
		h: 184,
		loop: { cycle: 8 },
		title: 'SELECT picks columns, ORDER BY deals rows in order, LIMIT keeps the top',
		desc:
			'A table of four rows r1 to r4 with columns A, B and C; B holds a sort key. SELECT keeps columns A and B, and column C fades away. ORDER BY then deals the rows one by one into a new table on the right, the smallest key first: r2, r4, r1, r3. LIMIT 2 draws a cut line under the second row; the two rows below it fade, and the top 2 rows stay.',
		caption: 'SELECT chooses the columns, ORDER BY puts the rows in order, and LIMIT keeps only the first rows of that order.',
	});
	a.text(10, 14, 'Pick, put in order, keep the top', 'f11 b');
	a.tags(10, 29, [[1, '1 · a table'], [2, '2 · SELECT picks columns'], [3, '3 · ORDER BY: smallest key first'], [7, '4 · LIMIT 2 keeps the top two']]);
	[['A', 24], ['B', 54], ['A', 204], ['B', 234]].forEach(([t, x]) => a.text(x, 50, t, 'f10 b', undefined, 'm'));
	a.text(84, 50, 'C', 'f10 b', { hide: 3 }, 'm');
	ROWS.forEach((_, i) => {
		a.rect(10, Y(i), 88, 24, 'bx dsh', undefined, 5);
		a.rect(190, Y(i), 58, 24, 'bx dsh', undefined, 5);
	});
	a.rect(7, 42, 64, 132, 's-out', { in: 2, hide: 3, pulse: true }, 6);
	ROWS.forEach(([t, key, c, slot, at], i) => {
		const y = Y(i);
		a.move({ dx: 180, dy: (slot - i) * 30, at, fx: slot > 1 ? { hide: 8 } : undefined }, () => {
			[[10, t], [40, key]].forEach(([x, s]) => {
				a.rect(x, y, 28, 24, tint('src', 2), undefined, 5);
				a.text(x + 14, y + 16, s, 'f11', undefined, 'm');
			});
			a.rect(70, y, 28, 24, tint('src', 1), { hide: 3 }, 5);
			a.text(84, y + 16, c, 'f11', { hide: 3 }, 'm');
		});
	});
	a.path('M184 118h70', 's-flt dsh', { in: 7 });
	a.text(262, 122, 'LIMIT 2', 'f10 b', { in: 7 });
	return a;
}

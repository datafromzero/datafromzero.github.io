// Concept animation (SPEC D41, no real data): an aggregate collapses the rows of a group into ONE row; a window function
// keeps every row and gives each its own Σ. Two stacked panels (they stack for phones); 6 s loop of 8 phases:
// 1 the rows, 2 to 4 one arrow per row draws, 3 to 5 the results appear, 6 the row counts, 7 and 8 hold.
import { anim, tint } from '../lib/step-animation.mjs';

const ARROW_PHASE = [2, 3, 4];

export default function make({ id = 'cw' } = {}) {
	const a = anim({
		id,
		h: 250,
		loop: { cycle: 6 },
		title: 'An aggregate returns one row; a window function keeps every row',
		desc:
			'Two panels. First, an aggregate: three rows, each with a Col 3 value, send their values by arrows into one result row that holds Σ, so 3 rows become 1 row. Second, a window function: the same three rows each send their value by an arrow to a result row of their own, which keeps the row and adds Σ, so 3 rows stay 3 rows.',
		caption: 'An aggregate (GROUP BY) turns a group of rows into one row. A window function (OVER) keeps every row and adds the group result to each one.',
	});
	for (const [y0, title, role] of [[0, 'Aggregate: GROUP BY', 'out'], [132, 'Window function: OVER', 'win']]) {
		a.text(10, y0 + 14, title, 'f11 b');
		const ty = y0 + 22;
		// source table: Col 3 holds the values that flow
		[0, 1, 2].forEach((i) => a.rect(70, ty + 22 + 22 * i, 50, 22, tint('src', 2)));
		a.grid(10, ty, [60, 50], 4, 22);
		a.text(15, ty + 15, 'Row', 'f10 b');
		a.text(75, ty + 15, 'Col 3', 'f10 b');
		[1, 2, 3].forEach((n) => {
			a.text(15, ty + 22 * n + 15, `Row ${n}`, 'f11');
			a.text(75, ty + 22 * n + 15, `x${n}`, 'f11');
		});
		const cy = (i) => ty + 33 + 22 * i; // center of data row i (0 to 2)
		if (role === 'out') {
			ARROW_PHASE.forEach((p, i) => a.arrow(124, cy(i), 236, cy(1), 's-out', { in: p, draw: true }));
			a.ghost(240, cy(1) - 11, 80, 22);
			a.g({ in: 5 }, () => {
				a.rect(240, cy(1) - 11, 80, 22, tint('out', 3));
				a.rect(240, cy(1) - 11, 80, 22, 'bx');
				a.text(280, cy(1) + 5, 'Σ', 'f14 b', undefined, 'm');
			});
			a.text(326, cy(1) + 4, '1 row', 'f10 b', { in: 6 });
		} else {
			ARROW_PHASE.forEach((p, i) => {
				a.arrow(124, cy(i), 214, cy(i), 's-win', { in: p, draw: true });
				a.row(218, cy(i) - 11, [{ w: 50, text: `Row ${i + 1}` }, { w: 50, text: 'Σ', align: 'e', c: 'f11 b' }], { h: 22, fx: { in: p + 1 }, tint: tint('win', 3), tintCols: [1, 1] });
			});
			a.text(324, cy(1) + 4, '3 rows', 'f10 b', { in: 6 });
		}
	}
	return a;
}

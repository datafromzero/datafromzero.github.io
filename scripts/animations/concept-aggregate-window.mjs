// Concept animation (SPEC D41, no real data). Two metaphors, stacked so they fit a phone, 8 s loop of 8 phases.
// Aggregate, "many rows -> one answer": 1 three rows, each holding a value; 2 to 4 the values slide, one row at a time, into one
// spot; 5 the rows are gone and one Σ row stands; 6 its row count. Window function, "every row keeps its seat and gets a
// note": 1 the same rows; 2 to 4 arrows read the group into one Σ bubble; 5 to 7 a copy of Σ slides back to each row, one per
// phase; 8 hold.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const H = 140; // top of the second panel

export default function make({ id = 'cw' } = {}) {
	const a = anim({
		id,
		h: 272,
		loop: { cycle: 8 },
		title: 'An aggregate returns one row; a window function keeps every row',
		desc:
			'Two panels. First, an aggregate, many rows into one answer: three rows each hold a value x1, x2 or x3. The values slide, one after another, into one spot, the rows leave empty seats, and one result row holds Σ: 3 rows become 1 row. Second, a window function, every row keeps its seat and gets a note: the same three rows stay in place, arrows read the group into one Σ bubble, and a copy of Σ slides back next to each row: 3 rows stay 3 rows.',
		caption: 'An aggregate (GROUP BY) turns a group of rows into one row. A window function (OVER) keeps every row and adds the group result as a new column.',
		phases: [
			[1, 'Three rows, each with a value', { role: 'src', key: 'Both pictures start from the same rows, each with a value.', changes: [['+', '3 rows in each picture']] }],
			[2, 'The group is read into one Σ', { role: 'grp', key: 'Both read the whole group and work out one Σ from it.', changes: [['+', 'Σ, worked out from all 3 rows']] }],
			[5, 'Top: one row left. Bottom: a note per row', { role: 'win', key: 'An aggregate keeps only Σ. A window function keeps every row and adds Σ to each.', changes: [['−', 'aggregate: 3 rows become 1'], ['+', 'window: a Σ note on every row']] }],
		],
		counters: [
			{ label: 'aggregate rows', role: 'out', values: [[1, 3], [5, 1]] },
			{ label: 'window rows', role: 'win', values: [[1, 3], [5, 3]] },
			{ label: 'Σ notes', role: 'win', values: [[5, 1], [6, 2], [7, 3]] },
		],
	});
	for (const [y0, title, role, tags] of [
		[0, 'Many rows → one answer', 'out', [[1, '1 · rows, each with a value'], [2, '2 · the values flow into one spot'], [5, '3 · one answer']]],
		[H, 'Every row keeps its seat and gets a note', 'win', [[1, '1 · rows, each with a value'], [2, '2 · the group is read'], [5, '3 · a note is delivered to each row']]],
	]) {
		a.text(10, y0 + 14, title, 'f11 b');
		const ry = (i) => y0 + 38 + 30 * i;
		const row = (i) => {
			a.rect(10, ry(i), 96, 26, tint('src', 2), undefined, 6);
			a.text(20, ry(i) + 17, `Row ${i + 1}`, 'f11');
		};
		a.ghost(245, y0 + 66, 90, 30);
		if (role === 'out') {
			[0, 1, 2].forEach((i) => a.rect(10, ry(i), 96, 26, 'bx dsh', undefined, 6));
			[0, 1, 2].forEach((i) => {
				a.g({ hide: 5 }, () => row(i));
				a.move({ dx: 200, dy: 30 * (1 - i), at: 2 + i, fx: { hide: 3 + i } }, () => {
					a.rect(77, ry(i) + 4, 26, 18, tint('out', 3), undefined, 5);
					a.text(90, ry(i) + 17, `x${i + 1}`, 'f10 b', undefined, 'm');
				});
			});
			a.g({ in: 5 }, () => {
				a.rect(245, y0 + 66, 90, 30, tint('out', 3), undefined, 8);
				a.text(290, y0 + 87, 'Σ', 'f14 b', undefined, 'm');
			});
			a.rect(243, y0 + 64, 94, 34, 's-out', { in: 5, hide: 7, pulse: true }, 10);
			a.text(290, y0 + 114, '1 row', 'f10 b', { in: 6 }, 'm');
		} else {
			[0, 1, 2].forEach((i) => {
				row(i);
				a.rect(120, ry(i), 42, 26, 'bx dsh', undefined, 6);
				a.arrow(110, ry(i) + 13, 241, y0 + 81, 's-win', { in: 2 + i, hide: 5, draw: true });
			});
			a.g({ in: 5 }, () => {
				a.rect(245, y0 + 66, 90, 30, tint('win', 3), undefined, 8);
				a.text(318, y0 + 87, 'Σ', 'f14 b', undefined, 'm');
			});
			[0, 1, 2].forEach((i) =>
				a.move({ dx: -130, dy: 30 * (i - 1), at: 5 + i, fx: { in: 5 + i } }, () => {
					a.rect(250, y0 + 68, 42, 26, tint('win', 3), undefined, 6);
					a.text(271, y0 + 85, 'Σ', 'f11 b', undefined, 'm');
				}),
			);
		}
	}
	return a;
}

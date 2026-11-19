// S14 window functions: stores 1 and 2, January 1 to 3 of cafe-sales v1 (the lesson's own day-by-store rows), four steps
// the learner advances one at a time: six rows, GROUP BY collapses them to two, PARTITION BY shades the six, the window
// value fills in beside each. Parts only fade in at their own slot, so text never overlaps at any moment.
// Checked with DuckDB 2.0.0 (completed orders per store and day): store 1: 2, 3, 3 (total 8); store 2: 2, 4, 3 (total 9);
// GROUP BY store_id gives 2 rows, SUM(orders) OVER (PARTITION BY store_id) keeps all 6. Live counters (rows after each clause), a Key
// idea and What changed per step (D41); each shows only at its own step.
import { anim, tint } from '../lib/step-animation.mjs';

const ROWS = [
	[1, '2026-01-01', 2], [1, '2026-01-02', 3], [1, '2026-01-03', 3],
	[2, '2026-01-01', 2], [2, '2026-01-02', 4], [2, '2026-01-03', 3],
];
const TOTAL = { 1: 8, 2: 9 };
const LEVEL = { 1: 1, 2: 3 }; // two shades of one hue

export default function make({ id = 'win' } = {}) {
	const a = anim({
		id,
		h: 314,
		title: 'GROUP BY collapses the rows, a window function keeps them',
		desc:
			'Four steps. Six daily rows for stores 1 and 2, January 1 to 3. Store 1 has orders 2, 3 and 3; store 2 has 2, 4 and 3. GROUP BY store_id turns them into two rows: store 1, 8 orders and store 2, 9 orders. SUM(orders) OVER (PARTITION BY store_id) keeps all six rows, shades each store as its own partition, and adds that store total beside its rows: 8 beside store 1 and 9 beside store 2.',
		steps: [
			{
				role: 'src',
				clause: 'FROM',
				text: 'Six daily rows: stores 1 and 2, January 1 to 3. Each row is one store on one day.',
				predict: 'GROUP BY store_id would collapse them. How many rows would come out?',
				counts: [{ label: 'FROM', value: 6 }],
				key: 'A table is a pile of rows; nothing is combined or removed yet.',
				changes: [['+', '6 rows: store_id, day, orders']],
			},
			{
				role: 'grp',
				clause: 'GROUP BY',
				text: 'GROUP BY store_id collapses the rows that share a store_id into a single row. The days are gone: only one total per store is left.',
				counts: [{ label: 'GROUP BY', value: 2 }],
				key: 'GROUP BY collapses rows: you get one row per group and lose the detail.',
				changes: [['−', '4 rows folded away'], ['−', 'column day'], ['+', 'column SUM(orders)']],
			},
			{
				role: 'win',
				clause: 'PARTITION BY',
				text: 'A window function keeps all six rows. PARTITION BY store_id only marks which rows belong together: one partition per store, shaded.',
				predict: 'SUM(orders) OVER (PARTITION BY store_id) will add one more column. What will it show on each row of store 1?',
				counts: [{ label: 'PARTITION', value: 6 }],
				key: 'PARTITION BY only marks which rows belong together; it never removes a row.',
				changes: [['~', 'rows shaded into 2 partitions']],
			},
			{
				role: 'win',
				clause: 'SUM OVER',
				text: "SUM(orders) OVER (PARTITION BY store_id) writes each partition's total on every one of its rows, so the number of rows does not change. Compare it with your prediction.",
				counts: [{ label: 'OVER', value: 6 }],
				key: 'A window function adds a column and keeps every row.',
				changes: [['+', 'column: the store total on each row'], ['~', 'all 6 rows kept']],
			},
		],
	});

	a.text(10, 20, 'Stores 1 and 2, January 1 to 3: six rows in', 'f14 b');
	// the six rows; PARTITION BY shades them at step 3, the window column joins at step 4
	a.row(10, 30, [{ w: 60, text: 'store_id' }, { w: 96, text: 'day' }, { w: 64, text: 'orders', align: 'e' }], { head: true, h: 22, tint: tint('src', 2) });
	a.g({ in: 4 }, () => {
		a.rect(230, 30, 120, 22, 'bx');
		a.rect(230, 30, 120, 22, tint('win', 2));
		a.text(345, 45, 'SUM(orders) OVER (…)', 'f10 b', undefined, 'e');
	});
	ROWS.forEach(([s, day, n], i) => {
		const y = 52 + 22 * i;
		a.row(10, y, [{ w: 60, text: s }, { w: 96, text: day }, { w: 64, text: n, align: 'e' }], {
			h: 22,
			tint: tint('win', LEVEL[s]),
			tintFx: { in: 3 },
		});
		a.g({ in: 4 }, () => {
			a.rect(230, y, 120, 22, 'bx');
			a.rect(230, y, 120, 22, tint('win', LEVEL[s]));
			a.text(345, y + 15, TOTAL[s], 'f11 b', undefined, 'e');
		});
	});

	// the GROUP BY result, step 2
	a.text(10, 206, 'GROUP BY store_id: 2 rows out', 'f11 b', { in: 2 });
	a.g({ in: 2 }, () => {
		a.row(10, 214, [{ w: 60, text: 'store_id' }, { w: 96, text: 'SUM(orders)', align: 'e' }], { head: true, h: 22, tint: tint('out', 2), tintCols: [1, 1] });
		[1, 2].forEach((s, i) =>
			a.row(10, 236 + 22 * i, [{ w: 60, text: s }, { w: 96, text: TOTAL[s], align: 'e' }], { h: 22, tint: tint('grp', LEVEL[s]) }),
		);
	});
	a.text(10, 302, 'Each store keeps its rows and gets its own total.', 'f11 mu', { in: 4 });
	return a;
}

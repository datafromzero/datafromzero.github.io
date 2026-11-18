// S14 window functions: stores 1 and 2, January 1 to 3 of cafe-sales v1 (the lesson's own day-by-store rows).
// Checked with DuckDB 2.0.0 (completed orders per store and day): store 1: 2, 3, 3 (total 8); store 2: 2, 4, 3 (total 9).
import { anim } from '../lib/step-animation.mjs';

const ROWS = [
	[1, '2026-01-01', 2], [1, '2026-01-02', 3], [1, '2026-01-03', 3],
	[2, '2026-01-01', 2], [2, '2026-01-02', 4], [2, '2026-01-03', 3],
];
const TOTAL = { 1: 8, 2: 9 };

export default function make({ id = 'win' } = {}) {
	const a = anim({
		id,
		h: 342,
		title: 'GROUP BY collapses the rows, a window function keeps them',
		desc:
			'Six daily rows for stores 1 and 2, January 1 to 3. Store 1 has orders 2, 3 and 3; store 2 has 2, 4 and 3. GROUP BY store_id turns them into two rows: store 1, 8 orders and store 2, 9 orders. SUM(orders) OVER (PARTITION BY store_id) keeps all six rows, shades each store as its own partition, and adds that store total beside its rows: 8 beside store 1 and 9 beside store 2.',
		steps: [
			{ at: 0, text: 'GROUP BY store_id would squeeze the six rows into two: store 1 has 8 orders and store 2 has 9.' },
			{ at: 2, text: 'A window function keeps every row. PARTITION BY store_id shades the rows that belong together: three rows for store 1, three for store 2.' },
			{ at: 3.6, text: "SUM(orders) OVER (PARTITION BY store_id) adds each store's own total beside its rows, one row at a time: 8 for store 1, 9 for store 2." },
			{ at: 7.8, text: 'Six rows in, six rows out. GROUP BY gave two.' },
		],
	});

	a.text(10, 20, 'Stores 1 and 2, January 1 to 3: six rows in', 'f14 b');
	a.text(10, 44, 'GROUP BY store_id: 2 rows out', 'f11 b');
	a.row(10, 52, [{ w: 100, text: 'store_id' }, { w: 100, text: 'orders', align: 'e' }], { head: true });
	[1, 2].forEach((s, i) =>
		a.g({ in: true, step: 0, delay: 0.4 * (i + 1) }, () =>
			a.row(10, 74 + 22 * i, [{ w: 100, text: s }, { w: 100, text: TOTAL[s], align: 'e' }], { h: 22 }),
		),
	);

	a.text(10, 146, 'SUM(orders) OVER (PARTITION BY store_id): 6 rows out', 'f11 b');
	a.row(10, 154, [{ w: 60, text: 'store_id' }, { w: 96, text: 'day' }, { w: 64, text: 'orders', align: 'e' }, { w: 120, text: 'SUM(orders) OVER (…)', align: 'e' }], { head: true, h: 22 });
	ROWS.forEach(([s, day, n], i) => {
		const y = 176 + 22 * i;
		a.row(10, y, [{ w: 60, text: s }, { w: 96, text: day }, { w: 64, text: n, align: 'e' }, { w: 120, text: '', align: 'e' }], { h: 22 });
		a.text(325, y + 15, TOTAL[s], 'f11', { in: true, step: 2, delay: 0.6 * i }, 'e');
	});
	a.rect(10, 176, 340, 66, 'k1', { in: true, step: 1 });
	a.rect(10, 242, 340, 66, 'k2', { in: true, step: 1, delay: 0.6 });
	a.text(10, 332, 'Each store keeps its rows and gets its own total.', 'f11 mu', { in: true, step: 3 });
	return a;
}

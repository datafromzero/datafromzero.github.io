// S14 window functions: store 1, January 1 to 7 of cafe-sales v1 (orders per day 2, 3, 3, 4, 4, 5, 5; total 26).
// Checked with DuckDB 2.0.0: daily completed-order counts of store 1 over the first seven days, SUM = 26.
import { anim } from '../lib/step-animation.mjs';

const DAYS = [
	['2026-01-01', 2], ['2026-01-02', 3], ['2026-01-03', 3], ['2026-01-04', 4],
	['2026-01-05', 4], ['2026-01-06', 5], ['2026-01-07', 5],
];
const TOTAL = DAYS.reduce((s, d) => s + d[1], 0);

export default function make() {
	const a = anim({
		id: 'win',
		h: 344,
		title: 'GROUP BY collapses the rows, a window function keeps them',
		desc:
			'Seven daily rows for store 1, January 1 to 7, with orders 2, 3, 3, 4, 4, 5 and 5. GROUP BY store_id turns them into one row: store 1, 26 orders. SUM(orders) OVER (PARTITION BY store_id) keeps all seven rows, shades them as one partition, and adds the same total, 26, beside each one.',
		steps: [
			{ at: 0, text: 'GROUP BY store_id would squeeze the seven rows of store 1 into one: 26 orders.' },
			{ at: 2, text: 'A window function keeps every row. PARTITION BY store_id shades the rows that belong together: all seven are store 1.' },
			{ at: 3.6, text: 'SUM(orders) OVER (PARTITION BY store_id) fills in the partition total beside each row, one row at a time: 26 each time.' },
			{ at: 7.8, text: 'Seven rows in, seven rows out. GROUP BY gave one.' },
		],
	});

	a.text(10, 20, 'Store 1, January 1 to 7: seven rows in', 'f14 b');
	a.text(10, 44, 'GROUP BY store_id: 1 row out', 'f11 b');
	a.row(10, 52, [{ w: 100, text: 'store_id' }, { w: 100, text: 'orders', align: 'e' }], { head: true });
	a.g({ in: true, step: 0, delay: 0.4 }, () => a.row(10, 74, [{ w: 100, text: 1 }, { w: 100, text: TOTAL, align: 'e' }]));

	a.text(10, 126, 'SUM(orders) OVER (PARTITION BY store_id): 7 rows out', 'f11 b');
	a.row(10, 134, [{ w: 100, text: 'day' }, { w: 60, text: 'orders', align: 'e' }, { w: 130, text: 'SUM(orders) OVER (…)', align: 'e' }], { head: true });
	DAYS.forEach(([day, n], i) => {
		const y = 156 + 22 * i;
		a.row(10, y, [{ w: 100, text: day }, { w: 60, text: n, align: 'e' }, { w: 130, text: '', align: 'e' }], { h: 22 });
		a.text(295, y + 15, TOTAL, 'f11', { in: true, step: 2, delay: 0.6 * i }, 'e');
	});
	a.rect(10, 156, 290, 154, 'k2', { in: true, step: 1 });
	a.text(10, 334, 'The partition shades all seven rows; every row shows its total.', 'f11 mu', { in: true, step: 3 });
	return a;
}

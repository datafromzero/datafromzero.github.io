// S8 GROUP BY and HAVING: ten real orders (1719 to 1728 of cafe-sales v1) drop into one bucket per store_id, each bucket
// becomes one result row, and HAVING drops the small one. Nothing slides across other rows: chips and rows only fade in
// at their own slot, so text never overlaps at any moment.
// Checked with DuckDB 2.0.0: SELECT store_id, COUNT(*) FROM orders WHERE order_id BETWEEN 1719 AND 1728 GROUP BY store_id
// gives store 2: 5, store 1: 3, store 3: 2.
import { anim } from '../lib/step-animation.mjs';

// order_id, store_id in the order they were placed
const ORDERS = [
	[1719, 2], [1720, 1], [1721, 3], [1722, 2], [1723, 1],
	[1724, 3], [1725, 2], [1726, 2], [1727, 2], [1728, 1],
];
const STORES = [2, 1, 3]; // bucket order, biggest first
const COUNT = Object.fromEntries(STORES.map((s) => [s, ORDERS.filter((o) => o[1] === s).length]));

export default function make({ id = 'gbh' } = {}) {
	const a = anim({
		id,
		h: 406,
		title: 'GROUP BY drops ten orders into one bucket per store, and HAVING drops a small bucket',
		desc:
			'Ten orders, 1719 to 1728, each with a store_id and a shade for its store. GROUP BY puts each order in the bucket of its store: store 2 gets five, store 1 gets three and store 3 gets two. Each bucket becomes one result row with COUNT(*): store 2, 5; store 1, 3; store 3, 2. HAVING COUNT(*) at least 3 keeps stores 2 and 1 and drops store 3, shown dimmed. This is a ten-order sample; the lesson query uses 500 on the full table.',
		steps: [
			{ at: 0, text: 'Ten orders, in the order they were placed. Each takes the shade of its store_id.' },
			{ at: 2, text: 'GROUP BY drops each order into the bucket of its store_id, one at a time: store 2 gets five, store 1 gets three, store 3 gets two.' },
			{ at: 6.4, text: 'Each bucket becomes one result row, and COUNT(*) is the number of orders in it: 5, 3 and 2.' },
			{ at: 8.2, text: 'HAVING COUNT(*) >= 3 tests the finished buckets. Store 3 has only 2, so its row is dropped.' },
		],
	});

	a.text(10, 20, 'Ten orders, GROUP BY store_id', 'f14 b');

	// the input: ten rows that stay where they are
	a.row(10, 40, [{ w: 60, text: 'order_id', align: 'e' }, { w: 56, text: 'store_id', align: 'e' }], { head: true });
	ORDERS.forEach(([oid, s], i) =>
		a.row(10, 60 + 20 * i, [{ w: 60, text: oid, align: 'e' }, { w: 56, text: s, align: 'e' }], {
			tint: `k${s}`,
			tintFx: { in: true, step: 0 },
		}),
	);

	// the buckets: one chip per order, appearing in placement order
	a.text(140, 36, 'one bucket per store_id', 'f11 b');
	STORES.forEach((s, k) => {
		const top = 48 + 64 * k;
		const bucket = () => {
			a.text(140, top + 11, `store_id ${s}`, 'f10 b');
			let slot = 0;
			ORDERS.forEach(([oid, os], i) => {
				if (os !== s) return;
				const x = 140 + 42 * slot++;
				a.g({ in: true, step: 1, delay: 0.4 * i }, () => {
					a.rect(x, top + 16, 38, 20, 'bx');
					a.rect(x, top + 16, 38, 20, `k${s}`);
					a.text(x + 19, top + 30, oid, 'f10', undefined, 'm');
				});
			});
		};
		if (s === 3) a.g({ out: true, step: 3 }, bucket);
		else bucket();
	});

	// the result
	a.row(10, 280, [{ w: 90, text: 'store_id', align: 'e' }, { w: 90, text: 'COUNT(*)', align: 'e' }], { head: true });
	STORES.forEach((s, k) => {
		const row = () =>
			a.g({ in: true, step: 2, delay: 0.4 * k }, () =>
				a.row(10, 300 + 20 * k, [{ w: 90, text: s, align: 'e' }, { w: 90, text: COUNT[s], align: 'e' }], { tint: `k${s}` }),
			);
		if (s === 3) a.g({ out: true, step: 3 }, row);
		else row();
	});

	a.text(10, 382, 'HAVING COUNT(*) >= 3 keeps stores 2 and 1', 'f11 b', { in: true, step: 3 });
	a.text(10, 398, "Orders 1719 to 1728 only; the lesson's query uses 500.", 'f11 mu');
	return a;
}

// S8 GROUP BY and HAVING: ten real orders (1719 to 1728 of cafe-sales v1) gather by store_id and collapse to one row each.
// Checked with DuckDB 2.0.0: SELECT store_id, COUNT(*) FROM orders WHERE order_id BETWEEN 1719 AND 1728 GROUP BY store_id
// gives store 2: 5, store 1: 3, store 3: 2.
import { anim } from '../lib/step-animation.mjs';

// order_id, store_id in the order they were placed
const ORDERS = [
	[1719, 2], [1720, 1], [1721, 3], [1722, 2], [1723, 1],
	[1724, 3], [1725, 2], [1726, 2], [1727, 2], [1728, 1],
];
const GROUPS = [2, 1, 3]; // order of the stacks, biggest first
const PITCH = 20;
const TOP = 60; // y of the first row
const GAP = 10; // between stacks

export default function make() {
	const a = anim({
		id: 'gbh',
		h: 334,
		title: 'GROUP BY collapses ten orders into one row per store, and HAVING drops a small group',
		desc:
			'Ten orders, 1719 to 1728, each with a store_id. Orders of the same store sit together: store 2 has five, store 1 has three and store 3 has two. Each group collapses into one result row with COUNT(*): store 2, 5; store 1, 3; store 3, 2. HAVING COUNT(*) at least 3 keeps stores 2 and 1 and drops store 3, shown dimmed. This is a ten-order sample; the lesson query uses 500 on the full table.',
		steps: [
			{ at: 0, text: 'Ten orders, in the order they were placed. Each takes the shade of its store_id.' },
			{ at: 2, text: 'GROUP BY puts orders with the same store_id together: store 2 has five, store 1 has three, store 3 has two.' },
			{ at: 4.6, text: 'Each group collapses into one result row, and COUNT(*) counts the rows inside it: 5, 3 and 2.' },
			{ at: 7, text: 'HAVING COUNT(*) >= 3 tests the finished groups. Store 3 counted only 2, so its group is dropped.' },
		],
	});

	a.text(10, 20, 'Ten orders, GROUP BY store_id', 'f14 b');
	a.row(10, 40, [{ w: 90, text: 'order_id', align: 'e' }, { w: 70, text: 'store_id', align: 'e' }], { head: true });
	a.row(190, 40, [{ w: 80, text: 'store_id', align: 'e' }, { w: 80, text: 'COUNT(*)', align: 'e' }], { head: true });

	// final y of each row: stacks in GROUPS order, gaps between
	let y = TOP;
	for (const store of GROUPS) {
		const rows = ORDERS.map(([id, s], i) => ({ id, s, i })).filter((r) => r.s === store);
		const top = y;
		const stack = () => {
			for (const r of rows) {
				const dy = TOP + PITCH * r.i - y; // where it starts: its slot in placement order
				a.g({ mv: [0, dy], step: 1, delay: 0.2 * r.i }, () =>
					a.row(10, y, [{ w: 90, text: r.id, align: 'e' }, { w: 70, text: r.s, align: 'e' }], {
						tint: `k${store}`,
						tintFx: { in: true, step: 0 },
					}),
				);
				y += PITCH;
			}
			const bottom = y;
			a.g({ in: true, step: 2, delay: 0.2 * GROUPS.indexOf(store) }, () => {
				a.path(`M172 ${top + 2}H177V${bottom - 2}H172M177 ${(top + bottom) / 2}H188`);
				a.row(190, top, [{ w: 80, text: store, align: 'e' }, { w: 80, text: rows.length, align: 'e' }], { tint: `k${store}` });
			});
		};
		if (store === 3) a.g({ out: true, step: 3 }, stack);
		else stack();
		y += GAP;
	}

	a.text(10, 304, 'HAVING COUNT(*) >= 3 keeps stores 2 and 1', 'f11 b', { in: true, step: 3 });
	a.text(10, 322, "Orders 1719 to 1728 only; the lesson's query uses 500.", 'f11 mu');
	return a;
}

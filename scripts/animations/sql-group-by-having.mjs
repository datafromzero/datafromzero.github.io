// S8 GROUP BY and HAVING: ten real orders (1719 to 1728 of cafe-sales v1), five steps the learner advances one at a time:
// input rows, GROUP BY shades them by store, they gather into one bucket per store, each bucket collapses to one row with
// COUNT(*), HAVING drops the small group. Parts only fade in at their own slot, so text never overlaps at any moment.
// Checked with DuckDB 2.0.0: SELECT store_id, COUNT(*) FROM orders WHERE order_id BETWEEN 1719 AND 1728 GROUP BY store_id
// gives store 2: 5, store 1: 3, store 3: 2.
import { anim, tint, edge } from '../lib/step-animation.mjs';

// order_id, store_id in the order they were placed
const ORDERS = [
	[1719, 2], [1720, 1], [1721, 3], [1722, 2], [1723, 1],
	[1724, 3], [1725, 2], [1726, 2], [1727, 2], [1728, 1],
];
const STORES = [2, 1, 3]; // bucket order, biggest first
const COUNT = Object.fromEntries(STORES.map((s) => [s, ORDERS.filter((o) => o[1] === s).length]));
const SHADE = { 1: tint('grp', 1), 2: tint('grp', 2), 3: tint('grp', 4) }; // three shades of the GROUP BY hue

export default function make({ id = 'gbh' } = {}) {
	const a = anim({
		id,
		h: 406,
		title: 'GROUP BY drops ten orders into one bucket per store, and HAVING drops a small bucket',
		desc:
			'Five steps. Ten orders, 1719 to 1728, each with a store_id. GROUP BY gives each store its own shade and gathers the orders into one bucket per store: store 2 gets five, store 1 gets three and store 3 gets two. Each bucket becomes one result row with COUNT(*): store 2, 5; store 1, 3; store 3, 2. HAVING COUNT(*) at least 3 keeps stores 2 and 1 and drops store 3, shown dimmed. This is a ten-order sample; the lesson query uses 500 on the full table.',
		steps: [
			{
				role: 'src',
				clause: 'FROM',
				text: 'Ten orders from the sample, in the order they were placed. Each row has an order_id and a store_id.',
				predict: 'GROUP BY store_id will make one group per store. How many groups will there be, and how many rows will go into each?',
			},
			{
				role: 'grp',
				clause: 'GROUP BY',
				text: 'GROUP BY store_id gives every row the shade of its store. Rows with the same store_id belong to the same group.',
			},
			{ role: 'grp', clause: 'GROUP BY', text: 'The rows gather into one bucket per store, in the order they were placed.' },
			{
				role: 'out',
				clause: 'COUNT(*)',
				text: 'Each bucket collapses to one result row, and COUNT(*) is the number of rows the bucket held.',
				predict: 'HAVING COUNT(*) >= 3 will test each of these rows. Which ones will it keep?',
			},
			{
				role: 'flt',
				clause: 'HAVING',
				text: "HAVING COUNT(*) >= 3 keeps a row only if its group has at least 3 rows; a row that fails is dropped (dimmed). Compare it with your prediction. This is a ten-order sample; the lesson's query uses 500 on the full table.",
			},
		],
	});

	a.text(10, 20, 'Ten orders, GROUP BY store_id', 'f14 b');

	// the input: ten rows that stay where they are; GROUP BY shades them at step 2
	a.row(10, 40, [{ w: 60, text: 'order_id', align: 'e' }, { w: 56, text: 'store_id', align: 'e' }], { head: true, tint: tint('src', 2) });
	ORDERS.forEach(([oid, s], i) =>
		a.row(10, 60 + 20 * i, [{ w: 60, text: oid, align: 'e' }, { w: 56, text: s, align: 'e' }], {
			tint: SHADE[s],
			tintFx: { in: 2 },
		}),
	);

	// the buckets (step 3): one chip per order, in placement order
	a.text(140, 36, 'one bucket per store_id', 'f11 b', { in: 3 });
	STORES.forEach((s, k) => {
		const top = 46 + 64 * k;
		const bucket = () => {
			a.rect(138, top, 212, 42, edge('grp'));
			a.text(145, top + 12, `store_id ${s}`, 'f10 b');
			let slot = 0;
			ORDERS.forEach(([oid, os]) => {
				if (os !== s) return;
				const x = 145 + 40 * slot++;
				a.rect(x, top + 17, 36, 20, 'bx');
				a.rect(x, top + 17, 36, 20, SHADE[s]);
				a.text(x + 18, top + 31, oid, 'f10', undefined, 'm');
			});
		};
		a.g({ in: 3, ...(s === 3 ? { out: 5 } : {}) }, bucket);
	});

	// the result (step 4); HAVING dims store 3 (step 5)
	a.text(10, 272, 'one row per bucket', 'f11 b', { in: 4 });
	a.g({ in: 4 }, () =>
		a.row(10, 280, [{ w: 90, text: 'store_id', align: 'e' }, { w: 90, text: 'COUNT(*)', align: 'e' }], { head: true, tint: tint('out', 2), tintCols: [1, 1] }),
	);
	STORES.forEach((s, k) =>
		a.g({ in: 4, ...(s === 3 ? { out: 5 } : {}) }, () =>
			a.row(10, 300 + 20 * k, [{ w: 90, text: s, align: 'e' }, { w: 90, text: COUNT[s], align: 'e' }], { tint: SHADE[s] }),
		),
	);
	a.text(200, 354, 'dropped', 'f11 b', { in: 5 });
	a.text(10, 382, 'HAVING COUNT(*) >= 3 keeps stores 2 and 1', 'f11 b', { in: 5 });
	a.text(10, 398, "Orders 1719 to 1728 only; the lesson's query uses 500.", 'f11 mu');
	return a;
}

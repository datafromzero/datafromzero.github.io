// S19 INNER JOIN: the 7 order_items lines of orders 1001 to 1003 against 5 of the 16 products of cafe-sales v1, five steps
// the learner advances one at a time: the two tables, ON matches product 1, then 6, then 10 and 15, then product 16 has
// nothing to pair with. The result is drawn grouped by product so each match appends rows in one block (a join promises
// no row order). Parts only fade in at their own slot, so text never overlaps at any moment.
// Checked with DuckDB 2.0.0: order_items JOIN products ON product_id for order_id 1001 to 1003 returns 7 rows;
// products 1, 6 and 10 pair twice, 15 once, 16 never (result rows 2, 4, 7 after products 1, 6, 10 and 15). Live counters, a Key idea
// and What changed per step (D41); each shows only at its own step, so step 1 gives nothing of the Predict away.
import { anim, tint, edge } from '../lib/step-animation.mjs';

// order_item_id, product_id
const LINES = [[5001, 10], [5002, 6], [5003, 1], [5004, 10], [5005, 15], [5006, 6], [5007, 1]];
const PRODUCTS = [[1, 'Espresso'], [6, 'Cold Brew'], [10, 'Croissant'], [15, 'Turkey Sandwich'], [16, 'Pumpkin Spice Latte']];
const NAME = Object.fromEntries(PRODUCTS);
const PAIRS = Object.fromEntries(PRODUCTS.map(([p]) => [p, LINES.filter((l) => l[1] === p).length]));
const STEP = { 1: 2, 6: 3, 10: 4, 15: 4, 16: 5 }; // the step at which each key is matched (or found unmatched)
const SHADE = { 1: tint('mat', 1), 6: tint('mat', 2), 10: tint('mat', 3), 15: tint('mat', 4) }; // four shades of the ON hue
const RESULT = [...LINES].sort((x, y) => PRODUCTS.findIndex((p) => p[0] === x[1]) - PRODUCTS.findIndex((p) => p[0] === y[1]) || x[0] - y[0]);

const frame = (step) => ({ in: step, ...(step < 5 ? { hide: step + 1 } : {}) }); // shown in its own step only (the last stays)

export default function make({ id = 'ij' } = {}) {
	const a = anim({
		id,
		h: 414,
		title: 'INNER JOIN pairs each line with its product and drops the product with no line',
		desc:
			'Five steps. Two tables: seven order_items lines with product_ids 10, 6, 1, 10, 15, 6 and 1, and five products: 1 Espresso, 6 Cold Brew, 10 Croissant, 15 Turkey Sandwich and 16 Pumpkin Spice Latte, with a pairs column. ON matches product_ids one key at a time, each key with its own shade. Products 1, 6 and 10 each match 2 lines and product 15 matches 1, and each pair is one row of the result, seven rows in all. Product 16 matches no line, so it has 0 pairs, is dimmed and is absent from the result.',
		steps: [
			{
				role: 'src',
				clause: 'JOIN',
				text: 'Two tables: seven order_items lines and five of the sixteen products. They share the column product_id.',
				predict: 'INNER JOIN keeps every pair of rows whose product_ids are equal. Which product will have no line to pair with, and how many rows will the result have?',
				counts: [{ label: 'lines', value: 7 }, { label: 'products', value: 5 }],
				key: 'A join starts from two tables that share a column.',
				changes: [['+', 'table order_items, 7 lines'], ['+', 'table products, 5 rows']],
			},
			{
				role: 'mat',
				clause: 'ON',
				text: 'ON order_items.product_id = products.product_id matches product 1: every line with product_id 1 pairs with Espresso, and each pair adds one row to the result.',
				counts: [{ label: 'result rows', value: 2, role: 'mat' }],
				key: 'ON decides which rows pair up: every pair with equal keys becomes one result row.',
				changes: [['+', '2 rows for product 1'], ['+', 'column product_name']],
			},
			{
				role: 'mat',
				clause: 'ON',
				text: 'Product 6 is matched the same way: every line with product_id 6 pairs with Cold Brew.',
				counts: [{ label: 'result rows', value: 4 }],
				key: 'One product can match many lines, and every match adds its own row.',
				changes: [['+', '2 rows for product 6']],
			},
			{
				role: 'mat',
				clause: 'ON',
				text: 'Products 10 and 15 are matched the same way, and their pairs join the result.',
				counts: [{ label: 'result rows', value: 7 }],
				key: 'The same test runs for every key, and the result only ever grows by pairs.',
				changes: [['+', '3 rows for products 10 and 15']],
			},
			{
				role: 'mat',
				clause: 'ON',
				text: 'A product that matches no line adds nothing to the result, so INNER JOIN drops it and its row is dimmed. Compare the result with your prediction.',
				counts: [{ label: 'no match', value: 1, role: 'flt' }],
				key: 'INNER JOIN keeps only matches: a row with no partner leaves no trace in the result.',
				changes: [['−', 'product 16 left out (no lines)'], ['~', 'the result stays at 7 rows']],
			},
		],
	});

	a.text(10, 20, 'order_items: 7 lines', 'f11 b');
	a.text(150, 20, 'products: 5 of 16 rows', 'f11 b');
	a.row(10, 30, [{ w: 72, text: 'order_item_id', align: 'e' }, { w: 60, text: 'product_id', align: 'e' }], { head: true, tint: tint('src', 2) });
	a.row(150, 30, [{ w: 58, text: 'product_id', align: 'e' }, { w: 106, text: 'product_name' }, { w: 36, text: 'pairs', align: 'e' }], { head: true, tint: tint('src', 2) });
	LINES.forEach(([oi, p], i) =>
		a.row(10, 50 + 20 * i, [{ w: 72, text: oi, align: 'e' }, { w: 60, text: p, align: 'e' }], { tint: SHADE[p], tintCols: [1, 1], tintFx: { in: STEP[p] } }),
	);
	PRODUCTS.forEach(([p, name], j) => {
		const y = 50 + 20 * j;
		const body = () => {
			a.row(150, y, [{ w: 58, text: p, align: 'e' }, { w: 106, text: name, c: 'f10' }, { w: 36, text: '' }], PAIRS[p] ? { tint: SHADE[p], tintCols: [0, 0], tintFx: { in: STEP[p] } } : {});
			a.text(345, y + 14, PAIRS[p], 'f11 b', { in: STEP[p] }, 'e');
		};
		if (PAIRS[p]) body();
		else a.g({ out: STEP[p] }, body);
	});
	// a frame marks the key matched in this step only
	for (const step of [2, 3, 4, 5]) {
		const keys = PRODUCTS.filter(([p]) => STEP[p] === step).map(([p]) => p);
		for (const p of keys) {
			const j = PRODUCTS.findIndex((q) => q[0] === p);
			a.rect(150, 50 + 20 * j, 200, 20, edge(PAIRS[p] ? 'mat' : 'flt'), frame(step));
			LINES.forEach(([, lp], i) => {
				if (lp === p) a.rect(10, 50 + 20 * i, 132, 20, edge('mat'), frame(step));
			});
		}
	}

	a.text(10, 222, 'Result of the join on product_id', 'f11 b', { in: 2 });
	a.g({ in: 2 }, () =>
		a.row(10, 230, [{ w: 100, text: 'order_item_id', align: 'e' }, { w: 70, text: 'product_id', align: 'e' }, { w: 170, text: 'product_name' }], { head: true, tint: tint('out', 2) }),
	);
	RESULT.forEach(([oi, p], i) =>
		a.row(10, 250 + 20 * i, [{ w: 100, text: oi, align: 'e' }, { w: 70, text: p, align: 'e' }, { w: 170, text: NAME[p] }], {
			fx: { in: STEP[p] },
			tint: SHADE[p],
			tintCols: [1, 2],
		}),
	);
	a.text(10, 404, 'Product 16 has no line to pair with: it drops out, 7 rows.', 'f11 b', { in: 5 });
	return a;
}

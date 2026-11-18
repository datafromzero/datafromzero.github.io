// S19 INNER JOIN: the 7 order_items lines of orders 1001 to 1003 against 5 of the 16 products of cafe-sales v1.
// Checked with DuckDB 2.0.0: order_items JOIN products ON product_id for order_id 1001 to 1003 returns 7 rows;
// products 1, 6 and 10 pair twice, 15 once, 16 never. Result rows only fade in (no travel across other text).
import { anim } from '../lib/step-animation.mjs';

// order_item_id, product_id
const LINES = [[5001, 10], [5002, 6], [5003, 1], [5004, 10], [5005, 15], [5006, 6], [5007, 1]];
const PRODUCTS = [[1, 'Espresso'], [6, 'Cold Brew'], [10, 'Croissant'], [15, 'Turkey Sandwich'], [16, 'Pumpkin Spice Latte']];
const NAME = Object.fromEntries(PRODUCTS);
const PAIRS = Object.fromEntries(PRODUCTS.map(([p]) => [p, LINES.filter((l) => l[1] === p).length]));
// one shade per matching key (k0 is a neutral gray)
const SHADE = { 1: 'k1', 6: 'k2', 10: 'k3', 15: 'k0' };

export default function make({ id = 'ij' } = {}) {
	const a = anim({
		id,
		h: 414,
		title: 'INNER JOIN pairs each line with its product and drops the product with no line',
		desc:
			'Two tables: seven order_items lines with product_ids 10, 6, 1, 10, 15, 6 and 1, and five products: 1 Espresso, 6 Cold Brew, 10 Croissant, 15 Turkey Sandwich and 16 Pumpkin Spice Latte, with a pairs column. Matching product_ids share a shade. Each line pairs with its product and becomes one row of the result, seven rows in all, so products 1, 6 and 10 each have 2 pairs and product 15 has 1. Product 16 has 0 pairs, so it is dimmed and absent from the result.',
		steps: [
			{ at: 0, text: 'Two tables share product_id. Each matching key gets its own shade on both sides; product 16 has no match.' },
			{ at: 2, text: 'Each line pairs with the product that has its product_id, one line at a time, and every pair becomes one row of the result.' },
			{ at: 5.4, text: 'A key that repeats pairs more than once: products 1, 6 and 10 each match two lines, product 15 one. The pairs column counts them.' },
			{ at: 7.6, text: 'Product 16 matched no line (0 pairs), so it drops out of the result: 7 lines in, 7 rows out.' },
		],
	});

	a.text(10, 20, 'order_items: 7 lines', 'f11 b');
	a.text(150, 20, 'products: 5 of 16 rows', 'f11 b');
	a.row(10, 30, [{ w: 72, text: 'order_item_id', align: 'e' }, { w: 60, text: 'product_id', align: 'e' }], { head: true });
	a.row(150, 30, [{ w: 58, text: 'product_id', align: 'e' }, { w: 106, text: 'product_name' }, { w: 36, text: 'pairs', align: 'e' }], { head: true });
	LINES.forEach(([oi, p], i) => {
		a.row(10, 50 + 20 * i, [{ w: 72, text: oi, align: 'e' }, { w: 60, text: p, align: 'e' }]);
		a.rect(82, 50 + 20 * i, 60, 20, SHADE[p], { in: true, step: 0 });
	});
	PRODUCTS.forEach(([p, name], j) => {
		const y = 50 + 20 * j;
		const body = () => {
			a.row(150, y, [{ w: 58, text: p, align: 'e' }, { w: 106, text: name, c: 'f10' }, { w: 36, text: '' }]);
			if (PAIRS[p]) a.rect(150, y, 58, 20, SHADE[p], { in: true, step: 0 });
			a.text(345, y + 14, PAIRS[p], 'f11 b', { in: true, step: PAIRS[p] ? 2 : 3 }, 'e');
		};
		if (PAIRS[p]) body();
		else a.g({ out: true, step: 3 }, body);
	});

	a.text(10, 222, 'Result of the join on product_id: 7 rows', 'f11 b');
	a.row(10, 230, [{ w: 100, text: 'order_item_id', align: 'e' }, { w: 70, text: 'product_id', align: 'e' }, { w: 170, text: 'product_name' }], { head: true });
	LINES.forEach(([oi, p], i) =>
		a.g({ in: true, step: 1, delay: 0.4 * i }, () =>
			a.row(10, 250 + 20 * i, [{ w: 100, text: oi, align: 'e' }, { w: 70, text: p, align: 'e' }, { w: 170, text: NAME[p] }], { tint: SHADE[p] }),
		),
	);
	a.text(10, 404, 'Product 16 has no line to pair with, so it drops out.', 'f11 mu', { in: true, step: 3 });
	return a;
}

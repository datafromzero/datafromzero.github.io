// S19 INNER JOIN: the 7 order_items lines of orders 1001 to 1003 against 5 of the 16 products of cafe-sales v1.
// Checked with DuckDB 2.0.0: order_items JOIN products ON product_id for order_id 1001 to 1003 returns 7 rows;
// products 1, 6 and 10 pair twice, 15 once, 16 never.
import { anim } from '../lib/step-animation.mjs';

// order_item_id, product_id
const LINES = [[5001, 10], [5002, 6], [5003, 1], [5004, 10], [5005, 15], [5006, 6], [5007, 1]];
const PRODUCTS = [[1, 'Espresso'], [6, 'Cold Brew'], [10, 'Croissant'], [15, 'Turkey Sandwich'], [16, 'Pumpkin Spice Latte']];
const NAME = Object.fromEntries(PRODUCTS);
const PAIRS = Object.fromEntries(PRODUCTS.map(([id]) => [id, LINES.filter((l) => l[1] === id).length]));

export default function make() {
	const a = anim({
		id: 'ij',
		h: 414,
		title: 'INNER JOIN pairs each line with its product and drops the product with no line',
		desc:
			'Two tables side by side: seven order_items lines with product_ids 10, 6, 1, 10, 15, 6 and 1, and five products: 1 Espresso, 6 Cold Brew, 10 Croissant, 15 Turkey Sandwich and 16 Pumpkin Spice Latte. Matching product_ids are shaded. Each line pairs with its product and becomes one row of the result, seven rows in all, so products 1, 6 and 10 each appear twice. Product 16 matches no line, so it is dimmed and absent from the result.',
		steps: [
			{ at: 0, text: 'Two tables share product_id. The matching values light up on both sides; product 16 has no match.' },
			{ at: 2, text: 'Each line pairs with the product that has its product_id, and every pair becomes one row of the result.' },
			{ at: 5.4, text: 'A key that repeats pairs more than once: products 1, 6 and 10 each match two lines, product 15 one.' },
			{ at: 7.6, text: 'Product 16 matched no line, so it drops out of the result: 7 lines in, 7 rows out.' },
		],
	});

	a.text(10, 20, 'order_items: 7 lines', 'f11 b');
	a.text(176, 20, 'products: 5 of 16 rows', 'f11 b');
	a.row(10, 30, [{ w: 82, text: 'order_item_id', align: 'e' }, { w: 68, text: 'product_id', align: 'e' }], { head: true });
	a.row(176, 30, [{ w: 68, text: 'product_id', align: 'e' }, { w: 106, text: 'product_name' }], { head: true });
	LINES.forEach(([id, p], i) => {
		a.row(10, 50 + 20 * i, [{ w: 82, text: id, align: 'e' }, { w: 68, text: p, align: 'e' }]);
		a.rect(92, 50 + 20 * i, 68, 20, 'k2', { in: true, step: 0 });
	});
	PRODUCTS.forEach(([id, name], j) => {
		const body = () => {
			a.row(176, 50 + 20 * j, [{ w: 68, text: id, align: 'e' }, { w: 106, text: name, c: 'f10' }]);
			if (PAIRS[id]) a.rect(176, 50 + 20 * j, 68, 20, 'k2', { in: true, step: 0 });
			a.text(168, 50 + 20 * j + 14, `×${PAIRS[id]}`, 'f11 b', { in: true, step: 2 + (PAIRS[id] ? 0 : 1) }, 'm');
		};
		if (PAIRS[id]) body();
		else a.g({ out: true, step: 3 }, body);
	});

	a.text(10, 222, 'Result of the join on product_id: 7 rows', 'f11 b');
	a.row(10, 230, [{ w: 100, text: 'order_item_id', align: 'e' }, { w: 70, text: 'product_id', align: 'e' }, { w: 170, text: 'product_name' }], { head: true });
	LINES.forEach(([id, p], i) => {
		const rowY = 250 + 20 * i;
		a.g({ mv: [0, -(rowY - (50 + 20 * i))], step: 1, delay: 0.4 * i }, () =>
			a.g({ in: true, step: 1, delay: 0.4 * i }, () =>
				a.row(10, rowY, [{ w: 100, text: id, align: 'e' }, { w: 70, text: p, align: 'e' }, { w: 170, text: NAME[p] }], { tint: 'k1' }),
			),
		);
	});
	a.text(10, 404, 'Product 16 has no line to pair with, so it drops out.', 'f11 mu', { in: true, step: 3 });
	return a;
}

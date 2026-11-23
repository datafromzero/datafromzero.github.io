// Concept animation (SPEC D41, no real data) for how a filter travels in a BI model (Data Analyst lesson 9, bi-modeling-for-dashboards).
// Metaphor: a filter set on a table of the one side flows to the many side and stops there. Three tables joined as crow's foot links
// (LESSON-STANDARD "Entity-relationship diagrams"): products (PK), order_items (FK to products and to orders, four abstract lines) and orders (PK).
// 8 s loop of 8 phases in five steps: 1 the three tables and two links; 2 a filter on products (a chip, a ring); 3 and 4 the filter reaches
// order_items: two of the four lines are tinted and counted; 5 and 6 orders is not reached (a note: all rows stay); 7 and 8 a count of order keys
// taken from order_items is the one that follows the filter.
// Facts: the single-direction filter flow of Microsoft Learn, "Create and manage relationships in Power BI Desktop" (Cross filter direction, Single:
// filtering choices in connected tables work on the table where values are being aggregated), and Tableau's relationships page (opened 2026-11-23).
// It shows a modeling rule, not engine output, and no number of the lesson: the Predict of unit 4 asks for counts the figure does not give.
// Counters (D41): filters 1, tables reached 1 then 2, lines kept (text), orders (text), each at the phase it appears.
// The step label is drawn by the generator at the top left; nothing else is drawn there.
import { anim, edge, tint } from '../lib/step-animation.mjs';

const PX = 4; // products box
const IX = 140; // order_items box
const OX = 276; // orders box
const BW = 80;

export default function make({ id = 'ff' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'A filter flows from the one side to the many side and stops there',
		desc:
			'Three tables. Products on the left, order_items in the middle with four lines, and orders on the right. A line labeled sold in joins the primary key of products to the product foreign key of order_items: each product is sold in zero or many lines and each line has exactly one product. A line labeled contains joins the primary key of orders to the order foreign key of order_items: each order contains one or many lines and each line belongs to exactly one order. A filter, category equals A, is set on products. It reaches order_items, where two of the four lines are kept and shaded. It does not reach orders, which keeps all its rows. A count of order keys taken from the order_items lines follows the filter.',
		caption: 'A filter set on a one-side table reaches the many-side rows that match it, and it does not climb back to the table at the other end. Count from the table the filter reaches.',
		phases: [
			[1, 'Three tables, two links', { role: 'src', key: 'Each link joins a key of the one side to the matching key of the many side.', changes: [['+', '3 tables'], ['+', '2 links']] }],
			[2, 'A filter on products', { role: 'flt', key: 'A filter is set on a column of one table, here the category of a product.', changes: [['+', '1 filter']] }],
			[3, 'It reaches the lines', { role: 'mat', key: 'The filter keeps only the many-side rows that match it.', changes: [['+', '2 of 4 lines kept']] }],
			[5, 'It stops at the fact table', { role: 'flt', key: 'It does not climb from the many side to the other table, so orders keeps every row.', changes: [['+', 'orders unfiltered']] }],
			[7, 'Count from the lines', { role: 'out', key: 'A count taken from the lines follows the filter; a count of the other table does not.', changes: [['~', 'count the order keys on the lines']] }],
		],
		counters: [
			{ label: 'filters', role: 'flt', values: [[2, 1]] },
			{ label: 'tables', role: 'src', values: [[2, 1], [3, 2]] },
			{ label: 'lines', role: 'mat', values: [[3, '2 of 4']] },
			{ label: 'orders', role: 'flt', values: [[5, 'all']] },
		],
	});
	a.text(10, 14, 'Filters run one side to many side', 'f11 b');
	// products: title, PK row centered at y 86, one more column
	a.rect(PX, 50, BW, 72, edge('src'), undefined, 6);
	a.text(PX + 8, 65, 'products', 'f11 b');
	a.path(`M${PX} 72h${BW}`, 'bx');
	a.text(PX + 8, 90, 'PK key', 'f10 b mo');
	a.text(PX + 8, 112, 'category', 'f10');
	a.rect(PX - 3, 47, BW + 6, 78, 's-flt', { in: 2, hide: 3, pulse: true }, 8);
	// orders: title, PK row centered at y 114
	a.rect(OX, 78, BW, 50, edge('src'), undefined, 6);
	a.text(OX + 8, 93, 'orders', 'f11 b');
	a.path(`M${OX} 100h${BW}`, 'bx');
	a.text(OX + 8, 118, 'PK key', 'f10 b mo');
	// order_items: title, the two FK rows (86 and 114) and four lines; tints first, then text
	a.rect(IX, 40, BW, 172, edge('out'), undefined, 6);
	[0, 2].forEach((i) => a.rect(IX + 4, 140 + 18 * i, BW - 8, 16, tint('mat', 2), { in: 3 }, 3));
	a.text(IX + 8, 55, 'order_items', 'f11 b');
	a.path(`M${IX} 62h${BW}`, 'bx');
	a.text(IX + 8, 90, 'FK product', 'f10 b mo');
	a.text(IX + 8, 118, 'FK order', 'f10 b mo');
	[0, 1, 2, 3].forEach((i) => a.text(IX + 10, 152 + 18 * i, `line ${i + 1}`, 'f10'));
	a.link([[PX + BW, 86], [IX, 86]], '1', '0..*', { verb: 'sold in' });
	a.link([[OX, 114], [IX + BW, 114]], '1', '1..*', { verb: 'contains' });
	// the filter, its reach and its limit
	a.chip(PX, 134, 'category = A', { role: 'flt', level: 2, w: BW + 4, fx: { in: 2 } });
	a.chip(IX - 10, 222, 'lines kept: 2 of 4', { role: 'mat', level: 2, w: BW + 20, fx: { in: 3 } });
	a.text(OX + BW / 2, 150, 'all rows stay', 'f10 b', { in: 5 }, 'm');
	a.text(OX + BW / 2, 164, 'not reached', 'f10', { in: 5 }, 'm');
	a.chip(OX - 16, 222, 'count order keys', { role: 'out', level: 3, w: BW + 16, fx: { in: 7 } });
	return a;
}

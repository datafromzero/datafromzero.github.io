// Concept animation (SPEC D41, no real data) for a many-to-many relationship. Metaphor: a link that joins many to many becomes a table of its own.
// 8 s loop of 8 phases: 1 tables A and B with two rows each; 2 and 3 one link draws from the PK row of A to the PK row of B with a crow's
// foot at both ends (zero or many on each side: each side meets many of the other; LESSON-STANDARD "Entity-relationship diagrams") and a note
// says many to many; 4 the link is replaced by a new table L between them and two links, A to L and B to L, each with 1 at the A or B end
// and 0..* at the L end, which hold the foreign keys; 5 a bracket marks the two key columns; 6 a value column n fills in, one fact for each
// pair; 7 a note says n describes the pair; 8 hold.
// Facts: a modeling pattern, not engine output. The cafe example behind it (order_items, DuckDB 2.0.0: 3,287 lines, 1,800 orders, 15 products)
// is in the lesson; this figure stays abstract and shows no result that a Predict of the lesson asks for.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, edge } from '../lib/step-animation.mjs';

const ROW = [104, 132, 160]; // top of the three rows of table L

export default function make({ id = 'lk' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'A many-to-many link becomes a table of its own',
		desc:
			'Table A has rows A1 and A2, table B has rows B1 and B2. One line joins the key row of A to the key row of B and ends in a crow\'s foot at both ends, zero or many (0..*) on each side: each side meets many of the other. The line is then replaced by a new table L between them, with one row for each pair of keys, each holding a key for A and a key for B. Two lines now join the key row of A and the key row of B to the foreign key row of L: exactly one A row (1) and zero or many L rows (0..*), and the same for B. A bracket marks the two key columns. A value column n then fills in beside them: one fact for each pair.',
		caption: 'When each side can have many of the other, the link becomes a table with one key for each side. A fact about the pair, here n, belongs in that table.',
		phases: [
			[1, 'Two tables, A and B', { role: 'src', key: 'Each kind of thing gets a table, and each row has its own key.', changes: [['+', 'table A: 2 rows'], ['+', 'table B: 2 rows']] }],
			[2, 'Each side meets many of the other', { role: 'mat', key: 'One A can go with many B, and one B with many A: a column on either table cannot hold it.', changes: [['+', 'a many-to-many link between A and B']] }],
			[4, 'The link becomes a table L', { role: 'out', key: 'The link becomes a new table, with one row for each pair and a key for A and a key for B.', changes: [['+', 'table L: 3 rows'], ['−', 'the A to B link is gone']] }],
			[5, 'Each row holds two keys', { role: 'mat', key: 'A key column in L points at A, and the other points at B.', changes: [['+', '2 key columns in L']] }],
			[6, 'A fact about the pair goes in L', { role: 'out', key: 'A value that belongs to the pair, not to A or B alone, sits in the link table.', changes: [['+', 'column n: 1 fact for each pair']] }],
		],
		counters: [
			{ label: 'tables', role: 'src', values: [[1, 2], [4, 3]] },
			{ label: 'links', role: 'mat', values: [[2, 1], [4, 2]] },
			{ label: 'L rows', role: 'out', values: [[4, 3]] },
			{ label: 'keys', role: 'mat', values: [[5, '2 in L']] },
			{ label: 'facts', role: 'out', values: [[6, 'n']] },
		],
	});
	a.text(10, 14, 'Many to many becomes a table', 'f11 b');
	// table A (left) and table B (right): a title row, a key row (PK) and two rows
	[['A', 10, 'PK a'], ['B', 280, 'PK b']].forEach(([t, x, pk]) => {
		a.rect(x, 50, 70, 110, edge('src'), undefined, 6);
		a.text(x + 8, 65, t, 'f11 b');
		a.path(`M${x} 72h70`, 'bx');
		a.text(x + 8, 90, pk, 'f10 b mo');
		a.chip(x + 10, 104, `${t}1`, { role: 'src', level: 3, w: 50 });
		a.chip(x + 10, 132, `${t}2`, { role: 'src', level: 3, w: 50 });
	});
	// the link A to B, drawn in phases 2 and 3, gone when L appears
	a.link([[80, 86], [280, 86]], '0..*', '0..*', { sideA: 'above', sideB: 'above' }, { in: 2, hide: 4, draw: true });
	a.text(180, 118, 'many ↔ many', 'f10 b', { in: 3, hide: 4 }, 'm');
	// table L (middle), from phase 4: a title row, a key row and one row for each pair
	a.box(120, 50, 120, 140, { role: 'out', title: 'L', fx: { in: 4 } });
	a.path('M120 72h120', 'bx', { in: 4 });
	a.text(126, 90, 'FK a · FK b', 'f10 b mo', { in: 4 });
	a.text(215, 90, 'n', 'f10 b mo', { in: 6 }, 'm');
	[['A1 · B1', 'n1'], ['A1 · B2', 'n2'], ['A2 · B2', 'n3']].forEach(([keys, val], i) => {
		a.chip(126, ROW[i], keys, { role: 'out', level: 2, w: 66, fx: { in: 4 } });
		a.chip(196, ROW[i], val, { role: 'out', level: 3, w: 38, fx: { in: 6 } });
	});
	a.link([[80, 86], [120, 86]], '1', '0..*', { sideA: 'above', sideB: 'below' }, { in: 4, draw: true });
	a.link([[280, 86], [240, 86]], '1', '0..*', { sideA: 'above', sideB: 'below' }, { in: 4, draw: true });
	a.rect(122, 100, 74, 88, 's-mat dsh', { in: 5 }, 6);
	a.text(160, 210, 'two key columns', 'f10 b', { in: 5 }, 'm');
	a.text(180, 236, 'n describes the pair, not A or B alone', 'f10 b', { in: 7 }, 'm');
	return a;
}

// Concept animation (SPEC D41, no real data) for a many-to-many relationship. Metaphor: a link that joins many to many becomes a table of its own.
// 8 s loop of 8 phases: 1 tables A and B with two rows each; 2 and 3 three links draw between them (A1 to B1 and B2, then A2 to B2: each side
// meets many of the other); 4 the links turn into the rows of a new table L (one key for A and one for B in each row) and the lines go;
// 5 a bracket marks the two key columns; 6 a value column n fills in, one fact for each pair; 7 a note says n describes the pair; 8 hold.
// Facts: a modeling pattern, not engine output. The cafe example behind it (order_items, DuckDB 2.0.0: 3,287 lines, 1,800 orders, 15 products)
// is in the lesson; this figure stays abstract and shows no result that a Predict of the lesson asks for.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const ROW = [76, 106, 136]; // top of the three rows of table L

export default function make({ id = 'lk' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'A many-to-many link becomes a table of its own',
		desc:
			'Table A has rows A1 and A2, table B has rows B1 and B2. Three lines join them: A1 to B1, A1 to B2 and A2 to B2, so each side meets many of the other. The lines turn into the rows of a new table L, one row for each link, each holding a key for A and a key for B. A bracket marks the two key columns. A value column n then fills in beside them: one fact for each pair.',
		caption: 'When each side can have many of the other, the link becomes a table with one key for each side. A fact about the pair, here n, belongs in that table.',
		phases: [
			[1, 'Two tables, A and B', { role: 'src', key: 'Each kind of thing gets a table, and each row has its own key.', changes: [['+', 'table A: 2 rows'], ['+', 'table B: 2 rows']] }],
			[2, 'Each side meets many of the other', { role: 'mat', key: 'One A can go with many B, and one B with many A: a column on either table cannot hold it.', changes: [['+', '3 links between A and B']] }],
			[4, 'The links become rows of a table L', { role: 'out', key: 'Every link becomes one row of a new table, with a key for A and a key for B.', changes: [['+', 'table L: 3 rows'], ['−', 'the lines are gone']] }],
			[5, 'Each row holds two keys', { role: 'mat', key: 'A key column in L points at A, and the other points at B.', changes: [['+', '2 key columns in L']] }],
			[6, 'A fact about the pair goes in L', { role: 'out', key: 'A value that belongs to the pair, not to A or B alone, sits in the link table.', changes: [['+', 'column n: 1 fact for each pair']] }],
		],
		counters: [
			{ label: 'tables', role: 'src', values: [[1, 2], [4, 3]] },
			{ label: 'links', role: 'mat', values: [[2, 2], [3, 3], [4, 0]] },
			{ label: 'L rows', role: 'out', values: [[4, 3]] },
			{ label: 'keys', role: 'mat', values: [[5, '2 in L']] },
			{ label: 'facts', role: 'out', values: [[6, 'n']] },
		],
	});
	a.text(10, 14, 'Many to many becomes a table', 'f11 b');
	// table A (left) and table B (right)
	a.box(10, 50, 84, 128, { role: 'src', title: 'A' });
	a.box(266, 50, 84, 128, { role: 'src', title: 'B' });
	a.chip(20, 82, 'A1', { role: 'src', level: 3, w: 64 });
	a.chip(20, 132, 'A2', { role: 'src', level: 3, w: 64 });
	a.chip(276, 82, 'B1', { role: 'src', level: 3, w: 64 });
	a.chip(276, 132, 'B2', { role: 'src', level: 3, w: 64 });
	// the three links, drawn in phases 2 and 3, gone when L appears
	a.path('M84 94H276', 's-mat', { in: 2, hide: 4, draw: true });
	a.path('M84 98L276 140', 's-mat', { in: 2, hide: 4, draw: true });
	a.path('M84 144H276', 's-mat', { in: 3, hide: 4, draw: true });
	// table L (middle), from phase 4
	a.box(116, 50, 128, 128, { role: 'out', title: 'L', fx: { in: 4 } });
	[['A1 · B1', 'n1'], ['A1 · B2', 'n2'], ['A2 · B2', 'n3']].forEach(([keys, val], i) => {
		a.chip(124, ROW[i], keys, { role: 'out', level: 2, w: 72, fx: { in: 4 } });
		a.chip(200, ROW[i], val, { role: 'out', level: 3, w: 36, fx: { in: 6 } });
	});
	a.rect(120, 72, 80, 90, 's-mat dsh', { in: 5 }, 6);
	a.text(160, 196, 'two key columns', 'f10 b', { in: 5 }, 'm');
	a.text(180, 232, 'n describes the pair, not A or B alone', 'f10 b', { in: 7 }, 'm');
	return a;
}

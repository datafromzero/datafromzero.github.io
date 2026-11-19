// Concept animation (SPEC D41, no real data) for the self join. Metaphor: one table used twice, under two nicknames (aliases).
// A table T has four rows, each storing the number of another row of T as its "boss". 8 s loop of 8 phases: 1 table T; 2 a copy of its rows
// slides to the right; 3 the two copies are named T AS e and T AS b; 4 to 6 each row of e gets paired with its boss row in b (Row 2 and
// Row 3 to Row 1, Row 4 to Row 2); 7 Row 1 has no boss, so it has no pair; 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): emp(id, boss) = (1, NULL), (2, 1), (3, 1), (4, 2); emp e JOIN emp b ON e.boss = b.id
// gives (2, 1), (3, 1), (4, 2); row 1, whose boss is NULL, has no pair.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const E = ['Row 1 · boss –', 'Row 2 · boss 1', 'Row 3 · boss 1', 'Row 4 · boss 2'];
const PAIR = [[1, 0], [2, 0], [3, 1]]; // e row, b row
const Y = (i) => 62 + 30 * i;

export default function make({ id = 'sj' } = {}) {
	const a = anim({
		id,
		h: 206,
		loop: { cycle: 8 },
		title: 'A self join uses one table twice, under two names',
		desc:
			'A table T has four rows; each row notes the number of its boss row in the same table: Row 1 has none, Rows 2 and 3 have boss 1, and Row 4 has boss 2. A copy of the rows slides to the right, and the two copies are named T AS e and T AS b. Arrows then pair each row of e with its boss in b: Row 2 and Row 3 with Row 1, and Row 4 with Row 2. Row 1 has no boss, so it has no pair.',
		caption: 'A self join joins a table to itself. Aliases such as e and b give the two copies different names, so each row of one copy can be matched with a row of the other.',
		phases: [
			[1, 'One table T; rows name a boss row', { role: 'src', key: 'In one table, a row can point at another row of the same table, here its boss.', changes: [['+', 'T: 4 rows, each with a boss column']] }],
			[2, 'A copy of T slides over', { role: 'src', key: 'To match a row with another row of the same table, use the table twice.', changes: [['+', 'a second copy of T']] }],
			[3, 'Two names for one table: e and b', { role: 'mat', key: 'Aliases (e and b) give each use its own name, so SQL knows which side a column belongs to.', changes: [['+', 'e: the row'], ['+', 'b: its boss row']] }],
			[4, 'Rows pair with their boss row', { role: 'mat', key: 'Each row of e is paired with the row of b whose number matches its boss column.', changes: [['+', '3 pairs']] }],
			[7, 'Row 1 has no boss, so no pair', { role: 'flt', key: 'A row whose boss is NULL has no partner, so an inner join leaves it out.', changes: [['−', 'Row 1: no boss, no pair']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 4]] },
			{ label: 'copies', role: 'src', values: [[1, 1], [2, 2]] },
			{ label: 'pairs', role: 'mat', values: [[4, 1], [5, 2], [6, 3]] },
			{ label: 'no pair', role: 'flt', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'One table, used twice', 'f11 b');
	a.text(10, 52, 'T', 'f10 b mo', { hide: 3 });
	a.text(10, 52, 'T AS e', 'f10 b mo', { in: 3 });
	a.text(240, 52, 'T AS b', 'f10 b mo', { in: 3 });
	E.forEach((t, i) => {
		a.chip(10, Y(i), t, { role: 'src', level: 2, w: 100 });
		a.ghost(240, Y(i), 70, 24);
		a.chip(240, Y(i), `Row ${i + 1}`, { role: 'src', level: 2, w: 70, fx: { in: 3 } });
	});
	a.move({ dx: 230, at: 2, fx: { in: 2, hide: 3 } }, () => [0, 1, 2, 3].forEach((i) => a.rect(10, Y(i), 70, 24, tint('src', 3), undefined, 6)));
	PAIR.forEach(([e, b], i) => a.arrow(114, Y(e) + 12, 236, Y(b) + 12, 's-mat', { in: 4 + i, draw: true }));
	a.text(10, 196, 'Row 1 has no boss, so it has no pair', 'f10', { in: 7 });
	return a;
}

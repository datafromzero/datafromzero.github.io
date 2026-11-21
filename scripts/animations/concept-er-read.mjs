// Concept animation (SPEC D41, no real data) for reading a crow's foot line. Metaphor: read the line from both ends, each end counts the rows of
// the table it touches. 8 s loop of 8 phases: 1 a line from the PK column of P to the FK column of C, with a circle-and-bar end at P (zero or
// one) and a circle-and-foot end at C (zero or many); 2 and 3 read from P: P1 has two C rows, P2 has none; 4 and 5 read from C: C1 and C2 have one
// P row, C3 has none (empty FK); 6 an INNER JOIN drops C3; 7 a LEFT JOIN keeps C3 with an empty P side; 8 holds.
// Facts (DuckDB 2.0.0, same rule as the cafe-sales checks in sql/reading-er-diagrams): an INNER JOIN returns only paired rows, a LEFT JOIN
// returns every left row at least once with NULL for the missing side (DuckDB FROM page: "A join that is not OUTER is INNER (only rows that
// get paired are returned)"; LEFT: "All rows from the left relation appear at least once").
// Live counters (D41): rows drawn at that phase. No real numbers: P and C are placeholders.
import { anim } from '../lib/step-animation.mjs';

const MONO_Y = 52;

export default function make({ id = 'er' } = {}) {
	const a = anim({
		id,
		h: 224,
		loop: { cycle: 8 },
		title: 'Read a line from both ends',
		desc:
			'Two tables, P and C. A line joins the primary key column of P to the foreign key column of C. The end at P has a bar and a circle: zero or one. The end at C has a three-pronged foot and a circle: zero or many. Read from P: P1 has two C rows and P2 has none. Read from C: C1 and C2 each have one P row, and C3 has an empty key and no P row. An inner join drops C3. A left join keeps C3 with an empty P side.',
		caption: 'Each end of the line counts the rows of the table it touches. A circle means zero is allowed: a P row with no C rows, or a C row with no P row.',
		phases: [
			[1, 'A line from the PK to the FK', { role: 'mat', key: 'The line joins the key column of P to the foreign key column of C. Each end carries a mark.', changes: [['+', 'P: 2 rows'], ['+', 'C: 3 rows']] }],
			[2, 'Read from P: how many C rows?', { role: 'src', key: 'Stand at P: the mark at the C end says how many C rows one P row can have. A circle allows none.', changes: [['+', 'P1: two C rows'], ['+', 'P2: none']] }],
			[4, 'Read from C: how many P rows?', { role: 'out', key: 'Stand at C: the mark at the P end says how many P rows one C row can have. A circle allows none.', changes: [['+', 'C1, C2: one P row'], ['+', 'C3: none']] }],
			[6, 'INNER JOIN: C3 has no pair', { role: 'flt', key: 'An inner join returns only the rows that find a partner on the other side.', changes: [['−', 'C3 dropped'], ['~', '2 rows left']] }],
			[7, 'LEFT JOIN from C keeps C3', { role: 'mat', key: 'A left join returns every row of its left table, with empty columns where no partner exists.', changes: [['+', 'C3 back, P side empty'], ['~', '3 rows']] }],
		],
		counters: [
			{ label: 'P rows', role: 'src', values: [[1, 2]] },
			{ label: 'C rows', role: 'out', values: [[1, 3]] },
			{ label: 'INNER', role: 'flt', values: [[6, 2]] },
			{ label: 'LEFT', role: 'mat', values: [[7, 3]] },
		],
	});
	a.text(10, 14, 'Read a line from both ends', 'f11 b');
	// the line and its two ends (P end: bar and circle; C end: foot and circle), at the header level
	a.path('M56 64H65.5M61 58V70M72.5 64H206M213 64H226M216 64L226 58M216 64L226 70', 'ln', { in: 1, draw: true });
	a.circle(69, 64, 3.5, 'ln', { in: 1 });
	a.circle(209.5, 64, 3.5, 'ln', { in: 1 });
	a.text(60, MONO_Y, '0..1', 'f10 b mo', { in: 1 });
	a.text(222, MONO_Y, '0..*', 'f10 b mo', { in: 1 }, 'e');
	a.text(10, 68, 'P · PK', 'f10 b');
	a.text(232, 68, 'C · FK', 'f10 b');
	// table P
	a.chip(10, 84, 'P1', { role: 'src', level: 2, w: 90, flags: [{ role: 'src', level: 4, fx: { in: 2, hide: 4 } }] });
	a.chip(10, 134, 'P2', { role: 'src', level: 2, w: 90, flags: [{ role: 'flt', level: 3, fx: { in: 3, hide: 4 } }] });
	// table C: foreign key chip, then the row chip
	const rows = [
		[84, 'P1', 'C1', 2],
		[114, 'P1', 'C2', 2],
		[144, null, 'C3', 4],
	];
	rows.forEach(([y, fk, c, k]) => {
		const hl = c === 'C3' ? { role: 'flt', level: 3 } : { role: 'out', level: 3 };
		if (fk) a.chip(232, y, fk, { role: 'src', level: 2, w: 44, flags: [{ role: 'src', level: 4, fx: { in: 2, hide: 4 } }] });
		else a.ghost(232, y, 44, 24);
		a.chip(278, y, c, { role: 'out', level: 2, w: 44, flags: [{ role: hl.role, level: hl.level, fx: { in: k, hide: c === 'C3' ? 7 : 6 } }] });
	});
	// readings in the corridor between the tables
	a.text(108, 100, 'P1: two C rows', 'f10', { in: 2, hide: 4 });
	a.text(108, 150, 'P2: no C rows', 'f10 b f-flt', { in: 3, hide: 4 });
	a.text(222, 130, 'C1, C2: one P row', 'f10', { in: 4, hide: 6 }, 'e');
	a.text(222, 160, 'C3: no P row', 'f10 b f-flt', { in: 5, hide: 6 }, 'e');
	// joins: C3 dropped, then kept
	a.text(10, 196, 'INNER JOIN: C3 dropped', 'f10 b f-flt', { in: 6, hide: 7 });
	a.text(10, 196, 'LEFT JOIN: C3 kept, P empty', 'f10 b', { in: 7 });
	return a;
}

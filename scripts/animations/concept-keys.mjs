// Concept animation (SPEC D41, no real data) for primary and foreign keys. Metaphor: one parent row, many child rows pointing at it.
// 8 s loop of 8 phases: 1 table P, one unique key per row (PK); 2 table C, each row stores a P key (FK); 3 the crow's foot link draws from
// the PK row of P to the FK row of C (exactly one P at its end, zero or many C at the other; LESSON-STANDARD "Entity-relationship
// diagrams"), and C1 takes the shade of its P1 row; 4 and 5 C2 (to P1) and C3 (to P2) take the shade of their P row; 6 the "one to many"
// label; 7 a row C4 whose FK names a P row that does not exist is marked red and refused; 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): a PRIMARY KEY rejects a repeated or NULL value; inserting a child whose key has no parent
// fails ("Violates foreign key constraint because key does not exist in the referenced table"); a NULL foreign key is allowed.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

// child row, its FK value, the row's top y, the shade of its pair (null: no parent) and the phase it lights up
const CH = [
	['C1', 'P1', 86, 'mat', 3],
	['C2', 'P1', 112, 'mat', 4],
	['C3', 'P2', 138, 'grp', 5],
	['C4', 'P9', 164, null, 7],
];

export default function make({ id = 'ky' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'Keys link tables: one parent row, many child rows',
		desc:
			'Table P has rows P1 and P2, each with a unique primary key (PK). Table C has rows C1, C2, C3 and C4, each storing a P key as a foreign key (FK). One line joins the PK row of P to the FK row of C: exactly one P row at the P end, zero or many C rows at the C end. Matching shades show which C rows name which P row: C1 and C2 name P1, C3 names P2, so one P row has many C rows. C4 stores P9, a key that no P row has; its row is marked refused, and a dashed empty seat shows where P9 would be.',
		caption: 'A primary key identifies one row of its table. A foreign key stores that value in another table, so one parent row can have many children. A foreign key must name a parent that exists.',
		phases: [
			[1, 'Table P: a unique key per row (PK)', { role: 'mat', key: 'A primary key (PK) gives every row of a table its own value, so each row can be told apart.', changes: [['+', 'P1 and P2: unique keys']] }],
			[2, 'Table C stores a P key in each row (FK)', { role: 'src', key: 'A foreign key (FK) is a column that stores a key from another table.', changes: [['+', 'table C: 4 rows, each with an FK']] }],
			[3, 'Each FK points at its P row', { role: 'mat', key: 'Each FK value points at the parent row whose key it copies.', changes: [['+', 'C1 and C2 point at P1'], ['+', 'C3 points at P2']] }],
			[6, 'One P row can have many C rows', { role: 'mat', key: 'One parent row can have many child rows: here P1 has two.', changes: [['+', 'one to many: P1 has C1 and C2']] }],
			[7, 'An FK with no P row is refused', { role: 'flt', key: 'An FK must name a parent that exists. A row with no matching parent is refused.', changes: [['−', 'C4 refused: P9 does not exist'], ['~', 'C keeps 3 rows']] }],
		],
		counters: [
			{ label: 'P rows', role: 'mat', values: [[1, 2]] },
			{ label: 'C rows', role: 'src', values: [[2, 4], [7, 3]] },
			{ label: 'matches', role: 'mat', values: [[3, 1], [4, 2], [5, 3]] },
			{ label: 'refused', role: 'flt', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'Keys link tables', 'f11 b');
	// table P: title, header row (the PK) and its two rows; a dashed seat for the P row that does not exist
	a.rect(10, 86, 110, 26, tint('mat', 3), { in: 3 });
	a.rect(10, 112, 110, 26, tint('grp', 3), { in: 5 });
	a.rect(10, 36, 110, 24, 'bx');
	a.text(18, 52, 'table P', 'f11 b');
	a.grid(10, 60, [110], 3, 26);
	a.text(18, 77, 'PK key', 'f10 b mo');
	a.text(18, 103, 'P1', 'f11 mo');
	a.text(18, 129, 'P2', 'f11 mo');
	a.ghost(10, 164, 110, 26);
	a.text(18, 181, 'P9 (none)', 'f10 mo');
	// table C: title, header row (id and the FK) and four rows, from step 2
	CH.forEach(([, , y, shade, at]) => {
		a.g({ in: 2 }, () => (shade ? a.rect(260, y, 90, 26, tint(shade, 3), { in: at }) : a.rect(190, y, 160, 26, tint('flt', 3), { in: at })));
	});
	a.g({ in: 2 }, () => {
		a.rect(190, 36, 160, 24, 'bx');
		a.text(198, 52, 'table C', 'f11 b');
		a.grid(190, 60, [70, 90], 5, 26);
		a.text(198, 77, 'PK id', 'f10 b mo');
		a.text(268, 77, 'FK key', 'f10 b mo');
		CH.forEach(([c, p, y]) => {
			a.text(198, y + 17, c, 'f11 mo');
			a.text(268, y + 17, p, 'f11 mo');
		});
	});
	// the link: from the PK row of P to the FK row of C
	a.link([[120, 73], [190, 73]], '1', '0..*', {}, { in: 3, draw: true });
	a.rect(8, 84, 114, 54, 's-mat', { in: 6, hide: 7, pulse: true }, 6);
	a.text(190, 214, 'refused', 'f10 b f-flt', { in: 7 });
	a.text(10, 214, 'one → many', 'f10 b', { in: 6 });
	return a;
}

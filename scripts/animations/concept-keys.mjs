// Concept animation (SPEC D41, no real data) for primary and foreign keys. Metaphor: one parent row, many child rows pointing at it.
// 8 s loop of 8 phases: 1 table P, one unique key per row (PK); 2 table C, each row stores a P key (FK); 3 to 5 each FK arrow draws to
// its P row (C1 and C2 to P1, C3 to P2: one to many); 6 the "one to many" label; 7 a row C4 whose FK points at a P row that does not
// exist is marked red and refused; 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): a PRIMARY KEY rejects a repeated or NULL value; inserting a child whose key has no parent
// fails ("Violates foreign key constraint because key does not exist in the referenced table"); a NULL foreign key is allowed.
import { anim, tint } from '../lib/step-animation.mjs';

const CH = [['C1', 'P1', 72, 92], ['C2', 'P1', 102, 92], ['C3', 'P2', 132, 152]]; // child, its FK, child center y, parent center y

export default function make({ id = 'ky' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'Keys link tables: one parent row, many child rows',
		desc:
			'Table P has rows P1 and P2, each with a unique primary key. Table C has rows C1, C2, C3 and C4, each storing a P key as a foreign key. Arrows run from the foreign keys to the P rows they name: C1 and C2 both point at P1, C3 points at P2, so one P row has many C rows. C4 stores P9, a key that no P row has; its arrow ends at a dashed empty seat, and it is marked refused.',
		caption: 'A primary key identifies one row of its table. A foreign key stores that value in another table, so one parent row can have many children. A foreign key must name a parent that exists.',
		phases: ['P: a unique key on every row (PK)', 'C: each row stores a P key (FK)', 'C1 points at P1', 'C2 points at P1 too', 'C3 points at P2', 'One P row, many C rows', 'An FK with no P row is refused', 'Keys keep the tables consistent'],
	});
	a.text(10, 14, 'Keys link tables', 'f11 b');
	a.tags(10, 29, [[1, '1 · P: a unique key per row (PK)'], [2, '2 · C: each row stores a P key (FK)'], [3, '3 · C1 points at P1'], [4, '4 · C2 points at P1 too'], [5, '5 · C3 points at P2'], [6, '6 · one P row, many C rows'], [7, '7 · an FK with no P row is refused'], [8, '8 · keys keep tables consistent']]);
	a.text(10, 56, 'P', 'f10 b');
	a.text(200, 56, 'C', 'f10 b', { in: 2 });
	a.chip(10, 80, 'P1', { role: 'mat', level: 3, w: 90 });
	a.chip(10, 140, 'P2', { role: 'mat', level: 3, w: 90 });
	a.ghost(10, 190, 90, 24);
	a.text(55, 206, 'P9 (none)', 'f10', undefined, 'm');
	[...CH, ['C4', 'P9', 162, 202]].forEach(([c, p, cy, py], i) => {
		const bad = i === 3;
		a.g({ in: 2 }, () => {
			a.rect(200, cy - 12, 44, 24, tint(bad ? 'flt' : 'src', bad ? 3 : 2), bad ? { in: 7 } : undefined, 6);
			a.text(222, cy + 4, c, 'f11', undefined, 'm');
			a.rect(246, cy - 12, 44, 24, tint('mat', 3), undefined, 6);
			a.text(268, cy + 4, p, 'f11', undefined, 'm');
		});
		a.arrow(198, cy, 104, py, bad ? 's-flt dsh' : 's-mat', { in: bad ? 7 : 3 + i, draw: true });
	});
	a.text(300, 168, 'refused', 'f10 b f-flt', { in: 7 });
	a.text(10, 126, 'one → many', 'f10 b', { in: 6 });
	return a;
}

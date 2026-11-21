// Concept animation (SPEC D41, no real data) for reading a crow's foot line. Metaphor: read the line from both ends, each end counts the rows of
// the table it touches. 8 s loop of 8 phases: 1 a line from the PK column of P to the FK column of C, with a circle-and-bar end at P (zero or
// one) and a circle-and-foot end at C (zero or many); 2 and 3 read from P: P1 has two C rows, P2 has none; 4 to 8 read from C: C1 and C2 have one
// P row, C3 has none (empty FK, marked red). The figure stops before any join: the lesson meets INNER and LEFT JOIN only in its last unit.
// Facts (cardinality labels per LESSON-STANDARD, "Entity-relationship diagrams"): the link comes from lib/erd.mjs; a circle allows zero.
// Live counters (D41): rows drawn at that phase. No real numbers: P and C are placeholders.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'er' } = {}) {
	const a = anim({
		id,
		h: 224,
		loop: { cycle: 8 },
		title: 'Read a line from both ends',
		desc:
			'Two tables, P and C. A line joins the primary key column of P to the foreign key column of C. The end at P has a bar and a circle: zero or one. The end at C has a three-pronged foot and a circle: zero or many. Read from P: P1 has two C rows and P2 has none. Read from C: C1 and C2 each have one P row, and C3 has an empty key and no P row.',
		caption: 'Each end of the line counts the rows of the table it touches. A circle means zero is allowed: a P row with no C rows, or a C row with no P row.',
		phases: [
			[1, 'A line from the PK to the FK', { role: 'mat', key: 'The line joins the key column of P to the foreign key column of C. Each end carries a mark.', changes: [['+', 'P: 2 rows'], ['+', 'C: 3 rows']] }],
			[2, 'Read from P: how many C rows?', { role: 'src', key: 'Stand at P: the mark at the C end says how many C rows one P row can have. A circle allows none.', changes: [['+', 'P1: two C rows'], ['+', 'P2: none']] }],
			[4, 'Read from C: how many P rows?', { role: 'out', key: 'Stand at C: the mark at the P end says how many P rows one C row can have. A circle allows none.', changes: [['+', 'C1, C2: one P row'], ['+', 'C3: none']] }],
		],
		counters: [
			{ label: 'P rows', role: 'src', values: [[1, 2]] },
			{ label: 'C rows', role: 'out', values: [[1, 3]] },
			{ label: 'no P row', role: 'flt', values: [[4, 1]] },
		],
	});
	a.text(10, 14, 'Read a line from both ends', 'f11 b');
	// the line and its two ends (shared helper lib/erd.mjs): zero or one at P, zero or many at C, at the header level
	a.link([[56, 64], [226, 64]], '0..1', '0..*', { verb: 'has' }, { in: 1, draw: true });
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
		a.chip(278, y, c, { role: 'out', level: 2, w: 44, flags: [{ role: hl.role, level: hl.level, fx: { in: k } }] });
	});
	// readings in the corridor between the tables
	a.text(108, 100, 'P1: two C rows', 'f10', { in: 2, hide: 4 });
	a.text(108, 150, 'P2: no C rows', 'f10 b f-flt', { in: 3, hide: 4 });
	a.text(222, 130, 'C1, C2: one P row', 'f10', { in: 4 }, 'e');
	a.text(222, 160, 'C3: no P row', 'f10 b f-flt', { in: 5 }, 'e');
	return a;
}

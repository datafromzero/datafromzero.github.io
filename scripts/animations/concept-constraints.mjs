// Concept animation (SPEC D41, no real data) for table constraints. Metaphor: rows try to enter a table with rules; rows that break a
// rule bounce off. 8 s loop of 8 phases: 1 the table with its three rules (NOT NULL, UNIQUE, CHECK) and five waiting rows; 2 Row 1 is fine
// and goes in; 3 Row 2 has a ? in a column that only has CHECK, and a ? passes CHECK, so it goes in; 4 Row 3 has no name and bounces
// off NOT NULL; 5 Row 4 repeats a key and bounces off UNIQUE; 6 Row 5 has a bad age and bounces off CHECK; 7 and 8 hold: two rows stored.
// Facts (DuckDB 2.0.0, concept2/facts.out), table (id PRIMARY KEY, name NOT NULL UNIQUE, age CHECK (age >= 0)): inserting a NULL name fails
// ("NOT NULL constraint failed"); a repeated name fails ("violates unique constraint"); age -1 fails ("CHECK constraint failed"); age NULL
// is accepted (a CHECK that evaluates to NULL passes); a failed INSERT stores nothing.
import { anim } from '../lib/step-animation.mjs';

const ROWS = [['Row 1', 0], ['Row 2 · age ?', 0], ['Row 3 · no name', 4], ['Row 4 · repeat', 5], ['Row 5 · bad age', 6]]; // label, phase of the bounce (0 = goes in)
const Y = (i) => 70 + 36 * i;
const RULES = [['NOT NULL', 84], ['UNIQUE', 124], ['CHECK', 164]];

export default function make({ id = 'cn' } = {}) {
	const a = anim({
		id,
		h: 256,
		loop: { cycle: 8 },
		title: 'Constraints are rules a table enforces: rows that break them bounce off',
		desc:
			'A table with three rules, NOT NULL, UNIQUE and CHECK, and five rows waiting. Row 1 follows the rules and goes in. Row 2 has a question mark as its age, which passes CHECK, so it goes in. Row 3 has no name and bounces off NOT NULL. Row 4 repeats a key and bounces off UNIQUE. Row 5 has a bad age and bounces off CHECK. Two rows end up stored.',
		caption: 'A constraint is a rule the table checks on every new row. A row that breaks a rule is refused and nothing is stored. A ? (NULL) passes a CHECK, so add NOT NULL when it matters.',
		phases: ['A table with three rules', 'Row 1 follows the rules: in', 'Row 2, age ?, passes CHECK: in', 'Row 3 has no name: NOT NULL says no', 'Row 4 repeats a key: UNIQUE says no', 'Row 5 has a bad age: CHECK says no', 'Refused rows are never stored', 'Two rows stored, three refused'],
	});
	a.text(10, 14, 'Rows that break a rule bounce off', 'f11 b');
	a.tags(10, 29, [[1, '1 · a table with three rules'], [2, '2 · row 1 follows the rules: in'], [3, '3 · row 2, age ?, passes CHECK'], [4, '4 · no name: NOT NULL says no'], [5, '5 · repeat: UNIQUE says no'], [6, '6 · bad age: CHECK says no'], [7, '7 · refused rows are not stored']]);
	a.box(150, 44, 200, 208, { role: 'out', title: 'table with rules' });
	RULES.forEach(([t, y]) => a.text(268, y, t, 'f10 b mo'));
	[0, 1].forEach((i) => a.ghost(160, Y(i), 100, 24));
	ROWS.forEach(([label, p], i) => {
		const y = Y(i);
		const chip = (flags) => a.chip(10, y, label, { role: 'src', level: 2, w: 100, flags });
		if (!p) a.move({ dx: 150, at: 2 + i }, () => chip([]));
		else a.move({ dx: 50, at: p, half: 'a' }, () => a.move({ dx: -50, at: p, half: 'b' }, () => chip([{ role: 'flt', level: 3, fx: { in: p } }])));
		if (p) a.rect(264, RULES[p - 4][1] - 14, 78, 20, 's-flt', { in: p, hide: p + 1, pulse: true }, 6);
	});
	return a;
}

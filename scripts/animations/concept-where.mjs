// Concept animation (SPEC D41, no real data) for WHERE. Metaphor: a gate that lets a row through only when the test is true.
// 8 s loop of 8 phases: 1 four rows with a value x (9, 3, ?, 7; ? is NULL); 2 the gate "WHERE x > 5" appears; 3 to 6 one row per
// phase is tested: its verdict shows and it either slides through (true) or stops at the gate in red (false, or unknown for the
// ?); 7 and 8 hold. Facts (DuckDB 2.0.0, concept2/facts.out): `WHERE v > 15` over 10, NULL, 30 keeps only 30, so the NULL row is
// dropped like a false one; a row is kept only when the condition is true.
// Live counters and Key idea (D41): counts are the rows drawn in the picture at that phase; each appears with its phase.
import { anim } from '../lib/step-animation.mjs';

const ROWS = [['Row 1 · 9', 'true', true], ['Row 2 · 3', 'false', false], ['Row 3 · ?', 'unknown', false], ['Row 4 · 7', 'true', true]];
const Y = (i) => 60 + 34 * i;

export default function make({ id = 'wh' } = {}) {
	const a = anim({
		id,
		h: 206,
		loop: { cycle: 8 },
		title: 'WHERE is a gate: only a true test gets through',
		desc:
			'Four rows each hold a value x: 9, 3, a question mark meaning no value, and 7. A gate says WHERE x greater than 5. Each row is tested in turn: Row 1 is true and slides through, Row 2 is false and stops at the gate in red, Row 3 is unknown because its value is missing and stops in red, Row 4 is true and slides through.',
		caption: 'WHERE tests every row. Only rows where the test is true go through; false and unknown (a missing value) are stopped.',
		phases: [
			[1, 'Rows, each with a value x', { role: 'src', key: 'A query starts with every row of the table.', changes: [['+', '4 rows, each with a value x']] }],
			[2, 'A gate: only true goes through', { role: 'flt', key: 'WHERE is one test, and every row is checked against it.', changes: [['+', 'the test x > 5']] }],
			[3, 'Row 1 is tested: true, through', { role: 'flt', key: 'A row whose test is true goes on to the next clause.', changes: [['~', 'Row 1 kept']] }],
			[4, 'Row 2: false, stopped', { role: 'flt', key: 'A row whose test is false is dropped.', changes: [['−', 'Row 2 dropped']] }],
			[5, 'Row 3: unknown (a ?), stopped', { role: 'flt', key: 'An unknown test (a missing value) drops the row too: only true passes.', changes: [['−', 'Row 3 dropped']] }],
			[6, 'Row 4: true, through', { role: 'flt', key: 'WHERE keeps exactly the rows where the test is true.', changes: [['~', 'Row 4 kept'], ['−', '2 of 4 rows dropped']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 4]] },
			{ label: 'kept', role: 'flt', values: [[3, 1], [6, 2]] },
			{ label: 'stopped', role: 'flt', values: [[3, 0], [4, 1], [5, 2]] },
		],
	});
	a.text(10, 14, 'A gate at every row', 'f11 b');
	a.g({ in: 2 }, () => {
		a.rect(140, 56, 6, 138, 'f-flt k3');
		a.text(143, 50, 'WHERE x > 5', 'f10 b mo', undefined, 'm');
	});
	ROWS.forEach(([label, verdict, pass], i) => {
		const y = Y(i);
		a.ghost(10, y, 90, 24);
		a.move({ dx: pass ? 190 : 30, at: 3 + i }, () => a.chip(10, y, label, { role: 'src', level: 2, w: 90, flags: pass ? [] : [{ role: 'flt', level: 3, fx: { in: 3 + i } }] }));
		a.text(350, y + 16, verdict, pass ? 'f11 b' : 'f11 b f-flt', { in: 3 + i }, 'e');
	});
	return a;
}

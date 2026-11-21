// Concept animation (SPEC D41, no real data) for triggers. Metaphor: a rule on a table waits for a change and then runs by itself. 8 s loop of
// 8 phases: 1 a table T with two rows and a rule on it (the log table L is an empty slot); 2 and 3 a row of T changes; 4 and 5 the rule fires
// (ring, arrow from the rule to L); 6 to 8 L holds one log row. Rows are placeholders; the counters count what is drawn.
// Facts (DuckDB 2.0.0, as in sql/triggers-and-procedures): a trigger runs inside the statement that changed the table, and the rows it writes
// are rolled back with the transaction (log count 8 inside the transaction, 7 after ROLLBACK); an UPDATE that matches no row writes nothing.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'tg' } = {}) {
	const a = anim({
		id,
		h: 188,
		loop: { cycle: 8 },
		title: 'A trigger is a rule on a table that runs when the table changes',
		desc:
			'A table T holds two rows, and a rule is attached to it: on update, write a log row. A row of T changes. The rule fires by itself and an arrow runs from the rule to a second table L, the log. L then holds one log row describing the change.',
		caption: 'A trigger is attached to a table. When the table changes, the database runs the rule itself, as part of the same change.',
		phases: [
			[1, 'A table with a rule on it', { role: 'mat', key: 'A trigger is a rule attached to a table. It does nothing until the table changes.', changes: [['+', 'T: 2 rows'], ['+', 'a rule on T']] }],
			[2, 'A change arrives', { role: 'out', key: 'An insert, update or delete on the table is the event the rule waits for.', changes: [['~', 'Row 2 changed']] }],
			[4, 'The rule fires by itself', { role: 'mat', key: 'The database runs the rule inside the same statement, so no one has to remember it.', changes: [['+', 'the rule ran once']] }],
			[6, 'The rule writes a log row', { role: 'out', key: 'The rule runs its own statement. Here that writes one row to another table.', changes: [['+', 'L: 1 log row']] }],
		],
		counters: [
			{ label: 'T rows', role: 'src', values: [[1, 2]] },
			{ label: 'changed', role: 'out', values: [[2, 1]] },
			{ label: 'fired', role: 'mat', values: [[4, 1]] },
			{ label: 'log rows', role: 'out', values: [[6, 1]] },
		],
	});
	a.text(10, 14, 'Change a table, the rule runs', 'f11 b');
	a.text(20, 62, 'T', 'f10 b');
	a.text(240, 62, 'L: the log', 'f10 b');
	a.chip(20, 72, 'Row 1', { role: 'src', level: 2, w: 100 });
	a.chip(20, 102, 'Row 2', { role: 'src', level: 2, w: 100, flags: [{ role: 'out', level: 3, fx: { in: 2 } }] });
	a.rect(16, 98, 108, 32, 's-out', { in: 2, hide: 3, pulse: true }, 8);
	a.badge(20, 144, 'rule: on UPDATE, log it', 'mat');
	a.rect(16, 140, 164, 26, 's-mat', { in: 4, hide: 6, pulse: true }, 13);
	a.ghost(240, 72, 100, 24);
	a.arrow(184, 153, 238, 90, 's-mat', { in: 4, draw: true });
	a.chip(240, 72, 'Row 2 logged', { role: 'out', level: 3, w: 100, fx: { in: 6 } });
	return a;
}

// Concept animation (SPEC D41, no real data) for nested data (core lesson C31). Metaphor: one nested record is unfolded into flat rows, then split into
// small tables that share a key. Abstract only: columns id, sid, name, x1 and x2, no values.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 one record with a nested store (sid, name) and a list items [x1, x2]; 3 to 4 flatten: the
// store chip splits into store.sid and store.name; 5 to 6 explode: the list becomes two rows and the other columns repeat; 7 to 8 normalize: three
// small tables (orders, stores, items) share the keys id and sid and nothing repeats.
// Facts (pandas json_normalize page; MongoDB data modeling page): json_normalize turns nested dictionaries into dotted column names and, with
// record_path, makes one row per element of a list with the fields named in meta repeated on each row; the word normalize here means splitting into
// tables with keys, the SQL-stage meaning, and the MongoDB page uses embedding and referencing for the same choice. No Predict of the lesson is answered
// (the lesson's row counts come from its own runs, and none appears here).
// Counters (D41): tables, rows (drawn in the picture) and store copies (how many times the store columns are stored).
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const R1 = 70;
const R2 = 102;

export default function make({ id = 'ntt' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'Nested data unfolds into flat rows, then into tables that share a key',
		desc:
			'One record with a nested store and a list of items. Flatten splits the store into the columns store.sid and store.name. Explode turns the list into two rows and repeats the other columns on both. Normalize splits the rows into three small tables, orders, stores and items, that share the keys id and sid, so nothing repeats.',
		caption: 'Flatten spreads a nested record into columns, explode turns a list into rows, and normalize splits the rows into tables that share a key.',
		phases: [
			[1, 'One nested record', { role: 'src', key: 'A nested record holds records and lists inside one another.', changes: [['+', '1 record'], ['+', 'a store and a list']] }],
			[3, 'Flatten: the store becomes columns', { role: 'grp', key: 'Flatten gives each nested key its own column, named store.sid and store.name.', changes: [['+', 'store.sid, store.name']] }],
			[5, 'Explode: the list becomes rows', { role: 'flt', key: 'Explode makes one row for each list element and repeats the other columns.', changes: [['+', 'a second row'], ['+', 'repeated columns']] }],
			[7, 'Normalize: tables with keys', { role: 'out', key: 'Normalize stores each fact once, in a table of its own, linked by a key.', changes: [['+', '3 tables'], ['−', 'repeated columns']] }],
		],
		counters: [
			{ label: 'tables', role: 'src', values: [[1, 1], [7, 3]] },
			{ label: 'rows', role: 'grp', values: [[1, 1], [5, 2], [7, 4]] },
			{ label: 'store copies', role: 'flt', values: [[1, 1], [5, 2], [7, 1]] },
		],
	});
	a.text(10, 14, 'Unfold, then split', 'f11 b');

	// step 1 to 2: one nested record
	a.chip(10, R1, 'id', { role: 'src', level: 3, w: 44, fx: { hide: 3 } });
	a.chip(62, R1, 'store: sid, name', { role: 'src', level: 2, w: 134, fx: { hide: 3 } });
	a.chip(204, R1, 'items [x1, x2]', { role: 'src', level: 2, w: 100, fx: { hide: 5 } });

	// step 3 to 4: flatten (id and items stay in place, the store chip splits)
	a.chip(10, R1, 'id', { role: 'grp', level: 3, w: 44, fx: { in: 3, hide: 7 } });
	a.chip(62, R1, 'store.sid', { role: 'grp', level: 2, w: 58, fx: { in: 3, hide: 7 } });
	a.chip(128, R1, 'store.name', { role: 'grp', level: 2, w: 68, fx: { in: 3, hide: 7 } });

	// step 5 to 6: explode (two rows; the list splits and the other columns repeat)
	a.chip(204, R1, 'x1', { role: 'flt', level: 3, w: 44, fx: { in: 5, hide: 7 } });
	a.chip(204, R2, 'x2', { role: 'flt', level: 3, w: 44, fx: { in: 5, hide: 7 } });
	a.chip(10, R2, 'id', { role: 'grp', level: 1, w: 44, fx: { in: 5, hide: 7 } });
	a.chip(62, R2, 'store.sid', { role: 'grp', level: 1, w: 58, fx: { in: 5, hide: 7 } });
	a.chip(128, R2, 'store.name', { role: 'grp', level: 1, w: 68, fx: { in: 5, hide: 7 } });
	a.text(10, 140, 'row 2 repeats id and the store', 'f10 mu', { in: 6, hide: 7 });

	// step 7 to 8: three tables that share keys
	a.box(10, 44, 96, 56, { role: 'out', title: 'orders', fx: { in: 7 } });
	a.chip(18, 68, 'id', { role: 'src', level: 3, w: 36, fx: { in: 7 } });
	a.chip(60, 68, 'sid', { role: 'mat', level: 3, w: 38, fx: { in: 7 } });
	a.box(128, 44, 130, 56, { role: 'out', title: 'stores', fx: { in: 7 } });
	a.chip(136, 68, 'sid', { role: 'mat', level: 3, w: 38, fx: { in: 7 } });
	a.chip(180, 68, 'name', { role: 'grp', level: 3, w: 70, fx: { in: 7 } });
	a.box(10, 124, 128, 92, { role: 'out', title: 'items', fx: { in: 7 } });
	a.chip(18, 150, 'id', { role: 'src', level: 3, w: 36, fx: { in: 7 } });
	a.chip(62, 150, 'x1', { role: 'flt', level: 3, w: 38, fx: { in: 7 } });
	a.chip(18, 182, 'id', { role: 'src', level: 3, w: 36, fx: { in: 7 } });
	a.chip(62, 182, 'x2', { role: 'flt', level: 3, w: 38, fx: { in: 7 } });
	a.text(160, 152, 'id and sid are the keys:', 'f10 mu', { in: 8 });
	a.text(160, 168, 'each fact is stored once', 'f10 mu', { in: 8 });
	return a;
}

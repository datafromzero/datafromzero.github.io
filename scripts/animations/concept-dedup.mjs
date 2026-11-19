// Concept animation (SPEC D41, no real data) for removing duplicates with ROW_NUMBER. Metaphor: number the repeats of each key, keep #1.
// Five rows with keys A, B, A, B... as Row 1 A, Row 2 A, Row 3 B, Row 4 A, Row 5 B. 8 s loop of 8 phases: 1 the rows; 2 the A rows are numbered
// #1, #2, #3; 3 the B rows are numbered #1, #2; 4 the #1 badges glow (keep); 5 the other rows turn red and are marked dropped;
// 6 and 7 the two kept rows slide into the clean table; 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): row_number() OVER (PARTITION BY k ORDER BY ts) gives A: 1, 2, 3 and B: 1, 2; WHERE rn = 1
// keeps one row per key.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const ROWS = [['A', 1], ['A', 2], ['B', 1], ['A', 3], ['B', 2]]; // key, number within its key
const Y = (i) => 60 + 30 * i;
const SHADE = { A: 2, B: 4 };

export default function make({ id = 'dd' } = {}) {
	const a = anim({
		id,
		h: 214,
		loop: { cycle: 8 },
		title: 'Number the repeats of each key, keep only number 1',
		desc:
			'Five rows with keys A, A, B, A and B. The rows of key A are numbered 1, 2 and 3, and the rows of key B are numbered 1 and 2. The rows numbered 1 are kept; the three other rows turn red and are marked dropped. The two kept rows slide into a clean table on the right, one row per key.',
		caption: 'To remove duplicates, number the rows within each key with ROW_NUMBER, then keep only the rows numbered 1.',
		phases: [
			[1, 'Rows with a key; some keys repeat', { role: 'src', key: 'Some keys appear more than once. Rows that repeat a key are the duplicates.', changes: [['+', '5 rows, 2 keys']] }],
			[2, 'Number the rows within each key', { role: 'grp', key: 'ROW_NUMBER with PARTITION BY numbers the rows inside each key, starting at 1.', changes: [['+', 'a number #n on every row']] }],
			[4, 'Keep only #1', { role: 'out', key: 'Each key has exactly one row numbered 1. That is the row to keep.', changes: [['+', '2 rows marked to keep']] }],
			[5, 'The other rows are dropped', { role: 'flt', key: 'Keeping only #1 drops every other row of that key.', changes: [['−', '3 rows dropped']] }],
			[6, 'The kept rows move to a clean table', { role: 'out', key: 'What is left is one row per key: a table without duplicates.', changes: [['+', 'new table: 2 rows'], ['−', '5 rows reduced to 2']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 5]] },
			{ label: 'kept #1', role: 'out', values: [[4, 2]] },
			{ label: 'dropped', role: 'flt', values: [[5, 3]] },
			{ label: 'new table', role: 'out', values: [[6, 1], [7, 2]] },
		],
	});
	a.text(10, 14, 'Number the repeats, keep #1', 'f11 b');
	a.text(250, 52, 'clean table', 'f10 b', undefined, 'm');
	ROWS.forEach((_, i) => a.ghost(10, Y(i), 80, 24));
	a.ghost(210, Y(0), 80, 24);
	a.ghost(210, Y(1), 80, 24);
	ROWS.forEach(([k, n], i) => {
		const y = Y(i);
		const keep = n === 1;
		const body = () => {
			a.chip(10, y, `Row ${i + 1} · ${k}`, { role: 'grp', level: SHADE[k], w: 80, flags: keep ? [] : [{ role: 'flt', level: 3, fx: { in: 5 } }] });
			a.chip(96, y, `#${n}`, { role: 'out', level: 3, w: 34, fx: { in: k === 'A' ? 2 : 3 } });
		};
		if (keep && !i) a.move({ dx: 200, at: 6 }, body);
		else if (keep) a.move({ dx: 200, at: 7, half: 'a' }, () => a.move({ dy: -30, at: 7, half: 'b' }, body));
		else {
			body();
			a.text(140, y + 16, 'dropped', 'f10 b', { in: 5 });
		}
		if (keep) a.rect(92, y - 3, 42, 30, 's-out', { in: 4, hide: 5, pulse: true }, 8);
	});
	return a;
}

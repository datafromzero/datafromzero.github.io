// Concept animation (SPEC D41, no real data) for pandas groupby. Metaphor: split the rows into one group per key, apply one
// calculation to each group, combine the results into a new table. 8 s loop of 8 phases: 1 six rows, each tagged with a key (A, B, C);
// 2 the A rows slide into their group, 3 the B rows, 4 the C row (split); 5 each group becomes one row with its count (apply);
// 6 the three result rows get a blue edge together and a "new table" label, the combine step; 7 and 8 hold.
// Same geometry as concept-group-by (checked for overlap there); the only differences are the words and the phase 6 edge.
// Live counters and Key idea (D41): counts are the rows or items drawn in the picture at that phase; each appears with its phase.
import { anim } from '../lib/step-animation.mjs';

const ROWS = [['A', 0], ['B', 0], ['A', 1], ['C', 0], ['B', 1], ['A', 2]]; // key, slot in its group
const BUCKETS = { A: { top: 30, n: 3 }, B: { top: 90, n: 2 }, C: { top: 150, n: 1 } };
const SHADE = { A: 1, B: 2, C: 4 };
const AT = { A: 2, B: 3, C: 4 };
const SRC = { x: 10, y: 40, pitch: 30 };

export default function make({ id = 'sac' } = {}) {
	const a = anim({
		id,
		h: 224,
		loop: { cycle: 8 },
		title: 'groupby splits rows into groups, applies a calculation to each group and combines the results',
		desc:
			'Six rows, Row 1 to Row 6, each tagged with a key: A, B, A, C, B, A. The A rows slide into group A, the B rows into group B and the C row into group C. Each group then becomes one row holding its count: A 3 rows, B 2 rows, C 1 row. A dashed frame around the three result rows marks the new table.',
		caption: 'groupby splits the rows into one group per key, applies a calculation to each group, and combines the results into a new table with one row per key.',
		phases: [
			[1, 'Six rows, each with a key', { role: 'src', key: 'Every row carries a key; rows with the same key will end up in the same group.', changes: [['+', '6 rows, each with a key']] }],
			[2, 'Split: rows go to their group', { role: 'grp', key: 'Split: groupby gives each key its own group and sends the rows to it.', changes: [['+', '3 groups: A, B, C'], ['~', 'rows moved into groups']] }],
			[5, 'Apply: a count for each group', { role: 'out', key: 'Apply: one calculation, here a count, runs on each group on its own.', changes: [['−', '6 rows folded into 3'], ['+', 'a count for each group']] }],
			[6, 'Combine: a new table', { role: 'src', key: 'Combine: the results of all groups form a new table with one row per key.', changes: [['+', '1 new table of 3 rows']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 6]] },
			{ label: 'groups', role: 'grp', values: [[2, 1], [3, 2], [4, 3]] },
			{ label: 'counts', role: 'out', values: [[5, 3]] },
			{ label: 'table', role: 'src', values: [[6, '3 rows']] },
		],
	});
	a.text(10, 14, 'Split, apply, combine', 'f11 b');

	// the empty seats the rows leave behind, and the groups
	ROWS.forEach((_, i) => a.rect(SRC.x, SRC.y + SRC.pitch * i, 64, 24, 'bx dsh', undefined, 6));
	for (const [k, { top }] of Object.entries(BUCKETS)) {
		a.rect(110, top, 236, 44, 'bx', undefined, 8);
		a.text(116, top + 26, k, 'f14 b', { in: AT[k] + 1 });
	}
	// the rows: each slides to its group slot, then is replaced by the group's single row
	ROWS.forEach(([k, slot], i) => {
		const y = SRC.y + SRC.pitch * i;
		const dx = 130 + 70 * slot - SRC.x;
		const dy = BUCKETS[k].top + 10 - y;
		const chip = () => a.chip(SRC.x, y, `Row ${i + 1} · ${k}`, { role: 'grp', level: SHADE[k] });
		// the last row slides along its own line first and then up, so it never passes over the row above it
		if (i === 5) a.move({ dx, at: AT[k], half: 'a', fx: { hide: 5 } }, () => a.move({ dy, at: AT[k], half: 'b' }, chip));
		else a.move({ dx, dy, at: AT[k], fx: { hide: 5 } }, chip);
	});
	for (const [k, { top, n }] of Object.entries(BUCKETS)) {
		a.chip(130, top + 10, n === 1 ? '1 row' : `${n} rows`, { role: 'out', level: 3, fx: { in: 5 } });
		a.rect(126, top + 6, 72, 32, 's-out', { in: 5, hide: 7, pulse: true }, 8);
	}
	// combine: the three result rows get a blue edge together, and a label above the groups names them a table
	for (const { top } of Object.values(BUCKETS)) a.rect(130, top + 8, 64, 28, 's-src', { in: 6, pulse: true }, 8);
	a.text(250, 14, 'new table', 'f10 b', { in: 6 });
	return a;
}

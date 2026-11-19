// Concept animation (SPEC D41, no real data) for GROUP BY and HAVING. Metaphor: sort rows into one bucket per key, then each
// bucket becomes one row. 8 s loop of 8 phases: 1 six rows, each tagged with a key (A, B, C); 2 the A rows slide into their
// bucket, 3 the B rows, 4 the C row; 5 each bucket becomes one row with its count; 6 HAVING drops a whole bucket (C, which holds
// one row); 7 and 8 hold.
// Live counters and Key idea (D41): counts are the rows drawn in the picture at that phase; each appears with its phase.
import { anim } from '../lib/step-animation.mjs';

const ROWS = [['A', 0], ['B', 0], ['A', 1], ['C', 0], ['B', 1], ['A', 2]]; // key, slot in its bucket
const BUCKETS = { A: { top: 30, n: 3 }, B: { top: 90, n: 2 }, C: { top: 150, n: 1 } };
const SHADE = { A: 1, B: 2, C: 4 };
const AT = { A: 2, B: 3, C: 4 };
const SRC = { x: 10, y: 40, pitch: 30 };

export default function make({ id = 'gb' } = {}) {
	const a = anim({
		id,
		h: 224,
		loop: { cycle: 8 },
		title: 'GROUP BY sorts rows into buckets, one bucket per key',
		desc:
			'Six rows, Row 1 to Row 6, each tagged with a key: A, B, A, C, B, A. The A rows slide into bucket A, the B rows into bucket B and the C row into bucket C. Each bucket then becomes one row with its count: A 3 rows, B 2 rows, C 1 row. HAVING then drops a whole bucket: bucket C, with one row, is marked dropped.',
		caption: 'GROUP BY sorts the rows into one bucket per key, and each bucket becomes one row. HAVING then keeps or drops whole buckets.',
		phases: [
			[1, 'Six rows, each with a key', { role: 'src', key: 'Every row carries a key; rows with the same key will be grouped together.', changes: [['+', '6 rows, each with a key']] }],
			[2, 'Rows slide into one bucket per key', { role: 'grp', key: 'GROUP BY gives each key its own bucket and moves the rows in.', changes: [['+', '3 buckets: A, B, C'], ['~', 'rows moved into their bucket']] }],
			[5, 'Each bucket becomes one row', { role: 'out', key: 'An aggregate turns each bucket into one row.', changes: [['−', '6 rows folded into 3'], ['+', 'a count for each bucket']] }],
			[6, 'HAVING drops a whole bucket', { role: 'flt', key: 'HAVING keeps or drops a whole bucket, never single rows.', changes: [['−', 'bucket C dropped (it held 1 row)']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 6]] },
			{ label: 'groups', role: 'grp', values: [[2, 1], [3, 2], [4, 3]] },
			{ label: 'result', role: 'out', values: [[5, 3]] },
			{ label: 'after HAVING', role: 'flt', values: [[6, 2]] },
		],
	});
	a.text(10, 14, 'Rows → buckets → one row each', 'f11 b');

	// the empty seats the rows leave behind, and the buckets
	ROWS.forEach((_, i) => a.rect(SRC.x, SRC.y + SRC.pitch * i, 64, 24, 'bx dsh', undefined, 6));
	for (const [k, { top }] of Object.entries(BUCKETS)) {
		a.rect(110, top, 236, 44, 'bx', undefined, 8);
		a.text(116, top + 26, k, 'f14 b', { in: AT[k] + 1 });
	}
	// the rows: each slides to its bucket slot, then is replaced by the bucket's single row
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
		a.chip(130, top + 10, n === 1 ? '1 row' : `${n} rows`, {
			role: 'out',
			level: 3,
			flags: k === 'C' ? [{ role: 'flt', level: 3, fx: { in: 6 } }] : [],
			fx: { in: 5 },
		});
		a.rect(126, top + 6, 72, 32, `s-${k === 'C' ? 'flt' : 'out'}`, { in: 5, hide: 7, pulse: true }, 8);
	}
	a.text(204, BUCKETS.C.top + 26, 'dropped', 'f10 b', { in: 6 });
	return a;
}

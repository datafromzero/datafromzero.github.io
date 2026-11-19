// Concept animation (SPEC D41, no real data) for normalization. Metaphor: a repeating part moves out into its own table, stored once,
// and a key links the two. One wide table with columns id, key, info; the info repeats for every row with the same key (A, A, B, A).
// 8 s loop of 8 phases: 1 the wide table; 2 the info column glows (it repeats); 3 the first info of each key slides into a new table and
// the repeats turn red; 4 the repeats are gone and the new table gets its keys; 5 arrows link each row's key to its info row; 6 to 8 hold.
// Facts: a design pattern, not engine output: after the split each fact about a key (here its info) is stored once and rows refer to it
// by key, so a change is made in one place; a join on the key puts the wide table back together.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const KEYS = ['A', 'A', 'B', 'A'];
const Y = (i) => 60 + 30 * i;

export default function make({ id = 'nm' } = {}) {
	const a = anim({
		id,
		h: 198,
		loop: { cycle: 8 },
		title: 'Normalizing splits repeated information into its own table',
		desc:
			'A wide table with four rows, columns id, key and info. Rows 1, 2 and 4 have key A, so their info repeats; Row 3 has key B. The info of key A and the info of key B slide into a new small table, one row per key. The repeated info cells in Rows 2 and 4 turn red and disappear. Arrows then link each row of the first table, by its key, to its row in the new table.',
		caption: 'Normalizing stores each repeated fact once, in its own table, and links the tables by a key. A join puts the pieces back together when you need them.',
		phases: [
			[1, 'One wide table; the info repeats', { role: 'src', key: 'One wide table repeats the same information in every row that has the same key.', changes: [['+', '4 rows: key A appears 3 times']] }],
			[2, 'The repeated part is the info column', { role: 'out', key: 'The part that repeats, here info, is a fact about the key and not about the row.', changes: [['~', 'the info column repeats for key A']] }],
			[3, 'Each info moves to its own table', { role: 'flt', key: 'Store each fact once: move one copy of each info into a new table and drop the repeats.', changes: [['+', 'new table: 2 rows'], ['−', '2 repeated cells marked']] }],
			[4, 'Repeats are gone; each info is stored once', { role: 'out', key: 'Now each info is stored once, so a change has to be made in only one place.', changes: [['−', '2 repeats removed'], ['+', 'keys A and B in the new table']] }],
			[5, 'A key links the two tables', { role: 'mat', key: 'The key links each row to its info row, and a join can put the wide table back together.', changes: [['+', '4 links, one per row']] }],
		],
		counters: [
			{ label: 'info cells', role: 'src', values: [[1, 4], [4, 2]] },
			{ label: 'repeats', role: 'flt', values: [[3, 2], [4, 0]] },
			{ label: 'tables', role: 'out', values: [[1, 1], [3, 2]] },
			{ label: 'links', role: 'mat', values: [[5, 4]] },
		],
	});
	a.text(10, 14, 'Split what repeats into its own table', 'f11 b');
	[['id', 30], ['key', 70], ['info', 120], ['key', 260], ['info', 315]].forEach(([t, x], i) => a.text(x, 52, t, 'f10 b mo', i > 2 ? { in: 3 } : i === 2 ? { hide: 4 } : undefined, 'm'));
	a.grid(10, 60, [40, 40], 4, 30);
	a.grid(240, 60, [40, 70], 2, 30, { in: 3 });
	KEYS.forEach((k, i) => {
		a.text(15, Y(i) + 19, `r${i + 1}`, 'f11');
		a.text(55, Y(i) + 19, k, 'f11 b');
		const dup = KEYS.indexOf(k) !== i;
		const cell = () => {
			a.rect(90, Y(i), 60, 30, 'bx');
			if (dup) a.rect(90, Y(i), 60, 30, 'f-flt k3', { in: 3 });
			a.text(120, Y(i) + 19, `info ${k}`, 'f10', undefined, 'm');
		};
		if (dup) a.g({ hide: 4 }, cell);
		else a.move({ dx: 190, dy: k === 'B' ? -30 : 0, at: 3 }, cell);
	});
	a.rect(86, 56, 68, 126, 's-out', { in: 2, hide: 3, pulse: true }, 6);
	['A', 'B'].forEach((k, i) => a.text(260, 79 + 30 * i, k, 'f11 b', { in: 4 }, 'm'));
	KEYS.forEach((k, i) => a.arrow(92, Y(i) + 15, 238, 75 + 30 * (k === 'B' ? 1 : 0), 's-mat', { in: 5, draw: true }));
	return a;
}

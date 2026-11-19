// Concept animation (SPEC D41, no real data) for the star schema. Metaphor: a fact table in the middle, dimension tables around it,
// each joined by one key. 8 s loop of 8 phases: 1 the fact table alone; 2, 3, 4 and 5 the dimension tables A, B, C and D slide in from
// outside, one per phase; 3, 4, 5 and 6 the key link to each one draws the phase after it arrives; 7 a ring marks the star; 8 hold.
// Facts: a modeling pattern, not engine output: the fact table holds one row per event with a key to each dimension, and a query joins the
// fact table to the dimensions it needs, one join per dimension.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const DIMS = [
	// name, final x, final y, move dx, dy, link path, key label x, y
	['dim A', 140, 40, -220, 0, 'M180 74v26', 188, 92],
	['dim B', 140, 190, 230, 0, 'M180 160v30', 188, 180],
	['dim C', 10, 113, 100, 0, 'M90 130h40', 100, 124],
	['dim D', 270, 113, -90, 0, 'M230 130h40', 238, 124],
];

export default function make({ id = 'st' } = {}) {
	const a = anim({
		id,
		h: 232,
		loop: { cycle: 8 },
		title: 'A star schema: one fact table, dimension tables around it',
		desc:
			'A fact table sits in the middle. Four dimension tables, dim A, dim B, dim C and dim D, slide in one after another from the edges, and a short link labeled with a key joins each one to the fact table: ka, kb, kc and kd. The picture is a star.',
		caption: 'In a star schema the fact table holds the events, with a key to each dimension. A query joins the fact table to the dimension tables it needs, one join per key.',
		phases: [
			[1, 'The fact table: one row per event', { role: 'out', key: 'A fact table has one row per event, such as a sale.', changes: [['+', 'fact table: many rows']] }],
			[2, 'Dimension tables arrive one by one', { role: 'src', key: 'Dimension tables describe the things in the events, such as products or stores.', changes: [['+', '4 dimension tables']] }],
			[6, 'A key links each one to the fact table', { role: 'mat', key: 'The fact table stores one key for each dimension, so a join can link them.', changes: [['+', '4 keys: ka, kb, kc, kd']] }],
			[7, 'A star: one join per key', { role: 'out', key: 'To use a dimension in a query, join the fact table to it on that key: one join per dimension.', changes: [['~', 'a star: 1 fact table, 4 dimensions']] }],
		],
		counters: [
			{ label: 'fact', role: 'out', values: [[1, 1]] },
			{ label: 'dims', role: 'src', values: [[2, 1], [3, 2], [4, 3], [5, 4]] },
			{ label: 'keys', role: 'mat', values: [[3, 1], [4, 2], [5, 3], [6, 4]] },
			{ label: 'joins', role: 'out', values: [[7, 4]] },
		],
	});
	a.text(10, 14, 'A fact table with dimensions around it', 'f11 b');
	a.box(130, 100, 100, 60, { role: 'out', title: 'fact table' });
	a.text(140, 148, 'many rows', 'f10');
	DIMS.forEach(([t, x, y, dx, dy, link, kx, ky], i) => {
		a.move({ dx, dy, at: 2 + i, fx: { in: 2 + i } }, () => a.box(x - dx, y - dy, 80, 34, { role: 'src', title: t }));
		a.path(link, 's-mat', { in: 3 + i, draw: true });
		a.text(kx, ky, `k${'abcd'[i]}`, 'f10 mo b', { in: 3 + i });
	});
	a.rect(124, 94, 112, 72, 's-out', { in: 7, hide: 8, pulse: true }, 8);
	return a;
}

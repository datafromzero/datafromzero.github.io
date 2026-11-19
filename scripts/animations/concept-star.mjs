// Concept animation (SPEC D41, no real data) for the star schema. Metaphor: a fact table in the middle, dimension tables around it,
// each joined by one key. 8 s loop of 8 phases: 1 the fact table alone; 2, 3, 4 and 5 the dimension tables A, B, C and D slide in from
// outside, one per phase; 3, 4, 5 and 6 the key link to each one draws the phase after it arrives; 7 a ring marks the star; 8 hold.
// Facts: a modeling pattern, not engine output: the fact table holds one row per event with a key to each dimension, and a query joins the
// fact table to the dimensions it needs, one join per dimension.
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
		phases: ['The fact table: one row per event', 'Dimension A arrives', 'Its key joins it, and dimension B arrives', 'Key B joins, dimension C arrives', 'Key C joins, dimension D arrives', 'Key D joins', 'A star: one join per key', 'A star: one join per key'],
	});
	a.text(10, 14, 'A fact table with dimensions around it', 'f11 b');
	a.tags(10, 29, [[1, '1 · the fact table: one row per event'], [2, '2 · dimension A arrives'], [3, '3 · key a joins; dimension B arrives'], [4, '4 · key b joins; dimension C arrives'], [5, '5 · key c joins; dimension D arrives'], [6, '6 · key d joins'], [7, '7 · a star: one join per key']]);
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

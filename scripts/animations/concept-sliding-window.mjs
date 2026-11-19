// Concept animation (SPEC D41, no real data) for a sliding window frame and LAG. Metaphor: a frame of three rows slides down the
// ordered rows and each row gets the average of what is inside it; LAG reads the row above. 8 s loop of 8 phases: 1 four ordered rows
// and the frame on row 1 (the two seats above row 1 are empty, dashed); 2 to 4 the frame slides down one row per phase; the average of
// each stop appears the phase after (x1, x1..x2, x1..x3, x2..x4); 6 to 8 LAG shows, per row, the value of the row above (none, x1, x2, x3).
// Facts (DuckDB 2.0.0, concept2/facts.out), v = 2, 4, 6, 8, 10: avg(v) OVER (ORDER BY i ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) is
// 2.0, 3.0, 4.0, 6.0, 8.0 (the first rows average fewer rows); lag(v) OVER (ORDER BY i) is NULL, 2, 4, 6, 8.
import { anim } from '../lib/step-animation.mjs';

const Y0 = 100;
const Y = (i) => Y0 + 30 * i;
const AVG = ['x1', 'x1..x2', 'x1..x3', 'x2..x4'];
const PREV = ['none', 'x1', 'x2', 'x3'];

export default function make({ id = 'sw' } = {}) {
	const a = anim({
		id,
		h: 224,
		loop: { cycle: 8 },
		title: 'A frame slides down the rows; LAG looks one row up',
		desc:
			'Four ordered rows x1 to x4. A frame covering the current row and the two rows before it starts on row 1, where the two seats above are empty. It slides down one row at a time, and each stop gives that row the average of the rows inside the frame: x1, then x1 to x2, then x1 to x3, then x2 to x4. A second column, LAG, shows for each row the value of the row above it: none, x1, x2, x3.',
		caption: 'A window frame is the current row plus the rows around it. The frame slides down and each row gets its own result. LAG reads a value from the row above.',
		phases: ['The frame is this row and 2 before', 'The frame slides to row 2', 'The frame slides to row 3', 'The frame slides to row 4', 'Every row got its average', 'LAG: the row above', 'LAG: row 3 sees x2', 'LAG: row 4 sees x3'],
	});
	a.text(10, 14, 'A frame slides down the rows', 'f11 b');
	a.tags(10, 29, [[1, '1 · frame = this row + 2 before'], [2, '2 · the frame slides to row 2'], [3, '3 · the frame slides to row 3'], [4, '4 · the frame slides to row 4'], [5, '5 · every row got its average'], [6, '6 · LAG: the row above'], [7, '7 · LAG: row 3 sees x2'], [8, '8 · LAG: row 4 sees x3']]);
	a.text(132, 52, 'LAG', 'f10 b mo', { in: 6 }, 'm');
	a.text(270, 52, 'AVG of frame', 'f10 b mo', { in: 1 }, 'm');
	[-2, -1].forEach((i) => a.ghost(10, Y(i), 56, 24));
	AVG.forEach((s, i) => {
		a.chip(10, Y(i), `x${i + 1}`, { role: 'src', level: 2, w: 56 });
		a.chip(230, Y(i), s, { role: 'win', level: 3, w: 80, fx: i ? { in: 2 + i } : undefined });
		a.chip(104, Y(i), PREV[i], { role: 'win', level: i ? 2 : 1, w: 56, fx: { in: i > 1 ? 5 + i : 6 } });
		if (i) a.arrow(68, Y(i - 1) + 12, 102, Y(i) + 12, 's-win', { in: i > 1 ? 5 + i : 6, draw: true });
	});
	a.move({ dy: 30, at: 2 }, () => a.move({ dy: 30, at: 3 }, () => a.move({ dy: 30, at: 4 }, () => a.rect(4, Y(-2) - 3, 68, 90, 's-win', undefined, 8))));
	return a;
}

// Concept animation (SPEC D41) for regression, lesson C11. A made-up miniature, labeled as such on the page: eight dots (x = 1 to 8; y = 2.0, 3.5,
// 3.0, 5.5, 5.0, 7.5, 6.5, 8.5) and three lines. Metaphor: a line misses every dot by a vertical stick; the least squares line is the one whose
// sticks, squared and added, give the smallest sum.
// Facts (computed in Python with numpy, scratch script mini.py): the least squares line is y = 1.25 + 0.875 x; the sum of squared sticks is 35.97
// for the flat line at the mean of y (5.1875), 21.81 for the line y = 2.75 + 0.875 x (the same tilt, 1.5 too high) and 3.81 for the least squares
// line (shown as 36.0, 21.8 and 3.8).
// Positions: X(v) = 40 + 33 v, Y(v) = 196 - 13 v.
// 8 s loop of 8 phases: 1 eight dots; 2 the flat line and its sticks are drawn (3 hold); 4 the tilted line that sits too high replaces it (5 hold);
// 6 the least squares line replaces it; 7 the closing text; 8 hold. The sum shown above the picture changes with the line.
// Live counters and Key idea (D41): each counter shows the dots, sticks or sum drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const X = (v) => 40 + 33 * v;
const Y = (v) => 196 - 13 * v;
const DOTS = [[1, 2.0], [2, 3.5], [3, 3.0], [4, 5.5], [5, 5.0], [6, 7.5], [7, 6.5], [8, 8.5]];
const FLAT = () => 5.1875;
const HIGH = (v) => 2.75 + 0.875 * v;
const BEST = (v) => 1.25 + 0.875 * v;

export default function make({ id = 'lsq' } = {}) {
	const a = anim({
		id,
		h: 244,
		loop: { cycle: 8 },
		title: 'The least squares line is the line whose squared sticks add up to the smallest sum',
		desc:
			'Eight dots rising from left to right. A blue flat line is drawn with a red stick from each dot to the line, and the sum of squared sticks reads 36.0. A tilted line that sits too high replaces it and the sum reads 21.8. The least squares line replaces that and the sticks are short; the sum reads 3.8, the smallest.',
		caption: 'A made-up miniature: eight dots and three lines. A stick is the gap from a dot up or down to the line; the best line has the smallest sum of squared sticks.',
		phases: [
			[1, 'Eight dots, each with an x and a y', { role: 'src', key: 'Each dot is one case with an x and a y; a fitted line predicts y from x.', changes: [['+', '8 dots']] }],
			[2, 'A flat line misses by a lot', { role: 'flt', key: 'A stick is the gap between a dot and the line: what the line gets wrong for that case.', changes: [['+', '1 line, 8 sticks']] }],
			[4, 'Right tilt, but too high', { role: 'flt', key: 'Squaring each stick and adding them gives one score for a line; a smaller score is a better fit.', changes: [['~', 'squares: 36.0 to 21.8']] }],
			[6, 'The least squares line', { role: 'out', key: 'The least squares line has the smallest total of squared sticks of all straight lines.', changes: [['~', 'squares: 21.8 to 3.8']] }],
		],
		counters: [
			{ label: 'dots', role: 'src', values: [[1, 8]] },
			{ label: 'sticks', role: 'flt', values: [[2, 8]] },
			{ label: 'squares', role: 'out', values: [[2, '36.0'], [4, '21.8'], [6, '3.8']] },
		],
	});
	a.text(10, 14, 'A line, its sticks and their squares', 'f11 b');
	a.tags(10, 48, [[2, 'sum of squared sticks: 36.0'], [4, 'sum of squared sticks: 21.8'], [6, 'sum of squared sticks: 3.8, the least']], 'f11');
	// axes
	a.path('M40 62V196H340', 'bx');
	a.text(190, 216, 'x', 'f10 mu', undefined, 'm');
	a.text(46, 72, 'y', 'f10 mu');
	// each line with its sticks (sticks under the line, both under the dots)
	const sticks = (f) => DOTS.map(([v, y]) => `M${X(v)} ${Y(y)}V${Y(f(v))}`).join('');
	const line = (f, fx) => a.path(`M${X(0.4)} ${Y(f(0.4))}L${X(8.6)} ${Y(f(8.6))}`, 's-src', fx);
	a.path(sticks(FLAT), 's-flt', { in: 2, hide: 4, draw: true });
	line(FLAT, { in: 2, hide: 4, draw: true });
	a.path(sticks(HIGH), 's-flt', { in: 4, hide: 6, draw: true });
	line(HIGH, { in: 4, hide: 6, draw: true });
	a.path(sticks(BEST), 's-flt', { in: 6, draw: true });
	line(BEST, { in: 6, draw: true });
	for (const [v, y] of DOTS) a.circle(X(v), Y(y), 4.5, tint('src', 4));
	// the legend
	a.path('M10 226h22', 's-src');
	a.text(38, 230, 'line', 'f10');
	a.path('M76 226h22', 's-flt');
	a.text(104, 230, 'stick', 'f10');
	return a;
}

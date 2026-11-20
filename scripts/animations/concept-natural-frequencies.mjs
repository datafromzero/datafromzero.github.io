// Concept animation (SPEC D41) for Bayes with natural frequencies, lesson C4. A made-up miniature, labeled as such on the page (the lesson's own
// numbers are different): 1,000 orders drawn as 100 squares of 10 orders each; 100 orders hold a mistake (10 squares); a check flags 8 in 10 of
// the mistakes (80) and 1 in 10 of the 900 correct orders (90). Flagged = 80 real mistakes + 90 false alarms = 170.
// Colors fixed across Part 1: the data (correct orders) blue, the thing sought (mistakes) ochre, flagged red.
// 8 s loop of 8 phases: 1 the grid of 100 squares and its label; 2 the top row turns ochre: 100 mistakes, 900 correct; 3 hold; 4 the flagged
// squares get a red edge (8 in the mistake row, 9 among the others); 5 hold; 6 a bar of the 170 flagged orders appears, 80 real and 90 false
// alarms; 7 and 8 hold.
// Live counters and Key idea (D41): each counter shows the number drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const X0 = 10;
const Y0 = 60;
const P = 16; // pitch of a square
const FLAGGED_OTHERS = [[1, 2], [2, 5], [3, 7], [4, 0], [5, 4], [6, 8], [7, 3], [8, 6], [9, 1]]; // [row, column] of the 9 flagged correct orders' squares
const PX = 182; // left of the right-hand panel

export default function make({ id = 'nfq' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'A table of 1,000 shows why most flagged orders can be false alarms',
		desc:
			'A grid of 100 squares, each standing for 10 orders. The top row turns ochre: 100 orders hold a mistake and 900 are correct. A check puts a red edge on 8 squares of the mistake row and on 9 squares among the correct orders. A bar then shows the 170 flagged orders as 80 real mistakes and 90 false alarms.',
		caption: 'A made-up miniature: 1,000 orders, 100 with a mistake; the check flags 8 in 10 mistakes and 1 in 10 correct orders. Flagged orders are real mistakes plus false alarms.',
		phases: [
			[1, '1,000 orders in 100 squares', { role: 'src', key: 'Count cases instead of probabilities: 1,000 orders, one square for every 10.', changes: [['+', '1,000 orders']] }],
			[2, 'Split by how common mistakes are', { role: 'out', key: 'First split by the base rate: how many orders hold a mistake and how many are correct.', changes: [['+', '100 mistakes, 900 correct']] }],
			[4, 'The check flags some of each', { role: 'flt', key: 'Then split each group by what the check does to it: it flags some mistakes and some correct orders.', changes: [['+', '80 + 90 flagged']] }],
			[6, 'Flagged = real + false alarms', { role: 'flt', key: 'Among the flagged orders, the real mistakes are only a part; the rest are false alarms.', changes: [['+', 'a bar of 170 flagged orders']] }],
		],
		counters: [
			{ label: 'orders', role: 'src', values: [[1, '1,000']] },
			{ label: 'mistakes', role: 'out', values: [[2, 100]] },
			{ label: 'flagged', role: 'flt', values: [[4, 170]] },
			{ label: 'real', role: 'out', values: [[6, 80]] },
		],
	});
	a.text(10, 14, '1,000 orders, a made-up miniature', 'f11 b');
	// the grid: one fill, the mistake row on top of it, and the borders
	a.rect(X0, Y0, 10 * P, 10 * P, tint('src', 1));
	a.rect(X0, Y0, 10 * P, P, tint('out', 3), { in: 2 });
	a.grid(X0, Y0, Array(10).fill(P), 10, P);
	// the flagged squares: one path with a red edge, drawn inside each square
	const sq = (r, c) => `M${X0 + c * P + 1} ${Y0 + r * P + 1}h${P - 2}v${P - 2}h${-(P - 2)}z`;
	let d = '';
	for (let c = 0; c < 8; c++) d += sq(0, c);
	for (const [r, c] of FLAGGED_OTHERS) d += sq(r, c);
	a.path(d, 's-flt', { in: 4 });
	// the right-hand panel
	a.text(PX, 72, '1,000 orders', 'f11 b');
	a.text(PX, 88, '1 square = 10 orders', 'f10 mu');
	a.g({ in: 2 }, () => {
		a.rect(PX, 104, 10, 10, tint('out', 3), undefined, 2);
		a.text(PX + 16, 113, '100 mistakes', 'f10');
		a.rect(PX, 122, 10, 10, tint('src', 3), undefined, 2);
		a.text(PX + 16, 131, '900 correct orders', 'f10');
	});
	a.g({ in: 4 }, () => {
		a.rect(PX, 142, 10, 10, 's-flt', undefined, 2);
		a.text(PX + 16, 151, 'flagged by the check', 'f10');
		a.text(PX, 167, '80 of the 100 mistakes', 'f10');
		a.text(PX, 181, '90 of the 900 correct', 'f10');
	});
	a.g({ in: 6 }, () => {
		a.text(PX, 199, 'flagged: 170', 'f11 b');
		a.rect(PX, 205, 80, 16, tint('out', 2));
		a.rect(PX + 80, 205, 90, 16, tint('src', 2));
		a.rect(PX, 205, 170, 16, 's-flt', undefined, 3);
		a.text(PX + 40, 217, '80 real', 'f10', undefined, 'm');
		a.text(PX + 125, 217, '90 false alarms', 'f10', undefined, 'm');
	});
	return a;
}

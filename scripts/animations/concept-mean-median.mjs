// Concept animation (SPEC D41) for center, lesson C2. A made-up miniature, labeled as such on the page: five orders of 10, 12, 14, 16 and 18
// dollars on a number line from 0 to 100, then a sixth, 100 (a 10 typed with an extra zero). Metaphor: the mean follows an extreme value, the
// median barely moves. Colors fixed across Part 1: mean = ochre dashed line, median = green solid line, the data = blue dots, the odd value = red.
// Facts (computed by hand, checked in Python): mean(10, 12, 14, 16, 18) = 14 and median = 14; mean(10, 12, 14, 16, 18, 100) = 170 / 6 = 28.33
// and median = (14 + 16) / 2 = 15. Positions: x = 20 + 3.2 * dollars.
// 8 s loop of 8 phases: 1 five dots on the line; 2 the mean and the median lines are drawn, both at 14; 3 hold; 4 a sixth dot, 100, appears
// in red; 5 hold; 6 the mean and the median lines move to 28.33 and 15 (the old mean stays as a faint mark); 7 an arrow shows the mean's jump;
// 8 hold. The text row above the line changes from the first pair of values to the second.
// Live counters and Key idea (D41): each counter shows the dots or values drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const X = (v) => 20 + 3.2 * v;
const DOTS = [10, 12, 14, 16, 18];
const BASE = 118; // y of the number line

export default function make({ id = 'mmd' } = {}) {
	const a = anim({
		id,
		h: 196,
		loop: { cycle: 8 },
		title: 'One extreme value moves the mean a long way and the median a little',
		desc:
			'A number line from 0 to 100 dollars with five blue dots between 10 and 18. A green solid line marks the median and an ochre dashed line the mean, both at 14. A sixth dot, red, appears at 100. The mean line moves right to 28.33 and the median line moves slightly right to 15; an arrow shows the long jump of the mean.',
		caption: 'A made-up miniature: five orders, then a sixth of 100 dollars. The mean follows the extreme value; the median is the middle of the sorted values.',
		phases: [
			[1, 'Five orders on a number line', { role: 'src', key: 'Each dot is one order, placed at its total in dollars.', changes: [['+', '5 orders']] }],
			[2, 'Mean and median both mark the middle', { role: 'out', key: 'Mean and median are two answers to “where is the middle?”; here they agree.', changes: [['+', 'mean line'], ['+', 'median line']] }],
			[4, 'An order of 100 joins', { role: 'flt', key: 'One extreme value joins the others; nothing else changes yet.', changes: [['+', '1 order, far to the right']] }],
			[6, 'The mean jumps, the median barely moves', { role: 'out', key: 'The mean follows the extreme value; the median depends on the order of the values, not their size.', changes: [['~', 'mean: 14 to 28.33'], ['~', 'median: 14 to 15']] }],
		],
		counters: [
			{ label: 'orders', role: 'src', values: [[1, 5], [4, 6]] },
			{ label: 'mean', role: 'out', values: [[2, '14.00'], [6, '28.33']] },
			{ label: 'median', role: 'grp', values: [[2, '14.00'], [6, '15.00']] },
		],
	});
	a.text(10, 14, 'Mean and median, a made-up miniature', 'f11 b');
	a.text(10, 54, 'mean 14.00, median 14.00', 'f11', { in: 2, hide: 6 });
	a.text(10, 54, 'mean 28.33, median 15.00', 'f11', { in: 6 });
	// the number line
	a.path(`M${X(0)} ${BASE + 10}H${X(100)}`, 'bx');
	for (const t of [0, 50, 100]) {
		a.path(`M${X(t)} ${BASE + 10}v4`, 'bx');
		a.text(X(t), BASE + 27, String(t), 'f10 mu', undefined, 'm');
	}
	a.text(X(50), BASE + 44, 'order total in dollars', 'f10 mu', undefined, 'm');
	// the lines first (under the dots): median green solid, mean ochre dashed
	a.path(`M${X(14)} ${BASE - 38}V${BASE + 10}`, 's-grp', { in: 2, hide: 6 });
	a.path(`M${X(14)} ${BASE - 38}V${BASE + 10}`, 's-out dsh', { in: 2, hide: 6 });
	a.path(`M${X(15)} ${BASE - 38}V${BASE + 10}`, 's-grp', { in: 6 });
	a.path(`M${X(28.33)} ${BASE - 38}V${BASE + 10}`, 's-out dsh', { in: 6 });
	// the old mean stays as a faint mark with an arrow to the new one
	a.path(`M${X(14)} ${BASE - 30}V${BASE + 10}`, 'bx dsh', { in: 6 });
	a.arrow(X(14), BASE - 46, X(28.33) - 2, BASE - 46, 's-out', { in: 7, draw: true });
	for (const v of DOTS) a.circle(X(v), BASE, 4, tint('src', 4));
	a.circle(X(100), BASE, 4, tint('flt', 4), { in: 4 });
	a.rect(X(100) - 9, BASE - 9, 18, 18, 's-flt', { in: 4, hide: 5, pulse: true }, 9);
	a.text(X(100), BASE - 16, '100', 'f10 b', { in: 4 }, 'm');
	// the legend: line samples with direct names
	a.path('M10 178h22', 's-grp');
	a.text(38, 182, 'median', 'f10');
	a.path('M96 178h22', 's-out dsh');
	a.text(124, 182, 'mean', 'f10');
	a.circle(190, 178, 4, tint('src', 4));
	a.text(199, 182, 'one order', 'f10');
	return a;
}

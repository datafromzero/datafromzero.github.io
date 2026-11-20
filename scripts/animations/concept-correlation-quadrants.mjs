// Concept animation (SPEC D41) for correlation, lesson C10. A made-up miniature, labeled as such on the page: 12 dots with an x and a y, the two
// means, and the sign of each dot's product of distances from the means. Metaphor: r adds up signed distances; mostly plus means the columns rise
// together. Colors: dots blue, plus dots blue, minus dots red.
// Facts (computed in Python with numpy, scratch script mini.py): x values 1.0, 1.8, 2.6, 3.4, 4.4, 5.8, 6.4, 7.2, 8.0, 9.0, 2.0, 8.6 and y values
// 2.0, 1.2, 3.4, 2.6, 3.6, 5.8, 6.6, 5.4, 8.2, 7.0, 6.0, 3.0; mean x = 5.017 and mean y = 4.567; 10 dots have a positive product of distances
// (both above or both below their means) and 2 a negative one ((2.0, 6.0) and (8.6, 3.0)); r = 0.632, so 0.63.
// Positions: X(u) = 40 + 30 u, Y(v) = 190 - 13 v (u, v from 0 to 10).
// 8 s loop of 8 phases: 1 twelve gray dots; 2 the two mean lines are drawn (3 hold); 4 each dot takes its color and the four corners get a plus or
// a minus (5 hold); 6 the count text "10 plus, 2 minus"; 7 the verdict "mostly plus: r = 0.63"; 8 hold.
// Live counters and Key idea (D41): each counter shows the dots, signs or value drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const X = (u) => 40 + 30 * u;
const Y = (v) => 190 - 13 * v;
const DOTS = [[1.0, 2.0], [1.8, 1.2], [2.6, 3.4], [3.4, 2.6], [4.4, 3.6], [5.8, 5.8], [6.4, 6.6], [7.2, 5.4], [8.0, 8.2], [9.0, 7.0], [2.0, 6.0], [8.6, 3.0]];
const MU = 5.017;
const MV = 4.567;

export default function make({ id = 'cqd' } = {}) {
	const a = anim({
		id,
		h: 244,
		loop: { cycle: 8 },
		title: 'The correlation coefficient adds up the signs of how far each dot is from the two means',
		desc:
			'Twelve dots with an x and a y. Two dashed lines mark the mean of x and the mean of y and cut the picture into four corners. Ten dots, above both means or below both, turn blue and get a plus; two dots, in the other corners, turn red and get a minus. The text says 10 plus, 2 minus, then mostly plus, so r is 0.63.',
		caption: 'A made-up miniature: 12 dots. A dot above both means or below both counts a plus, one in another corner a minus; r adds the distances and scales the sum.',
		phases: [
			[1, 'Dots with an x and a y', { role: 'src', key: 'Each dot is one case with two values: a place left to right (x) and a place up and down (y).', changes: [['+', '12 dots']] }],
			[2, 'Cross lines at the two means', { role: 'out', key: 'The two mean lines cut the picture into four corners; a dot’s distances from the means decide its corner.', changes: [['+', '2 mean lines']] }],
			[4, 'Each dot gets a plus or a minus', { role: 'src', key: 'Both distances above, or both below, give a plus; one above and one below gives a minus.', changes: [['+', '10 plus'], ['+', '2 minus']] }],
			[6, 'Mostly plus: r is positive', { role: 'out', key: 'r adds up all the signed distances and scales the sum to fit between −1 and 1.', changes: [['+', 'r = 0.63']] }],
		],
		counters: [
			{ label: 'dots', role: 'src', values: [[1, 12]] },
			{ label: 'plus', role: 'src', values: [[4, 10]] },
			{ label: 'minus', role: 'flt', values: [[4, 2]] },
			{ label: 'r', role: 'out', values: [[6, '0.63']] },
		],
	});
	a.text(10, 14, 'Correlation, a made-up miniature', 'f11 b');
	// axes
	a.path(`M${X(0)} ${Y(0)}H${X(10)}M${X(0)} ${Y(0)}V${Y(10)}`, 'bx');
	a.text(X(5), 216, 'x: the first column', 'f10 mu', undefined, 'm');
	a.text(X(0) + 6, Y(10) - 2, 'y', 'f10 mu');
	// the corner signs (after the dots take their color)
	a.text(X(9.6), Y(9.4), '+', 'f14 b', { in: 4 }, 'm');
	a.text(X(0.6), Y(0.6), '+', 'f14 b', { in: 4 }, 'm');
	a.text(X(0.6), Y(9.4), '−', 'f14 b', { in: 4 }, 'm');
	a.text(X(9.6), Y(0.6), '−', 'f14 b', { in: 4 }, 'm');
	// the mean lines
	a.path(`M${X(MU)} ${Y(10)}V${Y(0)}`, 'ln dsh', { in: 2, draw: true });
	a.path(`M${X(0)} ${Y(MV)}H${X(10)}`, 'ln dsh', { in: 2, draw: true });
	a.text(X(MU), Y(10) - 6, 'mean of x', 'f10', { in: 2 }, 'm');
	a.text(X(10) - 2, Y(MV) - 5, 'mean of y', 'f10', { in: 2 }, 'e');
	// the dots: gray, then colored by the sign of (x - mean x)(y - mean y)
	for (const [u, v] of DOTS) a.circle(X(u), Y(v), 4.5, tint('ord', 4), { in: 1, hide: 4 });
	for (const [u, v] of DOTS) a.circle(X(u), Y(v), 4.5, tint((u - MU) * (v - MV) > 0 ? 'src' : 'flt', 4), { in: 4 });
	// the count and the verdict share one slot
	a.text(X(5), 238, '10 plus, 2 minus', 'f11 b', { in: 6, hide: 7 }, 'm');
	a.text(X(5), 238, 'mostly plus, so r is positive: r = 0.63', 'f11 b', { in: 7 }, 'm');
	return a;
}

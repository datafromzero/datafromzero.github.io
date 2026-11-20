// Concept animation (SPEC D41, no real data) for comparing two groups (core lesson C9). Metaphor: two piles, one gap between their means, and an interval
// around that gap. Two normal curves with the same spread (one SD = 36 px), group A centered at x = 150 and group B at x = 200, so the gap is 50 px (a made-up
// size; the picture claims no number). The overlap is the area under the lower of the two curves. A second axis, below, shows the gap as one number with an
// interval around it, drawn so that 0 lies outside the interval (a clear difference); the picture says nothing about a p-value.
// 8 s loop of 8 phases: 1 the two piles; 2 the two means as dashed lines and the arrow for the gap; 3 holds; 4 the overlap is shaded gray; 5 holds; 6 the
// difference axis with 0 and the interval; 7 holds; 8 the three labels: p, size, interval.
// Colors by meaning, the same in C5 to C9: green = the first group, purple = the second group, ochre = 0 (no difference), blue = the estimate (the gap) and its interval.
import { anim, tint } from '../lib/step-animation.mjs';

const BASE = 150;
const H = 70;
const SD = 36;
const A = 150;
const B = 200;
const g = (x, c) => BASE - H * Math.exp(-(((x - c) / SD) ** 2) / 2);
const r1 = (n) => Math.round(n * 10) / 10;
const pts = (fn, x0, x1) => {
	const out = [];
	for (let x = x0; x <= x1; x += 5) out.push(`${r1(x)} ${r1(fn(x))}`);
	return out;
};
const area = (fn, x0, x1) => `M${x0} ${BASE}L${pts(fn, x0, x1).join('L')}L${x1} ${BASE}Z`;
const line = (fn, x0, x1) => `M${pts(fn, x0, x1).join('L')}`;
const lower = (x) => Math.max(g(x, A), g(x, B)); // pixel y of the lower curve: larger y is lower on the page

export default function make({ id = 'tgp' } = {}) {
	const a = anim({
		id,
		h: 316,
		loop: { cycle: 8 },
		title: 'Two piles, the gap between their means, and an interval around the gap',
		desc:
			'Two bell-shaped piles side by side, group A in green and group B in purple, overlapping in the middle. Dashed lines mark the two means and an arrow between them is labeled gap. The overlap of the piles is shaded gray. Below, a second line shows the difference between the groups: an ochre mark at 0, a blue dot for the gap and a blue bar for the interval around it. Three labels name what to report: the p-value, the size and the interval.',
		caption: 'Two groups give two piles. The gap between their means is what you test; how much the piles overlap shows how big it is next to the spread; an interval around the gap shows how sure you are.',
		phases: [
			[1, 'Two groups, two piles', { role: 'grp', key: 'Each group has its own pile of values: a center and a spread.', changes: [['+', 'group A and group B']] }],
			[2, 'The gap between the means', { role: 'src', key: 'The gap between the means is what you compare; with random assignment it estimates the effect.', changes: [['+', 'the gap']] }],
			[4, 'The overlap next to the gap', { role: 'mat', key: 'The more the piles overlap, the smaller the gap is next to the spread: Cohen’s d measures that.', changes: [['+', 'the overlap']] }],
			[6, 'An interval around the gap', { role: 'src', key: 'The interval says which gaps the data do not rule out: look at where 0 sits in it.', changes: [['+', 'a difference line, 0, an interval']] }],
			[8, 'Report all three', { role: 'out', key: 'Report the p-value, the size and the interval together: none of the three can stand in for the others.', changes: [['+', 'three things to report']] }],
		],
		counters: [
			{ label: 'groups', role: 'grp', values: [[1, 2]] },
			{ label: 'means', role: 'src', values: [[2, 2]] },
			{ label: 'interval', role: 'src', values: [[6, 1]] },
		],
	});
	a.text(10, 14, 'Compare two groups', 'f11 b');
	// the two piles (fills first, then the overlap, then the outlines)
	a.path(area((x) => g(x, A), 60, 240), tint('grp', 2));
	a.path(area((x) => g(x, B), 110, 290), tint('mat', 2));
	a.path(area(lower, 110, 240), tint('ord', 4), { in: 4 });
	a.path(line((x) => g(x, A), 60, 240), 's-grp');
	a.path(line((x) => g(x, B), 110, 290), 's-mat');
	a.path(`M20 ${BASE}H340`, 'bx');
	a.text(40, 116, 'group A', 'f10 b');
	a.text(330, 116, 'group B', 'f10 b', undefined, 'e');
	// the means and the gap
	a.path(`M${A} ${BASE}V${BASE - H - 12}`, 's-grp dsh', { in: 2 });
	a.path(`M${B} ${BASE}V${BASE - H - 12}`, 's-mat dsh', { in: 2 });
	a.arrow(A + 3, 62, B - 3, 62, 's-src', { in: 2, draw: true });
	a.arrow(B - 3, 62, A + 3, 62, 's-src', { in: 2, draw: true });
	a.text((A + B) / 2, 52, 'gap', 'f10 b', { in: 2 }, 'm');
	a.text(A, BASE + 16, 'mean A', 'f10 mu', { in: 2 }, 'm');
	a.text(B, BASE + 16, 'mean B', 'f10 mu', { in: 2 }, 'm');
	a.text((A + B) / 2, 134, 'overlap', 'f10 b', { in: 4 }, 'm');
	// the difference line with 0 and the interval around the gap
	a.path('M20 262H340', 'bx', { in: 6 });
	a.path('M90 226V270', 's-out', { in: 6 });
	a.text(84, 222, 'no difference', 'f10 b', { in: 6 }, 'e');
	a.rect(105, 243, 70, 6, tint('src', 4), { in: 6 }, 3);
	a.circle(140, 246, 5, tint('src', 4), { in: 6 });
	a.text(140, 238, 'interval', 'f10 b', { in: 6 }, 'm');
	a.text(340, 278, 'difference between the groups', 'f10 mu', { in: 6 }, 'e');
	// what to report
	a.badge(14, 290, 'p: real?', 'src', { in: 8 });
	a.badge(89, 290, 'size: how big?', 'grp', { in: 8 });
	a.badge(203, 290, 'interval: how sure?', 'out', { in: 8 });
	return a;
}

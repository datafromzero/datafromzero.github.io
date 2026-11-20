// Concept animation (SPEC D41) for correlation, lesson C10, shown after the data answer of unit 3. A made-up miniature, labeled as such on the
// page: 15 people in three groups. Metaphor: a line through the whole cloud rises, but the dots sit in three clumps along it and inside each
// clump the line is flat, so the rise is made by which group a person is in.
// Facts (computed by hand): each clump is 5 dots with pixel offsets from its center (dx, dy) of (-12, 4), (-6, -6), (0, 8), (6, -6), (12, 4) for
// the first and third clump and (-12, -4), (-6, 6), (0, -8), (6, 6), (12, -4) for the second; the sum of dx times dy is 0 in both, so the
// correlation inside every clump is exactly 0 (a flat line). Centers: (90, 160), (190, 120), (290, 80); the line through all dots
// goes from (50, 176) to (330, 64) and passes through the three centers.
// 8 s loop of 8 phases: 1 fifteen gray dots; 2 the line through all of them is drawn (3 hold); 4 the dots take three colors (5 the letters
// A B C appear); 6 a flat line is drawn inside each clump; 7 the closing text; 8 hold.
// Live counters and Key idea (D41): each counter shows the dots, groups or lines drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const P1 = [[-12, 4], [-6, -6], [0, 8], [6, -6], [12, 4]];
const P2 = [[-12, -4], [-6, 6], [0, -8], [6, 6], [12, -4]];
const GROUPS = [
	{ name: 'A', role: 'grp', cx: 90, cy: 160, offs: P1 },
	{ name: 'B', role: 'mat', cx: 190, cy: 120, offs: P2 },
	{ name: 'C', role: 'win', cx: 290, cy: 80, offs: P1 },
];

export default function make({ id = 'cfs' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'A line through the whole cloud can rise while the line inside every group is flat',
		desc:
			'Fifteen dots in one cloud with a blue line rising through them. The dots take three colors, green, purple and magenta, and sit in three clumps along the line, labeled A, B and C. A short flat line is drawn inside each clump. The text says the rise comes from the groups.',
		caption: 'A made-up miniature: 15 people in three groups. The line through all of them rises; inside each group it is flat.',
		phases: [
			[1, 'Fifteen dots in one cloud', { role: 'src', key: 'Each dot is a person: more activity to the right, more buying higher up.', changes: [['+', '15 dots']] }],
			[2, 'A line through all of them', { role: 'src', key: 'Through the whole cloud the line rises: more activity goes with more buying.', changes: [['+', '1 rising line']] }],
			[4, 'Colored by a third thing', { role: 'grp', key: 'A third thing, the group, sorts the dots into three clumps, and the clumps sit along the line.', changes: [['~', '3 groups, 3 colors']] }],
			[6, 'A line inside each group', { role: 'mat', key: 'Inside each group the line is flat: the rise came from which group a person is in.', changes: [['+', '3 flat lines']] }],
		],
		counters: [
			{ label: 'dots', role: 'src', values: [[1, 15]] },
			{ label: 'groups', role: 'grp', values: [[1, 1], [4, 3]] },
			{ label: 'lines', role: 'src', values: [[2, 1], [6, 4]] },
		],
	});
	a.text(10, 14, 'A third thing splits the cloud', 'f11 b');
	// axes and their words
	a.path('M40 50V196H340', 'bx');
	a.text(46, 52, 'buys more ↑', 'f10 mu');
	a.text(190, 214, 'more first-week activity →', 'f10 mu', undefined, 'm');
	// the line through all the dots, then the flat line inside each group (under the dots)
	a.path('M50 176L330 64', 's-src', { in: 2, draw: true });
	for (const g of GROUPS) a.path(`M${g.cx - 22} ${g.cy}H${g.cx + 22}`, `s-${g.role}`, { in: 6, draw: true });
	// the dots: gray first, colored by group from phase 4
	for (const g of GROUPS) for (const [dx, dy] of g.offs) a.circle(g.cx + dx, g.cy + dy, 4.5, tint('ord', 4), { in: 1, hide: 4 });
	for (const g of GROUPS) for (const [dx, dy] of g.offs) a.circle(g.cx + dx, g.cy + dy, 4.5, tint(g.role, 4), { in: 4 });
	for (const g of GROUPS) a.text(g.cx, g.cy - 20, g.name, 'f11 b', { in: 5 }, 'm');
	a.text(190, 230, 'the rise comes from the groups', 'f10', { in: 7 }, 'm');
	return a;
}

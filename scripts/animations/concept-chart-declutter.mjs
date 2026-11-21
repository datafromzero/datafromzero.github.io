// Concept animation (SPEC D41, no real data) for decluttering a chart (core lesson C15). Metaphor: a default chart carries things the reader does not need;
// take them away, keep one color for the one bar that matters, and let the title say what to see. A made-up bar chart with five bars A to E (heights in px
// 60, 80, 70, 130, 75 on one baseline); the picture claims no number.
// 8 s loop of 8 phases in four steps: 1 to 2 the default chart (five colors, five gridlines, a frame, a legend, the generic title "Chart title");
// 3 to 4 the gridlines, frame, legend and rainbow go and the bars turn gray; 5 to 6 bar D takes the one highlight color; 7 to 8 the generic title is
// replaced by a title that states the point.
// Facts: none beyond the order of the edits, which the lesson shows on app-events. Counters count what is drawn: colors 5, then 1, then 2;
// gridlines 5, then 0; the title is "generic", then "takeaway".
// The step label is drawn by the generator at the top left (up to about 150 px wide); the chart title sits below it at y = 56.
import { anim, tint } from '../lib/step-animation.mjs';

const BASE = 262;
const HEIGHTS = [60, 80, 70, 130, 75];
const ROLES = ['src', 'mat', 'flt', 'grp', 'out'];
const X = (i) => 46 + i * 52;

export default function make({ id = 'cdc' } = {}) {
	const a = anim({
		id,
		h: 300,
		loop: { cycle: 8 },
		title: 'Take away what does not help, keep one color, and let the title say the point',
		desc:
			'A made-up bar chart with five bars labeled A to E. At first it is a default chart: every bar has its own color, five gridlines cross it, a frame surrounds it, a legend sits at the top right and the title is just the words Chart title. Then the gridlines, frame and legend disappear and the bars turn gray. Then bar D, the tallest, takes one blue highlight color. Last, the title is replaced by a sentence that says bar D is the highest.',
		caption: 'Edit a chart in this order: remove what does not help, give one color to the bar that matters, and write the point into the title.',
		phases: [
			[1, 'The default chart', { role: 'ord', key: 'A default chart brings a rainbow, gridlines, a frame and a legend before it says anything.', changes: [['+', '5 colors'], ['+', '5 gridlines']] }],
			[3, 'Remove what does not help', { role: 'flt', key: 'Take away what the reader does not need: the lines, the frame, the legend and the rainbow.', changes: [['−', '5 gridlines'], ['−', '4 colors']] }],
			[5, 'One color for the point', { role: 'src', key: 'Give a color only to the bar that matters and leave the rest gray.', changes: [['+', '1 highlight']] }],
			[7, 'The title says the point', { role: 'out', key: 'Put the takeaway in the title, so the reader knows what to look for before looking.', changes: [['~', 'the title states the point']] }],
		],
		counters: [
			{ label: 'colors', role: 'src', values: [[1, 5], [3, 1], [5, 2]] },
			{ label: 'gridlines', role: 'flt', values: [[1, 5], [3, 0]] },
			{ label: 'title', role: 'out', values: [[1, 'generic'], [7, 'the point']] },
		],
	});
	a.text(10, 14, 'Strip it, then point', 'f11 b');
	// the frame, the gridlines and the legend of the default chart
	a.rect(30, 66, 316, 214, 'bx', { hide: 3 });
	for (let k = 1; k <= 5; k++) a.path(`M30 ${BASE - 38 * k}H346`, 'bx', { hide: 3 });
	a.rect(262, 72, 76, 46, 'bx dsh', { hide: 3 });
	a.text(270, 86, 'legend', 'f10 mu', { hide: 3 });
	ROLES.forEach((r, i) => a.rect(270 + i * 13, 96, 9, 9, tint(r, 3), { hide: 3 }, 2));
	// the bars: a rainbow at first, then gray, with bar D in the highlight color from step 3
	HEIGHTS.forEach((h, i) => {
		a.rect(X(i), BASE - h, 34, h, tint(ROLES[i], 3), { hide: 3 }, 3);
		a.rect(X(i), BASE - h, 34, h, tint('ord', 2), { in: 3 }, 3);
	});
	a.rect(X(3), BASE - HEIGHTS[3], 34, HEIGHTS[3], tint('src', 4), { in: 5 }, 3);
	['A', 'B', 'C', 'D', 'E'].forEach((l, i) => a.text(X(i) + 17, BASE + 14, l, 'f10 b', undefined, 'm'));
	// the titles
	a.text(10, 56, 'Chart title', 'f11 b', { hide: 7 });
	a.text(10, 56, 'D is the highest', 'f11 b', { in: 7 });
	return a;
}

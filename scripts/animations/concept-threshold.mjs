// Concept animation (SPEC D41, no real data) for classification thresholds and the confusion matrix (core lesson C21). Metaphor: rank the rows by score, put
// a threshold line on the ranking, and every row on its right is flagged; each threshold sorts the rows into four counts. Abstract only: ten dots on a score
// axis, each labeled Y (the outcome happened) or N (it did not), in the made-up order N N N Y N N Y N Y Y from the lowest score to the highest.
// Nothing in the picture is a number of the lesson, and no Predict of the lesson asks about this ranking.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the ten dots ranked by score; 3 to 4 a threshold before the last two dots (flagged 2: TP 2, FP 0, FN 2);
// 5 to 6 a lower threshold before the last four dots (flagged 4: TP 3, FP 1, FN 1); 7 to 8 a still lower threshold before the last seven dots (flagged 7: TP 4,
// FP 3, FN 0). Facts: counted from the ten dots above (4 Y, 6 N). Counters follow the steps.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, tint } from '../lib/step-animation.mjs';

const OUTCOME = ['N', 'N', 'N', 'Y', 'N', 'N', 'Y', 'N', 'Y', 'Y']; // from the lowest score to the highest
const X = (i) => 30 + 33 * i; // dot centers
const CY = 110;
const STEPS = [
	{ from: 8, at: 3 }, // flagged: dots 8 and 9
	{ from: 6, at: 5 }, // dots 6 to 9
	{ from: 3, at: 7 }, // dots 3 to 9
];

export default function make({ id = 'thr' } = {}) {
	const a = anim({
		id,
		h: 214,
		loop: { cycle: 8 },
		title: 'A threshold on a ranking flags the rows above it and sorts them into four counts',
		desc:
			'Ten dots on a score axis from low to high, each labeled Y or N for the true outcome, in the order N N N Y N N Y N Y Y. A dashed threshold line stands before the last two dots, then before the last four, then before the last seven; the dots to its right are bracketed as flagged. The counters read flagged 2, 4 and 7, true positives 2, 3 and 4, false positives 0, 1 and 3, and false negatives 2, 1 and 0.',
		caption: 'Every row at or above the threshold is flagged; each threshold gives a different count of true positives, false positives and false negatives.',
		phases: [
			[1, 'Rows ranked by score', { role: 'src', key: 'Each row has a score, and its true outcome is Y or N.', changes: [['+', '10 rows, 4 Y and 6 N']] }],
			[3, 'A high threshold flags few', { role: 'flt', key: 'Rows at or above the threshold are flagged; the others are not.', changes: [['+', 'a threshold'], ['+', '2 rows flagged']] }],
			[5, 'A lower threshold flags more', { role: 'flt', key: 'Moving the threshold changes which rows are flagged.', changes: [['~', 'threshold moved down'], ['+', '2 more rows flagged']] }],
			[7, 'A still lower one flags most', { role: 'out', key: 'Each threshold sorts every row into one of four counts: TP, FP, FN or TN.', changes: [['~', 'threshold moved down'], ['+', '3 more rows flagged']] }],
		],
		counters: [
			{ label: 'flagged', role: 'flt', values: [[3, 2], [5, 4], [7, 7]] },
			{ label: 'TP', role: 'grp', values: [[3, 2], [5, 3], [7, 4]] },
			{ label: 'FP', role: 'flt', values: [[3, 0], [5, 1], [7, 3]] },
			{ label: 'FN', role: 'mat', values: [[3, 2], [5, 1], [7, 0]] },
		],
	});
	a.text(10, 14, 'Rank, then cut', 'f11 b');

	// dots: gray ring tinted by the true outcome, letter inside
	OUTCOME.forEach((o, i) => {
		a.circle(X(i), CY, 12, tint(o === 'Y' ? 'mat' : 'ord', o === 'Y' ? 3 : 2));
		a.text(X(i), CY + 4, o, 'f11 b', undefined, 'm');
	});
	a.path(`M${X(0) - 18} ${CY + 28}H${X(9) + 18}`, 'ln');
	a.text(X(0) - 18, CY + 44, 'low score', 'f10 mu');
	a.text(X(9) + 18, CY + 44, 'high score', 'f10 mu', undefined, 'e');

	// one threshold per step: a dashed line between two dots, a bracket over the flagged dots, a label
	STEPS.forEach(({ from, at }, k) => {
		const fx = { in: at, ...(k < STEPS.length - 1 ? { hide: STEPS[k + 1].at } : {}) };
		const lineX = (X(from - 1) + X(from)) / 2;
		const left = lineX + 4;
		const right = X(9) + 14;
		a.path(`M${lineX} ${CY - 34}V${CY + 28}`, 's-flt dsh', { ...fx, draw: true });
		a.path(`M${left} ${CY - 26}V${CY - 32}H${right}V${CY - 26}`, 's-flt', fx);
		a.text((left + right) / 2, CY - 40, 'flagged', 'f10 b', fx, 'm');
	});
	a.text(10, CY + 76, 'Y: it happened, N: it did not', 'f10 mu');
	return a;
}

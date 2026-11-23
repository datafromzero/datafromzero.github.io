// Concept animation (SPEC D41, no real data) for the analyst's loop (Data Analyst lesson 1, the-analysts-loop). Metaphor: a scoped question goes down a
// line of five stages, each of which leaves one thing behind, and what you learn at the end can send you back to the question. Abstract only: one
// chip named scoped question, five stage chips (extract, wrangle, summarize, visualize, communicate), the thing each leaves behind as plain text, and
// an arrow from the last stage back to the question. It shows no result and no number, so it never gives away a Predict of the lesson.
// 8 s loop of 8 phases in six steps: 1 the question; 2 to 5 one stage each; 6 (phases 6 to 8) the last stage, then the arrow back.
// Facts: the five stages and their order, as the lesson names them. The leftovers (a query, a clean table and a log, numbers that were checked, one chart,
// a memo that ends in a decision) are the lesson's own list.
// Counters (D41): stages 1 to 5; loops 1 (the arrow back), each at the phase that draws it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const STAGES = [
	['extract', 2, 'src', 'a query'],
	['wrangle', 3, 'mat', 'a clean table and a log'],
	['summarize', 4, 'grp', 'numbers you have checked'],
	['visualize', 5, 'win', 'one chart'],
	['communicate', 6, 'out', 'a memo that ends in a decision'],
];
const X = 10;
const W = 118;
const TOP = 70;
const STEP = 36;

export default function make({ id = 'al' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'The analyst loop: a scoped question, five stages, and a way back',
		desc:
			'A chip named scoped question sits at the top. Below it five stage chips stand in a column, joined by arrows pointing down: extract, wrangle, summarize, visualize and communicate. To the right of each stage is the one thing it leaves behind: a query, a clean table and a log, numbers you have checked, one chart, and a memo that ends in a decision. A last arrow runs from communicate back up to the scoped question.',
		caption: 'A scoped question goes through five stages, each leaving one thing you can check, and what you learn can send you back to the question.',
		phases: [
			[1, 'Start from a scoped question', { role: 'src', key: 'Every stage below works for one written question, not for a vague request.', changes: [['+', '1 question']] }],
			[2, 'Extract: pull the rows', { role: 'src', key: 'Take only the columns and dates the question needs.', changes: [['+', 'stage 1']] }],
			[3, 'Wrangle: clean and join', { role: 'mat', key: 'Fix what is wrong with the rows and keep a log of what you changed.', changes: [['+', 'stage 2']] }],
			[4, 'Summarize: count and compare', { role: 'grp', key: 'Compute the numbers, then check one of them a second way.', changes: [['+', 'stage 3']] }],
			[5, 'Visualize: one chart', { role: 'win', key: 'Draw the one comparison the decision needs.', changes: [['+', 'stage 4']] }],
			[6, 'Communicate, then loop back', { role: 'out', key: 'End in a decision; what you learned may change the question.', changes: [['+', 'stage 5'], ['+', '1 way back']] }],
		],
		counters: [
			{ label: 'stages', role: 'src', values: [[2, 1], [3, 2], [4, 3], [5, 4], [6, 5]] },
			{ label: 'loops', role: 'out', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'One question, five stages', 'f11 b');
	a.chip(X, 30, 'scoped question', { role: 'ord', level: 2, w: W, h: 26 });
	a.arrow(X + W / 2, 56, X + W / 2, TOP - 2, 's-src', { in: 2, draw: true });
	STAGES.forEach(([label, phase, role, leaves], i) => {
		const y = TOP + i * STEP;
		a.chip(X, y, label, { role, level: 2, w: W, h: 26, fx: { in: phase } });
		a.text(X + W + 40, y + 17, leaves, 'f10', { in: phase });
		if (i < STAGES.length - 1) a.arrow(X + W / 2, y + 26, X + W / 2, y + STEP - 2, `s-${STAGES[i + 1][2]}`, { in: STAGES[i + 1][1], draw: true });
	});
	const yLast = TOP + 4 * STEP + 13;
	a.path(`M${X + W} ${yLast}L${X + W + 22} ${yLast}L${X + W + 22} 43`, 's-ord', { in: 7, draw: true });
	a.arrow(X + W + 22, 43, X + W + 2, 43, 's-ord', { in: 7, draw: true });
	a.text(X + W + 40, 47, 'what you learn may change it', 'f10', { in: 7 });
	return a;
}

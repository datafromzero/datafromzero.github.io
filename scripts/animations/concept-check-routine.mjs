// Concept animation (SPEC D41, no real data) for checking AI output (core lesson C38). Metaphor: five checks in a fixed order stand between an AI output
// and your decision. Abstract only: a chip named AI output, five numbered check chips in a column (predict, count, reconcile, look up, decide) and, at the
// end, three outcome chips (accept, revise, reject). It shows no verdict for any check, so it never gives away a Predict of the lesson.
// 8 s loop of 8 phases in six steps: 1 the output; 2 predict; 3 count; 4 reconcile; 5 look up; 6 to 8 decide, then the three outcomes.
// Facts: the structure of the five checks of the lesson, in this order.
// Counters (D41): checks 1 to 5; outcomes 3; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const CHECKS = [
	['1  predict', 2, 'src', 44],
	['2  count', 3, 'mat', 78],
	['3  reconcile', 4, 'grp', 112],
	['4  look up', 5, 'win', 146],
	['5  decide', 6, 'out', 180],
];

export default function make({ id = 'cr' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'Five checks stand between an AI output and your decision',
		desc:
			'A chip named AI output sits on the left. Five numbered check chips stand in a column to its right: predict, count, reconcile, look up and decide. After the fifth, three outcome chips appear: accept, revise and reject.',
		caption: 'An AI output passes five checks in a fixed order before you decide to accept it, revise it or reject it.',
		phases: [
			[1, 'An output, not yet trusted', { role: 'src', key: 'An AI output is a draft until it has been checked against something outside the model.', changes: [['+', '1 output']] }],
			[2, 'Before you run it: predict', { role: 'src', key: 'Write down the shape and a few values first, so the answer cannot sway you.', changes: [['+', 'check 1']] }],
			[3, 'Around every join and filter: count', { role: 'mat', key: 'Count rows and nulls before and after each step.', changes: [['+', 'check 2']] }],
			[4, 'Against another route: reconcile', { role: 'grp', key: 'Get one total a second way that does not reuse the first way.', changes: [['+', 'check 3']] }],
			[5, 'Against the manual: look up', { role: 'win', key: 'Every name the answer uses must exist in your version, schema or source.', changes: [['+', 'check 4']] }],
			[6, 'Then a decision', { role: 'out', key: 'End with one verdict and one sentence of reason.', changes: [['+', 'check 5'], ['+', '3 outcomes']] }],
		],
		counters: [
			{ label: 'output', role: 'src', values: [[1, 1]] },
			{ label: 'checks', role: 'grp', values: [[2, 1], [3, 2], [4, 3], [5, 4], [6, 5]] },
			{ label: 'outcomes', role: 'out', values: [[7, 3]] },
		],
	});
	a.text(10, 14, 'Five checks, then a decision', 'f11 b');
	a.chip(10, 102, 'AI output', { role: 'src', level: 2, w: 84, h: 28 });
	CHECKS.forEach(([label, phase, role, y]) => {
		a.arrow(94, 116, 118, y + 12, `s-${role}`, { in: phase, draw: true });
		a.chip(122, y, label, { role, level: 2, w: 118, h: 26, fx: { in: phase } });
	});
	a.arrow(240, 193, 258, 193, 's-out', { in: 7, draw: true });
	a.chip(262, 150, 'accept', { role: 'out', level: 3, w: 88, h: 24, fx: { in: 7 } });
	a.chip(262, 181, 'revise', { role: 'grp', level: 3, w: 88, h: 24, fx: { in: 7 } });
	a.chip(262, 212, 'reject', { role: 'flt', level: 3, w: 88, h: 24, fx: { in: 7 } });
	return a;
}

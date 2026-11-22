// Concept animation (SPEC D41, no real data) for AI statistics and stories (core lesson C41). Metaphor: five questions stand between a claim and the page.
// Abstract only: a chip named a claim and five question chips (right test, tests counted, design behind the verb, traces to output, source resolves), each
// with an empty ring that fills when it is answered. It shows no answer to any question, so it never gives away a Predict of the lesson.
// 8 s loop of 8 phases in five steps: 1 a claim; 2 to 3 the two questions about the method; 4 the question about the cause; 5 to 6 the two questions about
// the trail; 7 to 8 the five rings fill (every question answered).
// Facts: the structure of the lesson's five checks; no engine output.
// Counters (D41): claims 1, questions 2, 3 then 5, answered 5; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const Q = [
	['right test', 2, 44],
	['tests counted', 3, 74],
	['design behind the verb', 4, 104],
	['traces to output', 5, 134],
	['source resolves', 6, 164],
];

export default function make({ id = 'ct' } = {}) {
	const a = anim({
		id,
		h: 218,
		loop: { cycle: 8 },
		title: 'Five questions stand between a claim and the page',
		desc:
			'A chip named a claim sits on the left. Five question chips stand in a column to its right: right test, tests counted, design behind the verb, traces to output and source resolves. Each has an empty ring that fills when the question is answered, and at the end all five rings are filled.',
		caption: 'A claim in an AI answer has to survive five questions: the test, the count of tests, the design, the trail to output and the source.',
		phases: [
			[1, 'A claim in the text', { role: 'src', key: 'A claim is a sentence with a number, a verb of cause or a citation in it.', changes: [['+', '1 claim']] }],
			[2, 'Ask about the method', { role: 'mat', key: 'Ask whether the test fits the data, and how many tests were run to find the result.', changes: [['+', '2 questions']] }],
			[4, 'Ask about the cause', { role: 'flt', key: 'A verb of cause needs a design behind it; without one, write that two things go together.', changes: [['+', '1 question']] }],
			[5, 'Ask about the trail', { role: 'out', key: 'Every number must trace to output you can rerun, and every source must resolve.', changes: [['+', '2 questions']] }],
			[7, 'Keep it only if all hold', { role: 'grp', key: 'Keep the claim only when all five answers can be shown, not just believed.', changes: [['~', '5 rings filled']] }],
		],
		counters: [
			{ label: 'claims', role: 'src', values: [[1, 1]] },
			{ label: 'questions', role: 'mat', values: [[2, 2], [4, 3], [5, 5]] },
			{ label: 'answered', role: 'grp', values: [[7, 5]] },
		],
	});
	a.text(10, 14, 'Questions before a claim stays', 'f11 b');
	a.chip(10, 88, 'a claim', { role: 'src', level: 2, w: 90, h: 30 });
	Q.forEach(([label, phase, y]) => {
		a.arrow(100, 103, 126, y + 12, 's-mat', { in: phase, draw: true });
		a.chip(130, y, label, { role: phase === 4 ? 'flt' : phase >= 5 ? 'out' : 'mat', level: 2, w: 170, h: 24, c: 'f10', fx: { in: phase } });
		a.circle(322, y + 12, 8, 'bx', { in: phase });
		a.circle(322, y + 12, 8, 'f-grp k3', { in: 7 });
	});
	return a;
}

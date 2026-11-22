// Concept animation (SPEC D41, no real data) for the unflagged hunts (core lesson C40). Metaphor: no answer arrives with a flag, so the checks are the only alarm
// and you end with a decision. Abstract only: answers A, B and C with empty dashed flag slots, three checks named names, numbers and counts under each answer,
// and a decision chip under each. It shows no check result and no decision, so it never gives away what the lesson's answers hide.
// 8 s loop of 8 phases in four steps: 1 to 2 three answers with an empty flag slot; 3 to 5 the same three checks under each answer, one row at a time;
// 6 a decision chip under each answer; 7 to 8 the words accept, revise or reject with one sentence of reason.
// Facts: the structure of the lesson's routine (names against the schema, numbers traced to code, row counts), no engine output.
// Counters (D41): answers 3, checks 3 for each answer, decisions 3, reasons 3; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const COLS = [12, 132, 252];
const NAMES = ['A', 'B', 'C'];
const ROWS = [
	['names', 3, 108],
	['numbers', 4, 134],
	['counts', 5, 160],
];

export default function make({ id = 'nf' } = {}) {
	const a = anim({
		id,
		h: 252,
		loop: { cycle: 8 },
		title: 'No answer arrives with a flag, so the checks are the alarm',
		desc:
			'Three answers, A, B and C, sit in a row, each with an empty dashed slot marked no flag. Under each answer the same three checks appear one row at a time: names, numbers and counts. A decision chip appears under each answer, and a closing line reads accept, revise or reject, with one sentence of reason.',
		caption: 'Nothing marks an answer as wrong. Run the same checks on every answer, then decide: accept, revise or reject, with one sentence of reason.',
		phases: [
			[1, 'Answers arrive with no flag', { role: 'src', key: 'An answer comes without a hint of what is wrong, or whether anything is.', changes: [['+', '3 answers'], ['+', 'no flags']] }],
			[3, 'Run the same checks on each', { role: 'mat', key: 'The same checks run on every answer, because none of them is marked.', changes: [['+', '3 checks for each answer']] }],
			[6, 'Decide for each answer', { role: 'out', key: 'Every answer ends in a decision, even when no check finds a problem.', changes: [['+', '3 decisions']] }],
			[7, 'Say why in one sentence', { role: 'grp', key: 'The decision comes with one sentence of reason that someone else could check.', changes: [['+', '3 reasons']] }],
		],
		counters: [
			{ label: 'answers', role: 'src', values: [[1, 3]] },
			{ label: 'checks', role: 'mat', values: [[3, 1], [4, 2], [5, 3]] },
			{ label: 'decisions', role: 'out', values: [[6, 3]] },
			{ label: 'reasons', role: 'grp', values: [[7, 3]] },
		],
	});
	a.text(10, 14, 'The same checks on every answer', 'f11 b');
	COLS.forEach((x, i) => {
		a.chip(x, 44, `answer ${NAMES[i]}`, { role: 'src', level: 2, w: 96, h: 26 });
		a.ghost(x, 76, 96, 22);
		a.text(x + 48, 91, 'no flag', 'f10 mu', undefined, 'm');
		ROWS.forEach(([label, phase, y]) => a.chip(x, y, label, { role: 'mat', level: 2, w: 96, h: 22, c: 'f10', fx: { in: phase } }));
		a.chip(x, 192, 'decision', { role: 'out', level: 3, w: 96, h: 24, fx: { in: 6 } });
	});
	a.text(190, 236, 'accept, revise or reject, with one sentence of reason', 'f10 b', { in: 7 }, 'm');
	return a;
}

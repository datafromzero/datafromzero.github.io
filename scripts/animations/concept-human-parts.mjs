// Concept animation (SPEC D41, no real data) for what stays human (core lesson C42). Metaphor: a data job has five parts; one slides to the assistant's
// lane and the rest stay in yours. Abstract only: five chips (ask, define, draft, judge, sign), two lanes, small badges named yours, and a chip named or stop.
// It names no task, no number and no result of the lesson's sort of twelve tasks, so it never gives away a Predict.
// 8 s loop of 8 phases in six steps: 1 five parts; 2 ask and define get a badge; 3 and 4 draft slides up to the assistant lane; 5 judge gets a badge;
// 6 and 7 sign gets a badge, then the chip or stop appears; 8 the closing line.
// Facts: the structure of the lesson's five parts of a job; no engine output.
// Counters (D41): with you 5, then 4; assistant 0, then 1 (both change in step 3, the step in which the chip moves).
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const PARTS = [
	['ask', 'src', 10],
	['define', 'mat', 82],
	['draft', 'out', 154],
	['judge', 'win', 226],
	['sign', 'grp', 298],
];
const YOU = 140;

export default function make({ id = 'hp' } = {}) {
	const a = anim({
		id,
		h: 252,
		loop: { cycle: 8 },
		title: 'Five parts of a data job: one goes to the assistant, the rest stay with you',
		desc:
			'Two lanes: assistant above and you below. Five chips stand in your lane: ask, define, draft, judge and sign. Ask and define get a badge named yours. The draft chip slides up into the assistant lane and leaves a dashed seat behind. Judge and sign get the badge yours, and a chip named or stop appears under sign. A closing line says you answer for the result.',
		caption: 'In a data job the assistant can take the draft; the question, the words, the judgment and the signature stay with you.',
		phases: [
			[1, 'One job, five parts', { role: 'src', key: 'A data job has parts, and some are easier to hand over than others.', changes: [['+', '5 parts']] }],
			[2, 'Ask and define: yours', { role: 'mat', key: 'The question and the meaning of its words are set before any code exists.', changes: [['+', '2 parts marked yours']] }],
			[3, 'Draft: handed over', { role: 'out', key: 'The assistant drafts the query, the code or the text. A draft is not an answer.', changes: [['~', '1 part handed over']] }],
			[5, 'Judge: yours', { role: 'win', key: 'Judging is deciding what the result means and what to do about it.', changes: [['+', '1 more part yours']] }],
			[6, 'Sign, or stop: yours', { role: 'grp', key: 'Signing means answering for the result. You may also decide that nothing goes out.', changes: [['+', 'sign marked yours'], ['+', 'a stop option']] }],
			[8, 'You answer for it', { role: 'flt', key: 'The assistant has no one to answer to. You do.', changes: [['+', 'one name on the result']] }],
		],
		counters: [
			{ label: 'with you', role: 'grp', values: [[1, 5], [3, 4]] },
			{ label: 'assistant', role: 'out', values: [[1, 0], [3, 1]] },
		],
	});
	a.text(10, 14, 'Who does which part', 'f11 b');
	a.text(10, 62, 'assistant lane', 'f10 mu');
	a.path('M10 108 H350', 'ln');
	a.text(10, 130, 'your lane', 'f10 mu');
	a.ghost(154, YOU, 56, 26);
	PARTS.forEach(([label, role, x]) => {
		if (label === 'draft') a.move({ dy: -70, at: 3 }, () => a.chip(x, YOU, label, { role, level: 2, w: 56, h: 26 }));
		else a.chip(x, YOU, label, { role, level: 2, w: 56, h: 26 });
	});
	a.badge(10, 172, 'yours', 'grp', { in: 2 });
	a.badge(82, 172, 'yours', 'grp', { in: 2 });
	a.badge(226, 172, 'yours', 'grp', { in: 5 });
	a.badge(298, 172, 'yours', 'grp', { in: 6 });
	a.chip(298, 198, 'or stop', { role: 'flt', level: 3, w: 56, h: 26, c: 'f10', fx: { in: 7 } });
	a.text(10, 236, 'You answer for the result.', 'f11 b', { in: 8 });
	return a;
}

// Concept animation (SPEC D41, no real data) for AI-assisted analysis (Data Analyst lesson 15, ai-assisted-analysis). Metaphor: four things stay with the
// analyst, the assistant only drafts, every draft meets a check, and the log keeps the verdicts. Abstract only: chips and badges with plain words, no number
// and no cafe value, so it never gives away a Predict of the lesson. (The core figure concept-ai-check shows the five checks of one output; this one shows
// who owns what.)
// 8 s loop of 8 phases in four steps: 1 (phases 1 and 2) the four chips that stay yours; 2 (3 and 4) the three drafts; 3 (5 and 6) an arrow and a
// "checked" badge under each draft; 4 (7 and 8) the line that joins the badges and the words about the log.
// Counters (D41): yours 4; drafts 0, then 3; checked 0, then 3; logged 0, then 3. Each ticks at the phase that draws it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); the labels and chips start below it.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'aid' } = {}) {
	const a = anim({
		id,
		h: 248,
		loop: { cycle: 8 },
		title: 'Four things stay yours; the assistant drafts, every draft is checked and the log keeps the verdicts',
		desc:
			'Four chips under the words stays yours: the question, the definitions, the claim you sign and what you paste. Below them, under the words the assistant drafts, three chips: the plan, the query and the summary. An arrow runs down from each draft to a badge that says checked. A line joins the three badges, and under it the words log: accept, revise or reject, and why.',
		caption: 'Four things stay yours; the assistant drafts, each draft is checked, and the log keeps the verdict and the reason.',
		phases: [
			[1, 'What stays yours', { role: 'out', key: 'Four things stay yours: the question, the definitions, the claim you sign and what you paste.', changes: [['+', '4 yours']] }],
			[3, 'The assistant drafts', { role: 'src', key: 'The assistant drafts the plan, the query and the summary; a draft is not an answer yet.', changes: [['+', '3 drafts']] }],
			[5, 'Each draft is checked', { role: 'grp', key: 'Every draft meets a check that compares it with the data.', changes: [['+', '3 checks']] }],
			[7, 'The log keeps the verdict', { role: 'ord', key: 'The log records the verdict, the reason and what you did not check.', changes: [['+', '3 rows']] }],
		],
		counters: [
			{ label: 'yours', role: 'out', values: [[1, 4]] },
			{ label: 'drafts', role: 'src', values: [[1, 0], [3, 3]] },
			{ label: 'checked', role: 'grp', values: [[1, 0], [5, 3]] },
			{ label: 'logged', role: 'ord', values: [[1, 0], [7, 3]] },
		],
	});
	a.text(10, 14, 'Who owns what', 'f11 b');
	a.text(10, 56, 'stays yours', 'f10 b');
	a.chip(10, 64, 'the question', { role: 'out', level: 2, w: 165, h: 26 });
	a.chip(185, 64, 'the definitions', { role: 'out', level: 2, w: 165, h: 26 });
	a.chip(10, 96, 'the claim you sign', { role: 'out', level: 2, w: 165, h: 26 });
	a.chip(185, 96, 'what you paste', { role: 'out', level: 2, w: 165, h: 26 });
	a.text(10, 148, 'the assistant drafts', 'f10 b', { in: 3 });
	[['the plan', 10], ['the query', 125], ['the summary', 240]].forEach(([label, x]) => {
		a.chip(x, 156, label, { role: 'src', level: 2, w: 110, h: 26, fx: { in: 3 } });
		a.arrow(x + 55, 182, x + 55, 198, 's-grp', { in: 5, draw: true });
		a.badge(x + 55 - 28, 200, 'checked', 'grp', { in: 5 });
	});
	a.path('M65 224L65 232L295 232L295 224', 's-ord', { in: 7, draw: true });
	a.text(180, 244, 'log: accept, revise or reject, and why', 'f10 b', { in: 7 }, 'm');
	return a;
}

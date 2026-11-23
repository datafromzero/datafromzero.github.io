// Concept animation (SPEC D41, no real data) for the planted-error drills (core lesson C39). Metaphor: name the class of mistake, and the class tells you
// which check to run. Abstract only: a chip named AI answer, a chip named its class, a box named its check, a chip named the data and a box named in words.
// It shows no result of any check, so it never gives away the Predict of a drill (a total, a count, an error, an average).
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 an AI answer arrives; 3 to 4 an arrow to a chip named its class; 5 to 6 an arrow to a box named
// its check, which reaches the data; 7 to 8 an arrow to a box named in words and a closing line.
// Facts: the structure of the lesson's four drills (class named first, check run on the data, check written in words); no engine output.
// Counters (D41): answers 1, classes 1, checks 1, sentences 1; each appears with its step (the check counter ticks in phase 6, inside step 3).
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'ec' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'The class of a mistake tells you which check to run',
		desc:
			'A chip named AI answer sits at the top left. An arrow leads to a chip named its class. A second arrow leads down to a box named its check, and an arrow from the box reaches a chip named the data. A last arrow leads left to a box named in words, with a closing line: a class, a check, a sentence.',
		caption: 'An AI answer is a draft. Name the class of its mistake, run the check for that class on the data, then write the check in your own words.',
		phases: [
			[1, 'An AI answer arrives', { role: 'src', key: 'An AI answer is a draft: it can run cleanly and still be wrong.', changes: [['+', '1 answer']] }],
			[3, 'Name its class', { role: 'flt', key: 'Naming the class of mistake tells you which check to run.', changes: [['+', '1 class named']] }],
			[5, 'Run the check for that class', { role: 'mat', key: 'Each class has its own check, and the check runs on the data, not on the answer.', changes: [['+', 'its check'], ['+', 'the data']] }],
			[7, 'Write the check in words', { role: 'grp', key: 'A check you can say in your own words is a check you can run again.', changes: [['+', '1 sentence']] }],
		],
		counters: [
			{ label: 'answers', role: 'src', values: [[1, 1]] },
			{ label: 'classes', role: 'flt', values: [[3, 1]] },
			{ label: 'checks', role: 'mat', values: [[6, 1]] },
			{ label: 'sentences', role: 'grp', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'Class first, then the check', 'f11 b');
	a.chip(10, 50, 'AI answer', { role: 'src', level: 2, w: 96, h: 26 });
	a.arrow(106, 63, 136, 63, 's-flt', { in: 3, draw: true });
	a.chip(140, 50, 'its class', { role: 'flt', level: 3, w: 100, h: 26, fx: { in: 3 } });
	a.arrow(190, 76, 190, 110, 's-mat', { in: 5, draw: true });
	a.box(140, 112, 100, 46, { role: 'mat', title: 'its check', fx: { in: 5 } });
	a.arrow(240, 135, 268, 135, 's-out', { in: 6, draw: true });
	a.chip(270, 122, 'the data', { role: 'out', level: 2, w: 80, h: 26, fx: { in: 6 } });
	a.arrow(140, 135, 110, 135, 's-grp', { in: 7, draw: true });
	a.box(10, 112, 98, 46, { role: 'grp', title: 'in words', fx: { in: 7 } });
	a.text(190, 206, 'a class, a check, a sentence', 'f11 b', { in: 8 }, 'm');
	return a;
}

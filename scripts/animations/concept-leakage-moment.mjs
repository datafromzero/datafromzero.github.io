// Concept animation (SPEC D41, no real data) for data leakage (core lesson C20). Metaphor: a dashed line is the prediction moment; columns that
// settle before it may feed the model, a column that settles after it may not. Abstract only: columns x1, x2, x3, a target y and a box named model.
// Nothing shows a score, so it never gives away the Predict of unit 1 (how good the model with the leaky columns looks).
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the moment (a dashed line, "known before" on its left, "settles after" on its right) and the
// target y on the right; 3 to 4 the columns x1 and x2 on the left with arrows into the model; 5 to 6 a column x3 on the right, tinted red, labeled settles later;
// 7 to 8 a red arrow from x3 across the line into the model, labeled a leak.
// Facts: only the order of the line (before and after the moment), which the lesson shows on app-events.
// Counters (D41): before 2 (x1, x2), after 1 (x3), leaks 1; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'lkm' } = {}) {
	const a = anim({
		id,
		h: 230,
		loop: { cycle: 8 },
		title: 'A column that settles after the prediction moment must not feed the model',
		desc:
			'A vertical dashed line is the prediction moment. Left of it the words known before, right of it the words settles after and a chip y for the target. Two chips, x1 and x2, on the left have blue arrows into a box named model. A chip x3 on the right, tinted red and labeled settles later, has a red arrow that crosses the dashed line into the model, labeled a leak.',
		caption: 'Only columns that settle before the prediction moment may feed the model; an arrow from after the line is a leak.',
		phases: [
			[1, 'The moment, and the target after it', { role: 'src', key: 'A prediction is made at one moment; the target is only known after it.', changes: [['+', 'a moment'], ['+', 'a target y']] }],
			[3, 'Columns known before it', { role: 'grp', key: 'Columns that have settled by the moment can be given to the model.', changes: [['+', '2 columns before'], ['+', 'a model']] }],
			[5, 'A column that settles later', { role: 'flt', key: 'Some columns are filled in only after the moment, once the outcome is on its way.', changes: [['+', '1 column after']] }],
			[7, 'Its arrow crosses the line', { role: 'flt', key: 'Feeding the model a value from after the moment lets the answer into training.', changes: [['+', 'a leak into the model']] }],
		],
		counters: [
			{ label: 'before', role: 'grp', values: [[3, 2]] },
			{ label: 'after', role: 'flt', values: [[5, 1]] },
			{ label: 'leaks', role: 'flt', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'The prediction moment', 'f11 b');

	a.path('M170 56V196', 'ln dsh', { in: 1, draw: true });
	a.text(170, 50, 'moment', 'f10 b', { in: 1 }, 'm');
	a.text(10, 64, 'known before', 'f10 mu', { in: 1 });
	a.text(350, 64, 'settles after', 'f10 mu', { in: 1 }, 'e');
	a.chip(290, 80, 'y', { role: 'out', level: 3, w: 50, fx: { in: 2 } });
	a.text(315, 124, 'target', 'f10 mu', { in: 2 }, 'm');

	a.chip(20, 80, 'x1', { role: 'grp', level: 3, w: 50, fx: { in: 3 } });
	a.chip(90, 80, 'x2', { role: 'grp', level: 3, w: 50, fx: { in: 3 } });
	a.box(20, 170, 120, 34, { role: 'src', title: 'model', fx: { in: 3 } });
	a.arrow(45, 106, 45, 168, 's-grp', { in: 4, draw: true });
	a.arrow(115, 106, 115, 168, 's-grp', { in: 4, draw: true });

	a.chip(190, 80, 'x3', { role: 'flt', level: 3, w: 50, fx: { in: 5 } });
	a.text(200, 132, 'settles later', 'f10 b', { in: 6 });
	a.arrow(215, 106, 150, 180, 's-flt', { in: 7, draw: true });
	a.text(230, 186, 'a leak', 'f11 b', { in: 8 });
	return a;
}

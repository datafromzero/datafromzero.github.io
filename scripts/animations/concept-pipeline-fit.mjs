// Concept animation (SPEC D41, no real data) for the scikit-learn pipeline (ML Engineer lesson MLE1). Metaphor: a pipeline learns once, in fit, from the training
// rows and keeps what it learned on its steps; a new request is then scored with those kept values. Abstract only: three training rows (train 1 to train 3), a box
// named pipeline with two steps and a model, a kept slot beside each, a request chip and a chance chip. It shows no number of the lesson and says nothing about a step
// that recomputes from the rows it is given, so it never gives away a Predict of unit 3 (cross-validation against scoring one request) or unit 4 (the size of the file).
// 8 s loop of 8 phases in five steps: 1 the training rows, an empty pipeline (dashed kept slots); 2 and 3 an arrow carries the rows into the box (phase 2), then a kept
// value appears beside each step (phase 3); 4 and 5 a request chip appears (phase 4) and an arrow carries it into step 1 (phase 5); 6 and 7 each step takes its kept value
// (phase 6), the request flows down the steps (phase 7); 8 an arrow from the model and a chance chip.
// Facts: only the order of the lesson (fit on the training rows, keep, then predict), as the scikit-learn pipelines page and the lesson's unit 3 Idea say it.
// Counters (D41): rows 3, kept 3 (step 2), request 1 (step 3), chance 1 (step 5).
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const STEP_Y = [102, 140, 178]; // step chips, one under the other
const NAMES = ['step 1', 'step 2', 'model'];

export default function make({ id = 'plf' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'A pipeline learns in fit, keeps what it learned, and uses it on every new request',
		desc:
			'Three chips, train 1 to train 3, stand on the left, joined by a bracket. A box named pipeline holds three chips one under the other: step 1, step 2 and model, each with a dashed empty slot beside it. An arrow carries the training rows into the box and a green chip appears in each slot: kept 1, kept 2 and kept 3. A chip named request appears above the box and an arrow carries it into step 1. Short arrows from the kept chips point at their steps, arrows join the steps in order, and an arrow leaves the model for a chip named chance below the box.',
		caption: 'fit learns from the training rows and keeps what it learned; predict applies the kept values to each new request.',
		phases: [
			[1, 'Training rows, an empty pipeline', { role: 'src', key: 'Before fit, the steps hold nothing learned from your people.', changes: [['+', '3 training rows']] }],
			[2, 'fit: the steps learn', { role: 'grp', key: 'In fit, each step learns what it needs from the training rows and keeps it.', changes: [['+', '3 kept values']] }],
			[4, 'A new request arrives', { role: 'win', key: 'A request is one row the pipeline has not seen.', changes: [['+', '1 request']] }],
			[6, 'predict: steps use what they kept', { role: 'mat', key: 'In predict, each step applies the values it kept to the request.', changes: [['~', 'kept values applied']] }],
			[8, 'A chance comes out', { role: 'out', key: 'The last step turns the transformed request into a chance.', changes: [['+', '1 chance']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 3]] },
			{ label: 'kept', role: 'grp', values: [[3, 3]] },
			{ label: 'request', role: 'win', values: [[4, 1]] },
			{ label: 'chance', role: 'out', values: [[8, 1]] },
		],
	});
	a.text(10, 14, 'Learn once, reuse on every request', 'f11 b');

	// the training rows, a bracket and the arrow of phase 2
	[112, 142, 172].forEach((y, i) => a.chip(10, y, `train ${i + 1}`, { role: 'src', level: 2, w: 64, h: 24 }));
	a.path('M74 124H82V184H74', 'ln');
	a.arrow(82, 154, 112, 154, 's-src', { in: 2, hide: 4, draw: true });

	// the pipeline box, its steps and the kept slots
	a.box(112, 74, 238, 140, { role: 'mat', title: 'pipeline' }, () => {});
	STEP_Y.forEach((y, i) => {
		a.chip(136, y, NAMES[i], { role: 'mat', level: 2, w: 90, h: 24 });
		a.ghost(250, y, 90, 24);
		a.chip(250, y, `kept ${i + 1}`, { role: 'grp', level: 2, w: 90, h: 24, fx: { in: 3 } });
		a.arrow(250, y + 12, 229, y + 12, 's-grp', { in: 6, draw: true });
	});

	// the request, the steps in order, and the chance
	a.chip(136, 38, 'request', { role: 'win', level: 2, w: 90, h: 24, fx: { in: 4 } });
	a.arrow(181, 62, 181, 102, 's-win', { in: 5, draw: true });
	a.arrow(181, 126, 181, 140, 's-win', { in: 7, draw: true });
	a.arrow(181, 164, 181, 178, 's-win', { in: 7, draw: true });
	a.arrow(181, 202, 181, 226, 's-out', { in: 8, draw: true });
	a.chip(136, 226, 'chance', { role: 'out', level: 3, w: 90, h: 24, fx: { in: 8 } });
	return a;
}

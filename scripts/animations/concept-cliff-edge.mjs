// Concept animation (SPEC D41, no real data) for what AI can and cannot do in data work (core lesson C36). Metaphor: the same helper, three jobs that get
// more realistic, and the share it gets right gets shorter. Abstract only: three job chips (tidy question, big messy schema, many dependent steps) and a bar
// track beside each that fills to a shorter and shorter length. No number is drawn, and the lesson prints the measured numbers only in its dated box.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 three jobs and three empty tracks; 3 to 4 the first bar fills (long); 5 to 6 the second bar
// fills (shorter); 7 to 8 the third bar fills (shortest).
// Facts: the shape of the claim of the lesson (the same agent, less success as the task gets realistic), measured in Spider 2.0 (arXiv 2411.07763 v2).
// Counters (D41): jobs 3, scored 1, 2, 3; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const JOBS = [
	['tidy question', 52, 3, 160],
	['big messy schema', 108, 5, 96],
	['many dependent steps', 164, 7, 36],
];

export default function make({ id = 'ce' } = {}) {
	const a = anim({
		id,
		h: 218,
		loop: { cycle: 8 },
		title: 'The same helper does worse as the job gets more realistic',
		desc:
			'Three job chips stand in a column: tidy question, big messy schema and many dependent steps. Beside each one is an empty bar track. At the end the first track is filled most of the way, the second about half, and the third only a little.',
		caption: 'The helper stays the same. The jobs change, and the share it gets right shrinks as the schema grows and the steps pile up.',
		phases: [
			[1, 'One helper, three kinds of job', { role: 'src', key: 'The helper is the same in every row; only the job changes.', changes: [['+', '3 jobs']] }],
			[3, 'A tidy question', { role: 'out', key: 'On a small job with everything in view, the helper does best.', changes: [['+', '1 bar']] }],
			[5, 'A big, messy schema', { role: 'flt', key: 'Hide more of the data from the helper and fewer answers are right.', changes: [['+', '1 bar']] }],
			[7, 'Many dependent steps', { role: 'flt', key: 'Add steps that depend on each other and fewer still are right.', changes: [['+', '1 bar']] }],
		],
		counters: [
			{ label: 'jobs', role: 'src', values: [[1, 3]] },
			{ label: 'scored', role: 'out', values: [[3, 1], [5, 2], [7, 3]] },
		],
	});
	a.text(10, 14, 'Same helper, harder jobs', 'f11 b');
	a.text(180, 44, 'share it gets right', 'f10 mu');
	JOBS.forEach(([label, y, phase, width], i) => {
		a.chip(10, y, label, { role: 'src', level: 2, w: 150, h: 28, c: 'f10' });
		a.rect(180, y, 160, 28, 'bx');
		a.rect(180, y, width, 28, i === 0 ? 'f-out k3' : 'f-flt k3', { in: phase }, 6);
	});
	return a;
}

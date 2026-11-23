// Concept animation (SPEC D41, no real data) for prompting with the data in the room (core lesson C37). Metaphor: four parts go into the prompt first,
// in a fixed order, and the question comes last. Abstract only: a box named what you send, four chips (schema, grain, sample rows, data dictionary) that
// appear one after another, a bracket labeled context pack, and a last chip named question. It shows no prompt text and no answer.
// 8 s loop of 8 phases in four steps: 1 an empty box; 2 to 3 schema, then grain; 4 to 5 sample rows, then data dictionary; 6 to 8 the question, last.
// Facts: the structure of the context pack of the lesson (schema, grain, sample rows, data dictionary, in this order) and the vendor advice to put the
// material before the question (Anthropic prompting best practices; Google Gemini prompt design strategies).
// Counters (D41): parts 1 to 4 and question 1; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const PARTS = [
	['schema', 2, 64],
	['grain', 3, 96],
	['sample rows', 4, 128],
	['data dictionary', 5, 160],
];

export default function make({ id = 'cp' } = {}) {
	const a = anim({
		id,
		h: 252,
		loop: { cycle: 8 },
		title: 'Four parts go in first, the question goes last',
		desc:
			'A box named what you send starts empty. Four chips fill it from the top in order: schema, grain, sample rows and data dictionary, with a bracket beside them labeled context pack. A last chip named question is added below them.',
		caption: 'Four parts in a fixed order, then the question.',
		phases: [
			[1, 'An empty prompt', { role: 'src', key: 'The model sees only what the prompt holds.', changes: [['+', '1 prompt']] }],
			[2, 'The schema, then the grain', { role: 'src', key: 'Names and types, then what one row is.', changes: [['+', '2 parts']] }],
			[4, 'Sample rows, then the dictionary', { role: 'grp', key: 'Real rows show values; the dictionary gives meanings.', changes: [['+', '2 parts']] }],
			[6, 'The question comes last', { role: 'out', key: 'Material first, question last.', changes: [['+', '1 question']] }],
		],
		counters: [
			{ label: 'prompt', role: 'src', values: [[1, 1]] },
			{ label: 'parts', role: 'grp', values: [[2, 1], [3, 2], [4, 3], [5, 4]] },
			{ label: 'question', role: 'out', values: [[6, 1]] },
		],
	});
	a.text(10, 14, 'Build the prompt in this order', 'f11 b');
	a.box(10, 40, 220, 196, { role: 'src', title: 'what you send' });
	PARTS.forEach(([label, phase, y], i) => {
		a.chip(24, y + 12, label, { role: i < 2 ? 'src' : 'grp', level: 2, w: 190, h: 24, fx: { in: phase } });
	});
	a.chip(24, 202, 'question', { role: 'out', level: 3, w: 190, h: 24, fx: { in: 6 } });
	a.path('M240 76 H250 V184 H240', 'ln', { in: 5 });
	a.text(258, 134, 'context pack', 'f10 b', { in: 5 });
	return a;
}

// Concept animation (SPEC D41, no real data) for RAG (core lesson C43). Metaphor: a pile of documents stays outside the prompt until retrieval picks two
// passages, grounding puts them beside the question, and the answer names one of them, which you then open. Abstract only: chips named doc 1 to doc 5,
// a prompt box that holds a question, an answer chip and a ring with a badge named open it. It shows no document text and no result of the lesson's
// scoring of six replies, so it never gives away a Predict.
// 8 s loop of 8 phases in five steps: 1 the question and five documents; 2 doc 2 and doc 4 are picked; 3 and 4 both slide into the prompt;
// 5 the answer chip appears; 6 to 8 a ring marks doc 2 and the badge open it appears (phase 7).
// Facts: the structure retrieve, ground, answer of the lesson; no engine output.
// Counters (D41): docs 5; passages 2 (step 2); cited 1 (step 4); opened 1 (step 5). Each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, edge } from '../lib/step-animation.mjs';

const DOCS = [84, 114, 144, 174, 204];

export default function make({ id = 'rg' } = {}) {
	const a = anim({
		id,
		h: 272,
		loop: { cycle: 8 },
		title: 'A RAG system retrieves passages, puts them in the prompt, and answers',
		desc:
			'Five document chips, doc 1 to doc 5, stand in a column. A prompt box holds a chip named question. Doc 2 and doc 4 are marked as found, then slide into the prompt box and leave dashed seats behind. An answer chip below the box names doc 2. A ring marks doc 2 in the box and a badge says open it.',
		caption: 'Retrieval picks passages, grounding puts them in the prompt, the answer cites one, and you open the one it cites.',
		phases: [
			[1, 'A question and five documents', { role: 'src', key: 'The documents stay outside the prompt until something retrieves them.', changes: [['+', '5 documents']] }],
			[2, 'Retrieve: find passages', { role: 'mat', key: 'Retrieval decides which passages the model gets to see.', changes: [['+', '2 passages found']] }],
			[3, 'Ground: put them in the prompt', { role: 'win', key: 'Grounding means the passages sit in the prompt beside the question.', changes: [['~', '2 passages move into the prompt']] }],
			[5, 'Answer, citing a passage', { role: 'out', key: 'The model answers from the passages it was given and names one it used.', changes: [['+', '1 answer'], ['+', '1 citation']] }],
			[6, 'You open what it cites', { role: 'flt', key: 'Open the cited passage and read it: only then has the citation been checked.', changes: [['+', '1 passage opened']] }],
		],
		counters: [
			{ label: 'docs', role: 'src', values: [[1, 5]] },
			{ label: 'passages', role: 'mat', values: [[2, 2]] },
			{ label: 'cited', role: 'out', values: [[5, 1]] },
			{ label: 'opened', role: 'flt', values: [[6, 1]] },
		],
	});
	a.text(10, 14, 'Retrieve, ground, answer', 'f11 b');
	a.text(10, 76, 'documents', 'f10 mu');
	a.box(150, 70, 200, 146, { role: 'win', title: 'prompt' });
	a.chip(160, 144, 'question', { role: 'src', level: 3, w: 100, h: 24 });
	DOCS.forEach((y, i) => {
		const k = i + 1;
		if (k === 2 || k === 4) a.ghost(10, y, 60, 24);
		const chip = () =>
			a.chip(10, y, `doc ${k}`, {
				role: 'src',
				level: 2,
				w: 60,
				h: 24,
				flags: k === 2 || k === 4 ? [{ role: 'mat', level: 3, fx: { in: 2 } }] : [],
			});
		if (k === 2 || k === 4) a.move({ dx: 150, at: 3 }, chip);
		else chip();
	});
	a.arrow(250, 216, 250, 236, 's-out', { in: 5, draw: true });
	a.chip(150, 238, 'answer, cites doc 2', { role: 'out', level: 3, w: 200, h: 26, fx: { in: 5 } });
	a.rect(157, 111, 66, 30, edge('flt'), { in: 6 }, 6);
	a.badge(232, 117, 'open it', 'flt', { in: 7 });
	return a;
}

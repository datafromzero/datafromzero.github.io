// Concept animation (SPEC D41, no real data) for framing, splitting and a baseline (core lesson C19). Metaphor: hold some rows out, learn from the rest,
// score on the rows that were held out. Abstract only: eight plain rows r1 to r8, two boxes named baseline and model and two score chips. Nothing shows
// which of the two scores is smaller, so it never gives away the Predict of the lesson (unit 5).
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 eight rows in a strip; 3 to 4 the seed picks two rows, which slide down and are labeled
// held out, the other six turn green (train); 5 to 6 arrows from two train rows into the boxes baseline and model, labeled fit; 7 to 8 arrows from
// the two held-out rows into the same boxes, labeled score, then a score chip under each box and the word compare.
// Facts: only the order of the steps (split first, fit on the train rows only, score on the held-out rows), which the lesson shows on app-events.
// Counters (D41): rows 8, train 6, test 2, fit on 6, scored 2; each appears with its step.
// Colors: train green (first group), held-out purple (second group), as in the charts of the lessons; the generator's step label sits at the top left.
import { anim } from '../lib/step-animation.mjs';

const X = (i) => 10 + 40 * i; // the eight chips of the strip
const TEST = [2, 6]; // the rows the seed holds out (r3 and r7)
const YS = 58;

export default function make({ id = 'spb' } = {}) {
	const a = anim({
		id,
		h: 290,
		loop: { cycle: 8 },
		title: 'Hold some rows out, learn from the rest, score on the held-out rows',
		desc:
			'A strip of eight rows, r1 to r8. A seed picks two of them, r3 and r7, which slide down and are labeled held out; the other six are labeled train. Arrows from the train rows lead into two boxes, baseline and model, labeled fit. Arrows from the held-out rows lead into the same two boxes, labeled score. A score chip sits under each box and the word compare sits between them.',
		caption: 'Split first with a seed, fit the baseline and the model on the train rows only, then score both on the rows that were held out.',
		phases: [
			[1, 'All rows, one per person', { role: 'src', key: 'Every row is one person with a known outcome; at the start they are all together.', changes: [['+', '8 rows']] }],
			[3, 'A seeded split holds some out', { role: 'mat', key: 'A seeded shuffle picks which rows are held out.', changes: [['~', '2 rows held out'], ['+', '6 train rows']] }],
			[5, 'Fit on the train rows only', { role: 'grp', key: 'The baseline and the model both learn from the train rows and from nothing else.', changes: [['+', 'a baseline'], ['+', 'a model']] }],
			[7, 'Score on the held-out rows', { role: 'out', key: 'Both are scored on rows neither has seen, and then the scores are compared.', changes: [['+', '2 scores']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 8]] },
			{ label: 'train', role: 'grp', values: [[3, 6]] },
			{ label: 'test', role: 'mat', values: [[3, 2]] },
			{ label: 'fit on', role: 'grp', values: [[5, 6]] },
			{ label: 'scored', role: 'out', values: [[7, 2]] },
		],
	});
	a.text(10, 14, 'Hold some rows out', 'f11 b');
	a.tags(350, 50, [[1, 'all rows'], [3, 'train rows stay']], 'f10 b', 'e');

	// the seats the held-out rows leave behind
	TEST.forEach((i) => a.ghost(X(i), YS, 32, 24));
	for (let i = 0; i < 8; i++) {
		const test = TEST.includes(i);
		const chip = () =>
			a.chip(X(i), YS, `r${i + 1}`, {
				role: 'ord',
				level: 2,
				w: 32,
				c: 'f10',
				flags: [{ role: test ? 'mat' : 'grp', level: 3, fx: { in: 3 } }],
			});
		if (test) a.move({ dy: 70, at: 3 }, chip);
		else chip();
	}
	a.text(186, 144, 'held out', 'f10 b', { in: 4 }, 'm');

	// fit on the train rows only
	a.box(20, 200, 110, 34, { role: 'ord', title: 'baseline', fx: { in: 5 } });
	a.box(190, 200, 110, 34, { role: 'src', title: 'model', fx: { in: 5 } });
	a.arrow(26, 86, 26, 198, 's-grp', { in: 5, draw: true });
	a.arrow(226, 86, 226, 198, 's-grp', { in: 5, draw: true });
	a.text(34, 172, 'fit', 'f10 b', { in: 6 });
	a.text(234, 172, 'fit', 'f10 b', { in: 6 });

	// score on the held-out rows
	a.arrow(106, 156, 106, 198, 's-mat', { in: 7, draw: true });
	a.arrow(266, 156, 266, 198, 's-mat', { in: 7, draw: true });
	a.text(114, 182, 'score', 'f10 b', { in: 8 });
	a.text(274, 182, 'score', 'f10 b', { in: 8 });
	a.arrow(75, 236, 75, 250, 's-out', { in: 8, draw: true });
	a.arrow(245, 236, 245, 250, 's-out', { in: 8, draw: true });
	a.chip(40, 252, 'score', { role: 'out', level: 3, w: 70, h: 24, fx: { in: 8 } });
	a.chip(210, 252, 'score', { role: 'out', level: 3, w: 70, h: 24, fx: { in: 8 } });
	a.text(160, 268, 'compare', 'f10 b', { in: 8 }, 'm');
	return a;
}

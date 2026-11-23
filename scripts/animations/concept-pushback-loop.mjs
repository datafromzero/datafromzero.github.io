// Concept animation (SPEC D41, no real data) for answering pushback (Data Analyst lesson 13, presenting-findings). Metaphor: a claim is challenged, you answer
// with the check you ran and its limit, and the claim is either kept or changed. Abstract only: four chips (claim, "are you sure?", the check you ran,
// what would change it), short notes beside them and an arrow back to the claim; no number and no cafe value, so it never gives away a Predict.
// 8 s loop of 8 phases in four steps: 1 (phases 1 and 2) the claim; 2 (3 and 4) the challenge; 3 (5 and 6) the check, with what it showed and what it cannot
// show; 4 (7 and 8) what would change it, and the arrow back to the claim.
// Counters (D41): claim 1; asks 0, then 1; checks 0, then 1. Each ticks at the phase that draws it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); the chips start below it.
import { anim } from '../lib/step-animation.mjs';

const X = 34;
const W = 150;

export default function make({ id = 'pbl' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'A claim, a challenge, a check and the way back to the claim',
		desc:
			'A chip named claim sits at the top with the note decision first. Below it a chip named are you sure appears, with the note a request for the check. Under that a chip named the check you ran appears, with the notes what it showed and what it cannot show. The last chip, what would change it, comes with the note a number written first, and an arrow runs from it back up to the claim.',
		caption: 'A claim is challenged; you answer with the check you ran and its limit, and the claim is kept or changed.',
		phases: [
			[1, 'State the claim', { role: 'out', key: 'Put the claim first, in one sentence, with the decision it serves.', changes: [['+', '1 claim']] }],
			[3, 'Hear "are you sure?"', { role: 'flt', key: 'A challenge asks for the check behind the claim, not a louder claim.', changes: [['+', '1 question']] }],
			[5, 'Show the check', { role: 'grp', key: 'Say what you checked, what it showed and what it cannot show.', changes: [['+', '1 check shown']] }],
			[7, 'Keep it or change it', { role: 'win', key: 'If the check holds, keep the claim; if not, change it, and name what would.', changes: [['~', 'claim kept or changed']] }],
		],
		counters: [
			{ label: 'claim', role: 'out', values: [[1, 1]] },
			{ label: 'asks', role: 'flt', values: [[1, 0], [3, 1]] },
			{ label: 'checks', role: 'grp', values: [[1, 0], [5, 1]] },
		],
	});
	a.text(10, 14, 'One claim, one challenge', 'f11 b');
	a.chip(X, 48, 'claim', { role: 'out', level: 2, w: W, h: 26 });
	a.text(X + W + 14, 65, 'decision first', 'f10');
	a.arrow(X + W / 2, 74, X + W / 2, 94, 's-flt', { in: 3, draw: true });
	a.chip(X, 96, 'are you sure?', { role: 'flt', level: 2, w: W, h: 26, fx: { in: 3 } });
	a.text(X + W + 14, 113, 'a request for the check', 'f10', { in: 3 });
	a.arrow(X + W / 2, 122, X + W / 2, 142, 's-grp', { in: 5, draw: true });
	a.chip(X, 144, 'the check you ran', { role: 'grp', level: 2, w: W, h: 26, fx: { in: 5 } });
	a.text(X + W + 14, 157, 'what it showed', 'f10', { in: 5 });
	a.text(X + W + 14, 171, 'what it cannot show', 'f10', { in: 5 });
	a.arrow(X + W / 2, 170, X + W / 2, 190, 's-win', { in: 7, draw: true });
	a.chip(X, 192, 'what would change it', { role: 'win', level: 2, w: W, h: 26, fx: { in: 7 } });
	a.text(X + W + 14, 209, 'a number, written first', 'f10', { in: 7 });
	a.path(`M${X} 205L${X - 18} 205L${X - 18} 61`, 's-ord', { in: 7, draw: true });
	a.arrow(X - 18, 61, X - 2, 61, 's-ord', { in: 7, draw: true });
	return a;
}

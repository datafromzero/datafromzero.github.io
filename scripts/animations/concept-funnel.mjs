// Concept animation (SPEC D41, no real data) for a funnel. Metaphor: users drop out at every stage, so each bar is narrower than the one above.
// Four bars of users (n1 to n4). 8 s loop of 8 phases: 1 everyone at step 1; 2, 4 and 6 the users who go on slide down from the bar above to
// make the next, narrower bar; 3, 5 and 7 that bar gets its label and the dashed red outline shows the users who left.
// Facts: not SQL output; the rule shown is the usual funnel count, each step counts only users who also did the earlier steps, so
// n1 >= n2 >= n3 >= n4 by construction.
import { anim, tint } from '../lib/step-animation.mjs';

const W = [300, 200, 120, 60];
const Y = (i) => 54 + 40 * i;

export default function make({ id = 'fu' } = {}) {
	const a = anim({
		id,
		h: 220,
		loop: { cycle: 8 },
		title: 'A funnel: users drop out step by step',
		desc:
			'Four bars of users, step 1 to step 4, each narrower than the one above: n1 is the widest, then n2, n3 and n4. For each next step, the users who go on slide down from the bar above to form the next bar. A dashed red outline beside each narrower bar shows the users who left at that step.',
		caption: 'A funnel counts how many users reach each step. Every step keeps only the users who also did the earlier steps, so the bars can only get narrower.',
		phases: ['Everyone starts at step 1', 'Some users go on to step 2', 'Step 2 is narrower; the rest left', 'Fewer go on to step 3', 'Step 3 is narrower again', 'Fewest go on to step 4', 'Step 4 is the narrowest', 'Each step keeps fewer users'],
	});
	a.text(10, 14, 'Fewer users at every step', 'f11 b');
	a.tags(10, 29, [[1, '1 · everyone starts at step 1'], [2, '2 · some go on to step 2'], [3, '3 · step 2 is narrower'], [4, '4 · fewer go on to step 3'], [5, '5 · step 3 is narrower'], [6, '6 · fewest go on to step 4'], [7, '7 · each step keeps fewer']]);
	W.forEach((w, i) => {
		const y = Y(i);
		a.rect(10, y, w, 28, tint('src', 2), i ? { in: 1 + 2 * i } : undefined, 6);
	});
	W.forEach((w, i) => {
		const y = Y(i);
		if (i) {
			a.move({ dy: 40, at: 2 * i, fx: { in: 2 * i, hide: 1 + 2 * i } }, () => a.rect(10, y - 40, w, 28, tint('src', 3), undefined, 6));
			a.rect(10 + w, y, W[i - 1] - w, 28, 's-flt dsh', { in: 1 + 2 * i }, 6);
		}
		a.text(18, y + 18, `Step ${i + 1}`, 'f11 b', i ? { in: 1 + 2 * i } : undefined);
		a.text(10 + w + 8, y + 18, `n${i + 1}`, 'f11 b', i ? { in: 1 + 2 * i } : undefined);
	});
	a.text(10, 214, 'dashed red: users who left', 'f10 mu', { in: 3 });
	return a;
}

// Concept animation (SPEC D41, no real data) for checking an AI-written query. Metaphor: a draft is not trusted until it passes checks.
// 8 s loop of 8 phases: 1 an AI draft query; 2 check 1 (row count) says ok; 3 check 2 (a total you already know) says differs;
// 4 the draft is not trusted ("fix it"); 5 the draft slides down to try again; 6 and 7 both checks say ok; 8 trusted.
// Facts: a process, not engine output. Checks named here are the ones the lesson teaches: a row count that makes sense for the question
// (a join that changes the count is the usual cause of a wrong total, see the fan-out figure) and a total you can confirm another way.
import { anim } from '../lib/step-animation.mjs';

const LY = [64, 134];

export default function make({ id = 'ai' } = {}) {
	const a = anim({
		id,
		h: 190,
		loop: { cycle: 8 },
		title: 'An AI draft is trusted only after it passes your checks',
		desc:
			'A draft query written by an AI sits on the left. Two checks follow: row count and known total. The first draft passes the row count check but its total differs, so it is marked fix it and slides down to try again. The second draft passes both checks and is marked trusted.',
		caption: 'Treat an AI-written query as a draft. Check the row count and a total you already know before you trust the result.',
		phases: ['The AI writes a draft query', 'Check the row count: ok', 'Check a known total: it differs', 'One check failed: do not trust it', 'Fix the query and run it again', 'The row count matches', 'The known total matches', 'Both checks passed: trusted'],
	});
	a.text(10, 14, 'A draft is not an answer until it is checked', 'f11 b');
	a.tags(10, 29, [[1, '1 · the AI writes a draft'], [2, '2 · check the row count: ok'], [3, '3 · check a known total: differs'], [4, '4 · one check failed: not trusted'], [5, '5 · fix it and run it again'], [6, '6 · the row count matches'], [7, '7 · the known total matches'], [8, '8 · both passed: trusted']]);
	a.text(135, 52, 'row count', 'f10 b mo', undefined, 'm');
	a.text(215, 52, 'known total', 'f10 b mo', undefined, 'm');
	LY.forEach((y) => a.ghost(10, y, 70, 26));
	a.text(45, LY[0] + 17, 'draft 1', 'f11 mu', { in: 6 }, 'm');
	a.move({ dy: 70, at: 5 }, () => {
		a.rect(10, LY[0], 70, 26, 'f-src k2', undefined, 6);
		a.text(45, LY[0] + 17, 'draft 1', 'f11', { hide: 5 }, 'm');
		a.text(45, LY[0] + 17, 'draft 2', 'f11', { in: 6 }, 'm');
	});
	a.chip(100, LY[0], 'ok', { role: 'out', level: 3, w: 70, h: 26, fx: { in: 2 } });
	a.chip(180, LY[0], 'differs', { role: 'flt', level: 3, w: 70, h: 26, fx: { in: 3 } });
	a.chip(262, LY[0], 'fix it', { role: 'flt', level: 4, w: 88, h: 26, fx: { in: 4 } });
	a.chip(100, LY[1], 'ok', { role: 'out', level: 3, w: 70, h: 26, fx: { in: 6 } });
	a.chip(180, LY[1], 'ok', { role: 'out', level: 3, w: 70, h: 26, fx: { in: 7 } });
	a.chip(262, LY[1], 'trusted', { role: 'out', level: 4, w: 88, h: 26, fx: { in: 8 } });
	return a;
}

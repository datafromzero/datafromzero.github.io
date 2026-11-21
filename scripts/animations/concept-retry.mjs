// Concept animation (SPEC D41, no real data) for retries (core lesson C26). Metaphor: try, wait, try again, then stop and tell the caller.
// Abstract only: chips try 1, try 2 and try N, a wait between them, an error under each try and a box for the caller. Nothing shows a call that
// works, which tries are retried or how many tries a run takes, so it never gives away the Predict of unit 3 (three runs of retry).
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 try 1 and its error; 3 to 4 a wait, try 2 and its error; 5 to 6 a wait, try N and its
// error; 7 to 8 an arrow from the last error to the caller, labeled raise.
// Facts: only the shape of the loop in cafe_report/retry.py (call, wait, call again, raise the last error after the last try), run in unit 3.
// Counters (D41): tries 1, 2, N; waits 1, N - 1; errors 1, 2, N; raised 1; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const Y = 70; // the row of tries and waits
const X = { try1: 10, wait1: 74, try2: 122, wait2: 186, tryN: 234 };

export default function make({ id = 'rt' } = {}) {
	const a = anim({
		id,
		h: 232,
		loop: { cycle: 8 },
		title: 'A retry is a loop with a limit: call, wait, call again, then give up',
		desc:
			'A row of chips from left to right: try 1, wait, try 2, wait, try N. Under each try an error chip in red, joined by an arrow. At the end an arrow from the last error leads down to a box labeled raise, the caller sees the error, and a line says at most N tries.',
		caption: 'A retry calls the step again after a wait. It stops after the last try and raises the error it got, so the caller still sees it.',
		phases: [
			[1, 'A call fails with an error', { role: 'src', key: 'A step can fail for a reason that goes away by itself, and the error says so.', changes: [['+', 'try 1'], ['+', 'an error']] }],
			[3, 'Wait, then call again', { role: 'ord', key: 'A short wait gives the cause time to go away before the next try.', changes: [['+', 'a wait'], ['+', 'try 2']] }],
			[5, 'Stop after N tries', { role: 'flt', key: 'The number of tries has a limit, so a step that never recovers cannot loop forever.', changes: [['+', 'a wait'], ['+', 'try N']] }],
			[7, 'The last error is raised', { role: 'out', key: 'After the last try the loop raises the error, so the caller learns that the step failed.', changes: [['+', 'raise to the caller']] }],
		],
		counters: [
			{ label: 'tries', role: 'src', values: [[1, 1], [3, 2], [5, 'N']] },
			{ label: 'waits', role: 'ord', values: [[3, 1], [5, 'N − 1']] },
			{ label: 'errors', role: 'flt', values: [[2, 1], [4, 2], [6, 'N']] },
			{ label: 'raised', role: 'out', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'Call, wait, call again, give up', 'f11 b');
	a.chip(X.try1, Y, 'try 1', { role: 'src', level: 3, w: 56 });
	a.arrow(38, Y + 26, 38, Y + 46, 's-flt', { in: 2, draw: true });
	a.chip(X.try1, Y + 48, 'error', { role: 'flt', level: 3, w: 56, fx: { in: 2 } });

	a.chip(X.wait1, Y, 'wait', { role: 'ord', level: 2, w: 40, c: 'f10', fx: { in: 3 } });
	a.chip(X.try2, Y, 'try 2', { role: 'src', level: 3, w: 56, fx: { in: 3 } });
	a.arrow(150, Y + 26, 150, Y + 46, 's-flt', { in: 4, draw: true });
	a.chip(X.try2, Y + 48, 'error', { role: 'flt', level: 3, w: 56, fx: { in: 4 } });

	a.chip(X.wait2, Y, 'wait', { role: 'ord', level: 2, w: 40, c: 'f10', fx: { in: 5 } });
	a.chip(X.tryN, Y, 'try N', { role: 'src', level: 3, w: 56, fx: { in: 5 } });
	a.arrow(262, Y + 26, 262, Y + 46, 's-flt', { in: 6, draw: true });
	a.chip(X.tryN, Y + 48, 'error', { role: 'flt', level: 3, w: 56, fx: { in: 6 } });

	a.arrow(262, Y + 74, 262, 164, 's-out', { in: 7, draw: true });
	a.text(270, 154, 'raise', 'f10 b', { in: 8 });
	a.box(90, 168, 260, 40, { role: 'out', title: 'the caller sees the last error', fx: { in: 7 } });
	a.text(10, 224, 'at most N tries', 'f10 mu', { in: 8 });
	return a;
}

// Concept animation (SPEC D41, no real data) for who may do what (core lesson C33). Metaphor: a request meets a short list of policy
// lines, and the answer is allow only when a line allows it and no line denies it; with no matching line the answer is deny.
// Abstract only: requests named Read A/1, Read B/1 and Read A/x/1, a policy of two lines (Allow Read A/any and Deny Read A/x/any: the word
// "any" stands for the star of a real policy, so that no star is typed in the figure), results named allow and deny.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the three requests and the policy box; 3 to 4 request 1 meets the Allow line and
// the result allow appears; 5 to 6 request 2 meets no line and the result deny (nothing matched) appears; 7 to 8 request 3 meets both lines
// and the result deny (a Deny line) appears.
// Facts (AWS IAM documentation, opened 2026-11-22: "Policy elements: Effect" and "Policy evaluation for requests within a single account"):
// by default access is denied; an Allow line grants; an explicit deny in any policy overrides an allow. The wording of a real policy is
// Effect, Action, Resource; the figure uses a request and one path only.
// Counters (D41): requests 3, then allowed 1 and denied 1 or 2, each set at the phase that draws its result. The lesson's Predict asks for four
// other requests (a prefix that only looks like the Deny line, a write, a path with no line), so nothing here answers it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, tint, edge } from '../lib/step-animation.mjs';

const ROWS = [
	{ y: 66, ask: 'Read A/1', line: 0, answer: 'allow', role: 'grp', in: 3 },
	{ y: 122, ask: 'Read B/1', line: -1, answer: 'deny', role: 'flt', in: 5 },
	{ y: 178, ask: 'Read A/x/1', line: 1, answer: 'deny', role: 'flt', in: 7 },
];

export default function make({ id = 'ap' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'A request is allowed only when a line allows it and no line denies it',
		desc:
			'Three requests are listed in a column: Read A/1, Read B/1 and Read A/x/1. In the middle is a policy box with two lines, Allow Read A/any and Deny Read A/x/any, and the note that with no matching line the answer is deny. An arrow from Read A/1 reaches the Allow line and the result allow appears. An arrow from Read B/1 reaches no line and the result deny appears. Two arrows from Read A/x/1 reach both lines and the result deny appears.',
		caption: 'A line allows or denies the requests it matches. A request that no line matches is denied, and a Deny line wins over an Allow line.',
		phases: [
			[1, 'Three requests, one policy', { role: 'src', key: 'A policy is a short list of lines; each request is checked against all of them.', changes: [['+', '3 requests'], ['+', '2 policy lines']] }],
			[3, 'A/1 meets an Allow line', { role: 'grp', key: 'An Allow line grants the requests it matches, and only those.', changes: [['+', '1 request allowed']] }],
			[5, 'B/1 meets no line', { role: 'flt', key: 'A request that no line matches is denied: access is off until a line turns it on.', changes: [['+', '1 request denied']] }],
			[7, 'A/x/1 meets Allow and Deny', { role: 'flt', key: 'When a Deny line matches, it overrides every Allow line.', changes: [['+', '1 request denied']] }],
		],
		counters: [
			{ label: 'requests', role: 'src', values: [[1, 3]] },
			{ label: 'allowed', role: 'grp', values: [[3, 1]] },
			{ label: 'denied', role: 'flt', values: [[5, 1], [7, 2]] },
		],
	});
	a.text(10, 14, 'Request, policy, answer', 'f11 b');

	// the policy box
	a.rect(132, 44, 118, 170, edge('mat'), undefined, 6);
	a.text(191, 62, 'policy', 'f11 b', undefined, 'm');
	a.rect(140, 78, 102, 26, tint('grp', 1), undefined, 4);
	a.text(191, 95, 'Allow Read A/any', 'f10 mo', undefined, 'm');
	a.rect(140, 144, 102, 26, tint('flt', 1), undefined, 4);
	a.text(191, 161, 'Deny Read A/x/any', 'f10 mo', undefined, 'm');
	a.text(191, 198, 'no line: deny', 'f10 b', undefined, 'm');

	for (const r of ROWS) {
		a.chip(10, r.y, r.ask, { role: 'src', level: 2, w: 96, h: 24, c: 'f10 mo' });
		const fx = { in: r.in, draw: true };
		if (r.line === 0) a.arrow(106, r.y + 12, 138, 91, 's-grp', fx);
		if (r.line === -1) a.arrow(106, r.y + 12, 138, 194, 's-flt', fx);
		if (r.line === 1) {
			a.arrow(106, r.y + 12, 138, 91, 's-grp', fx);
			a.arrow(106, r.y + 12, 138, 157, 's-flt', fx);
		}
		a.chip(268, r.y, r.answer, { role: r.role, level: 3, w: 80, h: 24, c: 'f11 b', fx: { in: r.in + 1 } });
		a.arrow(250, r.y + 12, 266, r.y + 12, r.role === 'grp' ? 's-grp' : 's-flt', { in: r.in + 1, draw: true });
	}
	return a;
}

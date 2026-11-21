// Concept animation (SPEC D41, no real data) for the A/B test workflow (core lesson C14). Metaphor: four stops in a fixed order, and a result is
// read only after the stops before it. Abstract shapes only: chips, two bars, five weekly bars and a limit line; no numbers about any real test.
// 8 s loop of 8 phases in four bands, one band per step: 1 to 2 the plan (three chips: metric, guardrail, ship rule); 3 to 4 two group bars A and B of
// the same length and the words "same size: go on"; 5 to 6 five weekly bars (the first tall, then lower) and a dashed steady level with "early bump fades";
// 7 to 8 a guardrail bar that crosses a dashed red limit, then the three possible verdicts side by side, none lit (the picture claims no outcome).
// Facts: none beyond the order of the stops (plan before data, split check before any result, weekly view, guardrail and rule last), which the lesson shows on app-events.
// Counters (D41): plan lines 3, arms 2, weeks 5, verdicts 3, each appears with its band and counts what is drawn there.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, tint } from '../lib/step-animation.mjs';

const BASE = (k) => 52 + 74 * k; // top of band k (0 to 3)
const WEEKS = [40, 28, 18, 18, 18]; // bar heights in px

export default function make({ id = 'abg' } = {}) {
	const a = anim({
		id,
		h: 348,
		loop: { cycle: 8 },
		title: 'Four stops before you ship: plan, check the split, read the lift by week, then the guardrail and the rule',
		desc:
			'Four bands one under the other. First, three chips named metric, guardrail and ship rule. Second, two bars of the same length labeled A and B with the words same size, go on. Third, five weekly bars, the first one taller than the rest, with a dashed steady level and the words early bump fades. Fourth, a guardrail bar that reaches past a dashed red limit line, and three outcome chips side by side: ship, keep running and drop.',
		caption: 'An A/B test is read in a fixed order: the plan written first, the split checked before any result, the lift cut by week, and last the guardrail and the rule.',
		phases: [
			[1, 'Plan before launch', { role: 'src', key: 'Write the metric, the guardrail and the ship rule before any data exists.', changes: [['+', '3 lines of plan']] }],
			[3, 'Check the split first', { role: 'grp', key: 'Count the people in each group before reading a result: a fair coin gives groups of about one size.', changes: [['+', '2 groups to compare']] }],
			[5, 'Read the lift by week', { role: 'out', key: 'Cut the lift by week: a bump that fades means the first week overstates what lasts.', changes: [['+', '5 weekly bars'], ['~', 'a steady level']] }],
			[7, 'Guardrail, then the rule', { role: 'flt', key: 'Compare the guardrail with its limit, then apply the rule written at the start.', changes: [['+', 'a limit line'], ['+', '3 possible verdicts']] }],
		],
		counters: [
			{ label: 'plan', role: 'src', values: [[1, '3 lines']] },
			{ label: 'arms', role: 'grp', values: [[3, 2]] },
			{ label: 'weeks', role: 'out', values: [[5, 5]] },
			{ label: 'verdicts', role: 'flt', values: [[7, 3]] },
		],
	});
	a.text(10, 14, 'Read a test in this order', 'f11 b');

	// band 1: the plan
	const y1 = BASE(0);
	a.text(10, y1 + 12, 'Plan, written first', 'f11 b', { in: 1 });
	a.chip(10, y1 + 24, 'metric', { role: 'src', level: 3, w: 84, fx: { in: 1 } });
	a.chip(104, y1 + 24, 'guardrail', { role: 'src', level: 3, w: 84, fx: { in: 1 } });
	a.chip(198, y1 + 24, 'ship rule', { role: 'src', level: 3, w: 84, fx: { in: 2 } });

	// band 2: the split
	const y2 = BASE(1);
	a.text(10, y2 + 12, 'The split, checked first', 'f11 b', { in: 3 });
	a.rect(30, y2 + 20, 120, 12, tint('grp', 3), { in: 3 }, 4);
	a.rect(30, y2 + 38, 120, 12, tint('mat', 3), { in: 3 }, 4);
	a.text(10, y2 + 30, 'A', 'f10 b', { in: 3 });
	a.text(10, y2 + 48, 'B', 'f10 b', { in: 3 });
	a.text(166, y2 + 40, 'same size: go on', 'f11 b', { in: 4 });

	// band 3: the lift by week
	const y3 = BASE(2);
	a.text(10, y3 + 12, 'The lift, week by week', 'f11 b', { in: 5 });
	WEEKS.forEach((h, i) => {
		const x = 14 + i * 34;
		a.rect(x, y3 + 60 - h, 24, h, tint('src', 3), { in: 5 }, 3);
		a.text(x + 12, y3 + 70, `w${i + 1}`, 'f10 mu', { in: 5 }, 'm');
	});
	a.path(`M44 ${y3 + 42}H190`, 's-out dsh', { in: 6, draw: true });
	a.text(200, y3 + 38, 'early bump fades', 'f11 b', { in: 6 });

	// band 4: the guardrail and the rule
	const y4 = BASE(3);
	a.text(10, y4 + 12, 'Guardrail, then the rule', 'f11 b', { in: 7 });
	a.rect(10, y4 + 24, 120, 12, tint('src', 3), { in: 7 }, 4);
	a.rect(130, y4 + 24, 40, 12, tint('flt', 4), { in: 7 }, 4);
	a.path(`M130 ${y4 + 18}V${y4 + 42}`, 's-flt dsh', { in: 7, draw: true });
	a.text(138, y4 + 54, 'limit', 'f10 mu', { in: 7 });
	a.chip(190, y4 + 22, 'ship', { role: 'ord', level: 2, w: 50, h: 22, fx: { in: 8 } });
	a.chip(246, y4 + 22, 'keep running', { role: 'ord', level: 2, w: 100, h: 22, fx: { in: 8 } });
	a.chip(190, y4 + 50, 'drop', { role: 'ord', level: 2, w: 50, h: 22, fx: { in: 8 } });
	return a;
}

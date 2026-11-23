// Concept animation (SPEC D41, no real data) for the KPI dictionary (Data Analyst lesson 11, metrics-and-kpi-dictionary). Metaphor: two dashboards that
// share a name but not a rule get one written entry; both read it, and a test of A against B can then pass. Abstract only: two dashboard chips, one
// entry card, a mismatch sign and a badge; no number and no cafe value, so it never gives away a Predict of the lesson.
// 8 s loop of 8 phases in four steps: 1 (phases 1 and 2) two dashboards, each with its own rule, and a not-equal sign; 2 (3 and 4) the entry card appears;
// 3 (5 and 6) two arrows from the entry to the dashboards, the labels change to "reads the entry" and the not-equal sign goes; 4 (7 and 8) the badge A = B.
// Counters (D41): rules 2, then 1 when both read the entry; entry 0, then 1; tests 0, then 1. Each ticks at the phase that draws it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'kpi' } = {}) {
	const a = anim({
		id,
		h: 232,
		loop: { cycle: 8 },
		title: 'One KPI entry that two dashboards read, and a test that they agree',
		desc:
			'Two dashboard chips, A and B, sit side by side, each labeled with its own rule and separated by a not-equal sign. A card named KPI entry appears above them with the words rule and grain, owner and caveats. Two arrows run from the card to the two dashboards, the labels change to reads the entry, and the not-equal sign goes. Last, a badge between the dashboards reads A equals B, with the words cell by cell.',
		caption: 'Two dashboards with one name and two rules get one written entry; both read it, and a cell-by-cell test can pass.',
		phases: [
			[1, 'Two tiles, one name', { role: 'flt', key: 'Two dashboards can use one name for two different rules.', changes: [['+', '2 rules']] }],
			[3, 'Write one entry', { role: 'out', key: 'Write the rule, the grain, the owner and the caveats once.', changes: [['+', '1 entry']] }],
			[5, 'Both read the entry', { role: 'src', key: 'Each dashboard reads the entry instead of keeping its own copy.', changes: [['−', '1 rule dropped']] }],
			[7, 'Test: A equals B', { role: 'grp', key: 'A pass means two routes built from the entry match in every cell.', changes: [['+', '1 test passed']] }],
		],
		counters: [
			{ label: 'rules', role: 'src', values: [[1, 2], [5, 1]] },
			{ label: 'entry', role: 'out', values: [[1, 0], [3, 1]] },
			{ label: 'tests', role: 'grp', values: [[1, 0], [7, 1]] },
		],
	});
	a.text(10, 14, 'One entry, two dashboards', 'f11 b');
	a.box(95, 52, 170, 62, { role: 'out', title: 'KPI entry', fx: { in: 3 } }, () => {
		a.text(105, 86, 'rule, grain', 'f10');
		a.text(105, 102, 'owner, caveats', 'f10');
	});
	a.chip(18, 156, 'Dashboard A', { role: 'src', level: 2, w: 130, h: 30 });
	a.chip(212, 156, 'Dashboard B', { role: 'src', level: 2, w: 130, h: 30 });
	a.text(83, 208, 'its own rule', 'f10', { in: 1, hide: 5 }, 'm');
	a.text(277, 208, 'its own rule', 'f10', { in: 1, hide: 5 }, 'm');
	a.text(83, 208, 'reads the entry', 'f10', { in: 5 }, 'm');
	a.text(277, 208, 'reads the entry', 'f10', { in: 5 }, 'm');
	a.text(180, 176, '≠', 'f11 b', { in: 1, hide: 5 }, 'm');
	a.arrow(130, 114, 83, 154, 's-out', { in: 5, draw: true });
	a.arrow(230, 114, 277, 154, 's-out', { in: 5, draw: true });
	a.badge(160, 163, 'A = B', 'grp', { in: 7 });
	a.text(180, 208, 'cell by cell', 'f10', { in: 7 }, 'm');
	return a;
}

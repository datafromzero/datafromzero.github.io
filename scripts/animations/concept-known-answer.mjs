// Concept animation (SPEC D41, no real data) for tests on known answers (core lesson C27). Metaphor: a test runs the code on rows you can check by hand
// and compares the result with an answer that came from another route. Abstract only: rows Row 1, Row 2 and edge row, a box named code, chips named
// result and expected, a box named second route and a box named assert. Nothing shows whether the two are equal, so it never gives away the Predicts
// of units 1 and 2 (whether a test passes or fails).
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 a small input table with three rows, one of them an edge row; 3 to 4 an arrow into a box
// named code and an arrow out to a chip named result; 5 to 6 a box named second route and a chip named expected; 7 to 8 arrows from result and
// expected into a box named assert, labeled must be equal.
// Facts: only the structure of a test in tests/test_report.py (inputs, result, expected from elsewhere, assert), run in the lesson.
// Counters (D41): rows 3, results 1, expected 1, compared 1; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'ka' } = {}) {
	const a = anim({
		id,
		h: 258,
		loop: { cycle: 8 },
		title: 'A test runs the code on rows you can check by hand and compares with a known answer',
		desc:
			'A small table of three input rows, Row 1, Row 2 and an edge row, feeds an arrow into a box named code, whose arrow leads to a chip named result. Below, a box named second route leads to a chip named expected. Two arrows from result and expected meet in a box named assert, labeled must be equal.',
		caption: 'A test feeds the code rows whose answer you know from another route, then asserts that the result and the known answer are equal.',
		phases: [
			[1, 'Rows small enough to check by hand', { role: 'src', key: 'Choose a few rows, with one edge row, whose right answer you can work out yourself.', changes: [['+', '3 input rows']] }],
			[3, 'The code runs and makes a result', { role: 'out', key: 'The code under test runs on those rows and returns a result.', changes: [['+', 'code'], ['+', 'a result']] }],
			[5, 'The known answer comes from elsewhere', { role: 'grp', key: 'The expected answer comes from another route, not from the code under test.', changes: [['+', 'a second route'], ['+', 'expected']] }],
			[7, 'assert: the two must be equal', { role: 'mat', key: 'assert compares the result with the expected answer, and the test fails when they differ.', changes: [['+', 'assert']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 3]] },
			{ label: 'results', role: 'out', values: [[3, 1]] },
			{ label: 'expected', role: 'grp', values: [[5, 1]] },
			{ label: 'compared', role: 'mat', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'Run it on rows with a known answer', 'f11 b');
	a.box(10, 44, 104, 116, { role: 'src', title: 'input rows' });
	a.chip(20, 70, 'Row 1', { role: 'src', level: 2, w: 84, h: 22 });
	a.chip(20, 98, 'Row 2', { role: 'src', level: 2, w: 84, h: 22 });
	a.chip(20, 126, 'edge row', { role: 'flt', level: 3, w: 84, h: 22 });

	a.arrow(114, 102, 148, 102, 's-out', { in: 3, draw: true });
	a.box(150, 82, 80, 40, { role: 'out', title: 'code', fx: { in: 3 } });
	a.arrow(230, 102, 258, 102, 's-out', { in: 4, draw: true });
	a.chip(260, 90, 'result', { role: 'out', level: 3, w: 90, fx: { in: 4 } });

	a.box(10, 184, 104, 56, { role: 'grp', title: 'second route', fx: { in: 5 } });
	a.text(20, 226, 'by hand or SQL', 'f10 mu', { in: 5 });
	a.arrow(114, 212, 258, 212, 's-grp', { in: 6, draw: true });
	a.chip(260, 200, 'expected', { role: 'grp', level: 3, w: 90, fx: { in: 6 } });

	a.arrow(305, 116, 305, 148, 's-mat', { in: 7, draw: true });
	a.arrow(305, 200, 305, 172, 's-mat', { in: 7, draw: true });
	a.box(240, 150, 110, 22, { role: 'mat', title: 'assert', fx: { in: 7 } });
	a.text(190, 166, 'must be equal', 'f10 b', { in: 8 }, 'e');
	return a;
}

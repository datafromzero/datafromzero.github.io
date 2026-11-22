// Concept animation (SPEC D41, no real data) for the cost of a lookup (core lesson C32). Metaphor: a list scan walks past every item to find one; a
// dict or set jumps to the one place the key points to. Abstract only: eight cells k1 to k8 and a wanted key k7, no timings.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 eight cells in a row and the wanted key k7; 3 to 6 the scan marker steps past k1 to k6
// (a chip per cell fades in as a check mark, in order) and stops on k7; 7 to 8 the second lookup: an arrow jumps from the key straight to its cell.
// Facts (docs.python.org, "Time complexity of operations on built-in types"; the lesson's own timed run in unit 1): `x in list` looks at the items
// one after another, and a set or dict finds its place from the key, on average in about the same time whatever the size. The figure shows the
// shape of the work, not how long it takes, so no Predict of the lesson is answered.
// Counters (D41): looks for the list scan and for the jump; each ticks with the checks drawn.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const CELL = (i) => 10 + 43 * i; // x of cell i (0 to 7), 38 wide

export default function make({ id = 'soj' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'A list scan walks past every item; a dict or set jumps to one',
		desc:
			'Eight cells labeled k1 to k8 in a row and the wanted key k7. A scan marks cells k1 to k6 as not it, one after another, and stops on k7. Then an arrow jumps from the wanted key straight to cell k7 without passing the others.',
		caption: 'A list scan looks at the items one after another. A dict or set uses the key to go straight to its place.',
		phases: [
			[1, 'Eight items and a wanted key', { role: 'src', key: 'The task: is the key k7 among the items?', changes: [['+', '8 items'], ['+', 'wanted key k7']] }],
			[3, 'Scan: check the items in turn', { role: 'ord', key: 'A list scan checks the items in order until the key shows up.', changes: [['+', 'checks k1 to k4']] }],
			[5, 'The scan reaches k7', { role: 'flt', key: 'A scan that does not find the key early has looked at most of the list.', changes: [['+', 'checks k5 to k7']] }],
			[7, 'A dict or set jumps to k7', { role: 'out', key: 'A dict or set uses the key to find its place, so the other items are never touched.', changes: [['+', '1 look'], ['−', 'no walk past k1 to k6']] }],
		],
		counters: [
			{ label: 'scan looks', role: 'ord', values: [[1, 0], [3, 2], [4, 4], [5, 5], [6, 7]] },
			{ label: 'jump looks', role: 'out', values: [[1, 0], [7, 1]] },
		],
	});
	a.text(10, 14, 'Walk, or jump', 'f11 b');
	for (let i = 0; i < 8; i++) a.chip(CELL(i), 80, `k${i + 1}`, { role: 'src', level: i === 6 ? 3 : 1, w: 38, c: 'f10' });
	a.chip(10, 34, 'wanted: k7', { role: 'src', level: 3, w: 84 });

	// the scan: a check chip under each cell, one after another (k1 to k4 in step 2, k5 to k7 in step 3)
	const at = [3, 3, 4, 4, 5, 6, 6];
	for (let i = 0; i < 7; i++) {
		a.chip(CELL(i), 116, i === 6 ? 'it' : 'no', { role: i === 6 ? 'flt' : 'ord', level: i === 6 ? 4 : 2, w: 38, c: 'f10', fx: { in: at[i] } });
	}
	a.text(10, 166, 'scan: 7 looks', 'f10 b', { in: 6, hide: 7 }, 's');

	// the jump: an arrow from the wanted key to cell k7
	a.path(`M52 58L52 66L${CELL(6) + 19} 66L${CELL(6) + 19} 78`, 's-out', { in: 7, draw: true });
	a.rect(CELL(6) - 2, 76, 42, 32, 's-out', { in: 7, pulse: true }, 6);
	a.text(10, 166, 'jump: 1 look', 'f10 b', { in: 7 }, 's');
	return a;
}

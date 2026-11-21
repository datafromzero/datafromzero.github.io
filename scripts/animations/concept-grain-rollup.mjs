// Concept animation (SPEC D41, no real data) for the grain of a fact table. Metaphor: a fine grain adds up to a coarse one, but never splits back.
// 8 s loop of 8 phases: 1 four line rows L1 to L4, each with a value m1 to m4; 2 L1, L2 and L3 add up into one order row O1 (three arrows
// down); 3 L4 becomes the order row O2; 4 a note: both levels add up to m1 + m2 + m3 + m4; 5 and 6 a dashed arrow tries to go back from O1
// to three empty seats and is marked as impossible; 7 the closing rule; 8 hold.
// Facts: a pattern, not engine output. A sum m1 + m2 + m3 does not say which three values made it. The lesson's own run (DuckDB 2.0.0: 3,287
// lines, 1,800 orders, the same total at every grain) is in unit 1; this figure shows no number that a Predict of the lesson asks for.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const LINES = [[10, 'L1 · m1'], [78, 'L2 · m2'], [146, 'L3 · m3'], [262, 'L4 · m4']]; // x of each line chip, label

export default function make({ id = 'gr' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'A fine grain adds up to a coarse one, but never splits back',
		desc:
			'Four line rows, L1 to L4, each with a value m1 to m4. L1, L2 and L3 add up into one order row, O1, and L4 becomes the order row O2. Both levels add up to the same total, m1 plus m2 plus m3 plus m4. A dashed arrow from O1 back toward three empty seats is crossed out: the sum of three values does not say which three values made it.',
		caption: 'Additive values such as units and sales, added up from a fine grain, give any coarser grain. A coarse table cannot be turned back into the detail it was added from.',
		phases: [
			[1, 'One row per line', { role: 'src', key: 'The grain says what one row stands for. Here one row is one line.', changes: [['+', '4 line rows']] }],
			[2, 'Lines add up into order rows', { role: 'out', key: 'Adding the lines of each order gives a coarser table: one row per order.', changes: [['+', '2 order rows'], ['~', 'each order row holds a sum']] }],
			[4, 'Both levels give the same total', { role: 'mat', key: 'Adding up loses no value: every level of grain has the same total.', changes: [['~', 'total unchanged']] }],
			[5, 'Splitting back does not work', { role: 'flt', key: 'A sum does not say which values made it, so the detail is gone for good.', changes: [['−', 'the three lines are not recoverable']] }],
			[7, 'Keep the finest grain you need', { role: 'out', key: 'Keep the finest grain the questions need: coarser tables can be added up from it.', changes: [['+', 'a rule for choosing the grain']] }],
		],
		counters: [
			{ label: 'line rows', role: 'src', values: [[1, 4]] },
			{ label: 'order rows', role: 'out', values: [[2, 1], [3, 2]] },
			{ label: 'total', role: 'mat', values: [[4, 'same']] },
			{ label: 'split back', role: 'flt', values: [[5, 'no']] },
		],
	});
	a.text(10, 14, 'Add up, never split back', 'f11 b');
	LINES.forEach(([x, label]) => a.chip(x, 58, label, { role: 'src', level: 3, w: 64 }));
	// order rows and the arrows that add the lines up (phases 2 and 3)
	a.chip(10, 150, 'O1 · m1 + m2 + m3', { role: 'out', level: 3, w: 200, fx: { in: 2 } });
	a.chip(262, 150, 'O2 · m4', { role: 'out', level: 3, w: 64, fx: { in: 3 } });
	[42, 110, 178].forEach((x) => a.arrow(x, 82, x, 148, 's-out', { in: 2, draw: true }));
	a.arrow(294, 82, 294, 148, 's-out', { in: 3, draw: true });
	a.text(180, 212, 'both levels add up to m1 + m2 + m3 + m4', 'f10 b', { in: 4, hide: 5 }, 'm');
	// the attempt to go back (phases 5 and 6), then the rule (phase 7)
	[10, 78, 146].forEach((x) => a.ghost(x, 220, 64, 24, { in: 5 }));
	a.text(42, 236, '?', 'f11 b', { in: 5 }, 'm');
	a.text(110, 236, '?', 'f11 b', { in: 5 }, 'm');
	a.text(178, 236, '?', 'f11 b', { in: 5 }, 'm');
	a.arrow(110, 176, 110, 218, 's-flt dsh', { in: 5, draw: true });
	a.text(250, 200, 'no way back', 'f10 b f-flt', { in: 5 }, 'm');
	a.text(280, 242, 'finest grain you need', 'f10 b', { in: 7 }, 'm');
	return a;
}

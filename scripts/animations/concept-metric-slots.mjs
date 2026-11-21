// Concept animation (SPEC D41, no real data) for defining a metric (core lesson C12). A made-up miniature, labeled as such on the page: 12 dots, one per
// person, in three weeks (three columns of 2 + 2 dots; the top row of each column is the "base", the bottom row is not). Metaphor: a metric is a fraction
// with four slots (the unit, the numerator, the denominator, the window); fill them one at a time and the dots that count change; move one slot and the
// same dots give another number.
// Facts (computed by hand): dots are (column c = 1, 2, 3; i = 0 top left, 1 top right, 2 bottom left, 3 bottom right). Dots that "did it": (1,0), (1,3),
// (2,1), (3,0), (3,1), 5 in all. Base = the top row of every column: 6 dots, 4 of them did it ((1,0), (2,1), (3,0), (3,1)). Window weeks 1 and 2 inside the
// base: 4 dots, 2 did it ((1,0), (2,1)). Window weeks 2 and 3 inside the base: 4 dots, 3 did it ((2,1), (3,0), (3,1)). So the counters read: did it 5, 4,
// 2, 3 and out of 12, 6, 4, 4.
// 8 s loop of 8 phases: 1 the 12 gray dots and the unit badge; 2 five dots turn gold (numerator); 3 the base outline (the bottom row no longer counts);
// 4 and 5 the window band over weeks 1 and 2; 6 the band slides to weeks 2 and 3 and the count changes; 7 and 8 the closing text and hold.
// Live counters and Key idea (D41): each counter shows the number drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const CX = [80, 180, 280]; // column centers
const ROW = [132, 172]; // top (base) row and bottom row
const dotXY = (c, i) => [CX[c - 1] + (i % 2 === 0 ? -16 : 16), ROW[i < 2 ? 0 : 1]];
const DID = [[1, 0], [1, 3], [2, 1], [3, 0], [3, 1]];
const inBase = ([, i]) => i < 2;
const inWin12 = ([c, i]) => i < 2 && c <= 2;
const inWin23 = ([c, i]) => i < 2 && c >= 2;
// phases where a "did it" dot is gold: 2 (all), 3 (in the base), 4 and 5 (in the base and weeks 1 and 2), 6 to 8 (in the base and weeks 2 and 3)
const goldRuns = (d) => {
	const on = [false, false, true, inBase(d), inWin12(d), inWin12(d), inWin23(d), inWin23(d), inWin23(d)]; // index = phase (1 and 2: see below)
	on[1] = false;
	const runs = [];
	for (let p = 2; p <= 8; p++) {
		if (!on[p]) continue;
		if (runs.length && runs[runs.length - 1][1] === p) runs[runs.length - 1][1] = p + 1;
		else runs.push([p, p + 1]);
	}
	return runs;
};

export default function make({ id = 'slt' } = {}) {
	const a = anim({
		id,
		h: 256,
		loop: { cycle: 8 },
		title: 'A metric is a fraction with four slots: the unit, the numerator, the denominator and the window',
		desc:
			'Twelve gray dots in three columns, one for each week, two rows of two dots in each column. Four badges name the slots in turn: the unit, the numerator, the denominator and the window. Five dots turn gold, the ones that did the thing. A dashed outline around the top row makes it the base, and the gold dots in the bottom row turn gray. A shaded band covers weeks 1 and 2, then slides to weeks 2 and 3, and the number of gold dots changes from two to three. The text says a different slot gives a different number from the same dots.',
		caption: 'A made-up miniature: 12 dots, one for each person, in three weeks. A metric needs four choices: the unit, the numerator, the denominator and the window.',
		phases: [
			[1, 'The unit: one dot, one person', { role: 'src', key: 'Decide the unit first: one dot is one person, not one row of a log.', changes: [['+', '12 dots, one per person']] }],
			[2, 'The numerator: who did it', { role: 'out', key: 'The numerator says who counts as having done the thing. A looser or stricter test gives other dots.', changes: [['+', '5 dots counted']] }],
			[3, 'The denominator: out of whom', { role: 'grp', key: 'The denominator is who could have done it. A dot outside the base no longer counts.', changes: [['+', 'a base of 6'], ['−', '1 dot leaves the count']] }],
			[4, 'The window: which weeks', { role: 'win', key: 'The window picks the days. Only what happens inside it counts, and only the base inside it.', changes: [['~', 'a base of 4'], ['−', '2 dots leave the count']] }],
			[6, 'Move one slot, get another number', { role: 'flt', key: 'Move one slot and the same data gives another number: write all four slots down.', changes: [['~', 'the window moved'], ['+', '1 dot joins the count']] }],
		],
		counters: [
			{ label: 'did it', role: 'out', values: [[2, 5], [3, 4], [4, 2], [6, 3]] },
			{ label: 'out of', role: 'grp', values: [[1, 12], [3, 6], [4, 4]] },
		],
	});
	a.text(10, 14, 'Four slots make one number', 'f11 b');
	// the four slot badges, one more at each of the first four steps
	a.badge(14, 44, 'unit: a person', 'src', { in: 1 });
	a.badge(126, 44, 'numerator: did it', 'out', { in: 2 });
	a.badge(14, 66, 'denominator: out of whom', 'grp', { in: 3 });
	a.badge(190, 66, 'window: which weeks', 'win', { in: 4 });
	// the window band (under the dots), weeks 1 and 2, slides to weeks 2 and 3
	a.move({ dx: 100, at: 6, fx: { in: 4 } }, () => a.rect(30, 108, 200, 88, tint('win', 1)));
	a.text(130, 214, 'weeks 1 and 2', 'f10 b', { in: 4, hide: 6 }, 'm');
	a.text(230, 214, 'weeks 2 and 3', 'f10 b', { in: 6 }, 'm');
	// the column labels and the base outline
	['week 1', 'week 2', 'week 3'].forEach((t, k) => a.text(CX[k], 102, t, 'f10 mu', undefined, 'm'));
	a.rect(26, 114, 286, 36, 'bx dsh s-grp', { in: 3 }, 6);
	a.text(344, 129, 'base', 'f10 b', { in: 3 }, 'e');
	// the dots: all gray, then gold where the dot counts at that phase
	for (let c = 1; c <= 3; c++) for (let i = 0; i < 4; i++) {
		const [x, y] = dotXY(c, i);
		a.circle(x, y, 7, tint('ord', 4));
	}
	for (const d of DID) {
		const [x, y] = dotXY(...d);
		for (const [from, to] of goldRuns(d)) a.circle(x, y, 7, tint('out', 4), { in: from, ...(to <= 8 ? { hide: to } : {}) });
	}
	a.text(190, 242, 'move a slot and the number moves', 'f10', { in: 7 }, 'm');
	return a;
}

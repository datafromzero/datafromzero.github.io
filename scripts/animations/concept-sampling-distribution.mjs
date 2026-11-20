// Concept animation (SPEC D41, no real data) for the sampling distribution of the mean (core lesson C6). Metaphor: every sample turns into one number,
// its mean, and the pile of those numbers has a center and a width. Dots are schematic, not cafe-sales values. 8 s loop of 8 phases:
// 1 a sample of n orders (a row of dots, a bigger dot is a bigger order); 2 its mean, a blue dot, drops onto the axis; 3 and 4 two more samples, two more
// means; 5 and 6 the pile fills up (16 means in all) and the ochre line marks the true mean at its center; 7 a second axis shows a bigger n: the same number
// of means in a much narrower pile; 8 holds. Colors by meaning, the same in C5 to C7: ochre = the true value, blue = a sample's estimate.
// The offsets are multiples of 10 px from the center, so a column is a stack of dots 10 px apart; the 16 means of n = 5 are wide, those of n = 20 narrow.
import { anim, tint } from '../lib/step-animation.mjs';

const CX = 180;
const OFF5 = [-30, 20, 0, -10, 40, 10, -20, 0, 20, -40, 10, 30, 0, -10, 10, 0]; // pile of means, small n
const OFF20 = [0, -10, 0, 10, 0, 0, -20, 10, 0, -10, 20, 10, 0, 10, -10, 20]; // pile of means, large n
const AXIS1 = 190;
const AXIS2 = 290;
const ROWS = [[4, 7, 5, 8, 3], [6, 3, 8, 5, 6], [5, 8, 4, 6, 7]]; // dot radius of the five orders in each of the first three samples
const slots = (offs, axis) => {
	const seen = new Map();
	return offs.map((o) => {
		const j = seen.get(o) ?? 0;
		seen.set(o, j + 1);
		return { x: CX + o, y: axis - 8 - 10 * j, j };
	});
};

export default function make({ id = 'pile' } = {}) {
	const a = anim({
		id,
		h: 312,
		loop: { cycle: 8 },
		title: 'The means of many samples pile up around the true mean',
		desc:
			'A row of five dots, a sample of orders, and below it a line for the sample mean. The mean of each sample drops onto the line as a blue dot, and 16 of them stack into a pile that is centered on an ochre line, the true mean. A second line below shows samples of a larger size: its 16 means make a much narrower, taller pile around the same ochre line.',
		caption: 'The mean of one sample is one number that changes from sample to sample. Many samples give a pile of means around the true mean, and a bigger n gives a narrower pile.',
		phases: [
			[1, 'Draw a sample of n orders', { role: 'src', key: 'A sample of n orders gives one mean, and a different sample gives a different one.', changes: [['+', '1 sample of n orders']] }],
			[2, 'Its mean drops onto the axis', { role: 'out', key: 'Each sample is boiled down to one number, its mean, placed on the axis.', changes: [['+', '1 mean on the axis']] }],
			[3, 'Draw again, and again', { role: 'grp', key: 'The next samples differ by luck, so their means land in other places.', changes: [['+', '2 more means']] }],
			[5, 'The pile centers on the true mean', { role: 'out', key: 'Many means pile up around the true mean; the width of the pile is the standard error.', changes: [['+', '16 means in a pile'], ['+', 'the true mean']] }],
			[7, 'A bigger n: a narrower pile', { role: 'src', key: 'With a bigger n each mean has less luck in it, so the same 16 means pile up narrower.', changes: [['~', 'n grows from 5 to 20'], ['−', 'the pile gets narrower']] }],
		],
		counters: [
			{ label: 'n', role: 'src', values: [[1, 5], [7, 20]] },
			{ label: 'means', role: 'out', values: [[2, 1], [3, 2], [4, 3], [5, 9], [6, 16]] },
		],
	});
	a.text(10, 14, 'Many samples, many means', 'f11 b');
	// the axes, the true mean (drawn before the dots, so the dots sit over it)
	a.path(`M20 ${AXIS1}H340`, 'ln');
	a.text(340, AXIS1 + 14, 'sample mean', 'f10 mu', undefined, 'e');
	a.text(14, AXIS1 - 8, 'n = 5', 'f11 b');
	a.path(`M${CX} 112V${AXIS2 + 6}`, 's-out', { in: 6 });
	a.text(CX + 8, 122, 'true mean', 'f10 b', { in: 6 });
	a.path(`M20 ${AXIS2}H340`, 'ln', { in: 7 });
	a.text(340, AXIS2 + 14, 'sample mean', 'f10 mu', { in: 7 }, 'e');
	a.text(14, AXIS2 - 8, 'n = 20', 'f11 b', { in: 7 });
	// the first three samples: a row of five orders (phases 1, 3 and 4), and its mean slides down to its place in the pile (phases 2, 3 and 4)
	const s5 = slots(OFF5, AXIS1);
	const ROW_FX = [{ hide: 3 }, { in: 3, hide: 4 }, { in: 4, hide: 5 }];
	ROWS.forEach((radii, k) => {
		a.g(ROW_FX[k], () => {
			radii.forEach((r, i) => a.circle(CX - 48 + 24 * i, 62, r, tint('ord', 3)));
			a.text(CX, 90, 'a sample of n orders', 'f10 mu', undefined, 'm');
		});
	});
	const startY = 102;
	s5.forEach((s, i) => {
		const phase = i === 0 ? 2 : i === 1 ? 3 : i === 2 ? 4 : i < 9 ? 5 : 6;
		if (i < 3) a.move({ dy: s.y - startY, at: phase, fx: { in: phase } }, () => a.circle(s.x, startY, 4.5, tint('src', 4)));
		else a.circle(s.x, s.y, 4.5, tint('src', 4), { in: phase });
	});
	// the larger n: a narrow pile on the second axis, all at once
	slots(OFF20, AXIS2).forEach((s) => a.circle(s.x, s.y, 4.5, tint('src', 4), { in: 7 }));
	return a;
}

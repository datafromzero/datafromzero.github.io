// Concept animation (SPEC D41) for the z-score, lesson C3. A made-up miniature, labeled as such on the page: a column with mean 40 and
// standard deviation 10, and one value x = 60. Positions: x = 20 + 4 * value on the value line, and the z line below uses the same
// pixels, so z = 2 sits under 60 (z = 0 at the mean, 40; one step of z is 40 px).
// Facts: 60 - 40 = 20; 20 / 10 = 2.
// 8 s loop of 8 phases: 1 the value line with its mean, a bracket for one standard deviation, and the value x = 60; 2 an arrow from the
// mean to x is drawn and labeled x - mean = 20; 3 hold; 4 the line "20 / 10 = 2 standard deviations" appears; 5 hold; 6 the z line
// appears under the value line, with a dashed drop from x; 7 the point z = 2 appears on it; 8 hold.
// Live counters and Key idea (D41): each counter shows the number drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const X = (v) => 20 + 4 * v;
const Z = (z) => 180 + 40 * z;
const AX = 96; // y of the value line
const ZY = 198; // y of the z line

export default function make({ id = 'zsc' } = {}) {
	const a = anim({
		id,
		h: 244,
		loop: { cycle: 8 },
		title: 'A z-score counts how many standard deviations a value lies from the mean',
		desc:
			'A value line with the mean at 40, a bracket one standard deviation wide from 40 to 50, and a blue dot x at 60. An arrow from the mean to x is labeled x minus mean equals 20. The text 20 divided by 10 equals 2 standard deviations appears. A second line below, the z line, has 0 under the mean and the dot at 2 under x.',
		caption: 'A made-up miniature: mean 40, standard deviation 10, one value 60. Subtract the mean, divide by the standard deviation, and read the place on the z line.',
		phases: [
			[1, 'A value, the mean and the SD', { role: 'src', key: 'Start from three numbers: the value x, the mean of the column and its standard deviation.', changes: [['+', 'x, mean and SD']] }],
			[2, 'Subtract the mean', { role: 'out', key: 'The distance from the mean, in the units of the data, is x minus the mean.', changes: [['+', 'x − mean = 20']] }],
			[4, 'Divide by the SD', { role: 'grp', key: 'Dividing by the standard deviation counts the distance in steps of one standard deviation.', changes: [['+', '20 ÷ 10 = 2']] }],
			[6, 'Its place on the z line', { role: 'src', key: 'The z line has 0 at the mean and one step per standard deviation; the value lands at its z-score.', changes: [['+', 'a z line under the values'], ['+', 'z = 2']] }],
		],
		counters: [
			{ label: 'x', role: 'src', values: [[1, 60]] },
			{ label: 'mean', role: 'out', values: [[1, 40]] },
			{ label: 'SD', role: 'grp', values: [[1, 10]] },
			{ label: 'x − mean', role: 'out', values: [[2, 20]] },
			{ label: 'z', role: 'grp', values: [[4, 2]] },
		],
	});
	a.text(10, 14, 'From a value to a z-score', 'f11 b');
	// the value line with ticks and labels
	a.path(`M${X(0)} ${AX}H${X(80)}`, 'bx');
	for (const t of [0, 20, 40, 60, 80]) {
		a.path(`M${X(t)} ${AX}v4`, 'bx');
		a.text(X(t), AX + 16, String(t), 'f10 mu', undefined, 'm');
	}
	// the mean, one SD, and the value
	a.path(`M${X(40)} ${AX - 22}V${AX}`, 's-out');
	a.text(X(40), AX - 28, 'mean 40', 'f10 b', undefined, 'm');
	a.path(`M${X(40)} ${AX + 26}H${X(50)}M${X(40)} ${AX + 22}v8M${X(50)} ${AX + 22}v8`, 's-grp');
	a.text(X(45), AX + 44, '1 SD = 10', 'f10', undefined, 'm');
	a.circle(X(60), AX, 4, tint('src', 4));
	a.text(X(60) + 2, AX - 12, 'x = 60', 'f10 b', undefined, 'm');
	// subtract: an arrow from the mean to x, with its label
	a.arrow(X(40), 56, X(60), 56, 's-out', { in: 2, draw: true });
	a.text(X(50), 48, 'x − mean = 20', 'f10 b', { in: 2 }, 'm');
	// divide
	a.text(10, 166, '20 ÷ 10 = 2 standard deviations', 'f11 b', { in: 4 });
	// the z line below, aligned with the value line
	a.path(`M${Z(-4)} ${ZY}H${Z(4)}`, 'bx', { in: 6 });
	for (const t of [-3, -2, -1, 0, 1, 2, 3]) {
		a.path(`M${Z(t)} ${ZY}v4`, 'bx', { in: 6 });
		a.text(Z(t), ZY + 16, (t < 0 ? '−' : '') + Math.abs(t), 'f10 mu', { in: 6 }, 'm');
	}
	a.path(`M${X(60)} ${AX + 22}V${ZY - 6}`, 'bx dsh', { in: 6 });
	a.text(10, 238, 'z line: 0 at the mean, one step per SD', 'f10 mu', { in: 6 });
	a.circle(Z(2), ZY, 4, tint('grp', 4), { in: 7 });
	a.text(Z(2) + 10, ZY - 8, 'z = 2', 'f10 b', { in: 7 });
	return a;
}

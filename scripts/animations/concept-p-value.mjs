// Concept animation (SPEC D41, no real data) for the p-value (core lesson C8). Metaphor: if nothing is going on, luck alone makes the gap between two groups
// wander around 0 as a bell-shaped pile; the p-value is the share of that pile that lies as far from 0 as the gap you saw, or farther (two tails).
// The curve is a normal curve with its center at x = 180 and one SD = 45 px; the first gap sits 1.0 SD out (x = 225), the second 2.4 SD out (x = 288), so the
// shaded share is about 32 percent for the first and about 1.6 percent for the second. The picture shows the shares, never the numbers.
// 8 s loop of 8 phases: 1 the luck-only pile and its 0; 2 the real gap, a blue marker, on the same line; 3 the two tails beyond it are shaded red;
// 4 the sentence "the shaded share is the p-value"; 5 holds; 6 the first marker and tails go, a bigger gap and its smaller tails appear; 7 the sentence
// "smaller share, smaller p"; 8 holds.
// Colors by meaning, the same in C5 to C9: ochre = the null value (no effect), blue = what the data show, red = the part that counts as extreme.
import { anim, tint } from '../lib/step-animation.mjs';

const CX = 180;
const SD = 45;
const BASE = 210;
const H = 110;
const yc = (x) => BASE - H * Math.exp(-(((x - CX) / SD) ** 2) / 2);
const r1 = (n) => Math.round(n * 10) / 10;
const curve = (x0, x1) => {
	const pts = [];
	for (let x = x0; x <= x1; x += 5) pts.push(`${r1(x)} ${r1(yc(x))}`);
	return pts;
};
const tail = (x0, x1) => `M${r1(x0)} ${BASE}L${curve(x0, x1).join('L')}L${r1(x1)} ${BASE}Z`;

export default function make({ id = 'pva' } = {}) {
	const a = anim({
		id,
		h: 274,
		loop: { cycle: 8 },
		title: 'The p-value is the share of luck-only gaps that are as far from 0 as the gap you saw',
		desc:
			'A bell-shaped pile of gaps that luck alone would produce, centered on an ochre line at 0. A blue marker shows the real gap, first near the middle: the two tails beyond it, in red, hold a large share of the pile. Then a bigger gap, far out on the right: the red tails beyond it are thin and hold a small share. Text under the picture says that the shaded share is the p-value, and that a smaller share means a smaller p.',
		caption: 'Assume nothing is going on, and luck alone makes gaps pile up around 0. The p-value is the shaded share: how much of that pile is as far from 0 as your gap, or farther.',
		phases: [
			[1, 'Assume nothing is going on', { role: 'src', key: 'If nothing is going on, luck alone still makes the gap between two groups wander around 0.', changes: [['+', 'the luck-only pile']] }],
			[2, 'Mark the real gap', { role: 'src', key: 'Put the gap you really saw on the same line as the luck-only gaps.', changes: [['+', 'the real gap']] }],
			[3, 'Shade as far or farther', { role: 'flt', key: 'The p-value is the share of luck-only gaps as far from 0 as yours or farther: the red part.', changes: [['+', 'two red tails']] }],
			[6, 'A bigger gap, less red', { role: 'out', key: 'A bigger gap leaves fewer luck-only gaps beyond it, so the red share, and the p-value, gets smaller.', changes: [['~', 'the gap moves out'], ['−', 'the red share shrinks']] }],
		],
		counters: [
			{ label: 'gap', role: 'src', values: [[2, 'in the pile'], [6, 'far out']] },
			{ label: 'red', role: 'flt', values: [[3, 'big share'], [6, 'small share']] },
		],
	});
	a.text(10, 14, 'Is the gap more than luck?', 'f11 b');
	// the luck-only pile: a gray fill, its outline, the axis and the ochre line at 0
	a.path(`M45 ${BASE}L${curve(45, 315).join('L')}L315 ${BASE}Z`, tint('ord', 1));
	// the first gap (1.0 SD out) and its tails, then the bigger gap (2.4 SD out) and its tails
	a.path(tail(CX + 1.0 * SD, 315), tint('flt', 3), { in: 3, hide: 6 });
	a.path(tail(45, CX - 1.0 * SD), tint('flt', 3), { in: 3, hide: 6 });
	a.path(tail(CX + 2.4 * SD, 315), tint('flt', 3), { in: 6 });
	a.path(tail(45, CX - 2.4 * SD), tint('flt', 3), { in: 6 });
	a.path(`M45 ${r1(yc(45))}L${curve(50, 315).join('L')}`, 'ln');
	a.path(`M20 ${BASE}H340`, 'bx');
	a.path(`M${CX} ${BASE - H - 8}V${BASE + 4}`, 's-out');
	a.text(CX, BASE + 18, '0, no effect', 'f10 b', undefined, 'm');
	a.text(340, BASE + 34, 'gap between the groups', 'f10 mu', undefined, 'e');
	a.text(14, 150, 'luck-only gaps', 'f10 mu');
	// the real gap, then the bigger one
	a.path(`M${CX + SD} 72V${BASE}`, 's-src', { in: 2, hide: 6 });
	a.circle(CX + SD, 72, 4, tint('src', 4), { in: 2, hide: 6 });
	a.text(CX + SD, 62, 'real gap', 'f10 b', { in: 2, hide: 6 }, 'm');
	a.path(`M${CX + 2.4 * SD} 72V${BASE}`, 's-src', { in: 6 });
	a.circle(CX + 2.4 * SD, 72, 4, tint('src', 4), { in: 6 });
	a.text(CX + 2.4 * SD, 62, 'a bigger gap', 'f10 b', { in: 6 }, 'm');
	// what the red share is called
	a.text(10, BASE + 52, 'the red share of the pile is the p-value', 'f11 b', { in: 4, hide: 6 });
	a.text(10, BASE + 52, 'a smaller red share is a smaller p-value', 'f11 b', { in: 7 });
	return a;
}

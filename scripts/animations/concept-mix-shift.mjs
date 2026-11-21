// Concept animation (SPEC D41, no real data) for a change of mix (core lesson C13). A made-up miniature, labeled as such on the page: two groups, A with
// a rate of 80% and B with a rate of 20% (the same in both periods). Each group is a rectangle as wide as its share of the people and as tall as its rate;
// the blended (overall) rate is the area divided by the width, a line across the picture.
// Facts (computed by hand): plot height 150 px = 100%. Period 1: A is 70% of the people (210 px) and B 30% (90 px); the blend is
// 0.7 x 80% + 0.3 x 20% = 62% (93 px above the axis). Period 2: A is 30% and B 70%; the blend is 0.3 x 80% + 0.7 x 20% = 38% (57 px). Both rates are the
// same in both periods, so the whole fall of the blend, 24 points, is the change of mix.
// 8 s loop of 8 phases: 1 the two rectangles (period 1); 2 the blend line; 3 and 4 the mix changes (period 2 rectangles fade in, period 1 fade out);
// 5 and 6 the blend line drops (the old one stays dashed) and an arrow; 7 and 8 the closing text and hold.
// Live counters and Key idea (D41): each counter shows the number drawn at that phase and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const AXIS = 200; // y of the axis, 0%
const X0 = 30;
const W = 300;
const Y = (pct) => AXIS - 1.5 * pct; // y of a rate in percent

export default function make({ id = 'mix' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'The blended rate falls when the mix moves, even if each group holds still',
		desc:
			'Two rectangles side by side as wide as the share of people in each group and as tall as its rate: group A is wide and tall, group B narrow and short. A blue line across the picture marks the blended rate. The widths then change, B becomes wide and A narrow, while the heights stay the same. The blue line drops, and the old line stays as a dashed gray one. The text says that no group got worse.',
		caption: 'A made-up miniature: group A converts at 80%, group B at 20%, in both periods. When B becomes most of the people, the blended rate falls from 62% to 38%.',
		phases: [
			[1, 'Two groups, two rates', { role: 'grp', key: 'Each group has its own rate, and a share of the people: how wide it is.', changes: [['+', 'group A and group B']] }],
			[2, 'One blended rate', { role: 'src', key: 'The blended rate is the average of the group rates, each counted as often as its people.', changes: [['+', 'the overall rate']] }],
			[3, 'The mix changes, the rates do not', { role: 'mat', key: 'The shares change: more of the people are in the group with the lower rate. The heights stay.', changes: [['~', 'the shares change'], ['−', 'no rate changes']] }],
			[5, 'The blend drops', { role: 'flt', key: 'The overall rate falls only because the mix moved: that is a change of mix, not of rate.', changes: [['−', 'the overall rate falls']] }],
			[7, 'Mix, not rate', { role: 'out', key: 'Split by group before you explain a fall: the same drop can need a different answer.', changes: [['+', 'the verdict']] }],
		],
		counters: [
			{ label: 'A share', role: 'grp', values: [[1, '70%'], [3, '30%']] },
			{ label: 'A rate', role: 'grp', values: [[1, '80%']] },
			{ label: 'B rate', role: 'mat', values: [[1, '20%']] },
			{ label: 'blend', role: 'src', values: [[2, '62%'], [5, '38%']] },
		],
	});
	a.text(10, 14, 'Same rates, new mix', 'f11 b');
	a.text(X0 + 4, 48, 'rate ↑', 'f10 mu');
	a.path(`M${X0} ${AXIS}H${X0 + W}`, 'bx');
	// period 1: A 210 px wide, B 90 px; period 2: A 90 px, B 210 px (rectangles drawn before the lines and text)
	a.rect(X0, Y(80), 210, 80 * 1.5, tint('grp', 2), { hide: 3 });
	a.rect(X0 + 210, Y(20), 90, 20 * 1.5, tint('mat', 2), { hide: 3 });
	a.rect(X0, Y(80), 90, 80 * 1.5, tint('grp', 2), { in: 3 });
	a.rect(X0 + 90, Y(20), 210, 20 * 1.5, tint('mat', 2), { in: 3 });
	a.text(X0 + 105, AXIS + 16, 'group A', 'f10 b', { hide: 3 }, 'm');
	a.text(X0 + 255, AXIS + 16, 'group B', 'f10 b', { hide: 3 }, 'm');
	a.text(X0 + 45, AXIS + 16, 'group A', 'f10 b', { in: 3 }, 'm');
	a.text(X0 + 195, AXIS + 16, 'group B', 'f10 b', { in: 3 }, 'm');
	a.text(X0 + 6, Y(80) + 14, '80%', 'f10 b', undefined);
	a.text(X0 + 216, Y(20) + 14, '20%', 'f10 b', { hide: 3 });
	a.text(X0 + 96, Y(20) + 14, '20%', 'f10 b', { in: 3 });
	// the blended rate: 62% in period 1, 38% in period 2 (the old line stays dashed)
	a.path(`M${X0} ${Y(62)}H${X0 + W}`, 's-src', { in: 2, hide: 5 });
	a.path(`M${X0} ${Y(62)}H${X0 + W}`, 's-ord dsh', { in: 5 });
	a.path(`M${X0} ${Y(38)}H${X0 + W}`, 's-src', { in: 5 });
	a.text(X0 + W, Y(62) - 6, 'overall rate', 'f10 b', { in: 2, hide: 5 }, 'e');
	a.text(X0 + W, Y(38) - 6, 'overall rate', 'f10 b', { in: 5 }, 'e');
	a.arrow(X0 + 170, Y(62) + 6, X0 + 170, Y(38) - 12, 's-flt', { in: 5, draw: true });
	a.text(X0 + W, AXIS + 32, 'share of people →', 'f10 mu', undefined, 'e');
	a.text(190, 256, 'no group got worse; the mix moved', 'f10', { in: 7 }, 'm');
	return a;
}

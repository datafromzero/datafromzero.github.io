// 3D concept animation (SPEC D41, "3D figures") for ridge and lasso (Data Scientist lesson DS6, unit 1). A loss surface over two coefficients is a bowl: the rings are contours of
// equal loss, drawn on the floor and lifted to their height (build-time projection, scripts/lib/project3d.mjs). The shape is a schematic: a quadratic bowl with its lowest point
// off the middle, and no number is written (no coefficient, no loss, no C). The penalty is drawn as the region the coefficients may take, a circle for L2 (ridge) and a diamond for
// L1 (lasso), centered on zero; the touch points are computed here, not placed by hand, and the spec throws when the lasso point is not on an axis or the ridge point is.
// 8 s loop of 8 phases in three steps: 1 to 2 the bowl and its lowest point (no penalty); 3 to 5 the circle, the contour that just touches it, the touch point (both coefficients
// shrink, neither is zero); 6 to 8 the diamond instead, its touch point at a corner on an axis (that coefficient is exactly zero).
// Facts: the lesson's unit 1 (scikit-learn's guide: ridge shrinks, the lasso is able to set coefficients exactly to zero) and its penalty formula.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, tint } from '../lib/step-animation.mjs';
import { camera, poly } from '../lib/project3d.mjs';

// loss(w) = 1/2 (w - W0)^T A (w - W0): a bowl, lowest at W0 (the unpenalized fit)
const W0 = [1.0, 0.22];
const A = [[1, 0.3], [0.3, 1.5]];
const T1 = 0.62; // the L1 region |w1| + |w2| <= T1 and the L2 region w1^2 + w2^2 <= T1^2 are about the same size
const loss = (w) => {
	const d = [w[0] - W0[0], w[1] - W0[1]];
	return 0.5 * (d[0] * (A[0][0] * d[0] + A[0][1] * d[1]) + d[1] * (A[1][0] * d[0] + A[1][1] * d[1]));
};
// the lowest loss on the circle (scan) and on the diamond's boundary (scan)
const best = (pts) => pts.reduce((m, p) => (loss(p) < loss(m) ? p : m));
const circle = Array.from({ length: 3600 }, (_, i) => [T1 * Math.cos((i / 3600) * 2 * Math.PI), T1 * Math.sin((i / 3600) * 2 * Math.PI)]);
const diamond = Array.from({ length: 4000 }, (_, i) => {
	const t = (i / 4000) * 4;
	const k = Math.floor(t);
	const f = t - k;
	const c = [[T1, 0], [0, T1], [-T1, 0], [0, -T1], [T1, 0]];
	return [c[k][0] + (c[k + 1][0] - c[k][0]) * f, c[k][1] + (c[k + 1][1] - c[k][1]) * f];
});
const L2 = best(circle);
const L1 = best(diamond);
if (Math.abs(L1[1]) > 1e-3 || L1[0] < T1 - 1e-3) throw new Error('loss-bowl: the lasso point must be the corner on the first axis');
if (Math.abs(L2[1]) < 0.1) throw new Error('loss-bowl: the ridge point must stay clear of the axis');

// contour of level `l`: the ellipse 1/2 d^T A d = l around W0
const tr = A[0][0] + A[1][1];
const det = A[0][0] * A[1][1] - A[0][1] * A[0][1];
const lam = [tr / 2 + Math.sqrt((tr * tr) / 4 - det), tr / 2 - Math.sqrt((tr * tr) / 4 - det)];
const th = 0.5 * Math.atan2(2 * A[0][1], A[0][0] - A[1][1]);
const ellipse = (l, t) => {
	const u = Math.sqrt((2 * l) / lam[0]) * Math.cos(t);
	const v = Math.sqrt((2 * l) / lam[1]) * Math.sin(t);
	return [W0[0] + u * Math.cos(th) - v * Math.sin(th), W0[1] + u * Math.sin(th) + v * Math.cos(th)];
};

export default function make({ id = 'reg' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'A loss bowl over two coefficients, with the L2 circle and the L1 diamond',
		desc:
			'A bowl drawn in perspective, made of nested rings of equal loss over a floor with two axes, one for each coefficient. Its lowest point sits off the middle of the floor: the best fit with no penalty. Then a circle centered on zero, the L2 region: the smallest ring that touches it does so at a point where both coefficients are small and neither is zero. Then a diamond instead, the L1 region: the smallest ring that touches it does so at a corner, on an axis, so one coefficient is exactly zero. No numbers are drawn.',
		caption: 'The rings are equal loss. The penalty limits the coefficients to a region around zero, and the best fit is where the smallest ring touches it: a circle gives small coefficients, a diamond gives a corner and a zero.',
		phases: [
			[1, 'The bowl: lowest loss, no penalty', { role: 'src', key: 'Loss over two coefficients is a bowl; its lowest point is the best fit with no penalty.', changes: [['+', 'bowl of equal-loss rings']] }],
			[3, 'L2: a circle limits the coefficients', { role: 'grp', key: 'Ridge limits the coefficients to a circle: the best fit is where the smallest ring touches it.', changes: [['+', 'L2 circle'], ['~', 'both coefficients shrink']] }],
			[6, 'L1: a diamond, a corner on an axis', { role: 'flt', key: 'The lasso limits them to a diamond: its corner sits on an axis, so the touch lands there and one is 0.', changes: [['+', 'L1 diamond'], ['−', 'one coefficient is 0']] }],
		],
	});
	const cam = camera({ a: 0.15, tilt: 0.6, s: 150, cx: 150, cy: 168 });
	const P = (w, l = 0) => cam.P(w[0] - 0.45, -l * 1.7, w[1] - 0.05);
	const path = (pts) => poly(pts.map((w) => P(w)));
	const N = 40;

	// floor axes: the two coefficients
	const ax1 = P([1.65, 0]);
	const ax2 = P([0, -0.8]);
	a.path(poly([P([-0.7, 0]), ax1]), 'ln');
	a.path(poly([ax2, P([0, 0.8])]), 'ln');
	a.text(ax1[0] + 6, ax1[1] + 4, 'coefficient 1', 'f10 mu');
	a.text(ax2[0] + 6, ax2[1] + 12, 'coefficient 2', 'f10 mu');

	// the bowl: rings of equal loss lifted to their height, and its lowest point
	const levels = [0.05, 0.13, 0.27, 0.5];
	const ts = Array.from({ length: N + 1 }, (_, i) => (i / N) * 2 * Math.PI);
	levels.forEach((l) => a.path(poly(ts.map((t) => P(ellipse(l, t), l))), 'ln', { in: 1, draw: true }));
	for (const k of [0, 2, 4, 6]) a.path(poly([P(W0), ...levels.map((l) => P(ellipse(l, (k / 8) * 2 * Math.PI + 0.4), l))]), 'ln dsh', { in: 1 });
	const min = P(W0);
	a.circle(min[0], min[1], 4, tint('src', 4), { in: 1 });

	// the touch: the smallest ring that reaches the region, lifted and on the floor, a stem between them, the point
	const touch = (pt, role, phase, shape, label, dx, dy) => {
		const l = loss(pt);
		a.path(shape, `s-${role}`, { in: phase, ...(phase === 3 ? { hide: 6 } : {}), draw: true });
		const gone = phase === 3 ? { hide: 6 } : {};
		for (const h of [0, l]) a.path(poly(ts.map((t) => P(ellipse(l, t), h))), `s-${role}`, { in: phase + 1, ...gone, draw: true });
		const f = P(pt);
		const u = P(pt, l);
		a.path(poly([f, u]), 'ln dsh', { in: phase + 2, ...(phase === 3 ? { hide: 6 } : {}) });
		a.circle(f[0], f[1], 4, tint(role, 4), { in: phase + 2, ...(phase === 3 ? { hide: 6 } : {}) });
		a.path(poly([f, [f[0] + dx, f[1] + dy - 4]]), 'ln', { in: phase + 2, ...gone });
		a.text(f[0] + dx + (dx < 0 ? -3 : 3), f[1] + dy, label, 'f10 b', { in: phase + 2, ...gone }, dx < 0 ? 'e' : 's');
	};
	touch(L2, 'grp', 3, path(circle.filter((_, i) => i % 75 === 0).concat([circle[0]])), 'both shrink, neither is 0', 60, 42);
	touch(L1, 'flt', 6, path(Array.from({ length: 5 }, (_, i) => [[T1, 0], [0, T1], [-T1, 0], [0, -T1], [T1, 0]][i])), 'a corner: one is 0', 40, 52);
	return a;
}

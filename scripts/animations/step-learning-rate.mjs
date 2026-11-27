// 3D learner-stepped figure (SPEC D41, D63, "3D figures") for MLE5, unit 3 ("The training loop, and the size of its step"): three learning rates, one step each.
// Top: a loss bowl over TWO weights (the real network has 169 numbers to learn; the picture shows two) and the walk of gradient descent on it, computed here from the bowl, not placed by hand.
// The three step lengths are schematic (not 0.01 : 0.1 : 10.0 times anything): small enough to crawl, about right to arrive, too long to land. The spec throws unless the walks do what the
// text says: the small rate stops with more than a quarter of its starting loss left, the right one ends under 1 % of it, the large one ends above its starting loss and changes side of the valley every step.
// Below: the REAL loss on the 10,021 fitting people after each of 20 epochs, the run of unit 3 (`fit_network(Xf, yf, 8, lr, 20)` from the notebook, seed 42, PyTorch CPU; `python3 scripts/charts/ml-batch-1.py`
// asserts the end values 0.672, 0.631, 0.632, 1.215 of the same run), rounded to 4 decimals, with the dashed 0.693 line (a flat chance of 0.5: -ln 0.5). The same y scale 0.6 to 1.4 in all three steps.
// The rate 1.0 of the run is not drawn (it ends at 0.632, close behind 0.1); the figure says so. No digit is written at the end of the 0.1 curve or in its counter (exercise 3 of Check yourself asks for the lowest of its 20 losses); the caption's "about 0.63" repeats the lesson's printed result, which already sits just above the figure.
// No count strip beyond the rate and a word for how the run ends (the figure shows a path, not rows).
import { anim } from '../lib/step-animation.mjs';
import { camera, poly } from '../lib/project3d.mjs';

// real losses, epochs 1 to 20 (see above)
const LOSS = {
	0.01: [0.7027, 0.6998, 0.6973, 0.6952, 0.6932, 0.6913, 0.6897, 0.6881, 0.6866, 0.6851, 0.6837, 0.6823, 0.681, 0.6797, 0.6785, 0.6772, 0.6759, 0.6746, 0.6733, 0.6721],
	0.1: [0.6854, 0.6723, 0.6614, 0.6548, 0.6508, 0.6481, 0.6458, 0.6438, 0.642, 0.6404, 0.6391, 0.6378, 0.6365, 0.6354, 0.6345, 0.6336, 0.6329, 0.6323, 0.6316, 0.6312],
	10: [0.942, 1.367, 1.0761, 0.9724, 1.3722, 1.2559, 0.8522, 0.9723, 1.0311, 0.8261, 0.9342, 0.9603, 1.1077, 1.0344, 0.7325, 0.8392, 1.0726, 0.889, 1.0512, 1.2153],
};
const FLAT = 0.693;
for (const [lr, end] of [[0.01, 0.672], [0.1, 0.631], [10, 1.215]]) if (Math.round(LOSS[lr][19] * 1000) / 1000 !== end) throw new Error(`step-learning-rate: the run of ${lr} must end at ${end}`);

// the bowl: loss(w) = 1/2 d^T A d, d = w - W0, in the eigen-coordinates (u along the shallow direction, v along the steep one)
const W0 = [0.5, 0.12];
const A = [[1, 0.3], [0.3, 1.5]];
const tr = A[0][0] + A[1][1];
const det = A[0][0] * A[1][1] - A[0][1] * A[0][1];
const lam = [tr / 2 + Math.sqrt((tr * tr) / 4 - det), tr / 2 - Math.sqrt((tr * tr) / 4 - det)]; // steep, shallow
const th = 0.5 * Math.atan2(2 * A[0][1], A[0][0] - A[1][1]); // angle of the steep direction
const fromEigen = (v, u) => [W0[0] + v * Math.cos(th) - u * Math.sin(th), W0[1] + v * Math.sin(th) + u * Math.cos(th)];
const loss = (w) => {
	const d = [w[0] - W0[0], w[1] - W0[1]];
	return 0.5 * (d[0] * (A[0][0] * d[0] + A[0][1] * d[1]) + d[1] * (A[1][0] * d[0] + A[1][1] * d[1]));
};
const START = fromEigen(0.1, 0.8); // mostly along the shallow direction, a little along the steep one
const STEPS = 6;
const walk = (s) => {
	const pts = [START];
	for (let i = 0; i < STEPS; i++) {
		const w = pts[i];
		const d = [w[0] - W0[0], w[1] - W0[1]];
		pts.push([w[0] - s * (A[0][0] * d[0] + A[0][1] * d[1]), w[1] - s * (A[1][0] * d[0] + A[1][1] * d[1])]);
	}
	return pts;
};
const WALKS = [walk(0.11), walk(0.5), walk(1.5)];
const L0 = loss(START);
const ends = WALKS.map((p) => loss(p[STEPS]));
if (!(ends[0] > 0.25 * L0)) throw new Error('step-learning-rate: the small rate must stop with more than a quarter of its starting loss left');
if (!(ends[1] < 0.01 * L0)) throw new Error('step-learning-rate: the right rate must end under 1 % of its starting loss');
if (!(ends[2] > L0)) throw new Error('step-learning-rate: the large rate must end above its starting loss');
{
	// the large rate changes side of the valley along the steep direction at every step
	const side = WALKS[2].map((w) => Math.sign((w[0] - W0[0]) * Math.cos(th) + (w[1] - W0[1]) * Math.sin(th)));
	for (let i = 1; i < side.length; i++) if (side[i] === side[i - 1]) throw new Error('step-learning-rate: the large rate must bounce from wall to wall');
}

// contour of level l: the ellipse 1/2 d^T A d = l around W0
const ellipse = (l, t) => fromEigen(Math.sqrt((2 * l) / lam[0]) * Math.cos(t), Math.sqrt((2 * l) / lam[1]) * Math.sin(t));

const STEP = [
	{
		role: 'src',
		clause: 'Too small: 0.01',
		text: 'Each step is a hundredth of the slope: the walk crawls and the loss is still falling after 20 epochs.',
		key: 'Tiny steps: after 20 epochs the loss is still falling, and the walk is still far above the bottom.',
		changes: [['+', 'walk of tiny steps'], ['~', 'loss still falling']],
		counts: [{ label: 'rate', value: '0.01' }, { label: 'after 20 epochs', value: 'still falling' }],
	},
	{
		role: 'grp',
		clause: 'About right: 0.1',
		text: 'Steps of a tenth of the slope: each lands lower than the one before, and the walk reaches the bottom.',
		key: 'Steps that fit reach the bottom and the loss levels off. A rate of 1.0, not drawn, ends close behind.',
		changes: [['+', 'walk to the bottom'], ['~', 'loss levels off']],
		counts: [{ label: 'rate', value: '0.1' }, { label: 'after 20 epochs', value: 'leveled off' }],
	},
	{
		role: 'flt',
		clause: 'Too large: 10.0',
		text: 'Each step is ten times the slope: it jumps over the bottom and bounces from wall to wall.',
		key: 'Steps that are too long overshoot: the walk bounces and the loss ends higher than it began.',
		changes: [['+', 'walk that bounces'], ['−', 'no bottom reached']],
		counts: [{ label: 'rate', value: '10.0' }, { label: 'after 20 epochs', value: 'jumping' }],
	},
];

export default function make({ id = 'lr' } = {}) {
	const a = anim({
		id,
		countersLabel: 'At this step',
		h: 462,
		title: 'Gradient descent on a loss bowl at three learning rates, and the loss of each run over 20 epochs',
		desc:
			'Three steps, one per learning rate, each with two parts. Above, a bowl drawn in perspective over two weights, made of nested rings of equal loss, with its lowest point marked, and the walk of six gradient descent steps from the same start. Below, the loss on the 10,021 fitting people after each of 20 epochs, taken from the run of the unit, on one scale from 0.6 to 1.4, with a dashed line at 0.693, the loss of a chance of 0.5 for everyone. Step 1, 0.01: the steps are tiny, the walk stops far above the bottom, and the loss falls slowly from about 0.70 and ends at 0.672, still falling. Step 2, 0.1: the walk reaches the bottom and the loss falls below the dashed line and levels off. Step 3, 10.0: the walk jumps from wall to wall and ends higher than it started, and the loss jumps up and down and ends at 1.215, above the dashed line. The rate 1.0 of the run, which ends close behind 0.1, is not drawn.',
		caption:
			'The bowl is a sketch: the real network has 169 numbers to learn and the drawing shows two, and its step lengths are not to scale. The loss never reaches 0: the lowest of these runs is about 0.63. The rate 1.0 of the run is left out.',
		steps: STEP,
	});

	// ---- the bowl (always there) ----
	const cam = camera({ a: 0.15, tilt: 0.82, s: 150, cx: 150, cy: 200 });
	const LIFT = 1.0;
	const P = (w, l = 0) => cam.P(w[0] - 0.5, -l * LIFT, w[1] - 0.1);
	const N = 40;
	// two short arrows at the near left corner of the floor, one per weight
	const C = [-0.62, -0.38];
	const t1 = P([-0.05, -0.38]);
	const t2 = P([-0.62, 0.14]);
	const c0 = P(C);
	a.arrow(c0[0], c0[1], t1[0], t1[1]);
	a.arrow(c0[0], c0[1], t2[0], t2[1]);
	a.text(t1[0] + 6, t1[1] + 4, 'weight 1', 'f10 mu');
	a.text(t2[0] + 6, t2[1] + 4, 'weight 2', 'f10 mu');
	const levels = [0.04, 0.12, 0.26, 0.48];
	const ts = Array.from({ length: N + 1 }, (_, i) => (i / N) * 2 * Math.PI);
	for (const l of levels) a.path(poly(ts.map((t) => P(ellipse(l, t), l))), 'ln');
	for (const k of [0, 2, 4, 6]) a.path(poly([P(W0), ...levels.map((l) => P(ellipse(l, (k / 8) * 2 * Math.PI + 0.4), l))]), 'ln dsh');
	const min = P(W0);
	a.circle(min[0], min[1], 3.5, 'f-src k4');
	a.text(min[0] + 8, min[1] + 3, 'lowest loss', 'f10 mu');

	// ---- the walks, one per step, drawn on the surface; each dot is one step ----
	const place = ['the walk stops far above the bottom', 'the walk reaches the bottom', 'the walk ends higher than it began'];
	WALKS.forEach((pts, i) => {
		const st = STEP[i];
		const fx = i === 0 ? { hide: 2 } : i === 1 ? { in: 2, hide: 3 } : { in: 3 };
		const q = pts.map((w) => P(w, loss(w)));
		a.g(fx, () => {
			a.path(poly(q), `s-${st.role}`);
			q.forEach((p, k) => a.circle(p[0], p[1], k === 0 ? 4 : 3, k === 0 ? 'bx f-ord k3' : `f-${st.role} k4`));
			a.text(10, 16, `learning rate ${st.counts[0].value}`, 'f11 b');
			a.text(350, 16, place[i], 'f10 b', undefined, 'e');
		});
	});
	const s0 = P(START, L0);
	a.text(s0[0] - 8, s0[1] - 8, 'start', 'f10 mu', undefined, 'e');

	// ---- the loss of the run: the same scale in all three steps ----
	const X0 = 52;
	const X1 = 236;
	const Y0 = 306; // top of the plot (1.4)
	const Y1 = 422; // bottom (0.6)
	const X = (e) => X0 + ((e - 1) / 19) * (X1 - X0);
	const Y = (v) => Y1 - ((v - 0.6) / 0.8) * (Y1 - Y0);
	a.text(10, Y0 - 12, 'The loss on the fitting people, after each epoch', 'f10 b');
	[0.6, 0.8, 1.0, 1.2, 1.4].forEach((v, k) => {
		a.path(poly([[X0, Y(v)], [X1, Y(v)]]), k === 0 ? 'ln' : 'ln mu');
		a.text(X0 - 6, Y(v) + 3.5, v.toFixed(1), 'f9 mu', undefined, 'e');
	});
	for (const e of [1, 5, 10, 15, 20]) a.text(X(e), Y1 + 14, String(e), 'f9 mu', undefined, 'm');
	a.text((X0 + X1) / 2, Y1 + 27, 'epoch', 'f9 mu', undefined, 'm');
	a.path(poly([[X0, Y(FLAT)], [X1, Y(FLAT)]]), 'ln dsh');
	a.text(X1 + 6, Y(FLAT) - 14, '0.693: a flat', 'f9 mu');
	a.text(X1 + 6, Y(FLAT) - 4, 'chance of 0.5', 'f9 mu');
	[[0.01, 0], [0.1, 1], [10, 2]].forEach(([lr, i]) => {
		const st = STEP[i];
		const fx = i === 0 ? { hide: 2 } : i === 1 ? { in: 2, hide: 3 } : { in: 3 };
		const pts = LOSS[lr].map((v, e) => [X(e + 1), Y(v)]);
		const end = pts[19];
		a.g(fx, () => {
			a.path(poly(pts), `s-${st.role}`);
			if (i === 0) a.text(end[0] + 6, end[1] + 4, '0.672, still falling', 'f10 b');
			if (i === 1) a.text(end[0] + 6, end[1] + 4, 'levels off', 'f10 b');
			if (i === 2) a.text(end[0] + 6, end[1] + 3.5, '1.215, ends higher', 'f10 b');
		});
	});
	return a;
}

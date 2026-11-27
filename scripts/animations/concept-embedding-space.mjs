// 3D concept animation (SPEC D41, "3D figures") for embeddings and cosine similarity (ML Engineer lesson MLE7, unit 2, "Embeddings and cosine similarity"). The four texts are the
// lesson's own (the question about rows with no match, the join question, the phone question that shares words, the capital of Australia). Each is drawn as a vector of length 1 from
// the origin (the lesson's vectors all have length 1.0 in the printed run), in 3 dimensions; the model's vectors have 384, so the picture is a schematic of the idea. The angles are
// the ones the lesson's cosines give: 0.62, 0.342 and 0.012. The only numbers written are those three cosines (two of them on the figure), all from the unit's reveal.
// 8 s loop of 8 phases in three steps: 1 to 2 the four vectors; 3 to 5 the close pair (texts 1 and 2): the angle between them is drawn, then its cosine; 6 to 8 the far pair (texts 1 and 4).
// Facts: the lesson's unit 2 (the model card of all-MiniLM-L6-v2: trained on pairs, so texts that go together point the same way); cosine = a·b / (length(a) × length(b)).
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, tint } from '../lib/step-animation.mjs';
import { camera, poly } from '../lib/project3d.mjs';

const TEXTS = [
	'How do I keep rows that have no match?',
	'Which join keeps unmatched rows?',
	'How do I keep my phone from losing its match history?',
	'What is the capital of Australia?',
];
const COS = { close: 0.62, phone: 0.342, far: 0.012 }; // the lesson's reveal: text 1 against texts 2, 3 and 4
const DEG = Math.PI / 180;

const norm = (v) => {
	const n = Math.hypot(...v);
	return v.map((x) => x / n);
};
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const mix = (u, v, s, t) => u.map((x, i) => x * s + v[i] * t);
/** A unit vector at angle acos(c) from `e1`, turned `phi` degrees around it. */
const at = (e1, e2, e3, c, phi) => {
	const s = Math.sqrt(1 - c * c);
	return mix(e1, mix(e2, e3, Math.cos(phi * DEG), Math.sin(phi * DEG)), c, s);
};
/** Points along the great circle from unit vector u to unit vector v. */
const arc = (u, v, n = 10) => {
	const w = Math.acos(Math.min(1, u.reduce((s, x, i) => s + x * v[i], 0)));
	return Array.from({ length: n + 1 }, (_, i) => mix(u, v, Math.sin((1 - i / n) * w) / Math.sin(w), Math.sin((i / n) * w) / Math.sin(w)));
};

export default function make({ id = 'emb' } = {}) {
	const a = anim({
		id,
		h: 330,
		loop: { cycle: 8 },
		title: 'Texts as vectors from the origin: the angle between two is their cosine similarity',
		desc:
			'Four texts drawn as arrows of length 1 from one point, the origin, in three dimensions: 1 the question about rows with no match, 2 the join question in other words, 3 the phone question that shares words with the first, and 4 the capital of Australia. First the four arrows. Then the angle between 1 and 2 is drawn, a small one, with the cosine 0.62. Then the angle between 1 and 4, close to a right angle, with the cosine 0.012. The model has 384 dimensions; three are drawn.',
		caption: 'Each text is a vector from the origin. The smaller the angle between two vectors, the nearer their cosine is to 1. (The model has 384 dimensions; this drawing has three.)',
		phases: [
			[1, 'Four texts, four vectors', { role: 'src', key: 'An embedding is a list of numbers: here each text is an arrow of length 1 from the origin.', changes: [['+', '4 vectors, one for each text']] }],
			[3, 'A close pair: a small angle', { role: 'grp', key: 'Texts 1 and 2 ask for the same thing in other words, so their arrows point almost the same way.', changes: [['+', 'angle between 1 and 2'], ['+', 'cosine 0.62']] }],
			[6, 'A far pair: nearly a right angle', { role: 'flt', key: 'Texts 1 and 4 are about different things, so their arrows are nearly at a right angle: cosine near 0.', changes: [['+', 'angle between 1 and 4'], ['+', 'cosine 0.012']] }],
		],
		counters: [
			{ label: 'cosine 1 and 2', role: 'grp', values: [[3, COS.close]] },
			{ label: 'cosine 1 and 4', role: 'flt', values: [[6, COS.far]] },
		],
	});
	const cam = camera({ a: 0.62, tilt: 0.34, s: 118, cx: 160, cy: 142 });
	const e1 = norm([0.62, -0.45, -0.64]);
	const e2 = norm(cross(e1, [0, 1, 0]));
	const e3 = cross(e1, e2);
	const vec = [e1, at(e1, e2, e3, COS.close, 25), at(e1, e2, e3, COS.phone, 150), at(e1, e2, e3, COS.far, -110)];
	const O = cam.P(0, 0, 0);

	// the unit sphere, only two great circles, so the arrows read as pointing into space
	const ring = (f) => poly(Array.from({ length: 49 }, (_, i) => cam.P(...f((i / 48) * 2 * Math.PI))));
	a.path(ring((t) => [Math.cos(t), 0, Math.sin(t)]), 'ln dsh');
	a.path(ring((t) => [Math.cos(t), Math.sin(t), 0]), 'ln dsh');

	const roles = ['src', 'ord', 'ord', 'ord'];
	const first = [1, 1, 2, 2];
	vec.forEach((v, i) => {
		const p = cam.P(...v);
		a.path(`M${Math.round(O[0])} ${Math.round(O[1])}L${Math.round(p[0])} ${Math.round(p[1])}`, `s-${roles[i]}`, { in: first[i], draw: true });
		a.circle(p[0], p[1], 3 + 2 * p[3], tint(roles[i], 4), { in: first[i] });
		const dx = p[0] - O[0] > 0 ? 8 : -8;
		a.text(p[0] + dx, p[1] + 4, String(i + 1), 'f11 b', { in: first[i] }, dx > 0 ? 's' : 'e');
	});
	a.circle(O[0], O[1], 3, tint('ord', 4));

	// the angle between two vectors: an arc on the sphere, and its cosine just outside
	const angle = (i, j, role, phase, label, out) => {
		a.path(poly(arc(vec[i], vec[j]).map((p) => cam.P(...p.map((x) => x * 0.5)))), `s-${role}`, { in: phase, draw: true });
		const dir = norm(mix(vec[i], vec[j], 1, 1));
		const m = cam.P(...dir.map((x) => x * 0.5));
		const e = cam.P(...dir.map((x) => x * out));
		const right = e[0] >= O[0];
		a.path(`M${Math.round(m[0])} ${Math.round(m[1])}L${Math.round(e[0])} ${Math.round(e[1])}`, 'ln', { in: phase + 1 });
		a.text(e[0] + (right ? 4 : -4), e[1] + 4, label, 'f10 b', { in: phase + 1 }, right ? 's' : 'e');
	};
	angle(0, 1, 'grp', 3, `cosine ${COS.close}`, 1.3);
	angle(0, 3, 'flt', 6, `cosine ${COS.far}`, 1.3);

	// the four texts
	TEXTS.forEach((t, i) => a.text(10, 270 + 15 * i + 10, `${i + 1}  ${t}`, 'f10 mu'));
	return a;
}

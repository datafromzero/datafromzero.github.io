// The four career figures of homepage section 05, ported from the owner-approved mockup (careers.html):
// canvas 2D and a tiny projection helper (rotate around Y, then X, then perspective). No GSAP here: the loop
// that plays them is fx/career-loop.ts (GSAP ticker); with reduced motion `still` draws one frame instead.
//   da  a 6x4 field of bars whose heights travel in a wave (a live report)
//   de  three source tanks drain through pipes into a transform step and fill the warehouse tank
//   ds  two clusters breathe; a tilted plane separates them
//   ml  a small network; signals run forward along its edges
// The color is the --figure token (home.css), read once and again when the theme changes, so the figures work
// in both themes. The canvas is decorative (aria-hidden): the panel beside it says the same in words.
import type { Careers, Key } from './careers';

type Pt = [number, number, number];

// stable pseudo-random, so every visit draws the same clusters
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const gauss = () => {
	let u = 0;
	for (let i = 0; i < 6; i++) u += rnd();
	return u / 3 - 1;
};
const blobs = Array.from({ length: 140 }, (_, i) => {
	const g = i < 70 ? -1 : 1;
	return [g * 0.62 + gauss() * 0.42, gauss() * 0.42 + g * 0.18, gauss() * 0.42, g];
});
const layers = [4, 6, 6, 3];
const nodes = layers.flatMap((n, L) =>
	Array.from({ length: n }, (_, i) => {
		const ang = (i / n) * Math.PI * 2;
		const r = n === 3 ? 0.4 : n === 4 ? 0.55 : 0.75;
		return [(L - 1.5) * 0.75, Math.sin(ang) * r, Math.cos(ang) * r, L];
	}),
);
const edges: [number, number][] = [];
nodes.forEach((a, i) => nodes.forEach((b, j) => b[3] === a[3] + 1 && edges.push([i, j])));
const pulses = Array.from({ length: 14 }, () => ({ e: (rnd() * edges.length) | 0, p: rnd() }));
const CUBE: [number, number][] = [
	[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7],
];

export interface Figure {
	canvas: HTMLCanvasElement;
	/** Draws one frame: t is the figure's clock in seconds, a its turn angle, dt the seconds since the last frame. */
	draw(key: Key, t: number, a: number, dt: number): void;
	/** Measures the canvas again (device pixels, capped at 2x). */
	size(width: number, height: number): void;
	/** Reads --figure again (after a theme change). */
	color(): void;
}

export function figure(stage: HTMLElement): Figure {
	const canvas = document.createElement('canvas');
	canvas.setAttribute('aria-hidden', 'true');
	stage.prepend(canvas);
	const ctx = canvas.getContext('2d')!;
	let W = 0;
	let H = 0;
	let ink = '#f4f4f4';

	const P = (x: number, y: number, z: number, a: number, tilt: number): Pt => {
		const ca = Math.cos(a);
		const sa = Math.sin(a);
		const ct = Math.cos(tilt);
		const st = Math.sin(tilt);
		const X = x * ca - z * sa;
		let Z = x * sa + z * ca;
		const Y = y * ct - Z * st;
		Z = y * st + Z * ct;
		const f = 3.2 / (Z + 4.2);
		const s = Math.min(W, H) * 0.5;
		return [W / 2 + X * f * s, H / 2 + Y * f * s, f];
	};
	const dot = (p: Pt, r: number, al: number) => {
		ctx.globalAlpha = al;
		ctx.beginPath();
		ctx.arc(p[0], p[1], r * p[2], 0, Math.PI * 2);
		ctx.fill();
	};
	const seg = (p: Pt, q: Pt, al: number, w = 1) => {
		ctx.globalAlpha = al;
		ctx.lineWidth = w;
		ctx.beginPath();
		ctx.moveTo(p[0], p[1]);
		ctx.lineTo(q[0], q[1]);
		ctx.stroke();
	};
	const line = (ps: Pt[], al: number, w: number) => {
		ctx.globalAlpha = al;
		ctx.lineWidth = w;
		ctx.beginPath();
		ps.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
		ctx.stroke();
	};

	const DRAW: Record<Key, (t: number, a: number, dt: number) => void> = {
		da(t, a) {
			for (let i = 0; i < 6; i++)
				for (let j = 0; j < 4; j++) {
					const x = (i - 2.5) * 0.3;
					const z = (j - 1.5) * 0.3;
					const h = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 1.6 + i * 0.7 + j * 1.1));
					const b = P(x, 0.7, z, a, 0.42);
					const top = P(x, 0.7 - h * 1.2, z, a, 0.42);
					seg(b, top, 0.25 + (0.55 * top[2]) / 1.1, 7 * top[2]);
					dot(top, 2.2, 1);
				}
			seg(P(-1, 0.7, -0.6, a, 0.42), P(1, 0.7, -0.6, a, 0.42), 0.25);
			seg(P(-1, 0.7, 0.6, a, 0.42), P(1, 0.7, 0.6, a, 0.42), 0.25);
		},
		de(t, a) {
			const T = 0.36;
			const G = 0.55;
			const aa = a * 0.6 - 0.35;
			const Q = (x: number, y: number, z: number) => P(x, y, z, aa, T);
			const cyl = (cx: number, cz: number, r: number, h: number, level: number) => {
				const N = 30;
				const ring = (y: number) =>
					Array.from({ length: N + 1 }, (_, k) => {
						const u = (k / N) * Math.PI * 2;
						return Q(cx + Math.cos(u) * r, y, cz + Math.sin(u) * r);
					});
				const top = ring(G - h);
				const bot = ring(G);
				const lv = ring(G - h * level);
				ctx.globalAlpha = 0.07;
				for (let k = 0; k < N; k++) {
					ctx.beginPath();
					ctx.moveTo(lv[k][0], lv[k][1]);
					ctx.lineTo(lv[k + 1][0], lv[k + 1][1]);
					ctx.lineTo(bot[k + 1][0], bot[k + 1][1]);
					ctx.lineTo(bot[k][0], bot[k][1]);
					ctx.closePath();
					ctx.fill();
				}
				ctx.globalAlpha = 0.22;
				ctx.beginPath();
				lv.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
				ctx.fill();
				line(top, 0.95, 1.3);
				line(bot, 0.45, 1);
				line(lv, 0.9, 1.2);
				const ext = (ps: Pt[]) => ps.reduce(([mi, ma], p) => [p[0] < mi[0] ? p : mi, p[0] > ma[0] ? p : ma], [ps[0], ps[0]]);
				const [tl, tr] = ext(top);
				const [bl, br] = ext(bot);
				seg(tl, bl, 0.95, 1.3);
				seg(tr, br, 0.95, 1.3);
			};
			const flow = (pts: Pt[], n: number, speed: number, phase: number) => {
				const L: number[] = [];
				let tot = 0;
				for (let i = 1; i < pts.length; i++) {
					const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
					L.push(d);
					tot += d;
				}
				const at = (s: number): Pt => {
					let d = s * tot;
					for (let i = 0; i < L.length; i++) {
						if (d <= L[i]) {
							const f = d / L[i];
							const p = pts[i];
							const q = pts[i + 1];
							return [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, p[2] + (q[2] - p[2]) * f];
						}
						d -= L[i];
					}
					return pts[pts.length - 1];
				};
				const pp = pts.map((p) => Q(...p));
				line(pp, 0.28, 6 * pp[0][2]);
				line(pp, 0.7, 1);
				for (let k = 0; k < n; k++) dot(Q(...at((t * speed + phase + k / n) % 1)), 2.4, 1);
			};
			const cyc = (t / 7) % 1;
			const fillW = cyc < 0.85 ? 0.12 + 0.78 * (cyc / 0.85) : 0.9 - 0.78 * ((cyc - 0.85) / 0.15);
			const srcL = (i: number) => 0.25 + 0.55 * (0.5 + 0.5 * Math.cos((cyc + i * 0.21) * Math.PI * 2));
			const ys = G - 0.18;
			const yc = G - 0.24;
			[-0.48, 0, 0.48].forEach((z, i) => {
				cyl(-1.1, z, 0.15, 0.48, srcL(i));
				flow([[-0.95, ys, z], [-0.55, ys, z], [-0.4, yc, z * 0.3], [-0.2, yc, 0]], 4, 0.5, i * 0.17);
			});
			const sp = t * 0.9;
			const h = 0.17;
			const V = [-1, 1].flatMap((x) =>
				[-1, 1].flatMap((y) =>
					[-1, 1].map((z) => {
						const X = x * h;
						const Z = z * h;
						return Q(X * Math.cos(sp) - Z * Math.sin(sp), yc + y * h, X * Math.sin(sp) + Z * Math.cos(sp));
					}),
				),
			);
			CUBE.forEach(([i, j]) => seg(V[i], V[j], 0.95, 1.3));
			flow([[0.2, yc, 0], [0.5, yc, 0], [0.5, G - 1.0, 0], [1.12, G - 1.0, 0], [1.12, G - 0.84, 0]], 7, 0.5, 0);
			cyl(1.12, 0, 0.3, 0.82, fillW);
		},
		ds(t, a) {
			const br = 1 + 0.06 * Math.sin(t * 1.4);
			for (const [x, y, z, g] of blobs) dot(P(x * br, y * br, z * br, a, 0.35), g < 0 ? 2.6 : 2, g < 0 ? 0.95 : 0.5);
			const c = [[0, -0.9, -0.9], [0, -0.9, 0.9], [0, 0.9, 0.9], [0, 0.9, -0.9]].map(([x, y, z]) => P(x + y * 0.15, y, z, a, 0.35));
			for (let k = 0; k <= 6; k++) {
				const f = k / 6;
				const l = (p: Pt, q: Pt): Pt => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, 1];
				seg(l(c[0], c[1]), l(c[3], c[2]), 0.18);
				seg(l(c[0], c[3]), l(c[1], c[2]), 0.18);
			}
		},
		ml(t, a, dt) {
			const pp = nodes.map(([x, y, z]) => P(x, y, z, a, 0.3));
			for (const [i, j] of edges) seg(pp[i], pp[j], 0.12);
			for (const s of pulses) {
				// the mockup advanced 0.012 per frame at 60 Hz: per second here, so 120 Hz screens run at the same speed
				s.p += 0.72 * dt;
				if (s.p > 1) {
					s.p = 0;
					s.e = (rnd() * edges.length) | 0;
				}
				const [p, q] = [pp[edges[s.e][0]], pp[edges[s.e][1]]];
				dot([p[0] + (q[0] - p[0]) * s.p, p[1] + (q[1] - p[1]) * s.p, (p[2] + q[2]) / 2], 2.6, 1);
			}
			pp.forEach((p, i) => dot(p, 4.2, 0.55 + 0.45 * Math.max(0, Math.sin(t * 2 - nodes[i][3]))));
		},
	};

	const f: Figure = {
		canvas,
		size(width, height) {
			const dpr = Math.min(2, devicePixelRatio || 1);
			W = width;
			H = height;
			canvas.width = Math.round(W * dpr);
			canvas.height = Math.round(H * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		},
		color() {
			ink = getComputedStyle(stage).getPropertyValue('--figure').trim() || ink;
		},
		draw(key, t, a, dt) {
			ctx.clearRect(0, 0, W, H);
			if (!W || !H) return;
			ctx.fillStyle = ctx.strokeStyle = ink;
			DRAW[key](t, a, dt);
			ctx.globalAlpha = 1;
		},
	};
	f.color();
	return f;
}

/**
 * Keeps a figure sized to its stage (ResizeObserver, no layout reads of our own) and its color in step with the
 * theme (the `data-theme` attribute on <html>); `redraw` runs after either. Returns the function that stops it.
 */
export function watch(stage: HTMLElement, fig: Figure, redraw: () => void): () => void {
	const ro = new ResizeObserver(([e]) => {
		fig.size(e.contentRect.width, e.contentRect.height);
		redraw();
	});
	ro.observe(stage);
	const mo = new MutationObserver(() => {
		fig.color();
		redraw();
	});
	mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	return () => {
		ro.disconnect();
		mo.disconnect();
	};
}

/** Reduced motion: the open career's figure as one still frame (the mockup's t = 1.2, angle 0.6), no loop. */
export function still(c: Careers) {
	const fig = figure(c.stage);
	const draw = () => c.key && fig.draw(c.key, 1.2, 0.6, 0);
	watch(c.stage, fig, draw);
	c.after.add(draw);
}

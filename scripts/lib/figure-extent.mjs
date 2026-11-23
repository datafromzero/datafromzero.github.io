/**
 * Horizontal extent of a generated lesson figure, computed from its markup alone (no browser). Pure functions.
 *
 * The generator (scripts/lib/step-animation.mjs) draws on a fixed-width canvas, but most figures use only part of it, so a drawing
 * that starts at x=10 and ends at x=290 sat 35 px left of the middle of its column. `contentExtent` measures the union of
 * everything a figure draws across ALL its steps (a part that fades in later, a chip that slides, a label that is only there
 * in step 4 all count), `anim().build()` shifts the viewBox so the middle of that extent is the middle of the viewBox, and
 * `scripts/check-figure-centering.mjs` re-measures the finished markup of every figure and every lesson.
 *
 * Text has no width without a font, so it is estimated from its character count (a slightly generous average for Geist, bold wider,
 * Geist Mono fixed); that is why the check allows a few pixels of tolerance. Strokes are not counted (at most 1.5 px).
 */

const ENT = /&#?\w+;/g;
const SIZES = { f9: 9, f10: 10, f11: 11, f14: 14, cv: 10 }; // class -> px; the stylesheet's default is 12 px
const attr = (s, name) => s.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
const numAttr = (s, name) => Number(attr(s, name) ?? 0);

/** Width of one character in em, a rough average of Geist (fitted on the figures of five lessons measured in Chromium). */
function charEm(ch) {
	if (ch === ' ') return 0.27;
	if ('il.,:;\'|!j()[]·'.includes(ch)) return 0.28;
	if ('ftrI'.includes(ch)) return 0.36;
	if ('mw'.includes(ch)) return 0.8;
	if ('MW'.includes(ch)) return 0.86;
	if (ch >= 'A' && ch <= 'Z') return 0.64;
	if (ch >= '0' && ch <= '9') return 0.58;
	return 0.52;
}

/** Estimated width in px of a text element from its class list and string. */
export function textWidth(classes, s) {
	const c = classes.split(/\s+/);
	const size = SIZES[[...c].reverse().find((k) => SIZES[k])] ?? 12; // the last size class wins (f9 is defined after f10)
	const str = s.replace(ENT, 'x');
	if (c.includes('mo')) return str.length * size * 0.6;
	let em = 0;
	for (const ch of str) em += charEm(ch);
	return em * size * (c.includes('b') ? 1.05 : 1);
}

/** x-extent [min, max] of an arc (circular, rx = ry assumed; other arcs fall back to their end points). */
function arcX(x0, y0, rx, ry, rot, large, sweep, x1, y1, out) {
	out.push(x0, x1);
	if (!rx || !ry || (x0 === x1 && y0 === y1) || Math.abs(rx - ry) > 1e-6 || rot) return;
	const r = rx;
	const dx = (x0 - x1) / 2;
	const dy = (y0 - y1) / 2;
	const d2 = dx * dx + dy * dy;
	const rr = Math.max(r, Math.sqrt(d2));
	const k = Math.sqrt(Math.max(0, (rr * rr - d2) / d2)) * (large === sweep ? -1 : 1);
	const cx = (x0 + x1) / 2 + k * dy;
	const cy = (y0 + y1) / 2 - k * dx;
	let a0 = Math.atan2(y0 - cy, x0 - cx);
	let a1 = Math.atan2(y1 - cy, x1 - cx);
	if (sweep && a1 < a0) a1 += 2 * Math.PI;
	if (!sweep && a1 > a0) a1 -= 2 * Math.PI;
	const [lo, hi] = a0 < a1 ? [a0, a1] : [a1, a0];
	for (const a of [0, Math.PI, 2 * Math.PI, -Math.PI, -2 * Math.PI]) if (a > lo && a < hi) out.push(cx + rr * Math.cos(a));
}

/** All x values a path's outline reaches (end points, arc extremes, sampled curves). */
export function pathXs(d) {
	const xs = [];
	let x = 0;
	let y = 0;
	let sx = 0;
	let sy = 0;
	for (const [, cmd, args] of d.matchAll(/([a-zA-Z])([^a-zA-Z]*)/g)) {
		const n = (args.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
		const rel = cmd === cmd.toLowerCase();
		const C = cmd.toUpperCase();
		const ox = rel ? x : 0;
		const oy = rel ? y : 0;
		const per = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 }[C];
		if (per === undefined) throw new Error(`figure-extent: unsupported path command "${cmd}"`);
		if (C === 'Z') {
			x = sx;
			y = sy;
			continue;
		}
		for (let i = 0; i + per <= n.length; i += per) {
			const a = n.slice(i, i + per);
			if (C === 'M' || C === 'L' || C === 'T') {
				x = ox + a[0];
				y = oy + a[1];
				if (C === 'M' && i === 0) [sx, sy] = [x, y];
				xs.push(x);
			} else if (C === 'H') {
				x = ox + a[0];
				xs.push(x);
			} else if (C === 'V') {
				y = oy + a[0];
			} else if (C === 'A') {
				const nx = ox + a[5];
				const ny = oy + a[6];
				arcX(x, y, a[0], a[1], a[2], a[3], a[4], nx, ny, xs);
				x = nx;
				y = ny;
			} else {
				// C, S, Q: the curve stays inside the hull of its points; sample the real curve instead
				const pts = [[x, y]];
				for (let j = 0; j < a.length; j += 2) pts.push([ox + a[j], oy + a[j + 1]]);
				const P = C === 'S' ? [pts[0], pts[0], ...pts.slice(1)] : pts;
				for (let t = 0; t <= 1.0001; t += 0.05) {
					const m = P.length - 1;
					const b = (i2, tt) => (m === 3 ? [(1 - tt) ** 3, 3 * (1 - tt) ** 2 * tt, 3 * (1 - tt) * tt * tt, tt ** 3][i2] : [(1 - tt) ** 2, 2 * (1 - tt) * tt, tt * tt][i2]);
					xs.push(P.reduce((s, p, i2) => s + p[0] * b(i2, t), 0));
				}
				[x, y] = P[P.length - 1];
			}
		}
	}
	return xs;
}

const END = 1e9;

/**
 * What a class list says about WHEN a part is drawn and whether it slides. Time is in phases for a concept animation (the loop
 * has 8, part k is on during [k-1, k-1+n) for classes d<k> and w|p|u<n>) and in steps for a stepper (i<n> in from step n, h<n> gone
 * from step n; a step is one unit). A slide (`mv m<at><a|b> x<±n>`) moves its children by n*10 px during its phase or half phase.
 */
function timing(cls, loop) {
	const c = cls.split(/\s+/);
	let from = 0;
	let to = END;
	let len = null; // the loop's w|p|u<n>: how many phases the part is on (the d<k> delay may come after it in the class list)
	let move = null;
	for (const k of c) {
		let m;
		if (loop) {
			if ((m = k.match(/^d(\d+)$/))) from = Number(m[1]) - 1;
			else if ((m = k.match(/^[wpu](\d+)$/))) len = Number(m[1]);
		} else if ((m = k.match(/^i(\d+)$/))) from = Number(m[1]) - 1;
		else if ((m = k.match(/^h(\d+)$/))) to = Number(m[1]) - 1;
	}
	if (len !== null) to = from + len;
	if (c.includes('mv')) {
		const at = c.map((k) => k.match(/^m(\d)([ab]?)$/)).find(Boolean);
		const dx = c.map((k) => k.match(/^x(n?)(\d+)$/)).find(Boolean);
		if (at && dx) {
			const t0 = Number(at[1]) - 1 + (at[2] === 'b' ? 0.5 : 0);
			move = { t0, t1: t0 + (at[2] ? 0.5 : 1), dx: (dx[1] ? -1 : 1) * Number(dx[2]) * 10 };
		}
	}
	return { from, to, move };
}

/**
 * Union x-extent { min, max } of everything a figure draws, across all its steps, or null when nothing is drawn. `body` is the
 * markup between </desc> and </svg>; `loop` tells a concept animation (phases, slides) from a stepper (steps). A part counts
 * only while it is on, at the places it is at then (a slide counts where it starts, where it ends and every stop between), so a
 * chip that slides out of the picture is measured where it leaves, not where it would be if it kept going. With `clip` ({ left,
 * right }) a part wholly outside that range is not counted (the browser cuts it off at the viewBox edges) and one that straddles an edge
 * is cut to it, unless `keep` is set: then a part counts whole, and a part that slides is skipped (slides come in and go out past the edge on
 * purpose); that is how a figure whose label runs past the edge is found.
 */
export function contentExtent(body, { loop = false, clip, keep = false } = {}) {
	let min = Infinity;
	let max = -Infinity;
	const add = (lo, hi, stack, own) => {
		const all = [...stack, own];
		const from = Math.max(...all.map((t) => t.from));
		const to = Math.min(...all.map((t) => t.to));
		if (from >= to) return; // never on at the same time as its parent
		const moves = all.map((t) => t.move).filter(Boolean);
		if (keep && moves.length) return;
		const times = new Set([from, Math.min(to, 8.0001) - 1e-6]);
		for (const m of moves) for (const t of [m.t0, m.t1]) if (t > from && t < to) times.add(t);
		for (const t of times) {
			const o = moves.reduce((s, m) => s + m.dx * Math.min(1, Math.max(0, (t - m.t0) / (m.t1 - m.t0))), 0);
			let a = lo + o;
			let b = hi + o;
			if (clip && (b < clip.left || a > clip.right)) continue; // wholly outside the picture: not drawn
			if (clip && !keep) [a, b] = [Math.max(a, clip.left), Math.min(b, clip.right)];
			min = Math.min(min, a);
			max = Math.max(max, b);
		}
	};
	const stack = [];
	const re = /<g\b([^>]*)>|<\/g>|<(rect|circle|path)\b([^>]*?)\/>|<text\b([^>]*)>([^<]*)<\/text>/g;
	for (const m of body.matchAll(re)) {
		if (m[0] === '</g>') stack.pop();
		else if (m[0].startsWith('<g')) stack.push(timing(attr(m[1], 'class') ?? '', loop));
		else if (m[2]) {
			const own = timing(attr(m[3], 'class') ?? '', loop);
			own.move = null;
			if (m[2] === 'rect') add(numAttr(m[3], 'x'), numAttr(m[3], 'x') + numAttr(m[3], 'width'), stack, own);
			else if (m[2] === 'circle') add(numAttr(m[3], 'cx') - numAttr(m[3], 'r'), numAttr(m[3], 'cx') + numAttr(m[3], 'r'), stack, own);
			else {
				const xs = pathXs(attr(m[3], 'd') ?? '');
				if (xs.length) add(Math.min(...xs), Math.max(...xs), stack, own);
			}
		} else {
			const cls = attr(m[4], 'class') ?? '';
			const x = numAttr(m[4], 'x');
			const w = textWidth(cls, m[5]);
			const c = cls.split(/\s+/);
			const [lo, hi] = c.includes('m') ? [x - w / 2, x + w / 2] : c.includes('e') ? [x - w, x] : [x, x + w];
			const own = timing(cls, loop);
			own.move = null;
			add(lo, hi, stack, own);
		}
	}
	return min === Infinity ? null : { min, max };
}

/** Measures a finished `<figure>`: viewBox, content extent and how far the content's middle is from the viewBox's middle (px of viewBox). */
export function figureCentering(figureMarkup) {
	const vb = figureMarkup.match(/<svg[^>]*\sviewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/);
	if (!vb) return null;
	const body = figureMarkup.slice(figureMarkup.indexOf('</desc>'), figureMarkup.indexOf('</svg>'));
	const left = Number(vb[1]);
	const width = Number(vb[3]);
	const loop = /<figure class="ca /.test(figureMarkup);
	const clip = { left, right: left + width };
	const ext = contentExtent(body, { loop, clip });
	if (!ext) return null;
	const whole = contentExtent(body, { loop, clip, keep: true });
	return { left, width, ...ext, offset: (ext.min + ext.max) / 2 - (left + width / 2), clipped: whole.min < left - 1 || whole.max > left + width + 1, whole };
}

/**
 * The viewBox left edge that centers a drawing of nominal width `w` (drawn on x = 0 to w): the middle of everything it draws,
 * across all steps, lands on the middle of the viewBox. 0 when nothing is drawn. Whole pixels, so the lines stay sharp.
 */
export function centeredViewX(body, w, loop = false) {
	const ext = contentExtent(body, { loop, clip: { left: 0, right: w } });
	return ext ? Math.round((ext.min + ext.max) / 2 - w / 2) : 0;
}

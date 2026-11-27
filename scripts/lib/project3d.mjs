/**
 * The projection of the homepage career figures (src/scripts/home/careers-figures.ts, `P`), run in Node at build time for the 3D
 * lesson figures (SPEC D41): rotate around Y by `a`, then around X by `tilt`, then perspective with f = 3.2 / (Z + 4.2); the screen
 * point is the middle of the canvas plus (X, Y) * f * s. Keep the formula in step with that file (tests/project3d.test.ts compares them).
 * Y points down, like the canvas; a point with a larger Z is farther from the eye (the eye sits at Z = -4.2).
 * The lesson figures draw at one fixed angle, so there is nothing to animate here: the result is plain SVG path text.
 * Pure functions, no dependencies.
 */

/** Screen numbers are written as whole pixels: the markup stays small (a lesson figure is about 15 KB or less) and one pixel is below what shows. */
export const r1 = (n) => String(Math.round(n));

/**
 * `camera({ a, tilt, s, cx, cy })`: `a` turn around Y and `tilt` around X in radians, `s` px for one unit at f = 1, (cx, cy) the screen
 * point of the origin. Returns `{ P, T, EYE }`: `P(x, y, z)` is [sx, sy, Z, f]; `T(x, y, z)` is the camera-space [X, Y, Z] (no perspective).
 */
export function camera({ a = 0, tilt = 0, s = 100, cx = 180, cy = 130 } = {}) {
	const ca = Math.cos(a);
	const sa = Math.sin(a);
	const ct = Math.cos(tilt);
	const st = Math.sin(tilt);
	const T = (x, y, z) => {
		const X = x * ca - z * sa;
		const Z1 = x * sa + z * ca;
		return [X, y * ct - Z1 * st, y * st + Z1 * ct];
	};
	const P = (x, y, z) => {
		const [X, Y, Z] = T(x, y, z);
		const f = 3.2 / (Z + 4.2);
		return [cx + X * f * s, cy + Y * f * s, Z, f];
	};
	return { P, T, EYE: [0, 0, -4.2] };
}

/** An SVG path of a polyline through projected points; `close` joins the ends. */
export const poly = (pts, close = false) => `M${pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join('L')}${close ? 'Z' : ''}`;

/** Several separate segments [[p, q], ...] in one path. */
export const segs = (list) => list.map(([p, q]) => `M${r1(p[0])} ${r1(p[1])}L${r1(q[0])} ${r1(q[1])}`).join('');

/**
 * The visible faces of the box with corner (x, y, z) and size (w, h, d), as { name, pts } with `pts` the four projected corners.
 * A face is visible when its outward normal turns toward the eye. Names: front (toward the eye at a = 0), back, left, right, top, bottom;
 * the y axis points down, so `top` is the face at the smallest y.
 */
export function boxFaces(cam, { x, y, z, w, h, d }) {
	const [x1, y1, z1] = [x + w, y + h, z + d];
	const defs = [
		['front', [0, 0, -1], [[x, y, z], [x1, y, z], [x1, y1, z], [x, y1, z]]],
		['back', [0, 0, 1], [[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]]],
		['left', [-1, 0, 0], [[x, y, z], [x, y, z1], [x, y1, z1], [x, y1, z]]],
		['right', [1, 0, 0], [[x1, y, z], [x1, y, z1], [x1, y1, z1], [x1, y1, z]]],
		['top', [0, -1, 0], [[x, y, z], [x1, y, z], [x1, y, z1], [x, y, z1]]],
		['bottom', [0, 1, 0], [[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]]],
	];
	const out = [];
	for (const [name, n, corners] of defs) {
		const nc = cam.T(...n);
		const c = cam.T(x + w / 2 + (n[0] * w) / 2, y + h / 2 + (n[1] * h) / 2, z + d / 2 + (n[2] * d) / 2);
		const dot = nc[0] * (cam.EYE[0] - c[0]) + nc[1] * (cam.EYE[1] - c[1]) + nc[2] * (cam.EYE[2] - c[2]);
		if (dot > 0) out.push({ name, pts: corners.map((p) => cam.P(...p)) });
	}
	return out;
}

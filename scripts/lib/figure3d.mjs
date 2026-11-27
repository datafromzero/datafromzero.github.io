/**
 * Drawing helpers for the 3D lesson figures (SPEC D41, "3D figures"): shapes in 3D space, projected at ONE fixed angle at build time by
 * scripts/lib/project3d.mjs (the projection of the homepage career figures) and written as ordinary `<path>` and `<circle>` elements through
 * the generator's own primitives (`a.path`, `a.circle`), so effects, moves, steps, colors, print and reduced motion are the shared ones.
 * Nothing here runs in the browser.
 */
import { tint } from './step-animation.mjs';
import { boxFaces, poly, segs } from './project3d.mjs';

/** Shade step of each face of a lit box: the face toward the viewer is lightest, the sides darker (stylesheet tints k1 to k4). */
const FACE_LEVEL = { front: 0, back: 0, top: 1, bottom: 1, left: 2, right: 2 };

/**
 * A box as shaded faces and cell lines: up to three fill paths (one for each tint level, outlined by the `ed` class of the stylesheet) and ONE
 * path (`bx`) with the cell boundaries `xs`, `ys` (inner positions along x and y) on the faces they cross. `box` is { x, y, z, w, h, d } in world
 * units; `level` 1 to 3 is the front face's tint; `sides: false` leaves the side face without cell lines. Draw boxes far to near (`byDepth`).
 */
export function slab(a, cam, box, { xs = [], ys = [], role = 'ord', level = 1, sides = true, fx } = {}) {
	const faces = boxFaces(cam, box);
	const byLevel = new Map();
	for (const f of faces) {
		const k = Math.min(4, level + FACE_LEVEL[f.name]);
		byLevel.set(k, (byLevel.get(k) ?? '') + poly(f.pts, true));
	}
	for (const [k, d] of [...byLevel].sort((p, q) => p[0] - q[0])) a.path(d, `${tint(role, k)} ed`, fx);
	const { x, y, z, w, h, d } = box;
	const lines = [];
	for (const f of faces) {
		if (f.name === 'front' || f.name === 'back') {
			const zz = f.name === 'front' ? z : z + d;
			lines.push(segs([...xs.map((v) => [cam.P(v, y, zz), cam.P(v, y + h, zz)]), ...ys.map((v) => [cam.P(x, v, zz), cam.P(x + w, v, zz)])]));
		} else if (f.name === 'left' || f.name === 'right') {
			const xx = f.name === 'left' ? x : x + w;
			if (sides) lines.push(segs(ys.map((v) => [cam.P(xx, v, z), cam.P(xx, v, z + d)])));
		} else {
			const yy = f.name === 'top' ? y : y + h;
			lines.push(segs(xs.map((v) => [cam.P(v, yy, z), cam.P(v, yy, z + d)])));
		}
	}
	const dd = lines.join('');
	if (dd) a.path(dd, 'bx', fx);
}

/** Boxes sorted far to near for the painter's algorithm: [{ box, ...rest }] by the camera depth of each box's middle, largest first. */
export const byDepth = (cam, items) =>
	[...items].sort((p, q) => cam.T(q.box.x + q.box.w / 2, q.box.y + q.box.h / 2, q.box.z + q.box.d / 2)[2] - cam.T(p.box.x + p.box.w / 2, p.box.y + p.box.h / 2, p.box.z + p.box.d / 2)[2]);

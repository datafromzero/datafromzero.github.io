/**
 * Crow's foot (Information Engineering) link geometry for entity-relationship and table diagrams
 * (LESSON-STANDARD.md, "Entity-relationship diagrams"). Pure functions, no DOM.
 *
 * A link is an orthogonal polyline from the parent's primary-key row to the child's foreign-key row, with a relationship name (a short
 * verb phrase) written on it. Each end carries one of four symbols, drawn where the line meets the box edge. The symbols are the whole
 * cardinality notation: no numbers are written beside them (numbers such as 0..1 or 1..* belong to UML multiplicity, a different notation).
 *   '1'    exactly one      two bars                      ||
 *   '0..1' zero or one      circle, bar                   o|
 *   '1..*' one or many      crow's foot, bar              |<
 *   '0..*' zero or many     crow's foot, circle           o<
 * (The strings are only names for the four symbols in code; they are never drawn.)
 *
 * `link(points, a, b, opts)`: `points` are the waypoints (the first is on the parent's box edge, the last on the child's, each at the
 * vertical center of its key row), `a` and `b` the symbols at the parent and the child end, `opts.verb` the relationship name, which is
 * required. Read the name from the parent to the child: "each store takes orders"; the other way is the passive: "each order is taken by
 * one store". The name is active, lowercase and short (at most 14 characters): "takes", "places", "contains", "appears in".
 *
 * Returns { d, line, sym, circles, verb }: `d` is one path string (the trimmed line plus the bars and prongs, to be stroked, no fill;
 * `line` and `sym` are its two halves, for an animation that draws the line and fades the symbols in), `circles` are { cx, cy, r }
 * (stroked, no fill, so the line never shows through them), `verb` is { x, y, text } for a text centered on its x. The verb sits in the
 * middle segment of the polyline (opts.verbAt picks another segment, opts.verbPos from 0 to 1 slides it along a vertical one): centered above a horizontal one, centered on a vertical one
 * (the `cv` class gives it a halo in the page color, so the line seems to break around it). When the segment runs against the reading
 * order, to the left or upward from parent to child, a small filled triangle (`verb.tri`, class `ct`) stands beside the label and
 * points the way the verb reads; it is never drawn on the line, and the line itself never carries an arrowhead. `svg(link)` renders all of it as markup for a
 * hand-drawn figure (classes `cf` and `cv` come from src/styles/step-animation.css).
 * Symbols are 10 px wide (5 px each way); the longest, zero or many, is 19.5 px along the line, so the end segment must be longer.
 */

export const CARDS = ['1', '0..1', '1..*', '0..*'];
const R = 3.5; // circle radius
// per cardinality: how far the symbol reaches along the line (the line stops there) and its parts in local coordinates
// (x along the line away from the box edge, y across it)
const SYM = {
	'1': { reach: 9, seg: [[5, -5, 5, 5], [9, -5, 9, 5], [0, 0, 9, 0]], circles: [] },
	'0..1': { reach: 15.5, seg: [[5, -5, 5, 5], [0, 0, 8.5, 0]], circles: [[12, 0]] },
	'1..*': { reach: 13, seg: [[9, 0, 0, -5], [9, 0, 0, 5], [0, 0, 13, 0], [13, -5, 13, 5]], circles: [] },
	'0..*': { reach: 19.5, seg: [[9, 0, 0, -5], [9, 0, 0, 5], [0, 0, 12.5, 0]], circles: [[16, 0]] },
};
const n2 = (v) => String(Math.round(v * 100) / 100);
const TRI = 6; // width of the reading triangle
const CHAR = 4.9; // about the width of one character of the 10 px italic sans verb

export function link(points, a, b, { verb, verbAt, verbPos = 0.5 } = {}) {
	if (!SYM[a] || !SYM[b]) throw new Error(`erd: a symbol must be one of ${CARDS.join(', ')} (got ${a}, ${b})`);
	if (!/^[a-z]+( [a-z]+)?$/.test(verb ?? '') || verb.length > 14) throw new Error(`erd: every link needs a lowercase verb phrase of one or two words, at most 14 characters (got "${verb}")`);
	if (points.length < 2) throw new Error('erd: a link needs at least two points');
	for (let i = 1; i < points.length; i++) {
		const [x0, y0] = points[i - 1];
		const [x1, y1] = points[i];
		if (x0 !== x1 && y0 !== y1) throw new Error(`erd: segment ${i} from (${x0},${y0}) to (${x1},${y1}) is not orthogonal`);
	}
	const unit = (p, q) => {
		const dx = q[0] - p[0];
		const dy = q[1] - p[1];
		const len = Math.abs(dx) + Math.abs(dy); // orthogonal: one of them is 0
		return { ux: dx / len, uy: dy / len, len };
	};
	const ends = [
		{ at: points[0], ...unit(points[0], points[1]), card: a },
		{ at: points[points.length - 1], ...unit(points[points.length - 1], points[points.length - 2]), card: b },
	];
	const trim = (p, e) => [p[0] + e.ux * SYM[e.card].reach, p[1] + e.uy * SYM[e.card].reach];
	const line = points.slice();
	line[0] = trim(points[0], ends[0]);
	line[line.length - 1] = trim(points[points.length - 1], ends[1]);
	if (line.length === 2) {
		const [p, q] = line;
		if ((q[0] - p[0]) * ends[0].ux + (q[1] - p[1]) * ends[0].uy < 0) throw new Error('erd: the two symbols overlap; the link is too short');
	}
	const lineD = `M${line.map((p) => `${n2(p[0])} ${n2(p[1])}`).join('L')}`;
	let sym = '';
	const circles = [];
	for (const e of ends) {
		// local (x, y) -> page: x runs along (ux, uy) away from the box edge, y across it
		const nx = -e.uy;
		const ny = e.ux;
		const P = (x, y) => [e.at[0] + e.ux * x + nx * y, e.at[1] + e.uy * x + ny * y];
		const s = SYM[e.card];
		for (const [x0, y0, x1, y1] of s.seg) {
			const [ax, ay] = P(x0, y0);
			const [bx, by] = P(x1, y1);
			sym += `M${n2(ax)} ${n2(ay)}L${n2(bx)} ${n2(by)}`;
		}
		for (const [cx, cy] of s.circles) {
			const [px, py] = P(cx, cy);
			circles.push({ cx: n2(px), cy: n2(py), r: R });
		}
	}
	// the verb: the middle segment (a straight link has one, a Z-shaped one its middle bar), over the part the symbols leave free
	const k = verbAt ?? Math.floor((points.length - 2) / 2);
	const [p, q] = [points[k], points[k + 1]];
	const w = verb.length * CHAR;
	let label;
	const left = p[1] === q[1] && q[0] < p[0]; // the verb reads from the parent to the child, so these directions are against the reading order
	const up = p[0] === q[0] && q[1] < p[1];
	if (p[1] === q[1]) {
		// above the line, so the symbols (5 px each side of the line) never touch it: the whole segment is free
		const x0 = Math.min(p[0], q[0]);
		const x1 = Math.max(p[0], q[0]);
		const need = w + (left ? TRI + 3 : 0);
		if (x1 - x0 < need) throw new Error(`erd: "${verb}" (about ${Math.round(need)} px) does not fit segment ${k} (${Math.round(x1 - x0)} px); widen the gap or pick another segment (verbAt)`);
		const cx = (x0 + x1) / 2;
		const y = p[1] - 6;
		label = { x: n2(cx + (left ? (TRI + 3) / 2 : 0)), y: n2(y), text: verb };
		if (left) {
			const xl = cx - need / 2;
			label.tri = `M${n2(xl)} ${n2(y - 3.5)}L${n2(xl + TRI)} ${n2(y - 7)}L${n2(xl + TRI)} ${n2(y)}Z`;
		}
	} else {
		if (Math.abs(q[1] - p[1]) < 16) throw new Error(`erd: segment ${k} is only ${Math.abs(q[1] - p[1])} px tall; "${verb}" needs 16 px or another segment (verbAt)`);
		const y = p[1] + (q[1] - p[1]) * verbPos + 3.5; // the middle of the bar unless verbPos (0 to 1, from the parent end) moves it clear of a box
		label = { x: n2(p[0]), y: n2(y), text: verb };
		if (up) {
			const xr = p[0] + w / 2 + 3;
			label.tri = `M${n2(xr + TRI / 2)} ${n2(y - 7.5)}L${n2(xr + TRI)} ${n2(y)}L${n2(xr)} ${n2(y)}Z`;
		}
	}
	return { d: lineD + sym, line: lineD, sym, circles, verb: label };
}

/** Markup of a link for a hand-drawn figure: one stroked group (path and circles) and its verb. */
export function svg(lk) {
	const circles = lk.circles.map((c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" />`).join('');
	return `<g class="cf" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${lk.d}" />${circles}</g><text class="cv" x="${lk.verb.x}" y="${lk.verb.y}" text-anchor="middle">${lk.verb.text}</text>${lk.verb.tri ? `<path class="ct" d="${lk.verb.tri}" fill="currentColor" stroke="none" />` : ''}`;
}

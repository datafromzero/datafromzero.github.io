/**
 * Crow's foot (Information Engineering) link geometry for entity-relationship and table diagrams
 * (LESSON-STANDARD.md, "Entity-relationship diagrams"). Pure functions, no DOM.
 *
 * A link is an orthogonal polyline from the parent's primary-key row to the child's foreign-key row. Each end carries one of four symbols,
 * drawn where the line meets the box edge, and a small label next to it:
 *   '1'    exactly one      two bars                      ||
 *   '0..1' zero or one      circle, bar                   o|
 *   '1..*' one or many      crow's foot, bar              |<
 *   '0..*' zero or many     crow's foot, circle           o<
 *
 * `link(points, a, b, opts)` takes the waypoints (the first and last are the two box-edge points, at the row's vertical center) and the
 * two cardinalities, and returns { d, line, sym, circles, labels }: `d` is one path string (the trimmed line plus the bars and prongs, to be stroked,
 * no fill; `line` and `sym` are its two halves, for an animation that draws the line and fades the symbols in), `circles` are { cx, cy, r } (stroked, no fill, so the line never shows through them), `labels` are { x, y, text, anchor }.
 * `svg(link)` renders the three as markup for a hand-drawn figure (classes `cf` and `cl` come from src/styles/step-animation.css).
 * Symbols are 10 px wide (5 px each way); the longest, zero or many, is 19.5 px along the line, so the end segment must be longer.
 */

export const CARDS = ['1', '0..1', '1..*', '0..*'];
const R = 3.5; // circle radius
const H = 5; // half width of a bar or of the foot
// per cardinality: how far the symbol reaches along the line (the line stops there) and its parts in local coordinates
// (x along the line away from the box edge, y across it)
const SYM = {
	'1': { reach: 9, seg: [[5, -5, 5, 5], [9, -5, 9, 5], [0, 0, 9, 0]], circles: [] },
	'0..1': { reach: 15.5, seg: [[5, -5, 5, 5], [0, 0, 8.5, 0]], circles: [[12, 0]] },
	'1..*': { reach: 13, seg: [[9, 0, 0, -5], [9, 0, 0, 5], [0, 0, 13, 0], [13, -5, 13, 5]], circles: [] },
	'0..*': { reach: 19.5, seg: [[9, 0, 0, -5], [9, 0, 0, 5], [0, 0, 12.5, 0]], circles: [[16, 0]] },
};
const n2 = (v) => String(Math.round(v * 100) / 100);

export function link(points, a, b, { sideA = 'above', sideB = 'below', labelA, labelB } = {}) {
	if (!SYM[a] || !SYM[b]) throw new Error(`erd: cardinality must be one of ${CARDS.join(', ')} (got ${a}, ${b})`);
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
		{ at: points[0], ...unit(points[0], points[1]), card: a, side: sideA, text: labelA ?? a },
		{ at: points[points.length - 1], ...unit(points[points.length - 1], points[points.length - 2]), card: b, side: sideB, text: labelB ?? b },
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
	const labels = [];
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
		// label: beside the stub, away from the symbol's prongs
		if (e.uy === 0) {
			const x = e.at[0] + e.ux * 3;
			labels.push({ x: n2(x), y: n2(e.at[1] + (e.side === 'below' ? 16 : -8)), text: e.text, anchor: e.ux > 0 ? 'start' : 'end' });
		} else {
			const right = e.side !== 'left';
			labels.push({ x: n2(e.at[0] + (right ? 7 : -7)), y: n2(e.at[1] + e.uy * 11 + 3.5), text: e.text, anchor: right ? 'start' : 'end' });
		}
	}
	return { d: lineD + sym, line: lineD, sym, circles, labels };
}

/** Markup of a link for a hand-drawn figure: one stroked group (path and circles) and its labels. */
export function svg(lk) {
	const circles = lk.circles.map((c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" />`).join('');
	const labels = lk.labels.map((l) => `<text class="cl" x="${l.x}" y="${l.y}"${l.anchor === 'end' ? ' text-anchor="end"' : ''}>${l.text.replace(/\*/g, '&#42;')}</text>`).join(''); // MDX reads * as emphasis
	return `<g class="cf" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${lk.d}" />${circles}</g>${labels}`;
}

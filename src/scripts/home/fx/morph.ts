// 04: the logo's layers morph in. The void starts as a small round hole in the disc (a zero) and becomes the
// database shape; each band starts as a flat spreadsheet row and curves into its layer. The end states are
// the real path data of the mark, so the finished frame is the logo exactly.
import { gsap } from '../gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// a circle of radius 9 at the center of the 100 x 100 mark
const ZERO = 'M50 41C54.97 41 59 45.03 59 50C59 54.97 54.97 59 50 59C45.03 59 41 54.97 41 50C41 45.03 45.03 41 50 41Z';

/** "M29 31C29 45 71 45 71 31" -> the same row as a straight line (evenly spaced control points). */
function flat(d: string): string {
	const n = d.match(/-?\d*\.?\d+/g)?.map(Number);
	if (!n || n.length < 8) return d;
	const [x0, y0, , , , , x1] = n;
	const k = (x1 - x0) / 3;
	return `M${x0} ${y0}C${x0 + k} ${y0} ${x0 + 2 * k} ${y0} ${x1} ${y0}`;
}

/** A piece of the layer animation and where it starts (seconds) on the layer timeline. */
export type Part = [timeline: gsap.core.Timeline, at: number];

/**
 * The layer part of the end mark, in pieces: the void first, then the bands (rows slide in from the center,
 * then each curves into place). begin.ts warms each piece up in a frame slot of its own (MorphSVG converts and
 * aligns a path when it first renders) and joins them into one timeline that the scroll position plays once;
 * it is not scrubbed: rewriting path data on every scroll frame cost more than the rest of the section together.
 */
export function layers(mark: SVGElement): Part[] {
	const hole = mark.querySelector<SVGPathElement>('.void');
	const bands = gsap.utils.toArray<SVGPathElement>('.bands path', mark);
	if (!hole) return [];
	const part = () => gsap.timeline({ paused: true });
	const parts: Part[] = [
		[part().from(hole, { morphSVG: { shape: ZERO }, duration: 1.2, ease: 'dfz' }), 0],
		// rows first (flat), in from the center one after another
		[part().from(bands, { opacity: 0, scaleX: 0, svgOrigin: '50 50', duration: 0.6, stagger: 0.14, ease: 'dfz' }), 0.7],
	];
	bands.forEach((band, i) => {
		const d = band.getAttribute('d');
		if (d) parts.push([part().from(band, { morphSVG: { shape: flat(d) }, duration: 1.1, ease: 'dfz' }), 1.2 + i * 0.12]);
	});
	return parts;
}

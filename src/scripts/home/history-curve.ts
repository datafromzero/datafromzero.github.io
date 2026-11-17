// The history slider's look as a function of a card's distance from the center (in cards), shared by the
// CSS first frame (components/home/History.astro, built at build time) and the GSAP loop
// (sections/history.ts), so the two always agree. No GSAP here: this module is also imported at build time.

/** Cards move 80% of their width per step; one card's whole pass (400% → -400%) is ±5 steps. */
export const STEP_WIDTH = 0.8;
export const HALF_PASS = 5;

/**
 * Opacity by distance, at |d| = 0, 1, 2, 3, 4, 5. Scale and opacity are separate: the neighbors at ±1 stay at
 * 0.9, so their smallest text (--soft) keeps 4.5:1 in both themes (dark about 7:1, light about 5.4:1);
 * from ±2 the cards fade out.
 */
const OPACITY = [1, 0.9, 0.4, 0.15, 0.04, 0];

/** u: 1 at the center, 0 at the ends of the pass (|d| = 5). */
const distOf = (u: number) => (1 - u) * HALF_PASS;

/** Opacity for a position on the pass (piecewise linear through OPACITY). Used as a GSAP ease. */
export function opacityAt(u: number): number {
	const d = Math.min(HALF_PASS, Math.max(0, distOf(u)));
	const i = Math.min(HALF_PASS - 1, Math.floor(d));
	return OPACITY[i] + (OPACITY[i + 1] - OPACITY[i]) * (d - i);
}

/** Scale for a position on the pass: power1.in, as in the GSAP demo. */
export const scaleAt = (u: number): number => u * u;

/** The same two values for a whole-card distance (the CSS first frame). */
export function lookAt(d: number): { scale: number; opacity: number } {
	const u = Math.max(0, 1 - Math.abs(d) / HALF_PASS);
	return { scale: scaleAt(u), opacity: opacityAt(u) };
}

// The history slider's look as a function of a card's distance from the center (in cards): a 3D cover-flow fan.
// Shared by the CSS first frame (components/home/History.astro, built at build time) and the GSAP loop
// (sections/history.ts), so the two always agree. No GSAP here: this module is also imported at build time.

/** The fan's geometry. Lengths are fractions of the card's width, so the fan scales with the card. */
export interface Fan {
	/** Sideways shift per card of distance. */
	x: number;
	/** Push back (away from the viewer) per card of distance. */
	z: number;
	/** Tilt of every side card, degrees: it faces the center, so its outer edge is the nearer one. */
	rot: number;
	/** The parent's perspective distance. */
	depth: number;
}

/**
 * Depth and tilt measured from Google Play Games' "Find your next game" carousel at 1280 px (cards about 450 px
 * wide, perspective 1100 px, z -102 px, 32 degrees), as fractions of the card width. The sideways step is wider
 * than the reference's (0.282) because our cards are portrait with left-aligned text: with 0.52 a +-1 card shows
 * about 40% of its width beside the center card, a +-2 card more. On a phone the center card (203 px of 390)
 * leaves about 95 px each side, so +-1 shows about 40% and +-2 a sliver.
 */
export const FAN: { desktop: Fan; phone: Fan } = {
	desktop: { x: 0.52, z: 0.227, rot: 32, depth: 2.44 },
	phone: { x: 0.5, z: 0.227, rot: 32, depth: 2.44 },
};
/** The viewport width up to which the phone geometry applies (the same break as the card size in home.css). */
export const PHONE_MAX_PX = 700;

/** Card opacity at |d| = 0 .. 4: every visible card is opaque; only the cards leaving the fan (+-3 to +-4) fade out. Fewer cards in play means fewer layers to move. */
const OPACITY = [1, 1, 1, 0.8, 0];
/**
 * Opacity of the shade over a card (the page color on top of it), so the stack reads as depth while the center
 * stays dominant. The shade stays light at +-1 (their text keeps 4.5:1 in both themes) and deepens outward.
 */
const SHADE = [0, 0.1, 0.2, 0.26, 0.5];
/** Distance at which a card has left the fan (opacity 0). */
export const FAN_EDGE = OPACITY.length - 1;

/** Shade at a whole-card distance; the loop switches to it when the rounded distance changes (no per-frame write, no animated layer). */
export const shadeFor = (ad: number): number => table(SHADE, Math.round(ad));

const table = (t: number[], ad: number): number => {
	const a = Math.min(FAN_EDGE, Math.max(0, ad));
	const i = Math.min(FAN_EDGE - 1, Math.floor(a));
	return t[i] + (t[i + 1] - t[i]) * (a - i);
};

export interface Look {
	/** Fractions of the card width. */
	x: number;
	z: number;
	/** Degrees. */
	rotateY: number;
	scale: number;
	/** Stacking: the card nearer the center is on top. */
	zIndex: number;
	opacity: number;
	/** 0 (none) to 1 (the page color): darkening of far cards. */
	shade: number;
}

/** The look at a (fractional) signed distance d (negative: left of the center). Linear in d, so a move between two cards is smooth. */
export function lookAt(d: number, fan: Fan): Look {
	const ad = Math.abs(d);
	return {
		x: d * fan.x,
		z: -ad * fan.z,
		// CSS rotateY(+) brings the left edge toward the viewer: left cards (d < 0) turn +, right cards -.
		rotateY: -fan.rot * Math.max(-1, Math.min(1, d)),
		scale: 1,
		// Beyond +-3 cards are faded or gone and no longer change places, so they share one level (DOM order breaks the tie): fewer writes.
		zIndex: 100 - 10 * Math.min(3, Math.round(ad)),
		opacity: table(OPACITY, ad),
		shade: table(SHADE, ad),
	};
}

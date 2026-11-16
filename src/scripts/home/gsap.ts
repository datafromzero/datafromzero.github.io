// Single entry to GSAP for the homepage. Imported only from the deferred motion chunks, so the
// library never sits on the critical path. Plugins are registered by the modules that use them.
//
// No ticker.fps() cap and the default lagSmoothing: the ticker follows requestAnimationFrame, so
// tweens run at the display's refresh rate (120 Hz phones included).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);
// The brand ease: the same curve as `--ease` in home.css (the CSS intro), so a CSS entrance and a GSAP
// one land identically. Used as 'dfz' by every section.
CustomEase.create('dfz', '0.16, 1, 0.3, 1');
// The mobile address bar resizing the viewport must not trigger a refresh while scrolling.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Read-before-write for a batch of targets. GSAP reads an element's computed transform the first time it
 * animates it, and every read after a write forces a style recalculation. Priming the caches of all
 * targets first turns N interleaved read/write pairs into N reads in a row (one recalculation) followed by
 * pure writes.
 */
export function prime(targets: ArrayLike<Element>, props: string[] = ['x']): void {
	for (let i = 0; i < targets.length; i++) for (const p of props) gsap.getProperty(targets[i], p);
}

/**
 * Run a timeline to its end and back to where it was. GSAP reads a tween's start values (computed styles,
 * SVG path lengths) the first time it renders, which for a scrubbed timeline would be mid-scroll, in a frame
 * the reader sees; this does it now, in a setup slot. (Not combined with invalidateOnRefresh: that was
 * observed to invalidate the tweens again mid-scroll; see initAgainOnRefresh.)
 */
export function initEarly<T extends gsap.core.Timeline>(tl: T): T {
	const at = tl.progress();
	tl.progress(1, true).progress(at, true);
	return tl;
}

/**
 * What `invalidateOnRefresh` is for (tween values that depend on size, such as SVG path lengths), but
 * without leaving the re-initialization to the first frame of the next scroll. Like ScrollTrigger's own
 * option, the timeline is reverted before it is invalidated, so start values are recorded from the original
 * state and not from wherever the scrub stopped; it is then initialized again at the same progress.
 * Runs inside the refresh (rare: resize, orientation, zoom, fonts). Returns the function that stops listening.
 */
export function initAgainOnRefresh(tl: gsap.core.Timeline): () => void {
	const again = () => {
		const at = tl.progress();
		tl.revert({ kill: false }).invalidate();
		tl.progress(1, true).progress(at, true);
	};
	ScrollTrigger.addEventListener('refresh', again);
	return () => ScrollTrigger.removeEventListener('refresh', again);
}

/** Hint the compositor only while something is animating: `on` promotes, `off` drops the layer again. */
export function willChange(targets: ArrayLike<HTMLElement | SVGElement>, value: string | null): void {
	for (let i = 0; i < targets.length; i++) targets[i].style.willChange = value ?? '';
}

export { gsap, ScrollTrigger };

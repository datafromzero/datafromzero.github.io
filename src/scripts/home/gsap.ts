// Single entry to GSAP for the homepage. Imported only from the deferred motion chunks, so the
// library never sits on the critical path. Plugins are registered by the modules that use them.
//
// No ticker.fps() cap and the default lagSmoothing: the ticker follows requestAnimationFrame, so
// tweens run at the display's refresh rate (120 Hz phones included).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { afterNextFrame } from './yield';

gsap.registerPlugin(ScrollTrigger);
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
 * without leaving the re-initialization to the first frame of the next scroll: after a refresh the timeline
 * is invalidated and initialized early again in a setup slot. Returns the function that stops listening.
 */
export function initAgainOnRefresh(tl: gsap.core.Timeline): () => void {
	const again = () => {
		tl.invalidate();
		void afterNextFrame().then(() => initEarly(tl));
	};
	ScrollTrigger.addEventListener('refresh', again);
	return () => ScrollTrigger.removeEventListener('refresh', again);
}

/** Hint the compositor only while something is animating: `on` promotes, `off` drops the layer again. */
export function willChange(targets: ArrayLike<HTMLElement | SVGElement>, value: string | null): void {
	for (let i = 0; i < targets.length; i++) targets[i].style.willChange = value ?? '';
}

export { gsap, ScrollTrigger };

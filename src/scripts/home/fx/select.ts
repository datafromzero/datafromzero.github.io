// Hero: an Excel-style selection box (2px border and a fill handle) lands on "A1", then slides to "AI" while
// the CSS reel rolls 1 → I (design/README.md §5). The wordmark itself is CSS only and complete without this.
// The box is an absolutely positioned element moved with x/y (transforms) and sized with width/height, so it
// never shifts layout. It follows the CSS intro's own clock, so a chunk that arrives mid-intro joins in sync;
// one that arrives after the roll only fades the box in on "AI" and never replays the intro.
import { gsap } from '../gsap';

/** The CSS intro clock (home.css): box on A1 at BOX_IN, slide in sync with the reel roll. Seconds. */
const BOX_IN = 1.5;
const ROLL_AT = 2.2;
const ROLL_FOR = 1.1;

interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function init(hero: HTMLElement): () => void {
	const vis = hero.querySelector<HTMLElement>('.lockup-wv');
	const a1 = hero.querySelector<HTMLElement>('.lockup-wm .a1');
	const ai = hero.querySelector<HTMLElement>('.lockup-wm .ai');
	const reel = hero.querySelector<HTMLElement>('.lockup-wm .reel');
	const replay = hero.querySelector<HTMLButtonElement>('[data-replay]');
	if (!vis || !a1 || !ai || !reel) return () => {};

	const sel = document.createElement('span');
	sel.className = 'sel';
	sel.append(document.createElement('b'));
	vis.append(sel);

	/**
	 * Both boxes, in the wordmark's own (unscaled) pixels. Rows come from the A1 mask, which the entrance
	 * never transforms; columns of AI come from its own rect, which the rise (translateY, skewY) leaves
	 * unchanged horizontally. k undoes the hero's scroll-out scale, if the page is already scrolled.
	 */
	const measure = (): { start: Box; end: Box } => {
		const p = vis.getBoundingClientRect();
		const k = p.width ? vis.offsetWidth / p.width : 1;
		const size = parseFloat(getComputedStyle(vis).fontSize);
		const pad = size * 0.1;
		const row = a1.getBoundingClientRect();
		const box = (r: DOMRect): Box => ({
			x: (r.left - p.left) * k - pad,
			y: (row.top - p.top) * k - pad * 0.3,
			width: r.width * k + pad * 2,
			height: size + pad * 0.6,
		});
		return { start: box(row), end: box(ai.getBoundingClientRect()) };
	};

	/** Seconds since the CSS intro started: the reel animation's start time when known, else navigation start. */
	const clock = () => {
		const anim = reel.getAnimations?.()[0];
		const from = anim ? (typeof anim.startTime === 'number' ? anim.startTime : performance.now()) : 0;
		return (performance.now() - from) / 1000;
	};

	let tl: gsap.core.Timeline | undefined;
	const play = () => {
		tl?.kill();
		const { start, end } = measure();
		const t = clock();
		if (t >= ROLL_AT + ROLL_FOR) {
			// late: the CSS roll has already ended, so the box simply appears where it ends up
			gsap.set(sel, end);
			tl = gsap.timeline().fromTo(sel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' });
			return;
		}
		tl = gsap
			.timeline({ paused: true })
			.set(sel, { ...start, autoAlpha: 0, scale: 1.15 }, 0)
			.to(sel, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, BOX_IN)
			.to(sel, { x: end.x, y: end.y, width: end.width, height: end.height, duration: ROLL_FOR, ease: 'power3.inOut' }, ROLL_AT);
		tl.time(t).play();
	};
	play();

	// Size changes (rotation, zoom, the web font arriving): finish in place, or carry on from the same moment.
	let first = true;
	const ro = new ResizeObserver(() => {
		if (first) return void (first = false);
		if (tl?.isActive() && tl.time() < ROLL_AT + ROLL_FOR) play();
		else gsap.set(sel, measure().end);
	});
	ro.observe(vis);
	// The logo button replays the CSS intro (home-boot.ts restarts it first); the box replays with it.
	const onReplay = () => play();
	replay?.addEventListener('click', onReplay);

	return () => {
		tl?.kill();
		ro.disconnect();
		replay?.removeEventListener('click', onReplay);
		sel.remove();
	};
}

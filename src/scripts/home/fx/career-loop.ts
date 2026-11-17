// 05: plays the open career's figure (careers-figures.ts) on the GSAP ticker, a deferred chunk fetched when the
// section nears the screen (scripts/home/careers.ts). Never loaded with reduced motion.
// The loop runs only while a card is open and the figure is on screen (IntersectionObserver); otherwise the
// ticker has no callback of ours. Per frame: one canvas redraw, no DOM reads or writes (the size comes from a
// ResizeObserver, the color is read once per theme), within the SPEC §12 frame budget.
// Opening a card fades the figure in (transform and opacity only). The tween never reads styles after the click's
// DOM changes: GSAP keeps the canvas's transform in its cache (no clearProps), so the click costs no forced layout.
// The panel's lines lift in with CSS (home.css, .cr-detail.is-picked).
import { gsap } from '../gsap';
import { afterNextFrame } from '../yield';
import { figure, watch } from '../careers-figures';
import type { Careers, Key } from '../careers';

export async function init(c: Careers) {
	await afterNextFrame(); // a frame slot of its own for the setup
	const fig = figure(c.stage);
	let clock = 0;
	let on = false;
	let visible = false;

	const frame = (key: Key, dt: number) => fig.draw(key, clock, clock * 0.35, dt);
	const tick = (_time: number, deltaMs: number) => {
		if (!c.key) return;
		// a long gap (tab in the background, a stall) must not make the figure jump: at most a quarter second
		const dt = Math.min(deltaMs, 250) / 1000;
		clock += dt;
		frame(c.key, dt);
	};
	const sync = () => {
		const run = visible && !!c.key;
		if (run === on) return;
		on = run;
		if (run) gsap.ticker.add(tick);
		else gsap.ticker.remove(tick);
	};

	watch(c.stage, fig, () => c.key && frame(c.key, 0));
	new IntersectionObserver(([e]) => {
		visible = e.isIntersecting;
		sync();
	}).observe(c.stage);

	const fadeIn = () => gsap.fromTo(fig.canvas, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', overwrite: true });
	fadeIn();

	c.after.add((key) => {
		sync();
		if (!key) return;
		clock = 0;
		frame(key, 0);
		fadeIn();
	});
}

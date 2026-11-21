import { gsap, willChange } from '../gsap';
import { opacityAt, scaleAt, STEP_WIDTH } from '../history-curve';
import type { Step } from './index';
import type { Draggable as DraggablePlugin } from 'gsap/Draggable';

let Draggable: typeof DraggablePlugin | undefined;
/** Dragging the cards is its own chunk (Draggable), fetched when the section is near. Without it the buttons and keys still work. */
export const load = () =>
	import('gsap/Draggable').then((m) => {
		gsap.registerPlugin(m.Draggable);
		Draggable = m.Draggable;
	});

/** Time between two cards on the loop: one card's whole pass (right edge to left edge) takes 1. */
const SPACING = 0.1;

/**
 * One card's pass across the stage: it slides from 400% to -400% of its width while it grows to full size at
 * the center and shrinks again (power1.in both ways). Opacity has its own curve (history-curve.ts): the
 * neighbors stay readable, the cards further out fade. Transforms and opacity only.
 */
const half = { duration: 0.5, yoyo: true, repeat: 1, immediateRender: false };
const pass = (el: HTMLElement) =>
	gsap
		.timeline()
		.fromTo(el, { scale: 0 }, { scale: 1, ease: scaleAt, ...half })
		.fromTo(el, { opacity: 0 }, { opacity: 1, ease: opacityAt, ...half }, 0)
		.fromTo(el, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: 'none', immediateRender: false }, 0);

/**
 * The seamless loop of the GSAP "Infinite card slider" demo: every card's pass is laid out on a raw timeline,
 * SPACING apart, with extra copies before and after so that every moment of the loop has its neighbors on
 * both sides. A second timeline scrubs a window of exactly one lap of the raw one and repeats forever, so
 * time t centers card t / SPACING and the end of the lap is the same picture as its start.
 * The demo jumps back over a second segment; with fewer than 15 cards that segment would have a negative
 * length, so here the window is one plain segment, which needs at least 0.5 / SPACING cards (5).
 */
function seamlessLoop(items: HTMLElement[]) {
	const n = items.length;
	const extra = Math.ceil(1 / SPACING);
	const raw = gsap.timeline({ paused: true });
	for (let i = 0; i < 2 * n + extra; i++) raw.add(pass(items[i % n]), i * SPACING);
	// At raw time T the card at index j sits at progress T - j * SPACING; 0.5 is the center, so this start
	// centers the copy of card 0 at index n.
	const start = n * SPACING + 0.5;
	const lap = n * SPACING;
	raw.time(start);
	return gsap
		.timeline({ paused: true, repeat: -1 })
		.fromTo(raw, { time: start }, { time: start + lap, duration: lap, ease: 'none', immediateRender: false });
}

/**
 * 04: the history slider. The center card is full size, the side cards scale down and fade; the loop has no
 * end. It moves by drag (Draggable), the Previous / Next buttons and ←/→ while the slider has focus, always
 * coming to rest on a card, and a polite live region names the centered card after each move. It starts on
 * the first card (1804). Nothing runs between moves: the only per-frame work is the scrub tween, which
 * writes transform and opacity (z-index only when the order of two cards changes, once per card passed).
 *
 * Two frame slots: .is-live first turns the list into the slider's first frame (CSS only, from --d, --s,
 * --o), then the loop is built on it. Without .is-live, whatever the reason, the cards stay a list.
 */
export function init(section: HTMLElement, onCleanup: (fn: () => void) => void): Step[] | void {
	const gallery = section.querySelector<HTMLElement>('.gallery');
	const list = gallery?.querySelector<HTMLElement>('.cards');
	if (!gallery || !list) return;
	const cards = gsap.utils.toArray<HTMLElement>('.card', list);
	if (cards.length < 5) return;
	gallery.classList.add('is-live');
	let undo: (() => void) | undefined;
	onCleanup(() => {
		undo?.();
		gallery.classList.remove('is-live');
	});
	return [() => (undo = build(gallery, list, cards))];
}

function build(gallery: HTMLElement, list: HTMLElement, cards: HTMLElement[]): () => void {
	const controls = gallery.querySelector<HTMLElement>('.hist-controls');
	const say = gallery.querySelector<HTMLElement>('.hist-live');
	const n = cards.length;
	// GSAP takes over from the CSS first frame: x, y and scale are given so the CSS transform it parses
	// first is not kept as an offset.
	gsap.set(cards, { x: 0, y: 0, xPercent: 400, scale: 0, opacity: 0 });
	const loop = seamlessLoop(cards);
	const wrapTime = gsap.utils.wrap(0, loop.duration());
	const wrapIndex = gsap.utils.wrap(0, n);
	const snap = gsap.utils.snap(SPACING);

	// Stacking: the card nearer the center is on top. Rounded distance, so a value changes only when the
	// center passes the midpoint between two cards; written only on change.
	const z = cards.map(() => -1);
	const stack = () => {
		const c = loop.time() / SPACING;
		for (let i = 0; i < n; i++) {
			let d = Math.abs(i - c) % n;
			if (d > n / 2) d = n - d;
			const v = n - Math.round(d);
			if (v !== z[i]) cards[i].style.zIndex = String((z[i] = v));
		}
	};

	let moving = false;
	const settle = (on: boolean) => {
		if (on === moving) return;
		moving = on;
		willChange(cards, on ? 'transform, opacity' : null);
	};
	// The playhead eases toward a target offset (seconds on the loop; it may grow past one lap either way).
	const playhead = { offset: 0 };
	const announce = () => {
		const card = cards[wrapIndex(Math.round(playhead.offset / SPACING))];
		if (say && card) say.textContent = `${card.querySelector('.yr')?.textContent ?? ''}: ${card.querySelector('h3')?.textContent ?? ''}`;
	};
	// The pill's counter ("05 / 14") follows the card nearest the center while the slider moves.
	const count = controls?.querySelector<HTMLElement>('.hist-count b');
	let shown = -1;
	const render = () => {
		loop.time(wrapTime(playhead.offset));
		stack();
		const i = wrapIndex(Math.round(playhead.offset / SPACING));
		if (count && i !== shown) count.textContent = String((shown = i) + 1).padStart(2, '0');
	};
	const scrub = gsap.to(playhead, {
		offset: 0,
		duration: 0.6,
		ease: 'power3',
		paused: true,
		onUpdate: render,
		onComplete: () => {
			settle(false);
			announce();
		},
	});
	const goTo = (offset: number) => {
		settle(true);
		scrub.vars.offset = offset;
		scrub.invalidate().restart();
	};
	const step = (by: number) => goTo(snap(scrub.vars.offset as number) + by * SPACING);
	render();

	const onClick = (e: MouseEvent) => {
		const b = (e.target as Element).closest<HTMLElement>('[data-step]');
		if (b) step(Number(b.dataset.step));
	};
	const onKey = (e: KeyboardEvent) => {
		// On the "Start here" link the arrows keep their usual meaning (screen readers, caret browsing).
		if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || (e.target as Element).closest('a')) return;
		e.preventDefault();
		step(e.key === 'ArrowRight' ? 1 : -1);
	};
	// Keyboard focus on a link inside a side card (the last card's "Start here") brings that card to the
	// center, the shortest way round, so the focused link is never small or faded.
	const onFocus = (e: FocusEvent) => {
		const i = cards.indexOf((e.target as Element).closest('.card') as HTMLElement);
		if (i < 0) return;
		const at = Math.round((scrub.vars.offset as number) / SPACING);
		let d = wrapIndex(i - at);
		if (d > n / 2) d -= n;
		if (d) goTo((at + d) * SPACING);
	};
	controls?.addEventListener('click', onClick);
	gallery.addEventListener('keydown', onKey);
	gallery.addEventListener('focusin', onFocus);
	if (controls) controls.hidden = false;

	let drag: DraggablePlugin | undefined;
	if (Draggable) {
		// A proxy element is dragged; its x only measures the gesture. One card width of drag moves one
		// card along, so the cards follow the finger.
		let from = 0;
		let perPx = 0;
		[drag] = Draggable.create(document.createElement('div'), {
			type: 'x',
			trigger: list,
			onPress() {
				from = scrub.vars.offset as number;
				perPx = SPACING / (STEP_WIDTH * (cards[0].offsetWidth || 240));
			},
			onDragStart: () => settle(true),
			onDrag() {
				scrub.vars.offset = from + (this.startX - this.x) * perPx;
				scrub.invalidate().restart();
			},
			onDragEnd: () => goTo(snap(scrub.vars.offset as number)),
		});
	}

	return () => {
		drag?.kill();
		scrub.kill();
		loop.kill();
		controls?.removeEventListener('click', onClick);
		gallery.removeEventListener('keydown', onKey);
		gallery.removeEventListener('focusin', onFocus);
		if (controls) controls.hidden = true;
		if (say) say.textContent = '';
		willChange(cards, null);
		gsap.set(cards, { clearProps: 'transform,opacity,zIndex' });
	};
}

import { gsap, willChange } from '../gsap';
import { FAN, FAN_EDGE, PHONE_MAX_PX, lookAt, shadeFor } from '../history-curve';
import type { Fan } from '../history-curve';
import type { Step } from './index';
import type { Draggable as DraggablePlugin } from 'gsap/Draggable';

let Draggable: typeof DraggablePlugin | undefined;
/** Dragging the cards is its own chunk (Draggable), fetched when the section is near. Without it the buttons and keys still work. */
export const load = () =>
	import('gsap/Draggable').then((m) => {
		gsap.registerPlugin(m.Draggable);
		Draggable = m.Draggable;
	});

/** Drag distance, in card widths, that moves the fan by one card. */
const DRAG_CARD = 0.6;
/** Pointer travel (px) above which a press counts as a drag, not a click on a card. */
const CLICK_SLOP = 6;

/**
 * 04: the history slider, a 3D cover-flow fan (history-curve.ts has its numbers). The center card is flat and in
 * front; every side card is tilted toward it, pushed back and out per card of distance, and stacked behind.
 * It moves by drag (Draggable), the Previous / Next buttons, a click on a side card and ←/→ while the slider has
 * focus, always coming to rest on a card, and a polite live region names the centered card after each move. It
 * starts on the first card (1804). Nothing runs between moves: the only per-frame work is one tween on the
 * playhead (a position in cards), which writes each card's transform (opacity and z-index only when they change; the shade when it comes to rest)
 * (z-index only when the order of two cards changes). The loop is endless: a card leaving one edge enters at
 * the other, fully faded, so nothing pops.
 *
 * Two frame slots: .is-live first turns the list into the slider's first frame (CSS only, from the same
 * numbers), then this takes over with the same values. Without .is-live, whatever the reason, the cards stay a list.
 */
export function init(section: HTMLElement, onCleanup: (fn: () => void) => void): Step[] | void {
	const gallery = section.querySelector<HTMLElement>('.gallery');
	const list = gallery?.querySelector<HTMLElement>('.cards');
	if (!gallery || !list) return;
	const cards = gsap.utils.toArray<HTMLElement>('.card', list);
	if (cards.length < 2 * FAN_EDGE + 1) return;
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
	const wrapIndex = gsap.utils.wrap(0, n);
	const wrapDist = gsap.utils.wrap(-n / 2, n / 2);
	const snap = gsap.utils.snap(1);

	// Sizes are measured here and when the window resizes, never inside the tween.
	const phone = matchMedia(`(max-width: ${PHONE_MAX_PX}px)`);
	let cw = cards[0].offsetWidth || 240;
	let fan: Fan = phone.matches ? FAN.phone : FAN.desktop;
	const measure = () => {
		cw = cards[0].offsetWidth || cw;
		fan = phone.matches ? FAN.phone : FAN.desktop;
		render();
	};

	// Stacking: written only when a card's value changes.
	const z = cards.map(() => -1);
	let moving = false;
	const settle = (on: boolean) => {
		if (on === moving) return;
		moving = on;
		willChange(cards, on ? 'transform, opacity' : null);
	};

	// The playhead: a position on the loop in cards (it may grow past one lap either way); it eases to a target.
	const playhead = { pos: 0 };
	let target = 0;
	const announce = () => {
		const card = cards[wrapIndex(Math.round(playhead.pos))];
		if (say && card) say.textContent = `${card.querySelector('.yr')?.textContent ?? ''}: ${card.querySelector('h3')?.textContent ?? ''}`;
	};
	// The pill's counter ("05 / 14") follows the card nearest the center while the slider moves.
	const count = controls?.querySelector<HTMLElement>('.hist-count b');
	let shown = -1;
	// Per frame: one transform per visible card; opacity and z-index only when their value changes; a card past
	// the edge of the fan that was already hidden is skipped. The shade (--k, painted by .card::after in the
	// card's own layer; a shade element or a per-frame shade costs a layer or a repaint per card per frame) is
	// written when the fan comes to rest, and CSS eases it in.
	const op = cards.map(() => -1);
	const sh = cards.map(() => -1);
	function shade() {
		for (let i = 0; i < n; i++) {
			const k = shadeFor(Math.abs(wrapDist(i - playhead.pos)));
			if (k !== sh[i]) cards[i].style.setProperty('--k', String((sh[i] = k)));
		}
	}
	function render() {
		for (let i = 0; i < n; i++) {
			const d = wrapDist(i - playhead.pos);
			const l = lookAt(d, fan);
			const el = cards[i];
			const o = +l.opacity.toFixed(3);
			if (o === 0 && op[i] === 0) continue;
			el.style.transform = `translate3d(${(l.x * cw).toFixed(1)}px,0,${(l.z * cw).toFixed(1)}px) rotateY(${l.rotateY.toFixed(2)}deg)`;
			if (o !== op[i]) el.style.opacity = String((op[i] = o));
			if (l.zIndex !== z[i]) el.style.zIndex = String((z[i] = l.zIndex));
		}
		const i = wrapIndex(Math.round(playhead.pos));
		if (count && i !== shown) count.textContent = String((shown = i) + 1).padStart(2, '0');
	}
	const scrub = gsap.to(playhead, {
		pos: 0,
		duration: 0.65,
		ease: 'power3',
		paused: true,
		onUpdate: render,
		onComplete: () => {
			settle(false);
			shade();
			announce();
		},
	});
	const goTo = (pos: number) => {
		settle(true);
		target = pos;
		scrub.vars.pos = pos;
		scrub.invalidate().restart();
	};
	const step = (by: number) => goTo(snap(target) + by);
	render();
	phone.addEventListener('change', measure);
	addEventListener('resize', measure);

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
	// A card to the center, the shortest way round.
	const bring = (i: number) => {
		const at = Math.round(target);
		let d = wrapIndex(i - at);
		if (d > n / 2) d -= n;
		if (d) goTo(at + d);
	};
	// Keyboard focus on a link inside a side card (the last card's "Start here") brings that card to the
	// center, so the focused link is never small or shaded.
	const onFocus = (e: FocusEvent) => {
		const i = cards.indexOf((e.target as Element).closest('.card') as HTMLElement);
		if (i >= 0) bring(i);
	};
	// A click on a side card brings it to the center (not after a drag, not on a link).
	let downX = 0;
	let dragged = false;
	const onDown = (e: PointerEvent) => {
		downX = e.clientX;
		dragged = false;
	};
	const onMove = (e: PointerEvent) => {
		if (Math.abs(e.clientX - downX) > CLICK_SLOP) dragged = true;
	};
	const onCardClick = (e: MouseEvent) => {
		const el = (e.target as Element).closest<HTMLElement>('.card');
		if (!el || dragged || (e.target as Element).closest('a')) return;
		bring(cards.indexOf(el));
	};
	controls?.addEventListener('click', onClick);
	gallery.addEventListener('keydown', onKey);
	gallery.addEventListener('focusin', onFocus);
	list.addEventListener('pointerdown', onDown);
	list.addEventListener('pointermove', onMove);
	list.addEventListener('click', onCardClick);
	if (controls) controls.hidden = false;

	let drag: DraggablePlugin | undefined;
	if (Draggable) {
		// A proxy element is dragged; its x only measures the gesture. DRAG_CARD of a card width moves one card.
		let from = 0;
		[drag] = Draggable.create(document.createElement('div'), {
			type: 'x',
			trigger: list,
			onPress() {
				from = target;
			},
			onDragStart: () => settle(true),
			onDrag() {
				target = from + (this.startX - this.x) / (DRAG_CARD * cw);
				scrub.vars.pos = target;
				scrub.invalidate().restart();
			},
			onDragEnd: () => goTo(snap(target)),
		});
	}

	return () => {
		drag?.kill();
		scrub.kill();
		phone.removeEventListener('change', measure);
		removeEventListener('resize', measure);
		controls?.removeEventListener('click', onClick);
		gallery.removeEventListener('keydown', onKey);
		gallery.removeEventListener('focusin', onFocus);
		list.removeEventListener('pointerdown', onDown);
		list.removeEventListener('pointermove', onMove);
		list.removeEventListener('click', onCardClick);
		if (controls) controls.hidden = true;
		if (say) say.textContent = '';
		willChange(cards, null);
		for (const [i, el] of cards.entries()) {
			el.style.removeProperty('transform');
			el.style.removeProperty('opacity');
			el.style.removeProperty('z-index');
			el.style.removeProperty('--k');
		}
	};
}

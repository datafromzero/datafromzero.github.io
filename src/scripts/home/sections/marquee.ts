import { gsap, ScrollTrigger, willChange } from '../gsap';
import type * as Drive from '../fx/drive';

let drive: typeof Drive | undefined;
/** Touch and trackpad input is its own chunk (Observer). */
export const load = () =>
	import('../fx/drive').then((m) => {
		drive = m;
	});

/** One lap is 30 s: the track holds two copies of the words, so a lap is 50% of its own width. */
const PERCENT_PER_SECOND = 50 / 30;

/**
 * Marquee: loops forever, runs only while visible, speeds up and leans with scroll velocity.
 * WCAG 2.2.2: a visible Pause/Play toggle, and it also holds still while hovered or keyboard-focused.
 *
 * One ticker callback does all of it while the section is on screen, and nothing otherwise: constant work
 * per frame, one `transform` write, no tween created per scroll event. The speed and the lean are
 * exponentially smoothed toward targets taken from ScrollTrigger's velocity, so they are frame-rate
 * independent (the same feel at 60 and 120 Hz).
 *
 * With Observer (fx/drive.ts) the line can also be flicked sideways with a finger, mouse or trackpad: it
 * follows the pointer, then coasts and settles back to its own pace. Vertical scrolling is never touched.
 */
export function init(marquee: HTMLElement, onCleanup: (fn: () => void) => void) {
	const inner = marquee.querySelector<HTMLElement>('.marquee-inner');
	const toggle = marquee.querySelector<HTMLButtonElement>('.marquee-toggle');
	if (!inner) return;

	let visible = false;
	let userPaused = false;
	let hovered = false;
	let focused = false;
	let running = false; // the loop advances (visible and not held)
	let dragging = false;
	let width = 1; // track width in px while dragging
	let fling = 0; // percent of the track per second, after a flick; decays on its own
	let dragV = 0; // px/s while dragging, for the lean

	let pos = 0; // percent of the track's width, 0 to 50
	let speed = 1; // signed multiplier of the base speed
	let skew = 0;
	let dir = 1;
	let lastScroll = -1; // ticker time of the latest scroll update
	let written = '';

	const st = ScrollTrigger.create({
		trigger: marquee,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => {
			visible = self.isActive;
			sync();
		},
		onUpdate: (self) => {
			dir = self.direction;
			lastScroll = gsap.ticker.time;
		},
	});

	const tick = (time: number, deltaMs: number) => {
		const dt = Math.min(deltaMs, 64) / 1000; // a stalled tab must not make the loop jump
		const moving = time - lastScroll < 0.14;
		const v = moving ? st.getVelocity() : 0;
		const target = moving ? dir * (1 + Math.min(Math.abs(v) / 250, 7)) : speed < 0 ? -1 : 1;
		// quick to speed up (about 0.15 s), slow to settle back (about 1.2 s)
		speed += (target - speed) * (1 - Math.exp(-dt / (Math.abs(target) > Math.abs(speed) ? 0.06 : 0.45)));
		const lean = dragging ? Math.max(-9, Math.min(9, -dragV / 300)) : moving ? Math.max(-9, Math.min(9, -v / 300)) : 0;
		skew += (lean - skew) * (1 - Math.exp(-dt / 0.12));
		if (running) pos += speed * PERCENT_PER_SECOND * dt;
		if (fling) {
			pos += fling * dt;
			fling *= Math.exp(-dt / 0.55);
			if (Math.abs(fling) < 0.05) fling = 0;
		}
		pos %= 50;
		if (pos < 0) pos += 50;
		const next = `translate3d(${(-pos).toFixed(3)}%,0,0) skewX(${skew.toFixed(2)}deg)`;
		if (next !== written) inner.style.transform = written = next;
	};

	const sync = () => {
		running = visible && !userPaused && !hovered && !focused && !dragging;
		// the layer exists only while the marquee is on screen; the ticker callback likewise
		gsap.ticker.remove(tick);
		if (visible) {
			willChange([inner], 'transform');
			gsap.ticker.add(tick);
		} else {
			willChange([inner], null);
		}
	};

	// onToggle only fires on changes: pick up the state at creation (the section may already be on screen).
	visible = st.isActive;
	sync();
	onCleanup(() => {
		gsap.ticker.remove(tick);
		willChange([inner], null);
		inner.style.transform = '';
		st.kill();
	});

	if (drive) {
		const pct = (px: number) => (px / width) * 100;
		onCleanup(
			drive.drag(marquee, {
				start: () => {
					width = inner.offsetWidth || 1;
					dragging = true;
					fling = 0;
					sync();
				},
				// dragging right pulls the line right: the position (how far it has moved left) goes down
				move: (dx, vx) => {
					pos -= pct(dx);
					dragV = vx;
				},
				end: (vx) => {
					dragging = false;
					dragV = 0;
					fling = Math.max(-400, Math.min(400, -pct(vx))); // percent per second, same direction as the flick
					sync();
				},
				wheel: (dx) => {
					width = inner.offsetWidth || 1;
					pos += pct(dx) * 0.8;
				},
			}),
		);
	}

	if (!toggle) return;
	toggle.hidden = false;
	const render = () => {
		toggle.setAttribute('aria-pressed', String(userPaused));
		toggle.textContent = userPaused ? (toggle.dataset.play ?? '') : (toggle.dataset.pause ?? '');
	};
	const onClick = () => {
		userPaused = !userPaused;
		// Resuming with the button focused must actually resume: ignore focus until it leaves.
		if (!userPaused) focused = false;
		render();
		sync();
	};
	const onEnter = () => {
		hovered = true;
		sync();
	};
	const onLeave = () => {
		hovered = false;
		sync();
	};
	// Only keyboard focus holds the loop (a mouse click on the toggle must not).
	const onFocusIn = (e: FocusEvent) => {
		if ((e.target as Element).matches(':focus-visible')) {
			focused = true;
			sync();
		}
	};
	const onFocusOut = () => {
		focused = false;
		sync();
	};
	const canHover = matchMedia('(hover: hover)').matches;
	toggle.addEventListener('click', onClick);
	marquee.addEventListener('focusin', onFocusIn);
	marquee.addEventListener('focusout', onFocusOut);
	if (canHover) {
		marquee.addEventListener('pointerenter', onEnter);
		marquee.addEventListener('pointerleave', onLeave);
	}
	onCleanup(() => {
		toggle.hidden = true;
		toggle.removeEventListener('click', onClick);
		marquee.removeEventListener('focusin', onFocusIn);
		marquee.removeEventListener('focusout', onFocusOut);
		marquee.removeEventListener('pointerenter', onEnter);
		marquee.removeEventListener('pointerleave', onLeave);
	});
}

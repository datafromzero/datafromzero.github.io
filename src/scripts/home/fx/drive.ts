// Touch and trackpad input (Observer). Never takes over scrolling: every listener is passive, vertical
// movement stays with the browser, and nothing here calls preventDefault.
//   velocity()  how fast the reader is scrolling right now (fingers and trackpad included), px/s
//   drag()      horizontal flick or wheel on one element (the marquee)
//   lag()       an element that trails the scroll a little and settles (gentle parallax)
// A thrown flick needs no InertiaPlugin: the consumers smooth their own speed exponentially, which is
// the same friction curve, so the plugin would add bytes and no motion.
import { gsap, ScrollTrigger, willChange } from '../gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

let users = 0;
let touch: Observer | undefined;
let scroll: ScrollTrigger | undefined;
let touchV = 0;
let touchAt = -1;

function acquire() {
	if (users++) return;
	scroll = ScrollTrigger.create({ start: 0, end: 'max' });
	// finger or trackpad on the page: velocity is known the moment it moves, before the scroll position follows
	touch = Observer.create({
		target: window,
		type: 'wheel,touch',
		preventDefault: false,
		tolerance: 2,
		onChangeY: (self) => {
			touchV = Math.abs(self.velocityY);
			touchAt = gsap.ticker.time;
		},
	});
}
function release() {
	if (--users) return;
	touch?.kill();
	scroll?.kill();
	touch = scroll = undefined;
}

/** Signed like scroll (down is positive): the faster of the live finger or wheel velocity and the scroll position's own. */
export function velocity(): number {
	if (!scroll) return 0;
	const sv = scroll.getVelocity();
	const fv = gsap.ticker.time - touchAt < 0.12 ? touchV * (scroll.direction || 1) : 0;
	return Math.abs(fv) > Math.abs(sv) ? fv : sv;
}

export interface DragHandlers {
	/** A drag begins: hold whatever is moving on its own. */
	start: () => void;
	/** Pixels moved since the last call (right is positive), and the current speed in px/s. */
	move: (dx: number, vx: number) => void;
	/** The finger or mouse is released with this speed (px/s). */
	end: (vx: number) => void;
	/** A horizontal trackpad scroll over the element. */
	wheel: (dx: number) => void;
}

/** Horizontal drag and wheel on `el`. Vertical movement is left to the browser (CSS touch-action: pan-y). */
export function drag(el: HTMLElement, h: DragHandlers): () => void {
	acquire();
	const pointer = Observer.create({
		target: el,
		type: 'pointer',
		ignore: '.marquee-toggle',
		lockAxis: true,
		dragMinimum: 4,
		preventDefault: false,
		allowClicks: true,
		onDragStart: () => h.start(),
		onDrag: (self) => h.move(self.deltaX, self.velocityX),
		onDragEnd: (self) => h.end(self.velocityX),
	});
	const wheel = Observer.create({
		target: el,
		type: 'wheel',
		preventDefault: false,
		onWheel: (self) => {
			if (Math.abs(self.deltaX) > Math.abs(self.deltaY)) h.wheel(self.deltaX);
		},
	});
	return () => {
		pointer.kill();
		wheel.kill();
		release();
	};
}

/**
 * `el` trails the scroll by a few pixels while it is moving fast and settles when it stops. Runs a ticker
 * callback only while `section` is on screen; one `transform` write per frame, and only when the value changed.
 */
export function lag(el: HTMLElement, section: HTMLElement, max = 9): () => void {
	acquire();
	let y = 0;
	let written = '';
	const tick = (_t: number, deltaMs: number) => {
		const dt = Math.min(deltaMs, 64) / 1000;
		const target = Math.max(-max, Math.min(max, -velocity() / 110));
		y += (target - y) * (1 - Math.exp(-dt / 0.16));
		const next = Math.abs(y) < 0.05 ? '' : `translate3d(0,${y.toFixed(2)}px,0)`;
		if (next !== written) el.style.transform = written = next;
	};
	const st = ScrollTrigger.create({
		trigger: section,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => {
			gsap.ticker.remove(tick);
			willChange([el], self.isActive ? 'transform' : null);
			if (self.isActive) gsap.ticker.add(tick);
			else el.style.transform = written = '';
		},
	});
	if (st.isActive) {
		willChange([el], 'transform');
		gsap.ticker.add(tick);
	}
	return () => {
		gsap.ticker.remove(tick);
		st.kill();
		willChange([el], null);
		el.style.transform = '';
		release();
	};
}

import { gsap, ScrollTrigger } from '../gsap';

/**
 * Marquee: loops forever, runs only while visible, speeds up and leans with scroll velocity.
 * WCAG 2.2.2: a visible Pause/Play toggle, and it also holds still while hovered or keyboard-focused.
 */
export function init(marquee: HTMLElement, onCleanup: (fn: () => void) => void) {
	const inner = marquee.querySelector<HTMLElement>('.marquee-inner');
	const toggle = marquee.querySelector<HTMLButtonElement>('.marquee-toggle');
	if (!inner) return;

	const loop = gsap.to(inner, { xPercent: -50, repeat: -1, ease: 'none', duration: 30, paused: true });
	// Start deep into the repeats so scrolling up (negative timeScale) can run backwards without hitting time 0.
	loop.totalTime(loop.duration() * 1000);
	const lean = gsap.quickTo(inner, 'skewX', { duration: 0.4, ease: 'power3' });
	const settle = gsap.delayedCall(0.12, () => lean(0)).pause();

	let visible = false;
	let userPaused = false;
	let hovered = false;
	let focused = false;
	const sync = () => loop.paused(!visible || userPaused || hovered || focused);

	const st = ScrollTrigger.create({
		trigger: marquee,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => {
			visible = self.isActive;
			sync();
		},
		onUpdate: (self) => {
			const v = self.getVelocity();
			const dir = self.direction;
			const boost = 1 + Math.min(Math.abs(v) / 250, 7);
			gsap.to(loop, {
				timeScale: dir * boost,
				duration: 0.15,
				overwrite: true,
				onComplete: () => {
					gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' });
				},
			});
			lean(gsap.utils.clamp(-9, 9, -v / 300));
			settle.restart(true);
		},
	});

	// onToggle only fires on changes: pick up the state at creation (the section may already be on screen).
	visible = st.isActive;
	sync();

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

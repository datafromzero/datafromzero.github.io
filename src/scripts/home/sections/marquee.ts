import { gsap, ScrollTrigger } from '../gsap';

/** Marquee: loops forever, runs only while visible, speeds up and leans with scroll velocity. */
export function init(marquee: HTMLElement) {
	const inner = marquee.querySelector<HTMLElement>('.marquee-inner');
	if (!inner) return;

	const loop = gsap.to(inner, { xPercent: -50, repeat: -1, ease: 'none', duration: 30, paused: true });
	const lean = gsap.quickTo(inner, 'skewX', { duration: 0.4, ease: 'power3' });
	const settle = gsap.delayedCall(0.12, () => lean(0)).pause();

	ScrollTrigger.create({
		trigger: marquee,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
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
}

import { gsap } from '../gsap';

/** 03: panels wipe in from the bottom, their content rises, the progress pips grow. */
export function init(section: HTMLElement) {
	const modes = section.querySelector<HTMLElement>('.modes');
	const panels = gsap.utils.toArray<HTMLElement>('.panel', section);
	if (!modes) return;

	panels.forEach((panel, i) => {
		const kids = Array.from(panel.children);
		const mock = panel.querySelector('.mock');
		const tl = gsap.timeline({ scrollTrigger: { trigger: modes, start: 'top 75%', once: true }, delay: i * 0.12 });
		tl.fromTo(
			panel,
			{ clipPath: 'inset(100% 0% 0% 0% round 6px)' },
			{ clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.4, ease: 'expo.inOut' },
		).from(kids, { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.5);

		// A slow counter-drift of the mock inside the panel gives the wipe some depth.
		if (mock) {
			gsap.fromTo(
				mock,
				{ yPercent: 8 },
				{
					yPercent: -8,
					ease: 'none',
					scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
				},
			);
		}
	});

	gsap.from(section.querySelectorAll('.pips i'), {
		scaleX: 0,
		transformOrigin: 'left',
		stagger: 0.08,
		duration: 0.5,
		ease: 'power2.out',
		scrollTrigger: { trigger: modes, start: 'top 60%', once: true },
	});
}

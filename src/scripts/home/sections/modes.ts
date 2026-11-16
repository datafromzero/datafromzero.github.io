import { gsap, ScrollTrigger, initEarly, willChange } from '../gsap';
import type { Step } from './index';

/** 03: panels wipe in from the bottom, their content rises, the progress pips grow. */
export function init(section: HTMLElement): Step[] | void {
	const modes = section.querySelector<HTMLElement>('.modes');
	const panels = gsap.utils.toArray<HTMLElement>('.panel', section);
	if (!modes) return;

	const build = (panel: HTMLElement, i: number) => {
		const kids = Array.from(panel.children);
		const mock = panel.querySelector<HTMLElement>('.mock');
		const tl = gsap.timeline({ delay: i * 0.12 });
		tl.fromTo(
			panel,
			{ clipPath: 'inset(100% 0% 0% 0% round 6px)' },
			{ clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.4, ease: 'expo.inOut' },
		).from(kids, { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.5);
		// start values are read now, not in the frame where the wipe begins
		ScrollTrigger.create({ animation: initEarly(tl), trigger: modes, start: 'top 75%', once: true });

		// A slow counter-drift of the mock inside the panel gives the wipe some depth.
		if (mock) {
			gsap.fromTo(
				mock,
				{ yPercent: 8 },
				{
					yPercent: -8,
					ease: 'none',
					scrollTrigger: {
						trigger: panel,
						start: 'top bottom',
						end: 'bottom top',
						scrub: true,
						// the mock repaints every frame while it drifts: its own layer for exactly that long
						onToggle: (self) => willChange([mock], self.isActive ? 'transform' : null),
					},
				},
			);
		}
	};

	// One panel per task, then the pips: no single task is long.
	const [first, ...rest] = panels;
	if (first) build(first, 0);
	return [
		...rest.map((panel, i): Step => () => build(panel, i + 1)),
		() => {
			gsap.from(section.querySelectorAll('.pips i'), {
				scaleX: 0,
				transformOrigin: 'left',
				stagger: 0.08,
				duration: 0.5,
				ease: 'power2.out',
				scrollTrigger: { trigger: modes, start: 'top 60%', once: true },
			});
		},
	];
}

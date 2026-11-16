import { gsap, ScrollTrigger, prime, initEarly } from '../gsap';
import { nativeScrollTimeline } from '../native';

/** 01: each step lights up (and its counter ticks) as it is reached. */
export function init(section: HTMLElement) {
	const track = section.querySelector<HTMLElement>('.track');
	const fill = section.querySelector<HTMLElement>('.rail-fill');
	const steps = gsap.utils.toArray<HTMLElement>('.step', section);
	const cur = section.querySelector<HTMLElement>('.count-cur');
	if (!track || !fill) return;

	// The rail fill is a native scroll-driven CSS animation (home.css); GSAP scrubs it only as a fallback.
	if (!nativeScrollTimeline) {
		gsap.fromTo(
			fill,
			{ scaleY: 0 },
			{
				scaleY: 1,
				ease: 'none',
				scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: 0.5 },
			},
		);
	}

	let shown = 1;
	const setCount = (n: number) => {
		if (!cur || n === shown) return;
		shown = n;
		gsap.killTweensOf(cur);
		gsap
			.timeline()
			.to(cur, { yPercent: -100, opacity: 0, duration: 0.2, ease: 'power2.in' })
			.add(() => {
				cur.textContent = String(n).padStart(2, '0');
			})
			.fromTo(cur, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'dfz' });
	};

	// Reads first (one style recalculation), then the writes: no read follows a write.
	const parts = steps.map((step) => Array.from(step.querySelectorAll<HTMLElement>('.mono, h3, p')));
	const nodes = steps.map((step) => step.querySelector<HTMLElement>('.node'));
	prime(steps, ['opacity']);
	prime(parts.flat(), ['x']);
	prime(nodes.filter((n): n is HTMLElement => !!n), ['scale']);
	gsap.set(steps, { opacity: 0.25 });
	gsap.set(parts.flat(), { x: -14 });

	steps.forEach((step, i) => {
		const node = nodes[i];
		const tl = initEarly(
			gsap
				.timeline({ paused: true })
				.to(step, { opacity: 1, duration: 0.7, ease: 'dfz' }, 0)
				.to(parts[i], { x: 0, duration: 1, ease: 'dfz', stagger: 0.06 }, 0)
				.fromTo(node, { scale: 1 }, { scale: 1.25, duration: 0.9, ease: 'back.out(4)' }, 0),
		);

		ScrollTrigger.create({
			trigger: step,
			start: 'top 62%',
			onEnter: () => {
				step.classList.add('on');
				tl.play();
				setCount(i + 1);
			},
			onLeaveBack: () => {
				step.classList.remove('on');
				tl.reverse();
				setCount(Math.max(1, i));
			},
		});
	});
}

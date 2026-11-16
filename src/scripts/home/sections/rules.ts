import { gsap } from '../gsap';

/** Section hairlines draw in from the left as they arrive. */
export function init(rule: HTMLElement) {
	gsap.from(rule, {
		scaleX: 0,
		duration: 1.6,
		ease: 'expo.inOut',
		scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
	});
}

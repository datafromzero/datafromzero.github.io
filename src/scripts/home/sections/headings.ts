import { gsap } from '../gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

/** Word-by-word mask reveal. SplitText labels the heading for assistive tech (aria: auto). */
export function init(heading: HTMLElement) {
	const split = SplitText.create(heading, { type: 'words', mask: 'words', wordsClass: 'sw' });
	gsap.from(split.words, {
		yPercent: 115,
		skewY: 5,
		duration: 1.2,
		ease: 'expo.out',
		stagger: 0.07,
		scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
	});
}

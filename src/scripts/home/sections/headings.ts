import { gsap } from '../gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

/**
 * Word-by-word mask reveal, played once. SplitText labels the heading for assistive tech (label restored
 * from data-label). When the reveal has finished the split is reverted: the heading is plain text again
 * (no word wrappers, no clipping masks) and keeps its aria-label, so it costs nothing afterwards.
 */
export function init(heading: HTMLElement) {
	const label = heading.dataset.label;
	const split = SplitText.create(heading, { type: 'words', mask: 'words', wordsClass: 'sw' });
	// SplitText builds its label from textContent, which loses the line break: use the build-time one.
	if (label) heading.setAttribute('aria-label', label);
	gsap.from(split.words, {
		yPercent: 115,
		skewY: 5,
		duration: 1.2,
		ease: 'expo.out',
		stagger: 0.07,
		scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
		onComplete: () => {
			split.revert();
			if (label) heading.setAttribute('aria-label', label);
		},
	});
}

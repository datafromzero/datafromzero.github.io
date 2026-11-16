import { gsap, ScrollTrigger, prime, initEarly, initAgainOnRefresh, willChange } from '../gsap';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import type { Step } from './index';

gsap.registerPlugin(SplitText, DrawSVGPlugin);

const tall = matchMedia('(prefers-reduced-motion: no-preference) and (scripting: enabled) and (min-height: 600px)');

/** 04: the mark assembles (disc, void, layers), then the headline and button arrive, while the stage holds. */
export function init(section: HTMLElement, onCleanup: (fn: () => void) => void): Step[] | void {
	const mark = section.querySelector<SVGElement>('.endmark');
	const heading = section.querySelector<HTMLElement>('h2');
	const label = section.querySelector('.mono');
	const button = section.querySelector('.magnet');
	if (!mark || !heading) return;

	const bands = gsap.utils.toArray<SVGPathElement>('.bands path', mark);
	const shapes = mark.querySelectorAll('.disc, .void');
	prime(shapes, ['scale']); // reads before the first write
	gsap.set(shapes, { svgOrigin: '50 50' });

	// Built first, linked to the scroll last (see the final step), so it is complete and initialized early
	// by the time the reader can move it.
	const tl = gsap
		.timeline({ defaults: { ease: 'none' } })
		.from(mark.querySelector('.disc'), { scale: 0, duration: 1.2, ease: 'expo.out' })
		.from(mark.querySelector('.void'), { scaleY: 0, scaleX: 0.7, duration: 1, ease: 'expo.out' }, '-=0.6')
		// 102%: Firefox can measure path length slightly short (see branches.ts)
		.fromTo(bands, { drawSVG: '0%', opacity: 0 }, { drawSVG: '102%', opacity: 1, duration: 0.7, stagger: 0.18, ease: 'power2.out' }, '-=0.3');

	// The rest are steps (a task each), so no single task is long.
	return [
		() => {
			const split = SplitText.create(heading, { type: 'words', mask: 'words', wordsClass: 'sw' });
			if (heading.dataset.label) heading.setAttribute('aria-label', heading.dataset.label);
			tl.from(label, { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.2')
				.from(split.words, { yPercent: 115, skewY: 6, duration: 1.1, stagger: 0.12, ease: 'expo.out' }, '-=0.4')
				.from(button?.querySelector('.btn') ?? button, { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, '-=0.3')
				.to({}, { duration: 0.6 });
		},
		() => {
			ScrollTrigger.create({
				animation: tl,
				trigger: section,
				start: () => (tall.matches ? 'top top' : 'top 80%'),
				end: () => (tall.matches ? 'bottom bottom' : 'center 55%'),
				scrub: 0.7,
				// the mark repaints every frame while it assembles: its own layer for exactly that long
				onToggle: (self) => willChange([mark], self.isActive ? 'transform' : null),
			});
			// path lengths depend on size: re-measure after a refresh, in a setup slot (see initAgainOnRefresh)
			onCleanup(initAgainOnRefresh(tl));
			initEarly(tl);
		},
	];
}

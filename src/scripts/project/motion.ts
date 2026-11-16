// Project pages: the roadmap map on /start/ and one consistent heading reveal everywhere else. One chunk;
// the map has its own (DrawSVG) and loads only when the map exists. Reduced motion never gets here.
import { gsap } from '../home/gsap';
import { init as heading } from '../home/sections/headings';

export function init() {
	const mm = gsap.matchMedia();
	mm.add('(prefers-reduced-motion: no-preference)', () => {
		const map = document.querySelector<HTMLElement>('.roadmap');
		if (map) import('./roadmap').then((m) => m.init(map)).catch(() => {});

		// Headings already in view stay as they are (no flash after load); the rest reveal as they arrive.
		document.querySelectorAll<HTMLElement>('main h2').forEach((h) => {
			if (h.getBoundingClientRect().top > innerHeight * 0.9) heading(h);
		});
	});
}

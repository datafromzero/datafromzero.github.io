import { gsap, ScrollTrigger, prime, initEarly, initAgainOnRefresh, willChange } from '../gsap';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import type { Step } from './index';
import { afterNextFrame } from '../yield';
import type * as Morph from '../fx/morph';

gsap.registerPlugin(SplitText, DrawSVGPlugin);

let morph: typeof Morph | undefined;
/** The layer morph is its own chunk (MorphSVG), fetched when the section is near. Without it the mark draws as before. */
export const load = () =>
	import('../fx/morph').then((m) => {
		morph = m;
	});

const tall = matchMedia('(prefers-reduced-motion: no-preference) and (scripting: enabled) and (min-height: 600px)');

/** 05: the mark assembles (disc, void, layers), then the headline and button arrive, while the stage holds. */
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
	const tl = gsap.timeline({ defaults: { ease: 'none' } }).from(mark.querySelector('.disc'), { scale: 0, duration: 1.2, ease: 'dfz' });
	// With MorphSVG the void and the bands morph into the logo (fx/morph.ts) as a timeline of their own, played
	// when the scroll reaches the disc (see the last step); without it they draw as before.
	const parts = morph?.layers(mark);
	if (!parts?.length) {
		tl.from(mark.querySelector('.void'), { scaleY: 0, scaleX: 0.7, duration: 1, ease: 'dfz' }, '-=0.6')
			// 102%: Firefox can measure path length slightly short (see branches.ts)
			.fromTo(bands, { drawSVG: '0%', opacity: 0 }, { drawSVG: '102%', opacity: 1, duration: 0.7, stagger: 0.18, ease: 'power2.out' }, '-=0.3');
	}

	// The rest are steps (a task each), so no single task is long.
	return [
		() => {
			const split = SplitText.create(heading, { type: 'words', mask: 'words', wordsClass: 'sw' });
			if (heading.dataset.label) heading.setAttribute('aria-label', heading.dataset.label);
			tl.from(label, { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.2')
				.from(split.words, { yPercent: 115, skewY: 6, duration: 1.1, stagger: 0.12, ease: 'dfz' }, '-=0.4')
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
		// the morph: each piece is warmed up in a frame slot of its own (MorphSVG converts and aligns a path
		// when it first renders), then joined into one timeline that the scroll plays once the disc is there
		() => {
			if (!parts?.length) return;
			let dead = false;
			let layers: gsap.core.Timeline | undefined;
			onCleanup(() => {
				dead = true;
				tl.eventCallback('onUpdate', null);
				layers?.kill();
				parts.forEach(([t]) => t.kill());
			});
			let on = false;
			const AT = 0.7;
			const follow = () => {
				const now = tl.time() >= AT;
				if (now === on) return;
				on = now;
				if (now) layers?.play();
				else layers?.reverse();
			};
			void (async () => {
				for (const [t] of parts) {
					await afterNextFrame();
					if (dead) return;
					t.progress(1, true).progress(0, true);
				}
				await afterNextFrame();
				if (dead) return;
				layers = gsap.timeline({ paused: true });
				for (const [t, at] of parts) layers.add(t.paused(false), at);
				tl.eventCallback('onUpdate', follow);
				follow();
				// print the finished mark, whatever the scroll position
				let at = 0;
				const before = () => ((at = layers?.progress() ?? 0), layers?.progress(1, true));
				const after = () => layers?.progress(at, true);
				addEventListener('beforeprint', before);
				addEventListener('afterprint', after);
				onCleanup(() => {
					removeEventListener('beforeprint', before);
					removeEventListener('afterprint', after);
				});
			})();
		},
	];
}

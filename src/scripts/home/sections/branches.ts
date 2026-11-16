import { gsap, ScrollTrigger, prime, initEarly, initAgainOnRefresh, willChange } from '../gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import type { Step } from './index';
import type * as Pulses from '../fx/pulses';

gsap.registerPlugin(DrawSVGPlugin);

let pulses: typeof Pulses | undefined;
/** The traveling lights are their own chunk (MotionPath), fetched when the section is near. */
export const load = () =>
	import('../fx/pulses').then((m) => {
		pulses = m;
	});

const tall = matchMedia('(prefers-reduced-motion: no-preference) and (scripting: enabled) and (min-height: 600px)');

// DrawSVG end states use 102%: Firefox can measure path length slightly short and leave a gap at 100%.
/** 02: one scrubbed timeline builds the tree while the sticky stage holds (CSS), or plays in flow on short screens. */
export function init(section: HTMLElement, onCleanup: (fn: () => void) => void): Step[] | void {
	const tree = section.querySelector<SVGSVGElement>('.tree svg');
	const trunk = section.querySelector<SVGPathElement>('.tree .trunk');
	const branches = gsap.utils.toArray<SVGPathElement>('.tree .br', section);
	const fork = section.querySelector('.tree .fork');
	const leaves = gsap.utils.toArray<SVGCircleElement>('.tree .leaf', section);
	const rings = gsap.utils.toArray<SVGCircleElement>('.tree .ring', section);
	const labels = gsap.utils.toArray<HTMLElement>('.labels li', section);
	if (!trunk || !fork) return;

	// Reads first, then the writes: one style recalculation instead of one per element.
	prime([fork, ...leaves, ...rings], ['scale']);
	prime(labels, ['y', 'opacity']);
	gsap.set([trunk, ...branches], { drawSVG: '0%' });
	gsap.set([fork, ...leaves], { scale: 0, transformOrigin: '50% 50%' });
	gsap.set(rings, { transformOrigin: '50% 50%' });
	gsap.set(labels, { opacity: 0, y: 18 });

	// Built first, linked to the scroll last (see the final step), so it is complete and initialized early
	// by the time the reader can move it.
	const tl = gsap.timeline();

	const draw = 3;
	const step = 0.18;
	tl.to(trunk, { drawSVG: '102%', duration: 1.4, ease: 'power1.inOut' })
		.to(fork, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '-=0.35')
		.addLabel('branches', '-=0.1')
		.to(branches, { drawSVG: '102%', duration: draw, ease: 'power2.inOut', stagger: step }, 'branches');

	// The rest are steps (a task each), so no single task is long.
	return [
		() => {
			leaves.forEach((leaf, i) => {
				const at = `branches+=${draw + step * i - 0.25}`;
				tl.to(leaf, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at)
					.fromTo(rings[i], { scale: 1, opacity: 0.8 }, { scale: 3.4, opacity: 0, duration: 0.9, ease: 'power2.out' }, at)
					.to(labels[i], { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, `${at}+=0.05`);
			});
			tl.to({}, { duration: 0.8 }); // hold the finished tree for a beat before the stage releases
		},
		() => {
			ScrollTrigger.create({
				animation: tl,
				trigger: section,
				start: () => (tall.matches ? 'top top' : 'top 70%'),
				end: () => (tall.matches ? 'bottom bottom' : 'bottom 60%'),
				scrub: 0.7,
				// the tree repaints every frame while it draws: give it its own layer for exactly that long
				onToggle: (self) => tree && willChange([tree], self.isActive ? 'transform' : null),
			});
			// path lengths depend on size: re-measure after a refresh, in a setup slot (see initAgainOnRefresh)
			onCleanup(initAgainOnRefresh(tl));
			initEarly(tl);
		},
		// the lights get a task of their own: MotionPath measures every path when it is first rendered
		() => {
			if (tree && pulses) {
				// every branch has drawn at (label + draw time + the last stagger)
				onCleanup(pulses.init({ section, svg: tree, trunk, branches, tl, drawnAt: tl.labels.branches + draw + step * (branches.length - 1) }));
			}
		},
	];
}

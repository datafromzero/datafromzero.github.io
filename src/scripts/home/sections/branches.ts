import { gsap } from '../gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

const tall = matchMedia('(prefers-reduced-motion: no-preference) and (scripting: enabled) and (min-height: 600px)');

// DrawSVG end states use 102%: Firefox can measure path length slightly short and leave a gap at 100%.
/** 02: one scrubbed timeline builds the tree while the sticky stage holds (CSS), or plays in flow on short screens. */
export function init(section: HTMLElement) {
	const trunk = section.querySelector<SVGPathElement>('.tree .trunk');
	const branches = gsap.utils.toArray<SVGPathElement>('.tree .br', section);
	const fork = section.querySelector('.tree .fork');
	const leaves = gsap.utils.toArray<SVGCircleElement>('.tree .leaf', section);
	const rings = gsap.utils.toArray<SVGCircleElement>('.tree .ring', section);
	const labels = gsap.utils.toArray<HTMLElement>('.labels li', section);
	if (!trunk || !fork) return;

	gsap.set([trunk, ...branches], { drawSVG: '0%' });
	gsap.set([fork, ...leaves], { scale: 0, transformOrigin: '50% 50%' });
	gsap.set(rings, { transformOrigin: '50% 50%' });
	gsap.set(labels, { opacity: 0, y: 18 });

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: section,
			start: () => (tall.matches ? 'top top' : 'top 70%'),
			end: () => (tall.matches ? 'bottom bottom' : 'bottom 60%'),
			scrub: 0.7,
			invalidateOnRefresh: true,
		},
	});

	const draw = 3;
	const step = 0.18;
	tl.to(trunk, { drawSVG: '102%', duration: 1.4, ease: 'power1.inOut' })
		.to(fork, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '-=0.35')
		.addLabel('branches', '-=0.1')
		.to(branches, { drawSVG: '102%', duration: draw, ease: 'power2.inOut', stagger: step }, 'branches');

	leaves.forEach((leaf, i) => {
		const at = `branches+=${draw + step * i - 0.25}`;
		tl.to(leaf, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at)
			.fromTo(rings[i], { scale: 1, opacity: 0.8 }, { scale: 3.4, opacity: 0, duration: 0.9, ease: 'power2.out' }, at)
			.to(labels[i], { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, `${at}+=0.05`);
	});
	tl.to({}, { duration: 0.8 }); // hold the finished tree for a beat before the stage releases
}

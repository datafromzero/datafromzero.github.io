// /start/: the static roadmap map draws itself when it nears the viewport. Rails draw (DrawSVG), the stage
// markers pop, the stage boxes and then the lesson rows arrive one after another. The SVG and the text list
// below it are complete without this; the end state here is the markup exactly (inline styles are cleared).
import { gsap } from '../home/gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

export function init(figure: HTMLElement) {
	const rails = gsap.utils.toArray<SVGPathElement>('.rails path', figure);
	const markers = gsap.utils.toArray<SVGCircleElement>('.rails circle', figure);
	const stages = gsap.utils.toArray<SVGGElement>('.stg', figure);
	const rows = gsap.utils.toArray<SVGElement>('.les', figure);
	const fork = figure.querySelector('.fork');
	const group = figure.querySelector('.rails');
	if (!group) return;

	// The CSS hides the parts until this takes over (with a timed fallback if it never does).
	figure.classList.add('live');

	const play = () => {
		const tl = gsap.timeline({
			defaults: { ease: 'dfz' },
			onComplete: () => void gsap.set([group, ...rails, ...markers, ...stages, ...rows, fork], { clearProps: 'all' }),
		});
		gsap.set([group, fork, ...stages, ...rows], { opacity: 0 });
		gsap.set(rails, { drawSVG: '0%' });
		gsap.set(markers, { scale: 0, transformOrigin: '50% 50%' });
		gsap.set(group, { opacity: 1 });
		tl.to(rails, { drawSVG: '100%', duration: 1.4, stagger: 0.18, ease: 'power2.inOut' }, 0)
			.to(markers, { scale: 1, duration: 0.5, stagger: 0.16, ease: 'back.out(3)' }, 0.15)
			.fromTo(stages, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.2)
			.fromTo(rows, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.05 }, 0.6)
			.to(fork, { opacity: 1, duration: 0.6 }, 0.9);
	};

	// near the viewport (a little before it is in view); if it already is, the CSS hiding is still in place
	const io = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			io.disconnect();
			play();
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);
	io.observe(figure);
}

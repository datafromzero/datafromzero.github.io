// Deferred homepage motion: nav, scroll progress, hero scroll-out, pointer effects, and the lazy
// per-section timelines. Everything is inside gsap.matchMedia(), so reduced motion gets none of it
// (and in practice never even loads this chunk).
import { gsap, ScrollTrigger } from './gsap';
import { yieldToMain } from './yield';
import { nativeScrollTimeline } from './native';

type Ctx = gsap.Context;
type SectionModule = { init: (el: HTMLElement, onCleanup: (fn: () => void) => void) => void };

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);

/** Create a section's timelines only when it is within one viewport of the screen. */
function lazy(ctx: Ctx, selector: string, load: () => Promise<SectionModule>, cleanups: (() => void)[]) {
	const els = document.querySelectorAll<HTMLElement>(selector);
	if (!els.length) return;
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				io.unobserve(entry.target);
				const el = entry.target as HTMLElement;
				load()
					.then(async (m) => {
						await yieldToMain();
						ctx.add(() => m.init(el, (fn) => cleanups.push(fn)));
					})
					.catch(() => {});
			}
		},
		{ rootMargin: '100% 0px 100% 0px' },
	);
	els.forEach((el) => io.observe(el));
	cleanups.push(() => io.disconnect());
}

export function init() {
	const mm = gsap.matchMedia();

	mm.add('(prefers-reduced-motion: no-preference)', (ctx: Ctx) => {
		const cleanups: (() => void)[] = [];
		const hero = $('.hero');
		const head = $('.site-head');
		if (!hero || !head) return;

		// Scroll progress hairline: native scroll-driven CSS animation where supported, ScrollTrigger otherwise.
		if (!nativeScrollTimeline) {
			gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
		}

		// Hero drifts away as the page scrolls (design/README.md §5): one scrubbed timeline.
		gsap
			.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
			})
			.to('.dots', { yPercent: 12, scale: 1.06 }, 0)
			.to('.hero-inner', { yPercent: -14, opacity: 0.2 }, 0)
			.to('.stage', { yPercent: -10, scale: 0.88, opacity: 0.4 }, 0)
			.to('.scroll-hint', { opacity: 0, duration: 0.15 }, 0);

		// Nav: hides while reading down, returns on any upward scroll or keyboard focus.
		const navY = gsap.quickTo(head, 'yPercent', { duration: 0.6, ease: 'power3.out' });
		let hidden = false;
		const setHidden = (h: boolean) => {
			if (h !== hidden) {
				hidden = h;
				navY(h ? -110 : 0);
			}
		};
		ScrollTrigger.create({
			start: 0,
			end: 'max',
			onUpdate: (self) => setHidden(self.direction === 1 && self.scroll() > 240),
		});
		const onFocus = () => setHidden(false);
		head.addEventListener('focusin', onFocus);
		cleanups.push(() => head.removeEventListener('focusin', onFocus));

		// Section timelines, created on demand and code-split.
		lazy(ctx, 'h2[data-split=""]:not(.end h2)', () => import('./sections/headings'), cleanups);
		lazy(ctx, '.core', () => import('./sections/core'), cleanups);
		lazy(ctx, '.branch', () => import('./sections/branches'), cleanups);
		lazy(ctx, '#modes', () => import('./sections/modes'), cleanups);
		lazy(ctx, '.marquee', () => import('./sections/marquee'), cleanups);
		lazy(ctx, '.end', () => import('./sections/begin'), cleanups);
		lazy(ctx, '.rule', () => import('./sections/rules'), cleanups);

		// Fonts change text metrics once: re-measure a single time.
		document.fonts?.ready.then(() => ScrollTrigger.refresh());

		return () => cleanups.forEach((fn) => fn());
	});

	// Pointer effects: fine pointers only (mouse and trackpad), never touch.
	mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
		const hero = $('.hero');
		const dots = $('.dots');
		if (!hero || !dots) return;

		const gx = gsap.quickTo(dots, 'x', { duration: 1.2, ease: 'power3' });
		const gy = gsap.quickTo(dots, 'y', { duration: 1.2, ease: 'power3' });
		// The glow center eases toward the pointer; only style writes happen per frame.
		const glow = { x: 0, y: 0 };
		const apply = () => {
			dots.style.setProperty('--mx', `${glow.x}px`);
			dots.style.setProperty('--my', `${glow.y}px`);
		};
		const mx = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3', onUpdate: apply });
		const my = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3', onUpdate: apply });

		// Measure once (document coordinates), refresh with ScrollTrigger; pointermove only reads event data.
		let ox = 0;
		let oy = 0;
		const measure = () => {
			const r = dots.getBoundingClientRect();
			ox = r.left + scrollX - Number(gsap.getProperty(dots, 'x'));
			oy = r.top + scrollY - Number(gsap.getProperty(dots, 'y'));
		};
		measure();
		ScrollTrigger.addEventListener('refresh', measure);

		const onMove = (e: PointerEvent) => {
			gx((e.clientX / innerWidth - 0.5) * -24);
			gy((e.clientY / innerHeight - 0.5) * -24);
			mx(e.pageX - ox);
			my(e.pageY - oy);
			dots.classList.add('is-near');
		};
		const onLeave = () => dots.classList.remove('is-near');
		hero.addEventListener('pointermove', onMove, { passive: true });
		hero.addEventListener('pointerleave', onLeave);

		// Magnetic buttons.
		const off: (() => void)[] = [];
		document.querySelectorAll<HTMLElement>('.magnet, .ctas .btn').forEach((m) => {
			const qx = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'elastic.out(1,.4)' });
			const qy = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'elastic.out(1,.4)' });
			let r: DOMRect | null = null;
			const enter = () => (r = m.getBoundingClientRect());
			const move = (e: PointerEvent) => {
				if (!r) r = m.getBoundingClientRect();
				qx((e.clientX - r.left - r.width / 2) * 0.35);
				qy((e.clientY - r.top - r.height / 2) * 0.35);
			};
			const leave = () => {
				r = null;
				qx(0);
				qy(0);
			};
			m.addEventListener('pointerenter', enter);
			m.addEventListener('pointermove', move, { passive: true });
			m.addEventListener('pointerleave', leave);
			off.push(() => {
				m.removeEventListener('pointerenter', enter);
				m.removeEventListener('pointermove', move);
				m.removeEventListener('pointerleave', leave);
			});
		});

		return () => {
			hero.removeEventListener('pointermove', onMove);
			hero.removeEventListener('pointerleave', onLeave);
			ScrollTrigger.removeEventListener('refresh', measure);
			dots.classList.remove('is-near');
			dots.style.removeProperty('--mx');
			dots.style.removeProperty('--my');
			off.forEach((fn) => fn());
		};
	});
}

// Deferred homepage motion: nav, scroll progress, hero scroll-out, pointer effects, and the section
// timelines. Everything is inside gsap.matchMedia(), so reduced motion gets none of it (and in practice
// never even loads this chunk).
//
// Frame budget (SPEC §12, 8.3 ms at 120 Hz): per-frame work is O(1) and touches only transform and
// opacity. Sizes are measured once and again on ScrollTrigger's refresh, never inside a tween, and writes
// happen in GSAP's own rAF tick. Setup work (the section timelines) is split into one task per section and
// runs right after a presented frame, first for sections near the screen, then, while the reader is
// not scrolling, for the rest, so scrolling never pays for it.
import { gsap, ScrollTrigger, willChange } from './gsap';
import { afterNextFrame } from './yield';
import { nativeScrollTimeline } from './native';
import type { SectionInit, Step } from './sections';

type Ctx = gsap.Context;

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);

/** One unit of setup work: a section's init, or one of the later steps it asked for (see SectionInit). */
interface Job {
	el: HTMLElement;
	run: () => void | Step[];
}

/** After the CSS intro (about 3 s) the main thread is idle: start building the sections that are still far away. */
const WARM_AT_MS = 3300;
/** Do not start background setup while the reader scrolled this recently. */
const SCROLL_QUIET_MS = 160;
/** Sections that are cheap enough to share a frame slot (headings, rules). */
const SLOT_BUDGET_MS = 6;

/**
 * Builds each section's timelines in its own task. A section near the screen (IntersectionObserver, one
 * viewport of margin) goes first; the others follow in document order once the intro is over and scrolling
 * has paused. One shared, code-split module holds every section.
 */
function sections(ctx: Ctx, cleanups: (() => void)[]) {
	const jobs: Job[] = [];
	// Resolved lazily: the module is fetched when the first job is due, not before.
	let mod: Record<string, SectionInit> = {};
	const add = (selector: string, name: string) =>
		document.querySelectorAll<HTMLElement>(selector).forEach((el) => jobs.push({ el, run: () => mod[name]?.(el, (fn) => cleanups.push(fn)) }));
	add('h2[data-split=""]:not(.end h2)', 'headings');
	add('.core', 'core');
	add('.branch', 'branches');
	add('#modes', 'modes');
	add('.marquee', 'marquee');
	add('.end', 'begin');
	add('.rule', 'rules');
	// document order, so the nearest section is built first when nothing is urgent
	jobs.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
	if (!jobs.length) return;

	const near = new Set<HTMLElement>(); // within one viewport of the screen: build now
	let dead = false;
	let warm = false;
	let pumping = false;
	let lastScroll = -Infinity;
	const onScroll = () => (lastScroll = performance.now());
	addEventListener('scroll', onScroll, { passive: true });

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				io.unobserve(entry.target);
				near.add(entry.target as HTMLElement);
			}
			void pump();
		},
		{ rootMargin: '100% 0px 100% 0px' },
	);
	jobs.forEach((j) => io.observe(j.el));

	const warmTimer = setTimeout(() => {
		warm = true;
		void pump();
	}, Math.max(0, WARM_AT_MS - performance.now()));

	cleanups.push(() => {
		dead = true;
		clearTimeout(warmTimer);
		io.disconnect();
		removeEventListener('scroll', onScroll);
	});

	async function pump() {
		if (pumping) return;
		pumping = true;
		try {
			mod = (await import('./sections')).sections;
			// the next job: a near one, else (intro over, reader not scrolling) the first in document order
			const pick = () => {
				const i = jobs.findIndex((j) => near.has(j.el));
				return i >= 0 ? i : warm && performance.now() - lastScroll >= SCROLL_QUIET_MS ? 0 : -1;
			};
			while (!dead && jobs.length) {
				if (pick() < 0) {
					if (!warm) break;
					await afterNextFrame(); // the reader is scrolling: stay out of the way
					continue;
				}
				await afterNextFrame();
				// A frame slot may hold several light jobs, but never more than a few milliseconds of work.
				const t0 = performance.now();
				let i: number;
				while (!dead && (i = pick()) >= 0 && performance.now() - t0 < SLOT_BUDGET_MS) {
					const [job] = jobs.splice(i, 1);
					// A section may return later steps (heavy ones are split): each runs in a frame slot of its own,
					// ahead of the other sections, so a half-built section is completed first.
					const steps = ctx.add(job.run) as void | Step[];
					if (steps?.length) {
						jobs.unshift(...steps.map((step) => ({ el: job.el, run: step })));
						break;
					}
				}
			}
		} catch {
			// Motion is an enhancement: the page is already complete without it.
		} finally {
			pumping = false;
		}
	}
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

		// Hero drifts away as the page scrolls (design/README.md §5): one scrubbed timeline. Its layers are
		// promoted once the intro is over and only while the hero is on screen, so the scrub never repaints
		// them (and promotion does not land in the middle of the CSS entrance).
		const heroLayers = [$('.dots'), $('.hero-inner'), $('.stage')].filter((e): e is HTMLElement => !!e);
		let heroActive = false;
		let introDone = false;
		const armHero = () => willChange(heroLayers, heroActive && introDone ? 'transform, opacity' : null);
		const introTimer = setTimeout(() => {
			introDone = true;
			armHero();
		}, Math.max(0, WARM_AT_MS - performance.now()));
		cleanups.push(() => {
			clearTimeout(introTimer);
			willChange(heroLayers, null);
		});
		gsap
			.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: hero,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
					onToggle: (self) => {
						heroActive = self.isActive;
						armHero();
					},
				},
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

		sections(ctx, cleanups);

		// Fonts change text metrics once: re-measure a single time.
		document.fonts?.ready.then(() => ScrollTrigger.refresh());

		return () => cleanups.forEach((fn) => fn());
	});

	// Pointer effects: fine pointers only (mouse and trackpad), never touch.
	mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
		const hero = $('.hero');
		const dots = $('.dots');
		if (!hero || !dots) return;

		// The lit dots are a small window (.spot, masked once by a static gradient) onto a copy of the dot
		// grid (.spot-grid) that is moved the opposite way so it stays registered with the real grid.
		// Both move with `transform` only: no mask is repainted, whatever the number of dots.
		const SPOT = 340;
		const spot = document.createElement('i');
		const grid = document.createElement('i');
		spot.className = 'spot';
		grid.className = 'spot-grid';
		spot.append(grid);
		dots.append(spot);

		const gx = gsap.quickTo(dots, 'x', { duration: 1.2, ease: 'power3' });
		const gy = gsap.quickTo(dots, 'y', { duration: 1.2, ease: 'power3' });
		// The glow center eases toward the pointer; one transform write per element per frame.
		const glow = { x: 0, y: 0 };
		let lx = NaN;
		let ly = NaN;
		const apply = () => {
			const x = Math.round(glow.x - SPOT / 2);
			const y = Math.round(glow.y - SPOT / 2);
			if (x === lx && y === ly) return;
			lx = x;
			ly = y;
			spot.style.transform = `translate3d(${x}px,${y}px,0)`;
			grid.style.transform = `translate3d(${-x}px,${-y}px,0)`;
		};
		const mx = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3' });
		const my = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3', onUpdate: apply }); // after mx in the same tick

		// Measure once (untransformed layout, document coordinates) and again on ScrollTrigger's refresh.
		let ox = 0;
		let oy = 0;
		const measure = () => {
			const r = hero.getBoundingClientRect();
			ox = r.left + scrollX + dots.offsetLeft;
			oy = r.top + scrollY + dots.offsetTop;
			grid.style.width = `${dots.offsetWidth}px`;
			grid.style.height = `${dots.offsetHeight}px`;
		};
		measure();
		ScrollTrigger.addEventListener('refresh', measure);

		let near = false;
		const layers = [spot, grid];
		const onEnter = () => {
			near = true;
			willChange(layers, 'transform');
			dots.classList.add('is-near');
		};
		const onFaded = () => {
			if (!near) willChange(layers, null);
		};
		spot.addEventListener('transitionend', onFaded);
		const onMove = (e: PointerEvent) => {
			if (!near) onEnter();
			gx((e.clientX / innerWidth - 0.5) * -24);
			gy((e.clientY / innerHeight - 0.5) * -24);
			mx(e.pageX - ox);
			my(e.pageY - oy);
		};
		const onLeave = () => {
			near = false;
			dots.classList.remove('is-near');
		};
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
			spot.removeEventListener('transitionend', onFaded);
			ScrollTrigger.removeEventListener('refresh', measure);
			dots.classList.remove('is-near');
			willChange(layers, null);
			spot.remove();
			off.forEach((fn) => fn());
		};
	});
}

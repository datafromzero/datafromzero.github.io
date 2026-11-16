import { gsap, ScrollTrigger } from '../gsap';
import { tabsOf, type Source } from '../tabs';
import type { Flip as FlipPlugin } from 'gsap/Flip';

let Flip: typeof FlipPlugin | undefined;
/** Flip moves the tab underline; its own chunk, fetched when the section is near. */
export const load = () =>
	import('gsap/Flip').then((m) => {
		gsap.registerPlugin(m.Flip);
		Flip = m.Flip;
	});

/** How long each tool stays on screen while the tabs cycle by themselves. */
const CYCLE_MS = 3600;

/**
 * 03: on every tab change the underline slides (Flip, transforms only), the code fades up and the result
 * rows pulse, because the answer is the same each time. The tabs cycle by themselves only while the section
 * is on screen, and stop for good once the reader touches the widget (click, key, focus, hover); a small
 * Pause / Play button controls the cycle (WCAG 2.2.2). Reduced motion never loads this: the tabs still work.
 */
export function init(section: HTMLElement, onCleanup: (fn: () => void) => void) {
	const root = section.querySelector<HTMLElement>('[data-tabs]');
	const t = root ? tabsOf(root) : undefined;
	if (!root || !t) return;
	const rows = gsap.utils.toArray<HTMLElement>('.result tbody tr', section);
	const toggle = section.querySelector<HTMLButtonElement>('.tools-toggle');

	let state: ReturnType<typeof FlipPlugin.getState> | undefined;
	const before = () => {
		state = Flip?.getState(t.bar);
	};
	const after = () => {
		if (state && Flip) Flip.from(state, { duration: 0.5, ease: 'power3.inOut' });
		state = undefined;
		gsap.fromTo(t.panels[t.index], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'opacity,transform' });
		gsap.fromTo(rows, { opacity: 0.35 }, { opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.2, clearProps: 'opacity' });
	};
	t.before.add(before);
	t.after.add(after);

	// Auto-cycle: runs while on screen, unless the reader paused it or used the tabs.
	let onScreen = false;
	let stopped = false;
	let timer = 0;
	const render = () => {
		if (!toggle) return;
		toggle.setAttribute('aria-pressed', String(stopped));
		toggle.textContent = (stopped ? toggle.dataset.play : toggle.dataset.pause) ?? '';
	};
	const sync = () => {
		clearInterval(timer);
		if (onScreen && !stopped) timer = window.setInterval(() => t.select(t.index + 1, 'auto'), CYCLE_MS);
	};
	const stop = () => {
		if (stopped) return;
		stopped = true;
		render();
		sync();
	};
	const st = ScrollTrigger.create({
		trigger: section,
		start: 'top 70%',
		end: 'bottom 20%',
		onToggle: (self) => {
			onScreen = self.isActive;
			sync();
		},
	});
	const onUser = (_: number, source: Source) => {
		if (source === 'user') stop();
	};
	t.after.add(onUser);
	const canHover = matchMedia('(hover: hover)').matches;
	const events = ['pointerdown', 'keydown', 'focusin', ...(canHover ? ['pointerenter'] : [])];
	events.forEach((type) => root.addEventListener(type, stop));
	const onToggle = () => {
		stopped = !stopped;
		render();
		if (!stopped) t.select(t.index + 1, 'auto'); // resume visibly, then every CYCLE_MS
		sync();
	};
	if (toggle) {
		toggle.hidden = false;
		toggle.addEventListener('click', onToggle);
	}
	render();

	onCleanup(() => {
		clearInterval(timer);
		st.kill();
		t.before.delete(before);
		t.after.delete(after);
		t.after.delete(onUser);
		events.forEach((type) => root.removeEventListener(type, stop));
		if (toggle) {
			toggle.hidden = true;
			toggle.removeEventListener('click', onToggle);
		}
	});
}

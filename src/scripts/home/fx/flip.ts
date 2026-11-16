// 03: a Study or Reference panel enlarges on activation. Flip animates the grid from its old layout to the
// new one (the open panel widens, the other gives way, the section grows and pushes the page smoothly).
// The button is a real <button aria-expanded>; without this module it stays hidden and both panels are
// the plain two-column layout.
import { gsap, ScrollTrigger } from '../gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const MOCK_DONE = '#000';
const MOCK_TODO = '#ccc';
const FG = '#f4f4f4';
const MUTE = '#aaa';

export function init(section: HTMLElement): () => void {
	const modes = section.querySelector<HTMLElement>('.modes');
	const panels = gsap.utils.toArray<HTMLElement>('.panel', section);
	if (!modes || !panels.length) return () => {};

	/** What the enlarged panel shows off: the lesson advances (Study), the rows are scanned (Reference). */
	const demo = (panel: HTMLElement, open: boolean) => {
		const pips = gsap.utils.toArray<HTMLElement>('.pips i:not(.done)', panel);
		const rows = gsap.utils.toArray<HTMLElement>('.mock > div:not(.f)', panel);
		gsap.killTweensOf([...pips, ...rows]);
		if (pips.length) {
			gsap.to(pips, open ? { backgroundColor: MOCK_DONE, duration: 0.3, stagger: 0.22, delay: 0.5 } : { backgroundColor: MOCK_TODO, duration: 0.3, stagger: 0.05 });
		}
		if (rows.length && open) {
			gsap.fromTo(rows, { color: MUTE }, { color: FG, duration: 0.3, stagger: 0.18, delay: 0.5, yoyo: true, repeat: 1, repeatDelay: 0.1, clearProps: 'color' });
		}
	};

	let settle: gsap.core.Tween | undefined;
	const toggle = (panel: HTMLElement) => {
		const open = !panel.classList.contains('is-open');
		const wasOpen = panels.find((p) => p.classList.contains('is-open'));
		Flip.killFlipsOf([modes, ...panels]);
		const state = Flip.getState([modes, ...panels]);
		for (const p of panels) {
			const on = open && p === panel;
			p.classList.toggle('is-open', on);
			p.querySelector('.panel-toggle')?.setAttribute('aria-expanded', String(on));
		}
		modes.classList.remove('has-study', 'has-ref');
		if (open) modes.classList.add(panel.classList.contains('study') ? 'has-study' : 'has-ref');
		Flip.from(state, { duration: 0.9, ease: 'dfz', scale: false, overwrite: true });
		if (wasOpen && wasOpen !== panel) demo(wasOpen, false);
		demo(panel, open);
		// the sections below moved: measure again once, after the movement
		settle?.kill();
		settle = gsap.delayedCall(1, () => ScrollTrigger.refresh());
	};

	const off: (() => void)[] = [];
	for (const panel of panels) {
		const button = panel.querySelector<HTMLButtonElement>('.panel-toggle');
		if (!button) continue;
		const onClick = () => toggle(panel);
		button.hidden = false;
		button.addEventListener('click', onClick);
		off.push(() => {
			button.hidden = true;
			button.removeEventListener('click', onClick);
			button.setAttribute('aria-expanded', 'false');
		});
	}
	return () => {
		settle?.kill();
		Flip.killFlipsOf([modes, ...panels]);
		off.forEach((fn) => fn());
		modes.classList.remove('has-study', 'has-ref');
		panels.forEach((p) => p.classList.remove('is-open'));
		gsap.set([modes, ...panels], { clearProps: 'width,height,x,y,translate' });
	};
}

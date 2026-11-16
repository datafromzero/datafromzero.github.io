// 03: a Study or Reference panel enlarges on activation. The grid changes its columns once (one layout), then
// Flip animates each panel from its old box with transforms only (scaleX/x); the content is counter-scaled
// so text never stretches. The section height never changes, so nothing below it moves (SPEC §12).
// The button is a real <button aria-pressed>; without this module it stays hidden and both panels are
// the plain two-column layout.
import { gsap } from '../gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export function init(section: HTMLElement): () => void {
	const modes = section.querySelector<HTMLElement>('.modes');
	const panels = gsap.utils.toArray<HTMLElement>('.panel', section);
	if (!modes || !panels.length) return () => {};

	/** What the enlarged panel shows off: the lesson advances (Study), the rows are scanned (Reference). */
	const demo = (panel: HTMLElement, open: boolean) => {
		const fills = gsap.utils.toArray<HTMLElement>('.pips i b', panel);
		const rows = gsap.utils.toArray<HTMLElement>('.mock > div:not(.f)', panel);
		gsap.killTweensOf([...fills, ...rows]);
		if (fills.length) {
			gsap.to(fills, open ? { scaleX: 1, duration: 0.3, stagger: 0.22, delay: 0.5 } : { scaleX: 0, duration: 0.3, stagger: 0.05 });
		}
		if (rows.length && open) {
			gsap.fromTo(rows, { opacity: 0.45 }, { opacity: 1, duration: 0.3, stagger: 0.18, delay: 0.5, clearProps: 'opacity' });
		}
	};

	/** Everything inside a panel, counter-scaled while the panel itself is scaled by Flip. */
	const contentOf = (p: HTMLElement) => Array.from(p.children) as HTMLElement[];
	const counter = () => {
		for (const p of panels) {
			const sx = Number(gsap.getProperty(p, 'scaleX')) || 1;
			gsap.set(contentOf(p), { scaleX: 1 / sx, transformOrigin: '0% 0%' });
		}
	};
	const restoreContent = () => gsap.set(panels.flatMap(contentOf), { clearProps: 'scaleX,transformOrigin' });

	const toggle = (panel: HTMLElement) => {
		const open = !panel.classList.contains('is-open');
		const wasOpen = panels.find((p) => p.classList.contains('is-open'));
		Flip.killFlipsOf(panels);
		const state = Flip.getState(panels);
		for (const p of panels) {
			const on = open && p === panel;
			p.classList.toggle('is-open', on);
			p.querySelector('.panel-toggle')?.setAttribute('aria-pressed', String(on));
		}
		modes.classList.remove('has-study', 'has-ref');
		if (open) modes.classList.add(panel.classList.contains('study') ? 'has-study' : 'has-ref');
		Flip.from(state, {
			duration: 0.9,
			ease: 'dfz',
			scale: true,
			overwrite: true,
			onStart: counter,
			onUpdate: counter,
			onComplete: restoreContent,
			onInterrupt: restoreContent,
		});
		if (wasOpen && wasOpen !== panel) demo(wasOpen, false);
		demo(panel, open);
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
			button.setAttribute('aria-pressed', 'false');
		});
	}
	return () => {
		Flip.killFlipsOf(panels);
		restoreContent();
		off.forEach((fn) => fn());
		modes.classList.remove('has-study', 'has-ref');
		panels.forEach((p) => p.classList.remove('is-open'));
		gsap.set(panels, { clearProps: 'transform,transformOrigin' });
		gsap.set(gsap.utils.toArray<HTMLElement>('.pips i b', section), { clearProps: 'transform' });
	};
}

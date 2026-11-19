// SPEC D42: wires the blocks of <RunSQL> and the playground. This is the only SQL script a page ships up front: small,
// deferred, and it fetches nothing. The controller (src/scripts/sql-block.ts), the editor and the engine are separate
// chunks. They load in the background once the page has painted and a block is within a screen of the viewport, so a
// learner who reaches a query finds it ready; with Data Saver or a 2G connection they load on first focus or Run.
import type { Block } from './sql-block';

const boxes = [...document.querySelectorAll<HTMLElement>('.dfz-sql')];
const blocks = new WeakMap<HTMLElement, Promise<Block>>();
const ensure = (box: HTMLElement) => {
	let b = blocks.get(box);
	if (!b) blocks.set(box, (b = import('./sql-block').then((m) => m.wire(box))));
	return b;
};

for (const box of boxes) {
	box.classList.add('on');
	const area = box.querySelector<HTMLTextAreaElement>('textarea');
	const fit = () => area && (area.rows = Math.max(5, area.value.split('\n').length));
	fit();
	area?.addEventListener('input', fit);
	// Focus is the first deliberate sign of use: it wires the block (and starts loading, if nothing has yet).
	box.addEventListener('focusin', () => ensure(box).then((b) => b.warm()));
	box.addEventListener('click', (e) => {
		const t = (e.target as Element).closest<HTMLElement>('[data-act]');
		if (t) ensure(box).then((b) => b.act(t.dataset.act!, t));
	});
	box.addEventListener('change', (e) => {
		const t = e.target as HTMLElement;
		if (t.dataset.act) ensure(box).then((b) => b.act(t.dataset.act!, t));
	});
	// Ctrl or Cmd+Enter in the plain textarea (the editor handles its own key once it has loaded).
	area?.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			ensure(box).then((b) => b.act('run', box));
		}
	});
}

// Background preload: after the load event, at idle, when a block is near the viewport. Never with Data Saver or 2G.
const link = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
const frugal = link?.saveData === true || /^(slow-)?2g$/.test(link?.effectiveType ?? '');
if (!frugal && 'IntersectionObserver' in window && boxes.length) {
	const idle: (fn: () => void) => void = 'requestIdleCallback' in window ? (fn) => requestIdleCallback(fn, { timeout: 3000 }) : (fn) => setTimeout(fn, 300);
	const watch = () => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					io.unobserve(e.target);
					idle(() => ensure(e.target as HTMLElement).then((b) => b.warm()));
				}
			},
			{ rootMargin: `${window.innerHeight}px 0px` },
		);
		boxes.forEach((b) => io.observe(b));
	};
	if (document.readyState === 'complete') idle(watch);
	else addEventListener('load', () => idle(watch), { once: true });
}

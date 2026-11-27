// "I got all of these right: mark these 8 lessons done" after each placement test (SPEC D67, D64). A test carries a hidden marker,
// `<div hidden data-placement-test="sql-1" data-covers="S3 S4 S8"></div>`; this module turns it into a button that adds the covered
// lessons to the `dfz-done` list (the same ticks as everywhere, codes mapped to ids with /lesson-order.json) and, once pressed, offers
// "undo". Loaded only on a page that has a marker (stage pages through progress.ts, lessons through lesson-done.ts). Nothing is sent.
// Without JavaScript the marker stays hidden; with it, the marker's room is held by CSS (pages.css), so showing the button moves nothing.
import { browserStore, coveredIds, getDone, ORDER_URL, parseOrder, setDone, type OrderItem } from '../lib/progress';

const store = browserStore();
let order: Promise<OrderItem[] | null> | undefined;
const load = () =>
	(order ??= fetch(ORDER_URL)
		.then((r) => r.json())
		.then(parseOrder)
		.catch(() => null));

for (const m of document.querySelectorAll<HTMLElement>('[data-placement-test]')) {
	const covers = m.dataset.covers ?? '';
	const n = covers.split(/\s+/).filter(Boolean).length;
	if (!n) continue;
	const lessons = `${n} ${n === 1 ? 'lesson' : 'lessons'}`;
	const b = document.createElement('button');
	b.type = 'button';
	const paint = (on: boolean) => {
		b.dataset.state = on ? 'on' : 'off';
		b.textContent = on ? `Marked ${lessons} done ✓ · undo` : `I got all of these right: mark these ${lessons} done`;
	};
	paint(false);
	m.append(b);
	m.hidden = false;
	let before: string[] = [];
	// A reader who ticked these before shows the button as already pressed.
	if (getDone(store).length)
		load().then((o) => {
			const ids = o && coveredIds(o, covers);
			if (ids?.length && ids.every((id) => getDone(store).includes(id))) paint(true);
		});
	b.addEventListener('click', async () => {
		const o = await load();
		const ids = o ? coveredIds(o, covers) : [];
		if (!ids.length) {
			b.textContent = "Couldn't mark them. Tick the lessons yourself on the roadmap.";
			return;
		}
		const now = new Set(getDone(store));
		if (b.dataset.state === 'on') {
			// Undo: take back what this press added (everything covered when the page was opened with them ticked).
			for (const id of before.length ? before : ids) now.delete(id);
			before = [];
			paint(false);
		} else {
			before = ids.filter((id) => !now.has(id));
			for (const id of ids) now.add(id);
			paint(true);
		}
		setDone(now, store);
	});
}

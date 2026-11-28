// "I got all of these right: mark these 8 lessons done" after each placement test (SPEC D67, D64). A test carries a hidden marker,
// `<div hidden data-placement-test="sql-1" data-covers="S3 S4 S8"></div>`; this module turns it into a button that adds the covered
// lessons to the `dfz-done` list (the same ticks as everywhere, codes mapped to ids with /lesson-order.json) and, once pressed, offers
// "undo". Loaded only on a page that has a marker, by its own script tag (PlacementScript.astro). Nothing is sent.
// Without scripting the marker stays hidden; with it, the marker's room is held by CSS (pages.css), so showing the button moves nothing.
// `dfz-progress` is how the scripts of a page tell each other that `dfz-done` changed (progress.ts, lesson-done.ts): this module fires
// it after its own change and repaints when it hears it. The number in the label is counted from the lessons that exist (a code of an
// unpublished lesson is not counted), so the label stays generic until the order has loaded.
import { coveredIds } from '../lib/placement';
import { browserStore, getDone, ORDER_URL, parseOrder, setDone, type OrderItem } from '../lib/progress';

const store = browserStore();
const order: Promise<OrderItem[] | null> = fetch(ORDER_URL)
	.then((r) => r.json())
	.then(parseOrder)
	.catch(() => null);

for (const m of document.querySelectorAll<HTMLElement>('[data-placement-test]')) {
	const covers = m.dataset.covers ?? '';
	if (!covers.trim()) continue;
	const b = document.createElement('button');
	b.type = 'button';
	const say = document.createElement('span');
	say.className = 'dfz-sr';
	say.setAttribute('role', 'status');
	let ids: string[] = [];
	let before: string[] = [];
	const paint = (on: boolean) => {
		const n = ids.length;
		const lessons = n ? `${n} ${n === 1 ? 'lesson' : 'lessons'}` : 'lessons';
		b.dataset.state = on ? 'on' : 'off';
		b.textContent = on ? `Marked ${lessons} done ✓ · undo` : `I got all of these right: mark these ${lessons} done`;
	};
	// Whether every covered lesson is already ticked (the button then shows as pressed).
	const sync = () => {
		if (ids.length) paint(ids.every((id) => getDone(store).includes(id)));
	};
	paint(false);
	m.append(b, say);
	m.hidden = false;
	order.then((o) => {
		ids = o ? coveredIds(o, covers) : [];
		sync();
	});
	addEventListener('dfz-progress', sync);
	b.addEventListener('click', () => {
		if (!ids.length) {
			say.textContent = "Couldn't mark them. Tick the lessons yourself on the roadmap.";
			return;
		}
		const now = new Set(getDone(store));
		const on = b.dataset.state !== 'on';
		if (on) {
			before = ids.filter((id) => !now.has(id));
			for (const id of ids) now.add(id);
		} else {
			// Undo: take back what this press added (everything covered when the page was opened with them ticked).
			for (const id of before.length ? before : ids) now.delete(id);
			before = [];
		}
		if (!setDone(now, store)) {
			say.textContent = 'This browser is not saving progress, so nothing was marked.';
			return;
		}
		paint(on);
		say.textContent = on ? `${ids.length} lessons are marked done.` : 'The lessons are no longer marked done.';
		dispatchEvent(new Event('dfz-progress'));
	});
}

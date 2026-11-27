// Learner progress in this browser (SPEC D64): the one script of /start/ and the stage pages (/excel/ and the others),
// and, loaded after the load event, of the homepage. Under 2 KB gzipped, no library, sends nothing; its only request is
// the small static /lesson-order.json, made when something is ticked.
// - [data-continue] links show "Continue: S20 · INNER JOIN: pairing rows on a key" when the taskbar has stored a last lesson,
//   or "Next: S21 · …" (the first lesson in study order that is not done) when that lesson is ticked; the bottom bar's
//   [data-cta] button on /start/ follows the same choice ("Continue S20 →");
// - input[data-done] checkboxes are filled from, and saved to, the `dfz-done` list; [data-n] elements inside a
//   [data-stage] container show "4 of 23 done";
// - [data-clear] forgets the ticks and the last lesson (second press within 5 s).
// Everything is optional markup: a page with none of it does nothing. Storage can be blocked: the ticks then work
// until the page is closed, and the page says so. Reads, limits and validation live in src/lib/progress.ts.
import { browserStore, clearAll, countText, getDone, getLast, ORDER_URL, parseOrder, pickNext, setDone, type OrderItem, type Pick } from '../lib/progress';

const d = document;
// A page with a placement test gets its "mark these lessons done" button from a separate module (D67).
if (d.querySelector('[data-placement-test]')) import('./placement');
const store = browserStore();
const boxes = [...d.querySelectorAll<HTMLInputElement>('input[data-done]')];
const status = d.querySelector<HTMLElement>('[data-status]');
const say = (text: string) => status && (status.textContent = text);

// The study order is fetched (once, about 8 KB gzipped) only when something is ticked, to move past a lesson that is done.
let order: Promise<OrderItem[] | null> | undefined;
const loadOrder = () =>
	(order ??= fetch(ORDER_URL)
		.then((r) => r.json())
		.then(parseOrder)
		.catch(() => null));
const cta = d.querySelector<HTMLAnchorElement>('[data-cta]');
let run = 0;
const showLast = async () => {
	const l = getLast(store);
	const done = getDone(store);
	const me = ++run;
	let pick: Pick | null = l && { p: l.p, c: l.c, t: l.t, kind: 'continue' };
	if (l && done.length) {
		const o = await loadOrder();
		if (o) pick = pickNext(o, l, done);
	}
	if (me !== run) return;
	const word = pick?.kind === 'next' ? 'Next' : 'Continue';
	for (const a of d.querySelectorAll<HTMLAnchorElement>('[data-continue]')) {
		a.hidden = !pick;
		if (pick) {
			a.href = pick.p;
			a.textContent = `${word}: ${pick.c} · ${pick.t}`;
		}
	}
	// The bottom bar's button (on /start/) points where Continue does, so the page says one thing.
	if (cta && pick) {
		cta.href = pick.p;
		cta.setAttribute('aria-label', `${word}: ${pick.c} ${pick.t}`);
		cta.firstElementChild!.textContent = `${word} ${pick.c}`;
	}
};
showLast();

if (boxes.length) {
	const done = getDone(store);
	const paint = () => {
		for (const stage of d.querySelectorAll<HTMLElement>('[data-stage]')) {
			const mine = [...stage.querySelectorAll<HTMLInputElement>('input[data-done]')];
			const n = mine.filter((b) => b.checked).length;
			for (const e of stage.querySelectorAll<HTMLElement>('[data-n]')) {
				// With nothing ticked a label that has its own text (the lesson count on /start/) keeps it.
				e.textContent = n || !e.dataset.t ? countText(n, mine.length) : e.dataset.t;
				e.hidden = false;
			}
		}
	};
	for (const b of boxes) {
		b.checked = done.includes(b.dataset.done!);
		b.closest('label')!.hidden = false;
	}
	paint();
	d.addEventListener('change', (e) => {
		const b = e.target as HTMLInputElement;
		if (!b.dataset.done) return;
		// Read again first, so a second open tab is not overwritten by this one's older copy.
		const now = new Set(getDone(store));
		if (b.checked) now.add(b.dataset.done);
		else now.delete(b.dataset.done);
		say(setDone(now, store) ? '' : 'This browser is not saving progress, so ticks last only until you close the page.');
		paint();
		showLast();
	});

	const wrap = d.querySelector<HTMLElement>('[data-clear-wrap]');
	const clear = d.querySelector<HTMLButtonElement>('[data-clear]');
	if (wrap && clear) {
		wrap.hidden = false;
		const text = clear.textContent;
		let timer: number | undefined;
		const ask = 'Press the button again to clear your progress.';
		const reset = () => {
			clearTimeout(timer);
			timer = undefined;
			clear.textContent = text;
			if (status?.textContent === ask) say('');
		};
		clear.addEventListener('click', () => {
			if (timer === undefined) {
				clear.textContent = 'Press again to clear';
				say(ask);
				timer = setTimeout(reset, 5000);
				return;
			}
			reset();
			clearAll(store);
			for (const b of boxes) b.checked = false;
			paint();
			showLast();
			say('Your progress is cleared.');
		});
	}
}

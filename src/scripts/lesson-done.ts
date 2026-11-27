// "Mark this lesson done" at the end of a lesson (SPEC D64): a toggle that adds or removes the lesson's id in the `dfz-done`
// list, the same one the ticks on /start/ and the stage pages use. A deferred module (lessons only, under 0.5 KB gzipped):
// no library, fetches nothing, sends nothing. It does not import src/lib/progress.ts on purpose: that module is about 1 KB
// and every lesson would download it. The rules are the same (ids `[a-z0-9-]` up to 80 characters, at most 600, everything
// else dropped). Storage can be blocked: the button then
// still toggles, until the page closes.
// The lessons that end a part with a placement test (C8, C16 …) get their "mark these lessons done" button from a separate module (D67).
if (document.querySelector('[data-placement-test]')) import('./placement');
const p = document.querySelector<HTMLElement>('[data-lesson-done]');
const b = p?.querySelector('button');
if (p && b) {
	const id = p.dataset.lessonDone!;
	const read = (): string[] => {
		try {
			const v = JSON.parse(localStorage['dfz-done']);
			return Array.isArray(v) ? v.filter((x) => typeof x === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(x)).slice(0, 600) : [];
		} catch {
			return [];
		}
	};
	const paint = (on: boolean) => {
		b.dataset.state = on ? 'on' : 'off';
		b.textContent = b.dataset[on ? 'on' : 'off']!;
	};
	paint(read().includes(id));
	p.hidden = false;
	b.addEventListener('click', () => {
		// Read again first, so a second open tab is not overwritten by this one's older copy.
		const now = read().filter((x) => x !== id);
		const on = b.dataset.state !== 'on';
		if (on) now.push(id);
		try {
			localStorage['dfz-done'] = JSON.stringify(now);
		} catch {
			// Blocked or full: nothing is saved, the page is unaffected.
		}
		paint(on);
	});
}

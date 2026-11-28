// "Mark this lesson done" at the end of a lesson (SPEC D64): a toggle that adds or removes the lesson's id in the `dfz-done`
// list, the same one the ticks on /start/ and the stage pages use. A small module (lessons only): no library, fetches nothing,
// sends nothing. It imports nothing on purpose, not even a dynamic import (Vite adds a 0.9 KB preload helper for one): the
// lessons that end a part with a placement test load src/scripts/placement.ts through their own script tag (PlacementScript.astro).
// The rules are those of src/lib/progress.ts (ids `[a-z0-9-]` up to 80 characters, at most 600, everything else dropped). Storage can
// be blocked: the button then still toggles, until the page closes. `dfz-progress` tells the other scripts of the page (the
// placement button) that the list changed, and is heard when they change it.
const p = document.querySelector<HTMLElement>('[data-lesson-done]');
const b = p?.querySelector('button');
const say = p?.querySelector('[role=status]');
if (p && b && say) {
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
	addEventListener('dfz-progress', () => paint(read().includes(id)));
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
		say.textContent = on ? 'This lesson is marked done.' : 'This lesson is no longer marked done.';
		dispatchEvent(new Event('dfz-progress'));
	});
}

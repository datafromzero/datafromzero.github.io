import type * as Select from '../fx/select';

let select: typeof Select | undefined;
/** The selection box is its own small chunk: fetched once the page is idle, usually before the box is due. */
export const load = () =>
	import('../fx/select').then((m) => {
		select = m;
	});

/** Hero: the logo and the wordmark stay CSS; the script adds the Excel-style selection box (A1 → AI). */
export function init(hero: HTMLElement, onCleanup: (fn: () => void) => void) {
	if (select) onCleanup(select.init(hero));
}

import type * as Scramble from '../fx/scramble';

let scramble: typeof Scramble | undefined;
/** The caption decode is its own chunk (ScrambleText): fetched once the page is idle, before the intro ends. */
export const load = () =>
	import('../fx/scramble').then((m) => {
		scramble = m;
	});

/** Hero: after the CSS intro, the roadmap caption decodes once. The headline, logo and buttons stay CSS. */
export function init(hero: HTMLElement, onCleanup: (fn: () => void) => void) {
	const cap = hero.querySelector<HTMLElement>('.cap-t');
	if (cap && scramble) onCleanup(scramble.init(cap));
}

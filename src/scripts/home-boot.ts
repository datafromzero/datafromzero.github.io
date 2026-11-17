// First-load homepage script (about 1 KB). It never imports GSAP statically: the hero entrance is CSS,
// and the scroll choreography is fetched after the page has loaded (or on first interaction).
// Every reader, reduced motion included, also gets the section 03 tab list (home/tabs.ts, no GSAP) then;
// without script the three solutions simply stay stacked.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
	const dots = document.querySelector<HTMLElement>('.dots');
	const lockup = document.querySelector<HTMLElement>('.lockup');
	const replay = document.querySelector<HTMLButtonElement>('[data-replay]');

	// Drop the reveal mask once the ripple has finished, so the grid is a plain layer again.
	dots?.addEventListener(
		'animationend',
		(e) => {
			if (e.target === dots) dots.classList.add('settled');
		},
		{ once: true },
	);

	// Tap or click the hero logo to replay the intro: logo and wordmark together (the selection box in
	// fx/select.ts listens to the same button). Restarting CSS animations needs one style flush.
	if (replay && lockup) {
		replay.hidden = false;
		replay.addEventListener('click', () => {
			lockup.classList.add('restart');
			void lockup.getBoundingClientRect();
			lockup.classList.remove('restart');
		});
	}
}

let started = false;
const start = () => {
	if (started) return;
	started = true;
	// The tabs first, so the motion chunk measures the page in its final layout.
	import('./home/tabs')
		.then((m) => m.init())
		.catch(() => {})
		.then(() => (reduced ? undefined : import('./home/motion').then((m) => m.init())))
		.catch(() => {
			// Motion is an enhancement: the page is already complete without it (the history list stops keeping room for the slider).
			document.querySelector('.gallery')?.classList.add('is-static');
		});
};
const whenIdle = () => {
	const ric = (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
	if (ric) ric(start, { timeout: 2000 });
	else setTimeout(start, 200);
};
if (document.readyState === 'complete') whenIdle();
else addEventListener('load', whenIdle, { once: true });
for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const) {
	addEventListener(type, start, { once: true, passive: true });
}

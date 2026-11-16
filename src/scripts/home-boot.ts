// First-load homepage script (about 1 KB). It never imports GSAP statically: the hero entrance is CSS,
// and the scroll choreography is fetched after the page has loaded (or on first interaction).
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
	const dots = document.querySelector<HTMLElement>('.dots');
	const morph = document.querySelector<SVGElement>('.morph');
	const replay = document.querySelector<HTMLButtonElement>('[data-replay]');

	// Drop the reveal mask once the ripple has finished, so the grid is a plain layer again.
	dots?.addEventListener(
		'animationend',
		(e) => {
			if (e.target === dots) dots.classList.add('settled');
		},
		{ once: true },
	);

	// Tap or click the hero logo to replay its intro. Restarting CSS animations needs one style flush.
	if (replay && morph) {
		replay.hidden = false;
		replay.addEventListener('click', () => {
			morph.classList.add('restart');
			void morph.getBoundingClientRect();
			morph.classList.remove('restart');
		});
	}

	let started = false;
	const start = () => {
		if (started) return;
		started = true;
		import('./home/motion').then((m) => m.init()).catch(() => {
			// Motion is an enhancement: the page is already complete without it.
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
}

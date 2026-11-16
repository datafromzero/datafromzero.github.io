// First-load script of the project pages (/start/, /about/, /cite/, /changelog/, /license/, /privacy/ and
// their /vi/ twins, about 0.4 KB). Never imports GSAP statically: once the page is idle, and only when there is
// something to animate (the roadmap map, or a heading below the fold), the motion chunk is fetched.
if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
	const worthIt = () =>
		!!document.querySelector('.roadmap') || Array.from(document.querySelectorAll('main h2')).some((h) => h.getBoundingClientRect().top > innerHeight * 0.9);
	let started = false;
	const start = () => {
		if (started) return;
		started = true;
		if (worthIt()) import('./project/motion').then((m) => m.init()).catch(() => {});
	};
	const whenIdle = () => {
		const ric = (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
		if (ric) ric(start, { timeout: 2000 });
		else setTimeout(start, 200);
	};
	if (document.readyState === 'complete') whenIdle();
	else addEventListener('load', whenIdle, { once: true });
}

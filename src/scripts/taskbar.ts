// The bottom taskbar (SPEC D31): the only script on project, lesson and reference pages, under 1 KB gzipped.
// No library and no animation here: the motion is CSS transitions (none under reduced motion).
// - the shortcuts sheet: aria-expanded, inert while closed; Esc, a second tap, a link or an outside click
//   closes it, and Esc returns focus to the button;
// - the theme switch: Starlight's own state (data-theme on <html>, localStorage `starlight-theme`), so the
//   homepage and the docs agree; dark unless the reader chose light;
// - back-to-top is dimmed near the top;
// - on the homepage, the label names the section on screen ([data-tb-name]).
const d = document;
const root = d.documentElement;
const bar = d.querySelector<HTMLElement>('.tb');

if (bar) {
	const btn = bar.querySelector<HTMLButtonElement>('.tb-menu')!;
	const sheet = d.getElementById('tb-sheet')!;
	const theme = bar.querySelector<HTMLButtonElement>('.tb-theme')!;
	const top = bar.querySelector<HTMLElement>('.tb-top')!;
	const label = bar.querySelector<HTMLElement>('.tb-label')!;
	let open = false;

	const set = (o: boolean) => {
		open = o;
		bar.classList.toggle('open', o);
		btn.setAttribute('aria-expanded', String(o));
		sheet.inert = !o;
		if (o) sheet.querySelector('a')?.focus({ preventScroll: true });
	};
	set(false);
	btn.addEventListener('click', () => set(!open));
	sheet.addEventListener('click', (e) => {
		if ((e.target as Element).closest('a')) set(false);
	});
	d.addEventListener('click', (e) => {
		if (open && !bar.contains(e.target as Node)) set(false);
	});
	d.addEventListener('keydown', (e) => {
		if (open && e.key === 'Escape') {
			set(false);
			btn.focus();
		}
	});
	bar.addEventListener('focusout', (e) => {
		const to = e.relatedTarget as Node | null;
		if (open && to && !bar.contains(to)) set(false);
	});

	const paint = () => {
		theme.setAttribute('aria-label', root.dataset.theme === 'light' ? theme.dataset.dark! : theme.dataset.light!);
		d.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
	};
	theme.addEventListener('click', () => {
		const next = root.dataset.theme === 'light' ? 'dark' : 'light';
		root.dataset.theme = next;
		try {
			localStorage.setItem('starlight-theme', next);
		} catch {
			// Storage can be blocked: the choice then lasts for this page view.
		}
		paint();
	});

	let atTop: boolean | undefined;
	const dim = () => {
		if (atTop !== (atTop = scrollY < 200)) top.setAttribute('aria-disabled', String(atTop));
	};
	addEventListener('scroll', dim, { passive: true });
	// The first reads of style and scroll position wait for the first frame, so they never force the
	// page's first layout early.
	requestAnimationFrame(() =>
		setTimeout(() => {
			paint();
			dim();
		}),
	);

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) if (e.isIntersecting) label.textContent = (e.target as HTMLElement).dataset.tbName!;
		},
		{ rootMargin: '-45% 0px -50% 0px' },
	);
	d.querySelectorAll('[data-tb-name]').forEach((s) => io.observe(s));
}

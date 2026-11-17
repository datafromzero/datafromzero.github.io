// The bottom bar (SPEC D31, D35): the only script on project, lesson and reference pages, under 1 KB gzipped.
// No library and no animation here: the motion is CSS transitions (none under reduced motion).
// - the sheet: aria-expanded, inert while closed; Esc, a second tap, a link or an outside click closes it, and
//   Esc returns focus to the button. The tabs inside it are radio inputs and need no script, except that the
//   Course list scrolls to the current lesson;
// - the theme switch: Starlight's own state (data-theme on <html>, localStorage `starlight-theme`), so the
//   homepage and the docs agree; dark unless the reader chose light;
// - back-to-top (desktop) is dimmed near the top;
// - the small label line names the section on screen: the homepage's sections ([data-tb-name]) or a docs page's
//   h2s, behind the lesson code; the same section is marked in the sheet's first tab.
const d = document;
const root = d.documentElement;
const bar = d.querySelector<HTMLElement>('.tb');

if (bar) {
	const btn = bar.querySelector<HTMLButtonElement>('.tb-menu')!;
	const sheet = d.getElementById('tb-sheet')!;
	const theme = bar.querySelector<HTMLButtonElement>('.tb-theme')!;
	const top = bar.querySelector<HTMLElement>('.tb-top')!;
	const kick = bar.querySelector<HTMLElement>('.tb-kick')!;
	let open = false;

	const set = (o: boolean) => {
		open = o;
		bar.classList.toggle('open', o);
		btn.setAttribute('aria-expanded', String(o));
		sheet.inert = !o;
		if (o) {
			sheet.querySelector<HTMLElement>(':checked')?.focus({ preventScroll: true });
			show();
		}
	};
	// Course tab: the current lesson sits a third of the way down the list when the sheet opens or the tab changes.
	const show = () => {
		const c = sheet.querySelector<HTMLElement>('[aria-current=page]');
		// offsetParent is null while the Course pane is hidden.
		if (c?.offsetParent) c.offsetParent.scrollTop = c.offsetTop - 120;
	};
	sheet.addEventListener('change', show);
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

	// The current section is the last one whose top is above a line a fifth down the screen. The observer's
	// region is the strip above that line, so it fires exactly when a section top crosses it, either way.
	const hs = [...d.querySelectorAll<HTMLElement>('[data-tb-name], .sl-markdown-content h2')];
	const links = [...sheet.querySelectorAll<HTMLAnchorElement>('.tb-on a')];
	const io = new IntersectionObserver(
		() => {
			const h = hs.filter((x) => x.getBoundingClientRect().top < innerHeight / 5).pop();
			kick.textContent = [kick.dataset.c, h && (h.dataset.tbName ?? h.textContent)].filter(Boolean).join(' · ');
			links.forEach((a) => a.setAttribute('aria-current', a.hash.slice(1) === h?.id ? 'location' : 'false'));
		},
		{ rootMargin: '0px 0px -80% 0px' },
	);
	hs.forEach((h) => io.observe(h));
}

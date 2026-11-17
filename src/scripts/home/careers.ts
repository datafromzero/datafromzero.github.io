// Homepage section 05: the career cards (components/home/Careers.astro). No GSAP: home-boot.ts loads this for every
// reader once the page is idle, reduced motion included.
// - Each card link (a jump to that career's details without script) becomes a button with aria-expanded and
//   aria-controls. One panel is open at a time; pressing the open card closes it. Data Analyst starts open, as
//   CSS already drew it.
// - When the section nears the screen the figure chunk is fetched: the looping canvas figures on the GSAP
//   ticker (fx/career-loop.ts), or with reduced motion one still frame and no GSAP (careers-figures.ts).

export type Key = 'da' | 'de' | 'ds' | 'ml';
export interface Careers {
	root: HTMLElement;
	stage: HTMLElement;
	panels: HTMLElement[];
	/** The open career, or null when every card is closed. */
	key: Key | null;
	select(key: Key | null): void;
	/** Runs after every change made by the reader. */
	after: Set<(key: Key | null) => void>;
}

function build(root: HTMLElement): Careers | undefined {
	const stage = root.querySelector<HTMLElement>('.cr-stage');
	const detail = root.querySelector<HTMLElement>('.cr-detail');
	const cap = root.querySelector<HTMLElement>('.cr-cap');
	const panels = Array.from(root.querySelectorAll<HTMLElement>('.cr-panel'));
	const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a.cr-card'));
	if (!stage || !detail || !panels.length || links.length !== panels.length) return;

	const cards = links.map((a, i) => {
		const b = document.createElement('button');
		b.type = 'button';
		b.className = a.className;
		b.setAttribute('aria-controls', panels[i].id);
		b.append(...a.childNodes);
		a.replaceWith(b);
		return b;
	});

	const c: Careers = {
		root,
		stage,
		panels,
		key: 'da',
		after: new Set(),
		select(key) {
			c.key = key;
			panels.forEach((p, i) => {
				const on = p.dataset.k === key;
				p.classList.toggle('is-off', !on);
				cards[i].classList.toggle('is-on', on);
				cards[i].setAttribute('aria-expanded', String(on));
				if (on && cap) cap.textContent = p.dataset.fig ?? '';
			});
			detail.classList.toggle('is-closed', !key);
		},
	};
	cards.forEach((card, i) =>
		card.addEventListener('click', () => {
			const k = panels[i].dataset.k as Key;
			c.select(c.key === k ? null : k);
			detail.classList.add('is-picked'); // from now on an opened panel's lines lift in (CSS)
			c.after.forEach((fn) => fn(c.key));
		}),
	);
	c.select('da');
	return c;
}

export function init() {
	const root = document.querySelector<HTMLElement>('[data-careers]');
	if (!root || root.dataset.built) return;
	root.dataset.built = '';
	const c = build(root);
	if (!c) {
		root.classList.add('is-static');
		return;
	}
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const io = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			io.disconnect();
			// The figure is decoration: if its chunk fails, the stage simply stays empty. Two separate imports, so the
			// bundler preloads only the one taken (one shared preload would fetch GSAP with reduced motion too).
			if (reduced) import('./careers-figures').then((m) => m.still(c)).catch(() => {});
			else import('./fx/career-loop').then((m) => m.init(c)).catch(() => {});
		},
		{ rootMargin: '50% 0px 50% 0px' },
	);
	io.observe(root);
}

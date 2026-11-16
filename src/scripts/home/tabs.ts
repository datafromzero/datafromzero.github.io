// Homepage section 03: the stacked solutions become an ARIA tab list (WAI-ARIA APG "Tabs", automatic
// activation): roving tabindex, ←/→ (wrapping), Home and End. No GSAP and no motion: home-boot.ts loads this
// for every reader once the page is idle, reduced motion included. The deferred motion chunk
// (sections/tools.ts) hooks into `before` / `after` for the animation and the auto-cycle.
// Panels share one grid cell, so the widget is as tall as its tallest panel: switching tabs never moves
// the page (CLS 0, also when the auto-cycle switches).

export type Source = 'user' | 'auto';
export interface Tabs {
	root: HTMLElement;
	tabs: HTMLButtonElement[];
	panels: HTMLElement[];
	bar: HTMLElement;
	index: number;
	select(i: number, source: Source, focus?: boolean): void;
	/** Runs before the change is written (Flip reads its state here). */
	before: Set<(next: number, source: Source) => void>;
	after: Set<(index: number, source: Source) => void>;
}

const all = new WeakMap<HTMLElement, Tabs>();
export const tabsOf = (root: HTMLElement): Tabs | undefined => all.get(root);

function build(root: HTMLElement): Tabs | undefined {
	const panels = Array.from(root.querySelectorAll<HTMLElement>('.sol'));
	const sols = root.querySelector('.sols');
	if (!panels.length || !sols) return;
	const list = document.createElement('div');
	list.className = 'tabs';
	list.setAttribute('role', 'tablist');
	list.setAttribute('aria-label', root.dataset.tabsLabel ?? '');
	const tabs = panels.map((panel, i) => {
		const tab = document.createElement('button');
		tab.type = 'button';
		tab.id = `${panel.id}-tab`;
		tab.className = 'mono';
		tab.setAttribute('role', 'tab');
		tab.setAttribute('aria-controls', panel.id);
		tab.textContent = panel.querySelector('.sol-h')?.textContent ?? String(i + 1);
		panel.setAttribute('role', 'tabpanel');
		panel.setAttribute('aria-labelledby', tab.id);
		panel.tabIndex = 0; // a code panel has nothing focusable inside: the panel itself takes focus
		list.append(tab);
		return tab;
	});
	const bar = document.createElement('i');
	bar.className = 'bar';
	bar.setAttribute('aria-hidden', 'true');
	bar.style.width = `${100 / tabs.length}%`;
	list.append(bar);

	const t: Tabs = {
		root,
		tabs,
		panels,
		bar,
		index: -1,
		before: new Set(),
		after: new Set(),
		select(i, source, focus = false) {
			const n = (i + tabs.length) % tabs.length;
			if (n === t.index) {
				if (focus) tabs[n].focus();
				return;
			}
			const first = t.index < 0;
			if (!first) t.before.forEach((fn) => fn(n, source));
			t.index = n;
			tabs.forEach((tab, k) => {
				tab.setAttribute('aria-selected', String(k === n));
				tab.tabIndex = k === n ? 0 : -1;
				panels[k].classList.toggle('is-off', k !== n);
			});
			bar.style.left = `${(n * 100) / tabs.length}%`;
			if (focus) tabs[n].focus();
			if (!first) t.after.forEach((fn) => fn(n, source));
		},
	};
	list.addEventListener('click', (e) => {
		const k = tabs.indexOf((e.target as Element).closest('[role="tab"]') as HTMLButtonElement);
		if (k >= 0) t.select(k, 'user');
	});
	list.addEventListener('keydown', (e) => {
		const moves: Record<string, number> = { ArrowRight: t.index + 1, ArrowLeft: t.index - 1, Home: 0, End: tabs.length - 1 };
		if (!(e.key in moves)) return;
		e.preventDefault();
		t.select(moves[e.key], 'user', true);
	});
	t.select(0, 'user');
	root.insertBefore(list, sols);
	root.classList.add('is-tabs');
	all.set(root, t);
	return t;
}

export function init() {
	document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
		if (!all.has(root)) build(root);
	});
}

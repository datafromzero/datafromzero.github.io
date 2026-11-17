// Copy for the homepage. One object per language, same shape (design/README.md §5). English only for now
// (SPEC D30).
// Text conventions: "\n" is a line break; *text* is the muted second voice of a heading.

export type HistoryIconName =
	| 'card'
	| 'dial'
	| 'table'
	| 'query'
	| 'screen'
	| 'sheet'
	| 'code'
	| 'cluster'
	| 'frame'
	| 'person'
	| 'network'
	| 'chat'
	| 'cursor';

export interface HistorySource {
	name: string;
	url: string;
}

export interface HomeStrings {
	meta: { tagline: string; description: string };
	nav: { label: string; roadmap: string; example: string; github: string; skip: string };
	hero: {
		logoLabel: string;
		replay: string;
		/**
		 * The lockup wordmark beside the logo, the page's h1 (design/README.md §5). Words are split on spaces;
		 * the word `A1` gets the selection box, and a last word starting with `AI` gets the 1 → I reel.
		 */
		lockup: string;
		scroll: string;
		/** Name shown in the bottom taskbar while this section is on screen (SPEC D31); `short` below too. */
		short: string;
	};
	core: {
		short: string;
		label: string;
		heading: string;
		stepLabel: string;
		steps: { title: string; text: string }[];
	};
	branch: {
		short: string;
		label: string;
		heading: string;
		careers: { abbr: string; name: string }[];
	};
	tools: {
		short: string;
		label: string;
		heading: string;
		questionLabel: string;
		question: string;
		/** Accessible name of the tab list (script only; without script every solution is shown). */
		tabsLabel: string;
		/** One solution per tool. In `code`, {braces} mark a keyword (rendered bright, braces removed). */
		solutions: { tool: string; code: string }[];
		result: {
			caption: string;
			columns: [string, string];
			rows: [string, string][];
			note: string;
		};
		/** The auto-cycle's pause / play button (WCAG 2.2.2), shown only while the script cycles the tabs. */
		control: { pause: string; play: string; what: string };
	};
	history: {
		short: string;
		label: string;
		heading: string;
		/** Accessible name of the slider (role region, aria-roledescription "carousel"). */
		carousel: string;
		prev: string;
		next: string;
		/**
		 * The milestones, oldest first, exactly as researched in GitHub issue #29: year, title and one line.
		 * Every card has a primary and a second source (the honesty rules of the teaching playbook,
		 * research/curriculum/ §4: every fact on the site is sourced).
		 */
		cards: {
			year: string;
			title: string;
			line: string;
			/** "Why it matters" from issue #29, shown after `line` in the sources list. */
			why: string;
			/** Picture under the year (src/components/home/HistoryIcon.astro). */
			icon: HistoryIconName;
			sources: [HistorySource, HistorySource];
		}[];
		/** The closing card: site copy, not a researched milestone, so no source. */
		now: { year: string; title: string; line: string; cta: string; icon: HistoryIconName };
		sourcesSummary: string;
		/** Date the sources were checked. */
		accessed: string;
		primary: string;
		second: string;
	};
	/**
	 * 05: the four careers (SPEC D32), from the owner-approved mockup. Without script every career's details are
	 * shown in full; with script the cards open one detail panel at a time, with a looping figure.
	 */
	careers: {
		short: string;
		label: string;
		heading: string;
		/** Text on each closed card, after its line ("See the path"). */
		more: string;
		/** The steps every path starts with, shown as chips before the career's own name. */
		path: string[];
		/** Accessible name of the path chips. */
		pathLabel: string;
		cta: string;
		careers: {
			/** Stable key: da, de, ds, ml (the figure to draw). */
			key: 'da' | 'de' | 'ds' | 'ml';
			/** Small mono label on the card ("01 · Data Analyst"). */
			label: string;
			name: string;
			/** One line on the card. */
			line: string;
			/** Caption under the figure (script only; the figure is decorative). */
			figure: string;
			/** What the career does day to day. */
			does: string[];
			portfolio: string;
		}[];
		/** The quiz teaser below the cards. */
		unsure: { heading: string; text: string; cta: string };
	};
	footer: { content: string; code: string; github: string; version: string };
}

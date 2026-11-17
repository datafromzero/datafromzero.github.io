// Copy for the homepage. One object per language, same shape (design/README.md §5). English only for now
// (SPEC D30).
// Text conventions: "\n" is a line break; *text* is the muted second voice of a heading.

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
		sub: string;
		ctaStart: string;
		ctaExample: string;
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
	marquee: { text: string; outline?: boolean }[];
	marqueeControl: { pause: string; play: string; what: string };
	begin: { short: string; label: string; heading: string; cta: string };
	footer: { content: string; code: string; github: string; version: string };
}

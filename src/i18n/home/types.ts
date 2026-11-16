// Copy for the homepage (/ and /vi/). One object per language, same shape (design/README.md §5).
// Text conventions: "\n" is a line break; *text* is the muted second voice of a heading.

export interface HomeStrings {
	meta: { tagline: string; description: string };
	nav: { label: string; roadmap: string; reference: string; github: string; skip: string };
	hero: {
		logoLabel: string;
		replay: string;
		caption: string;
		headline: string;
		sub: string;
		ctaStart: string;
		ctaReference: string;
		scroll: string;
	};
	core: {
		label: string;
		heading: string;
		stepLabel: string;
		steps: { title: string; text: string }[];
	};
	branch: {
		label: string;
		heading: string;
		careers: { abbr: string; name: string }[];
	};
	modes: {
		label: string;
		heading: string;
		study: {
			tag: string;
			lesson: string;
			question: string;
			title: string;
			text: string;
		};
		reference: {
			tag: string;
			rows: { name: string; value: string; highlight?: boolean }[];
			formula: string;
			title: string;
			text: string;
		};
	};
	marquee: { text: string; outline?: boolean }[];
	marqueeControl: { pause: string; play: string };
	begin: { label: string; heading: string; cta: string };
	footer: { content: string; code: string; github: string; version: string };
}

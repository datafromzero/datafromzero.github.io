import type { HomeStrings } from './types';

export const en: HomeStrings = {
	meta: {
		tagline: 'From A1 to AI',
		description:
			'A free, open roadmap for learning data from zero: Excel / Sheets, SQL, Python, and five data careers.',
	},
	nav: {
		label: 'Primary',
		roadmap: 'Roadmap',
		reference: 'Reference',
		github: 'GitHub',
		skip: 'Skip to content',
	},
	hero: {
		logoLabel: 'Logo: a disc of light with a database-shaped void at its center',
		replay: 'Replay the logo animation',
		caption: 'Excel → SQL → Python → DA · DE · DS',
		headline: 'From A1\nto *AI.*',
		sub: 'A free, zero-to-job-ready roadmap for people who only know Office. Excel → SQL → Python → the branch you choose.',
		ctaStart: 'Start at zero',
		ctaReference: 'Browse reference',
		scroll: 'Scroll',
	},
	core: {
		label: '01 — The core',
		heading: 'Four steps.\n*No skipped rungs.*',
		stepLabel: 'Step',
		steps: [
			{
				title: 'Excel / Sheets',
				text: 'Formulas, lookups, pivot tables. The data language you already half-speak.',
			},
			{
				title: 'SQL',
				text: 'Ask questions of tables. SELECT, JOIN, GROUP BY — then window functions.',
			},
			{
				title: 'Python',
				text: 'pandas, notebooks, automation. Where one-off analysis becomes repeatable.',
			},
			{
				title: 'Advanced core',
				text: 'Statistics, Git, data modeling, cloud basics. The shared foundation under every branch.',
			},
		],
	},
	branch: {
		label: '02 — Then branch',
		heading: 'One trunk.\n*Five careers.*',
		careers: [
			{ abbr: 'DA', name: 'Data\nAnalyst' },
			{ abbr: 'DE', name: 'Data\nEngineer' },
			{ abbr: 'DS', name: 'Data\nScientist' },
			{ abbr: 'AE', name: 'Analytics\nEngineer' },
			{ abbr: 'ML', name: 'ML / AI\nEngineer' },
		],
	},
	modes: {
		label: '03 — Two ways in',
		heading: 'Learn in order.\n*Look it up later.*',
		toggle: 'Enlarge',
		study: {
			tag: 'Study',
			lesson: 'Lesson 2.3 · JOIN',
			question: 'Two tables.\nOne question.',
			title: 'Open & quiet.',
			text: 'One idea per screen, in sequence. Built for a phone on the bus.',
		},
		reference: {
			tag: 'Reference',
			rows: [
				{ name: 'Statistics', value: '§ 4' },
				{ name: 'Standard deviation', value: '4.2', highlight: true },
				{ name: 'Variance', value: '4.1' },
			],
			formula: 'σ = √( Σ(x − μ)² / N )',
			title: 'Book-like.',
			text: 'Indexed, searchable, formulas typeset. Find it, read it, get back to work.',
		},
	},
	marquee: [
		{ text: 'Free' },
		{ text: 'Open source', outline: true },
		{ text: 'Content CC BY 4.0 · Code MIT' },
		{ text: 'Mobile-first', outline: true },
		{ text: 'Zero to job-ready' },
		{ text: 'Free', outline: true },
	],
	marqueeControl: { pause: 'Pause', play: 'Play' },
	begin: { label: '04 — Begin', heading: 'Start\n*at zero.*', cta: 'Open step 01' },
	footer: {
		content: 'Content CC BY 4.0',
		code: 'Code MIT',
		github: 'GitHub',
		version: 'Version {version}',
	},
};

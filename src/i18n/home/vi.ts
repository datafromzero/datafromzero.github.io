import type { HomeStrings } from './types';

// TODO(vi): every string below is still the English source. A translator fills them in; the shape must not change.

export const vi: HomeStrings = {
	meta: {
		tagline: 'Từ A1 đến AI',
		description:
			'Lộ trình học dữ liệu từ con số 0, miễn phí và mở: Excel / Sheets, SQL, Python và năm nghề dữ liệu.',
	},
	nav: {
		label: 'Primary', // TODO(vi)
		roadmap: 'Roadmap', // TODO(vi)
		reference: 'Reference', // TODO(vi)
		github: 'GitHub', // TODO(vi)
		skip: 'Skip to content', // TODO(vi)
	},
	hero: {
		logoLabel: 'Logo: a disc of light with a database-shaped void at its center', // TODO(vi)
		replay: 'Replay the logo animation', // TODO(vi)
		caption: 'Excel → SQL → Python → DA · DE · DS', // TODO(vi)
		headline: 'From A1\nto *AI.*', // TODO(vi)
		sub: 'A free, zero-to-job-ready roadmap for people who only know Office. Excel → SQL → Python → the branch you choose.', // TODO(vi)
		ctaStart: 'Start at zero', // TODO(vi)
		ctaReference: 'Browse reference', // TODO(vi)
		scroll: 'Scroll', // TODO(vi)
	},
	core: {
		label: '01 — The core', // TODO(vi)
		heading: 'Four steps.\n*No skipped rungs.*', // TODO(vi)
		stepLabel: 'Step', // TODO(vi)
		steps: [
			{
				title: 'Excel / Sheets', // TODO(vi)
				text: 'Formulas, lookups, pivot tables. The data language you already half-speak.', // TODO(vi)
			},
			{
				title: 'SQL', // TODO(vi)
				text: 'Ask questions of tables. SELECT, JOIN, GROUP BY — then window functions.', // TODO(vi)
			},
			{
				title: 'Python', // TODO(vi)
				text: 'pandas, notebooks, automation. Where one-off analysis becomes repeatable.', // TODO(vi)
			},
			{
				title: 'Advanced core', // TODO(vi)
				text: 'Statistics, Git, data modeling, cloud basics. The shared foundation under every branch.', // TODO(vi)
			},
		],
	},
	branch: {
		label: '02 — Then branch', // TODO(vi)
		heading: 'One trunk.\n*Five careers.*', // TODO(vi)
		careers: [
			{ abbr: 'DA', name: 'Data\nAnalyst' }, // TODO(vi)
			{ abbr: 'DE', name: 'Data\nEngineer' }, // TODO(vi)
			{ abbr: 'DS', name: 'Data\nScientist' }, // TODO(vi)
			{ abbr: 'AE', name: 'Analytics\nEngineer' }, // TODO(vi)
			{ abbr: 'ML', name: 'ML / AI\nEngineer' }, // TODO(vi)
		],
	},
	modes: {
		label: '03 — Two ways in', // TODO(vi)
		heading: 'Learn in order.\n*Look it up later.*', // TODO(vi)
		study: {
			tag: 'Study', // TODO(vi)
			lesson: 'Lesson 2.3 · JOIN', // TODO(vi)
			question: 'Two tables.\nOne question.', // TODO(vi)
			title: 'Open & quiet.', // TODO(vi)
			text: 'One idea per screen, in sequence. Built for a phone on the bus.', // TODO(vi)
		},
		reference: {
			tag: 'Reference', // TODO(vi)
			rows: [
				{ name: 'Statistics', value: '§ 4' }, // TODO(vi)
				{ name: 'Standard deviation', value: '4.2', highlight: true }, // TODO(vi)
				{ name: 'Variance', value: '4.1' }, // TODO(vi)
			],
			formula: 'σ = √( Σ(x − μ)² / N )', // TODO(vi)
			title: 'Book-like.', // TODO(vi)
			text: 'Indexed, searchable, formulas typeset. Find it, read it, get back to work.', // TODO(vi)
		},
	},
	marquee: [
		{ text: 'Free' }, // TODO(vi)
		{ text: 'Open source', outline: true }, // TODO(vi)
		{ text: 'Content CC BY 4.0 · Code MIT' }, // TODO(vi)
		{ text: 'Mobile-first', outline: true }, // TODO(vi)
		{ text: 'Zero to job-ready' }, // TODO(vi)
		{ text: 'Free', outline: true }, // TODO(vi)
	],
	begin: { label: '04 — Begin', heading: 'Start\n*at zero.*', cta: 'Open step 01' }, // TODO(vi)
	footer: {
		content: 'Content CC BY 4.0', // TODO(vi)
		code: 'Code MIT', // TODO(vi)
		github: 'GitHub', // TODO(vi)
		version: 'Version {version}', // TODO(vi)
	},
};


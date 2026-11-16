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
		example: 'Example',
		github: 'GitHub',
		skip: 'Skip to content',
	},
	hero: {
		logoLabel: 'Logo: a disc of light with a database-shaped void at its center',
		replay: 'Replay the intro animation',
		lockup: 'From A1 to AI.',
		sub: 'A free, zero-to-job-ready roadmap for people who only know Office. Excel → SQL → Python → the branch you choose.',
		ctaStart: 'Start at zero',
		ctaExample: 'See an example',
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
	tools: {
		label: '03 — One idea, three tools',
		heading: 'Same question. *Three tools.*',
		questionLabel: 'The question',
		question: 'Which store sold the most in March?',
		tabsLabel: 'Tool',
		solutions: [
			{
				tool: 'Excel',
				code: '{=SUMIFS}(Orders[Amount],\n        Orders[Store], A2,\n        Orders[Month], "2026-03")\n\n{Fill down} for each store, then sort.',
			},
			{
				tool: 'SQL',
				code: "{SELECT} store, {SUM}(amount) {AS} sales\n{FROM} orders\n{WHERE} month = '2026-03'\n{GROUP BY} store\n{ORDER BY} sales {DESC};",
			},
			{
				tool: 'Python',
				code: '(orders\n  .{query}("month == \'2026-03\'")\n  .{groupby}("store")["amount"].{sum}()\n  .{sort_values}(ascending={False}))',
			},
		],
		result: {
			caption: 'Same answer, every time',
			columns: ['Store', 'March sales'],
			rows: [
				['Riverside', '$1,284.50'],
				['Old Quarter', '$1,102.75'],
				['Harbor', '$968.20'],
			],
			note: 'Example numbers.',
		},
		control: { pause: 'Pause', play: 'Play' },
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

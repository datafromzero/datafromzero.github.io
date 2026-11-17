import type { HomeStrings } from './types';

export const en: HomeStrings = {
	meta: {
		tagline: 'From A1 to AI',
		description:
			'A free, open roadmap for learning data from zero: Excel / Sheets, SQL, Python, and four data careers.',
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
		scroll: 'Scroll',
		short: 'Home',
	},
	core: {
		short: '01 The core',
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
		short: '02 Careers',
		label: '02 — Then branch',
		heading: 'One trunk.\n*Four careers.*',
		careers: [
			{ abbr: 'DA', name: 'Data\nAnalyst' },
			{ abbr: 'DE', name: 'Data\nEngineer' },
			{ abbr: 'DS', name: 'Data\nScientist' },
			{ abbr: 'ML', name: 'ML / AI\nEngineer' },
		],
	},
	tools: {
		short: '03 Three tools',
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
		control: { pause: 'Pause', play: 'Play', what: 'tool cycle' },
	},
	// Cards and sources: GitHub issue #29 ("Research: a short history of data"), all sources accessed 2026-11-16.
	history: {
		short: '04 History',
		label: '04 — A short history of data',
		heading: 'From punch cards *to AI.*',
		carousel: 'Milestones in the history of data',
		prev: 'Previous milestone',
		next: 'Next milestone',
		cards: [
			{
				year: '1804',
				title: 'A loom reads punched cards',
				line: "Jacquard's loom weaves patterns stored as holes in interchangeable punched cards.",
				sources: [
					{
						name: 'Science and Industry Museum (Science Museum Group), "Programming patterns: the story of the Jacquard loom"',
						url: 'https://www.scienceandindustrymuseum.org.uk/objects-and-stories/jacquard-loom',
					},
					{
						name: 'Encyclopaedia Britannica, "Joseph-Marie Jacquard"',
						url: 'https://www.britannica.com/biography/Joseph-Marie-Jacquard',
					},
				],
			},
			{
				year: '1890',
				title: 'Punched cards count a country',
				line: "Herman Hollerith's electric tabulators process the US Census.",
				sources: [
					{
						name: 'US Census Bureau, "The Hollerith Machine"',
						url: 'https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html',
					},
					{
						name: 'Smithsonian National Museum of American History, "Hollerith Tabulating Machine"',
						url: 'https://www.si.edu/object/hollerith-tabulating-machine:nmah_694410',
					},
				],
			},
			{
				year: '1970',
				title: 'Data gets tables',
				line: 'IBM researcher Edgar F. Codd proposes storing data in simple tables of rows and columns.',
				sources: [
					{
						name: 'E. F. Codd, "A Relational Model of Data for Large Shared Data Banks", ACM Digital Library',
						url: 'https://dl.acm.org/doi/10.1145/362384.362685',
					},
					{
						name: 'Wikipedia, "A Relational Model of Data for Large Shared Data Banks"',
						url: 'https://en.wikipedia.org/wiki/A_Relational_Model_of_Data_for_Large_Shared_Data_Banks',
					},
				],
			},
			{
				year: '1974',
				title: 'SQL is born',
				line: 'At IBM, Chamberlin and Boyce describe SEQUEL, an English-like language for asking questions of tables.',
				sources: [
					{
						name: 'Chamberlin & Boyce, "SEQUEL: A Structured English Query Language", ACM Digital Library',
						url: 'https://dl.acm.org/doi/10.1145/800296.811515',
					},
					{ name: 'Wikipedia, "SQL" (History)', url: 'https://en.wikipedia.org/wiki/SQL' },
				],
			},
			{
				year: '1979',
				title: 'The first personal-computer spreadsheet',
				line: 'VisiCalc turns a personal computer into a business tool.',
				sources: [
					{
						name: 'Dan Bricklin and Bob Frankston, "VisiCalc: Information from its creators"',
						url: 'https://danbricklin.com/visicalc.htm',
					},
					{ name: 'Wikipedia, "VisiCalc"', url: 'https://en.wikipedia.org/wiki/VisiCalc' },
				],
			},
			{
				year: '1985',
				title: 'Excel arrives on the Macintosh',
				line: 'Microsoft ships Excel 1.0 for the Macintosh.',
				sources: [
					{
						name: 'Microsoft (Signal), "Formulas, fandom and an AI-fueled future — Microsoft Excel celebrates 40 years"',
						url: 'https://news.microsoft.com/signal/articles/microsoft-excel-celebrates-40-years/',
					},
					{ name: 'Wikipedia, "Microsoft Excel"', url: 'https://en.wikipedia.org/wiki/Microsoft_Excel' },
				],
			},
			{
				year: '1991',
				title: "Python's first public release",
				line: "Guido van Rossum publishes Python 0.9.0, the language's first public release.",
				sources: [
					{
						name: 'Guido van Rossum, "A Brief Timeline of Python", in The History of Python',
						url: 'https://github.com/eltonlaw/the-history-of-python/raw/refs/heads/master/the-history-of-python.pdf',
					},
					{ name: 'Wikipedia, "History of Python"', url: 'https://en.wikipedia.org/wiki/History_of_Python' },
				],
			},
			{
				year: '2006',
				title: 'Hadoop brings big data open source',
				line: 'Apache Hadoop 0.1.0 is released, spreading data work across many ordinary machines.',
				sources: [
					{
						name: 'Apache Hadoop project, "Release 0.1.0 changelog"',
						url: 'https://hadoop.apache.org/docs/r3.4.0/hadoop-project-dist/hadoop-common/release/0.1.0/CHANGELOG.0.1.0.html',
					},
					{ name: 'Wikipedia, "Apache Hadoop"', url: 'https://en.wikipedia.org/wiki/Apache_Hadoop' },
				],
			},
			{
				year: '2008',
				title: 'pandas brings tables to Python',
				line: 'Wes McKinney starts building pandas at AQR, bringing spreadsheet-style tables to Python.',
				sources: [
					{ name: 'GitHub Readme Stories, "Wes McKinney"', url: 'https://github.com/readme/stories/wes-mckinney' },
					{ name: 'Wikipedia, "Pandas (software)" (History)', url: 'https://en.wikipedia.org/wiki/Pandas_(software)' },
				],
			},
			{
				year: '2012',
				title: 'A job gets a name',
				line: 'Harvard Business Review names data scientist the sexiest job of the 21st century.',
				sources: [
					{
						name: 'Davenport & Patil, "Data Scientist: The Sexiest Job of the 21st Century", Harvard Business Review',
						url: 'https://hbr.org/2012/10/data-scientist-the-sexiest-job-of-the-21st-century',
					},
					{
						name: 'IEEE Spectrum, "Is Data Scientist the Sexiest Job of Our Time?"',
						url: 'https://spectrum.ieee.org/is-data-scientist-the-sexiest-job-of-our-time',
					},
				],
			},
			{
				year: '2017',
				title: 'The Transformer',
				line: "A paper, Attention Is All You Need, introduces the Transformer, the design behind today's AI models.",
				sources: [
					{ name: 'Vaswani et al., "Attention Is All You Need", arXiv:1706.03762', url: 'https://arxiv.org/abs/1706.03762' },
					{
						name: 'NeurIPS 2017 proceedings, "Attention is All you Need"',
						url: 'https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html',
					},
				],
			},
			{
				year: '2022',
				title: 'AI in a chat box',
				line: 'OpenAI releases ChatGPT: a large language model anyone can talk to in a chat box.',
				sources: [
					{ name: 'OpenAI, "Introducing ChatGPT"', url: 'https://openai.com/index/chatgpt/' },
					{ name: 'Simple English Wikipedia, "ChatGPT"', url: 'https://simple.m.wikipedia.org/wiki/ChatGPT' },
				],
			},
		],
		now: {
			year: 'Now',
			title: 'Your turn',
			line: 'Your first spreadsheet, query and script continue the story.',
			cta: 'Start at A1',
		},
		sourcesSummary: 'Sources for these dates',
		accessed: 'Accessed November 16, 2026.',
		primary: 'Primary source',
		second: 'Second source',
	},
	// Copy from the owner-approved mockup (careers.html, 2026-11-17).
	careers: {
		short: '05 Directions',
		label: '05 — Pick a direction',
		heading: 'Four careers. *One start.*',
		more: 'See the path',
		path: ['Excel', 'SQL', 'Python', 'Core'],
		pathLabel: 'Path',
		cta: 'Start at A1',
		careers: [
			{
				key: 'da',
				label: '01 · Data Analyst',
				name: 'Data Analyst',
				line: 'Turns business questions into answers people can act on.',
				figure: 'Bars that rise and fall · a live report',
				does: [
					'Query and clean data with SQL and Python',
					'Define metrics and explain why they moved',
					'Build dashboards and write the recommendation',
				],
				portfolio:
					'Portfolio: one SQL project, one Python project, a published dashboard and a case study that ends in a recommendation.',
			},
			{
				key: 'de',
				label: '02 · Data Engineer',
				name: 'Data Engineer',
				line: 'Builds the pipelines that move data reliably.',
				figure: 'Source tanks, pipes, a transform step and the warehouse',
				does: [
					'Load data from many sources into a warehouse',
					'Make loads incremental and safe to re-run',
					'Add quality checks and schedule the jobs',
				],
				portfolio:
					'Portfolio: two or three deep pipeline projects with layered storage, quality checks, orchestration and an operations note.',
			},
			{
				key: 'ds',
				label: '03 · Data Scientist',
				name: 'Data Scientist',
				line: 'Uses experiments and models to support decisions.',
				figure: 'Two clusters and the plane between them',
				does: ['Test ideas with experiments', 'Build models that start from a baseline', 'Explain the errors and the limits honestly'],
				portfolio: 'Portfolio: case studies on messy data with a baseline, validation, error analysis and honest limits.',
			},
			{
				key: 'ml',
				label: '04 · ML / AI Engineer',
				name: 'ML / AI Engineer',
				line: 'Ships models and AI apps that run in production.',
				figure: 'A network passing signals forward',
				does: [
					'Build reproducible training pipelines',
					'Serve a model or a retrieval (RAG) app behind an API',
					'Evaluate and monitor it after launch',
				],
				portfolio: 'Portfolio: a deployed system with a live URL, an evaluation set, tests in CI and monitoring notes.',
			},
		],
		unsure: {
			heading: 'Not sure which *career fits you?*',
			text: 'Answer ten questions about how you like to work. You get a suggested direction and why. Nothing is saved.',
			cta: 'Take the career quiz',
		},
	},
	footer: {
		content: 'Content CC BY 4.0',
		code: 'Code MIT',
		github: 'GitHub',
		version: 'Version {version}',
	},
};

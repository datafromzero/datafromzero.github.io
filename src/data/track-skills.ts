/**
 * Data for /choose-your-track/ (SPEC D50): how much each of the four careers leans on eight skills, 1 to 5, how much
 * mathematics each track needs, and what people switching careers most often misjudge. A guide, not a measurement.
 *
 * Evidence (research issue #87, 2026-11-20; every figure quoted here was rechecked against its primary source on that day):
 *   [jobs] the site's own sample of 45 job postings (Indeed and LinkedIn; United States, United Kingdom and India; read on
 *          19 November 2026; 10 analyst, 12 engineer, 11 scientist and 12 ML engineer postings). A skill counts only when
 *          the posting names it;
 *   [onet] O*NET OnLine importance ratings, 0 to 100 (Data Scientists, Business Intelligence Analysts, Database Architects,
 *          Data Warehousing Specialists). O*NET has no item for SQL, ML, pipelines, cloud, experiments or visualization,
 *          and no ML engineer occupation;
 *   [ddat] the UK Government Digital and Data Capability Framework role pages (the ML engineer is defined there only at
 *          senior levels);
 *   [sfia] SFIA 9 skill pages.
 * The page links every source; it never links the site's GitHub issues (owner rule, 2026-11-20).
 * The scale: 1 = not needed at the start of the job, the core is enough; 2 = helpful, you meet it now and then;
 * 3 = a regular part of the work; 4 = a main skill; 5 = the skill that defines the role.
 * Scores are whole numbers because the evidence is not finer than that.
 */
export type RoleId = 'da' | 'de' | 'ds' | 'ml';
export type AxisId = 'stats' | 'exp' | 'ml' | 'swe' | 'pipe' | 'sql' | 'biz' | 'viz';

export interface Role {
	id: RoleId;
	short: string;
	name: string;
}

export interface Axis {
	id: AxisId;
	/** Full name for the bars and the reasons. */
	name: string;
	/** Two short lines for the radar. */
	lines: [string, string];
	/** One sentence: what the skill is. */
	about: string;
	/** How sure the evidence is for this row. */
	confidence: 'high' | 'medium' | 'low';
}

export const ROLES: readonly Role[] = [
	{ id: 'da', short: 'DA', name: 'Data Analyst' },
	{ id: 'de', short: 'DE', name: 'Data Engineer' },
	{ id: 'ds', short: 'DS', name: 'Data Scientist' },
	{ id: 'ml', short: 'ML', name: 'ML / AI Engineer' },
];

/** In drawing order, clockwise from the top: the scientist's skills, then the engineer's, then the analyst's. */
export const AXES: readonly Axis[] = [
	{ id: 'stats', name: 'Statistics and math', lines: ['Statistics', '& math'], confidence: 'medium', about: 'Probability, inference and modeling assumptions, and the linear algebra and calculus behind models.' },
	{ id: 'exp', name: 'Experiments and A/B testing', lines: ['Experiments', '& A/B tests'], confidence: 'low', about: 'Designing and reading A/B tests, and telling an effect from a coincidence.' },
	{ id: 'ml', name: 'ML and modeling', lines: ['ML &', 'modeling'], confidence: 'high', about: 'Fitting, validating and explaining predictive models, from regression to deep learning and LLM systems.' },
	{ id: 'swe', name: 'Software engineering', lines: ['Software', 'engineering'], confidence: 'high', about: 'Tested, versioned, reviewed code that other people run: packages, CI, serving.' },
	{ id: 'pipe', name: 'Pipelines, platforms and cloud', lines: ['Pipelines,', 'platforms, cloud'], confidence: 'high', about: 'Ingesting, scheduling, monitoring and recovering data flows on cloud infrastructure.' },
	{ id: 'sql', name: 'SQL and data modeling', lines: ['SQL & data', 'modeling'], confidence: 'high', about: 'Writing analytical SQL and designing the tables it runs on: keys, grain, facts and dimensions.' },
	{ id: 'biz', name: 'Business communication', lines: ['Business', 'communication'], confidence: 'medium', about: 'Scoping a vague request, choosing metrics, and explaining a result to the people who decide.' },
	{ id: 'viz', name: 'Visualization and storytelling', lines: ['Visualization', '& storytelling'], confidence: 'high', about: 'Choosing the chart, building reports and dashboards, and telling the story the numbers support.' },
];

export interface Cell {
	score: 1 | 2 | 3 | 4 | 5;
	/** Why this score: the evidence, one or two sentences. */
	why: string;
}

export const SCORES: Record<RoleId, Record<AxisId, Cell>> = {
	da: {
		stats: { score: 3, why: '[ddat] "Applying statistical and analytical tools and techniques" is a named analyst skill, at its first level for the associate grade. [onet] Mathematics knowledge rates 71 for business intelligence analysts, against 88 for data scientists. [jobs] Only 1 of 10 postings names a statistical technique. Applied, descriptive statistics: 3, not 4.' },
		exp: { score: 2, why: '[jobs] 1 of 10 analyst postings asks for A/B testing. No framework names experiment design as a skill for any role, so this whole row has low confidence.' },
		ml: { score: 1, why: '[jobs] 2 of 10 postings mention light prediction. [ddat] No analyst skill is about models.' },
		swe: { score: 2, why: '[ddat] "Developing code for analysis" is an analyst skill: code exists, engineering craft barely does. [onet] Programming rates 38 for business intelligence analysts, against 60 to 69 for the engineering occupations.' },
		pipe: { score: 2, why: '[jobs] 4 of 10 postings ask for awareness of pipelines or a warehouse, and 4 of 10 name a cloud platform. The track builds dashboards on tables someone else loads.' },
		sql: { score: 4, why: '[jobs] 10 of 10 postings name SQL. Held at 4 because the modeling half is light for analysts and visualization and communication define the role.' },
		biz: { score: 5, why: '[jobs] 9 of 10 postings. [ddat] Two analyst skills are about communication and business impact. [onet] "Interpreting the meaning of information for others" rates 89 for business intelligence analysts, against 63 to 69 for the database occupations.' },
		viz: { score: 5, why: '[jobs] 10 of 10 postings, tied with SQL as the most asked-for skill. [ddat] "Data visualisation" is a named analyst skill. [sfia] Data visualisation is a skill of its own, including storytelling around data.' },
	},
	de: {
		stats: { score: 2, why: '[ddat] No data engineer level, from entry to head of the profession, lists a mathematics or statistics skill. [jobs] 0 of 12 postings. 2 records general numeracy, not statistics.' },
		exp: { score: 1, why: '[jobs] 0 of 12 postings.' },
		ml: { score: 1, why: '[jobs] 1 of 12 postings. The engineer moves data for models and does not build them.' },
		swe: { score: 4, why: '[jobs] 9 of 12 postings name tested code, Git or production-ready code. [ddat] "Programming and build (data and analytics engineering)". [onet] Programming rates 60 to 69. Short of 5 because the work is data first, code second.' },
		pipe: { score: 5, why: '[jobs] Pipelines in 12 of 12 postings, the only skill every posting in the sample names; a cloud platform in 11 of 12. [ddat] "Data integration design" and "Data development process" are core engineer skills. [sfia] Data engineering.' },
		sql: { score: 5, why: '[jobs] 11 of 12 postings. [ddat] "Data modelling" is a named engineer skill at entry level.' },
		biz: { score: 2, why: '[jobs] 0 of 12 postings. [ddat] "Communicating between the technical and non-technical" is listed at its first level for the entry grade: present, small, growing with seniority. [onet] Interpreting information for others rates 63 to 69.' },
		viz: { score: 1, why: '[jobs] 0 of 12 postings. [ddat] No engineer skill is about visualization.' },
	},
	ds: {
		stats: { score: 5, why: '[onet] Mathematics knowledge rates 88, the first knowledge item for the occupation, and the mathematics skill 85: the widest gap in the whole comparison. [jobs] 9 of 11 postings. [ddat] "Applied maths, statistics and scientific practices".' },
		exp: { score: 3, why: '[jobs] 2 of 11 postings, both specialist roles (causal inference, experiment design). Experimentation is a specialism inside data science, not a default entry demand. Low confidence.' },
		ml: { score: 5, why: '[jobs] 11 of 11 postings. [sfia] Data science and machine learning are skills of their own. [onet] Testing and validating models are signature tasks.' },
		swe: { score: 3, why: '[ddat] "Programming and build (data science)". [onet] Programming rates 69. [jobs] Only 1 of 11 postings asks for engineering craft: the code is real but notebook-grade, hence the middle.' },
		pipe: { score: 2, why: '[jobs] 5 of 11 postings ask for pipeline building, only 1 of 11 for a cloud platform. [ddat] "Data engineering" is a scientist skill.' },
		sql: { score: 3, why: '[jobs] 8 of 11 postings: a working requirement, not what sets the role apart.' },
		biz: { score: 4, why: '[ddat] "Delivering business impact". [onet] Interpreting information for others rates 87. [jobs] Only 3 of 11 postings name it: frameworks describe what the job delivers, postings list tools. Medium confidence.' },
		viz: { score: 3, why: '[jobs] 4 of 11 postings. [onet] Visualizing data is a rated task for the occupation.' },
	},
	ml: {
		stats: { score: 4, why: '[ddat] The ML engineer has the same "Applied maths, statistics and scientific practices" skill as the scientist. [jobs] 3 of 12 postings: they ask for frameworks rather than statistics. Master\'s programs in machine learning assume probability, linear algebra and calculus before entry.' },
		exp: { score: 1, why: '[jobs] 0 of 12 postings. Evaluating models is measuring, not experiment design.' },
		ml: { score: 5, why: '[jobs] 12 of 12 postings. [sfia] Machine learning is a skill of its own, with MLOps for deployment and monitoring at its center.' },
		swe: { score: 5, why: '[jobs] 8 of 12 postings, with the strongest wording in the sample: well-tested, documented code, CI/CD and code review. [ddat] "Programming and build (software engineering)" and "Systems integration".' },
		pipe: { score: 4, why: '[jobs] Pipelines in 6 of 12 postings and a cloud platform in 5 of 12, with Docker, Kubernetes and MLOps named. [sfia] MLOps is part of the machine learning skill. Deployment is half of the job.' },
		sql: { score: 2, why: '[jobs] 3 of 12 postings. [ddat] No ML engineer skill is about SQL or data modeling.' },
		biz: { score: 2, why: '[jobs] 0 of 12 postings. [ddat] A communication skill appears only at the senior levels it defines, so it does not raise the entry score.' },
		viz: { score: 1, why: '[jobs] 0 of 12 postings. [ddat] [sfia] No visualization skill for the role.' },
	},
};

/** The scale, for the page. */
export const SCALE: readonly [number, string][] = [
	[1, 'Not needed at the start: the core is enough'],
	[2, 'Helpful: you meet it now and then'],
	[3, 'A regular part of the work'],
	[4, 'A main skill'],
	[5, 'The skill that defines the role'],
];

/** Mathematics needed at entry, per track (research issue #87, section 4). */
export type Depth = 'None' | 'Intuition' | 'Fluency';
export const MATH_TOPICS = ['Probability', 'Inference', 'Linear algebra', 'Calculus', 'Optimization'] as const;
export const DEPTHS: readonly [Depth, string][] = [
	['None', 'not needed at entry'],
	['Intuition', 'read and use results that tools produce'],
	['Fluency', 'work it out by hand and know why it works'],
];
export const MATH: Record<RoleId, { depth: [Depth, Depth, Depth, Depth, Depth]; message: string }> = {
	da: { depth: ['Intuition', 'Intuition', 'None', 'None', 'None'], message: 'Friendly statistics: averages, percentages, charts and reading an A/B test honestly. No calculus, no linear algebra.' },
	de: { depth: ['None', 'None', 'None', 'None', 'None'], message: 'A software job, not a math job. The hard part is code, data modeling and systems.' },
	ds: { depth: ['Fluency', 'Fluency', 'Fluency', 'Intuition', 'Intuition'], message: 'The math track: probability and statistics you can work by hand, plus working linear algebra, learned one topic at a time.' },
	ml: { depth: ['Fluency', 'Fluency', 'Fluency', 'Fluency', 'Fluency'], message: 'The most mathematical track: probability, linear algebra, calculus of several variables and optimization, all at working fluency.' },
};

/** What career switchers most often misjudge (research issue #87, section 5). Each warning names its source. */
export const WARNINGS: readonly { role: RoleId | 'all'; belief: string; reality: string; source: string; href: string }[] = [
	{
		role: 'all',
		belief: 'The headline skill is most of the week.',
		reality: 'Data professionals in a 2022 survey spent about 37.75% of their time preparing and cleaning data, and about 26.44% on all model work together. Reporting and visualization took another large share.',
		source: 'Anaconda, State of Data Science 2022',
		href: 'https://know.anaconda.com/rs/387-XNW-688/images/ANA_2022SODSReport.pdf',
	},
	{
		role: 'da',
		belief: 'The job is analysis and dashboards.',
		reality: 'Much of the time goes before the analysis. The UK framework lists collecting, moving, preparing and managing data as the analyst\'s work alongside analysis, charts and explaining results.',
		source: 'UK Digital and Data Capability Framework: data analyst',
		href: 'https://understand-digital-data-roles-skills.service.gov.uk/role/data-analyst/',
	},
	{
		role: 'de',
		belief: 'It is backend software engineering with different tools.',
		reality: 'The entry-level engineer in the UK framework builds data flows, documents where each field comes from and writes and tunes load code; data modeling is a named skill. The work is judged by whether the data is right.',
		source: 'UK Digital and Data Capability Framework: data engineer',
		href: 'https://understand-digital-data-roles-skills.service.gov.uk/role/data-engineer/',
	},
	{
		role: 'ds',
		belief: 'The job is building models.',
		reality: 'Model work is about a quarter of the week in the same survey; the rest is cleaning data, quick requests and explaining results to people who decide.',
		source: 'Anaconda, State of Data Science 2022',
		href: 'https://know.anaconda.com/rs/387-XNW-688/images/ANA_2022SODSReport.pdf',
	},
	{
		role: 'ml',
		belief: 'It is data science with more models.',
		reality: 'It is software engineering that specializes in machine learning. In a production system the model code is a small part; the job is the system around it and keeping it running.',
		source: 'Sculley et al., Hidden Technical Debt in Machine Learning Systems (NeurIPS 2015)',
		href: 'https://proceedings.neurips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf',
	},
];

/** The sources, linked on the page. Primary sources only (owner rule, 2026-11-20). */
export const EVIDENCE: readonly { tag: string; text: string; links: { label: string; href: string }[] }[] = [
	{
		tag: 'jobs',
		text: 'Our sample of 45 job postings from Indeed and LinkedIn in the United States, the United Kingdom and India, read on 19 November 2026: 10 analyst, 12 engineer, 11 scientist and 12 ML engineer postings. A skill counts only when the posting names it.',
		links: [],
	},
	{
		tag: 'onet',
		text: 'O*NET OnLine, U.S. Department of Labor: importance ratings from 0 to 100.',
		links: [
			{ label: 'Data Scientists', href: 'https://www.onetonline.org/link/details/15-2051.00' },
			{ label: 'Business Intelligence Analysts', href: 'https://www.onetonline.org/link/details/15-2051.01' },
			{ label: 'Database Architects', href: 'https://www.onetonline.org/link/details/15-1243.00' },
			{ label: 'Data Warehousing Specialists', href: 'https://www.onetonline.org/link/details/15-1243.01' },
		],
	},
	{
		tag: 'ddat',
		text: 'UK Government Digital and Data Capability Framework: the skills and levels of each data role.',
		links: [
			{ label: 'Data analyst', href: 'https://understand-digital-data-roles-skills.service.gov.uk/role/data-analyst/' },
			{ label: 'Data engineer', href: 'https://understand-digital-data-roles-skills.service.gov.uk/role/data-engineer/' },
			{ label: 'Data scientist', href: 'https://understand-digital-data-roles-skills.service.gov.uk/role/data-scientist/' },
			{ label: 'ML engineer', href: 'https://understand-digital-data-roles-skills.service.gov.uk/role/machine-learning-engineer/' },
		],
	},
	{
		tag: 'sfia',
		text: 'SFIA 9, the Skills Framework for the Information Age.',
		links: [
			{ label: 'Data visualisation', href: 'https://sfia-online.org/en/sfia-9/skills/data-visualisation' },
			{ label: 'Machine learning', href: 'https://sfia-online.org/en/sfia-9/skills/machine-learning' },
			{ label: 'Data engineering', href: 'https://sfia-online.org/en/sfia-9/skills/data-engineering' },
			{ label: 'Data science', href: 'https://sfia-online.org/en/sfia-9/skills/data-science' },
		],
	},
];

/** Sources for the mathematics table. */
export const MATH_SOURCES: readonly { label: string; href: string }[] = [
	{ label: 'O*NET: Data Scientists (mathematics; education of new hires)', href: 'https://www.onetonline.org/link/details/15-2051.00' },
	{ label: 'UK Digital and Data Capability Framework: data engineer', href: 'https://understand-digital-data-roles-skills.service.gov.uk/role/data-engineer/' },
	{ label: 'Carnegie Mellon University: MS in Machine Learning', href: 'https://ml.cmu.edu/academics/primary-ms-machine-learning-masters' },
	{ label: 'Georgia Tech: Online MS in Analytics, admission', href: 'https://www.analytics.gatech.edu/admissions' },
	{ label: 'University of Wisconsin–Madison: MS in Data Engineering', href: 'https://pdc.wisc.edu/degrees/data-engineering-ms/' },
];


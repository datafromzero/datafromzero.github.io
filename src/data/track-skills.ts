/**
 * Scores for the "Choose your track" chart (SPEC D49, /choose-your-track/): how much each of the four careers
 * leans on seven skills, 1 to 5. A guide drawn from the research behind the site, not a measurement.
 *
 * How a score is derived. Each cell starts from the strongest direct evidence for it and is then checked against the
 * other sources; where they disagree the cell takes the lower score and says so. The sources are
 *   [71] research issue #71, section 3 (skills by role at entry level, from 12 named postings, O*NET and the DE Zoomcamp);
 *   [32] research issue #32, section 3 (O*NET interest and work-activity ratings for the four occupation clusters);
 *   [73] research issue #73, section 1 (what interviews for each role test: algorithms, SQL, system design);
 *   [map] `research/curriculum/06-curriculum-map.yaml`, the track lessons themselves (how many of a track's lessons
 *         teach the skill, and how deeply).
 * The scale: 1 = not needed at the start of the job, the core is enough; 2 = helpful, you meet it now and then;
 * 3 = a regular part of the work; 4 = a main skill; 5 = the skill that defines the role.
 * Scores are whole numbers because the evidence is not finer than that.
 */
export type RoleId = 'da' | 'de' | 'ds' | 'ml';
export type AxisId = 'stats' | 'exp' | 'ml' | 'swe' | 'sql' | 'pipe' | 'biz';

export interface Role {
	id: RoleId;
	short: string;
	name: string;
}

export interface Axis {
	id: AxisId;
	/** Full name for the table. */
	name: string;
	/** Two short lines for the chart. */
	lines: [string, string];
	/** One sentence: what the skill is. */
	about: string;
}

export const ROLES: readonly Role[] = [
	{ id: 'da', short: 'DA', name: 'Data Analyst' },
	{ id: 'de', short: 'DE', name: 'Data Engineer' },
	{ id: 'ds', short: 'DS', name: 'Data Scientist' },
	{ id: 'ml', short: 'ML', name: 'ML / AI Engineer' },
];

/** In drawing order, clockwise from the top. */
export const AXES: readonly Axis[] = [
	{ id: 'stats', name: 'Statistics and math', lines: ['Statistics', '& math'], about: 'Probability, inference, modeling assumptions, and the linear algebra and calculus behind models.' },
	{ id: 'exp', name: 'Experiments and causality', lines: ['Experiments', '& causality'], about: 'Designing and reading A/B tests, and telling an effect from a coincidence.' },
	{ id: 'ml', name: 'ML and modeling', lines: ['ML &', 'modeling'], about: 'Fitting, validating and explaining predictive models, from regression to deep learning and LLM systems.' },
	{ id: 'swe', name: 'Software engineering', lines: ['Software', 'engineering'], about: 'Tested, versioned, reviewed code that other people run: packages, CI, serving, algorithms.' },
	{ id: 'pipe', name: 'Pipelines and platforms', lines: ['Pipelines &', 'platforms'], about: 'Ingesting, scheduling, monitoring and recovering data flows on cloud infrastructure.' },
	{ id: 'sql', name: 'SQL and data modeling', lines: ['SQL & data', 'modeling'], about: 'Writing analytical SQL and designing the tables it runs on: keys, grain, facts and dimensions.' },
	{ id: 'biz', name: 'Business communication', lines: ['Business', 'communication'], about: 'Scoping a vague request, choosing metrics, and explaining a result to people who decide.' },
];

export interface Cell {
	score: 1 | 2 | 3 | 4 | 5;
	/** Why this score: the evidence, one or two sentences. */
	why: string;
}

export const SCORES: Record<RoleId, Record<AxisId, Cell>> = {
	da: {
		stats: { score: 2, why: '[32] mathematics and statistics interest is 56 to 69 for analysts, against 98 to 100 for scientists. [map] No Data Analyst lesson is a statistics lesson; the core already carries the statistics they use.' },
		exp: { score: 3, why: '[map] The track reads A/B results end to end, retention and period-over-period change. [71] No posting asks an analyst to design experiments from scratch.' },
		ml: { score: 1, why: '[map] None of the 13 Data Analyst lessons fits a model. [32] No analyst occupation names modeling as a signature task.' },
		swe: { score: 2, why: '[71] Terminal, Git, project layout and command-line arguments are "helpful" for analysts; testing and Docker are not expected. [73] Algorithms are the smallest part of an analyst interview.' },
		pipe: { score: 1, why: '[71] Docker, CI/CD and pipeline validation are not expected of an analyst at entry. [map] The track builds dashboards on tables someone else loads.' },
		sql: { score: 4, why: '[map] Segments, cohorts, retention, a BI model and a KPI layer are SQL and modeling work. [73] Analyst interviews are SQL first. [71] Grain and facts are "helpful", not an engineer\'s depth.' },
		biz: { score: 5, why: '[32] Enterprising interest is 57 to 75, the highest of the four; the signature task is reports for executives, managers and clients, and "interpreting information for others" rates 87 to 95. [map] Five of 13 lessons are scoping, dashboards, a KPI dictionary and a portfolio memo.' },
	},
	de: {
		stats: { score: 1, why: '[32] Mathematics and statistics interest is only 37 to 50 for engineers, the inverse of the scientist profile. [map] No Data Engineer lesson teaches statistics.' },
		exp: { score: 1, why: '[map] None of the 20 Data Engineer lessons is about experiments. [71] Nothing in the role matrix asks for it.' },
		ml: { score: 1, why: '[map] The track moves data for models and does not build them. [71] No modeling skill is listed for engineers.' },
		swe: { score: 4, why: '[71] Terminal, Git and testing are "required" for engineers; Docker is "required"; CI/CD is track-only. [73] Interviews add algorithms, hand-built structures and Big-O. [map] Pipelines as testable functions, CI for dbt. Short of 5 because the work is data first, code second.' },
		pipe: { score: 5, why: '[32] The signature tasks are warehouse process models, scalability, security and reliability. [map] Ingestion, incremental loads, orchestration, backfills, streaming and Spark: 12 of 20 lessons.' },
		sql: { score: 5, why: '[32] Information technology interest is 93 to 95 with database architecture as a signature task. [71] Data validation is "required". [map] Dimensional models, slowly changing dimensions and dbt layers.' },
		biz: { score: 2, why: '[32] "Interpreting the meaning of information for others" rates only 62 to 63 for database roles, against 87 to 95 for analysts and scientists. [map] One capstone lesson asks for a defended design.' },
	},
	ds: {
		stats: { score: 5, why: '[32] Investigative interest 100; mathematics and statistics interest 98 (data scientists) and 100 (statisticians), the ceiling of the set. [map] Regularization, cross-validation and forecasting lean on it.' },
		exp: { score: 4, why: '[map] Analyzing experiments in Python and a model-to-decision case study. [32] Tolerance for ambiguity is 66, the highest: the role lives with uncertain answers. Held at 4 because experiment design is shared with analysts.' },
		ml: { score: 4, why: '[32] The signature task found nowhere else is to test, validate and reformulate models. [map] Ten of 12 lessons fit and judge classical models. Below the ML engineer because deep learning and LLM systems are not in this track.' },
		swe: { score: 3, why: '[71] Testing and Git are "required" for scientists, and code review is named in 2 of 3 postings. [map] The track has no packaging or deployment lesson.' },
		pipe: { score: 1, why: '[71] Docker is "helpful" at most and CI/CD is not expected. [map] No Data Scientist lesson builds or runs a pipeline.' },
		sql: { score: 3, why: '[71] SQL from Python is "helpful" for scientists. [map] The track uses tables as inputs and does not design them.' },
		biz: { score: 4, why: '[32] "Interpreting the meaning of information for others" rates 87 to 95 for scientists. [map] A model-to-decision case study and a track built around recommending an action.' },
	},
	ml: {
		stats: { score: 3, why: '[map] Linear algebra and calculus are planned as a math block at the start of the track (SPEC D44), and evaluation needs statistics. [32] The engineering profile sits at 37 to 50 on mathematics, so the score stays at 3.' },
		exp: { score: 2, why: '[map] The track tracks runs and evaluates LLM and RAG systems, which is measuring, not causal inference. [71] No experiment-design skill is listed.' },
		ml: { score: 5, why: '[map] Neural networks, training practice, embeddings, LLM APIs, retrieval, agents and evaluation: 10 of 12 lessons. [32] Innovation rates 84, the highest of the set.' },
		swe: { score: 5, why: '[71] Docker is "required", testing and CI/CD presuppose Git; the role is software that other people run. [32] Engineering interest is 61 against 13 or less elsewhere. [73] The heaviest interview loop: algorithms through dynamic programming.' },
		pipe: { score: 3, why: '[map] Serving behind an API, monitoring, drift and retraining are platform work. [71] Docker and CI/CD are track-only here, so it stays at 3, below the data engineer.' },
		sql: { score: 2, why: '[71] SQL from Python is "helpful". [map] No ML Engineer lesson is about tables; data arrives from the engineers.' },
		biz: { score: 2, why: '[32] The engineering cluster rates 62 to 63 on interpreting information for others. [map] The track ends in a working system, not a decision memo.' },
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

/** The sources, linked on the page. `issue` numbers resolve against the repository's issues. */
export const EVIDENCE: readonly { tag: string; issue: number | null; text: string }[] = [
	{ tag: '71', issue: 71, text: 'Skills by role at entry level: 12 named job postings, O*NET occupation pages and the Data Engineering Zoomcamp prerequisites.' },
	{ tag: '32', issue: 32, text: 'The career quiz research: O*NET interest and work-activity ratings, 0 to 100, for the four occupation clusters.' },
	{ tag: '73', issue: 73, text: 'What interviews for each role test: algorithms, SQL, system design (Meta, Tech Interview Handbook, DataLemur, Dataquest).' },
	{ tag: 'map', issue: null, text: 'The track lessons in the curriculum map, counted by what each teaches and how deeply.' },
];

/** The plain-language description of the chart for assistive technology. */
export function chartDescription(): string {
	return (
		'A radar chart with seven spokes, scored 1 to 5, for four roles. ' +
		ROLES.map((r) => `${r.name}: ` + AXES.map((a) => `${a.name} ${SCORES[r.id][a.id].score}`).join(', ')).join('. ') +
		'.'
	);
}

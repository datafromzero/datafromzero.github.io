/**
 * The printable completion page (SPEC D69, `/completion/`): for each career, the capstone and the artifacts a learner
 * attaches to the printed page. The lists copy the hand-in lists of the four capstone lessons; `tests/career-route.test.ts`
 * checks that every capstone exists, is published and carries the title written here.
 */

export interface CompletionTrack {
	/** The stage id, which is also the folder of the lessons. */
	id: 'data-analyst' | 'data-engineer' | 'data-scientist' | 'ml-engineer';
	/** The name on the page: "I completed the datafromzero {name} roadmap." */
	name: string;
	capstone: { code: string; title: string; href: string; handIn: string };
	artifacts: string[];
}

export const COMPLETION_TRACKS: readonly CompletionTrack[] = [
	{
		id: 'data-analyst',
		name: 'Data Analyst',
		capstone: { code: 'DA17', title: 'Capstone: a dashboard project and case study', href: '/data-analyst/portfolio-case-study/', handIn: '#deliverables' },
		artifacts: [
			'The cleaning log',
			'The dashboard (a public link)',
			'The KPI entries',
			'The checks, with one dated run',
			'The one-page case study',
			'The AI verification log',
			'The explain-back (about 100 words)',
		],
	},
	{
		id: 'data-engineer',
		name: 'Data Engineer',
		capstone: { code: 'DE18', title: 'Capstone: a pipeline repo someone else can run', href: '/data-engineer/analytics-platform-capstone/', handIn: '#the-brief' },
		artifacts: [
			'The clean-clone run and its output',
			'The README (grain and keys, backfill story, cost note, limits)',
			'The tests and the CI workflow',
			'The three questions answered in SQL',
			'The run book',
			'The AI verification log and the explain-back',
		],
	},
	{
		id: 'data-scientist',
		name: 'Data Scientist',
		capstone: { code: 'DS16', title: 'Capstone: from model to decision', href: '/data-scientist/decision-product-case-study/', handIn: '#deliverables' },
		artifacts: [
			'The framing page',
			'The baselines, the model and its evaluation',
			'The error analysis and the limits',
			'The plan on paper: make, watch, retrain, undo',
			'The one-page decision memo',
			'The AI verification log',
			'The explain-back (about 40 words)',
		],
	},
	{
		id: 'ml-engineer',
		name: 'ML / AI Engineer',
		capstone: { code: 'MLE16', title: 'Capstone: ship it and prove it works', href: '/ml-engineer/ml-capstone/', handIn: '#the-brief' },
		artifacts: [
			'The context pack',
			'The system behind an endpoint',
			'The evaluation report',
			'The cost line',
			'The ship or no-ship memo',
			'The AI verification log and the explain-back',
		],
	},
];

/** The author's message, as it appears on the career pages and on the completion page. */
export const CERTIFICATE_MESSAGE =
	'A certificate has no value if you do not have personal projects that fit what employers need, and the skills and way of thinking to back them up. However strong the issuer is, if your ability does not yet fit or meet the job, the certificate is worth nothing.';

/** The line that must be on the page, in these words (owner decision, 2026-11-27). */
export const NOT_VERIFIED = 'This page is not a verified certificate. datafromzero has no accounts and does not check who finished.';

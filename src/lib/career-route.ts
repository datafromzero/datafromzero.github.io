/**
 * The hours of a career route and the analytics-engineer route (SPEC D69). Pure TypeScript, no Astro imports: the
 * script `scripts/career-route.ts` (table and `--check`) and `tests/career-route.test.ts` share it.
 *
 * A route is every published lesson of the four foundation stages (Excel / Sheets, SQL, Python, advanced core) plus
 * the main path of one career track, from the first Excel lesson to the track's capstone. A track's optional deep
 * dive (`DEEP_DIVES`) is not on the route. The minutes are the `duration` of each lesson, which the duration model of
 * D65 sets, so the numbers on the career pages move with the lessons; `npm run check:career-route` fails when a page
 * states other numbers.
 */
import { DEEP_DIVES, ROADMAP_STAGES, isDeepDive, lessonCode } from './roadmap.ts';

export interface RouteLesson {
	id: string;
	stage: string;
	order: number;
	/** Minutes, as stated in the lesson's frontmatter. */
	duration: number;
	status: string;
	title: string;
	prerequisites: string[];
	/** The file name without its extension, the last part of the lesson's URL. */
	slug?: string;
}

/** The four stages every learner studies before a career track. */
export const FOUNDATION_STAGES = ['excel', 'sql', 'python', 'core'] as const;
export const TRACKS = ['data-analyst', 'data-engineer', 'data-scientist', 'ml-engineer'] as const;
export type Track = (typeof TRACKS)[number];

/** The two paces the career pages state, in hours a week. */
export const PACES = [5, 10] as const;

const stageTitle = (id: string) => ROADMAP_STAGES.find((s) => s.id === id)?.title ?? id;
export const published = (l: RouteLesson) => l.status === 'published';
export const sumMinutes = (list: readonly RouteLesson[]) => list.reduce((t, l) => t + l.duration, 0);

/** Published lessons of a stage on the route: the whole stage, but not a deep dive. */
export function mainPath(stage: string, lessons: readonly RouteLesson[]): RouteLesson[] {
	return lessons
		.filter((l) => l.stage === stage && published(l) && !isDeepDive(stage, l.order))
		.sort((a, b) => a.order - b.order);
}

/** The optional deep dive of a stage (published and draft), or an empty list. */
export function deepDive(stage: string, lessons: readonly RouteLesson[]): RouteLesson[] {
	return lessons.filter((l) => l.stage === stage && isDeepDive(stage, l.order)).sort((a, b) => a.order - b.order);
}

/** Whole weeks at a pace, rounded up: a part week still takes a week. */
export function weeksAt(minutes: number, hoursPerWeek: number): number {
	return Math.ceil(minutes / 60 / hoursPerWeek);
}

export interface RouteFacts {
	track: Track;
	lessons: number;
	minutes: number;
	/** Whole hours, rounded. */
	hours: number;
	weeks: Record<number, number>;
	breakdown: { stage: string; title: string; lessons: number; minutes: number; hours: number }[];
	/** The optional deep dive left out, when the track has one. */
	excluded: { title: string; lessons: number; minutes: number; drafts: number } | null;
	/** The capstone, the last lesson of the main path. */
	capstone: RouteLesson;
}

export function routeFacts(track: Track, lessons: readonly RouteLesson[]): RouteFacts {
	const stages = [...FOUNDATION_STAGES, track];
	const breakdown = stages.map((stage) => {
		const list = mainPath(stage, lessons);
		const minutes = sumMinutes(list);
		return { stage, title: stageTitle(stage), lessons: list.length, minutes, hours: Math.round(minutes / 60) };
	});
	const minutes = breakdown.reduce((t, b) => t + b.minutes, 0);
	const dd = deepDive(track, lessons);
	const trackMain = mainPath(track, lessons);
	return {
		track,
		lessons: breakdown.reduce((t, b) => t + b.lessons, 0),
		minutes,
		hours: Math.round(minutes / 60),
		weeks: Object.fromEntries(PACES.map((p) => [p, weeksAt(minutes, p)])),
		breakdown,
		excluded: dd.length
			? { title: DEEP_DIVES[track].title, lessons: dd.length, minutes: sumMinutes(dd), drafts: dd.filter((l) => !published(l)).length }
			: null,
		capstone: trackMain[trackMain.length - 1],
	};
}

const fmt = (n: number) => n.toLocaleString('en-US');
/** `13 h 55 min`: whole hours and minutes, so the rows of a table add up exactly. */
export const hoursAndMinutes = (minutes: number) => `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`;

/** The strings a career page must contain for its numbers to be the computed ones. */
export function expectedStrings(f: RouteFacts): string[] {
	return [
		`${f.hours} hours`,
		`${fmt(f.minutes)} minutes`,
		`${f.lessons} lessons`,
		...PACES.map((p) => `${f.weeks[p]} weeks at ${p} hours a week`),
		...f.breakdown.map((b) => `| ${b.title} | ${b.lessons} | ${fmt(b.minutes)} | ${hoursAndMinutes(b.minutes)} |`),
		`| Total | ${f.lessons} | ${fmt(f.minutes)} | ${hoursAndMinutes(f.minutes)} |`,
		...(f.excluded ? [`${f.excluded.lessons} lessons, ${f.excluded.minutes} minutes`] : []),
	];
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* The analytics-engineer route: from the Data Analyst track into dbt, starting at DE9 with a checkpoint.            */
/* ---------------------------------------------------------------------------------------------------------------- */

/**
 * Data Analyst lessons whose ideas dbt automates: the trusted table (DA7), the star under a dashboard (DA9), the metric
 * definitions (DA11) and the checks (DA12), with the lessons they list as prerequisites inside the track (DA1, DA8a, DA10).
 */
export const AE_DA = [
	'data-analyst-the-analysts-loop',
	'data-analyst-messy-data-cleaning-story',
	'data-analyst-dashboard-design',
	'data-analyst-bi-modeling-for-dashboards',
	'data-analyst-first-bi-dashboard',
	'data-analyst-metrics-and-kpi-dictionary',
	'data-analyst-keeping-a-dashboard-right',
];
/** The Data Engineer lesson that sets up the starter repository and names the three layers. */
export const AE_SETUP = ['data-engineer-role-and-lifecycle'];
/** The dbt lessons of the Data Engineer track, in study order: DE9, DE10, DE11a, DE11b, DE13, DE14. */
export const AE_DBT = [
	'data-engineer-dbt-project-and-first-model',
	'data-engineer-dbt-tests-and-documentation',
	'data-engineer-materializations-and-incremental-models',
	'data-engineer-jinja-and-macros',
	'data-engineer-dimensional-models-and-scd',
	'data-engineer-ci-and-deployment-for-dbt',
];
/** Lessons the dbt lessons refer back to in their warm-ups and comparisons; read the part they link, or study them. */
export const AE_BACK = [
	'data-engineer-file-formats-and-partitioning',
	'data-engineer-incremental-loads-idempotency',
	'data-engineer-data-quality-checks',
	'data-engineer-quality-gates-stop-or-quarantine',
];

export interface AeRoute {
	da: RouteLesson[];
	setup: RouteLesson[];
	dbt: RouteLesson[];
	back: RouteLesson[];
	/** Foundation lessons that the set-up, dbt and read-back lessons list as prerequisites (direct ones only). */
	foundation: RouteLesson[];
	/** Data Engineer lessons skipped between DE1 and DE9 and not in `back`. */
	skipped: RouteLesson[];
	minutes: { da: number; setup: number; dbt: number; back: number; foundation: number };
}

export function aeRoute(lessons: readonly RouteLesson[]): AeRoute {
	const byId = new Map(lessons.map((l) => [l.id, l]));
	const pick = (ids: string[]) =>
		ids.map((id) => {
			const l = byId.get(id);
			if (!l) throw new Error(`analytics-engineer route: no lesson ${id}`);
			return l;
		});
	const da = pick(AE_DA);
	const setup = pick(AE_SETUP);
	const dbt = pick(AE_DBT);
	const back = pick(AE_BACK);
	// The direct prerequisites, in the foundation stages, of the set-up, dbt and read-back lessons. Only the direct ones:
	// followed all the way down, the prerequisites of any dbt lesson reach most of the 133 foundation lessons.
	const need = new Set<string>();
	for (const l of [...setup, ...dbt, ...back]) {
		for (const p of l.prerequisites) {
			const q = byId.get(p);
			if (q && (FOUNDATION_STAGES as readonly string[]).includes(q.stage)) need.add(p);
		}
	}
	const foundation = [...need].map((id) => byId.get(id)!).sort((a, b) => FOUNDATION_STAGES.indexOf(a.stage as never) - FOUNDATION_STAGES.indexOf(b.stage as never) || a.order - b.order);
	const onRoute = new Set([...setup, ...dbt, ...back].map((l) => l.id));
	const lastDbt = Math.max(...dbt.map((l) => l.order));
	const skipped = mainPath('data-engineer', lessons).filter((l) => l.order < lastDbt && !onRoute.has(l.id));
	return {
		da,
		setup,
		dbt,
		back,
		foundation,
		skipped,
		minutes: { da: sumMinutes(da), setup: sumMinutes(setup), dbt: sumMinutes(dbt), back: sumMinutes(back), foundation: sumMinutes(foundation) },
	};
}

export const code = (l: RouteLesson) => lessonCode(l.stage, l.order) ?? `${l.stage}:${l.order}`;

export const href = (l: RouteLesson) => `/${l.stage}/${l.slug}/`;

/** The summary rows of the analytics-engineer section of the Data Analyst page, as the page must state them. */
export function aeSummaryRows(ae: AeRoute): string[] {
	const row = (name: string, list: RouteLesson[], minutes: number) => `| ${name} | ${list.length} | ${fmt(minutes)} | ${hoursAndMinutes(minutes)} |`;
	return [
		row('Data Analyst lessons to have done', ae.da, ae.minutes.da),
		row('Set up the starter', ae.setup, ae.minutes.setup),
		row('dbt lessons', ae.dbt, ae.minutes.dbt),
		row('Read back', ae.back, ae.minutes.back),
		row('Direct prerequisites in Excel, SQL, Python and the core', ae.foundation, ae.minutes.foundation),
	];
}

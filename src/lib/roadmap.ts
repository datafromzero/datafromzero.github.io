/**
 * Roadmap for /start/ (SPEC §3.1) and lesson codes. Pure TypeScript: no Astro imports, so the build and the unit
 * tests share it. The page shows the stages as a short vertical rail; each stage with published lessons is a
 * native <details> that opens on its numbered lesson list, so a learner sees the big steps first.
 *
 * Lesson codes (E1, S12, DA3…) are a stage prefix plus `order / 10`. Orders use gaps of 10 (SPEC §5.1) so a lesson
 * can be inserted at order 25 (code E2b, the "b" of E2) while it is a draft; when a stage is published the owner renumbers it to
 * whole codes (the SQL stage did, D34) or keeps the "b" codes (the Data Engineer stage did, D55). Codes are labels only, never part of a URL.
 */

export interface StageDef {
	id: string;
	title: string;
	/** Prefix of the lesson codes in this stage. */
	code: string;
	branch: boolean;
}

export const ROADMAP_STAGES: readonly StageDef[] = [
	{ id: 'excel', title: 'Excel / Sheets', code: 'E', branch: false },
	{ id: 'sql', title: 'SQL', code: 'S', branch: false },
	{ id: 'python', title: 'Python', code: 'P', branch: false },
	{ id: 'core', title: 'Advanced core', code: 'C', branch: false },
	{ id: 'data-analyst', title: 'Data Analyst', code: 'DA', branch: true },
	{ id: 'data-engineer', title: 'Data Engineer', code: 'DE', branch: true },
	{ id: 'data-scientist', title: 'Data Scientist', code: 'DS', branch: true },
	{ id: 'ml-engineer', title: 'ML / AI Engineer', code: 'MLE', branch: true },
];

/**
 * One-page cheatsheets (SPEC D44): a stage with an entry here has a printable page at `href`, linked from the sidebar
 * (after the stage's lessons) and from the stage on /start/. SQL first, then Excel, then Python; the other stages add one line when built.
 */
export const CHEATSHEETS: Readonly<Record<string, { label: string; href: string }>> = {
	sql: { label: 'SQL in a nutshell', href: '/sql/cheatsheet/' },
	excel: { label: 'Excel in a nutshell', href: '/excel/cheatsheet/' },
	python: { label: 'Python in a nutshell', href: '/python/cheatsheet/' },
};

/**
 * Optional deep dives (SPEC D55): lessons of a stage whose `order` is at least `fromOrder` form a separate, labeled
 * group after the main path. No schema field: the order band is the marker. The sidebar, /start/ and the lesson
 * header read this one constant; no main-path lesson may depend on a deep-dive lesson (`npm run check:graph`).
 */
export interface DeepDiveDef {
	fromOrder: number;
	title: string;
	note: string;
}

export const DEEP_DIVES: Readonly<Record<string, DeepDiveDef>> = {
	'data-engineer': { fromOrder: 200, title: 'Deep dive: database internals', note: 'Optional, not required for a first job.' },
	'ml-engineer': { fromOrder: 200, title: 'Deep dive: deep learning and NLP', note: 'Optional, not required for a first job.' },
};

/** True when a lesson of `stage` with this `order` sits in the stage's deep dive. */
export function isDeepDive(stage: string, order: number): boolean {
	const d = DEEP_DIVES[stage];
	return d !== undefined && order >= d.fromOrder;
}

/** The label shown for a deep dive: its title, then the note. */
export function deepDiveLabel(stage: string): string | undefined {
	const d = DEEP_DIVES[stage];
	return d && `${d.title}. ${d.note}`;
}

/**
 * Lessons split into parts, by stage: each group lists the orders of the parts, first part first. All parts of a
 * group sit in one band of ten (80 and 85; three parts would be 80, 83 and 86) and read as that number plus a
 * letter: DA8a, DA8b, and DA8c, DA8d ... for more parts (owner decision, 2026-11-25). `tests/roadmap.test.ts`
 * checks that this list matches the lessons in `src/content/docs`.
 */
export const SPLITS: Record<string, readonly (readonly number[])[]> = {
	python: [[220, 225]],
	'data-analyst': [[80, 85]],
	'data-engineer': [
		[60, 65],
		[110, 115],
		[250, 255],
	],
};

/** The code of a lesson, e.g. `lessonCode('excel', 80)` is `E8` and `lessonCode('data-analyst', 85)` is `DA8b`; `undefined` for an unknown stage. */
export function lessonCode(stage: string, order: number): string | undefined {
	const def = ROADMAP_STAGES.find((s) => s.id === stage);
	if (!def) return undefined;
	for (const group of SPLITS[stage] ?? []) {
		const i = group.indexOf(order);
		if (i >= 0) return `${def.code}${Math.floor(group[0] / 10)}${'abcdefghij'[i]}`;
	}
	const n = order / 10;
	if (Number.isInteger(n)) return `${def.code}${n}`;
	// A half order not yet listed in SPLITS still reads as "b" (65 after 60).
	if (Number.isInteger(n - 0.5)) return `${def.code}${n - 0.5}b`;
	return `${def.code}${Number(n.toFixed(2))}`;
}

/** A published (or deprecated) lesson as the roadmap needs it. */
export interface MapLesson {
	id: string;
	title: string;
	/** One-line name for lists (D47); falls back to the title. */
	short_title?: string;
	stage: string;
	order: number;
	href: string;
	prerequisites: string[];
	status: string;
}

export interface RoadmapLesson {
	id: string;
	code: string;
	title: string;
	/** One-line name for lists (D47): the short title when there is one, else the title. */
	label: string;
	href: string;
	/** True for a lesson in the stage's optional deep dive (`DEEP_DIVES`). */
	deepDive: boolean;
	/** Codes of the prerequisites that are on the roadmap (other stages included), in the frontmatter order. */
	needs: string[];
}

export interface RoadmapStage {
	id: string;
	title: string;
	/** "01" … "08". */
	number: string;
	/** Landing page, only when it exists (links must not break). */
	href: string | null;
	branch: boolean;
	/** All lessons in order, main path first, then the deep dive (`deepDive: true`) when the stage has one. */
	lessons: RoadmapLesson[];
	/** The stage's deep-dive label, when it has one. */
	deepDiveLabel: string | null;
}

/**
 * @param lessons published and deprecated lessons (English); drafts are never passed in.
 * @param landings stage ids whose landing page exists.
 */
export function groupRoadmap(lessons: MapLesson[], landings: ReadonlySet<string>, stages: readonly StageDef[] = ROADMAP_STAGES): RoadmapStage[] {
	const codeOf = new Map(lessons.map((l) => [l.id, lessonCode(l.stage, l.order) ?? l.id]));
	return stages.map((s, i) => ({
		id: s.id,
		title: s.title,
		number: String(i + 1).padStart(2, '0'),
		href: landings.has(s.id) ? `/${s.id}/` : null,
		branch: s.branch,
		deepDiveLabel: deepDiveLabel(s.id) ?? null,
		lessons: lessons
			.filter((l) => l.stage === s.id)
			.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
			.map((l) => ({
				id: l.id,
				code: codeOf.get(l.id)!,
				title: l.title,
				label: l.short_title ?? l.title,
				href: l.href,
				deepDive: isDeepDive(l.stage, l.order),
				needs: l.prerequisites.filter((p) => codeOf.has(p)).map((p) => codeOf.get(p)!),
			})),
	}));
}

/**
 * The lesson to read after `id` (SPEC D35): the next one by `order` in the same stage, else the first lesson of the
 * next stage that has lessons, in roadmap order. `undefined` after the last lesson or for an unknown id.
 */
export function nextLesson(stages: readonly RoadmapStage[], id: string): RoadmapLesson | undefined {
	const all = stages.flatMap((s) => s.lessons);
	const i = all.findIndex((l) => l.id === id);
	return i < 0 ? undefined : all[i + 1];
}

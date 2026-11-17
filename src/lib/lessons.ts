import { getCollection } from 'astro:content';
import { classify, STAGES, type Lesson } from './content-schemas.ts';
import { unlocks } from './graph.ts';
import { groupRoadmap, lessonCode } from './roadmap.ts';

export interface LessonLink {
	id: string;
	title: string;
	href: string;
	/** Short code such as E8 (src/lib/roadmap.ts). */
	code?: string;
}

/** Lesson links for the given ids, in the reader's locale (`vi` pages link under /vi/). */
export async function lessonLinks(ids: string[], locale: string | undefined): Promise<LessonLink[]> {
	if (!ids.length) return [];
	const prefix = locale === 'vi' ? '/vi' : '';
	const docs = await getCollection('docs');
	return ids.map((id) => {
		const matches = docs.filter((d) => classify(d.id).kind === 'lesson' && (d.data as Lesson).id === id);
		// Prefer the translated title when the reader's locale has one; the URL is the same either way.
		const entry =
			matches.find((d) => classify(d.id).locale === (locale === 'vi' ? 'vi' : null)) ??
			matches.find((d) => classify(d.id).locale === null)!;
		const l = entry.data as Lesson;
		return { id, title: entry.data.title, href: `${prefix}/${classify(entry.id).path}/`, code: lessonCode(l.stage, l.order) };
	});
}

let unlocksMemo: Promise<Map<string, string[]>> | undefined;
/** Reverse prerequisite edges, computed once per build/process (the collection does not change while rendering). */
function unlocksMap() {
	unlocksMemo ??= getCollection('docs').then((docs) =>
		unlocks(
			docs
				.filter((d) => classify(d.id).kind === 'lesson' && classify(d.id).locale === null)
				.map((d) => {
					const l = d.data as Lesson;
					return { id: l.id, kind: 'lesson' as const, file: d.id, stage: l.stage, order: l.order, status: l.status, prerequisites: l.prerequisites };
				}),
			STAGES,
		),
	);
	return unlocksMemo;
}

/** Lessons that list `id` as a prerequisite ("unlocks next"), drafts excluded, in the reader's locale. */
export async function unlockedLessons(id: string, locale: string | undefined): Promise<LessonLink[]> {
	return lessonLinks((await unlocksMap()).get(id) ?? [], locale);
}

/**
 * The first published English lesson in roadmap order (E1), for "where to begin" links; with `stage`, the first
 * published lesson of that stage only. `undefined` when none is published.
 */
export async function firstLesson(stage?: string): Promise<LessonLink | undefined> {
	const docs = await getCollection('docs');
	const lessons = docs
		.filter((d) => {
			const c = classify(d.id);
			return c.kind === 'lesson' && c.locale === null && (d.data as Lesson).status === 'published';
		})
		.map((d) => {
			const l = d.data as Lesson;
			return { id: l.id, title: d.data.title, stage: l.stage, order: l.order, href: `/${classify(d.id).path}/`, prerequisites: [], status: l.status };
		});
	const first = groupRoadmap(lessons, new Set()).find((s) => s.lessons.length > 0 && (!stage || s.id === stage))?.lessons[0];
	return first && { id: first.id, title: first.title, href: first.href, code: first.code };
}

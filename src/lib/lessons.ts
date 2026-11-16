import { getCollection } from 'astro:content';
import { classify, STAGES, type Lesson } from './content-schemas.ts';
import { unlocks } from './graph.ts';

export interface LessonLink {
	id: string;
	title: string;
	href: string;
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
		return { id, title: entry.data.title, href: `${prefix}/${classify(entry.id).path}/` };
	});
}

/** Lessons that list `id` as a prerequisite ("unlocks next"), drafts excluded, in the reader's locale. */
export async function unlockedLessons(id: string, locale: string | undefined): Promise<LessonLink[]> {
	const docs = await getCollection('docs');
	const nodes = docs
		.filter((d) => classify(d.id).kind === 'lesson' && classify(d.id).locale === null)
		.map((d) => {
			const l = d.data as Lesson;
			return { id: l.id, kind: 'lesson' as const, file: d.id, stage: l.stage, order: l.order, status: l.status, prerequisites: l.prerequisites };
		});
	return lessonLinks(unlocks(nodes, STAGES).get(id) ?? [], locale);
}

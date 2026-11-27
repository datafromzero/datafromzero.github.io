// The published English lessons in study order, as [id, code, path, title] rows (SPEC D64). Read by
// src/scripts/progress.ts only when the lesson a reader opened last is ticked done, to find the next one that is not.
// A small static file (about 8 KB gzipped, 25 KB raw), so no page carries it and the homepage's first paint is unchanged.
import { getCollection } from 'astro:content';
import { classify, type Lesson } from '../lib/content-schemas.ts';
import { groupRoadmap } from '../lib/roadmap.ts';

export async function GET() {
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
	const rows = groupRoadmap(lessons, new Set()).flatMap((s) => s.lessons.map((l) => [l.id, l.code, l.href, l.title]));
	return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
}

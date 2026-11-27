/**
 * The roadmap read from the content collection: published and deprecated English lessons grouped by stage
 * (`groupRoadmap`). One source for the map on /start/ and the stage index pages (SPEC §3.1, D64), so no page keeps its
 * own lesson list. Drafts never appear (D18).
 */
import { getCollection } from 'astro:content';
import { classify, STAGES, type Lesson } from './content-schemas.ts';
import { groupRoadmap, type MapLesson, type RoadmapStage } from './roadmap.ts';

export async function loadRoadmap(): Promise<RoadmapStage[]> {
	const docs = await getCollection('docs');
	const lessons: MapLesson[] = docs
		.filter((d) => {
			const c = classify(d.id);
			return c.kind === 'lesson' && c.locale === null && (d.data as Lesson).status !== 'draft';
		})
		.map((d) => {
			const l = d.data as Lesson;
			return {
				id: l.id,
				title: d.data.title,
				stage: l.stage,
				order: l.order,
				href: `/${classify(d.id).path}/`,
				prerequisites: l.prerequisites,
				status: l.status,
				duration: l.duration,
			};
		});
	const landings = new Set(docs.filter((d) => (STAGES as readonly string[]).includes(d.id)).map((d) => d.id));
	return groupRoadmap(lessons, landings);
}

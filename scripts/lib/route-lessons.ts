/** Reads every English lesson's frontmatter as the lessons of the career-route script and its test (SPEC D69). */
import { basename, resolve } from 'node:path';
import type { RouteLesson } from '../../src/lib/career-route.ts';
import { readContent } from './content-files.ts';

export function loadRouteLessons(docs = resolve('src/content/docs')): RouteLesson[] {
	const out: RouteLesson[] = [];
	for (const { file, data } of readContent(docs, ['lesson'])) {
		if (!data || typeof data.id !== 'string') continue;
		out.push({
			id: data.id,
			stage: String(data.stage),
			order: Number(data.order),
			duration: Number(data.duration),
			status: String(data.status),
			title: String(data.title),
			prerequisites: (data.prerequisites as string[] | undefined) ?? [],
			slug: basename(file).replace(/\.mdx?$/, ''),
		});
	}
	return out;
}

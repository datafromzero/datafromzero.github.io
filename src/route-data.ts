// Starlight route middleware. The Previous / Next links at the end of a lesson name the lesson by its full title, like the
// page heading and the bottom bar's Next button (SPEC D47). Starlight takes their text from the sidebar, which shows the one-line
// `short_title`; a learner who read "Relative and absolute references" was sent to "Cell references".
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getCollection } from 'astro:content';
import { classify } from './lib/content-schemas.ts';

let titles: Promise<Map<string, string>> | undefined;
const fullTitles = () =>
	(titles ??= getCollection('docs').then((docs) => {
		const map = new Map<string, string>();
		for (const d of docs) {
			const c = classify(d.id);
			if (c.kind === 'lesson') map.set(`${c.locale === 'vi' ? '/vi' : ''}/${c.path}/`, d.data.title);
		}
		return map;
	}));

export const onRequest = defineRouteMiddleware(async (context) => {
	const { pagination } = context.locals.starlightRoute;
	const map = await fullTitles();
	for (const side of [pagination.prev, pagination.next]) {
		const title = side && map.get(side.href);
		if (side && title) side.label = title;
	}
});

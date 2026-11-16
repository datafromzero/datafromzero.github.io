import { defineCollection } from 'astro:content';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { looseExtendShape } from './lib/content-schemas.ts';
import { validatedDocsLoader } from './lib/content-validation.ts';

// SPEC §5: the content type follows the file path. Starlight's `docs` collection holds every page;
// the loader validates each file against its type's schema and checks cross-file rules (ids,
// prerequisites, translations). `extend` only carries the field types through to the page.
const uiStrings = [
	'lesson.level.beginner',
	'lesson.level.intermediate',
	'lesson.level.advanced',
	'lesson.minutes',
	'lesson.reviewed',
	'lesson.objectives',
	'lesson.prerequisites',
	'lesson.deprecated',
	'lesson.sources',
	'lesson.cite',
	'lesson.citeNote',
	'lesson.suggestEdit',
	'lesson.reportIssue',
	'lesson.issueTitle',
	'lesson.issueBody',
	'component.exercise',
	'component.showSolution',
	'component.openInColab',
	'component.makeCopy',
] as const;

export const collections = {
	docs: defineCollection({
		loader: validatedDocsLoader(),
		schema: docsSchema({ extend: z.object(looseExtendShape()) }),
	}),
	// UI strings: English in en.json, Vietnamese overrides in vi.json (SPEC §8).
	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema({
			extend: z.object(Object.fromEntries(uiStrings.map((k) => [k, z.string().optional()]))),
		}),
	}),
};

import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

// Lesson, reference, glossary and other schemas (SPEC §5) are added in the content-model milestone.
export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// Vietnamese UI-string overrides (SPEC §8); Starlight's built-in Vietnamese strings fill the rest.
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};

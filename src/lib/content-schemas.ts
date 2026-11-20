/**
 * Zod schemas for every content type in SPEC §5 (CONTRACT). A page's content type follows its file
 * path (see `classify`); project pages such as `start.md` use only Starlight's own fields.
 * Adding an optional field is a MINOR change; anything else is MAJOR (SPEC §5).
 */
import { z } from 'astro/zod';

export const STAGES = [
	'excel',
	'sql',
	'python',
	'core',
	'data-analyst',
	'data-engineer',
	'data-scientist',
	'ml-engineer',
] as const;
export const REFERENCE_AREAS = ['excel', 'sql', 'pandas', 'stats'] as const;

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be lowercase kebab-case (a-z, 0-9, -)');
const ids = z.array(id).refine((a) => new Set(a).size === a.length, 'must not list the same id twice');
const reviewed = z.coerce.date({ error: 'must be a date such as 2026-11-15' });
const httpUrl = z.httpUrl({ error: 'must be an http(s) URL' });
const source = z.object({ title: z.string().min(1), url: httpUrl }).strict();
const sources = z.array(source).min(1, 'needs at least 1 source');
// Set on Vietnamese pages only (SPEC §8); presence is enforced in content-validation.ts.
const translated_from_version = z
	.string()
	.regex(/^\d+\.\d+\.\d+$/, 'must be a curriculum version such as 1.2.0')
	.optional();

export const LessonSchema = z.object({
	id,
	title: z.string().min(1),
	/** Short name for the sidebar and the course list, one line (SPEC D47). Required when a published title is longer. */
	short_title: z.string().min(1).max(24, 'must be at most 24 characters').optional(),
	description: z.string().min(1).max(160, 'must be at most 160 characters'),
	stage: z.enum(STAGES),
	order: z.number().int(),
	level: z.enum(['beginner', 'intermediate', 'advanced']),
	duration: z.number().int().positive(),
	objectives: z.array(z.string().min(1)).min(2, 'needs 2 to 5 items').max(5, 'needs 2 to 5 items'),
	prerequisites: ids,
	datasets: z.array(z.string().min(1)).optional(),
	notebook: z.string().min(1).optional(),
	sheet: httpUrl.optional(),
	reviewed,
	sources,
	status: z.enum(['draft', 'published', 'deprecated']),
	replaced_by: id.nullable().optional(),
	translated_from_version,
});

export const ReferenceSchema = z.object({
	id,
	title: z.string().min(1),
	area: z.enum(REFERENCE_AREAS),
	summary: z.string().min(1),
	syntax: z.string().optional(),
	see_also: ids,
	used_in: ids.optional(),
	reviewed,
	sources,
	translated_from_version,
});

export const GlossarySchema = z.object({
	id,
	term: z.string().min(1),
	short: z.string().min(1).max(140, 'must be at most 140 characters'),
	aliases: z.array(z.string().min(1)),
	reviewed,
	translated_from_version,
});

export const CareerSchema = z.object({
	id,
	title: z.string().min(1),
	summary: z.string().min(1),
	skills: z.array(z.string().min(1)).min(1),
	stages: z.array(z.enum(STAGES)).min(1),
	reviewed,
	sources,
	translated_from_version,
});

export const StorySchema = z.object({
	id,
	title: z.string().min(1),
	description: z.string().min(1),
	published: z.coerce.date({ error: 'must be a date such as 2026-11-15' }),
	reviewed,
	sources,
	motion: z.boolean(),
	translated_from_version,
});

export type Kind = 'lesson' | 'reference' | 'glossary' | 'career' | 'story';

export const schemaByKind = {
	lesson: LessonSchema,
	reference: ReferenceSchema,
	glossary: GlossarySchema,
	career: CareerSchema,
	story: StorySchema,
} as const;

export type Lesson = z.infer<typeof LessonSchema>;

export interface Classified {
	kind: Kind | null;
	/** Locale prefix of the entry id: `vi` or null for English. */
	locale: 'vi' | null;
	/** Entry id without the locale prefix, e.g. `sql/joins`. */
	path: string;
	/** The folder the frontmatter `stage` / `area` must equal. */
	folder?: string;
	/** Set when a path inside a typed area is not a valid location. */
	problem?: string;
}

/** Maps a docs entry id (`sql/joins`, `vi/sql/joins`) to its content type. */
export function classify(entryId: string): Classified {
	let segs = entryId.split('/');
	let locale: 'vi' | null = null;
	if (segs[0] === 'vi') {
		locale = 'vi';
		segs = segs.slice(1);
	}
	const path = segs.join('/');
	const none = (problem?: string): Classified => ({ kind: null, locale, path, problem });
	const [first] = segs;
	// The SQL playground (src/pages/sql/playground.astro, D42) and the cheatsheets (src/pages/{stage}/cheatsheet.astro, D44)
	// are pages, not lessons, although their URLs sit in the stage folders.
	if (path === 'sql/playground' || path === 'sql/cheatsheet' || path === 'excel/cheatsheet') return none();
	if ((STAGES as readonly string[]).includes(first)) {
		if (segs.length === 1) return none(); // stage landing page
		if (segs.length === 2) return { kind: 'lesson', locale, path, folder: first };
		return none(`lessons must sit directly in their stage folder: ${first}/{slug}.md`);
	}
	if (first === 'reference') {
		if (segs.length <= 2) return none(); // reference landing pages
		if (segs.length === 3) {
			if (segs[1] === 'glossary') return { kind: 'glossary', locale, path };
			if ((REFERENCE_AREAS as readonly string[]).includes(segs[1]))
				return { kind: 'reference', locale, path, folder: segs[1] };
		}
		return none('reference entries must be reference/{area}/{slug}.md or reference/glossary/{slug}.md');
	}
	// SPEC §5.4 / §7 define no dataset frontmatter yet (open owner decision): only index pages may exist.
	if (first === 'datasets') {
		return segs.length === 1
			? none()
			: none('Dataset page frontmatter is not defined in SPEC yet (§5.4/§7).');
	}
	const simple: Record<string, Kind> = { careers: 'career', stories: 'story' };
	if (first in simple) {
		if (segs.length === 1) return none();
		if (segs.length === 2) return { kind: simple[first], locale, path };
		return none(`entries must be ${first}/{slug}.md`);
	}
	return none();
}

/**
 * Starlight's `extend` schema: every typed field, all optional, so the validated frontmatter reaches
 * the page unchanged. Real validation runs per content type in the loader (content-validation.ts).
 */
export function looseExtendShape() {
	const shape: Record<string, z.ZodType> = {};
	for (const schema of Object.values(schemaByKind)) {
		for (const [key, value] of Object.entries(schema.shape)) shape[key] = (value as z.ZodType).optional();
	}
	return shape;
}

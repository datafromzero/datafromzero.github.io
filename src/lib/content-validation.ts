/**
 * Build-time content validation (SPEC §5, §8). Wraps Starlight's docs loader:
 *  - each file is validated against the schema for its content type before Starlight sees it;
 *  - after all files are loaded, cross-file rules are checked (unique ids, prerequisites,
 *    replacements, translations). Any failure aborts the build with every problem listed.
 */
import type { Loader } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { classify, schemaByKind, type Classified } from './content-schemas.ts';

type Data = Record<string, unknown>;

function describeIssues(file: string, issues: { path: PropertyKey[]; message: string }[]) {
	return issues
		.map((i) => `  - ${file}: ${i.path.length ? `\`${i.path.join('.')}\`` : 'frontmatter'} ${i.message}`)
		.join('\n');
}

export function validatedDocsLoader(): Loader {
	const inner = docsLoader();
	return {
		name: 'datafromzero-docs-loader',
		async load(context) {
			const { parseData, store } = context;
			await inner.load({
				...context,
				parseData: async (props) => {
					const c = classify(props.id);
					const file = (props as { filePath?: string }).filePath ?? `src/content/docs/${props.id}.md`;
					let data = props.data as Data;
					if (c.problem) throw new Error(`Content validation failed:\n  - ${file}: ${c.problem}`);
					if (c.kind) {
						// Glossary pages have `term`, not `title`; Starlight needs a title for the page.
						if (c.kind === 'glossary' && data.title === undefined) data = { ...data, title: data.term };
						const result = schemaByKind[c.kind].safeParse(data);
						const issues = result.success ? [] : [...result.error.issues];
						const stageOrArea = c.kind === 'lesson' ? 'stage' : 'area';
						if (c.folder && data[stageOrArea] !== c.folder && !issues.some((i) => i.path[0] === stageOrArea)) {
							issues.push({
								path: [stageOrArea],
								message: `is "${String(data[stageOrArea])}" but the file is in the "${c.folder}" folder; they must match`,
							} as (typeof issues)[number]);
						}
						if (c.locale === 'vi' && data.translated_from_version === undefined) {
							issues.push({
								path: ['translated_from_version'],
								message: 'is required on Vietnamese pages (SPEC §8)',
							} as (typeof issues)[number]);
						}
						if (issues.length) throw new Error(`Content validation failed:\n${describeIssues(file, issues)}`);
					}
					return parseData({ ...props, data });
				},
			});
			checkCrossReferences(store.values());
		},
	};
}

interface Entry {
	id: string;
	data: Data;
	filePath?: string;
}

function checkCrossReferences(entries: Entry[]) {
	const errors: string[] = [];
	const typed = entries
		.map((e) => ({ e, c: classify(e.id) }))
		.filter((x): x is { e: Entry; c: Classified & { kind: NonNullable<Classified['kind']> } } => x.c.kind !== null);
	const fileOf = (e: Entry) => e.filePath ?? `src/content/docs/${e.id}.md`;

	// English pages own the ids. Ids are unique across all content types.
	const english = typed.filter((x) => x.c.locale === null);
	const byId = new Map<string, Entry>();
	for (const { e } of english) {
		const key = String(e.data.id);
		const other = byId.get(key);
		if (other) errors.push(`  - ${fileOf(e)}: id "${key}" is already used by ${fileOf(other)}; ids must be unique`);
		else byId.set(key, e);
	}
	const lessonIds = new Map<string, Entry>();
	for (const { e, c } of english) if (c.kind === 'lesson') lessonIds.set(String(e.data.id), e);
	const allIds = new Set(byId.keys());

	for (const { e, c } of typed) {
		const file = fileOf(e);
		const d = e.data;
		const missing = (field: string, ids: unknown, known: Map<string, Entry> | Set<string>, what: string) => {
			for (const ref of (ids as string[] | undefined) ?? []) {
				if (!(known instanceof Set ? known.has(ref) : known.has(ref)))
					errors.push(`  - ${file}: \`${field}\` references "${ref}", which is not an existing ${what} id`);
			}
		};
		if (c.kind === 'lesson') {
			missing('prerequisites', d.prerequisites, lessonIds, 'lesson');
			if (d.status === 'deprecated') {
				if (!d.replaced_by) errors.push(`  - ${file}: \`replaced_by\` is required when status is "deprecated"`);
			}
			if (d.replaced_by) missing('replaced_by', [d.replaced_by], lessonIds, 'lesson');
			if (d.replaced_by && d.replaced_by === d.id)
				errors.push(`  - ${file}: \`replaced_by\` cannot point to the lesson itself`);
		}
		if (c.kind === 'reference') {
			missing('see_also', d.see_also, allIds, 'content');
			missing('used_in', d.used_in, lessonIds, 'lesson');
		}
		if (c.locale === 'vi') {
			const twin = english.find((x) => x.c.path === c.path);
			if (!twin) {
				errors.push(`  - ${file}: no English page at ${c.path}.md; a Vietnamese page must mirror an English path (SPEC §8)`);
			} else if (twin.e.data.id !== d.id) {
				errors.push(
					`  - ${file}: id "${String(d.id)}" differs from the English page ${fileOf(twin.e)} (id "${String(twin.e.data.id)}"); translations must keep the same id`,
				);
			}
		}
	}
	if (errors.length) throw new Error(`Content validation failed:\n${errors.join('\n')}`);
}

/**
 * Build-time content validation (SPEC §5, §8). Wraps Starlight's docs loader:
 * After loading, EVERY entry is validated against the schema for its content type and the
 * cross-file rules are checked (unique ids, prerequisites, replacements, translations). All problems
 * are collected and the build aborts once with the full list.
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
			const loadErrors: string[] = [];
			await inner.load({
				...context,
				parseData: async (props) => {
					const c = classify(props.id);
					let data = props.data as Data;
					// Glossary pages have `term`, not `title`; Starlight needs a title for the page.
					if (c.kind === 'glossary' && data.title === undefined) data = { ...data, title: data.term };
					// status: draft is excluded from production builds like Starlight's own `draft: true`.
					if (c.kind && data.status === 'draft') data = { ...data, draft: true };
					try {
						return await parseData({ ...props, data });
					} catch (error) {
						// Keep going so every problem is reported together after loading.
						const file = (props as { filePath?: string }).filePath ?? `src/content/docs/${props.id}.md`;
						loadErrors.push(`  - ${file}: ${error instanceof Error ? error.message : String(error)}`);
						return data;
					}
				},
			});
			// Astro only re-parses changed files, so validation runs here over every entry, every build.
			const errors = [...loadErrors, ...validateEntries(store.values())];
			if (errors.length) throw new Error(`Content validation failed:\n${errors.join('\n')}`);
		},
	};
}

interface Entry {
	id: string;
	data: Data;
	filePath?: string;
}

type Issue = { path: PropertyKey[]; message: string };

function validateEntries(entries: Entry[]): string[] {
	const errors: string[] = [];
	// Per-file rules for every entry (schema, folder match, location, Vietnamese version).
	for (const e of entries) {
		const c = classify(e.id);
		const file = e.filePath ?? `src/content/docs/${e.id}.md`;
		if (c.problem) {
			errors.push(`  - ${file}: ${c.problem}`);
			continue;
		}
		if (!c.kind) continue;
		const data = e.data;
		const result = schemaByKind[c.kind].safeParse(data);
		const issues: Issue[] = result.success ? [] : [...result.error.issues];
		const field = c.kind === 'lesson' ? 'stage' : 'area';
		if (c.folder && data[field] !== c.folder && !issues.some((i) => i.path[0] === field)) {
			issues.push({ path: [field], message: `is "${String(data[field])}" but the file is in the "${c.folder}" folder; they must match` });
		}
		if (c.locale === 'vi' && data.translated_from_version === undefined) {
			issues.push({ path: ['translated_from_version'], message: 'is required on Vietnamese pages (SPEC §8)' });
		}
		if (issues.length) errors.push(describeIssues(file, issues));
	}
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
	// see_also may point to reference entries and glossary terms only (SPEC §5.2).
	const seeAlsoIds = new Set<string>();
	for (const { e, c } of english) if (c.kind === 'reference' || c.kind === 'glossary') seeAlsoIds.add(String(e.data.id));

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
			if (d.status !== 'draft') {
				for (const ref of (d.prerequisites as string[]) ?? [])
					if (lessonIds.get(ref)?.data.status === 'draft')
						errors.push(`  - ${file}: lesson "${String(d.id)}" (${String(d.status)}) lists draft lesson "${ref}" in \`prerequisites\`; publish it first`);
				const r = d.replaced_by as string | null | undefined;
				if (r && lessonIds.get(r)?.data.status === 'draft')
					errors.push(`  - ${file}: lesson "${String(d.id)}" (${String(d.status)}) has \`replaced_by\` "${r}", which is a draft lesson`);
			}
			if (d.status === 'deprecated') {
				if (!d.replaced_by) errors.push(`  - ${file}: \`replaced_by\` is required when status is "deprecated"`);
			}
			if (d.replaced_by) missing('replaced_by', [d.replaced_by], lessonIds, 'lesson');
			if (d.replaced_by && d.replaced_by === d.id)
				errors.push(`  - ${file}: \`replaced_by\` cannot point to the lesson itself`);
		}
		if (c.kind === 'reference') {
			missing('see_also', d.see_also, seeAlsoIds, 'reference or glossary');
			missing('used_in', d.used_in, lessonIds, 'lesson');
			for (const ref of (d.used_in as string[] | undefined) ?? [])
				if (lessonIds.get(ref)?.data.status === 'draft')
					errors.push(`  - ${file}: \`used_in\` lists draft lesson "${ref}"; drafts are never deployed (SPEC D18)`);
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
	return errors;
}

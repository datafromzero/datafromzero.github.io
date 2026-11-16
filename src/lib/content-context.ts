/**
 * Page context for authoring components (SPEC §6): which lesson / glossary term the page is, and
 * the build-time errors for misuse. Throwing from a component fails the build.
 */
import { getCollection } from 'astro:content';
import { classify, type Lesson } from './content-schemas.ts';
import { GITHUB_BRANCH, GITHUB_REPO } from '../site.ts';

interface Route {
	entry: { id: string; filePath?: string; data: Record<string, unknown> };
	locale?: string;
}

export function pageOf(locals: App.Locals) {
	const route = (locals as unknown as { starlightRoute: Route }).starlightRoute;
	const c = classify(route.entry.id);
	return {
		file: route.entry.filePath ?? `src/content/docs/${route.entry.id}.md`,
		locale: route.locale === 'vi' ? ('vi' as const) : null,
		lesson: c.kind === 'lesson' ? (route.entry.data as unknown as Lesson) : null,
	};
}

/** Throws a build error naming the page and component. */
export function misuse(file: string, component: string, message: string): never {
	throw new Error(`${file}: <${component}> ${message}`);
}

const seenIds = new WeakMap<object, Set<string>>();
/** Next unused `{prefix}-{n}` for this page render (unique DOM ids). */
export function uniqueId(locals: object, prefix: string): string {
	for (let n = 1; ; n++) if (claim(locals, `${prefix}-${n}`)) return `${prefix}-${n}`;
}
/** Remembers an Exercise id for this page render; false when it was already used on the page. */
export function claimExerciseId(locals: object, id: string): boolean {
	return claim(locals, `exercise:${id}`);
}
function claim(locals: object, id: string): boolean {
	let seen = seenIds.get(locals);
	if (!seen) seenIds.set(locals, (seen = new Set()));
	if (seen.has(id)) return false;
	seen.add(id);
	return true;
}

/** SPEC §7: notebooks open from the `main` branch of the content repository. */
export function colabUrl(notebook: string): string {
	return `https://colab.research.google.com/github/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${notebook.replace(/^\/+/, '')}`;
}

export interface GlossaryTerm {
	term: string;
	short: string;
	href: string;
}

export async function findGlossaryTerm(id: string, locale: 'vi' | null): Promise<GlossaryTerm | undefined> {
	const docs = await getCollection('docs');
	const matches = docs.filter((d) => classify(d.id).kind === 'glossary' && (d.data as { id?: string }).id === id);
	const entry = matches.find((d) => classify(d.id).locale === locale) ?? matches.find((d) => classify(d.id).locale === null);
	if (!entry) return undefined;
	const data = entry.data as unknown as { term: string; short: string };
	return { term: data.term, short: data.short, href: `${locale ? '/vi' : ''}/${classify(entry.id).path}/` };
}

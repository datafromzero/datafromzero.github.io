/**
 * The site sidebar (the page list in Starlight's top-right menu on phones), built at config time like the docs of a
 * programming language: get started first, then the lessons stage by stage in study order with their codes
 * (E1, E2 …), and the project pages last. A stage appears once it has a published lesson. Drafts are listed only
 * in `astro dev`; production never links to a draft (SPEC D18).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { CHEATSHEETS, DEEP_DIVES, deepDiveLabel, lessonCode, ROADMAP_STAGES } from './roadmap.ts';

type Link = { label: string; link: string; attrs?: Record<string, string> };
type Group = { label: string; collapsed?: boolean; items: (Link | Group)[] };

const DOCS = 'src/content/docs';

function stageLessons(stage: string, includeDrafts: boolean): (Link & { order: number })[] {
	const dir = join(DOCS, stage);
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f))
		.map((f) => {
			const fm = readFileSync(join(dir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/);
			const data = fm ? (parse(fm[1]) as { title?: string; short_title?: string; order?: number; status?: string }) : {};
			return { slug: f.replace(/\.mdx?$/, ''), ...data };
		})
		.filter((l) => typeof l.order === 'number' && l.title && (l.status === 'published' || (includeDrafts && l.status === 'draft')))
		.sort((a, b) => a.order! - b.order!)
		// The code is drawn by CSS from `data-code` (tokens.css) in its own mono column, so a wrapped title stays
		// aligned and screen readers still hear it first through the accessible label. The row shows the one-line
		// `short_title` when the lesson has one (D47); the full title is the hover tooltip.
		.map((l) => {
			const code = lessonCode(stage, l.order!)!;
			const label = l.short_title ?? l.title!;
			const attrs: Record<string, string> = { 'data-code': code, 'aria-label': `${code} ${label}` };
			if (l.short_title) attrs.title = l.title!;
			return { label, link: `/${stage}/${l.slug}/`, attrs, order: l.order! };
		});
}

/** A stage's lessons, then its cheatsheet page (SPEC D44) when the stage has lessons to list. */
function stageItems(stage: string, includeDrafts: boolean): (Link | Group)[] {
	const all = stageLessons(stage, includeDrafts);
	const strip = ({ order: _order, ...link }: Link & { order: number }): Link => link;
	// An optional deep dive (SPEC D55) is a nested, collapsed group after the main path, labeled as optional.
	const from = DEEP_DIVES[stage]?.fromOrder ?? Infinity;
	const main: (Link | Group)[] = all.filter((l) => l.order < from).map(strip);
	const deep = all.filter((l) => l.order >= from).map(strip);
	if (deep.length > 0) main.push({ label: deepDiveLabel(stage)!, collapsed: true, items: deep });
	const sheet = CHEATSHEETS[stage];
	const body = sheet && all.length > 0 ? [...main, { label: sheet.label, link: sheet.href }] : main;
	// The stage's index page (/excel/, D64) opens the group when its file exists.
	return all.length > 0 && existsSync(join(DOCS, stage, 'index.md')) ? [{ label: 'All lessons', link: `/${stage}/` }, ...body] : body;
}

export function buildSidebar(includeDrafts: boolean): Group[] {
	const stages = ROADMAP_STAGES.map((s) => ({ label: s.title, collapsed: true, items: stageItems(s.id, includeDrafts) })).filter(
		(g) => g.items.length > 0,
	);
	return [
		{
			label: 'Get started',
			items: [
				{ label: 'Start here', link: '/start/' },
				{ label: 'Career quiz', link: '/career-quiz/' },
				{ label: 'Choose your track', link: '/choose-your-track/' },
				{ label: 'SQL playground', link: '/sql/playground/' },
			],
		},
		...stages,
		{
			label: 'About this site',
			collapsed: true,
			items: [
				{ label: 'About', link: '/about/' },
				{ label: "What's new", link: '/changelog/' },
				{ label: 'Cite', link: '/cite/' },
				{ label: 'License', link: '/license/' },
				{ label: 'Privacy', link: '/privacy/' },
				{ label: 'Read in your language', link: '/translate/' },
			],
		},
	];
}

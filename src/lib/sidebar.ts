/**
 * The site sidebar (the page list in Starlight's top-right menu on phones), built at config time like the docs of a
 * programming language: get started first, then the lessons stage by stage in study order with their codes
 * (E1, E2 …), and the project pages last. A stage appears once it has a published lesson. Drafts are listed only
 * in `astro dev`; production never links to a draft (SPEC D18).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { lessonCode, ROADMAP_STAGES } from './roadmap.ts';

type Link = { label: string; link: string };
type Group = { label: string; collapsed?: boolean; items: Link[] };

const DOCS = 'src/content/docs';

function stageLessons(stage: string, includeDrafts: boolean): Link[] {
	const dir = join(DOCS, stage);
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f))
		.map((f) => {
			const fm = readFileSync(join(dir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/);
			const data = fm ? (parse(fm[1]) as { title?: string; order?: number; status?: string }) : {};
			return { slug: f.replace(/\.mdx?$/, ''), ...data };
		})
		.filter((l) => typeof l.order === 'number' && l.title && (l.status === 'published' || (includeDrafts && l.status === 'draft')))
		.sort((a, b) => a.order! - b.order!)
		.map((l) => ({ label: `${lessonCode(stage, l.order!)} ${l.title}`, link: `/${stage}/${l.slug}/` }));
}

export function buildSidebar(includeDrafts: boolean): Group[] {
	const stages = ROADMAP_STAGES.map((s) => ({ label: s.title, collapsed: true, items: stageLessons(s.id, includeDrafts) })).filter(
		(g) => g.items.length > 0,
	);
	return [
		{
			label: 'Get started',
			items: [
				{ label: 'Start here', link: '/start/' },
				{ label: 'Career quiz', link: '/career-quiz/' },
			],
		},
		...stages,
		{
			label: 'Project',
			collapsed: true,
			items: [
				{ label: 'About', link: '/about/' },
				{ label: 'Changelog', link: '/changelog/' },
				{ label: 'Cite', link: '/cite/' },
				{ label: 'License', link: '/license/' },
				{ label: 'Privacy', link: '/privacy/' },
			],
		},
	];
}

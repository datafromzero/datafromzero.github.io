/**
 * The cheatsheets by stage, and the one place that builds a lesson's link into its stage sheet (SPEC D44). The lesson
 * footer calls `cheatsheetLink`, so the link comes from the same data as the cards and cannot drift: a lesson without a
 * card gets no link. Python and the later stages are added here when they get a sheet.
 */
import { cardAnchors, type Cheatsheet } from '../../lib/cheatsheet.ts';
import { CHEATSHEETS, ROADMAP_STAGES } from '../../lib/roadmap.ts';
import { excelCheatsheet } from './excel.ts';
import { sqlCheatsheet } from './sql.ts';

export const SHEETS: Readonly<Record<string, Cheatsheet>> = { sql: sqlCheatsheet, excel: excelCheatsheet };

/** `/sql/cheatsheet/#s8` for the published lesson `slug` of `stage`; `undefined` when the stage has no sheet or the lesson no card. */
export function cheatsheetLink(stage: string, slug: string, order: number): { href: string; stage: string } | undefined {
	const sheet = SHEETS[stage];
	const id = sheet && cardAnchors(sheet, new Map([[slug, order]])).get(slug);
	if (!id) return undefined;
	return { href: `${CHEATSHEETS[stage].href}#${id}`, stage: stage === 'sql' ? 'SQL' : stage === 'excel' ? 'Excel' : (ROADMAP_STAGES.find((s) => s.id === stage)?.title ?? stage) };
}

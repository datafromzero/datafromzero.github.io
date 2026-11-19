/**
 * Stage cheatsheets (SPEC D44): the shape of the data a one-page cheatsheet is built from, and the checks the unit
 * tests run on it. Pure TypeScript with no Astro imports, so the build and the tests share it. The content itself lives
 * in `src/data/cheatsheets/{stage}.ts` and is distilled from published lessons only.
 */

/** One pattern: a short piece of code, what it does in one plain sentence, the most common trap, and its lesson. */
export interface CheatEntry {
	/** File name (the slug) of the lesson in the stage folder that teaches it, e.g. `group-by-having`. */
	lesson: string;
	/** The pattern, in the stage's language (SQL, formulas, Python), on its own lines. */
	code: string;
	/** What it does, for a beginner. */
	does: string;
	/** The most common trap, where the lesson names one. */
	trap?: string;
}

/** A small static drawing placed beside the entries of the lesson it explains (see `CheatsheetFigure.astro`). */
export interface CheatFigure {
	figure: 'order' | 'joins' | 'window';
	lesson: string;
}

export type CheatItem = CheatEntry | CheatFigure;

export interface CheatPart {
	id: string;
	title: string;
	/** The lesson codes the part covers, e.g. `S1-S17`, written with an en dash. */
	codes: string;
	items: CheatItem[];
}

export interface Cheatsheet {
	stage: string;
	title: string;
	description: string;
	/** One or two sentences under the title. */
	intro: string;
	parts: CheatPart[];
}

export const isFigure = (i: CheatItem): i is CheatFigure => 'figure' in i;

/** `S1–S17` as the first and last lesson number. */
export function codeRange(codes: string): [number, number] {
	const m = codes.match(/^[A-Z]+(\d+)–[A-Z]+(\d+)$/);
	if (!m) throw new Error(`bad code range "${codes}": write it like S1–S17`);
	return [Number(m[1]), Number(m[2])];
}

/** Every problem found in a sheet, given the published lessons of its stage as `slug -> order`. */
export function sheetProblems(sheet: Cheatsheet, lessons: ReadonlyMap<string, number>): string[] {
	const out: string[] = [];
	const seen = new Set<string>();
	for (const part of sheet.parts) {
		const [lo, hi] = codeRange(part.codes);
		if (seen.has(part.id)) out.push(`part id "${part.id}" is used twice`);
		seen.add(part.id);
		for (const item of part.items) {
			const order = lessons.get(item.lesson);
			if (order === undefined) {
				out.push(`${part.id}: lesson "${item.lesson}" is not a published lesson of ${sheet.stage}`);
				continue;
			}
			const n = order / 10;
			if (n < lo || n > hi) out.push(`${part.id}: "${item.lesson}" is lesson ${n}, outside ${part.codes}`);
			if (isFigure(item)) continue;
			if (!item.code.trim()) out.push(`${item.lesson}: empty code`);
			if (!item.does.trim().endsWith('.')) out.push(`${item.lesson}: "does" must be one sentence ending in a period`);
			if (item.trap !== undefined && !item.trap.trim().endsWith('.')) out.push(`${item.lesson}: "trap" must end in a period`);
		}
	}
	return out;
}

/** Entries only, in page order (what the SQL check runs). */
export function entriesOf(sheet: Cheatsheet): CheatEntry[] {
	return sheet.parts.flatMap((p) => p.items.filter((i): i is CheatEntry => !isFigure(i)));
}

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
	/** The twin of this pattern in the coming stages (the "Next:" line); only the Excel sheet uses it. */
	next?: CheatNext;
}

/**
 * Where the same idea comes back later. SQL twins name a published SQL lesson (shown with its code and linked); pandas
 * twins are method names only, because the Python lessons are drafts and have no page to link.
 */
export interface CheatNext {
	sql?: { text: string; lesson: string }[];
	pandas?: string;
}

/** A small static drawing placed beside the entries of the lesson it explains (see `CheatsheetFigure.astro`). */
export interface CheatFigure {
	figure: 'order' | 'joins' | 'window' | 'tidy' | 'lookup' | 'pivot';
	lesson: string;
}

export type CheatItem = CheatEntry | CheatFigure;

export interface CheatPart {
	id: string;
	title: string;
	/** The lesson codes the part covers: a range written with an en dash (`S1–S17`) or a list (`E1, E4, E5`). */
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
	/** The line printed under the sheet (a source note). */
	foot: string;
}

export const isFigure = (i: CheatItem): i is CheatFigure => 'figure' in i;

/** `S1–S17` as the first and last lesson number. */
export function codeRange(codes: string): [number, number] {
	const m = codes.match(/^[A-Z]+(\d+)–[A-Z]+(\d+)$/);
	if (!m) throw new Error(`bad code range "${codes}": write it like S1–S17`);
	return [Number(m[1]), Number(m[2])];
}

/** `E1, E4, E5` as the lesson numbers 1, 4, 5. */
export function codeList(codes: string): number[] {
	return codes.split(',').map((c) => {
		const m = c.trim().match(/^[A-Z]+(\d+)$/);
		if (!m) throw new Error(`bad code list "${codes}": write it like E1, E4, E5`);
		return Number(m[1]);
	});
}

/** Whether lesson number `n` belongs to a part labeled with a range (`S1–S17`) or a list (`E1, E4`). */
export function codeCovers(codes: string, n: number): boolean {
	if (codes.includes('–')) {
		const [lo, hi] = codeRange(codes);
		return n >= lo && n <= hi;
	}
	return codeList(codes).includes(n);
}

/**
 * Every problem found in a sheet, given the published lessons of its stage as `slug -> order`. `sql` (the published SQL
 * lessons the same way) is given when the sheet has "Next" lines, so that each SQL twin is checked to exist.
 */
export function sheetProblems(sheet: Cheatsheet, lessons: ReadonlyMap<string, number>, sql?: ReadonlyMap<string, number>): string[] {
	const out: string[] = [];
	const seen = new Set<string>();
	for (const part of sheet.parts) {
		if (seen.has(part.id)) out.push(`part id "${part.id}" is used twice`);
		seen.add(part.id);
		const cited = new Set<number>();
		for (const item of part.items) {
			const order = lessons.get(item.lesson);
			if (order === undefined) {
				out.push(`${part.id}: lesson "${item.lesson}" is not a published lesson of ${sheet.stage}`);
				continue;
			}
			const n = order / 10;
			cited.add(n);
			if (!codeCovers(part.codes, n)) out.push(`${part.id}: "${item.lesson}" is lesson ${n}, outside ${part.codes}`);
			if (isFigure(item)) continue;
			if (!item.code.trim()) out.push(`${item.lesson}: empty code`);
			if (!item.does.trim().endsWith('.')) out.push(`${item.lesson}: "does" must be one sentence ending in a period`);
			if (item.trap !== undefined && !item.trap.trim().endsWith('.')) out.push(`${item.lesson}: "trap" must end in a period`);
			for (const t of item.next?.sql ?? []) {
				if (sql && !sql.has(t.lesson)) out.push(`${item.lesson}: next SQL lesson "${t.lesson}" is not a published SQL lesson`);
				if (!t.text.trim()) out.push(`${item.lesson}: empty next SQL text`);
			}
			if (item.next && !item.next.sql?.length && !item.next.pandas) out.push(`${item.lesson}: "next" is empty`);
			if (item.next?.pandas && /https?:|\]\(/.test(item.next.pandas)) out.push(`${item.lesson}: pandas twins are names only, no links`);
		}
		// A part labeled with a list names exactly the lessons it cites.
		if (!part.codes.includes('–')) {
			const named = codeList(part.codes).sort((a, b) => a - b).join(',');
			const used = [...cited].sort((a, b) => a - b).join(',');
			if (named !== used) out.push(`${part.id}: label ${part.codes} does not match the lessons it cites`);
		}
	}
	return out;
}

/** Entries only, in page order (what the SQL check runs). */
export function entriesOf(sheet: Cheatsheet): CheatEntry[] {
	return sheet.parts.flatMap((p) => p.items.filter((i): i is CheatEntry => !isFigure(i)));
}

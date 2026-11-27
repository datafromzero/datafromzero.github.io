/**
 * Where a `<Term id="glossary-...">` may go in a lesson (SPEC D68, LESSON-STANDARD.md "Glossary links"). Pure functions,
 * shared by `scripts/check-lessons.mjs` and `tests/glossary.test.ts`.
 *
 * A Term wraps one word of a sentence the learner reads for the first time. It never goes:
 *   - inside a heading, a fenced code block, an HTML block (`<figure>`, `<svg>`, `<details>`, `<Exercise>`, `<Solution>`);
 *   - in a section of questions and answers (Warm-up, Finish it, On your own, Check yourself, "Can you skip Part N?", a
 *     placement test), or on a Predict, Why or Expected line;
 *   - twice for the same term in one lesson (the first use only), or with an id that no glossary entry has.
 * A page full of dotted underlines is noise, so the check also fails a lesson with more than MAX_TERMS Terms.
 */

/** The most Terms one lesson carries. */
export const MAX_TERMS = 6;

const TERM = /<Term\s+id="([^"]*)"\s*>/g;
const EXCLUDED_SECTION = /^(?:Warm-?up|Finish it|On your own|Check yourself|Can you skip\b.*|Placement test)$/i;
const BLOCKS = ['details', 'figure', 'svg', 'Exercise', 'Solution'];

/** The `<Term>` uses of a lesson's lines: `{ line (from 1), id, problem }`, where `problem` is undefined for a good place. */
export function termUses(lines) {
	const uses = [];
	let start = 0;
	if (lines[0] === '---') {
		start = lines.indexOf('---', 1) + 1;
	}
	let fence = false;
	let section = '';
	const depth = Object.fromEntries(BLOCKS.map((b) => [b, 0]));
	for (let i = start; i < lines.length; i++) {
		const raw = lines[i];
		if (/^\s*(```|~~~)/.test(raw)) {
			fence = !fence;
			continue;
		}
		const inBlock = BLOCKS.some((b) => depth[b] > 0);
		// Count this line's opening and closing tags first, so a one-line `<details>…</details>` leaves no block open.
		const before = inBlock;
		for (const b of BLOCKS) {
			depth[b] += (raw.match(new RegExp(`<${b}[\\s>]`, 'g')) ?? []).length;
			depth[b] -= (raw.match(new RegExp(`</${b}>`, 'g')) ?? []).length;
		}
		const after = BLOCKS.some((b) => depth[b] > 0);
		const heading = !fence && raw.match(/^(#{1,6}) (.+?)\s*#*\s*$/);
		if (heading && heading[1] === '##') section = heading[2].trim();
		for (const m of raw.matchAll(TERM)) {
			let problem;
			if (fence) problem = 'inside a fenced code block';
			else if (heading) problem = 'inside a heading';
			else if (before || after) problem = 'inside a <details>, <figure>, <svg>, <Exercise> or <Solution> block';
			else if (EXCLUDED_SECTION.test(section)) problem = `in the section "${section}", which holds questions and answers`;
			else if (/^\s*(?:\*Why:\*|\*\*Predict|\*\*Why|Expected\b)/.test(raw)) problem = 'on a Predict, Why or Expected line (it would hint at an answer)';
			uses.push({ line: i + 1, id: m[1], problem });
		}
	}
	return uses;
}

/** The problems of a lesson's Terms, as `{ line, msg }`. `ids` is the set of glossary ids (`glossary-...`). */
export function termProblems(lines, ids) {
	const out = [];
	const uses = termUses(lines);
	const seen = new Map();
	for (const u of uses) {
		if (!ids.has(u.id)) out.push({ line: u.line, msg: `<Term id="${u.id}"> is not a glossary id (use the id of a file in src/content/docs/reference/glossary/)` });
		if (u.problem) out.push({ line: u.line, msg: `<Term id="${u.id}"> ${u.problem}` });
		if (seen.has(u.id)) out.push({ line: u.line, msg: `<Term id="${u.id}"> already used on line ${seen.get(u.id)}; one Term for each word in a lesson` });
		else seen.set(u.id, u.line);
	}
	if (uses.length > MAX_TERMS) out.push({ line: uses[MAX_TERMS].line, msg: `${uses.length} Terms in one lesson (at most ${MAX_TERMS}); keep the first use of the words that trip a beginner` });
	return out;
}

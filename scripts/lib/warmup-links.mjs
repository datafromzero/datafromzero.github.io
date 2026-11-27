/**
 * Warm-up rules (SPEC D66, LESSON-STANDARD.md "Warm-up"): a warm-up opens with one fixed line, and every question links to
 * the earlier lesson that teaches the fact it asks, as `[*Title*](/stage/slug/#section) (S18)`. Pure functions, shared by
 * `scripts/check-lessons.mjs` and `tests/warmup-links.test.mjs`.
 *
 * A question that no earlier lesson teaches carries the marker `{/*warmup: not-taught-earlier*\/}` (in a `.md` lesson,
 * `<!-- warmup: not-taught-earlier -->`) at its end instead of a link. The marker renders nothing, and
 * `check-lessons` lists every marked question, so a writer cannot dodge the rule without being seen.
 */

/** The one opening line of every written warm-up (owner-approved 2026-11-27). */
export const WARMUP_OPENING =
	'Try each one from memory, then open the answer. Forgot? Follow the link back to that part of the lesson: looking back is part of the review.';

/** The marker of a question that no earlier lesson teaches (MDX comment, or HTML comment in a `.md` lesson). */
export const NOT_TAUGHT_MARKER = /\{\/\*\s*warmup:\s*not-taught-earlier\s*\*\/\}|<!--\s*warmup:\s*not-taught-earlier\s*-->/;

/** Lesson codes: stage prefix, order divided by ten, an optional part letter (E8, S18, DA8a, MLE12). */
const CODE = '(?:MLE|DA|DE|DS|E|S|P|C)\\d+[a-z]?';

/**
 * The id Starlight gives a heading (the github-slugger rule: lowercase, drop everything but letters, marks, numbers,
 * connectors, hyphens and spaces, then spaces become hyphens). `text` is the heading's source text.
 */
export function slugify(text) {
	const plain = text
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // a link keeps its text
		.replace(/`/g, '')
		.replace(/\*/g, '')
		.trim();
	return plain.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '').replace(/ /g, '-');
}

/** The ids of all headings of a lesson's lines (repeated headings get -1, -2 ... as the slugger does). */
export function headingIds(lines) {
	const seen = new Map();
	const ids = new Set();
	let fence = false;
	for (const x of lines) {
		if (/^\s*```/.test(x)) fence = !fence;
		const m = !fence && x.match(/^#{1,6} (.+?)\s*#*\s*$/);
		if (!m) continue;
		const base = slugify(m[1]);
		const n = seen.get(base) ?? 0;
		seen.set(base, n + 1);
		ids.add(n ? `${base}-${n}` : base);
	}
	return ids;
}

/** The title forms a link may use: the full title, the part before its first colon, or the short_title. */
export function allowedTitles(info) {
	const out = new Set([info.title]);
	if (info.title.includes(':')) out.add(info.title.split(':')[0].trim());
	if (info.short) out.add(info.short);
	return out;
}

/**
 * The warm-up section of a lesson: `{ heading, opening, questions }` (line indexes from 0), or `null` without one.
 * A question is a numbered item outside `<details>`; its text runs to the first blank line or `<details>`.
 */
export function warmupSection(lines) {
	const heading = lines.findIndex((x) => /^## Warm-up\s*$/.test(x));
	if (heading < 0) return null;
	let end = lines.findIndex((x, i) => i > heading && /^## /.test(x));
	if (end < 0) end = lines.length;
	const opening = lines.findIndex((x, i) => i > heading && i < end && x.trim() !== '');
	const questions = [];
	let inDetails = false;
	for (let i = heading + 1; i < end; i++) {
		if (/<details/.test(lines[i])) inDetails = true;
		if (!inDetails && /^\d+\. /.test(lines[i])) {
			let j = i;
			const text = [];
			while (j < end && lines[j].trim() !== '' && !/<details/.test(lines[j])) text.push(lines[j++]);
			questions.push({ line: i, text: text.join('\n') });
		}
		if (/<\/details>/.test(lines[i])) inDetails = false;
	}
	return { heading, opening, questions };
}

const LINK_BEFORE_CODE = /\]\((\/[^)\s#]*)(#[^)\s]*)?\)(?:\s+\(|,\s+)$/;
const LINK_BEFORE_CHAPTER = /\]\((\/[^)\s#]*)(#[^)\s]*)?\)\s+$/;
// A token after one of these words is a spreadsheet cell, not a lesson (C7 in "the cell C7").
const CELL_CONTEXT = /\b(?:cells?|columns?|rows?|ranges?|in|to)\s$/;

/**
 * Problems of one warm-up question, as messages.
 * @param {string} text the question text, lines joined with "\n"
 * @param {string} stage the stage folder of the lesson that holds the question (an Excel lesson writes cell names such as E2)
 * @param {{ byCode: Record<string, {url: string, title: string, short?: string, ids: Set<string>}>, byUrl: Record<string, {code: string, title: string, short?: string, ids: Set<string>}> }} index the lessons
 */
export function questionProblems(text, stage, index) {
	const problems = [];
	const marked = NOT_TAUGHT_MARKER.test(text);
	const masked = text.replace(/`[^`]*`/g, (m) => 'x'.repeat(m.length));

	// 1. Every internal link goes to a lesson, to a heading that exists, with a title the lesson goes by.
	const links = [...masked.matchAll(/\[([^\]]+)\]\((\/[^)\s]*)\)/g)];
	for (const m of links) {
		const [path, anchor] = m[2].split('#');
		const target = index.byUrl[path];
		if (!target) { problems.push(`links to ${path}, which is not a lesson`); continue; }
		if (anchor && !target.ids.has(anchor)) problems.push(`links to #${anchor} of ${path}, but that lesson has no such heading`);
		const shown = m[1].replace(/\*/g, '');
		if (!allowedTitles(target).has(shown))
			problems.push(`link text "${shown}" is not a title of ${target.code}: use ${[...allowedTitles(target)].map((t) => `"${t}"`).join(' or ')}`);
	}
	if (!links.length && !marked) problems.push('this question has no link to an earlier lesson: append (from [*Title*](/stage/slug/#section), CODE), or mark it {/*warmup: not-taught-earlier*/} when no earlier lesson teaches it (SPEC D66)');
	if (links.length && marked) problems.push('marked not-taught-earlier but links to a lesson: remove the marker or the link');

	// 2. A lesson code, or "(chapter N)", comes right after a link to that very lesson. Link texts are masked, so a title never counts.
	const scan = masked.replace(/\[([^\]]*)\]/g, (m) => `[${'x'.repeat(m.length - 2)}]`);
	for (const m of scan.matchAll(new RegExp(`(?<![\\w/#-])(${CODE})(?![\\w-])`, 'g'))) {
		const code = m[1];
		const lesson = index.byCode[code];
		if (!lesson) continue;
		const before = scan.slice(0, m.index);
		const link = before.match(LINK_BEFORE_CODE);
		if (link) {
			if (link[1] !== lesson.url) problems.push(`names lesson ${code}, but its link goes to ${link[1]} (${index.byUrl[link[1]]?.code ?? 'not a lesson'})`);
		} else if (stage !== 'excel' && !CELL_CONTEXT.test(before.slice(-12).replace(/\s+$/, ' '))) {
			problems.push(`names lesson ${code} without a link to it: write [*Title*](${lesson.url}#section) (${code})`);
		}
	}
	for (const m of scan.matchAll(/\(chapter \d+\)/g)) {
		const link = scan.slice(0, m.index).match(LINK_BEFORE_CHAPTER);
		if (!link) problems.push(`names "${m[0]}" without a link to that lesson`);
		else if (!index.byUrl[link[1]]) problems.push(`"${m[0]}" links to ${link[1]}, which is not a lesson`);
	}
	return problems;
}

/**
 * Problems of a lesson's warm-up as `{ line, msg }` (line from 1): the opening line, then each question.
 * Returns `[]` for a lesson without a warm-up or with an unwritten one (the stub line "Draft: the owner writes this section.").
 */
export function warmupProblems(lines, stage, index) {
	const w = warmupSection(lines);
	if (!w || lines[w.opening] === 'Draft: the owner writes this section.') return [];
	const out = [];
	if (lines[w.opening] !== WARMUP_OPENING) out.push({ line: (w.opening < 0 ? w.heading : w.opening) + 1, msg: `the warm-up must open with the standard line: "${WARMUP_OPENING}" (SPEC D66)` });
	for (const q of w.questions) for (const msg of questionProblems(q.text, stage, index)) out.push({ line: q.line + 1, msg });
	return out;
}

/** The questions of a lesson's warm-up that carry the not-taught-earlier marker, as `{ line }` (from 1). */
export function warmupExempt(lines) {
	const w = warmupSection(lines);
	return w ? w.questions.filter((q) => NOT_TAUGHT_MARKER.test(q.text)).map((q) => ({ line: q.line + 1 })) : [];
}

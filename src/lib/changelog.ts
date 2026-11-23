/**
 * CHANGELOG.md for the "What's new" page (SPEC §9, D54). Pure TypeScript: no Astro imports, so the build, the
 * `check:changelog` gate and the unit tests share it.
 *
 * Every top-level bullet starts with a bold, learner-facing summary that begins with its date:
 * `- **2026-11-23: Part 6 of the advanced core, six lessons on working with AI.** Detail for GitHub.`
 * The page shows only the summaries; the detail stays in the file.
 */

export interface ChangelogEntry {
	/** 1-based line of the bullet in CHANGELOG.md. */
	line: number;
	/** `YYYY-MM-DD`. */
	date: string;
	/** The summary sentence, without the date. */
	summary: string;
	/** Keep a Changelog group: Added, Changed, Fixed, Removed and so on. */
	group: string;
}

export interface ChangelogProblem {
	line: number;
	message: string;
}

const SUMMARY = /^- \*\*(\d{4}-\d{2}-\d{2}): (.+?)\*\*(?:\s|$)/;

/** Parses the top-level bullets (indented sub-bullets belong to their parent bullet's detail). */
export function parseChangelog(text: string): { entries: ChangelogEntry[]; problems: ChangelogProblem[] } {
	const entries: ChangelogEntry[] = [];
	const problems: ChangelogProblem[] = [];
	let group = '';
	text.split('\n').forEach((raw, i) => {
		const line = i + 1;
		const heading = raw.match(/^### (.+)/);
		if (heading) group = heading[1].trim();
		if (!raw.startsWith('- ')) return;
		const m = raw.match(SUMMARY);
		if (m) entries.push({ line, date: m[1], summary: m[2].trim(), group });
		else if (/^- \*\*/.test(raw)) problems.push({ line, message: 'the bold summary must start with a date, as in **2026-11-23: What changed.**' });
		else problems.push({ line, message: 'bullet has no bold summary; start it with **YYYY-MM-DD: one learner-facing sentence.**' });
	});
	return { entries, problems };
}

/** Entries grouped by month (`YYYY-MM`), newest month first, newest day first; the file order breaks ties. */
export function groupByMonth(entries: ChangelogEntry[]): { month: string; entries: ChangelogEntry[] }[] {
	const sorted = [...entries].sort((a, b) => (a.date === b.date ? a.line - b.line : a.date < b.date ? 1 : -1));
	const months: { month: string; entries: ChangelogEntry[] }[] = [];
	for (const e of sorted) {
		const month = e.date.slice(0, 7);
		const last = months[months.length - 1];
		if (last?.month === month) last.entries.push(e);
		else months.push({ month, entries: [e] });
	}
	return months;
}

/** Consecutive entries with the same date, so the page can show each date once (entries are already newest first). */
export function groupByDay<T extends { date: string }>(entries: T[]): { date: string; entries: T[] }[] {
	const days: { date: string; entries: T[] }[] = [];
	for (const e of entries) {
		const last = days[days.length - 1];
		if (last?.date === e.date) last.entries.push(e);
		else days.push({ date: e.date, entries: [e] });
	}
	return days;
}

/** `2026-11-23` becomes `Nov 23`. */
export function dayLabel(date: string): string {
	const [y, m, d] = date.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** `2026-11` becomes `November 2026`. */
export function monthLabel(month: string): string {
	const [y, m] = month.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface LessonRef {
	title: string;
	href: string;
}

/**
 * Summary text as safe HTML: `code` spans become <code>, and where the text names a published lesson by its title
 * (or by the part of the title before a colon, at least 12 characters, matched exactly) that name links to the lesson.
 */
export function summaryHtml(summary: string, lessons: LessonRef[]): string {
	const names: { name: string; href: string }[] = [];
	for (const l of lessons) {
		names.push({ name: l.title, href: l.href });
		const head = l.title.split(': ')[0];
		if (head !== l.title) names.push({ name: head, href: l.href });
	}
	const candidates = names.filter((n) => n.name.length >= 12).sort((a, b) => b.name.length - a.name.length);
	return summary
		.split(/(`[^`]+`)/)
		.map((part) => {
			if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
			let html = '';
			let rest = part;
			while (rest) {
				let best: { at: number; name: string; href: string } | undefined;
				for (const c of candidates) {
					const at = rest.indexOf(c.name);
					if (at >= 0 && (!best || at < best.at || (at === best.at && c.name.length > best.name.length))) best = { at, ...c };
				}
				if (!best) {
					html += escapeHtml(rest);
					break;
				}
				html += `${escapeHtml(rest.slice(0, best.at))}<a href="${escapeHtml(best.href)}">${escapeHtml(best.name)}</a>`;
				rest = rest.slice(best.at + best.name.length);
			}
			return html;
		})
		.join('');
}

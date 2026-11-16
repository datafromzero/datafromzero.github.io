/**
 * Lists lessons whose `reviewed` date is older than 18 months (SPEC §12). Prints a Markdown report;
 * with --output FILE also writes it, and exits 0 either way (the workflow decides what to do).
 * Usage: node scripts/review-report.ts [--output file] [--months 18] [docs-dir]
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readContent } from './lib/content-files.ts';

/** True when `reviewed` is more than `months` calendar months before `now`. */
export function isStale(reviewed: Date, now: Date, months: number): boolean {
	const limit = new Date(now);
	limit.setUTCMonth(limit.getUTCMonth() - months);
	return reviewed < limit;
}

export interface Stale {
	file: string;
	id: string;
	reviewed: string;
}

export function staleLessons(root: string, now: Date, months: number): Stale[] {
	return readContent(root, ['lesson'])
		.flatMap(({ file, data }) => {
			if (!data || data.status === 'draft' || data.status === 'deprecated') return [];
			const reviewed = new Date(data.reviewed as string);
			return Number.isNaN(reviewed.getTime()) || !isStale(reviewed, now, months)
				? []
				: [{ file, id: String(data.id), reviewed: reviewed.toISOString().slice(0, 10) }];
		})
		.sort((a, b) => a.reviewed.localeCompare(b.reviewed) || a.id.localeCompare(b.id));
}

if (import.meta.main) {
	const args = process.argv.slice(2);
	const take = (flag: string) => {
		const i = args.indexOf(flag);
		return i < 0 ? undefined : args.splice(i, 2)[1];
	};
	const output = take('--output');
	const months = Number(take('--months') ?? 18);
	const root = resolve(args[0] ?? 'src/content/docs');
	const stale = staleLessons(root, new Date(), months);
	const report = stale.length
		? `${stale.length} lesson(s) were last reviewed more than ${months} months ago:\n\n${stale
				.map((s) => `- \`${s.id}\` reviewed ${s.reviewed} (\`${s.file}\`)`)
				.join('\n')}\n\nCheck each lesson against its sources, then update \`reviewed\`.\n`
		: `No lesson was last reviewed more than ${months} months ago.\n`;
	console.log(report);
	if (output) writeFileSync(output, report);
}

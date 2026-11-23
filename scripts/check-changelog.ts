/**
 * Changelog gate (SPEC §9, D54): every top-level bullet of CHANGELOG.md starts with a bold, dated summary, because
 * `/changelog/` ("What's new") shows only those summaries. Prints `file:line` for each bullet that lacks one.
 * Usage: node scripts/check-changelog.ts [file]   (default: CHANGELOG.md)
 */
import { readFileSync } from 'node:fs';
import { parseChangelog } from '../src/lib/changelog.ts';

const file = process.argv[2] ?? 'CHANGELOG.md';
const { entries, problems } = parseChangelog(readFileSync(file, 'utf8'));
if (problems.length) {
	console.error(`Changelog bullets without a bold summary:\n${problems.map((p) => `  - ${file}:${p.line}: ${p.message}`).join('\n')}`);
	process.exit(1);
}
console.log(`CHANGELOG.md: ${entries.length} bullets, each with a bold dated summary.`);

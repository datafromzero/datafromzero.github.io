/**
 * `npm run check`: every blocking gate of SPEC §12 that can run locally, in a sensible order
 * (cheap static checks first, the site build next, slow fixture builds last). Runs all steps, then
 * prints a summary and exits non-zero if any failed. Lighthouse CI is separate: `npm run lighthouse`.
 */
import { spawnSync } from 'node:child_process';

const steps = [
	['spelling (cspell)', 'npm', ['run', '--silent', 'spell']],
	['markdown style (markdownlint)', 'npm', ['run', '--silent', 'lint:md']],
	['knowledge graph is current', 'npm', ['run', '--silent', 'check:kb']],
	['lesson rules from the mistakes log', 'npm', ['run', '--silent', 'check:lessons']],
	['lesson durations are at least 80% of the model (D65)', 'npm', ['run', '--silent', 'check:durations']],
	['career pages state the hours the lessons give (D69)', 'npm', ['run', '--silent', 'check:career-route']],
	['lesson figures match their generators and are centered in their viewBox', 'npm', ['run', '--silent', 'check:figures']],
	['build + schema + internal links', 'npm', ['run', '--silent', 'build']],
	['noindex pages are not in the sitemap', 'npm', ['run', '--silent', 'check:sitemap']],
	['no owner placeholders on deployed pages', 'npm', ['run', '--silent', 'check:placeholders']],
	['prerequisite graph', 'npm', ['run', '--silent', 'check:graph']],
	['every changelog bullet has a bold summary', 'npm', ['run', '--silent', 'check:changelog']],
	['unit tests (graph.ts)', 'npm', ['run', '--silent', 'test:unit']],
	['fixture tests (valid builds, invalid fails)', 'npm', ['run', '--silent', 'test:fixtures']],
	['notebooks have no outputs (nbstripout)', 'npm', ['run', '--silent', 'check:notebooks']],
	['Python cheatsheet patterns run on the cafe-sales data (skipped without pandas)', 'npm', ['run', '--silent', 'check:cheatsheet-python']],
	['app-events dataset matches its generator and its planted quirks (skipped without Python 3)', 'npm', ['run', '--silent', 'check:app-events'], 'python3'],
	['cafe-sales extras (settlements.csv, sales_clean.csv, take_home_export.csv) match their generators (skipped without Python 3)', 'npm', ['run', '--silent', 'check:extras'], 'python3'],
];

const failed = [];
for (const [name, cmd, args, needs] of steps) {
	console.log(`\n=== ${name} ===`);
	if (needs && spawnSync(needs, ['--version']).error) {
		console.log(`skipped: ${needs} is not installed`);
		continue;
	}
	const r = spawnSync(cmd, args, { stdio: 'inherit' });
	if (r.status !== 0) failed.push(name);
}
console.log(failed.length ? `\nFAILED:\n${failed.map((n) => `  - ${n}`).join('\n')}` : '\nAll checks passed.');
process.exit(failed.length ? 1 : 0);

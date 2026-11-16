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
	['build + schema + internal links', 'npm', ['run', '--silent', 'build']],
	['prerequisite graph', 'npm', ['run', '--silent', 'check:graph']],
	['unit tests (graph.ts)', 'npm', ['run', '--silent', 'test:unit']],
	['fixture tests (valid builds, invalid fails)', 'npm', ['run', '--silent', 'test:fixtures']],
	['notebooks have no outputs (nbstripout)', 'npm', ['run', '--silent', 'check:notebooks']],
];

const failed = [];
for (const [name, cmd, args] of steps) {
	console.log(`\n=== ${name} ===`);
	const r = spawnSync(cmd, args, { stdio: 'inherit' });
	if (r.status !== 0) failed.push(name);
}
console.log(failed.length ? `\nFAILED:\n${failed.map((n) => `  - ${n}`).join('\n')}` : '\nAll checks passed.');
process.exit(failed.length ? 1 : 0);

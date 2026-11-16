/**
 * Builds the valid fixture site in a temporary sandbox, then runs Lighthouse CI against it
 * (mobile, SPEC §12 budgets in lighthouserc.cjs). Usage: node scripts/lighthouse.mjs
 */
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { FIXTURES, REPO, build, createSandbox, removeSandbox, useDocs } from '../tests/lib/sandbox.mjs';

const sandbox = createSandbox();
let code = 1;
try {
	useDocs(sandbox, join(FIXTURES, 'valid'));
	const b = build(sandbox);
	if (!b.ok) {
		console.error(b.output);
		throw new Error('fixture build failed');
	}
	const r = spawnSync(process.execPath, [join(REPO, 'node_modules', '@lhci', 'cli', 'src', 'cli.js'), 'autorun', `--config=${join(REPO, 'lighthouserc.cjs')}`], {
		cwd: REPO,
		stdio: 'inherit',
		env: { ...process.env, FIXTURE_DIST: join(sandbox, 'dist') },
	});
	code = r.status ?? 1;
} finally {
	removeSandbox(sandbox);
}
process.exit(code);

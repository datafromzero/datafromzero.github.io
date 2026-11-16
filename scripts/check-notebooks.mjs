/**
 * Notebooks must have no outputs (SPEC §12): `nbstripout --verify`. Skipped with a note when there are
 * no notebooks yet, or when nbstripout is not installed (an error when CI is set) (CI installs it with pip; locally: pipx install nbstripout).
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function* notebooks(dir) {
	for (const e of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) yield* notebooks(p);
		else if (e.name.endsWith('.ipynb')) yield p;
	}
}

const files = existsSync('notebooks') ? [...notebooks('notebooks')] : [];
if (!files.length) {
	console.log('nbstripout: skipped, no notebooks yet (notebooks/**/*.ipynb).');
	process.exit(0);
}
if (spawnSync('nbstripout', ['--version'], { stdio: 'ignore' }).status !== 0) {
	const msg = `nbstripout: not installed (${files.length} notebooks not verified). Install it with: pipx install nbstripout`;
	if (process.env.CI) {
		console.error(msg);
		process.exit(1);
	}
	console.log(`${msg.replace('not installed', 'skipped, not installed')}`);
	process.exit(0);
}
const r = spawnSync('nbstripout', ['--verify', ...files], { stdio: 'inherit' });
process.exit(r.status ?? 1);

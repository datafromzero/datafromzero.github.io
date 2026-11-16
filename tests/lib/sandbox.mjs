/**
 * Test sandbox: a temporary copy of the repository (node_modules is hard-linked, not copied) into which
 * fixture documents are placed. The real repository is never modified. Fixtures live under
 * tests/fixtures/ and never under src/content, so they cannot be deployed.
 */
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const FIXTURES = join(REPO, 'tests', 'fixtures');
const SKIP = new Set(['node_modules', 'dist', '.astro', '.git', 'tests', '.lighthouseci']);

export function createSandbox() {
	const dir = mkdtempSync(join(tmpdir(), 'dfz-sandbox-'));
	cpSync(REPO, dir, { recursive: true, filter: (src) => !SKIP.has(src.slice(REPO.length + 1).split('/')[0]) });
	// A symlinked node_modules breaks Vite's module resolution; hard links are fast and cost no disk space.
	// Falls back to a plain copy when the temp dir is on another file system.
	const nm = join(dir, 'node_modules');
	if (spawnSync('cp', ['-al', join(REPO, 'node_modules'), nm]).status !== 0) {
		rmSync(nm, { recursive: true, force: true });
		cpSync(join(REPO, 'node_modules'), nm, { recursive: true });
	}
	return dir;
}

export function removeSandbox(dir) {
	rmSync(dir, { recursive: true, force: true });
}

/** Resets src/content/docs to the repository's own pages, then overlays each fixture `docs/` folder in order. */
export function useDocs(sandbox, ...fixtureDirs) {
	const docs = join(sandbox, 'src', 'content', 'docs');
	rmSync(docs, { recursive: true, force: true });
	rmSync(join(sandbox, '.astro'), { recursive: true, force: true });
	cpSync(join(REPO, 'src', 'content', 'docs'), docs, { recursive: true });
	for (const f of fixtureDirs) cpSync(join(f, 'docs'), docs, { recursive: true });
	return docs;
}

function run(cmd, args, cwd) {
	const r = spawnSync(cmd, args, {
		cwd,
		encoding: 'utf8',
		env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', CI: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
		maxBuffer: 64 * 1024 * 1024,
	});
	return { ok: r.status === 0, output: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

export const build = (sandbox) => run('npm', ['run', 'build', '--silent'], sandbox);
export const checkGraph = (sandbox) => run(process.execPath, [join(REPO, 'scripts', 'check-graph.ts'), join(sandbox, 'src', 'content', 'docs')], sandbox);

export const read = (p) => readFileSync(p, 'utf8');
export const exists = existsSync;

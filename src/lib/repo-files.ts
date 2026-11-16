import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Reads a file at the repository root at build time (single source for CHANGELOG.md, LICENSE, CITATION.cff). */
export function readRepoFile(name: string): string {
	return readFileSync(join(process.cwd(), name), 'utf8');
}

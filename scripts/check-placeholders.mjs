// Fails when an owner placeholder reaches a deployed page. Draft lessons may contain
// `TODO(owner)`, but drafts are never built for production (SPEC D18), so dist/ must be clean.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
const hits = [];
const walk = (dir) => {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) walk(path);
		else if (name.endsWith('.html') && readFileSync(path, 'utf8').includes('TODO(owner)')) hits.push(path);
	}
};
try {
	walk(root);
} catch {
	console.error('check-placeholders: dist/ not found; run `npm run build` first.');
	process.exit(1);
}
if (hits.length) {
	console.error(`Owner placeholders found on deployed pages:\n${hits.map((h) => `  - ${h}`).join('\n')}`);
	process.exit(1);
}
console.log('No owner placeholders on deployed pages.');

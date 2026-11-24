/**
 * Every built page that says `noindex` must be absent from the sitemap (SPEC §3.1, D58), and the sitemap must still
 * list real pages. Run after `npm run build`.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = 'dist';
const urls = [];
for (const f of readdirSync(dist).filter((n) => /^sitemap-\d+\.xml$/.test(n)))
	urls.push(...[...readFileSync(join(dist, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
if (urls.length < 10) {
	console.error('check-sitemap: the sitemap has fewer than 10 URLs (build first?)');
	process.exit(1);
}
const noindex = [];
(function walk(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) walk(path);
		else if (name === 'index.html' && /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(readFileSync(path, 'utf8')))
			noindex.push('/' + relative(dist, path).split(sep).slice(0, -1).join('/') + '/');
	}
})(dist);
if (!existsSync(join(dist, 'feedback', 'sent', 'index.html')) || noindex.length === 0) {
	console.error('check-sitemap: expected noindex pages (the feedback pages) in dist');
	process.exit(1);
}
const bad = noindex.filter((p) => urls.some((u) => new URL(u).pathname === p));
if (bad.length) {
	console.error(`check-sitemap: noindex pages listed in the sitemap: ${bad.join(', ')}`);
	process.exit(1);
}
console.log(`check-sitemap: ${noindex.length} noindex pages, none in the sitemap (${urls.length} URLs).`);

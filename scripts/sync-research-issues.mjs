#!/usr/bin/env node
// Copies every GitHub issue labelled `research` into research/issues/<number>-<slug>.md so the knowledge
// graph (`npm run kb`) indexes them like the curriculum package. Read-only on GitHub; public API, no token.
// Usage: node scripts/sync-research-issues.mjs   (then `npm run kb`)
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const REPO = 'datafromzero/datafromzero.github.io';
const OUT = 'research/issues';

const res = await fetch(`https://api.github.com/repos/${REPO}/issues?labels=research&state=all&per_page=100`, {
	headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'datafromzero-research-sync' },
});
if (!res.ok) {
	console.error(`sync-research-issues: GitHub answered ${res.status}`);
	process.exit(1);
}
const issues = (await res.json()).filter((i) => !i.pull_request);

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith('.md') && f !== 'README.md') rmSync(`${OUT}/${f}`);

const slug = (t) =>
	t
		.replace(/^\[?research\]?:?\s*/i, '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 60)
		.replace(/-$/, '');

const rows = [];
for (const i of issues.sort((a, b) => a.number - b.number)) {
	const file = `${i.number}-${slug(i.title)}.md`;
	const head = [
		`# #${i.number} ${i.title.replace(/^\[Research\]\s*/i, 'Research: ')}`,
		'',
		`<!-- Copied from ${i.html_url} by scripts/sync-research-issues.mjs; edit the issue, not this file. -->`,
		'',
		`- Issue: [#${i.number}](${i.html_url}) (${i.state}), opened ${i.created_at.slice(0, 10)}`,
		'',
	].join('\n');
	// Issue bodies use `###` for their form fields and `#` for an embedded report title: make both `##`, so every
	// field and every report section is a top-level section under the file's `#` title (what kb indexes).
	const body = (i.body ?? '').replace(/\r\n/g, '\n').replace(/^(### (?=Type|Summary|Evidence|Affected|Suggested|Priority|Confidence|Checks)|# )/gm, '## ');
	writeFileSync(`${OUT}/${file}`, `${head}\n${body.trim()}\n`);
	rows.push(`| [#${i.number}](${file}) | ${i.state} | ${i.title.replace(/\|/g, '\\|')} |`);
}

writeFileSync(
	`${OUT}/README.md`,
	[
		'# Research issues (copies)',
		'',
		'Copies of the GitHub issues labelled `research`, refreshed by `npm run research:sync`, so the knowledge graph',
		'(`npm run kb`) can search them. The issue on GitHub is the source; these files are not edited by hand.',
		'',
		'| Issue | State | Title |',
		'|---|---|---|',
		...rows,
		'',
	].join('\n'),
);
console.log(`sync-research-issues: ${issues.length} issues written to ${OUT}/`);

/**
 * `npm run check:lessons`: catches lesson mistakes the team has made before (.claude/MISTAKES.md), so a rule that
 * was broken once fails the build instead of waiting for a reviewer. Checks every lesson in the stage folders:
 *   - British spellings (American English only, D30)
 *   - first-person research notes or process notes outside a TODO(owner) paragraph
 *   - a bare `$` inside an inline SVG (use &#36;)
 *   - `datasets:` naming a folder that does not exist in datasets/
 *   - a placeholder line left in a written lesson (`XX`, `TBD`, `TODO` outside a TODO(owner) note)
 * Code spans, fenced code and SVG text (which shows data values as they are) are ignored for the spelling check.
 * Lessons that are still unwritten stubs are skipped: their planned datasets may not exist yet.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const STAGES = ['excel', 'sql', 'python', 'core', 'data-analyst', 'data-engineer', 'data-scientist', 'ml-engineer'];
const DOCS = 'src/content/docs';

const BRITISH = /\b(grey(ed|s)?|colour(s|ed|ful)?|favour(s|ite)?|behaviour(s)?|centre(s|d)?|licence|cancelled|cancelling|organis(e|ed|es|ing|ation)|analys(e|ed|es|ing)|summaris(e|ed|es|ing)|recognis(e|ed|es|ing)|optimis(e|ed|es|ing))\b/i;
const FIRST_PERSON = /\bI (could not|couldn't|did not|didn't|was not able|wasn't able|have not|haven't) (find|verify|run|test|open|confirm|check)\b|\bchecked as SQL\b/i;

const problems = [];
const report = (file, line, msg) => problems.push(`${file}:${line}: ${msg}`);

for (const stage of STAGES) {
	const dir = join(DOCS, stage);
	if (!existsSync(dir)) continue;
	for (const name of readdirSync(dir)) {
		if (!/\.mdx?$/.test(name)) continue;
		const file = join(dir, name);
		const text = readFileSync(file, 'utf8');
		if (text.includes('Draft: the owner writes this section.')) continue; // unwritten stub
		const lines = text.split('\n');

		const fm = text.match(/^---\n([\s\S]*?)\n---/);
		if (fm) {
			const block = fm[1].match(/^datasets:\s*\n((?:\s+-\s+.+\n?)+)/m);
			const inline = fm[1].match(/^datasets:\s*\[(.*)\]/m);
			const names = block
				? [...block[1].matchAll(/-\s+(.+)/g)].map((m) => m[1].trim())
				: inline
					? inline[1].split(',').map((s) => s.trim()).filter(Boolean)
					: [];
			for (const d of names) {
				if (!existsSync(join('datasets', d))) report(file, 1, `datasets names "${d}", but datasets/${d}/ does not exist`);
			}
		}

		let inFence = false;
		let inSvg = false;
		let inTodo = false;
		lines.forEach((raw, i) => {
			const n = i + 1;
			if (/^\s*```/.test(raw)) {
				inFence = !inFence;
				return;
			}
			if (inFence) return;
			if (/<svg\b/.test(raw)) inSvg = true;
			if (inSvg && /\$/.test(raw.replace(/\\\$/g, ''))) report(file, n, 'bare $ inside an SVG; write &#36;');
			if (/<\/svg>/.test(raw)) inSvg = false;

			// A TODO(owner) paragraph runs until the next blank line.
			if (/TODO\(owner\)/.test(raw)) inTodo = true;
			if (raw.trim() === '') inTodo = false;

			const prose = raw.replace(/`[^`]*`/g, '');
			if (!inSvg && /^\s*(XX+|TBD)\s*$/i.test(raw)) report(file, n, `placeholder line "${raw.trim()}"; finish the text`);
			if (!inSvg && !inTodo && /\bTODO\b(?!\(owner\))/.test(prose)) report(file, n, 'TODO outside a TODO(owner) note; finish the text or write TODO(owner)');
			const m = !inSvg && prose.match(BRITISH);
			if (m) report(file, n, `British spelling "${m[0]}"; use American English`);
			if (!inTodo && FIRST_PERSON.test(prose)) report(file, n, 'first-person or process note in learner text; move it to TODO(owner)');
		});
	}
}

if (problems.length) {
	console.error(`Lesson checks failed (rules in .claude/MISTAKES.md):\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log('Lesson checks passed.');

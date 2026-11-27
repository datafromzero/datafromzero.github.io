/**
 * Hours of each career route and of the analytics-engineer route (SPEC D69).
 *
 *   node scripts/career-route.ts              print the tables
 *   node scripts/career-route.ts --check      exit 1 when a career page states other numbers than the lessons give
 *   node scripts/career-route.ts --md FILE    write the tables to FILE (Markdown)
 *   node scripts/career-route.ts --table TRACK  print the hours table of one career page, ready to paste
 *
 * The numbers come from the `duration` of the published lessons (src/lib/career-route.ts); nothing is added by hand.
 * `--check` reads the box "What you finish with" of the four career pages and the analytics-engineer section of the
 * Data Analyst page, and fails when a total, a lesson count, a pace or a lesson's minutes differ.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { aeRoute, aeSummaryRows, code, expectedStrings, href, routeFacts, sumMinutes, TRACKS, type RouteLesson } from '../src/lib/career-route.ts';
import { loadRouteLessons } from './lib/route-lessons.ts';

const DOCS = resolve('src/content/docs');

const lessons = loadRouteLessons();
const h = (m: number) => (m / 60).toFixed(1);

function tables(): string {
	const out: string[] = ['# Career routes: hours from the lesson durations', ''];
	out.push('Every number is the sum of the `duration` frontmatter of the published lessons (SPEC D65 sets it from the duration model).', '');
	out.push('## Hours for each route, Excel to the track capstone', '');
	out.push('| Route | Lessons | Minutes | Hours | Weeks at 5 h/week | Weeks at 10 h/week | Left out |', '|---|---:|---:|---:|---:|---:|---|');
	for (const t of TRACKS) {
		const f = routeFacts(t, lessons);
		const left = f.excluded ? `deep dive: ${f.excluded.lessons} lessons, ${f.excluded.minutes} minutes${f.excluded.drafts ? ` (${f.excluded.drafts} not yet published)` : ''}` : 'nothing';
		out.push(`| ${t} | ${f.lessons} | ${f.minutes} | ${f.hours} (${h(f.minutes)}) | ${f.weeks[5]} | ${f.weeks[10]} | ${left} |`);
	}
	out.push('', '## By stage', '', '| Stage | Lessons | Minutes | Hours |', '|---|---:|---:|---:|');
	const f0 = routeFacts('data-analyst', lessons);
	for (const b of f0.breakdown.slice(0, 4)) out.push(`| ${b.title} | ${b.lessons} | ${b.minutes} | ${h(b.minutes)} |`);
	for (const t of TRACKS) {
		const b = routeFacts(t, lessons).breakdown[4];
		out.push(`| ${b.title} (track) | ${b.lessons} | ${b.minutes} | ${h(b.minutes)} |`);
	}
	const ae = aeRoute(lessons);
	const rows = (label: string, list: RouteLesson[]) => list.map((l) => `| ${label} | ${code(l)} | ${l.title} | ${l.duration} |`);
	out.push('', '## Analytics-engineer route', '', '| Part | Code | Lesson | Minutes |', '|---|---|---|---:|');
	out.push(...rows('Data Analyst lessons to have done', ae.da), ...rows('Set up the starter', ae.setup), ...rows('dbt lessons', ae.dbt), ...rows('Read back (named in the dbt warm-ups)', ae.back));
	out.push('', `Totals in minutes: Data Analyst picks ${ae.minutes.da}, set-up ${ae.minutes.setup}, dbt ${ae.minutes.dbt} (${h(ae.minutes.dbt)} h), read back ${ae.minutes.back}.`);
	out.push('', '### Foundation lessons the set-up, dbt and read-back lessons list as prerequisites (direct ones only)', '', '| Code | Lesson | Minutes |', '|---|---|---:|');
	for (const l of ae.foundation) out.push(`| ${code(l)} | ${l.title} | ${l.duration} |`);
	out.push('', `Foundation prerequisites: ${ae.foundation.length} lessons, ${ae.minutes.foundation} minutes (${h(ae.minutes.foundation)} h).`);
	out.push('', '### Data Engineer lessons skipped before DE14 and not read back', '', ae.skipped.map((l) => `${code(l)} ${l.title} (${l.duration})`).join('; '), `Total ${sumMinutes(ae.skipped)} minutes.`);
	return out.join('\n') + '\n';
}

function check(): string[] {
	const problems: string[] = [];
	for (const t of TRACKS) {
		const page = readFileSync(`${DOCS}/${t}/index.md`, 'utf8');
		if (!page.includes('\n## What you finish with\n')) problems.push(`${t}/index.md: no "## What you finish with" section`);
		for (const s of expectedStrings(routeFacts(t, lessons))) {
			if (!page.includes(s)) problems.push(`${t}/index.md: expected "${s}"`);
		}
	}
	const da = readFileSync(`${DOCS}/data-analyst/index.md`, 'utf8');
	const ae = aeRoute(lessons);
	if (!da.includes('\n## Analytics engineer route\n')) problems.push('data-analyst/index.md: no "## Analytics engineer route" section');
	for (const l of [...ae.da, ...ae.setup, ...ae.dbt, ...ae.back]) {
		const row = da.split('\n').find((line) => line.startsWith(`| ${code(l)} |`));
		if (!row) problems.push(`data-analyst/index.md: no table row for ${code(l)}`);
		else if (!row.trimEnd().endsWith(`| ${l.duration} |`)) problems.push(`data-analyst/index.md: ${code(l)} should state ${l.duration} minutes`);
	}
	for (const s of aeSummaryRows(ae)) {
		if (!da.includes(s)) problems.push(`data-analyst/index.md: expected the row "${s}"`);
	}
	for (const l of ae.foundation) {
		if (!da.includes(`](${href(l)})`)) problems.push(`data-analyst/index.md: the list of direct prerequisites should link ${code(l)}`);
	}
	return problems;
}

const args = process.argv.slice(2);
if (args.includes('--check')) {
	const problems = check();
	if (problems.length) {
		console.error(`Career route check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
		process.exit(1);
	}
	console.log(`Career route check passed: ${TRACKS.length} career boxes and the analytics-engineer section state the hours the lessons give.`);
} else if (args.includes('--table')) {
	// The hours table of one career page, ready to paste: node scripts/career-route.ts --table data-analyst
	const t = args[args.indexOf('--table') + 1] as (typeof TRACKS)[number];
	console.log(expectedStrings(routeFacts(t, lessons)).filter((s) => s.startsWith('|')).join('\n'));
} else if (args.includes('--ae-rows')) {
	// The lesson rows of the analytics-engineer section, ready to paste.
	const ae = aeRoute(lessons);
	const row = (l: RouteLesson) => `| ${code(l)} | [*${l.title}*](${href(l)}) | ${l.duration} |`;
	for (const [name, list] of [['Data Analyst', ae.da], ['Set up', ae.setup], ['dbt', ae.dbt], ['Read back', ae.back]] as const) console.log(`${name}\n${list.map(row).join('\n')}\n`);
	console.log(`Prerequisites\n${ae.foundation.map((l) => `- [*${l.title}*](${href(l)}) (${code(l)})`).join('\n')}\n`);
	console.log(`Summary\n${aeSummaryRows(ae).join('\n')}`);
	console.log(`Skipped: ${ae.skipped.map((l) => `${code(l)} ${l.duration}`).join(', ')}`);
} else if (args.includes('--md')) {
	const file = args[args.indexOf('--md') + 1];
	writeFileSync(file, tables());
	console.log(`wrote ${file}`);
} else {
	console.log(tables());
}

/**
 * Lesson duration model (SPEC D65). Estimates the minutes a beginner needs for a lesson from its source.
 *
 *   node scripts/lesson-duration.mjs              print the table: code, path, old, new
 *   node scripts/lesson-duration.mjs --detail     add the parts of each estimate (reading, code, exercises, setup)
 *   node scripts/lesson-duration.mjs --write      write the new durations into the frontmatter
 *   node scripts/lesson-duration.mjs --check      exit 1 when a stated duration is more than 20% below the model
 *   node scripts/lesson-duration.mjs --md FILE    write the full table and the model to FILE (Markdown)
 *
 * The audience is a beginner who only knows Office, reads English as a first or a good second language, and works
 * through every exercise. Estimate = (reading + code + exercises + figures) x BEGINNER_FACTOR + setup, rounded
 * to 5 minutes (minimum 10).
 *
 * SOURCES (primary, opened 2026-11-27)
 *   [B]  Brysbaert M. (2019). How many words do we read per minute? A review and meta-analysis of reading rate.
 *        Journal of Memory and Language 109, 104047. https://doi.org/10.1016/j.jml.2019.104047
 *        190 studies, 18,573 adults: silent reading of English non-fiction averages 238 wpm (most adults 175-300).
 *        It reports reading rate 17% slower in a second language than in a first (Cop, Drieghe & Duyck 2015, proficient
 *        Dutch-English bilinguals reading a novel in each language).
 *   [C]  Carver R. P. (1997). Reading for one second, one minute, or one year from the perspective of rauding theory.
 *        Scientific Studies of Reading 1(1), 3-45, Table 1: typical rates of college students by purpose, in standard
 *        words (6 characters) per minute: rauding (ordinary comprehension) 300, learning (to remember ideas) 200,
 *        memorizing (to remember facts) 138.
 *   [D]  Dhakal V., Feit A. M., Kristensson P. O., Oulasvirta A. (2018). Observations on typing from 136 million
 *        keystrokes. CHI 2018, https://doi.org/10.1145/3173574.3174220. 168,000 typists, mean 51.56 wpm (SD 20.2) when
 *        copying sentences of ordinary prose.
 *
 * WHAT IS SOURCED, DERIVED AND ASSUMED
 *   The three figures above were read in the full texts (2026-11-27): Brysbaert 2019 (238 wpm; "17% slower in L2 than in L1"),
 *   Carver 1997 Table 1, Dhakal 2018 (51.56, SD 20.2). Everything below is a derived estimate or an assumption.
 *   PROSE_WPM = 165      Derived estimate: Carver's learning rate (200, college students reading their first language) divided
 *                        by 1.17 (the L2 slowdown; one study of proficient Dutch-English bilinguals reading a novel, cited by
 *                        [B]) = 171, rounded down by judgement for technical text. Not measured on beginners.
 *   CODE_WPM = 55        Assumption. Anchored on a typing rate in words [D], not on reading code in tokens; nobody has measured
 *                        beginners reading code.
 *   DETAILS_SHARE = 0.5  Assumption. A learner opens every hint, half-solution and answer only when stuck; half of the words and
 *                        code inside <details> and <Solution> are counted.
 *   RUNSQL_MIN = 0.75    Assumption (run, compare with Expected, change one thing, run again). A blank starter block
 *                        ("-- Write your query here") adds nothing: the exercise time covers it.
 *   PREDICT_MIN = 1      Assumption: one minute to commit to an answer before running.
 *   EXERCISE_MIN = 5     Assumption: read and work one exercise (a faded or spot-the-flaw exercise 4 to 5 minutes, a blank start
 *                        8 to 12; the mean of the ladder is about 5). Counted once: the words of an Exercise block are NOT also
 *                        counted as reading, and RunSQL blocks inside it are not counted either.
 *   FIGURE_MIN = 0.75    Assumption: stepping through a figure and reading its labels.
 *   SETUP: practice file, sheet or notebook 3 min (the <OpenInColab>/<OpenInSheets> components, `notebook` or `sheet`
 *                        frontmatter, or the "**Your practice file" line); a named tool with an account or an installer 10 to 15
 *                        min (list SETUP below). Assumption, once per lesson.
 *   BEGINNER_FACTOR=1.3  Fitted to the four panel observations (not validated on other lessons); it stands for re-reading,
 *                        switching windows, looking up a word, slips and fixing them. None of the sources measures it.
 *
 * CALIBRATION against the learner panel of 2026-11-26 (minutes, observed). The constants were fitted to these four
 * observations; they have not been validated against any other measurement.
 *   core/defining-metrics        60-75   above-average analyst
 *   data-analyst/first-bi-dashboard  60-90 first-timer, with signup, build and publish
 *   excel/grid-and-tidy-layout   45-60   struggling second-language phone learner, 2-3 sittings
 *   sql/from-spreadsheet-to-sql  35-45   struggling learner
 * The model gives a beginner estimate (what is stored) and a range: LOW = estimate x 0.75 (confident reader), HIGH =
 * estimate x 1.75 (struggling, second-language, phone). Timeboxed lessons (simulations and capstones, TIMEBOXED) and
 * unwritten stubs keep their stated duration. `--check` also fails when "About N minutes" differs from `duration`.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const STAGES = ['excel', 'sql', 'python', 'core', 'data-analyst', 'data-engineer', 'data-scientist', 'ml-engineer'];
const PREFIX = { excel: 'E', sql: 'S', python: 'P', core: 'C', 'data-analyst': 'DA', 'data-engineer': 'DE', 'data-scientist': 'DS', 'ml-engineer': 'MLE' };
const DOCS = 'src/content/docs';

export const K = {
	PROSE_WPM: 165,
	CODE_WPM: 55,
	DETAILS_SHARE: 0.5,
	RUNSQL_MIN: 0.75,
	PREDICT_MIN: 1,
	EXERCISE_MIN: 5,
	FIGURE_MIN: 0.75,
	SETUP_FILE_MIN: 3,
	BEGINNER_FACTOR: 1.3,
	LOW: 0.75,
	HIGH: 1.75,
	GATE: 0.8,
};

// Tool setup beyond opening a practice file: an account, an installer or a local server (minutes, once per lesson).
// Keyed by slug. Assumptions, see above.
export const SETUP = {
	'first-bi-dashboard': 15, // Tableau Public: download, install, sign in or create an account, connect a file
	'querying-a-cloud-warehouse': 10, // BigQuery sandbox: Google project, no card
	'cloud-warehouse-in-practice': 10, // BigQuery setup box shared with the lesson above
	'query-plans-and-operators': 15, // PostgreSQL 16 or Docker, a script that loads the tables
	'wal-and-recovery': 15, // PostgreSQL programs initdb and pg_ctl
	'serving-a-model-api': 10, // Docker
};

// Timeboxed lessons: simulations (90 min) and capstones (180 min, core 240) are work sessions with a clock set by the
// lesson (D55), not reading time, so the model does not apply: the stated duration stays and the gate skips them.
export const TIMEBOXED = new Set([
	'capstone-two-quiet-weeks', 'take-home-simulation', 'portfolio-case-study', 'pipeline-capstone-design',
	'analytics-platform-capstone', 'take-home-with-written-defense', 'decision-product-case-study',
	'build-and-evaluate-simulation', 'ml-capstone',
]);

// The line that opens Learn by doing: "About N minutes, K new ideas"; N is the frontmatter duration (LESSON-STANDARD).
export const ABOUT = /^(About )(\d+) minutes/m;

const roundTo5 = (m) => Math.max(10, Math.round(m / 5) * 5);
const words = (s) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’.,%$:/_-]*/gu) || []).length;

/** Parts of the estimate, in minutes, before BEGINNER_FACTOR. `null` for an unwritten stub. */
export function estimate(text, slug, fm = {}) {
	if (text.includes('Draft: the owner writes this section.') || TIMEBOXED.has(slug)) return null;
	let body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
	body = body.replace(/^import .*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
	let figures = (body.match(/<figure[\s>]/g) || []).length;
	body = body.replace(/<figure[\s\S]*?<\/figure>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '');
	figures += 0;

	let proseW = 0;
	let codeW = 0;
	let runsql = 0;
	let share = 1;
	const take = (chunk, weight) => {
		// RunSQL blocks: the query counts as code, the run as a fixed cost.
		chunk = chunk.replace(/<RunSQL[\s\S]*?\/>/g, (m) => {
			const q = m.replace(/<RunSQL|query=|\/>|[{}`]/g, ' ').split('\n').filter((x) => x.trim() && !/^\s*--/.test(x));
			if (!q.length) return ' '; // a blank starter ("-- Write your query here"): the exercise time covers it
			runsql += weight;
			codeW += weight * words(m.replace(/<RunSQL|query=|\/>|[{}`]/g, ' '));
			return ' ';
		});
		chunk = chunk.replace(/```[\s\S]*?```/g, (m) => {
			codeW += weight * words(m.replace(/```\w*/g, ' '));
			return ' ';
		});
		chunk = chunk.replace(/<[^>]+>/g, ' ').replace(/^\s*\|?[\s|:-]+\|?\s*$/gm, ' ').replace(/`/g, '');
		proseW += weight * words(chunk);
	};
	// Closed content: <details> and <Solution> blocks count at DETAILS_SHARE.
	body = body.replace(/<(details|Solution)\b[^>]*>([\s\S]*?)<\/\1>/g, (m, _t, inner) => {
		take(inner, K.DETAILS_SHARE);
		return ' ';
	});
	// An exercise is counted once, as EXERCISE_MIN (read and work); its words are not also counted as reading.
	body = body.replace(/<Exercise\b[\s\S]*?<\/Exercise>/g, ' ');
	take(body, 1);
	void share;

	const predicts = (body.match(/\bPredict\b/g) || []).length;
	const exercises = (text.match(/<Exercise\b/g) || []).length;

	const reading = proseW / K.PROSE_WPM;
	const code = codeW / K.CODE_WPM;
	const runs = runsql * K.RUNSQL_MIN;
	const pred = predicts * K.PREDICT_MIN;
	const ex = exercises * K.EXERCISE_MIN;
	const fig = figures * K.FIGURE_MIN;
	const hasFile = /<OpenInColab|<OpenInSheets|\*\*Your practice file/.test(text) || fm.notebook || fm.sheet;
	const setup = (SETUP[slug] ?? 0) + (hasFile ? K.SETUP_FILE_MIN : 0);
	const work = reading + code + runs + pred + ex + fig;
	const point = work * K.BEGINNER_FACTOR + setup;
	return { reading, code, runs, pred, ex, fig, setup, work, point, low: point * K.LOW, high: point * K.HIGH, proseW, codeW, runsql, predicts, exercises, figures };
}

export function lessons(root = DOCS) {
	const out = [];
	for (const stage of STAGES) {
		for (const name of readdirSync(join(root, stage)).sort()) {
			// Stage pages (`{stage}/index.md`, D64) are landing pages, not lessons.
			if (!/\.mdx?$/.test(name) || /^index\.mdx?$/.test(name)) continue;
			const file = join(root, stage, name);
			const text = readFileSync(file, 'utf8');
			const fmText = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
			const g = (k) => fmText.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.trim();
			const order = Number(g('order'));
			const slug = name.replace(/\.mdx?$/, '');
			const half = order % 10 ? String.fromCharCode(96 + ((order % 10) >= 5 ? 2 : 1)) : '';
			const code = `${PREFIX[stage]}${Math.floor(order / 10)}${half}`;
			const old = Number(g('duration'));
			const est = estimate(text, slug, { notebook: g('notebook'), sheet: g('sheet') });
			out.push({ stage, slug, file, order, code, old, status: g('status'), est, text, new: est ? roundTo5(est.point) : old });
		}
	}
	return out;
}

const args = process.argv.slice(2);
if (import.meta.url === `file://${process.argv[1]}`) {
	const all = lessons();
	const rows = all.filter((l) => l.est);
	if (args.includes('--write')) {
		let n = 0;
		for (const l of all) {
			const t = l.text
				.replace(/^duration:\s*\d+\s*$/m, `duration: ${l.new}`)
				.replace(new RegExp(ABOUT.source, 'gm'), (_m, pre) => `${pre}${l.new} minutes`);
			if (t !== l.text) { writeFileSync(l.file, t); n++; }
		}
		console.log(`updated ${n} lesson files`);
	} else if (args.includes('--check')) {
		const bad = [];
		for (const l of all) {
			if (!Number.isFinite(l.old) || l.old <= 0) bad.push(`${l.file}: duration is not a positive number`);
			else if (l.est && l.old < K.GATE * l.est.point) bad.push(`${l.file}: duration ${l.old} is more than 20% below the model (${l.new} min; run npm run durations)`);
			else if (l.est && l.old > 1.5 * l.est.point) console.warn(`warning: ${l.file}: duration ${l.old} is more than 150% of the model (${l.new} min)`);
			for (const m of l.text.matchAll(new RegExp(ABOUT.source, 'gm'))) {
				if (Number(m[2]) !== l.old) bad.push(`${l.file}: the line "About ${m[2]} minutes" disagrees with duration ${l.old} (run node scripts/lesson-duration.mjs --write)`);
			}
			// Any other sentence that starts "About N minutes" must agree too (P1 once said 25 beside a 40-minute header).
			for (const m of l.text.matchAll(/(?<=[.!?]\s+|\*\*\s*)About (\d+) minutes\b/g)) {
				if (Number(m[1]) !== l.old) bad.push(`${l.file}: the sentence "About ${m[1]} minutes" disagrees with duration ${l.old}`);
			}
		}
		for (const m of bad) console.error(m);
		console.log(bad.length ? `${bad.length} duration problem(s)` : `durations honest: ${all.filter((l) => l.est).length} lessons at or above 80% of the model, "About N minutes" lines agree`);
		process.exit(bad.length ? 1 : 0);
	} else {
		const f = (n) => n.toFixed(1);
		console.log(['code'.padEnd(6), 'path'.padEnd(58), 'old'.padStart(4), 'new'.padStart(4), args.includes('--detail') ? ' read code runs pred  ex  fig setup low-high' : ''].join(' '));
		for (const l of all) {
			const e = l.est;
			const d = e ? ` ${f(e.reading).padStart(4)} ${f(e.code).padStart(4)} ${f(e.runs).padStart(4)} ${f(e.pred).padStart(4)} ${f(e.ex).padStart(4)} ${f(e.fig).padStart(4)} ${f(e.setup).padStart(4)} ${Math.round(e.low)}-${Math.round(e.high)}` : ' kept (stub or timeboxed)';
			console.log([l.code.padEnd(6), `${l.stage}/${l.slug}`.padEnd(58), String(l.old).padStart(4), String(l.new).padStart(4), args.includes('--detail') ? d : e ? '' : ' (stub or timeboxed, kept)'].join(' '));
		}
	}
}

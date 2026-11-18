# Lesson standard (compact)

The one page lesson agents read instead of the 463-line playbook. Distilled from
`research/curriculum/03-teaching-playbook.md` §2–§3 and from every review finding on the Excel stage.
No frontmatter `name`, so it is not loaded as an agent. Past mistakes and their rules: `.claude/MISTAKES.md`. Open the playbook only for a domain section you need
(§3.2 SQL, §3.3 Python, §3.4 statistics, §3.5 DE/ML/AI).

## Read, in this order

1. This file.
2. The model lesson of the stage (Excel: `src/content/docs/excel/grid-and-tidy-layout.mdx`; SQL: `src/content/docs/sql/from-spreadsheet-to-sql.mdx`
   for one-table lessons and `relational-model.mdx` for keys and joins); match its voice and length.
3. Your lessons' entries in `research/curriculum/06-curriculum-map.yaml` (`visual`, `notes`, `research`).
4. `datasets/cafe-sales/README.md` (tables, row counts, built-in surprises). Not the whole SPEC.

## Shape (seven `##` headings, exactly; SQL lessons have eight)

Warm-up · The question · The picture · **How it works (SQL lessons only)** · Worked example · Finish it · On your own ·
Check yourself.

- **Warm-up:** 2–3 recall prompts from earlier lessons (use their frontmatter objectives), at least one asks the
  learner to produce something; answers in lowercase `<details>`.
- **The question:** one business question with the data visible (a small table); promise the answer.
- **The picture:** one static inline SVG (at most two stacked), labels on the grid itself. A concept where rows move may use
  a step animation instead of one of them (see Step animations below).
- **How it works** (SQL lessons; the owner added it because the stage lacked theory): 200–400 words of prose right
  after the picture and before the worked example, in our own words with cafe-sales numbers. In this order: (1) the
  idea in one or two sentences; (2) the mechanism, a numbered list of what SQL does to the rows in logical order
  (`FROM` first for a query with several clauses), tied to the picture with "in the picture above…" without depending
  on it; (3) the rules, stated precisely, one bullet each (`GROUP BY`: every selected column is a key or inside an
  aggregate, and `WHERE` and `HAVING` run at different moments; windows: the row count never changes, and the default
  frame; joins: a join keeps every pair of rows where `ON` is true, `NULL` never equals anything, and a repeated key
  multiplies rows); (4) one **Excel** sentence that names the E-lesson by code and title; (5) one **common
  misconception** and why it is wrong. A tiny snippet only if it clarifies a rule; no new exercises. Do not give away a
  count that a step or exercise asks the learner to predict. Define each term on first use.
  Theory lives here only: the prose after the picture and the later sections must not restate it (the Excel mapping
  table may stay at the end of the section). **Sourcing:** each rule rests on a sentence in a page you opened (the
  DuckDB 2.0 docs, the engine the lesson runs), written in your own words; add the page to `sources` only if a claim of
  the section sits there. A rule the docs do not state is shown by a result you ran, or goes in `TODO(owner)`, and the
  report says which. Recompute every number with DuckDB 2.0.0. Never copy or closely paraphrase another teaching site's
  text, examples or diagrams. Count the section in the lesson's body words and raise `duration` by the length rule.
- **Worked example:** numbered steps, each with *why*; the last step verifies (row count, reconciled total, a
  second method); then a self-explanation `<details>`.
- **Finish it:** `<Exercise>` 1, faded: first steps given, learner finishes.
- **On your own:** `<Exercise>` 2, blank start on messy-by-design data; the learner writes the expected output in
  words (framing line) before working.
- **Check yourself:** one closed-book recall `<details>`, `<Exercise>` 3 spot-the-flaw (a plausible wrong
  solution), then "Can you do it?" (a testable ability statement) and the named pattern in one sentence.
- Every exercise: hint `<details>`, half-solution `<details>`, then exactly one `<Solution>`.
- One new idea per lesson. Keep within `duration`; say so in the report if it cannot fit.

## Rules the reviews kept catching

- **Exercises never overwrite** the worked example's sheet, cells or output. Each exercise has its own pre-built
  sheet (`calc_ex1`, `calc_ex2`, `calc_ex3`; notebooks: their own cells). Anything the text calls "done for you"
  must exist in the file.
- **Raw data is never edited**, not in examples and not in solutions (`raw_*` sheets, source CSVs).
- **Summary cells sit where a filter cannot hide them** (above the data or on another sheet).
- **Every number is computed by a script you ran** from `datasets/cafe-sales/v1/` or the lesson file. State which
  rows count (for example completed orders only vs all 1,800, including the canceled \$5.00 order) and say whether a
  figure includes the extra-zero line (order 2075).
- **Every tool claim is checked** in official docs you opened (Microsoft Support or Learn, Google Docs Editors Help,
  DuckDB, pandas). Show Excel and Google Sheets side by side; when a feature exists in only one, say so plainly.
  Give the Mac shortcut wherever you give a Windows one.
- **Unverified behavior goes in a `TODO(owner)` paragraph, never in learner text.** Learner text has no first
  person, no "I could not find", and no process notes like "checked as SQL".
- **Quotes are exact**, or they are paraphrases without quote marks.
- **SVG pictures match the real data** (codes, store numbers, results).

## Step animations (SPEC D41)

Pictures and animations are **original work**, drawn from our own cafe-sales rows and our design tokens; external
visuals (other sites' GIFs, posters, diagrams) may inspire the concept only. Never download, trace or recreate one,
and never copy its layout, colors, characters, captions or sample tables.

- **When:** only where the idea is rows moving or merging: aggregation and GROUP BY, joins, window functions, CTE
  pipelines, set operations, recursion. Not for syntax, formulas or anything a still picture shows as well. At most one
  per lesson, in "The picture", in place of one of its two SVGs; the static final frame must carry the whole meaning.
- **How:** write a spec in `scripts/animations/<lesson-id>.mjs` (copy `sql-inner-join.mjs`): draw the FINAL frame with
  `row`, `text`, `rect`, `path`, then give moving parts an effect: `in` (fades in), `out` (ends dimmed), `mv: [dx, dy]`
  (starts offset by multiples of 10, slides to where it is drawn), tied to a `step` and an optional `delay`. Run
  `node scripts/make-animation.mjs <name> --stats` and paste the `<figure class="sa">` block into the lesson (no blank
  lines inside it; MDX ends HTML at a blank line). The generator escapes `$` and `*` for you. Rerun and re-paste when the data changes.
- **Data:** rows come from the real tables; recompute counts with DuckDB 2.0.0 and say in the spec comment which query
  you ran. A miniature (a few real rows) may stand in for the full table; say so on the figure.
- **Captions rule:** 3 to 5 steps, one plain sentence each, in the order they play, so they double as the text
  description of the motion; the first step needs no animation. The `<title>` and `<desc>` describe the final frame.
- **No overlap:** text never overlaps other text at any moment of the run. Rows that must change places fade in at
  their new slot rather than slide through other rows (a slide is fine only along an empty lane). Check every 0.2 s:
  pause `document.getAnimations()` at each time and compare the text boxes.
- **Color (optional):** gray shades are the default. `sa-hue` on the figure (or on `<html>`) switches the shades `k1` to
  `k3` to three color-blind-safe hues, with the shades and labels kept; the owner has not chosen it yet.
- **Limits:** viewBox width 360 at most; about 15 KB of markup; the run ends within 10 s, once, no loops; shades are
  the site's grays (opacity steps `k1` to `k3`), never new colors; no `style` attribute, no script, no CSS variable in
  the markup. Check the lesson at 390 px and 1280 px, light and dark, closed, mid-run and with reduced motion.

## Markup

- `.mdx` only when a lesson uses components (`git mv` from `.md`; the slug stays). Components: `Exercise`,
  `Solution`, `Aside`, `OpenInColab`, `OpenInSheets`; no `Term` until glossary pages exist; no imports or scripts.
- Exercise ids: `{lesson-id}-{n}`, permanent.
- Dollar signs: `\$` in prose and tables, `&#36;` inside SVG; `*` inside SVG text: `&#42;`.
- SVG: `<svg viewBox="0 0 360 H" width="360" role="img" aria-labelledby="…">` with `<title>` and `<desc>`,
  `fill="currentColor"`, grid lines by `stroke-opacity`, no `style` attribute, no CSS variables, unique ids per page.
- No links to other lessons' URLs while they are drafts: name them by title.
- American English (gray, color, canceled). Frontmatter: change only `sources`, `datasets` and the body unless the
  brief says otherwise; keep `status: draft`.

## Files per lesson

- Excel: a workbook module `scripts/lesson_sheets/excel_{id_with_underscores}.py` with `build()` (shared helpers in
  `common.py`, do not edit it), built by `python3 scripts/build-lesson-sheets.py {lesson-id}` into
  `sheets/excel/{lesson-id}.xlsx`; sheets `raw_*`, `calc`, `calc_ex1..3`, `output`. Plus the `TODO(owner)` paragraph
  about the Google Drive `sheet` link, copied from the model lesson.
- SQL and Python: a notebook `notebooks/{stage}/{lesson-id}.ipynb` without outputs (the `notebook` field), loading
  data from the release-tag URL in SPEC §7 (now `v0.1.0`, D39). SQL notebooks copy the model lesson's setup cell
  (`%pip install -q duckdb==2.0.0`, then `con.execute(script)` on `cafe-sales.sql`; run
  `python3 scripts/pin-notebook-duckdb.py` and `python3 scripts/wrap-notebook-error-cells.py` after adding a notebook,
  so a cell that errors on purpose prints the error and Colab's Run all keeps going), use `con.sql("""...""").show()` cells without the closing `;`, one cell per
  worked step, empty or partial cells per exercise, and no solutions. The lesson renames to `.mdx` for `<OpenInColab />`.
- SQL lessons (D40): every worked step and exercise shows its expected result shape under the task, outside the
  `<Solution>` ("Expected: 3 rows, 2 columns"); do not print answers the learner should predict. Keep a test script
  in your report that runs every query on DuckDB against `datasets/cafe-sales/v1/cafe-sales.sql`. Explain only what
  the lesson's prerequisites have not taught yet; name earlier lessons by title and code at first use.
- Length: about 100 body words per minute of `duration` (a 20-minute lesson is at most about 2,200 words with the
  exercises); report the count. Body words: everything after the frontmatter except the `<svg>` blocks, code and the
  `TODO(owner)` paragraph included, split on whitespace.

## Done means

`npm ci` (worktrees start without `node_modules`), `npm run kb`, `npm run check` all pass; each lesson returns 200 on
`npx astro dev`; one commit authored as the owner (`git log -1 --format=%an` prints `johnha912`), no AI attribution.
Report in at most 25 lines: commit, files, key numbers and how they were checked, sources opened, `TODO(owner)`
items, doubts.

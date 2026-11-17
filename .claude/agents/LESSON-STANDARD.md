# Lesson standard (compact)

The one page lesson agents read instead of the 463-line playbook. Distilled from
`research/curriculum/03-teaching-playbook.md` §2–§3 and from every review finding on the Excel stage.
No frontmatter `name`, so it is not loaded as an agent. Open the playbook only for a domain section you need
(§3.2 SQL, §3.3 Python, §3.4 statistics, §3.5 DE/ML/AI).

## Read, in this order

1. This file.
2. The model lesson of the stage (Excel: `src/content/docs/excel/grid-and-tidy-layout.mdx`); match its voice and length.
3. Your lessons' entries in `research/curriculum/06-curriculum-map.yaml` (`visual`, `notes`, `research`).
4. `datasets/cafe-sales/README.md` (tables, row counts, built-in surprises). Not the whole SPEC.

## Shape (seven `##` headings, exactly)

Warm-up · The question · The picture · Worked example · Finish it · On your own · Check yourself.

- **Warm-up:** 2–3 recall prompts from earlier lessons (use their frontmatter objectives), at least one asks the
  learner to produce something; answers in lowercase `<details>`.
- **The question:** one business question with the data visible (a small table); promise the answer.
- **The picture:** one static inline SVG (at most two stacked), labels on the grid itself.
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
  data from the release-tag URL in SPEC §7.

## Done means

`npm ci` (worktrees start without `node_modules`), `npm run kb`, `npm run check` all pass; each lesson returns 200 on
`npx astro dev`; one commit authored as the owner (`git log -1 --format=%an` prints `johnha912`), no AI attribution.
Report in at most 25 lines: commit, files, key numbers and how they were checked, sources opened, `TODO(owner)`
items, doubts.

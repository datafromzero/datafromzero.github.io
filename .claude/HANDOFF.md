# Handoff: state of the work on 2026-11-17

For the next lead session. Read `CLAUDE.md` first (rules, merging policy, commands), then this file.
`SPEC.md` is authoritative; decisions D1–D46 are in its §1. Use `node scripts/kb.mjs query <topic>` to find things.

## Who is who

- **Owner:** the sole author of all lesson and story text (under D24 the owner may ask the team for a draft, which
  the owner edits and approves). Writes in Vietnamese in chat; the site is American English only for now (D30).
  Reply in Vietnamese.
- **Lead session:** plans, delegates to the agents in `.claude/agents/`, reviews, opens and merges PRs under the
  merging policy in `CLAUDE.md`.
- **External research:** arrives as GitHub issues that use the research-report template (label `research`).
  Build from the issue text exactly; keep its sources and honesty notes.

## What is live on `main`

- **Site:** Astro + Starlight, deployed to GitHub Pages on every push to `main`.
- **Homepage** (dark and light, GSAP only here, each effect a deferred chunk):
  - Hero: the logo and "From A1 to AI." lockup only.
  - 01 The core.
  - 02 "One trunk. Four careers."
  - 03 "Same question. Three tools."
  - 04 "A short history of data" (card slider with a line icon per card; short sourced summaries).
  - 05 "Pick a direction" (four career cards with canvas 3D figures, link to the quiz).
- **Bottom taskbar** on every page (D31, D35): a menu button labeled with the lesson code and the section being read,
  and `Next E9 →` on lessons (`Start E1 →` on `/start/`, `Start here →` everywhere else). Its sheet has two tabs, This lesson and Course, plus Home, Start
  here, Career quiz and the light/dark switch. On phones it replaces Starlight's menu button and "On this page" bar.
- **Project pages:** `/start/`, `/about/`, `/cite/`, `/changelog/`, `/license/`, `/privacy/`, `/career-quiz/` (D33).
- **Dataset:** `datasets/cafe-sales/` v1 (D29), built by `scripts/build-cafe-sales.py`; not released until `v1.0.0`.
- **Curriculum (D29, D32, D40, D45):** 166 lessons in 8 stages (Excel and SQL published, the rest `status: draft`, never deployed):
  Excel 22, SQL 35, Python 27, core 25, Data Analyst 13, Data Engineer 20, Data Scientist 12, ML Engineer 12.
  The map is `research/curriculum/06-curriculum-map.yaml`; lesson frontmatter is the source of truth.
- **Quality gates:** `npm run check` locally; CI runs `checks` and `lighthouse` on every PR.
- **Open issues and PRs:** issue #41 (Excel checks in the real apps, Sheets copy links).

- **SQL cheatsheet (D44, 2026-11-19):** `/sql/cheatsheet/` "SQL in a nutshell", one printable no-JS page (two A4 sides) from
  `src/data/cheatsheets/sql.ts` through `src/components/cheatsheet/Cheatsheet.astro`; run `python3 scripts/check-cheatsheet-sql.py`
  (needs Python `duckdb`) after editing a pattern. Excel and Python get the same page by adding a data file, a `CHEATSHEETS` line
  in `src/lib/roadmap.ts` and a page in `src/pages/{stage}/`. Also decided the same day: a small linear algebra block at the start of
  the Data Scientist and ML Engineer tracks (planned, not written).
- **Excel cheatsheet (D44, 2026-11-19):** `/excel/cheatsheet/` "Excel in a nutshell", data first (six parts in data-flow order, 24 cards, 3 drawings), from
  `src/data/cheatsheets/excel.ts` through the same component. Each card has a `next` (linked SQL lessons, pandas method names, no links to draft pages);
  `tests/cheatsheet.test.ts` checks that every formula is the lesson's own text and every SQL twin is published. No lesson states a duplicate-key trap for
  lookups, so none is on a card. Python gets its page the same way once its lessons are published.

- **Cheatsheet anchors and footer links (D44, 2026-11-19):** each card's id is its lesson code in lowercase (`#s8`; first card when a lesson has
  several); `LessonFooter.astro` shows "Sum it up: this lesson in the SQL cheatsheet →" from `cheatsheetLink` (`src/data/cheatsheets/index.ts`).
  A new stage sheet needs one line in `SHEETS` there; `tests/cheatsheet.test.ts` checks anchors are unique and every link resolves.

## What comes next (build plan item 8, content)

1. **Excel stage (22 lessons): published** on 2026-11-17 at the owner's request. Each lesson links its practice
   workbook in `sheets/excel/{lesson-id}.xlsx` (built by `scripts/lesson_sheets/`, one pre-built sheet per exercise).
   Open work is in issue #41: the owner checks steps that could not be run here (Power Query, Sheets `QUERY`, some menu
   names) and sends Google Sheets `/copy` links; each link becomes a `sheet` field plus `<OpenInSheets />`.
2. **Next stages:** SQL (35 lessons, D40; every query runs in the page, no notebooks or Colab, D43), then Python (27 lessons, D45; where Colab starts; notebooks
   load data from the `v0.1.0` tag, D39) and core. Use the
   lesson flow in `.claude/agents/README.md`: `content-producer` batches of ≤ 5 in parallel worktrees, following
   `.claude/agents/LESSON-STANDARD.md`, then `content-reviewer`, then fixes by the same writer. SQL needs a model
   lesson first (the lead or one writer drafts it; the owner approves it before the other batches start).
3. **Glossary:** no glossary entries exist yet, so lessons use no `Term` links. Glossary pages have no `status`
   field and would publish at once; ask the owner before adding them.
4. **Source links:** DuckDB, Power BI and Looker Studio URLs in the drafts were all opened on 2026-11-17 and return
   200. The DuckDB `docs/stable/...` URLs are redirect stubs to the current version (`docs/2.0/...`); the anchors
   `#foreign-keys`, `#syntax` and `#joins` exist there. Keep the `stable` form. Recheck only if a lesson adds new ones.
5. **In-page SQL runner (D42, built and amended 2026-11-18):** `<RunSQL>` is two boxes (editor, output) with a Tables panel, friendly
   errors, Auto-run and background loading near the block; `/sql/playground/` is the same runner full height (shared markup
   `SqlPad.astro`, CSS `src/styles/sql-runner.css`, scripts `run-sql.ts` > `sql-block.ts` > `sql-editor.ts` and `sql-runtime.ts`). It is in
   the three pilot lessons (S8, S14, S19). Rolling `<RunSQL>` out to all 35 lessons waits for the interleaved rewrite (owner-approved default). Rolling it to
   the other SQL lessons is mechanical (every Try it query and exercise starter; `.claude/agents/LESSON-STANDARD.md`
   "Runnable SQL"). **Planned next step:** Correct / Wrong self-checking on exercises, built on this runner (compare the
   learner's result with the stored expected result of each exercise). It needs its own SPEC decision (a stored expected
   result per exercise, and what "same result" means for row order) before it is built.
6. **Release `v1.0.0`** when the four core stages (109 lessons, D40, D45) are published; then enable Zenodo (SPEC §9, §14).

- **Python stage restructure (D45, 2026-11-19, from issue #61):** 27 lessons in `src/content/docs/python/` (all `.mdx`, all draft), in the new order of
  `research/curriculum/06-curriculum-map.yaml` (origin tag per lesson, the 2 awareness boxes, the draft-to-new compression). Cut `comprehensions`; renamed
  `files-csv-json` to `files-and-tables` (id kept); split `charts` into `charts-matplotlib` (id `python-charts` kept) and `charts-seaborn`; added
  `pandas-derived-columns` and `cafe-quarterly-pack`. The text is still the owner's: every section keeps the draft line and gets a placeholder
  paragraph. The 12 SQL-to-pandas bridge traps and 10 beginner traps of the issue are named exercise slots (each with a known answer checked against the
  cafe-sales data), and `notebooks/python/{lesson-id}.ipynb` holds one skeleton per lesson (setup, data from `v0.1.0`, empty working cells, check
  cells; 21 stated answers, the rest still a placeholder). The notebooks were run top to bottom locally with the solutions injected. Still open for the
  owner: the placeholders, the fifth chart type, the real messy-text example for the NFC trap, the sources for `read_excel`, `read_sql`, DuckDB and
  Plotly, the API for `apis-and-web-data`, and the issue's "8 to 6" compression (its own list gives 9 to 8).
  Owner instruction of the same day (learners know only Excel and SQL): `first-notebook` opens with a team-draft story (sources in its frontmatter, accessed
  2026-11-19) and no typing; lessons up to `dataframe-first-look` start with a "You already know this" bridge; the notebooks of those lessons carry
  pre-filled try-it cells and starters (see `.claude/agents/LESSON-STANDARD.md`).

- **Python batch 1 (2026-11-19, branch `python-batch-1`, team drafts for the owner to edit, D24):** the eight pure-Python lessons
  (`first-notebook` to `errors-and-debugging`) are written in full in the interleaved shape, with their notebooks (hint and solution
  cells, known-answer checks, adversarial cases, a scoreboard cell at the end). The teaching rules of research issue #66 are now in
  `.claude/agents/LESSON-STANDARD.md` ("Python stage (D45, D46)"). D46 adds the companion dataset `datasets/cafe-menu-accents/` (accented
  English café names in NFC and NFD, for the later text-cleaning lesson; no lesson uses it yet; no Vietnamese content until English and
  later Spanish are complete). The notebooks read the cafe-sales tables from the `v0.1.0` tag; the accents file is newer than that tag.
  Still open for the owner: the Colab screen details marked `TODO(owner)` in `first-notebook` (no official page could be read), the
  Excel `ROUND` tie check in `values-and-types`, and edits and approval of every lesson text.

- **Python batch 2 (2026-11-19, team drafts for the owner to edit, D24, all still `status: draft`):** `files-and-tables` (P9), `numpy-vectorization` (P10),
  `dataframe-first-look` (P11), `pandas-select-and-filter` (P12) and `pandas-derived-columns` (P13) are written in full in the interleaved shape with
  their notebooks, one figure each and three exercises each (the blank-cell Exercise 2 starts at P11). Every notebook was run from the top on pandas 3.1.1 and
  2.2.3, with the data from the real `v0.1.0` tag URLs, solutions injected, starters failing and one wrong answer per exercise rejected; the only
  output that differs between the two versions is the text dtype in P11 unit 1 (`str` on pandas 3, `object` on 2.2), named in its Why. Choices that
  the owner may reverse: P9 drops `read_sql`, the DuckDB demo and the `csv` module to keep four ideas (the title and the closing line of P8 still name SQL; a TODO
  proposes P23 or P26 for `read_sql`, on a `sqlite3` database built in memory because the tag has no database file); P10 leaves out `axis`,
  seeded `default_rng` and `@`; P12 leaves out `sort_values` and the `loc` label slice; P13 leaves out `lambda`. Still open for the owner: which pandas version
  Colab gives a new notebook today (its published package list names 2.2.3 and says it may be stale) and whether `openpyxl` is installed there, plus edits and
  approval of every lesson text.

- **Python batch 3 (2026-11-20, team drafts for the owner to edit, D24, all still `status: draft`):** `pandas-groupby-aggregate` (P14, opens with `sort_values` and the
  blanks-sort-last trap, owner-approved placement from issue #74), `pandas-merge-and-validate` (P15), `pandas-missing-data-and-types` (P16), `pandas-dates-and-resample` (P17) and
  `pandas-text-cleaning` (P18) are written in full with their notebooks, three exercises each (the blank-cell Exercise 2, one plausible wrong answer rejected per exercise)
  and one figure each; P14 uses a new CSS-only concept animation (`scripts/animations/concept-split-apply-combine.mjs`, pasted by hand because
  `scripts/refresh-concept-figures.mjs` reads only the SQL lessons). Every notebook was run from the top on pandas 3.1.1 (real `v0.1.0` URLs) and 2.2.3 with identical
  outputs. Choices the owner may reverse: P14 drops grouping by two keys and `pivot_table`; P15 drops `concat`, `suffixes` and the trap that blank keys match each other;
  P16 drops `to_numeric` and the median fill; P17 drops `date_range` and time zones beyond awareness; P18 drops the recoding with a mapping. P18 reads no file for the D46
  menu: the data cell holds the 48 lines of `menu_accents.csv` as pasted text, because the dataset is newer than the `v0.1.0` tag; when the owner creates the first tag that
  contains it, replace that text by one `read_csv` from the tag. Still open for the owner: edits and approval of every lesson text.
- **Python batch 4 (2026-11-20, team drafts for the owner to edit, D24, all still `status: draft`):** `pandas-reshape-wide-long` (P19, with grouping by two keys and
  `pivot_table`, placement from issue #76), `pandas-transform-rank-rolling` (P20), `charts-matplotlib` (P21, id `python-charts`), `charts-seaborn` (P22) and
  `apis-and-web-data` (P23, retitled "Data from an API and from a database", with a `read_sql` unit, placement from issue #74) are written in full with their notebooks, three
  exercises each and one figure each. Charts: each chart on a page is the figure its notebook cell draws, saved as SVG by the notebook run (the harness appends a
  `_save_svg` call to the chart cell, text and axes become `currentColor`, colors are the site's four figure colors) and pasted inline with `<title>` and `<desc>`; no image files,
  no JavaScript. The chart checks (`check_chart`) read the Axes, never pixels. API: Frankfurter (`api.frankfurter.dev/v2/rates`, `providers=ecb`), keyless; it
  answered from the build machine only, so the owner should run the P23 notebook in Colab once. Every notebook was run from the top on pandas 3.1.1 (real `v0.1.0` URLs)
  and 2.2.3. Choices the owner may reverse: P19 drops `crosstab`, `wide_to_long`, `stack`; P20 replaces "fill a missing value with its group mean" by the broadcast of a
  group total (no numeric column of cafe-sales has blanks to fill), and drops `cumsum` and `expanding`; P21 drops histogram, scatter and `subplots` (the fifth chart type stays
  open); P22 keeps one of the one-line charts (`histplot`); P23 drops pagination, `json_normalize`, `read_html` and a key-keeping demo. Still open for the owner: edits and
  approval of every lesson text, the direction of the Frankfurter `rate` (marked `TODO(owner)` in P23), and a Colab run of P23.
- **Python batch 5 (2026-11-20, the last of the Python stage, team drafts for the owner to edit, D24, all still `status: draft`):** `environments-and-pip` (P24),
  `cafe-quarterly-pack` (P25, capstone, Q2 April to June, `concat` placement from issue #76), `notebook-to-script` (P26) and `ai-assisted-code` (P27, ends with the Polars
  awareness box) are written in full with their notebooks and three exercises each (one plausible wrong answer rejected per exercise). Every notebook was run from the top
  on pandas 3.1.1 (real `v0.1.0` URLs) and 2.2.3; the only outputs that differ between the two are the two P24 lines that print the notebook's own pandas, named in its Why. The
  monthly files of P25 and P26 are cut from `orders.csv` by the setup cell (the datasets have no real monthly files). Choices the owner may reverse: P24 runs everything
  with `!` and `%pip`, shows terminal commands as text and leaves the terminal, Python versions, conda, uv and packaging to the later "Python for engineers" block (do not
  pre-empt it); P25 covers Q2 (Harbor trades the whole quarter), keeps order 2075 as recorded with the corrected reading beside it, has three new ideas in four units (the replay
  of reshape and chart is unit 3) and writes no cleaned-CSV or twin-notebook companions; P26 grows one file, `pack.py`, in four versions; P27 shows only assistant text written by
  the lesson, labeled as such, and no claim about how a model behaves beyond two NIST AI 600-1 sentences. Still open for the owner: edits and approval of every lesson text, and
  a Colab run of P24 to P26 (`python -m venv` and `ensurepip`, `%pip`, `%%writefile` and `!python` there, and the pins on Colab's Python).
- **Planned, not part of any batch (owner request, 2026-11-20):** a "Python for engineers" block in the advanced core, to be discussed with the owner after a Muse research
  issue arrives.

## Open items and owner decisions still pending

- **Google Analytics:** on since 2026-11-17 (`G-0TNDBK1ZJX`, retention 2 months, consent first). If the owner changes
  the retention in GA4, update `GA_RETENTION` in `src/site.ts` so `/privacy/` stays true.
- **Vietnamese:** paused (D30). `src/content/i18n/vi.json` is kept; `/vi/` URLs redirect to English.
  A Vietnamese terminology research prompt was given to the owner earlier; no result has arrived.
- **Homepage accessibility score is 97, not 100:** the 01 steps are dimmed to 25% until reached, which fails the
  contrast audit. It is the approved design; change it only if the owner asks.
- **Course-platform sources (owner decides when the Data Analyst branch is built):** the drafts
  `data-analyst/the-analysts-loop.md` and `portfolio-case-study.md` cite the Coursera program page of the Google Data
  Analytics certificate. The owner removed the Coursera mention from `/about/` to avoid advertising a provider; ask
  whether to keep, replace or drop these sources before publishing those lessons.
- **Course tab** lists every published lesson by stage automatically (`src/components/taskbar/Taskbar.astro`, D35).
- **Homepage author line** (`src/components/home/Author.astro`, strings `author` in `src/i18n/home/en.ts`, avatar
  `src/assets/author.jpg` from the owner's GitHub, served as webp by `astro:assets`). Option B of three the owner saw.
- **Consent card** (`src/components/project/Consent.astro`) copies the layout of the owner's johnha.info: fixed above
  the taskbar, hidden while the taskbar menu is open, classes prefixed `dfz-c-`. The owner tried it at the top of the
  page and preferred this.
- **Design prototype:** `design/homepage-prototype/index.html` is the original approved prototype and no longer
  matches the homepage; `design/README.md` §4–§5 describe the current design.

## Working rules that are easy to miss

- **Always give the owner a link.** When work is done: merge it (when the merging policy allows or the owner asked),
  wait for the Pages deploy, check the live page, then send its URL. For anything not live (drafts, open PRs), send a
  preview the owner can open (PDF or screenshots) and say why it is not on the site.

- **No AI attribution** in commits, PR bodies, issues, code or docs. The GitHub tool appends a "Generated by"
  footer to new PR bodies: update the PR body right after creating it to remove the footer.
- **Commits** are authored as the repo's configured git user.
- **Branches:** work on the session's assigned branch, open a PR to `main`, merge when CI is green and
  `spec-reviewer` approved. After a merge, reset the branch to `origin/main` and push.
- **Conflicts in `.claude/kb/`:** take either side, run `npm run kb`, commit the result.
- **Ask the owner first** for: CONTRACT changes, new SPEC decisions, lesson or story content, anything in SPEC §15,
  and removing a published URL.
- **Node:** `.nvmrc` says 26; checks have also been run on Node 22 without problems.

## Environment notes (per account, not stored in the repo)

- The GitHub App must be installed for the new account, with access to `datafromzero/datafromzero.github.io`.
- The cloud environment's network allow-list is per account. Hosts that were useful: `demos.gsap.com`, `gsap.com`,
  `duckdb.org`. Package registries work by default.
- Scratchpad files, mockup pages and chat history do not carry over. Everything needed is in this repository.

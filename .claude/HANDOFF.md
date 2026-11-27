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

- **Learner panel follow-up (2026-11-27, owner approved all parts):** a 3-persona panel (top, above-average, struggling ESL phone learner) read the site. Done: progress in the browser (D64, PR #147: `dfz-last` on lessons, Continue on `/start/` and home, done ticks, stage pages `/excel/` … `/ml-engineer/`); `/start/` rewritten; placement tests on the four stage pages (D67); warm-ups link back to the exact section (D66, `check:lessons` verifies); durations from a model with a gate (D65, `npm run durations`); plain-word glosses and phone routes ("On a phone (Google Sheets app)", Android help) or "needs a computer" across 172 lessons (PR #148). Not done yet, owner-approved: an optional deep-dive layer for strong learners (hand-run backprop on 19-8-1, Monte Carlo error of the permutation p, Adam/schedules/init, gradient boosting vs the network). Homepage section 04 is a 3D cover-flow fan (owner approved, PR #149; desktop p95 ~18 ms vs the old slider's 13, recorded in the PR). The glossary is built (D68, `/reference/glossary/`, 41 entries, `<Term>` in 40 lessons). Panel ideas not taken: certificates, community, video.

- **Page endings (2026-11-24, owner):** no page ends with a link row. Project links live in the sidebar's "About this site" group, in the taskbar sheet's Course pane (phones and the homepage; `.tb-about` in `Taskbar.astro`), and in the homepage footer; lessons end with the Report an issue form; Cookie settings is a button in the Analytics section of `/privacy/` only. Do not reintroduce a footer row (SPEC D34, §11).
- **Docs layout (2026-11-24):** content 48rem (prose 42rem), left sidebar 20rem, fixed 16rem "On this page" column; tokens and the Starlight width overrides are in `src/styles/tokens.css`, the taskbar position in `Taskbar.astro` uses the same variables (`--dfz-toc-width`).
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
- **Curriculum (D29, D32, D40, D45, D49, D61):** 222 lessons in 8 stages (Excel, SQL, Python, Data Analyst, Data Scientist and Data Engineer published, the rest `status: draft`, never deployed; the Python lesson `charts-plotly`, P22b, D61, published 2026-11-25; ML Engineer MLE1 to MLE10 published 2026-11-25 and MLE11 to MLE16 on 2026-11-26 (main path complete), the 8 deep-dive lessons drafts; **done (D62, owner approval 2026-11-26): MLE8 to MLE12 and MLE16 run on IBM Granite 4.0 1B, MLE2 `tiktok` → `podcast`, ml-starter rebuilt (new `PUBLISHED` hashes from lesson 2 on) and force-pushed by the owner on 2026-11-26 (`mle-16-done` = `856860b`, 12 tags); the feedback Worker with the D62 country check is live (version ed75dca8, typed in by hand, so diff it against `workers/feedback/worker.js` once)**):
  Excel 22, SQL 39, Python 28, core 44 (six parts and a capstone, D49), Data Analyst 18 (DA8b published 2026-11-25; split lessons read a, b, c: `SPLITS` in `src/lib/roadmap.ts`), Data Engineer 31 (20 plus an 11-lesson optional deep dive, published 2026-11-25),
  Data Scientist 16, ML Engineer 24 (16 plus an 8-lesson optional deep dive); track shape is D55, lesson codes DA, DE, DS and MLE.
  The map is `research/curriculum/06-curriculum-map.yaml` (its track stages match the files; other stages were not re-synced); lesson frontmatter is the source of truth.
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
  lookups, so none is on a card.
- **Python cheatsheet (D44, 2026-11-20):** `/python/cheatsheet/` "Python in a nutshell", 27 cards (one per lesson P1–P27) in seven data-flow parts, 3 drawings (`split`, `merge`, `wide`), from
  `src/data/cheatsheets/python.ts` through the same component. Cards may have a `twin` (linked SQL and Excel lessons); `tests/cheatsheet.test.ts` checks every lesson is cited once and every twin is
  published. `npm run check:cheatsheet-python` runs every pattern on the cafe-sales data (needs pandas, numpy, openpyxl, matplotlib, seaborn; skips with a message without them; `$` lines are only
  checked for existing). Python lessons now show the "Sum it up" footer link.

- **Translate guide and `translate="no"` (D59, 2026-11-24):** `/translate/` (`src/content/docs/translate.md`), steps written from Chrome's three help pages (desktop, Android, iPhone), no claim about where translation runs. Code is marked at build time: `src/lib/ec-no-translate.ts` (Expressive Code plugin, in `ec.config.mjs`), `src/lib/rehype-no-translate.ts` (inline `code`, `kbd`, `samp`, `pre`), plus the attribute set by hand in components that print code (`SqlPad`, `Exercise`, `Cheatsheet`, `ProjectExtras`, `Tools`, playground, `changelog.ts`). A new component that prints code sets `translate="no"` itself; the fixture test lists any `pre`, `code` or `kbd` on a built page that lacks it. `Term` stays translatable on purpose.

- **Cheatsheet anchors and footer links (D44, 2026-11-19):** each card's id is its lesson code in lowercase (`#s8`; first card when a lesson has
  several); `LessonFooter.astro` shows "Sum it up: this lesson in the SQL cheatsheet →" from `cheatsheetLink` (`src/data/cheatsheets/index.ts`).
  A new stage sheet needs one line in `SHEETS` there; `tests/cheatsheet.test.ts` checks anchors are unique and every link resolves.

## What comes next (build plan item 8, content)

0. **3D figures in track lessons: settled (owner decisions 2026-11-26 and 2026-11-27, SPEC D41 and D63).** Pilot of three, then nine more were built
   (DE1, DE13, DE15, DE16, DS4, DS10, MLE5, MLE6, MLE9), reviewed, and NOT published: a team review (learner reading, multimedia-learning evidence,
   figure-density count) found most restated a table or printed output or drew a 2D idea in perspective, and the owner chose to keep only MLE7
   (`concept-embedding-space`) and DS6 (`concept-loss-bowl`); DE3's 3D figure was removed, with `scripts/lib/figure3d.mjs` and the `.ed` style. New rule D63
   (LESSON-STANDARD "When a lesson earns a figure"): name what a figure adds before building it; one concept animation per lesson; no new figure where a lesson has
   three or more. Open, not approved: 2D steppers for DE4, DE8, DE9, DE10, MLE8, MLE10 (check each against D63 first). Not done: a pass over the densest
   existing lessons (python charts lessons 8-9 figures, core statistics lessons 5-7); the owner chose to apply D63 to new figures only.
   MLE5 later got one learner-stepped 3D figure (owner decision 2026-11-27, spec `step-learning-rate`: a loss bowl and the real 20-epoch loss at three learning rates) in place of its curves chart.
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
   the three pilot lessons (S8, S14, S20). Rolling `<RunSQL>` out to all 35 lessons waits for the interleaved rewrite (owner-approved default). Rolling it to
   the other SQL lessons is mechanical (every Try it query and exercise starter; `.claude/agents/LESSON-STANDARD.md`
   "Runnable SQL"). **Planned next step:** Correct / Wrong self-checking on exercises, built on this runner (compare the
   learner's result with the stored expected result of each exercise). It needs its own SPEC decision (a stored expected
   result per exercise, and what "same result" means for row order) before it is built.
6. **Release `v1.0.0`** (owner decision 2026-11-25: the four foundation stages are published): version 1.0.0 in `package.json` and `CITATION.cff`, `[1.0.0] - 2026-11-25` in the changelog. After the merge the owner enables the GitHub integration on Zenodo, creates the GitHub Release `v1.0.0` at the merge commit, and sends the concept DOI. **Done:** v1.0.0 is archived on Zenodo, concept DOI `10.5281/zenodo.24523880`, version DOI `10.5281/zenodo.24523881`, both in `CITATION.cff` (`doi` and `identifiers`), on `/cite/` and in the homepage footer. On every later release, add that version's DOI to `identifiers` with the description `Version x.y.z` (the build cites it; SPEC §9).

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
- **Advanced core redesign (in discussion with the owner, 2026-11-20):** research issues #71 (engineering block), #72 (AI era, data beyond tables,
  infrastructure awareness) and #73 (DSA literacy plus a practice gym) are in `research/issues/`. Decided: D48, the engineering lessons run on the
  learner's laptop (VS Code, Git, uv) with Codespaces as fallback. Proposed by the lead, not yet decided: the core as five parts of about 4 hours each
  (statistics, engineering tools, data systems, decisions and the AI era, a project built part by part), a skip check at the start of each part,
  about 34 lessons, a data ethics and governance lesson (needs research), the DSA gym after the tracks.

- **Advanced core (D49, D50, 2026-11-20):** 43 draft stubs in six parts (orders 10-70, 80-150, 160-210, 220-290, 300-350, 360-430), each part with a skip check and a project step (TODO notes in the stubs). Part 4 is the D48 laptop block; Part 6 *Working with AI* (research #88) is the last part before the tracks. `modeling-the-domain` and `inside-the-database` come from #89. The Data Engineer track has a ten-lesson database internals module (orders 200-290; capstones moved to 300 and 310). Notes for later: CI/CD, inheritance authorship and validation libraries belong to the DE, DS and ML tracks; Docker builds to DE and ML; agent and RAG building to ML and DE; data mining to DS; the DSA practice gym (#73) after the tracks; showing the parts on `/start/` needs a `part` schema field (CONTRACT change), TODO. `/choose-your-track/` (D50) uses #87: eight skills, grouped bars first, four radars, a math-depth table and switcher warnings, primary sources only. Open owner calls from #87 §7: DS communication 4 or 3; keep the low-confidence Experiments axis; when to split a GenAI axis; yearly posting re-sample.
- **Advanced core progress (2026-11-21):** Parts 1 (C1-C7), 2 (C8-C15) and 3 (C16-C21) published. Part 2 ends with a decision memo on app-events, not cafe-sales, and runs about 280 minutes; Part 3 runs about 216 minutes and its project step is in C18 (owner decisions, D49 amended). Table diagrams use crow's foot notation (`scripts/lib/erd.mjs`, LESSON-STANDARD). Four new SQL lessons published (D53): reading-er-diagrams S19, access-and-injection S30, triggers-and-procedures S35, designing-tables-workflow S37; SQL codes renumbered S1-S39 (orders = rank x 10). Trigger blocks turn runnable when the in-page engine reaches DuckDB 2.0. The DE lesson `logical-to-physical-design` (order 135) is a draft stub from #107. Part 4 *Engineering on your laptop* (C22-C29) published 2026-11-22: one project `cafe-report` (flat package `cafe_report/`, `data/orders.csv` from `download_data.py`, `uv run python -m cafe_report`, 11 tests); about 270 minutes (D49 amended). Open items from Part 4: the D48 template repository does not exist; nothing was run on Windows, macOS or Codespaces, and the C23 push to GitHub was not run live. Part 5 *Teamwork, scale and the platform* (C30-C35) published 2026-11-22: `cafe-report` gains `--total`, `export.py`/`--parquet` (pyarrow) and a DuckDB stand-in warehouse on branch `add-warehouse` (16 tests); pull requests are practiced against a local bare repository with a second clone as reviewer Sam; about 210 minutes (D49 amended). Data Engineer lessons are named, not linked, until they are published. Next: Part 6 *Working with AI* (C36-C43), then the capstone. **Part 6 owner decisions (2026-11-22, from research #113; its per-lesson table, free-tier table and options are in the issue comments, not in the synced file):** (1) certifications: one dated "Where to go next" box at the end of Part 6 (C43 or the capstone) listing free official courses side by side (Claude Academy AI Fluency and AI capabilities and limitations, OpenAI Academy AI Foundations labeled as OpenAI labels it, not a certification; Databricks Generative AI Fundamentals; Elements of AI), plus two sentences: paid proctored certifications exist, mostly for building on one platform or gated to partner firms, and there is no published evidence employers require them; re-checked every six months with the capability boxes; no prices from the [uncertain] list; track pages decide builder exams later. (2) Name Anthropic's AI Fluency 4Ds (Delegation, Description, Discernment, Diligence) once, in our words, with a link, as an external framework (CC BY-NC-SA: link and describe, never adapt). (3) Exercises run on Claude Free or ChatGPT Free (both upload and run code in chat), each the other's backup; Gemini CLI is the only free command-line agent. (4) Fold context-window management into C37. (5) Prompt recipe: wait for the follow-up Muse report (addendum H, sent again as its own brief), then extend C37 with a printable recipe card. (6) keeploop (github.com/johnha912/keeploop, the owner's MIT repo): an optional, disclosed "Try it" box in C43 with a real `run.py --mock` run and a pinned version, plus one line in C37 on scoring a prompt with keeploop-lite; never required, no README claims repeated. C36-C41 published 2026-11-23 (210 minutes so far; notebooks not made, by owner decision; C39 drill 4 is a percent change on the wrong base). C42 and C43 published 2026-11-23 (Part 6 complete, about 290 minutes, D49 amended; C43's "Where to go next" box and capability numbers are re-checked every six months, next 2027-05). Capstone `capstone-two-quiet-weeks` published 2026-11-23 (the advanced core is complete, 44 lessons; its AI-shortcut section is hedged because no live AI run was done). **Track decisions (owner, 2026-11-23, research #118; competitor table, gaps and per-track mapping are in the issue comment, not the synced file):** order of writing DA → DS → DE → ML. Design basis: #118's 106-posting snapshot (opened 2026-11-22), no re-sampling. Every track capstone grades an AI verification log like the core capstone. BLS figures only from the 2025-35 edition; never quote Udacity or Dataquest outcome claims. DA: Tableau Public is the default BI tool, with a short Power BI box per lesson (confirmed 2026-11-23 after the owner listed alternatives and left the choice to the lead: #118 counts Tableau 13, Power BI 12, Looker 5 of 25 postings and no other BI tool named; Tableau Public is free on Mac and Windows and gives a public portfolio link). Other tools get one dated "Other tools you will meet" box in `dashboard-design`, each checked on its official page before any claim is printed: Looker Studio (free, browser), Metabase and Apache Superset (open source, SQL-first), Looker/LookML (named again in the metrics-layer lesson beside dbt semantic models), and code-first reports (Quarto, Evidence) pointing back to the Python stage. Reddit, YouTube and vendor blogs are never cited; add one lesson, AI-assisted analysis with a verification log (before the take-home); timed SQL drills at GitLab's published bar go inside the take-home simulation; the cleaning story feeds the dashboard project as its first chapter. DE: stays 31; AI-assistant verification becomes a segment of `pipelines as small, testable functions`, data contracts and observability a segment of the data-quality lesson; the ten internals lessons stay. DS: one new lesson on using GenAI tools in a DS project and grading their output (13 lessons); experiment analysis gains a causal-inference reading segment; SQL depth check and a take-home with written defence (Should). ML: keep all 12; LLM evaluation expanded, cost and latency segment, fine-tuning awareness (Could). Gaps to own across tracks (#118 G1-G10): data quality and tests as a reflex, AI-output verification, metric definition, framing a vague request, honest evaluation, dirty-data clinics, interview-shaped practice with published rubrics, cost lines, decision memos, governance basics. **Track balance (owner, 2026-11-23):** each track has a main path of about 16-18 lessons. DE is cut to about 18 (merge dbt lessons, fold partitioning into file formats and similar), and the ten database internals lessons become an optional "Deep dive" module after the DE track, labeled as not required for a first job. DA, DS and ML grow to about 16-18 from the #118 gaps. The per-track lesson lists were approved on 2026-11-23 and live in `research/curriculum/08-track-lists.md` (DA 17, DE 18 plus a 10-lesson optional deep dive, DS 16, ML 16; each track has a 90-minute rubric-scored simulation and a 180-minute capstone that grades an AI verification log). **Track charts (owner, 2026-11-23):** charts must be beautiful and easy to read. Most are seaborn, matplotlib or Plotly figures rendered to SVG at build time in the site's tokens, light and dark, with direct labels (dataviz skill). One new exception, like RunSQL (D42), needs a SPEC decision (D56), a CLAUDE.md hard-rule amendment and a §6 authoring component (CONTRACT, approved in principle by the owner). It allows a lesson that needs motion (3D embeddings, gradient descent, attention, a neural network) one homepage-style canvas figure: deferred until near the viewport, under 30 KB gzipped, vanilla (no GSAP), with a pause button, reduced-motion respected and a static SVG fallback. Interactive Plotly lives in the Colab notebooks. Computer vision lessons show real color sample images where they help (inputs, filters, feature maps, augmentations, right and wrong predictions): from an openly licensed dataset with the license checked and cited, as static optimized images (WebP/AVIF, lazy, sized, alt text) produced by a script from real runs. Build this before the first track lesson that needs it. The restructure was done on branch `tracks-reshape` (stubs, four DE merges, D55, counts, `DEEP_DIVES` order band in `src/lib/roadmap.ts` for DE and ML, ML code prefix MLE); the ML Engineer track also got an optional 8-lesson deep dive (deep learning and NLP, orders 200 to 270, owner decision 2026-11-23). Next: DA writing. Remaining: the four tracks (research #118 done) (Muse brief sent 2026-11-23: demand, entry-level skills from postings, AI-driven changes, proof of work, durable tools, competitors, gaps, mapping to our 68 track drafts) (owner: the tracks matter more than polishing the core). C39-C41 were drafted on branch `part6-a` (2026-11-22); they assume C37's context pack has four parts in order: schema, grain, sample rows, data dictionary; and C38 teaches five checks in order: predict shape and values, count rows and nulls before and after every join and filter, reconcile one total a second way, confirm every function in the installed version's docs, accept/revise/reject with one sentence of reason. **Prompt recipe decisions (owner, 2026-11-22, research #114; mapping, recipe card and open questions are in the issue comments):** C37 gets #114's 8-step printable card; step 8 (check it against the data yourself) stays on the card and points to C38; the reasoning-model rule is a dated note (the card says state the goal and constraints and let the model think; the note says scripted 'think step by step' is now advised against by all four vendors; re-checked every six months); quotes-first (step 6) stays, labeled vendor advice only; lessons print only two or three key numbers, each re-opened in the paper and pinned to one version first (PAL v1 8% vs v2 15%; BIRD arXiv v3 vs NeurIPS figures differ; workslop n inconsistent). **C43 retrieval (owner, 2026-11-23):** one concept block in C43 (about 400-500 words, one static figure, no math): RAG finds passages either by matching words (like grep) or by matching meaning (embeddings: close in meaning becomes close together); each misses a different kind of passage, so a wrong answer can come from retrieval, not the model; one real grep exercise on a text file. Vectors, cosine, tokenizers and building pipelines stay in the ML track (`ml-engineer/text-embeddings-and-transformers`) and DE. Role/persona taught as style only; 'check your work' and 'are you sure?' taught in C38 as non-checks. **Modeling knowledge (#107) allocation (owner, 2026-11-21):** SQL keeps reading and simple design (reading-er-diagrams: crow's foot with verb phrases, reading both ways, UML as a recognition box; designing-tables-workflow: conceptual/logical/physical, translation steps); the deep part (generalization strategies, weak entities, composite and candidate keys in depth, logical to physical with types and indexes, UML aggregation/composition) becomes one new DE lesson `logical-to-physical-design` at order 135, before dimensional models (DE 30 → 31; SPEC counts with the SQL batch). Light pointers only: core C16 (requirements, ambiguity), DA 10 (ambiguous requests), DA 70 (relationship cardinality in a BI model), DA 90 and DE 130 (data dictionary), DS 70 (one row per entity, aggregate the many side), ML 70 (JSON Schema as a model for structured output). The capstone draft is parked until Parts 3-6 are done. Notebooks for app-events load from the `v0.2.0` tag.

- **Data Scientist batch 1 (2026-11-24, branch `ds-batch-1`, team drafts for the owner to edit, D24, all still `status: draft`):** DS1 `exploring-before-modeling`, DS2 `first-honest-model`,
  DS3 `sql-for-modeling-tables`, DS4 `logistic-regression-in-practice` and DS5 `cross-validation-and-overfitting` are written in full with notebooks in
  `notebooks/data-scientist/`, three exercises each and their charts (`scripts/charts/ds-batch-1.py`). The track's target, table, seed, split, reporting and version
  conventions are in `.claude/agents/LESSON-STANDARD.md`, "Data Scientist track (D55)": a churn model (no visit and no expense in days 8 to 30, predicted at day 7) on 17,816
  people, not the core's "buys within 14 days". Choices the owner may reverse: the target; no derived dataset file (the table is a DuckDB query run in each notebook); a still fold
  diagram instead of a concept animation; charts drawn with the DA `Svg` class, not seaborn. Still open: edits and approval of every text, and a Colab run of the five notebooks
  (they ran here on pandas 3.0.5 and 2.2.3 with identical outputs).
- **DS batch 2 (2026-11-24, branch `ds-batch-2`, drafts, `status: draft`):** DS6 `regularization`, DS7 `decision-trees-and-forests`, DS8 `gradient-boosting`, DS9 `feature-engineering`
  and DS10 `clustering-and-segmentation` with notebooks and charts (`scripts/charts/ds-batch-2.py`, which runs the notebooks). The honest result, told plainly: no model beats the day-7
  logistic model (test AUC 0.690; ridge 0.690, lasso 0.689, forest 0.688, boosted 0.688, tree 0.684; every interval but the tree's includes 0), and the new columns of DS9 add nothing; the
  lessons show each method where it matters (a 500-person pilot with random columns, a random column in importances, a leaky target encoding, made-up data with real groups).
  Conventions and the answers used are in LESSON-STANDARD, "Batch 2". Still open: the owner's edits, a Colab run, and the DS6 pilot check (20 other pilots) that sits outside the notebook.
- **Data Scientist batch 3 (2026-11-24, branch `ds-batch-3`, team drafts, D24, still `status: draft`):** DS11 `model-interpretation-and-fairness` (permutation importance, partial dependence, group error
  rates, model card and release checklist), DS12 `time-series-forecasting-basics` (daily signups, weekly backtest against a seasonal naive baseline, the README's expected values as a noise floor), DS13
  `experiment-analysis-in-python` (revenue sizing, bootstrap, checks that need no outcome, a causal-reading segment) and DS14 `genai-tools-in-a-ds-project` (graded assistant answers and classifier
  labels written for the lesson, token cost from a dated price) with notebooks and `scripts/charts/ds-batch-3.py`. All four notebooks gave identical outputs on pandas 3.0.5 / scikit-learn 1.9.1 / NumPy 2.5.3
  and on pandas 2.2.3 / scikit-learn 1.6.1 / NumPy 2.1.3. Choices the owner may reverse: the stubs' prerequisites, objectives, descriptions and `datasets` were rewritten to match the briefs (see each `TODO(owner)`);
  DS14 ran no model and says so. Still open: edits and approval of every text, a Colab run, and a recheck of the vendor prices on the DS14 page before publishing.
- **Data Scientist batch 4 (2026-11-24, branch `ds-batch-4`, team drafts, D24, still `status: draft`):** DS15 `take-home-with-written-defense` (a 90-minute simulation on who cancels at the first renewal, with four columns that break the timing rule on purpose, a printed eight-item rubric and a reference answer) and DS16 `decision-product-case-study` (the capstone: a decision memo on the DS4 win-back offer, a plan on paper with a back-tested retraining trigger, and a graded AI log) with notebooks and `scripts/charts/ds-batch-4.py`. Both notebooks gave identical outputs on pandas 3.0.5 / scikit-learn 1.9.1 / DuckDB 2.0.0 and on pandas 2.2.3 / scikit-learn 1.6.1 / DuckDB 1.4.3. The honest results: the DS15 model beats the one-column rule by +0.039 AUC (interval 0.002 to 0.077) on a split at the favorable end of 20; in DS16 the model's offer rule ties the rule "offer every paid-social person" ($80.6 against $81.3 for every 1,000 people) and breaks even at a return rate of 0.214 against the assumed 0.25, so the memo recommends a pilot first. Choices the owner may reverse: the new DS15 target, the three reviewer questions, Maya Okafor and the trigger thresholds, the stubs' prerequisites and sources (see each `TODO(owner)`). Still open: edits and approval of every text, a Colab run, and the word counts (3,095 and 4,010; see LESSON-STANDARD, "Batch 4").
- **Data Engineer track published (2026-11-25, owner: "ok rồi, lên web đi", after reading PDFs of all 31 lessons):** DE1 to DE18 (20 lessons with DE6b `quality-gates-stop-or-quarantine` and DE11b `jinja-and-macros`) and the deep dive DE20 to DE29 (11 lessons with `mvcc-and-row-versions`, order 255) are `status: published`, `reviewed: 2026-11-25`; the `TODO(owner)` paragraphs are gone and their maintainer content is in `.claude/agents/LESSON-STANDARD.md`, "Published 2026-11-25" (versions run, what was not run, readings that rest on no page, stub changes). Draft-time italic mentions are links with codes. Codespaces was verified by the owner at DE5, DE14 and DE18 (Java 21 from the dev container feature, pytest, `clean_clone_check.sh` PASS=46, `fetch_app_events` 13,041,745 bytes and 177,379 events, Spark `events_by_name` 4 jobs). **Owner steps after the merge:** (1) create the tag `de-internals-v1` on `main` (Releases, new tag): the deep-dive lessons fetch `scripts/de-internals/lab.py` and `storage_shapes.py` from it, and it must point at a commit whose `scripts/de-internals/` is the reviewed one; check the two raw links return the scripts. (2) Done 2026-11-25: the owner chose "b" codes, so the sidebar and lesson header show DE6b, DE11b and DE25b.5 (SPEC D55 records this). Not run for the track: GitHub Actions itself, Windows, macOS, WSL2, BigQuery, Snowflake.

## Open items and owner decisions still pending

- **Feedback form (D58, live 2026-11-24):** Worker `datafromzero-feedback` deployed by the owner with `GITHUB_TOKEN`; two test issues (#125, #126) filed and closed; `FEEDBACK_URL` set. Remaining owner check: Workers Logs off. Original notes: the lesson footer shows the form only when `FEEDBACK_URL` in `src/site.ts`
  is set; until then it is the old GitHub link. Owner steps: follow `workers/feedback/README.md` (Cloudflare account, create the
  Worker in the dashboard and paste `worker.js`, fine-grained GitHub token with Issues read/write on this repo only as the secret
  `GITHUB_TOKEN`, deploy, put the workers.dev URL in `FEEDBACK_URL`), then send one test message and check the issue. Create the
  `feedback` label first. Also turn Workers Logs off for the Worker (README step 5); the taskbar's "Report a problem" (D37) keeps the GitHub link.
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

- **Tag v0.3.0 (done, 2026-11-24):** pre-release v0.3.0 now points at 8dfe873 (DA track merge); the three cafe-sales extras resolve at that tag (checked: 200, full row counts).

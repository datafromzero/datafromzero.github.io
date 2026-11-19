# Curriculum map: rationale

Amended by the owner decision of 2026-11-17 at the end of this file (SPEC D32): four career branches, 159 lessons.
Amended again on 2026-11-19 (SPEC D45, research issue #61): the Python stage has 27 lessons; 166 lessons in all (see the last section).
The sections before it are kept as approved on 2026-11-16.

Outline only. 161 lessons, about 72 hours of learner time (15 to 30 minutes each), 3 datasets, 80 glossary terms, 124 reference entries. `validate.mjs` passes with zero errors. Every lesson cites its research section in `research:`.

## How the map is built

- **One idea per lesson, one visual per lesson.** Each lesson names its canonical static visual (`visual:`). Playbook steppers and sliders (03 §7) are written as static frame sequences, because lessons ship no JavaScript.
- **Order follows prerequisites (D25).** The graph module reports no cycles and no order violations. No lesson depends on a later stage. Only the first Excel lesson has no prerequisite; the first lesson of each later stage depends on the stage before it.
- **Stage sizes.** Excel 22, SQL 35 (D40), Python 27 (D45), core 25, branches 11 to 12. Six lessons are marked `[stretch]` (the Python environments lesson no longer is, D45): nothing on the main path depends on them, so they can be cut or deferred. Without them: 160 of 166 lessons.

## Ordering logic per stage

**Excel (22).** Grid and tidy layout, formulas, references, then types and locale before any aggregation (a PivotTable on text-stored numbers is the classic failure, so "numbers are not numbers until you check" comes before pivots). Then tables, logic, conditional totals, lookups, text and dates, error triage, and a cleaning workflow. PivotTables, charts and a one-screen report close the block. Two bridges point forward: `excel-sheets-query-bridge` (QUERY as a preview of SQL) and `excel-xlookup` (the spreadsheet rehearsal for joins). The AI lesson comes last because it is gated on formulas learned unaided.

**SQL (30), one complete block.** Tables, keys and grain, then retrieval, filtering, NULL, types, CASE. Aggregation and GROUP BY come before joins, so every join lesson can verify its row count with COUNT. Joins run inner, left and anti, then fan-out as a critique lesson, then self and multi-table joins. Then subqueries, CTEs (the house style from there on) and set logic. Window functions come last in the query half, with the hiring patterns after them: top-N, LAG and LEAD, deduplication, funnels, cohorts, date spine. Design basics (constraints, writes and transactions, normalization, indexes) finish the block before Python starts. The AI lesson is last. Pattern families 1 to 10 of 05 §2.1 are all covered.

**Python (27).** One bridge lesson answers the same cafe question in Sheets, SQL and Python. Seven language lessons follow, taught for reading and recognition rather than for processing tables; comprehensions are folded into lists and loops, and the calling half of functions moves up beside values and types. Files and tables (CSV, JSON, Excel, one SQLite query, one DuckDB demo) and NumPy vectorization come before the first DataFrame, because "vectorize, never loop over rows" is an interview-graded habit. The pandas lessons are deliberately second representations of the SQL patterns: first look, select and filter, derived columns, groupby, merge with predict-validate-audit, missing data and types, dates, text, reshape, transform, rank and rolling, and each carries the SQL-to-pandas traps of issue #61 as named exercise slots. Two chart lessons follow (matplotlib, then seaborn), then web data, environments and pip, the cafe quarterly pack capstone, a notebook-to-script lesson (the first pipeline shape and the on-ramp to Data Engineer) and the AI lesson. Polars and Plotly are awareness boxes, not lessons.

**Core (25).** Statistics runs picture-first and formula-last: study design, center and spread, distributions, probability with natural frequencies, sampling and bias, sampling variability, intervals, tests, comparing groups, causation, regression (11 lessons). Analytics thinking: metrics, diagnosing a movement, experiment design, decision memo (4). Evaluation foundations: framing with split and baseline, leakage, metrics and error costs (3). Then Git (2), data modeling (2), cloud basics (2) and one AI literacy lesson on RAG and agents.

**Branches (11 to 12 each).** Every branch ends in a "prove it" lesson tied to 05 §3.5: DA portfolio case study, DE capstone design, DS decision case study, AE platform capstone, ML monitoring and a shipped system.

## Why some stages exceed 12 to 20 lessons

- **SQL (30, 28 without stretch).** 00 §1 makes SQL one block: no later "advanced SQL". The inventory has 260+ items and ten hiring pattern families. Merging lessons breaks one idea per lesson. Twenty-eight lessons at about 25 minutes is about 12 hours.
- **Python (27).** Four jobs in one stage: language (8 with the first-notebook bridge), files and NumPy (2), pandas and charts (12), workflow, exit and automation (5). The 8 to 6 compression the issue states does not follow from its own list (9 lessons in the draft block, 8 in the new one); see `06-curriculum-map.yaml`. The APIs and AI lessons are prerequisites of later lessons, and `python-environments-and-pip` is a required late lesson, no longer a stretch lesson (issue #61 section 9).
- **Core (25).** Six areas mandated by the brief, each needed by all five branches. Statistics alone is 11.
- **Excel (22, 20 without stretch).** The Excel hiring task types (05 §2.2) need ten distinct skills, and Vietnamese locale traps add two.

## How the branches build on the core

- **Data Analyst** applies the core: SQL L4 patterns and pandas to scoped reporting, retention reading, a dashboard design and model lesson, a BI tool lesson, A/B readout, case practice, a take-home and a case study.
- **Data Engineer** takes `python-notebook-to-script`, `sql-modify-data-transactions`, and the core cloud, warehouse and Git lessons to idempotent loads, quality checks, Airflow, backfills, Spark and a design-and-defend capstone.
- **Data Scientist** takes the evaluation trio (framing, leakage, metrics) plus regression and tests, then algorithms, cross-validation, feature engineering, interpretation, forecasting and experiment analysis.
- **Analytics Engineer** takes SQL CTEs and windows, Git review, and the two data-modeling lessons. Slowly changing dimensions and views are deferred here from the core and SQL on purpose.
- **ML Engineer** takes the core evaluation trio and the AI literacy lesson. It also takes three DS lessons (see the cross-branch edges below).
- **Cross-branch rule.** Branches may not depend on each other, with one whitelisted exception: ML Engineer lists three Data Scientist lessons (feature engineering, cross-validation, gradient boosting) as prerequisites, because a concept has one home URL. `validate.mjs` fails any other cross-branch edge.

## Deliberately excluded or reduced

- **Algorithms and complexity.** No module (02 §8.2). No from-scratch sorting or data structures. The site must not imply a general algorithms curriculum.
- **Math foundations.** Linear algebra and calculus are not taught. The neural network lesson states the math it assumes (00 §3). *Amended by the owner on 2026-11-19 (SPEC D44): linear algebra will be a small math block at the start of the Data Scientist and ML Engineer tracks; calculus is still not taught.*
- **Excel advanced.** LAMBDA, Solver, forecast sheets, financial functions, macros, scenario manager and a finance-model audit lesson.
- **BI in depth.** One tool-agnostic design lesson, one model lesson and one tool lesson. No Tableau or Power BI course.
- **SQL.** Dialect porting as a lesson, gaps-and-islands, sessionization, JSON, stored logic. Dialect differences are callouts and reference entries.
- **Python.** OOP depth, decorators, generators, pytest, regex theory, scraping frameworks (cut list, 02 §3.4).
- **Statistics.** ANOVA, Bayesian A/B, difference-in-differences and survival analysis stay at recognition inside other lessons.
- **ML.** SVM, k-NN, Naive Bayes, PCA, DBSCAN, t-SNE, recommenders, CNN and RNN, computer vision and LLM fine-tuning (a decision inside the RAG lessons, not a lesson).
- **Data engineering.** Terraform, Kafka depth, container depth and open table formats beyond awareness.
- **Not in scope of this package** (00 §3): resume, LinkedIn and application coaching, and certification exam prep (alignment only, never promised).
- **Playbook features not built.** Browser-tracked spaced review and progress (conflicts with D15 and CLAUDE.md), interactive steppers (replaced by static frames), per-lesson timed checkpoints in the browser.

## Honesty and sources

No salary, demand or price figure appears in any lesson. Sources are mostly official documentation. `verified: true` marks only URLs the research package already cites (21 of 170 distinct URLs). The other 149 are official pages I am confident exist but did not open; this session had no network check. Run a link check before drafting begins. Vietnamese Excel notes follow 00 §4 rule 10: function names are never translated; the list-separator and CSV locale mechanism is taught as a diagnostic, never as a fixed Vietnamese separator. Interview-format claims (take-home prevalence) are stated as in one named sample.

## Owner decisions (2026-11-16, SPEC D29)

The owner approved this map; slugs are now permanent (SPEC §3, §14). Answers to the questions the map raised:

1. **Scale.** All 161 lessons stay, the seven stretch lessons included. `v1.0.0` ships when the four core stages
   (102 lessons) are published; the five branches follow in 1.x releases.
2. **SQL engine: DuckDB** in Colab (`pip install duckdb`, reads CSV and Parquet directly). SQL lessons use DuckDB
   syntax and cite DuckDB docs; a callout notes where common warehouse SQL differs. The dbt lessons use dbt-duckdb.
3. **BI tool: neutral.** Dashboard lessons teach the principles, then give short parallel how-tos for Power BI Desktop
   and Looker Studio. Cloud, experiment tracker and LLM provider stay vendor-neutral until a lesson needs one.
4. **Datasets: one English set, prices in US dollars with cents.** Vietnamese pages reuse the same data.
5. **Smaller choices.** Projects and checkpoints stay in lesson notes (no new content type). ML Engineer keeps its three
   Data Scientist prerequisites. The LLM primer stays inside `excel-ai-draft-and-verify`. The RAG practice text is
   course-written and becomes a dataset only when the first RAG lesson is produced.

Source URLs marked `verified: false` (including every DuckDB, Power BI and Looker Studio page) were not opened when the
map was made; check each one when its lesson is produced.

## Owner decision (2026-11-17, SPEC D32)

Analytics Engineer is no longer a career branch. Its skills live in Data Engineer and Data Analyst, and four careers
match the homepage and the career quiz. The eleven draft lessons were folded in; none was published, so no URL changes.

| Former lesson | Now |
|---|---|
| `analytics-engineer-role-and-transformation-as-code` | Dropped; its transformation-as-code objective moved to `data-engineer-dbt-project-and-first-model` |
| `analytics-engineer-dbt-project-and-first-model` | `data-engineer-dbt-project-and-first-model` |
| `analytics-engineer-staging-intermediate-marts` | `data-engineer-staging-intermediate-marts` |
| `analytics-engineer-materializations-and-incremental-models` | `data-engineer-materializations-and-incremental-models` |
| `analytics-engineer-dbt-tests-and-documentation` | `data-engineer-dbt-tests-and-documentation` |
| `analytics-engineer-dimensional-models-and-scd` | `data-engineer-dimensional-models-and-scd` |
| `analytics-engineer-jinja-and-macros` | `data-engineer-jinja-and-macros` (still stretch) |
| `analytics-engineer-ci-and-deployment-for-dbt` | `data-engineer-ci-and-deployment-for-dbt` |
| `analytics-engineer-freshness-and-data-incidents` | Merged into `data-engineer-backfills-and-failure-recovery` (triage and the incident note); freshness checks were already in `data-engineer-data-quality-checks` |
| `analytics-engineer-metrics-and-kpi-dictionary` | `data-analyst-metrics-and-kpi-dictionary` (not a duplicate of `core-defining-metrics`) |
| `analytics-engineer-analytics-platform-capstone` | `data-engineer-analytics-platform-capstone`, a second Data Engineer project beside the pipeline design capstone |

- **Counts.** 159 lessons in 8 stages: Excel 22, SQL 30, Python 25, core 25, Data Analyst 13, Data Engineer 20,
  Data Scientist 12, ML Engineer 12. Seven stretch lessons remain (152 without them).
- **Data Engineer order.** The Python pipeline lessons (10 to 90), then the dbt block (100 to 160), then Spark and
  streaming, then the two projects: the dbt capstone (190) and the pipeline design capstone (200).
- **New prerequisite edges, now that the lessons share a branch.** dbt starts after `data-engineer-etl-elt-and-layers`;
  dbt tests build on `data-engineer-data-quality-checks`; incremental models on
  `data-engineer-incremental-loads-idempotency`; scheduled dbt runs on `data-engineer-orchestration-with-airflow`.
  The dbt capstone no longer requires the KPI dictionary, because branches do not depend on each other.
- **Careers.** The Data Engineer portfolio may include a public dbt project; the Data Analyst portfolio adds a KPI
  dictionary. Lessons tagged `AE` lost that tag.

## Amendment of 2026-11-19: the Python stage (SPEC D45)

Owner decision, from research issue #61 ("Python for data: stage check, SQL bridge traps, and the Colab decision").

- **Counts.** 166 lessons in 8 stages: Excel 22, SQL 35 (D40), Python 27, core 25, Data Analyst 13, Data Engineer 20,
  Data Scientist 12, ML Engineer 12. The four core stages (Excel, SQL, Python, core) are 109 lessons. Six stretch lessons remain
  (160 without them).
- **Python 25 to 27.** Cut: `python-comprehensions` (folded into `python-lists-and-loops`). Renamed: `files-csv-json` to `files-and-tables`
  (id `python-files-csv-json` kept). Split: `charts` into `charts-matplotlib` (id `python-charts` kept) and `charts-seaborn`.
  Added: `python-pandas-derived-columns` and `python-cafe-quarterly-pack`. The new order is in `06-curriculum-map.yaml`, each lesson
  with its origin tag (keep, change, add) and the traps it carries.
- **Linear algebra.** NumPy matrix product and `numpy.linalg` are not taught in Python and do not go to the advanced core (issue section 4
  said they would); they belong to the math block at the start of the Data Scientist and ML Engineer tracks (SPEC D44).
- **Notebooks** live in the repository (`notebooks/python/{lesson-id}.ipynb`), not in Google Drive.

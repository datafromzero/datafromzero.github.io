---
title: "Data Analyst: all lessons"
description: Every Data Analyst lesson in the order to study them, with your done ticks.
---

## What you finish with

**There is no certificate.** datafromzero gives no verified certificate: it has no accounts, so it cannot check who finished. This is the message of the author of the site to every learner:

> A certificate has no value if you do not have personal projects that fit what employers need, and the skills and way of thinking to back them up. However strong the issuer is, if your ability does not yet fit or meet the job, the certificate is worth nothing.

What you can show instead is a project. If you want a sheet for yourself, the [completion page](/completion/) prints on two pages, and says on it that it is not a verified certificate.

### How long it takes

From the first Excel lesson to the capstone of this track, the lessons state about **131 hours** in all: 7,885 minutes in 151 lessons. That is 27 weeks at 5 hours a week, or 14 weeks at 10 hours a week. Every lesson of the track is on this route; nothing is left out.

| Stage | Lessons | Minutes | Hours and minutes |
|---|---:|---:|---:|
| Excel / Sheets | 22 | 835 | 13 h 55 min |
| SQL | 39 | 1,895 | 31 h 35 min |
| Python | 28 | 1,320 | 22 h 00 min |
| Advanced core | 44 | 2,705 | 45 h 05 min |
| Data Analyst | 18 | 1,130 | 18 h 50 min |
| Total | 151 | 7,885 | 131 h 25 min |

The minutes are the ones printed on each lesson. They are estimates for a beginner who does every exercise, so some lessons will take you longer. If you already know a stage, take its placement test (Excel / Sheets, SQL, Python and the advanced core each end their page with one) and take that stage's hours off the total.

### The capstone

The capstone, [*Capstone: a dashboard project and case study*](/data-analyst/portfolio-case-study/) (DA17), has you hand in [seven things](/data-analyst/portfolio-case-study/#deliverables): a cleaning log, a public dashboard, KPI entries, checks, a one-page case study, an AI verification log and a short explain-back. You score them yourself with a 16-point rubric, or ask a mentor. Nothing is sent to this site.

### What employers screen for

[Research issue #118](https://github.com/datafromzero/datafromzero.github.io/blob/main/research/issues/118-what-employers-will-hire-for-in-2026-and-beyond-demand-entry.md) read 25 entry-level Data Analyst postings in full (2026-11-22). SQL is named in 23 of them, a dashboard or BI tool in 22, and presenting to non-technical readers in 23. Eight welcome portfolio or project work. Only 3 of the 25 describe an interview task. These postings are one sample, not the whole market.

### Show your project

A project does not promise an interview or a job. It is evidence you can point to, and the same issue puts work samples among the stronger predictors of job performance, though structured interviews score higher (its Finding 14).

1. Put the capstone in a public repository on GitHub, with the link to your dashboard. Use only the synthetic cafe-sales data, never real customer or employer data.
2. Start the README with the business problem in one sentence. Then give one chart or table for each claim, the limits, and how you checked each number.
3. Add one line to your CV and one to your LinkedIn profile, in your own words and with what you actually did:
   - **CV:** "Built and published a sales dashboard on a synthetic three-cafe dataset, with a cleaning log, a KPI dictionary, freshness and reconciliation checks and a one-page case study; checked every AI-assisted step and logged accept, revise or reject. (link)"
   - **LinkedIn:** "Dashboard project and case study on practice data: from two inconsistent sources to a published dashboard, every number traced to a second route. (link)"
4. Be ready to talk it through:
   - Say the problem in one sentence, then the answer in two.
   - Pick one number and show how you traced it to a second route.
   - Name one AI output you revised or rejected, and the check that decided it.
   - Say one limit, and the next step you would take.

When you are done, you can print the [completion page](/completion/).

## Analytics engineer route

Some analysts want to build the tables that a dashboard reads. The tool for that is dbt: each table is a SQL file under version control, with tests. The job title for it, analytics engineer, sits between the two careers. In the postings of [research issue #118](https://github.com/datafromzero/datafromzero.github.io/blob/main/research/issues/118-what-employers-will-hire-for-in-2026-and-beyond-demand-entry.md), 4 of 27 Data Engineer postings carry an analytics-engineering title, and dbt is named in 12 of the 27 Data Engineer postings against 2 of the 25 Data Analyst ones. This is not a fifth track: analytics engineering lives in these two tracks. It is a way through the Data Engineer lessons for an analyst who wants dbt, and it skips some of them.

**1. Have done these Data Analyst lessons.** They are the ones whose ideas dbt automates, with the lessons they need inside this track. The rest of the track (DA2 to DA6, DA8b and DA13 to DA17) is not needed to start.

| Code | Lesson | Minutes |
|---|---|---:|
| DA1 | [*The analyst's loop: from a vague request to a scoped question*](/data-analyst/the-analysts-loop/) | 40 |
| DA7 | [*A cleaning story: two inconsistent sources, one trusted table*](/data-analyst/messy-data-cleaning-story/) | 60 |
| DA8a | [*Designing a dashboard people will use*](/data-analyst/dashboard-design/) | 45 |
| DA9 | [*The model behind a dashboard: relationships, measures and filters*](/data-analyst/bi-modeling-for-dashboards/) | 50 |
| DA10 | [*Build and publish your first dashboard*](/data-analyst/first-bi-dashboard/) | 55 |
| DA11 | [*A KPI dictionary and a metrics layer*](/data-analyst/metrics-and-kpi-dictionary/) | 55 |
| DA12 | [*Keeping a dashboard right*](/data-analyst/keeping-a-dashboard-right/) | 50 |

**2. Have done the lessons of the foundation that the dbt lessons, DE1 and the four read-back lessons list as prerequisites.** Whoever studied every stage has done them. If you skipped stages with a placement test, these are the 13 lessons to have done, and each has its own "Before this lesson" list.

<details>
<summary>The 13 lessons</summary>

- [*GROUP BY and HAVING*](/sql/group-by-having/) (S8)
- [*Readable queries with CTEs*](/sql/ctes/) (S13)
- [*Saving a query as a view*](/sql/views/) (S29)
- [*Inserting, updating and deleting safely*](/sql/modify-data-transactions/) (S34)
- [*Grain, facts and dimensions*](/core/grain-facts-and-dimensions/) (C17)
- [*Designing a star schema from business questions*](/core/designing-a-star-schema/) (C18)
- [*Your laptop setup and the terminal*](/core/laptop-setup-and-terminal/) (C22)
- [*Environments and dependencies, for real*](/core/environments-and-dependencies/) (C25)
- [*Testing on known answers with pytest*](/core/testing-with-pytest/) (C27)
- [*Git: branches, pull requests and review*](/core/git-branches-and-pull-requests/) (C30)
- [*Data beyond tables: nested JSON, events and formats*](/core/data-beyond-tables/) (C31)
- [*Inside the database: plans, transactions and copies*](/core/inside-the-database/) (C34)
- [*Warehouses, data lakes and what things cost*](/core/warehouses-lakes-and-cost/) (C35)

</details>

**3. Set up the starter.** The Data Engineer track needs a computer, because every lesson types commands.

| Code | Lesson | Minutes |
|---|---|---:|
| DE1 | [*What a data engineer owns: lifecycle, ETL, ELT and layers*](/data-engineer/role-and-lifecycle/) | 50 |

**4. Start at DE9 from a checkpoint.** The starter repository, `de-pipeline-starter`, has a tag for the state after each lesson. `de-09-start` is the starter as DE8 left it, before DE9: the code of DE2 to DE8 is in it (ingest, staging, the checks and gates, the daily load, the Airflow DAG), so you do not write it. Git does not keep the data files (the starter's `.gitignore` leaves out everything the pipeline writes in `data/`), so make them with two commands. In the first terminal:

```bash
git clone https://github.com/datafromzero/de-pipeline-starter.git
cd de-pipeline-starter
git checkout de-09-start
uv sync
uv run python mock_api.py
```

Leave that running, open a second terminal in the same folder, and run:

```bash
uv run python -m pipeline.ingest
uv run python -m pipeline.stage
```

`data/staging/` now holds `order_lines.parquet`, `products.parquet` and `stores.parquet`, the three files DE9 starts from (3,287 order lines). The mock API sometimes answers with an error on purpose; the ingest waits and tries again, so a few warnings are normal.

**5. The dbt lessons,** in this order. Each names its own checkpoint, so you can catch up or compare.

| Code | Lesson | Minutes |
|---|---|---:|
| DE9 | [*A dbt project, from source to mart*](/data-engineer/dbt-project-and-first-model/) | 50 |
| DE10 | [*Tests and documentation: how a model earns trust*](/data-engineer/dbt-tests-and-documentation/) | 55 |
| DE11a | [*Materializations and incremental models*](/data-engineer/materializations-and-incremental-models/) | 55 |
| DE11b | [*Jinja and macros: write a rule once*](/data-engineer/jinja-and-macros/) | 50 |
| DE13 | [*Dimensional models and slowly changing dimensions*](/data-engineer/dimensional-models-and-scd/) | 55 |
| DE14 | [*CI for dbt: checks on every pull request*](/data-engineer/ci-and-deployment-for-dbt/) | 50 |

**6. Read back, as the warm-ups ask.** These four lessons are listed as prerequisites of the dbt lessons. The checkpoint saves you from writing their code, not from their ideas: the warm-ups and comparisons of DE10 and DE11a ask about DE6a, DE6b and DE4, and DE9 lists DE3. Each warm-up links to the part it asks about, so you can read only that part, or study the whole lesson. These lessons themselves name DE2 and DE5 under "Before this lesson" (DE3 and DE4 list DE2; DE6a and DE6b list DE5); the checkpoint's code stands in for those lessons, so expect some gaps.

| Code | Lesson | Minutes |
|---|---|---:|
| DE3 | [*File formats and partitioning*](/data-engineer/file-formats-and-partitioning/) | 45 |
| DE4 | [*Incremental loads and idempotent reruns*](/data-engineer/incremental-loads-idempotency/) | 50 |
| DE6a | [*Data quality checks that fail loudly*](/data-engineer/data-quality-checks/) | 45 |
| DE6b | [*Quality gates: stop a run or quarantine a line*](/data-engineer/quality-gates-stop-or-quarantine/) | 45 |

The time of each part:

| Part | Lessons | Minutes | Hours and minutes |
|---|---:|---:|---:|
| Data Analyst lessons to have done | 7 | 355 | 5 h 55 min |
| Set up the starter | 1 | 50 | 0 h 50 min |
| dbt lessons | 6 | 315 | 5 h 15 min |
| Read back | 4 | 185 | 3 h 05 min |
| Direct prerequisites in Excel, SQL, Python and the core | 13 | 685 | 11 h 25 min |
| Total | 31 | 1,590 | 26 h 30 min |

### What you skip

- **DE2, ingesting from an API defensively:** retries that listen to the server, landing that is safe to repeat, counting what came, and a field nobody announced. You run its code and never write it.
- **DE5, pipelines as small, testable functions,** and **DE7, scheduling with Airflow.** You will not have tested the pipeline code or scheduled it.
- **DE8, backfills and recovering from a failed run,** and **DE12, from a logical model to physical tables.**
- **No capstone of its own.** The route ends at DE14: a dbt project with tests and documentation, incremental models, a dimensional model, and a check on every pull request. The Data Engineer capstone, [*Capstone: a pipeline repo someone else can run*](/data-engineer/analytics-platform-capstone/) (DE18), is out of reach on this route, because DE17 and DE18 list DE8 as a prerequisite and DE15 lists DE12. To earn it, study the Data Engineer track in full.

In all, the route leaves out 4 h 45 min of Data Engineer lessons that come before DE14, and the Airflow setup. For your portfolio, keep the Data Analyst capstone you already have and add the dbt repository from DE14, with the same advice as above: a README, a CV line and a LinkedIn line that say the data are synthetic.

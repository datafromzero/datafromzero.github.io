---
title: "Data Engineer: all lessons"
description: Every Data Engineer lesson in the order to study them, with your done ticks.
---

## What you finish with

**There is no certificate.** datafromzero gives no verified certificate: it has no accounts, so it cannot check who finished. This is the message of the author of the site to every learner:

> A certificate has no value if you do not have personal projects that fit what employers need, and the skills and way of thinking to back them up. However strong the issuer is, if your ability does not yet fit or meet the job, the certificate is worth nothing.

What you can show instead is a project. If you want a sheet for yourself, the [completion page](/completion/) prints on one page, and says on it that it is not a verified certificate.

### How long it takes

From the first Excel lesson to the capstone of this track, the lessons state about **133 hours** in all: 7,975 minutes in 153 lessons. That is 27 weeks at 5 hours a week, or 14 weeks at 10 hours a week.

| Stage | Lessons | Minutes | Hours and minutes |
|---|---:|---:|---:|
| Excel / Sheets | 22 | 835 | 13 h 55 min |
| SQL | 39 | 1,895 | 31 h 35 min |
| Python | 28 | 1,315 | 21 h 55 min |
| Advanced core | 44 | 2,700 | 45 h 00 min |
| Data Engineer | 20 | 1,230 | 20 h 30 min |
| Total | 153 | 7,975 | 132 h 55 min |

Left out: the optional deep dive on database internals (11 lessons, 550 minutes), which is not required for a first job. The minutes are the ones printed on each lesson. They are estimates for a beginner who does every exercise, so some lessons will take you longer. If you already know a stage, take its placement test (Excel / Sheets, SQL, Python and the advanced core each end their page with one) and take that stage's hours off the total.

If you come from the Data Analyst track and want only dbt, there is a shorter way: the [analytics engineer route](/data-analyst/#analytics-engineer-route).

### The capstone

The capstone, [*Capstone: a pipeline repo someone else can run*](/data-engineer/analytics-platform-capstone/) (DE18), has you hand in [eight things](/data-engineer/analytics-platform-capstone/#the-brief): a clean-clone run, a README, tests and CI, a backfill story, a cost note, three questions answered in SQL, a run book, and an AI verification log with an explain-back. You score them yourself with a 16-point rubric, or ask a mentor. Nothing is sent to this site.

### What employers screen for

[Research issue #118](https://github.com/datafromzero/datafromzero.github.io/blob/main/research/issues/118-what-employers-will-hire-for-in-2026-and-beyond-demand-entry.md) read 27 entry-level Data Engineer postings in full (2026-11-22). SQL is named in all 27, Python in 24, data-quality, validation or testing duties in 23, and dbt in 12. Three or four say outright that they welcome portfolio or project evidence, and only 1 describes an interview task. The issue's own reading is that a credible portfolio is a runnable pipeline repository: ingestion, tests, docs and a backfill story. These postings are one sample, not the whole market.

### Show your project

A project does not promise an interview or a job. It is evidence you can point to, and the same issue puts work samples among the stronger predictors of job performance, though structured interviews score higher (its Finding 14).

1. Put the repository on GitHub, public. The starter's code is MIT and its data is CC BY 4.0, so keep its `LICENSE` and credit datafromzero.
2. Start the README with what the repository builds and the command that runs it. Then give the grain and key of every table, the backfill story, the cost note and the known limits, as the capstone asks.
3. Add one line to your CV and one to your LinkedIn profile, in your own words and with what you actually did:
   - **CV:** "Built a pipeline repository on a synthetic cafe dataset: API ingestion, Parquet staging, a dbt star schema with tests, CI that rebuilds it from nothing, a backfill story and a cost note; a clean-clone check runs it on a fresh copy. (link)"
   - **LinkedIn:** "Pipeline project on practice data: dbt models with tests, CI on every pull request, and a README that says what each table's grain is and why. Anyone can clone it and run it. (link)"
4. Be ready to talk it through:
   - Say the grain of one table and why you chose its key.
   - Show the clean-clone run, and say what it catches that your own laptop would not.
   - Tell the backfill: the command, the range, and the number that proves a rerun changed nothing.
   - Name the deliberate change your CI caught, and one thing a green check does not prove.

When you are done, you can print the [completion page](/completion/).

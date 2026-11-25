---
id: data-engineer-analytics-platform-capstone
title: 'Capstone: a pipeline repo someone else can run'
short_title: Pipeline capstone
description: Ship ingestion, dbt models, tests, CI, a backfill story and a cost note in one repository, with a graded AI verification log.
stage: data-engineer
order: 180
level: advanced
duration: 180
objectives:
  - Ship ingestion, dbt models, tests and CI as one repository another person can run
  - State the grain of each mart and defend the key choices in the README
  - Write a backfill story and a cost note
  - Prove the models serve real questions with a small BI or SQL layer
  - 'Hand in an AI verification log: accept, revise or reject, and the check that decided each'
prerequisites:
  - data-engineer-dimensional-models-and-scd
  - data-engineer-ci-and-deployment-for-dbt
  - data-engineer-backfills-and-failure-recovery
  - data-engineer-cloud-warehouse-in-practice
  - data-engineer-pipeline-capstone-design
  - core-trust-but-verify-ai-output
datasets:
  - cafe-sales
reviewed: 2026-11-16
sources:
  - title: 'dbt documentation: How we structure our dbt projects (accessed 2026-11-24; page updated 2026-08-19)'
    url: https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview
  - title: 'dbt documentation: Continuous integration (accessed 2026-11-24; page updated 2026-10-07)'
    url: https://docs.getdbt.com/docs/deploy/continuous-integration
status: draft
---

TODO(owner): Team draft (D24), run with dbt-core 1.12.6, dbt-duckdb 1.11.1, DuckDB 2.0.0, uv 0.11.32 on Linux; tags `de-18-start` and `de-18-done` are pushed to `de-pipeline-starter` (2026-11-24). The reference is the starter as the track builds it, with three added files (`sql/owner_questions.sql`, `scripts/clean_clone_check.sh`, the README sections). The clean-clone check, the 46 nodes and the deliberate break were run here; **the backfill, Airflow, GitHub Actions and a warehouse were not run for the capstone** (DE8 ran the backfill). The dollars of the star are reconciled between two tables of the repository, not with the API. The Kimball page of the stub was opened and is only a table of contents, so it is dropped; the dbt CI page describes the dbt platform, and the lesson quotes only its first sentence. The case's owner is invented, and the reference's AI log rows are written for the lesson, in the style of an assistant. Not run: Windows, macOS, Codespaces. Stub changes: prerequisites add *Trust, but verify* (C38); sources replaced by the two pages opened.

## The question

Dana, who owns the three cafes, writes: *My part-time analyst leaves next month. Can someone who has never seen this project run it on their first day, and can I ask it three questions and trust the answers?* Dana and her request are invented; the data are the synthetic `cafe-sales` lines from the sales API and two partner files.

You have built the pieces over the track; here you put them in one repository a stranger can run, with a README that defends it and a log that shows you checked what an AI told you. There is no single right repository: several earn full marks, and a pipeline that only runs on your laptop earns none.

## Warm-up

From memory first, then click to check.

1. In *CI for dbt: checks on every pull request* (DE14), what does a green check prove?

   <details>
   <summary>answer</summary>

   Only what its commands ran, on the data the run was given: that the project builds and its tests pass there.

   </details>

2. In *Dimensional models and slowly changing dimensions* (DE13), which version of a product does a line of `fct_order_lines` point to?

   <details>
   <summary>answer</summary>

   The version that was true when the line was ordered: its `product_key` is the one whose `valid_from` and `valid_to` surround the order time.

   </details>

## How this capstone works

**Time.** About 3 hours, 4 at most: the clean-clone check 20 minutes, the README's grain and keys 35, tests and CI 30, backfill 25, cost note 15, the three questions 25, the run book 10, the AI log 10, scoring 10.

**Tools.** Your own `de-pipeline-starter` as the track built it, or `git checkout de-15-start` to start from the same point. Fetch only the check script: `git show de-18-done:scripts/clean_clone_check.sh > scripts/clean_clone_check.sh`. Do not open the rest of `de-18-done` until you have scored yourself.

**AI is allowed at every step.** Start from a context pack as in [*Prompting with the data in the room*](/core/prompting-with-the-data-in-the-room/) (C37), run the five checks of [*Trust, but verify: checking AI output*](/core/trust-but-verify-ai-output/) (C38) on every output, and log a verdict for each, in the format of [*RAG and agents: what they are and how to judge them*](/core/ai-literacy-rag-and-agents/) (C43).

**Who marks it.** This site stores nothing and has no accounts: mark yourself with the rubric, or ask a mentor.

**When to stop.** If the clean-clone check fails twice for the same reason, stop and read its first failing line. If it still fails at 60:00, hand in what you have and say what is missing.

## The brief

**The case.** The repository lands the order lines from a sales API, stages them as Parquet, builds the star of DE13 with dbt in DuckDB, tests it, and rebuilds it from nothing in CI. Nothing new has to be built: the work is to make it runnable by a stranger, to say what it is, and to prove it answers questions.

**Hand in eight things,** each as short as honesty allows:

1. **A clean-clone run.** Commit everything, then run `bash scripts/clean_clone_check.sh`. Say before you run what you expect it to print; hand in what it printed and, if it failed, which file was missing from Git.
2. **A README** with six sections: what the repository builds and how to run it; the grain and the key of every table, with the kind of question each answers, in a table; why these keys; a backfill story; a cost note; and the known limits.
3. **Tests and CI.** Count your tests by kind (grain, reconciliation, rule), name the CI workflow, and show one deliberate change to a model that the CI catches, with the failing test and the exit status.
4. **A backfill story**, in the README: the command, the range, how many runs at once and why, a number that proves a rerun changed nothing, and what you do when one run fails.
5. **A cost note**, in the README: for each model, what a run reads, what it writes and when a full rebuild is needed, a count from a run, and one cheaper rewrite.
6. **Three questions answered** in `sql/owner_questions.sql`: net sales of each store; net sales of each category, with the category a product had when it was sold; and whether the star and the store-day table agree with the staged lines.
7. **A run book** of at most ten lines: what to do when the 6 a.m. run fails.
8. **An AI context pack and log**, as in the row below, signed with what you did not check, and an **explain-back** of about 40 words: one number you would defend and one check you will do by hand from now on. The row is invented, in another domain.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| A README that says a table "is updated in real time" | read the schedule of the job that builds it (check 4, confirm in the source) | revise | it is rebuilt once a night; the README now says so |

## Rubric

Eight items, each scored 2 (full), 1 (partial) or 0 (none): 16 in all. The rubric grades what you shipped and how well it holds up, not which design you chose: any repository that your reasoning supports can score 16.

**1. Clean-clone run.**

- **Full:** the expected result stated before the run; the check run on a fresh clone; its output shown, ending in a pass; and no file needed that Git does not hold.
- **Partial:** run in your own folder, or no expected result, or a fail that you explain and fix.
- **None:** not run.

**2. README: grain and keys.**

- **Full:** every dimension, fact and mart has one sentence for its grain and a key; each key choice has a reason tied to a rule of the data; the README says which table answers which kind of question.
- **Partial:** grains with no reasons, or some tables missing.
- **None:** no grain stated.

**3. Tests and CI.**

- **Full:** tests counted by kind; a workflow that runs on every pull request; one deliberate change the CI catches, with the failing test named and the exit status; and one thing a green check does not prove.
- **Partial:** tests and CI, but no deliberate change.
- **None:** no CI.

**4. Backfill story.**

- **Full:** the command and range; the number of runs at once, with the reason; a number before and after that proves a rerun changed nothing; and what happens when one run fails.
- **Partial:** a command with no proof.
- **None:** "rerun it".

**5. Cost note.**

- **Full:** a cost line for each model with its reads, writes and rebuild rule; a count from a run; one cheaper rewrite; any price dated and sourced, or none; and a line that says what was not run.
- **Partial:** three of those five.
- **None:** "it is cheap".

**6. The three questions.**

- **Full:** each question has its query and its result; each result is checked against a second route, with both numbers shown; and one thing the models cannot answer is named.
- **Partial:** answers with no second route.
- **None:** results with no queries.

**7. Run book and limits.**

- **Full:** a run book with the first thing to check, who owns it, the steps and when to stop; and at least three known limits, each tied to a count or a rule.
- **Partial:** one of the two.
- **None:** neither.

**8. AI log and explain-back.**

- **Full:** a context pack with its parts in order; a row for every AI output used, each with output, checks (by number or name), verdict and reason; at least one revise or reject, or a sentence on why none; your name, the date and what you did not check; an explain-back that names one number and one check.
- **Partial:** a log with verdicts but no reasons or no named checks, or an explain-back that could describe any project.
- **None:** no log, or a list of prompts with no checks.

A total of 13 or more is strong. From 8 to 12 is solid with gaps: redo the items that scored 0 or 1. Below 8, make the clean-clone check pass before you write anything else.

## Reference answer

Do the work first. The reference gives a run that earns full marks, the README, the three answers, a run book, a graded log and other routes to 16.

<details>
<summary>Open only after you finish</summary>

Every number comes from runs on 2026-11-24 with dbt-core 1.12.6, dbt-duckdb 1.11.1 and DuckDB 2.0.0. The files are in `de-18-done`: `git show de-18-done:README.md`, `sql/owner_questions.sql` and `scripts/clean_clone_check.sh`.

### The clean-clone run

Expected before the run: the script clones the repository into a new folder, installs the locked dependencies, builds from nothing in `data/ci/`, and ends with exit status 0 and every node passing, without a file that is only on my computer.

```console
$ bash scripts/clean_clone_check.sh
21:46:52  Done. PASS=1 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
21:46:57  Done. PASS=46 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=0 TOTAL=46
clean clone: exit status 0
```

The first `Done` is the snapshot of the partner's first file, the second the build of all 46 nodes. The median of 7 runs here was 14 seconds (12 to 15). The check clones only what Git holds, so a missing file shows here and not on a colleague's laptop.

### The README

````markdown
## What this repository builds

The sales of a three-cafe chain, from a sales API and two partner files, into a DuckDB database: land the lines, stage them as
Parquet, build a star schema with dbt, test every model, and rebuild everything from nothing in CI. From a clean clone, run
`uv sync --locked` and then `bash ci/dbt_ci.sh`: it builds in a folder of its own, `data/ci/`, and ends with all 46 dbt nodes passing.
`bash scripts/clean_clone_check.sh` does the clone for you.

## The grain of each table

| Table | One row is | Key | Answers questions about |
| --- | --- | --- | --- |
| `stg_order_lines` | the newest version of one order line | `order_line_id` | nothing a reader asks: it renames and types the staged file |
| `stg_products` | one product on the menu | `product_id` | nothing a reader asks: a renamed copy of the staged products |
| `stg_stores` | one store | `store_id` | nothing a reader asks: a renamed copy of the staged stores |
| `int_order_lines_priced` | one order line, with its product's price and its amount | `order_line_id` | nothing a reader asks: the amount of each line, for the marts that sum it |
| `dim_product` | one version of a product (type 2) | `product_key` | what a product was and cost, and its category on a given date |
| `dim_store` | one store as it is now (type 1) | `store_key` | where a store is and when it opened |
| `fct_order_lines` | one order line, with the keys that were true when it was ordered | `order_line_id` | any question about lines: sales by store or by category as sold, by status |
| `fct_store_daily_sales` | one store and one day with a sale | `store_id` and `order_date` | sales by store and day, and how they trend |
| `fct_store_status_amounts` | one store | `store_id` | completed against canceled dollars of a store |
| `fct_store_discounts` | one store | `store_id` | list price, discounts and net amount of a store's completed lines |

## Why these keys

`order_line_id` is the sales API's own number, so a line that arrives twice replaces itself. The two dimensions have surrogate keys,
because a product changes category and its old lines must keep the category true when they were ordered. The store-day table has a
two-part key because its grain is two things.

## Backfill

To rebuild a past range, from `airflow/`: `uv run airflow backfill create --dag-id cafe_pipeline --from-date 2026-05-01 --to-date 2026-05-05 --max-active-runs 1`.
One run at a time, because DuckDB lets one process write. Every run loads by key, so a rerun changes nothing; prove it with
`uv run python scripts/range_fingerprint.py 2026-05-01 2026-05-05` before and after, and the two fingerprints must be equal.
If one run fails, read the last line of its error first, fix the cause, and run the same command with `--reprocess-behavior failed`:
it creates runs again only for the days that failed. Afterwards the fingerprint of the range must equal the one that a single
incremental load of the same days gives.

## Cost

The counts come from the CI build of 2026-11-24 (`bash ci/dbt_ci.sh`). A view stores nothing; a table is rebuilt in full on every run.

| Model | A run reads | A run writes | Needs a full rebuild when |
| --- | --- | --- | --- |
| `stg_order_lines` (view) | the staged file, 62,362 bytes, when something reads the view | nothing | never |
| `stg_products` (view) | the staged file of 16 products | nothing | never |
| `stg_stores` (view) | the staged file of 3 stores | nothing | never |
| `int_order_lines_priced` (incremental, merge on `order_line_id`) | the lines posted since the newest one it holds, and the 16 products | those lines: 3,287 on the first build | what a row means changes (`--full-refresh`) |
| `products_snapshot` (snapshot) | the partner's file | a row for each product that changed: 18 rows | never: a rebuilt snapshot loses its history |
| `dim_product` (table) | the 18 rows of the snapshot | 18 rows | every run |
| `dim_store` (table) | the 3 stores | 3 rows | every run |
| `fct_order_lines` (table) | 3,287 lines, 18 product versions, 3 stores | 3,287 rows | every run |
| `fct_store_daily_sales` (table) | 5 of the 10 columns of `int_order_lines_priced`, 167,636 bytes for 3,287 lines, and the 3 stores | 453 rows, one for each store and day | every run |
| `fct_store_status_amounts` (table) | 3 columns of the 3,287 lines of `int_order_lines_priced` | 3 rows | every run |
| `fct_store_discounts` (table) | 3,287 lines and 16 products | 3 rows | every run |

The bytes are DuckDB's, counted with BigQuery's type sizes, and BigQuery was not run. No price is used. The cheaper rewrite is for
`fct_store_daily_sales`: on a warehouse partition it by `order_date` and rebuild only the days a run changes.

## Known limits

- One writer: DuckDB lets one process write, so a backfill of 5 days is 5 runs in a row, never at once.
- A line is loaded late only because the load overlaps by one hour (DE4): a line posted with a time more than an hour before the
  newest line loaded is missed by the nightly load, and only a full replay finds it.
- The products come from one partner file whose history is invented (3 versions, 2 category moves), and the dollars are reconciled
  between two tables of this repository (3,286 completed lines, $22,625.75), not with the API.
- The star has no customer: a question about what a customer bought cannot be answered from it.
- Airflow needs Linux or WSL2, and the backfill was run in DE8, not again here.
````

It scores 2 on items 2, 4 and 5, and on the limits half of item 7 (the run book is below). Item 2: the grain and key of all ten models, a reason for the keys, and the kind of question each table answers. Item 4: the command and range, one run at a time with its reason, the fingerprint before and after, and what to do when one run fails. Item 5: a cost line for each model and the snapshot with its reads, writes and rebuild rule, counts from the CI build, one cheaper rewrite, no price, and a line that says BigQuery was not run. Item 7: five known limits, each tied to a count or a rule. The dbt page on project structure describes the same three layers, staging, intermediate and marts, that the table follows.

### Tests and CI

The CI build prints what it ran:

```console
$ bash ci/dbt_ci.sh 2>&1 | grep -E "Finished running"
21:48:23  Finished running 1 snapshot in 0 hours 0 minutes and 0.26 seconds (0.26s).
21:48:28  Finished running 1 incremental model, 1 snapshot, 6 table models, 35 data tests, 3 view models in 0 hours 0 minutes and 1.49 seconds (1.49s).
```

Thirty-five data tests: the grain (`unique` and `not_null` on each key), the reconciliations (every completed line is in the mart, every line is in the fact) and the rules (no sales before a store opens). The workflow of DE14 runs the build on every pull request, and the dbt page on continuous integration says CI tests code changes by running jobs before merging to production.

The deliberate change: in `fct_order_lines.sql`, delete the two lines that match the order time to the version of the product, so the join uses `product_id` alone.

```console
$ bash ci/dbt_ci.sh 2>&1 | grep -E "FAIL|Done"; echo "exit status ${PIPESTATUS[0]}"
21:47:07  Done. PASS=1 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
21:47:11  40 of 46 FAIL 1 assert_the_fact_keeps_every_line ............................... [FAIL 1 in 0.01s]
21:47:11  46 of 46 FAIL 351 unique_fct_order_lines_order_line_id ......................... [FAIL 351 in 0.02s]
21:47:11  Done. PASS=44 WARN=0 ERROR=2 SKIP=0 NO-OP=0 REUSED=0 TOTAL=46
exit status 1
```

Two tests fail, 351 lines repeat, and the script exits with status 1. A green check does not prove the numbers are the API's: it proves the build and the tests on the data the run was given.

### The three questions

```sql
-- 1. Net sales of the completed lines of each store.
SELECT s.store_name, count(*) AS lines, sum(f.line_amount_usd) AS net_sales_usd
FROM fct_order_lines AS f
JOIN dim_store AS s USING (store_key)
WHERE f.status = 'completed'
GROUP BY s.store_name
ORDER BY s.store_name;
```

```console
store_name | lines | net_sales_usd
-----------+-------+--------------
Campus     | 1304  | 9017.75
Harbor     | 645   | 4611.25
Old Town   | 1337  | 8996.75
```

```sql
-- 2. Net sales of each category, with the category a product had when the line was ordered.
SELECT p.category, count(*) AS lines, sum(f.line_amount_usd) AS net_sales_usd
FROM fct_order_lines AS f
JOIN dim_product AS p USING (product_key)
WHERE f.status = 'completed'
GROUP BY p.category
ORDER BY p.category;
```

```console
category | lines | net_sales_usd
---------+-------+--------------
bakery   | 631   | 3866.25
coffee   | 1654  | 10823.25
food     | 500   | 4696.25
tea      | 501   | 3240.00
```

```sql
-- 3. Do the star and the store-day table agree with the staged lines?
SELECT
    (SELECT count(*) FROM 'data/staging/order_lines.parquet' WHERE lower(status) = 'completed') AS staged_lines,
    (SELECT count(*) FROM fct_order_lines WHERE status = 'completed') AS fact_lines,
    (SELECT sum(lines) FROM fct_store_daily_sales) AS mart_lines,
    (SELECT sum(line_amount_usd) FROM fct_order_lines WHERE status = 'completed') AS fact_net_usd,
    (SELECT sum(sales_usd) FROM fct_store_daily_sales) AS mart_net_usd;
```

```console
staged_lines | fact_lines | mart_lines | fact_net_usd | mart_net_usd
-------------+------------+------------+--------------+-------------
3286         | 3286       | 3286       | 22625.75     | 22625.75
```

The lines are the same on three routes, 3,286, and the money on two, $22,625.75; the stores add up to it ($9,017.75 + $4,611.25 + $8,996.75) and so do the categories. That reconciles the star with the store-day table, which both read the same prices: it does not check the dollars against the API, because the staged file has no prices to check them with. The models cannot say what a customer bought: the star has no customer.

### The run book

> **First check.** Open the failed run's log and read the last line of the first error; decide whether it is data, pipeline or definition (DE8). **Owner.** The data engineer on call, named in the README. **Steps.** (1) If the data broke the contract, the load already stopped or set the lines aside: read the quarantine and tell the source's owner. (2) If a test failed, `dbt build` skipped what depends on it: fix the model, rerun the day. (3) Rerun one day at a time and compare the fingerprint of the range before and after. **Stop** when the same step fails twice: page the owner of the layer before it.

### A graded AI log

The pack, in order: the schema (the models and their columns); the grain (the table above); five real rows of `fct_order_lines`; a dictionary (`status`, `line_amount_usd`, `valid_from`). The rows are illustrations written for the lesson, in the style of an assistant; the checks are real.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| A category query that starts from the staged lines, joins `dim_product` on `product_id` and keeps the current row | ran it: bakery 606 lines and $4,383.25, food 525 and $4,179.25, against 631 and $3,866.25, 500 and $4,696.25 as sold from the fact (check 3, reconcile) | revise | the current category moves 25 lines and $517 between bakery and food; the question asks for the category when sold, so the join is on the fact's `product_key` |
| "Run the five days of the backfill in parallel to save time" | looked for what the store allows: DuckDB lets one process write (check 4, confirm in the source) | reject | the README says one run at a time |
| A mart written as `select *` "to keep it simple" | counted bytes: all ten columns are 306,437, the five it needs 167,636 (check 3, reconcile) | revise | the mart names its columns; the cost line says why |
| A cost note that quotes a monthly dollar figure | looked for a price page and a date in the prompt and the output: neither was given (check 4, confirm in the source) | reject | no dated price is sourced, so the note gives bytes and no dollars |

*Signed: your name, the date. Not checked: the backfill in this repository, and any run on GitHub Actions.*

The explain-back, about 40 words: "I would defend 3,286 lines on three routes and $22,625.75 on two, which agree. From now on I run the clean-clone check before I say a repository works." The log scores 2 on item 8: the pack is in order, four rows have all four columns with the checks named, two are revised and two rejected, it is signed with what was not checked, and the explain-back names a number and a check.

**Other ways to full marks.** Keep the flat store-day table and drop the star, with its grain and keys defended. Backfill by `dbt build --full-refresh` in place of Airflow, with the same before-and-after proof. A cost note that counts rows, not bytes, if it says why. What does not earn full marks: a README with no grain, a green run in your own folder only, answers with no second route, a log of accepts.

</details>

You have finished the Data Engineer track. [*Choose your track*](/choose-your-track/) puts the four careers side by side if you want to compare.

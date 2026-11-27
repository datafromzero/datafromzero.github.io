---
id: data-engineer-pipeline-capstone-design
title: 'Simulation: design a pipeline and defend it'
short_title: Pipeline simulation
description: Pass a timed SQL test and a timed design case on contract, failure points and scale, scored by the rubric printed in the lesson.
stage: data-engineer
order: 170
level: advanced
duration: 90
objectives:
  - Pass a timed SQL test at a stated bar
  - 'Write a contract: inputs, outputs, guarantees and the failure that must never be silent'
  - Choose batch or streaming, ETL or ELT, and a model, with reasons
  - Draw the architecture with failure points marked and estimate what breaks first at 100 times the volume
  - Score your own answer against the printed rubric
prerequisites:
  - sql-window-functions
  - data-engineer-backfills-and-failure-recovery
  - data-engineer-spark-distributed-processing
  - data-engineer-data-quality-checks
  - core-designing-a-star-schema
  - data-engineer-cloud-warehouse-in-practice
datasets:
  - app-events
reviewed: 2026-11-25
sources:
  - title: 'dbt documentation: How we structure our dbt projects (accessed 2026-11-24; page updated 2026-08-19)'
    url: https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview
  - title: 'Apache Kafka documentation: Introduction (accessed 2026-11-24)'
    url: https://kafka.apache.org/intro
  - title: 'Apache Spark documentation: Structured Streaming overview (Spark 4.3.0, accessed 2026-11-24)'
    url: https://spark.apache.org/docs/latest/streaming/index.html
status: published
---

## The question

The head of product at the budgeting app writes: *Every morning I want one table of how many people signed up the day before and how many of them were active in their first week, by platform, in the dashboard by 6 a.m. Today a person builds it by hand in a spreadsheet. The app will be a hundred times bigger in two years. Design the pipeline, tell me what I can rely on, and tell me what breaks first.* She and her request are invented; the data are the synthetic `app-events` events.

You have 90 minutes, and the rubric is below, so you can read it now. There is no single right design: several earn full marks, and a pipeline whose failures nobody would notice earns none.

## Warm-up

Try each one from memory, then open the answer. Forgot? Follow the link back to that part of the lesson: looking back is part of the review.

1. In [*Data quality checks that fail loudly*](/data-engineer/data-quality-checks/#1-a-contract-and-the-checks-it-makes) (DE6a), what did the contract of `order_lines` list, and what did a check do when the data broke it?

   <details>
   <summary>answer</summary>

   The producer, the key, each column's rules (may it be empty, which values, which range), how fresh the data must be, how many lines a day, and the failure that must never be silent. A check compared the data with it and stopped the run or set the bad lines aside, instead of letting them through.

   </details>

2. In [*Backfills, reruns and recovering from failure*](/data-engineer/backfills-and-failure-recovery/#3-rerun-what-failed-and-prove-nothing-doubled) (DE8), what must be true of a run for a rerun of the same days to be safe?

   <details>
   <summary>answer</summary>

   It must be idempotent: running it again for the same range gives the same table, with no line twice and none lost.

   </details>

## How this simulation works

**Time.** 90 minutes: the SQL test 30; the design 45, split as the contract 8, the choices 7, the architecture 10, the 100-times estimate 12, the trade-off note 5 and the AI log 3 (write each row as you use an output); scoring yourself 15. Use a timer, not this page.

**Tools.** The events file is the one of the Spark lesson (DE16): run `uv run python scripts/fetch_app_events.py` in `de-pipeline-starter` if you do not have it, then `uv run python scripts/sql.py "..."` for each question. Draw on paper or in any tool. Fetch the one script the estimate uses: `git show de-17-done:scripts/scale_probe.py > scripts/scale_probe.py`.

**AI.** Allowed, as at work. Start from a context pack as in [*Prompting with the data in the room*](/core/prompting-with-the-data-in-the-room/) (C37), run the five checks of [*Trust, but verify: checking AI output*](/core/trust-but-verify-ai-output/) (C38) on every output, and log a verdict for each, in the format of [*RAG and agents: what they are and how to judge them*](/core/ai-literacy-rag-and-agents/) (C43). The capstone grades the log at length; here it is one rubric item.

**Who marks it.** This site stores nothing and has no accounts: mark yourself with the rubric, or ask a mentor.

**Stop rules.** At 30:00 stop the SQL test and hand in what you have. At 75:00 stop designing and start scoring.

## The brief

### Part A: the SQL test (30 minutes)

Five questions on `data/raw/app-events/events.csv`, 177,379 events with the columns `event_id`, `user_id`, `event_ts`, `event_name`, `platform` and `received_at`. Give each answer as the numbers asked for, with the query that produced it. The bar is 4 of 5.

1. How many different people made a purchase (`purchase` events), and how many purchase events are there?
2. In which hour of the day, as the file records it, are there most events, and how many?
3. Of the people who signed up (`signup_complete`) in January 2026, how many were there, and how many had a `session_start` within 7 days after signing up?
4. Which is the last day of the seven days (counting that day and the six before it) with the most signups, and how many signups did they have?
5. How many events reached the server more than one day after they happened, and how late was the latest?

### Part B: the design case (45 minutes)

**The need.** One table, built every morning, with a row for each day and platform: the people who signed up that day and how many of them were active in their first week, which means at least one `session_start` from the signup up to 7 days later. The app sends the events as one file for each day.

**Hand in six things,** each as short as honesty allows:

1. A **contract**, half a page at most: the inputs, the outputs with the grain of each, the guarantees, the failure that must never be silent, and who owns it.
2. Three **choices** with a reason each: batch or streaming, ETL or ELT, and the model of the output (a flat table or a star).
3. An **architecture drawing**: the stages from the app to the dashboard, where the data rests between them, and every failure point numbered, each with how it is detected and what happens next.
4. An **estimate at 100 times the volume**: take one measurement on your own machine with `uv run python scripts/scale_probe.py 10`, show the arithmetic, name what breaks first and what breaks second, and one change.
5. A **trade-off note** for the head of product, at most 150 words: what you chose, what you gave up, who is affected, and the check that would show you were wrong.
6. An **AI log**: the context pack, then one row for every AI output you used, with your name, the date and what you did not check. With no AI, log your three riskiest steps the same way. The row below is invented, in another domain.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| A query that joins the orders to the customers and sums the totals | counted the rows before and after the join (check 2, count rows) | revise | each order appeared twice; I grouped before joining |

## Rubric

Eight items, each scored 2 (full), 1 (partial) or 0 (none): 16 in all. The rubric grades the chain from question to defense: any design that your reasoning supports can score 16.

**1. SQL test.**

- **Full:** at least 4 of the 5 answers match the reference, and every answer has its query.
- **Partial:** 3 answers match, or 4 match with no queries.
- **None:** 2 or fewer match.

**2. Contract.**

- **Full:** five parts: the inputs, the outputs with their grain, the guarantees (each with a rule or a number), the failure that must never be silent, and an owner.
- **Partial:** three or four parts.
- **None:** two or fewer.

**3. Batch or streaming.**

- **Full:** the decision; the need's tolerance for age as a time; the cost of the choice; and what would change it.
- **Partial:** three of the four.
- **None:** the decision with no reason, or a reason that does not use the need.

**4. ETL or ELT, and the model.**

- **Full:** the choice with a reason; the layers named in order; the grain and the key of each output; and one thing the model cannot answer.
- **Partial:** three of the four.
- **None:** a choice with no reason, or no grain.

**5. Architecture.**

- **Full:** every stage labeled; where the data rests between stages; at least four failure points, each numbered, each with how it is detected and what happens next.
- **Partial:** failure points without detection or response, or fewer than four.
- **None:** a picture with no failure points.

**6. Scale at 100 times.**

- **Full:** one measurement you took; the arithmetic shown; the first thing to break named with a number; a second thing; one change; and a line that says what was not run.
- **Partial:** four of the six.
- **None:** "it will be slower" and nothing more.

**7. Trade-off note.**

- **Full:** at most 150 words; the choice; what was given up; who is affected; the check that would show it wrong.
- **Partial:** three of those four, or over 150 words.
- **None:** the design restated, with no cost named.

**8. AI log and self-score.**

- **Full:** a context pack in order; a row for every AI output used, each with output, checks (by number or name), verdict and reason; at least one revise or reject, or a sentence on why none; your name, the date and what you did not check; and a score for each item above, with the minutes you spent.
- **Partial:** a log with verdicts but no reasons or no named checks, or no self-score.
- **None:** no log, or a list of prompts with no checks.

A total of 13 or more is ready to show. From 8 to 12, redo the items that scored 0 or 1. Below 8, redo the contract and the failure points before the rest.

## Reference answer

Do the work first. The reference gives the answers of the test, a design that earns full marks, and what changes if you chose differently.

<details>
<summary>Open only after you finish</summary>

Every number comes from a run on 2026-11-24 with DuckDB 2.0.0. Fetch the queries with `git show de-17-done:sql/sql_test_reference.sql > sql/sql_test_reference.sql`; each one below is run through `scripts/sql.py` as a statement.

### The SQL test

**1.** People and purchase events:

```sql
SELECT count(DISTINCT user_id) AS people, count(*) AS purchases
FROM 'data/raw/app-events/events.csv'
WHERE event_name = 'purchase';
```

```console
people | purchases
-------+----------
2849   | 2905
```

**2.** The busiest hour:

```sql
SELECT hour(event_ts) AS hour, count(*) AS events
FROM 'data/raw/app-events/events.csv'
GROUP BY hour
ORDER BY events DESC, hour
LIMIT 1;
```

```console
hour | events
-----+-------
14   | 9534
```

**3.** January signups, and those active in week 1:

```sql
WITH signups AS (
    SELECT user_id, min(event_ts) AS signed_up
    FROM 'data/raw/app-events/events.csv'
    WHERE event_name = 'signup_complete' AND event_ts < TIMESTAMP '2026-02-01'
    GROUP BY user_id
)
SELECT count(*) AS signups,
       count(*) FILTER (WHERE EXISTS (
           SELECT 1 FROM 'data/raw/app-events/events.csv' AS e
           WHERE e.user_id = s.user_id AND e.event_name = 'session_start'
             AND e.event_ts >= s.signed_up AND e.event_ts < s.signed_up + INTERVAL 7 DAY
       )) AS active_in_week_1
FROM signups AS s;
```

```console
signups | active_in_week_1
--------+-----------------
2865    | 1419
```

**4.** The best seven days:

```sql
WITH daily AS (
    SELECT CAST(event_ts AS DATE) AS day, count(*) AS signups
    FROM 'data/raw/app-events/events.csv'
    WHERE event_name = 'signup_complete'
    GROUP BY day
)
SELECT day AS last_day, sum(signups) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS seven_days
FROM daily
ORDER BY seven_days DESC, day
LIMIT 1;
```

```console
last_day   | seven_days
-----------+-----------
2026-06-03 | 1307
```

**5.** Late events:

```sql
SELECT count(*) FILTER (WHERE received_at - event_ts > INTERVAL 1 DAY) AS over_a_day,
       max(received_at - event_ts) AS latest
FROM 'data/raw/app-events/events.csv';
```

```console
over_a_day | latest
-----------+-----------------
608        | 2 days, 23:52:23
```

The answers are 2,849 and 2,905; hour 14 with 9,534; 2,865 and 1,419; June 3, 2026 with 1,307; 608 and 2 days 23:52:23. In question 4 the frame counts the six rows before, which are the six days before because all 181 days have signups; a table with a missing day would need a calendar to join first. The same two columns have the opposite oddity: 30 events have `received_at` before `event_ts`, by up to 4.95 hours (the dataset README says the phone clock ran ahead), so a check on the delay needs a rule for a negative one.

### A contract that earns full marks

> **Inputs.** One file of events for each day, from the app: `event_id`, `user_id`, `event_ts`, `event_name`, `platform`, `received_at`. **Output.** `daily_signups`, one row for each day and platform: `signups`, `active_in_week_1`. **Guarantees.** By 6 a.m. the table holds every day up to yesterday; each day and platform appears once; `active_in_week_1` of a day is final only after day 7 and the late-arrival window of 3 days, so the last 10 days are marked provisional; `event_id` is never repeated in the staged events (177,379 events, 177,379 different ids in the file). **Never silent.** A day with no file, or with fewer than half the events of the same weekday a week before, stops the run, keeps yesterday's table and pages the owner. **Owner.** The data engineer on call, named in the README.

It scores 2 on item 2: five parts, each guarantee with a rule or a number. The 3 days come from question 5: the latest event arrived 2 days, 23 hours and 52 minutes after it happened, and 608 events, 0.34 percent of the file, arrived more than a day late. A guarantee about "the last day" would be false for the days still changing.

### The choices

**Batch.** The need is a table by 6 a.m., so an answer a few hours old is fine. The Kafka page lists payments and tracking in real time as what event streaming serves, and the Spark page gives micro-batch latencies as low as 100 milliseconds; neither is a need of this table. The cost is that nothing is visible until the morning run; what would change the choice is a need that acts within minutes.

**ELT.** Land the daily files as they are, then transform them in the database with SQL, so a rule that changes is a re-run and not a re-download. The dbt page structures a project as staging, intermediate and marts.

**A star, with a flat mart on top.** The facts are the events, one row for each event (the grain), with the person and the platform as keys; the mart `daily_signups` is the flat table of the need, one row for each day and platform. The star cannot answer a question about a person's first week of a day not yet loaded, which is why the mart marks provisional days.

### The architecture

```text
app --1--> daily file --2--> raw (as it arrived) --3--> staged events --4--> dbt models and tests --5--> daily_signups --6--> dashboard
```

1. **The file does not arrive.** Detected by a check at 5:00 that today's file exists and is not empty; response: retry twice, then page the owner and keep yesterday's table with a "stale since" date.
2. **The file arrives twice or changed.** Detected by the file's size and a count of events in it against the previous load; response: the load is by key, so a second copy changes nothing (DE4).
3. **A column changes or fills with empty values.** Detected by the contract check of DE6a; response: the run stops and the file is quarantined.
4. **A model builds and its numbers are wrong.** Detected by tests on the grain and a reconciliation of the sum of `signups` with the count of `signup_complete` events (DE10); response: `dbt build` stops and the dashboard keeps the last good table.
5. **Late events change a past day.** Detected by recomputing the last 10 days on every run and comparing them with the stored rows; response: the changed days are replaced whole, and their provisional flag stays until final.
6. **The dashboard shows a stale table as if it were fresh.** Detected by the table's `built_at` shown on the dashboard; response: a visible warning after 7 a.m.

### At 100 times

The measurement: `uv run python scripts/scale_probe.py 10` reads the daily query on the file and on ten copies of it.

```console
$ uv run python scripts/scale_probe.py 10
events.csv: 13,041,745 bytes, 181 days, 0.06 s
events_x10.csv: 132,190,718 bytes, 181 days, 0.16 s
```

Seven runs gave a median of 0.06 s for the file (0.06 to 0.07) and 0.16 s for ten copies (0.15 to 0.19): ten times the data took 2.1 to 2.8 times as long, run by run, on this machine. The file is 13,041,745 bytes for 177,379 events, 73.5 bytes each; at 100 times that is 17,737,900 events and about 1.3 GB (13,041,745 times 100, not run). A query that reads the history takes seconds, not hours, so the **first thing to break is not the 6 a.m. deadline**. It is the guarantee: if 0.34 percent of events arrive more than a day late (question 5), then 100 times as many, about 60,800 (608 times 100, not run), change days the dashboard has already shown. The second thing is the bill on a warehouse that reads the whole history every day (DE15), where bytes scale with the data. The change: recompute only the last 10 days and keep the older days, with the provisional flag. Not run: any volume above ten copies, any warehouse.

### The trade-off note

> I chose a daily batch and ELT. You get the table by 6 a.m. and a pipeline that a person can rerun and explain; you give up seeing a signup within minutes, and the last 10 days can still move because events arrive up to 3 days late (608 of 177,379 arrived more than a day late). The product team is affected whenever it reads a provisional day. The check that would show me wrong: if anyone acts on today's numbers before 6 a.m., or if provisional days keep moving by more than 1 percent after 10 days, the need is faster than a daily batch.

About 100 words, scoring 2 on item 7.

### A graded AI log

The context pack, in order: the schema (the six columns); the grain (one row is one event); five real sample rows; a dictionary (`event_ts` when it happened, `received_at` when the server got it). The rows are illustrations written for the lesson, in the style of an assistant; the checks are real.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| "2,905 people made a purchase" | counted distinct `user_id` as well as rows, a second way to count (check 3, reconcile) | revise | 2,905 is the number of events; 2,849 people made them |
| A contract that promises "exactly-once delivery" of the daily file | looked in the case for what the app guarantees: nothing says it (check 4, confirm in the source) | reject | the pipeline cannot promise what the source does not; the contract promises a load by key instead |
| "Use Kafka and Spark Streaming for the 6 a.m. table" | wrote down the need's tolerance for age (hours) before reading it, then compared (check 1, predict) | reject | nothing in the need acts within minutes; a daily batch meets it |
| "A hundred times the data will not fit in memory" | ran `scale_probe.py 10`, a measurement of the claim (check 3, reconcile) | revise | ten copies were quick; the 100-times figure is not run, so the note says so |

*Signed: your name, the date. Not checked: how the dashboard tool refreshes at 6 a.m.*

It scores 2 on item 8 with the self-score of every item and the minutes.

**Other ways to full marks.** A star with the events as facts and no flat mart, if the grain and key of each output are stated. A streaming design for a need that is faster than the one here, if the cost and the change are named. A scale estimate that finds the dashboard query, not the late events, to be the first break, if it carries a measurement. What does not earn full marks: a contract with no failure that must never be silent; a diagram with no failure points; "it will scale" with no measurement; a 100-times claim presented as a run.

</details>

That is the last practice before the capstone, [*Capstone: a pipeline repo someone else can run*](/data-engineer/analytics-platform-capstone/) (DE18), where you ship the whole project as one repository (*repo* for short: a project folder kept with Git).

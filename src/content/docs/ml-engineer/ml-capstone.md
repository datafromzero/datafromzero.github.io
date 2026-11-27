---
id: ml-engineer-ml-capstone
title: 'Capstone: ship it and prove it works'
short_title: ML capstone
description: Serve a classical or an LLM system with an evaluation report, a failure slice, a cost line, a ship or no-ship memo and a graded AI log.
stage: ml-engineer
order: 160
level: advanced
duration: 180
objectives:
  - Choose the classical or the LLM half and serve it behind an endpoint
  - Write an evaluation report with a failure slice and a cost line
  - End with a ship or no-ship memo that states the evidence
  - 'Hand in an AI verification log: accept, revise or reject, and the check that decided each'
prerequisites:
  - ml-engineer-build-and-evaluate-simulation
  - ml-engineer-monitoring-drift-and-retraining
  - ml-engineer-agents-tools-and-guardrails
datasets:
  - app-events
reviewed: 2026-11-26
sources:
  - title: 'FastAPI documentation: Request Body (accessed 2026-11-25)'
    url: https://fastapi.tiangolo.com/tutorial/body/
  - title: 'scikit-learn documentation: Model persistence (accessed 2026-11-25)'
    url: https://scikit-learn.org/stable/model_persistence.html
  - title: 'Google for Developers: Rules of Machine Learning, Rules 9 and 37 (accessed 2026-11-25)'
    url: https://developers.google.com/machine-learning/guides/rules-of-ml
status: published
---

## The question

Priya Nair, head of growth at the budgeting app, writes: *Two requests are on my desk, and you take the one that fits your path. The data team has retrained the churn model on everything up to May 10 and wants to replace the one we serve: ship it or not? Or: support wants the SQL-lesson answerer behind an endpoint for our help widget: ship it or not? Either way I want the system running behind an address, the numbers that justify your answer, where it fails, what it costs, and a memo I can read in two minutes.* Priya and her requests are invented; the churn data are the synthetic `app-events` people, and the help text is the site's own SQL lessons.

You have 3 hours, 4 at most. You choose **half A, the classical model**, or **half B, the language model**; the rubric is the same, so read it first. No single system earns full marks: a "do not ship" with evidence earns the same as a "ship" with evidence, and a "ship" with none earns nothing.

## Warm-up

Try each one from memory, then open the answer. Forgot? Follow the link back to that part of the lesson: looking back is part of the review.

1. In [*Monitoring, drift and retraining*](/ml-engineer/monitoring-drift-and-retraining/#2-data-drift-the-inputs-have-changed) (MLE14), against which people is the drift of a model's inputs measured, and why does it matter?

   <details>
   <summary>answer</summary>

   Against the people the model learned from. A reference that holds other weeks makes quiet weeks look drifted and can hide a real change.

   </details>

2. In [*Tuning hyperparameters and handling imbalanced classes*](/ml-engineer/tuning-and-class-imbalance/#2-a-baseline-and-a-test-part-scored-once) (MLE4), why is the test part scored only once, and what is the same for a golden set?

   <details>
   <summary>answer</summary>

   A set used to choose a setting no longer measures new data: the choice has fitted it, so the test part is scored once, at the end. The same holds for a golden set: if a prompt or a threshold is tuned against it, it is no longer a fair test, so it is used once, at the end, and nothing is tuned against it.

   </details>

## How this capstone works

**Time.** About 3 hours, 4 at most: the context pack 15 minutes; building and serving 45; the evaluation 40; the cost line, drift check and rollback plan 20; the memo 15; the AI log 15 (a row each time you use an output); the explain-back 10; scoring yourself 20. At 4 hours stop and hand in what you have, and say what is missing.

**Tools.** Half A works in your own `ml-starter` as [*Simulation: build and evaluate in a time box*](/ml-engineer/build-and-evaluate-simulation/) (MLE15) left it (`git checkout mle-16-start` to catch up: a checkpoint, explained in [MLE2](/ml-engineer/validating-model-data/#learn-by-doing)). Half B works in its folder `llm/`, which has an environment of its own: fetch its five given files with `git show mle-16-done:llm/FILE > llm/FILE` (`git show TAG:PATH` prints a file as it was saved at that checkpoint, and `>` writes it into your folder) for `pyproject.toml`, `uv.lock`, `.gitignore`, `rag.py` and `questions.py`, then `cd llm` and `uv sync`. It downloads about 3.4 GB of model files the first time and needs about 10 GB of memory at the peak; run one language-model process at a time. It reuses the answerer of lessons MLE8 to MLE10: `ibm-granite/granite-4.0-1b` (made by IBM, Apache 2.0, downloaded without an account) and `sentence-transformers/all-MiniLM-L6-v2`, on the CPU. Do not open the `reference/` folders of `mle-16-done` until you have scored yourself.

**AI is allowed at every step.** Using it is free; using it without checking is what costs points. Start from a context pack as in [*Prompting with the data in the room*](/core/prompting-with-the-data-in-the-room/) (C37), run the five checks of [*Trust, but verify: checking AI output*](/core/trust-but-verify-ai-output/) (C38) on every output, and log a verdict for each, in the format of [*RAG and agents: what they are and how to judge them*](/core/ai-literacy-rag-and-agents/) (C43).

**Who marks it.** This site stores nothing and has no accounts: mark yourself with the rubric, or ask a mentor.

**When to stop.** If the same check fails twice, stop and decide yourself, as in [*What stays human*](/core/what-stays-human/) (C42). At 45 minutes into the build, if the endpoint does not answer one request, hand in what you have and say what is missing.

## The brief

**Half A, the classical model.** Version 1 is the model of the MLE14 replay: the pipeline of MLE1 with `C` of 0.1, learned from the 5,622 people who signed up before March 2. Version 2 is the same pipeline learned from the 14,328 people who signed up before May 11. Today is July 1: every outcome of the 3,488 people who signed up from May 11 to May 31 is known, and neither version learned from them. Those people are your held-out people; use them once, at the end.

**Half B, the language model.** The system is `rag.py`: the eight SQL lessons cut into chunks, the three best chunks as sources, a JSON answer with the numbers of its sources, and a refusal when nothing is close. `questions.py` holds 16 held-out questions written for this capstone: 12 that the lessons answer, each with the phrases that hold the answer and the patterns an answer must match, and 4 that they do not. Use them once, at the end.

**Hand in six things,** each as short as honesty allows:

1. A **context pack**, written before your first prompt: the schema or the corpus, the grain (one row is one person; one item is one chunk), a few real samples, and what "better" means for Priya, in one line.
2. **The system behind an endpoint**: a service that checks its request (a bad one gets 422; the FastAPI request-body page says that invalid data gets "a nice and clear error, indicating exactly where and what was the incorrect data"), says whether it can answer (503 when not ready, 200 when ready), answers one real request, and has one test that calls it through its interface. A file it loads is opened with only the types you reviewed: the scikit-learn persistence page says skops "only loads files which have types and references to functions which are trusted either by default or by the user". Half A serves `model/v2.skops` with the service of MLE13 (`MODEL_FILE`) and shows version 2's AUC on its own held-out people against the 0.68 floor of the MLE14 gate, which is the rollback trigger of `docs/rollback_plan.md`; the gate's test trains from the repository's code, so it never opens this file. Rule 9 of the Rules of Machine Learning asks for this check before a model is exported: "make sure that the model's performance is reasonable on held out data". Half B writes `llm/serve_llm.py` after the pattern of MLE13, with a stand-in for the system in its test.
3. An **evaluation report**, at most 250 words: the baseline and its number; your system's number on the held-out data; the gain with a paired 95 percent interval from 2,000 resamples (seed 2026) of the same people (half A) or the same questions (half B), both sides scored by one grader; the word "tie" when the interval includes 0, and when it does not, how big the gain is; one failure slice with its count; and one drift check (half A: the largest PSI of the held-out people against the right reference) or one refusal count (half B: the four questions the lessons cannot answer).
4. A **cost line**: milliseconds and dollars for 1,000 requests, measured through the service (half A with `scripts/compare_service.py` and `monitor summary`; half B from the tokens and seconds of the replies, at an assumed $1.00 and $5.00 per million prompt and completion tokens, which are assumptions and not any provider's prices), plus what standing idle costs at an assumed price, and what you did not measure.
5. A **ship or no-ship memo**, at most 200 words, for Priya: the decision, the evidence, what would change it, and the way back (half A: the rollback plan of `docs/rollback_plan.md`, updated for version 2; half B: what the service does when it cannot answer, and how it is switched off). Write the number you need before you run the evaluation.
6. A **verification log**: one row for every AI output you used, in the format of the project step of [*RAG and agents: what they are and how to judge them*](/core/ai-literacy-rag-and-agents/) (C43). Under the table write your name, the date and what you did not check, then an **explain-back** of about 40 words: one number you would defend and one check you will do by hand from now on. With no AI, log your three riskiest steps the same way. The row below is invented, in another domain.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| A README that says a table "is updated in real time" | read the schedule of the job that builds it (check 4, confirm in the source) | revise | it is rebuilt once a night; the README now says so |

## Rubric

Eight items, each scored 2 (full), 1 (partial) or 0 (none): 16 in all. The rubric grades the chain from the question to the decision, and it is the same for both halves.

**1. Question and decision.**

- **Full:** a context pack with its four parts in order; what "better" means, in one line; the number that would make you ship, written before the evaluation.
- **Partial:** a pack with no bar, or a bar written after the results.
- **None:** no pack.

**2. The system behind an endpoint.**

- **Full:** a request checked at the door (422 for a bad one); a health check that gives 503 when the system is not loaded; a real request answered; one test through the interface; and every file or model loaded with only the types you reviewed.
- **Partial:** an endpoint that answers but has no health check or no test.
- **None:** a script or a notebook, with no endpoint.

**3. Baseline and held-out data.**

- **Full:** a named baseline scored on the same held-out data; the count of held-out people or questions; nothing chosen with them; and a sentence on why they were not seen in training.
- **Partial:** a baseline scored on other data, or held-out data used to pick a setting and then reported.
- **None:** no baseline, or a score on the data the system learned from.

**4. The measure.**

- **Full:** the gain with a paired 95 percent interval from 2,000 resamples of the same people or questions, both sides scored by one grader; "tie" said when it includes 0; and, when it does not, the size of the gain in the units of the decision.
- **Partial:** a gain with no interval, an interval from separate resamples, or a gain that sets two graders against each other.
- **None:** a score with nothing beside it.

**5. A failure slice.**

- **Full:** a named group, its count, the system's score in it and for everyone, and one thing you would do about it.
- **Partial:** a group without the comparison, or without a count.
- **None:** no slice.

**6. Cost line.**

- **Full:** milliseconds and dollars for 1,000 requests measured through the service; the idle cost with its price named as an assumption; a line on what was not measured.
- **Partial:** one of them missing.
- **None:** "it is cheap".

**7. Ship or no-ship memo.**

- **Full:** at most 200 words; the decision; the evidence with its interval; what would change it; the way back or the switch-off; the bar of item 1 compared with the result.
- **Partial:** a decision and a reason with no bar, or no way back.
- **None:** a decision with no evidence, or one the numbers do not support.

**8. AI log, explain-back and reflection.**

- **Full:** a row for every AI output used, each with output, checks (by number or name), verdict and reason; at least one revise or reject, or a sentence on why none; your name and what you did not check; an explain-back that names one number and one check; and a score for each item above, with the minutes you spent.
- **Partial:** a log with verdicts but no reasons or no named checks, or an explain-back that could describe any project.
- **None:** no log, or a list of prompts with no checks.

A total of 13 or more is strong. From 8 to 12 is solid with gaps: redo the items that scored 0 or 1. Below 8, make the endpoint answer one real request before you write anything else.

## Reference answer

Do the work first. The reference gives a full answer for each half, a graded log for each, and the shortcuts an AI assistant is likely to take on this data.

<details>
<summary>Open only after you finish</summary>

The numbers of half A come from runs on 2026-11-25 with Python 3.13.18, scikit-learn 1.9.1, pandas 3.0.5, NumPy 2.5.3 and the starter of `mle-16-done`; the numbers of half B come from runs on 2026-11-26 with Python 3.13.18, transformers 5.24.1, sentence-transformers 6.3.0 (the library that loads the text encoder) and PyTorch 2.15.0 (CPU) in the folder `llm/` of `mle-16-done`. The code is in `mle-16-done`: `git show mle-16-done:reference/capstone_classical.py` for half A, and the folder `llm/reference/` for half B.

### Half A: version 2 against version 1

**A context pack, in order.** The schema (the ten columns and `churned`); the grain (one row is one person at day 7); three real rows (the first three of `data/churn_table.csv`); a dictionary (`churned` is 1 when the person has no `session_start` and no `add_expense` from day 8 to day 30). Better means: a higher AUC on people neither version learned from, at the same cost. **The bar, written first:** ship version 2 if its AUC gain has an interval above 0 and it costs the same to serve.

```console
$ uv run python reference/capstone_classical.py
version 1 learned from 5,622 people, version 2 from 14,328; scored on 3,488 people of May 11 to 31, 0.609 churned
version 1: AUC 0.719, Brier 0.2053, mean chance 0.589
version 2: AUC 0.722, Brier 0.2041, mean chance 0.598
against the gate's floor of 0.68 (the rollback trigger), on these people: version 1 +0.039, version 2 +0.042
AUC gain of version 2: +0.0032 (95% interval +0.0010 to +0.0056, 2,000 resamples of the people, seed 2026)
Brier score drop of version 2: +0.0012 (95% interval +0.0006 to +0.0018)
  week of 2026-05-11: 1,145 people, AUC version 1 0.727, version 2 0.733
  week of 2026-05-18: 1,188 people, AUC version 1 0.697, version 2 0.699
  week of 2026-05-25: 1,155 people, AUC version 1 0.732, version 2 0.734
by channel (mean chance against the share that churned):
  app_store      584 people, churned 0.548, mean chance 0.513 then 0.525, AUC 0.649 then 0.653
  organic_search 683 people, churned 0.482, mean chance 0.489 then 0.477, AUC 0.584 then 0.589
  paid_search    375 people, churned 0.584, mean chance 0.572 then 0.567, AUC 0.595 then 0.607
  paid_social    1,384 people, churned 0.793, mean chance 0.758 then 0.782, AUC 0.575 then 0.588
  referral       462 people, churned 0.340, mean chance 0.340 then 0.342, AUC 0.655 then 0.653
largest PSI of those people: 0.538 on channel against version 1's people, 0.238 on channel against version 2's
the champion of MLE3 learned from 2,593 of the 3,488 people of May 11 to 31; its AUC on them is 0.724
```

Version 2 scores 0.722 against 0.719, a gain of +0.0032 whose interval, from 2,000 resamples of the same 3,488 people for both versions, is +0.0010 to +0.0056. It excludes 0, so this is not a tie; it is small: three thousandths of an AUC. The Brier score drops by 0.0012 (+0.0006 to +0.0018), and version 2 has the better AUC in each of the three weeks. The failure slice is `paid_social`: 1,384 people, 0.793 of whom churned, and the model's AUC inside the channel is 0.588 (0.575 for version 1) against 0.722 for everyone. Inside the channel the ranking is weak, and version 1's mean chance, 0.758, is 3.5 points under what happened, where version 2's, 0.782, is 1.1 under. The drift check: against the people version 1 learned from, the largest PSI of these people is 0.538 on `channel`; against version 2's people it is 0.238, still over the 0.1 alert of MLE14, because the campaign weeks are only a part of what version 2 learned from. Retraining moves the reference, and it did not end the alert.

```console
$ uv run python reference/capstone_classical.py --serve
wrote model/v2.skops
$ curl -s -w "\nstatus %{http_code}\n" localhost:8030/predict -H "content-type: application/json" -d @scripts/person.json
{"churn_chance":0.3004693969442222,"model_version":"v2"}
status 200
$ sed "s/europe/africa/" scripts/person.json | curl -s -w "\nstatus %{http_code}\n" localhost:8030/predict -H "content-type: application/json" -d @-
{"detail":[{"type":"literal_error","loc":["body","region"],"msg":"Input should be 'asia_pacific', 'europe', 'latin_america' or 'north_america'","input":"africa","ctx":{"expected":"'asia_pacific', 'europe', 'latin_america' or 'north_america'"}}]}
status 422
```

The service answers the person of `scripts/person.json` with `model_version` v2 and refuses the `africa` request with 422. `uv run pytest -q` passes at the repository's commit, but its gate trains from the code, so it says nothing about `model/v2.skops`. What guards version 2 is its own AUC on the 3,488 people of May 11 to 31: 0.722, which is 0.042 above the 0.68 floor (version 1: 0.719, 0.039 above). Under 0.68 on labeled people is the rollback trigger of `docs/rollback_plan.md`, so version 2 would go back.

```console
$ MODEL_FILE=model/v2.skops REQUEST_LOG=logs/v2.jsonl uv run python scripts/compare_service.py
200 people, model version v2
largest difference between served and offline chance: 1.1e-16
people whose two chances are not equal to the last digit: 9
$ uv run python -m ml_starter.monitor summary logs/v2.jsonl
200 requests, model version v2
latency: median 4.20 ms, 95th percentile 7.30 ms
compute: $0.000026 in all, $0.000132 for 1,000 requests (at $0.10 an hour, an assumption)
```

Rule 37 says that a model applied to an example in the training data and to the same example at serving "should give you exactly the same result"; here the largest difference between the served and the offline chance is 1.1e-16, which is rounding. Version 2 costs what version 1 does: the same pipeline, a model file of the same size (111,493 bytes, the size of version 1's file), and a median of 4.12 ms (3.83 to 6.58) for one request over seven runs, as MLE14 measured for version 1 (4.41 ms, 4.09 to 4.57). At the assumed $0.10 an hour the machine costs $73 for a month standing idle, whichever version it serves. Not measured: memory, a busier service, the time to retrain.

> **Ship version 2, behind the gate, with version 1 as the way back.** Its AUC is higher by 0.0032 (interval +0.0010 to +0.0056) on 3,488 people neither version saw, in each of the three weeks, at the same cost, and 0.042 above the 0.68 floor that would send it back; I set the bar "interval above 0 and the same cost" before I ran it, and it clears it. The gain is small, so there is no urgency, and it does not fix `paid_social`, where the ranking is weak (AUC 0.588): that is a data question, not a retraining one. The drift alert (PSI 0.238) will keep firing against version 2's reference and should be re-set rather than read. What would change this: a gain whose interval includes 0 on the next three weeks. The way back: `uv run python -m ml_starter.rollback back`, then restart, as in `docs/rollback_plan.md`, which now names version 2.

It is about 150 words, scoring 2 on item 7.

**A graded log.** The rows are illustrations written for the lesson, in the style of an assistant; the checks are the runs above.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| "Use the registered champion as version 1; it is already trained" | counted how many of the 3,488 held-out people it learned from: 2,593 (check 2, count rows) | reject | it learned from three quarters of them; version 1 is the model that learned before March 2 |
| "The gain is not significant, so keep version 1" | read the interval: +0.0010 to +0.0056, which excludes 0 (check 3, a second way) | revise | the gain is real and small; the decision rests on its size and cost, and the memo says both |
| "Drift against version 2 is gone after retraining" | wrote down the PSI the claim implies (under 0.1), then ran `feature_psi` against version 2's people: 0.238 on `channel` (check 1, predict first) | revise | it fell from 0.538 and is still over the alert level |
| "1,000 requests cost $0.0001, so serving is free" | read the idle cost of the machine: $73 a month at the assumed price (check 3, reconcile with the hours) | revise | the log counts the seconds the model works, not the hours the machine runs |

*Signed: your name, the date. Not checked: other retraining dates, the memory of the service.* **Explain-back:** *The number I defend is +0.0032, the AUC gain with its interval above 0; the check I will keep is counting how many held-out people a model learned from.* It scores 2 on item 8 with the self-score and the minutes.

### Half B: the answerer behind `/ask`

**A context pack, in order.** The corpus (eight published SQL lessons, 220 paragraphs, cut into chunks of at most 120 words); the grain (one item is one chunk; one request is one question); three real chunks; a dictionary (the system refuses when the best chunk has a cosine under 0.40, and otherwise answers in JSON with the numbers of the sources it used). Better means: more of the questions the lessons answer are answered correctly, and nothing is invented for the ones they do not answer. **The bar, written first:** ship if at least 10 of the 12 answerable questions are answered correctly and all 4 others are refused.

```console
$ uv run python -m pytest -q -p no:cacheprovider reference/test_serve_llm.py
....                                                                     [100%]
4 passed in 0.28s
```

The service is `llm/reference/serve_llm.py`: a `Question` model (3 to 300 characters, no other field), `/health` with a 503 until the system is loaded, `/ask` that returns the answer, whether it refused, the cited chunks with their text, the tokens and the seconds, and a test that passes a stand-in for the system, so no model is loaded. The real one was ready 7.6 seconds after it started here, the models being on disk already, and answered the SEMI and ANTI JOIN question and refused the empty question:

```console
$ curl -s -w "\nstatus %{http_code}\n" localhost:8020/health
{"status":"ok"}
status 200
$ curl -s -w "\nstatus %{http_code}\n" localhost:8020/ask -H "content-type: application/json" -d "{\"question\": \"What do SEMI JOIN and ANTI JOIN return in DuckDB?\"}"
{"answer":"In DuckDB, SEMI JOIN returns the left rows with at least one match, while ANTI JOIN returns the left rows with no match.","refused":false,"sources":[{"lesson":"left-join-anti-join","section":"2. Find the rows with no partner","text":"DuckDB can also write it directly: ANTI JOIN gives the left rows with no match, and SEMI JOIN the left rows with at least one. Neither returns more rows than the left table has. Try it: the anti-join with LEFT JOIN and IS NULL. Expected: 3 columns. Why: 5 rows: customers 140, 147, 148, 149 and 150, who all signed up between June 10 and June 26. That answers the first question. Try it: a second route, with ANTI JOIN. Expected: 1 column, the same customers as the LEFT JOIN query above. Why: the same list, with no NULL test to write."},{"lesson":"left-join-anti-join","section":"5. Check the numbers","text":"Common trap: \"NOT IN is just another way to write an anti join.\" DuckDB's page says an anti join has the logic of NOT IN, except that it ignores NULL values from the right table. That exception matters here: the customer ids of orders include a NULL (the walk-in order 1335, from a customer without a loyalty card), and a comparison with NULL is never true, so a NOT IN over those ids gives wrong results, although some customers never ordered. Subqueries and EXISTS (S24) goes further."}],"prompt_tokens":432,"completion_tokens":42,"seconds":19.523499753999204}
status 200
$ curl -s -w "\nstatus %{http_code}\n" localhost:8020/ask -H "content-type: application/json" -d "{\"question\": \"\"}"
{"detail":[{"type":"string_too_short","loc":["body","question"],"msg":"String should have at least 3 characters","input":"","ctx":{"min_length":3}}]}
status 422
```

```console
$ uv run python -m reference.evaluate
12 questions the corpus answers, 4 it does not
answers that match every pattern: 10 of 12; with a cited source that holds the phrase: 9
baseline, the best chunk holds the phrase: 5 of 12
answerer minus baseline, both by 'a source shown holds the phrase': +4 of 12 questions (95% interval +1.0 to +7.0, 2,000 resamples of the questions, seed 2026)
traps refused: 4 of 4, 4 of them before the model was called
  near refused: How do I add a column to an existing table?
  near refused: How do I concatenate two text columns?
  far  refused: How many people live in Canada?
  far  refused: How do I train a random forest?
failures among the questions the corpus answers:
  [null-handling] Can an IS NULL test itself come out as NULL? -> 'Yes, an IS NULL test can itself come out as NULL if the value being tested is NULL.'
  [inner-join] What does a CROSS JOIN return? -> 'A CROSS JOIN returns all possible combinations of rows from two tables, resulting in a Cartesian product.'
12 of 16 requests called the model: 448 prompt tokens and 38 completion tokens on average, median 18.6 s, $0.640 for 1,000 answers at the assumed prices
```

Lines of progress bars from the model loader, printed in the run, are left out of the block. A second run printed the same text, with a median of 17.8 s in place of 18.6 s: the answers do not change from run to run, the seconds do. Ten of the 12 answers match every pattern (the grader of the bar of 10), and 9 have a cited source that holds the phrase. The baseline, which calls no model and shows the best chunk, holds the phrase for 5 of the 12. The paired gain uses one grader for both sides, "a source the system shows holds the phrase": the answerer's cited source, 9 of 12, against the baseline's best chunk, 5 of 12, a gain of +4 questions, with an interval of +1.0 to +7.0 from 2,000 resamples of the same 12 questions (seed 2026). The interval excludes 0, so this is not a tie; it is wide, because 12 questions cannot place the gain closer than from 1 question to 7. All 4 questions the lessons cannot answer were refused, and all 4 by the threshold, before the model was called: the model's own refusal was never exercised.

**The failure slice.** Each lesson has one or two questions, too few to judge a lesson, so the slice is the shape of the failures. Two answers failed the patterns. `IS NULL` got "Yes, an IS NULL test can itself come out as NULL if the value being tested is NULL", which is wrong: the lesson says IS NULL and IS NOT NULL answer true or false, never NULL. The CROSS JOIN question got "A CROSS JOIN returns all possible combinations of rows from two tables, resulting in a Cartesian product", which is correct and fails the pattern (`every (possible )?pair`, `every row with every row` or `all (possible )?pairs`: "combinations" is none of them), so the grader, not the system, missed it: counting it correct gives 11 of 12, and the memo names that change instead of making it. One wrong answer in 12 is too few to name a pattern in the failures. What to do: a second pass that checks the answer against its cited chunk (MLE9), tried on the development questions and not on these 16.

**The cost line.** The 12 requests that called the model used 448 prompt tokens and 38 completion tokens on average, and the median took 18.6 s: $0.640 for 1,000 answers at the assumed $1.00 and $5.00 per million tokens. One process at 18.6 s an answer serves about 194 answers an hour (3,600 divided by 18.6). The refusals cost nothing and took no time. The models need about 10 GB of memory at the peak (10,007 MB and 9,966 MB in two runs) and 3.4 GB of disk, and one language-model process at a time. Standing idle on a machine of that size is a cost that is not measured here: the price of such a machine is not in this lesson. Not measured: a busier service, a GPU, another machine.

> **Ship it for the help widget as a trial, with the best paragraph as the way back.** 10 of the 12 questions the lessons answer are answered correctly, which equals the bar of 10 that I set before running, and one of the two misses is the grader's (11 of 12 if it is counted). Scored the same way for both (a source shown holds the phrase), it is 9 of 12 against 5 for showing the best paragraph: +4 questions, interval +1.0 to +7.0 on 2,000 resamples of the same 12 questions, so not a tie, and wide. All 4 questions it cannot answer are refused, but by the threshold alone. It takes 18.6 s and $0.64 per 1,000 answers at the assumed prices: slow for a widget, so it starts with a small share of the questions. What would change this: fewer than 10 of 12 on a new set, or an answer time the widget cannot wait for. The way back is the switch-off: the service answers 503 until the system is loaded, and the widget falls back to the best paragraph with its source, which needs no model.

It is about 190 words, scoring 2 on item 7.

**A graded log.** The rows are illustrations written for the lesson, in the style of an assistant; the checks are the runs above.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| "The model refuses what it does not know: 4 of 4 traps refused" | counted the four refused replies with prompt tokens above 0: none, so no model call (check 2, count) | revise | the threshold refused them; the model's refusal was not tested |
| "Cross join answered correctly, so count it: 11 of 12" | read the answer against the pattern: correct in substance, the pattern asks for "every pair" (check 5, decide) | revise | report 10 of 12 and name the 11th; the pattern was written before the run and is not edited after |
| "The answerer is twice as good as retrieval: 10 against 5" | scored both with one grader, a source shown holds the phrase: 9 against 5, +4, interval +1.0 to +7.0 (check 3, a second way) | revise | the 10 sets patterns against 5 phrases; on one grader the gain is real and is 4 questions, not 5, with a wide interval |
| "Use `model.generate(**inputs)`; the defaults are fine" | read `generation_config.json` of the model repository: it holds only token ids, no sampling settings (check 4, confirm in the source) | revise | true for this file today, but `rag.py` passes `do_sample=False` and its own settings, so that another revision or model cannot change the answers |

*Signed: your name, the date. Not checked: other chunk sizes, other thresholds, another model.* **Explain-back:** *The number I defend is 10 of 12 against a bar of 10, and +4 questions (interval +1.0 to +7.0) over the best paragraph; the check I will keep is reading the token counts to see whether the model was called at all.* It scores 2 on item 8 with the self-score and the minutes.

### The author knew you would use AI

The author of this case knew you would use AI, so this is the answer key for the places where a shortcut an assistant may take can fail on this data. The author planted nothing: each trap is in the files as published, and each has a check that catches it. These are shortcuts an assistant may take, not a report on any one assistant.

**Half A.**

1. **The registered champion as the old model.** It is the model that is already served and already trained, so an assistant offers it as version 1. It learned from 2,593 of the 3,488 held-out people, and its AUC on them is 0.724, above version 2's 0.722: a comparison with it says version 2 is worse, where the clean comparison says it is better by 0.0032. *Check:* count how many held-out people each model learned from (C38, check 2).
2. **"Not significant" read from a small gain.** The gain is small and its interval excludes 0. Calling it a tie, or calling it a win with no size, are both wrong. *Check:* read the interval and the units of the decision (C38, check 3).
3. **The drift reference.** Against version 1's people the PSI of these people is 0.538, against version 2's 0.238. An assistant that reuses `REPLAY_START` reports the first for version 2. *Check:* write down the people the model learned from, and the PSI you expect, before you compute it (C38, check 1).
4. **The seconds of the log as the cost.** The log's $0.0001 for 1,000 requests leaves out the machine, which costs $73 a month idle at the assumed price. *Check:* multiply the hours the service runs by the price (C38, check 3).
5. **Labels that are not there yet.** The case is dated July 1 on purpose: the last week's outcomes are all known on June 30. An assistant told it is June 15 would score weeks whose people have not had their 30 days. *Check:* the `labels_ready` column of the weekly report (MLE14).

**Half B.**

1. **Counting refusals as the model's.** All 4 questions the lessons cannot answer were refused by the threshold, with 0 tokens. An assistant may report "the model refuses what it does not know". *Check:* count the refusals with prompt tokens above 0 (C38, check 2).
2. **Editing the grader after the run.** The CROSS JOIN answer is right and fails its pattern. Loosening the pattern gives 11 of 12 and tunes the grader to the held-out questions. *Check:* write the patterns before the run and name any change in the report (C38, check 5).
3. **Two graders, and a gain on 12 questions.** "Twice as good as retrieval" is 10 against 5: the answerer scored by its patterns, the baseline by whether its best chunk holds the phrase. On one grader (a source shown holds the phrase) it is 9 against 5, +4 questions, with an interval of +1.0 to +7.0: a real gain, and a wide one. *Check:* score both sides with the same grader, then take the paired interval over the same questions (C38, check 3).
4. **The defaults of the model repository.** A model repository can ship a `generation_config.json` that sets sampling, and then a bare `generate` call gives another answer each run; the file of this model holds only token ids, and the answerer still passes every setting. *Check:* pass every setting and run the same question twice.
5. **Cost as tokens only.** $0.640 for 1,000 answers leaves out the 18.6 s an answer, which is about 194 answers an hour for one process on this CPU, and the idle machine. *Check:* divide 3,600 by the median seconds (C38, check 3).
6. **Loading the models for each request.** The service loads them once, in its startup (7.6 seconds here); a handler that builds the system per request would repeat that on every question. *Check:* the lifespan of the service (MLE13).

**What a strong submission does differently.** It writes the bar before it runs, uses held-out data once, reports every interval including the ones that include 0, names the slice where the system is weak, prices the idle hours and not only the seconds, and shows at least one AI row that was revised or rejected, with the reason.

</details>

That is the end of the ML Engineer main path. The optional deep dive that follows starts with *Convolutional networks and images* (MLE20).

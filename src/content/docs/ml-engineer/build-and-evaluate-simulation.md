---
id: ml-engineer-build-and-evaluate-simulation
title: 'Simulation: build and evaluate in a time box'
short_title: Build and evaluate
description: "Build and evaluate a ranking model in 90 minutes: baselines, an interval, a failure slice and a cost line, scored by the rubric printed in the lesson."
stage: ml-engineer
order: 150
level: advanced
duration: 90
objectives:
  - Scope a build to a stated time box and say what you will not do
  - Deliver a working model with baselines, served by the starter's service
  - Write an evaluation note with a failure slice and a cost line
  - Score your own submission against the printed rubric
prerequisites:
  - ml-engineer-llm-and-rag-evaluation
  - ml-engineer-serving-a-model-api
  - ml-engineer-monitoring-drift-and-retraining
datasets:
  - app-events
reviewed: 2026-11-25
sources:
  - title: 'scikit-learn documentation: Pipelines and composite estimators (accessed 2026-11-25)'
    url: https://scikit-learn.org/stable/modules/compose.html
  - title: 'scikit-learn documentation: HistGradientBoostingClassifier (accessed 2026-11-25)'
    url: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingClassifier.html
status: draft
---

TODO(owner): Draft for your edit. Run on Linux with Python 3.13.18, uv 0.11.32, scikit-learn 1.9.1, pandas 3.0.5, NumPy 2.5.3, skops 0.16.0 and the starter at `mle-15-start`; every console block is pasted from a run in a clean clone, and the file and request counts are exact. Invented: Priya Nair and her request. The decision (phone the top quarter, 1,113 of the 4,454 held-out people) and the measure (hits) are this lesson's own, so no answer of lessons MLE1 to MLE14 repeats. Seed check: on 20 other splits (seeds 100 to 119) the random forest's gain over the champion at the top quarter had a median of +0.004 and a range of -0.005 to +0.013, above 0 in 16, and the champion's web AUC was below its android AUC every time (median -0.062); the headline split (+0.004, interval -0.011 to +0.015) sits at the middle. Timings: seven runs of the 200 requests gave a median latency of 10.83 ms (10.59 to 11.62) for the forest and 4.41 ms (4.03 to 4.64) for the champion, on a machine that another job was using; the run shown is slower for both. The 90 minutes are the sum of the time plan, and the reference was not timed. Not run: Colab, Windows, macOS, a different CPU. Stub changes: objective 2 now says "a working model with baselines, served by the starter's service" (the stub said "a working model or RAG answerer"; the language-model route is graded in the capstone under the same rubric, because a 6 GB model would take most of a 90-minute box to load and run); the prerequisite `ml-engineer-monitoring-drift-and-retraining` was added (the cost line and the gate come from it); the source list now holds the two scikit-learn pages the lesson uses. The reference answer's refusal of the forest file by skops (`sklearn.tree._tree.Tree`) is a real message of skops 0.16.0.

## The question

Priya Nair, head of growth at the budgeting app, writes: *Support can phone one in four of the people who have just finished their first week. I have to decide whom they call, and I do not want to find out in a month that my list was no better than the rule we use today. Build me a ranking. Tell me how much better it is than that rule and than the model we already serve, where it does worse, and what it costs to run.* Priya and her request are invented; the data are the synthetic `app-events` people of the churn table.

You have 90 minutes, and the rubric is below, so you can read it now. There is no single right model: a result that is reported as a tie earns full marks, and a gain that is not shown to be real earns none.

## Warm-up

From memory first, then click to check.

1. In [*Evaluating LLM and RAG systems*](/ml-engineer/llm-and-rag-evaluation/) (MLE10), what did you write when the paired interval of a difference included 0?

   <details>
   <summary>answer</summary>

   That the two ties: the data do not show that either is better. The difference is reported with its interval, and the choice is made on something else, such as cost or simplicity.

   </details>

2. In *Monitoring, drift and retraining* (MLE14), which two columns of the request log give the speed and the compute cost of a request?

   <details>
   <summary>answer</summary>

   `latency_ms` and `cost_usd`. `uv run python -m ml_starter.monitor summary LOG` prints the median and the 95th percentile of the first and the cost for 1,000 requests from the second.

   </details>

## How this simulation works

**Time.** 90 minutes: the scope note 8; the baselines 12; the candidate 20; the evaluation 20 (the numbers 10, the failure slice 10); serving and the cost line 12; the recommendation 5; the AI log 3 (write each row as you use an output); scoring yourself 10. Use a timer, not this page.

**Tools.** Your own `ml-starter`, as it was left by MLE14 (`git checkout mle-15-start` to catch up), and `uv run`. Nothing has to be fetched. The reference answer is the folder `reference/` of the tag `mle-15-done`: do not open it until you have scored yourself.

**AI.** Allowed, as at work. Start from a context pack as in [*Prompting with the data in the room*](/core/prompting-with-the-data-in-the-room/) (C37), run the five checks of [*Trust, but verify: checking AI output*](/core/trust-but-verify-ai-output/) (C38) on every output, and log a verdict for each, in the format of [*RAG and agents: what they are and how to judge them*](/core/ai-literacy-rag-and-agents/) (C43). The capstone grades the log at length; here it is one rubric item.

**Who marks it.** This site stores nothing and has no accounts: mark yourself with the rubric, or ask a mentor.

**Stop rules.** At 70:00 stop building and start writing. At 80:00 stop writing and start scoring.

## The brief

**The data and the decision.** The churn table and its split: `X_train, X_test, y_train, y_test = split(load_table())` gives 13,362 people to learn from and 4,454 held-out people. Support phones one person in four, so the decision is the **top quarter**: the 1,113 held-out people your model ranks highest. The measure is **hits**, how many of those 1,113 really churned (`churned` is 1). The held-out people are scored once, at the end of your build, and never used to choose a setting.

**Hand in six things,** each as short as honesty allows:

1. A **scope note**, at most 100 words, written before you build: the decision, what you will build in the time, three things you will not do, and the minutes for each part.
2. **Two baselines**, scored on the held-out people: the flat guess, and one stronger one, either the model already served (`build_pipeline(0.1)`, the champion of MLE3) or a rule of your own.
3. A **candidate**: a model of your choice, learned from the 13,362 people only, saved with `save_model(pipeline, {"version": "candidate"}, "model/candidate.skops")` from `ml_starter.export`, that the service loads (`MODEL_FILE=model/candidate.skops`), answers one request with status 200 and refuses a bad one with 422.
4. An **evaluation note**, at most 200 words: the hits of each model; the gain of your candidate over the best baseline, in hits out of 1,113, with a 95 percent interval from 2,000 resamples of the held-out people, the same people for both models, seed 2026; one failure slice, a group of people where the candidate does worst, with its count and the same number for everyone; and what you would tell Priya.
5. A **cost line**: send 200 held-out people through the service for the candidate and for the champion with `scripts/compare_service.py`, set `REQUEST_LOG` to a file of its own each time, read each log with `monitor summary`, add the monthly cost of the machine standing idle at the assumed $0.10 an hour, and say what you did not measure.
6. An **AI log**: the context pack, then one row for every AI output you used, with your name, the date and what you did not check. With no AI, log your three riskiest steps the same way. The row below is invented, in another domain.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| A query that joins the orders to the customers and sums the totals | counted the rows before and after the join (check 2, count rows) | revise | each order appeared twice; I grouped before joining |

## Rubric

Eight items, each scored 2 (full), 1 (partial) or 0 (none): 16 in all. The rubric grades the chain from question to recommendation: any model that your reasoning supports can score 16.

**1. Scope and time box.**

- **Full:** a note written before the build, with the decision, what is built, at least three things left out, and minutes for every part; the stop rules kept.
- **Partial:** a scope without things left out, or without minutes.
- **None:** no scope, or a scope written after the results.

**2. Baselines.**

- **Full:** at least two, one of them stronger than the flat guess, scored with the same measure on the same held-out people.
- **Partial:** one baseline, or two scored on different people.
- **None:** no baseline.

**3. A candidate that works.**

- **Full:** learned from the 13,362 people only; saved to `model/candidate.skops`; loaded by the service, with a 200 for a valid request and a 422 for a bad one shown; its held-out AUC stated and at least 0.68, the floor of the quality gate.
- **Partial:** a model that runs in a script but not in the service, or a candidate under the floor with no word on it.
- **None:** no working model.

**4. The measure.**

- **Full:** hits defined as a count out of 1,113; every model scored on the same held-out people, once; the gain over the best baseline with a paired 95 percent interval from 2,000 resamples; the word "tie" when the interval includes 0.
- **Partial:** hits without an interval, or an interval from different resamples for the two models.
- **None:** a score with no baseline beside it, or a setting chosen on the held-out people.

**5. A failure slice.**

- **Full:** a named group, its count, the candidate's score in it and the same score for everyone, and one thing you would do about it.
- **Partial:** a group without the comparison, or without a count.
- **None:** no slice, or a slice chosen because the number looked good.

**6. Cost line.**

- **Full:** milliseconds and dollars for 1,000 requests measured through the service for both models; the monthly idle cost with its price named as an assumption; a line on what was not measured.
- **Partial:** one model measured, or numbers with no stated source.
- **None:** "it is cheap".

**7. Recommendation.**

- **Full:** ship, do not ship or ship the baseline, in one sentence; the evidence for it, with the interval; what would change it; and the way back if it ships.
- **Partial:** a decision and a reason, with no interval or no way back.
- **None:** a decision with no evidence, or a recommendation the numbers do not support.

**8. AI log and self-score.**

- **Full:** a context pack in order; a row for every AI output used, each with output, checks (by number or name), verdict and reason; at least one revise or reject, or a sentence on why none; your name, the date and what you did not check; and a score for each item above, with the minutes you spent.
- **Partial:** a log with verdicts but no reasons or no named checks, or no self-score.
- **None:** no log, or a list of prompts with no checks.

A total of 13 or more is ready to show. From 8 to 12, redo the items that scored 0 or 1. Below 8, redo the candidate and the measure before the rest.

## Reference answer

Do the work first. The reference gives the numbers of one run, an answer that earns full marks, and what changes if you chose differently.

<details>
<summary>Open only after you finish</summary>

Every number comes from runs on 2026-11-25 with Python 3.13.18, scikit-learn 1.9.1, pandas 3.0.5, NumPy 2.5.3 and skops 0.16.0. The code is the file `reference/mle15_reference.py` of the tag `mle-15-done`: `git show mle-15-done:reference/mle15_reference.py > reference/mle15_reference.py`. It writes `model/candidate.skops`.

### A scope note that earns full marks

> **Decision.** Which quarter of the people who finish week 1 support should phone. **Build.** Two baselines, one candidate, one comparison on the 1,113 top-ranked of the 4,454 held-out people, one slice, one cost line. **Not doing.** No tuning of the candidate beyond one setting each of two knobs; no new columns; no retraining schedule. **Minutes.** Scope 8, baselines 12, candidate 20, evaluation 20, serving and cost 12, recommendation 5, AI log 3, scoring 10.

### The numbers

```console
$ uv run python reference/mle15_reference.py
4,454 held-out people, 0.544 of them churned; the top quarter is 1,113 people
flat guess (any 1,113 people): 0.544
channel rule  hits 851 of 1,113 = 0.765   AUC 0.661
champion      hits 862 of 1,113 = 0.774   AUC 0.690
candidate     hits 867 of 1,113 = 0.779   AUC 0.686
candidate minus champion: +0.004 (95% interval -0.011 to +0.015, 2,000 resamples, seed 2026)
champion minus channel rule: +0.010 (95% interval -0.004 to +0.024, 2,000 resamples, seed 2026)
candidate minus channel rule: +0.014 (95% interval -0.003 to +0.028, 2,000 resamples, seed 2026)
by platform (AUC of each score, within the platform):
  android  1,425 people, 0.615 churned, AUC champion 0.701, candidate 0.702
  ios      1,642 people, 0.557 churned, AUC champion 0.693, candidate 0.690
  web      1,387 people, 0.457 churned, AUC champion 0.632, candidate 0.626
```

The top quarter is 1,113 people. The flat guess is the share of churners, 0.544: any 1,113 people. The stronger baselines are the channel rule (rank people by the churn rate of their channel among the 13,362 learning people), which hits 851, and the champion of MLE3 (`build_pipeline(0.1)`), which hits 862. The candidate is a random forest of 200 trees with at least 20 people in a leaf, on the same ten columns: 867 hits, a held-out AUC of 0.686, above the gate's floor of 0.68.

The gain of the candidate over the champion is 5 hits of 1,113, +0.004, and its interval, from 2,000 resamples of the same 4,454 people for both models, runs from -0.011 to +0.015. It includes 0: **a tie**. Over the channel rule the interval, -0.003 to +0.028, also includes 0. On 20 other splits the gain over the champion had a median of +0.004 and a range of -0.005 to +0.013, above 0 in 16 splits:

```console
$ uv run python reference/mle15_reference.py --seeds
candidate minus champion at the top quarter, 20 splits: median +0.004, range -0.005 to +0.013, above 0 in 16
champion AUC on web minus on android, 20 splits: median -0.062, range -0.092 to -0.039, below 0 in 20
```

So the real gain, if any, is a few tenths of a point, and the 4,454 held-out people cannot show it. This is the track's story again: the columns set the ceiling, not the algorithm.

### The failure slice

The candidate does worst on web: AUC 0.626 on 1,387 people, against 0.702 on android (1,425 people) and 0.690 on ios (1,642 people), and 0.686 for everyone. The champion has the same gap (0.632 on web), and on 20 other splits its web AUC was below its android AUC every time, by a median of 0.062 (0.039 to 0.092): this is not a draw of the seed. Web people churn less (0.457 against 0.615), so a ranking built on week-1 activity separates them less. What to do: do not promise Priya the same lift on web, and ask for a column that web people have (for example, what they did on the web). The slice was chosen by AUC, the metric that covers every person, and not by looking for a number that looked good.

### The service takes the candidate only after a reviewed change

The service loads a model file with the one type it was told to trust. The candidate has another:

```console
$ uv run python reference/mle15_reference.py --checks
1. RandomForestClassifier(n_trees=200): RandomForestClassifier.__init__() got an unexpected keyword argument 'n_trees'
2. precision_score at a chance above 0.5: 0.643 for 2,760 people; hits at the top quarter: 862 of 1,113 = 0.774
3. the service refuses the file: Untrusted types found in the file: ['sklearn.tree._tree.Tree'].
4. candidate minus champion at the top quarter: +0.004, interval -0.011 to +0.015
```

Line 3 is the refusal: skops names `sklearn.tree._tree.Tree` and says why it is not trusted by default: it stores raw node indices that scikit-learn uses without bounds checking, so a malicious file could crash the process or read memory it should not. It also says to add only the types you have reviewed and trust. The file was made by this script in this folder, so one type is added to `TRUSTED_TYPES` in `src/ml_starter/serve.py`:

```diff
-TRUSTED_TYPES = ["sklearn.compose._column_transformer.make_column_selector"]
+TRUSTED_TYPES = ["sklearn.compose._column_transformer.make_column_selector", "sklearn.tree._tree.Tree"]
```

Then the service answers the person of `scripts/person.json` and refuses the `africa` request:

```console
$ curl -s -w "\nstatus %{http_code}\n" localhost:8010/predict -H "content-type: application/json" -d @scripts/person.json
{"churn_chance":0.26820028980125055,"model_version":"candidate"}
status 200
$ sed "s/europe/africa/" scripts/person.json | curl -s -w "\nstatus %{http_code}\n" localhost:8010/predict -H "content-type: application/json" -d @-
{"detail":[{"type":"literal_error","loc":["body","region"],"msg":"Input should be 'asia_pacific', 'europe', 'latin_america' or 'north_america'","input":"africa","ctx":{"expected":"'asia_pacific', 'europe', 'latin_america' or 'north_america'"}}]}
status 422
```

The candidate's 200 chances through the service equal the file's own to the last digit. This earns 2 on item 3: learned from the 13,362 people, saved, loaded by the service, a 200 and a 422 shown, and an AUC of 0.686 stated against the floor.

### The cost line

```console
$ MODEL_FILE=model/candidate.skops REQUEST_LOG=logs/candidate.jsonl uv run python scripts/compare_service.py
200 people, model version candidate
largest difference between served and offline chance: 0.0e+00
people whose two chances are not equal to the last digit: 0
$ uv run python -m ml_starter.monitor summary logs/candidate.jsonl
200 requests, model version candidate
latency: median 12.16 ms, 95th percentile 38.52 ms
compute: $0.000099 in all, $0.000494 for 1,000 requests (at $0.10 an hour, an assumption)
$ MODEL_FILE=model/churn.skops REQUEST_LOG=logs/champion.jsonl uv run python scripts/compare_service.py
200 people, model version 1
largest difference between served and offline chance: 1.1e-16
people whose two chances are not equal to the last digit: 24
$ uv run python -m ml_starter.monitor summary logs/champion.jsonl
200 requests, model version 1
latency: median 4.47 ms, 95th percentile 16.59 ms
compute: $0.000035 in all, $0.000177 for 1,000 requests (at $0.10 an hour, an assumption)
```

The seven earlier runs of the same 200 requests gave a median of 10.83 ms for the candidate (10.59 to 11.62) and 4.41 ms for the champion (4.03 to 4.64); the run shown, made later on a busier machine, is slower for both. The candidate takes about 2.5 times as long for one person. Its file is 11,473,382 bytes and the champion's is 111,521, about 100 times smaller. The compute of 1,000 requests is a few hundredths of a cent for either (the run shown: $0.00049 and $0.00018). The machine is the cost: standing idle at the assumed $0.10 an hour it costs $73 for a month of 730 hours, whichever model it serves. Not measured: memory in use, the time to retrain, a busier service with several requests at once, another machine.

### The recommendation

> **Do not ship the candidate; keep the champion.** Over the champion it hits 5 more of 1,113, +0.004 with an interval of -0.011 to +0.015, which is a tie, and it takes 2.5 times as long and a file 100 times larger. On this measure the channel rule Priya uses today is not worse than either model (the champion's gain over it is +0.010, interval -0.004 to +0.024); the models keep an edge in AUC, 0.690 and 0.686 against 0.661, which is a different measure. Web is the weak spot. What would change this: a gain whose interval excludes 0 on a new split of labeled people. The way back if a model is released: `uv run python -m ml_starter.rollback back` (MLE14).

It scores 2 on item 7: the decision in one sentence, the evidence with its interval, what would change it and the way back.

### A graded AI log

The context pack, in order: the schema (the ten columns and `churned`); the grain (one row is one person at day 7); five real sample rows; a dictionary (`churned` is 1 when the person does not come back from day 8 to day 30). The rows are illustrations written for the lesson, in the style of an assistant; the checks are real runs, and the numbers they print are the ones of line 1, 2, 3 and 4 of the block above.

| AI output | Checks run | Verdict | Reason |
|---|---|---|---|
| `RandomForestClassifier(n_trees=200, min_samples_leaf=20)` | ran it: `TypeError: ... unexpected keyword argument 'n_trees'` (check 4, confirm every name) | revise | the argument is `n_estimators` |
| "Precision at the top quarter is `precision_score(y, chance > 0.5)`" | counted the hits of the top 1,113 by hand: 862, 0.774, against 0.643 for the 2,760 people above 0.5 (check 3, reconcile a second way) | revise | a threshold flags 2,760 people, not the quarter support can phone; rank, take 1,113, count |
| "Load the file with `trusted=get_untrusted_types(file=...)`" | loaded the candidate in the service and read the message: one type, `sklearn.tree._tree.Tree` (check 4, confirm in the source) | revise | trusting everything the file reports defeats the check; trust the one reviewed type |
| "The candidate beats the champion at the top quarter, so ship it" | the paired interval of the gain: +0.004, -0.011 to +0.015 (check 3, a second way: the interval) | reject | the interval includes 0, so it is a tie, and the candidate costs 2.5 times the time |

*Signed: your name, the date. Not checked: other settings of the forest, other slices, the memory the forest needs.*

It scores 2 on item 8 with the self-score of every item and the minutes.

**Scoring the reference with its own rubric.** Item 1: the decision, what is built, three things left out and minutes for every part, written before the build (the stop rules are kept by the clock, not by the text). Item 2: three baselines, one stronger than the flat guess, on the same 4,454 people. Item 3: all 6 parts (learned from the 13,362 people, saved, loaded by the service, a 200 and a 422 shown, the AUC stated, and above 0.68). Item 4: all 4 (hits as a count of 1,113, the same people once, a paired interval from 2,000 resamples, the word "tie"). Item 5: all 5 (a named group, its count, the candidate's AUC in it, everyone's, what to do). Item 6: all 3 (both models through the service, the idle cost with its price named as an assumption, what was not measured). Item 7: all 4. Item 8: all 5. That is 16 of 16.

**Other ways to full marks.** A candidate that loses to the champion, reported as it is. A rule of your own as the stronger baseline. A slice by channel instead of platform, with its counts. A recommendation to ship the candidate, if its interval excludes 0 or a measured need is named, with the way back. What does not earn full marks: a setting chosen by looking at the held-out hits; resamples drawn separately for the two models; "the forest is better" with no interval; a cost line for one model; "it is cheap".

</details>

That is the last practice before the capstone, *Capstone: ship it and prove it works* (MLE16), where you ship a whole system and your log is graded at length.

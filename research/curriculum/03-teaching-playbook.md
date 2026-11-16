# 03 — Teaching Playbook

**Project:** Data From Zero — free, visual-first, bilingual-ready (English root, /vi/ section)
**Path shape:** Excel → SQL (one complete block) → Python → advanced core → five tracks (Data Analyst, Data Engineer, Data Scientist, Analytics Engineer, ML/AI Engineer)
**Purpose:** The single canonical guide for how every lesson on the site is built, exercised, checked, and reviewed. Lesson authors follow this file; they do not invent their own lesson shape.
**How to read labels:** Statements marked **[Sourced]** describe what an opened source page or a prior research file in this package's research record actually says. Statements marked **[Recommendation]** are design choices proposed for Data From Zero — including all timings, pass thresholds, and review intervals — and are not claims about what any platform does or what research proves. Vietnamese-learner judgments carried from the research record as expert inference are marked as curriculum judgment where they appear.
**Canonical ownership (per the Wave 4 dedupe map):** This file owns the lesson template, exercise ladders, and checkpoint design. Visual techniques in full belong to 04-ui-ux-lessons; topic inventories belong to 02-syllabus-inventory; interview-task taxonomies behind the ladders belong to the career material. Where this file summarizes those areas, it does so once and briefly.

---

## 1. The method in one page

Data From Zero is built against four documented failure modes in incumbent data courses:

1. **Tutorial hell / the illusion of competence.** [Sourced — pedagogy research] Learners finish course after course, follow every tutorial successfully, then freeze at a blank file — because the instructor made every decision (structure, names, order, debugging) and the learner practiced executing, not deciding.
2. **The transfer gap.** [Sourced — pedagogy research] Learners complete SQL, Python, or analytics courses, then cannot clean a messy real export, join tables that do not match a tutorial's clean schema, or answer an open-ended business question.
3. **Drop-off from being stuck and from life, not from difficulty.** [Sourced — pedagogy research] Completion research summarized in the research record finds non-completers cite lack of time far ahead of lost motivation or difficulty, and that dropout concentrates in the first two weeks, with speed of early completion predicting finishing better than demographics.
4. **Math anxiety as an avoidance barrier.** [Sourced — pedagogy research] Anxiety about mathematics drives avoidance rather than reflecting inability; platforms that front-load formulas lose learners before the applied version appears.

Ten method stances answer those failures. They are stated here once, as policy; the rest of this file operationalizes them:

1. **Production over recognition.** No fill-in-the-blank exercise is ever a lesson's terminal exercise. Every lesson ends in making something from a blank start.
2. **Fading scaffolding on a published schedule.** Fully worked example → partially completed example → bare problem, inside every topic. The page says the ramp is deliberate, so rising difficulty reads as design, not neglect.
3. **Retrieval practice built into the page.** Every lesson opens with recall prompts from earlier lessons, answered before scrolling, with click-to-reveal answers.
4. **A real spaced-review system on fixed intervals.** Review is scheduled, tracked in the browser only, and can reopen a closed lesson (Section 6).
5. **Visual-first explanations.** Every hard concept gets one canonical visual before any syntax or formula. The diagram is the lesson; text is the caption.
6. **Micro-granularity with early wins — and an honest map of total scope.** Lessons sized to finish in one sitting, a first real result inside the first lesson of every stage, and the whole road and its realistic length shown up front. No "job-ready in weeks" framing.
7. **A project ladder with real, messy data.** Guided project → same skills on a new, messier dataset with minimal guidance → a "your data" variant. Projects are the curriculum's spine, not its dessert.
8. **Graduated help that never leaves a learner stuck.** Hint → half-solution → fully annotated solution, in that order, on every exercise.
9. **Just-in-time, applied math.** No front-loaded math prerequisites. Statistics enters as visual answers to concrete questions; formulas come after the picture, with an optional depth layer.
10. **Honest progress signals instead of certificates and XP economies.** Progress is a self-verifiable ability list and portfolio artifacts — never leaderboards, never XP-for-completion, and any streak-like mechanic must include forgiveness by default.

Underlying learning-science anchors, each [Sourced] from pages opened during the research:

- **Worked-example effect:** novices learn a new procedure faster from a fully worked solution than from unguided problem solving, because unguided search consumes the working memory needed to build the underlying schema. Self-explanation prompts increase the benefit.
- **Fading and expertise reversal:** guidance is withdrawn successively (fading); guidance that helps a novice becomes redundant, and can hinder, as expertise grows. Experienced learners must be able to skip scaffolding without skipping recall checks.
- **Split attention:** forcing a learner to shuttle between a diagram, a separate key, and an explanation in a third place is pure extraneous load. Labels sit on the diagram itself.
- **Retrieval practice and spacing:** being tested and producing answers beats re-studying, and distributed practice beats massed practice. A simple fixed schedule captures most of the benefit of algorithmic scheduling at near-zero complexity.
- **Paired examples — a design choice with mixed evidence.** [Recommendation, with the evidence stated honestly] One research line finds a second, slightly more complex example improves transfer; another finds three examples per problem type did no better than one at teaching learners to sort new problems by type. This playbook keeps paired examples (worked example plus faded example) as a design choice, not as a settled finding.

---

## 2. The canonical lesson template — seven sections

Total target length: **15–20 minutes** for a standard lesson. [Recommendation] Lessons introducing a genuinely new mental model (first join, first groupby, first hypothesis test) may run to 25 minutes [Recommendation]; lessons extending a known pattern should run shorter, not longer. For calibration only: the research record describes incumbent lesson lengths of roughly 10–15 minutes for one video-plus-exercise platform and typically 5–10 minutes for one text-plus-code platform [Sourced]. Those figures describe incumbents; they do not set this site's target.

| # | Section | Time [Recommendation] | Contents | Why it exists |
|---|---|---|---|---|
| 1 | **Recall opener** | 1–2 min | 2–3 prompts drawn from earlier lessons — not only the previous one — answered from memory before scrolling, with click-to-reveal answers. At least one prompt is a *production* prompt ("write the formula / query / line that does X"), never only multiple-choice recognition. | Retrieval practice is the highest-evidence feature a static page can ship. Placing it first also tells the learner honestly what has and has not stuck, before new material covers the gap. |
| 2 | **The job question** | 1 min | One concrete question in business language, with the data visible: a small table, a sheet excerpt, or a chart. No syntax yet. The lesson's promise is stated as the answer the learner will be able to produce by the end. | Hiring tests judgment on business-flavored prompts, not syntax recall. The question also gives the worked example a destination the learner can check each step against. |
| 3 | **One canonical visual** | 2–3 min | A single diagram that *is* the concept: rows being filtered out, two tables aligning on a key, a distribution splitting into two groups, a pipeline box feeding the next box. Labels sit on the diagram itself, not in a separate key or caption block. Syntax, if shown at all, appears as labels on the visual. One visual, not three — a second competing diagram is a split-attention cost, not a bonus. | Visual-first is the open gap against both video-heavy and text-heavy incumbents, and the main antidote to math anxiety: the picture answers the question before a formula can frighten anyone. See Section 7 for the per-domain visual selections. |
| 4 | **Worked example, fully solved, decisions narrated** | 3–4 min | A complete solution to the Section 2 question, step by step. Each step carries two lines: *what* was done, and *why this choice* (why this join type, why this denominator, why this train/test split). The final step is always a verification move: a row count, a spot-check of one row by hand, a total that must reconcile. Ends with one self-explanation prompt — "In your own words, why did step 2 come before step 3?" — answered before the reveal. | Worked examples work when they are self-explanatory, principle-based, and highlight the structural features that decide which procedure to use [Sourced]. The decision narration is the part incumbents most often skip, and it is what hiring actually scores: stating the grain, the definition, and the tie policy out loud. Verification is included from the first lesson so checking is a habit, not an advanced topic. |
| 5 | **Faded example — the learner completes the solution** | 3–4 min | The same problem type with surface features changed (different table, different segment, different numbers). First steps are given; later steps are blank. Which steps are blank rotates across lessons, so the learner cannot learn "the last step is always mine." Three-layer help stack, in order: (a) a hint that names the concept, (b) a half-solution, (c) the fully annotated solution. Using layer (c) is recorded as "needed the solution" — it does not count as a pass (Section 5). | Fading is the researched bridge from studying examples to solving problems [Sourced]. The graduated help order — attempt, specific hint, then full solution — is the feedback pattern successful platforms converge on, and "no support at the moment of struggle" is a documented quit trigger [Sourced — pedagogy research]. |
| 6 | **Blank-start task — the lesson's real test** | 3–5 min | A new prompt, an empty editor / blank sheet / empty notebook cell, and messy-by-design data at the lesson's level: one duplicate, one missing value, one value stored in the wrong type, or one row that breaks the naive approach. The learner also writes the one-line framing the domain requires (Section 3: a grain statement in SQL, a definition sentence in Statistics, an expected-output note in Excel, Python, and DE/ML). No starter code. This task — not Section 5 — is what the lesson counts. | The direct counter to tutorial hell and the transfer gap. The deliberate flaw in the data is deliberate: real hiring data is never clean, and spotting the flaw *is* the test. |
| 7 | **Exit ticket and review scheduling** | 1–2 min | Three items: (a) one recall question on *this* lesson, answered closed-book; (b) one "spot the flaw" item — a short plausible-but-wrong solution to critique; (c) a self-rating against a verifiable ability statement ("I can write a lookup that handles a missing code without leaving an error in the output — test: the Section 6 task"). The page then states this lesson's review schedule (Section 6) and links the mixed review set it will appear in. | Critiquing others' work is a hiring format in its own right and tests understanding in the reverse direction, which production alone does not. The ability statement replaces completion theater with a claim the learner can check. |

### 2.1 Rules that apply to every lesson, in every domain

- **One new idea per lesson.** [Recommendation, grounded in Sourced cognitive-load material] If a lesson needs two new ideas, it is two lessons. Combining a new concept with a new tool feature doubles intrinsic load at exactly the moment the learner has no schema for either.
- **Name the pattern, not just the syntax.** [Recommendation] After the blank-start task, the lesson names the reusable pattern in plain language ("filter, then aggregate, then rank inside each group"), so the learner files the lesson under a *move*, not under a keyword. Interview-prep sources in the research record give the same advice: name the pattern after solving, then re-solve after the data is mutated.
- **Every exercise states its grain, denominator, or expected output shape before the learner starts.** [Recommendation] Silent ambiguity about output shape is the most common cause of "correct work, wrong answer" in the hiring-task research.
- **Worked examples come in pairs for any pattern that must transfer.** [Recommendation — see the mixed-evidence note in Section 1] Section 4 is the first example; Section 5, before fading bites, functions as the second. A lesson whose pattern is known to be confused with a neighboring pattern must instead use Section 4 for a side-by-side contrast pair (see the Statistics and SQL notes in Section 3).
- **The solution is never the first thing on the page.** [Recommendation] Solutions, half-solutions, and reveal answers sit behind an interaction. A page readable top to bottom without producing anything trains reading, not skill — the precise failure documented for video-first formats.
- **Local-environment honesty.** [Recommendation] At least one lesson per block runs in the learner's real environment (their own spreadsheet file, a local database or free playground with their own tables, a notebook they created), not only in the lesson's embedded exercise. A block that never leaves its sandbox reproduces the documented quit point of leaving a guided platform and facing a blank, real file for the first time.
- **A "stuck" protocol on every project page.** [Recommendation] Every exercise and project page carries a short, visible protocol for what to do after a defined period of being stuck: re-read the job question, check the framing line, use the help stack in order, then consult the annotated solution and redo the task from a blank start the next session. Learners quit when stuck, not when busy [Sourced — pedagogy research].


---

## 3. Per-domain anatomy

Each domain keeps the Section 2 template and changes four things: the canonical visual, the worked-example progression across a topic, the exercise ladder, and the framing ritual the blank-start task requires. Ladders have five rungs; all rung designs, progressions, and rituals in this section are [Recommendation] unless marked [Sourced]. Topic coverage itself lives in 02-syllabus-inventory and is not reprinted here.

### 3.1 Excel — spreadsheets first, BI concepts introduced through the sheet

**Canonical visual:** The sheet itself, annotated in place. For formulas: a small grid showing the formula in one cell and the values it becomes when copied down and across, with locked and moving parts in two colors. For PivotTables: the source range on the left and the pivoted result on the right, with arrows from field to area (rows / columns / values / filters). Never a screenshot of a ribbon menu as the "explanation" — menus change between versions; grid behavior does not.

**Worked-example progression — topic: lookups** (the highest-tested Excel skill in the hiring-task research [Sourced]):

1. *Fully worked:* Bring a unit price from a reference sheet into an orders sheet by product code, where every code matches. Narration covers: why exact match is chosen deliberately, which range must stay fixed when the formula is copied, and how the result is verified (spot-check two codes by eye; total the extended amounts and reconcile).
2. *Faded:* Same task on a new file where the setup and first rows are done; the learner writes the lookup for the remaining segment and copies it correctly. One code has no match; the half-solution hint asks what the output *should* show for that row before offering any formula help.
3. *Contrast pair:* Two completed lookups side by side — one that handles the missing code deliberately (a readable "not found" result) and one that leaves a raw error value in the output column — with the prompt "which file would you send to your manager, and what breaks downstream in the other one?"
4. *Blank start:* A messy export (a combined field to split, stray spaces in codes, amounts stored as text) plus a lookup and a summary. The flaw-finding is part of the task, not a surprise after it.

**Exercise ladder:**

| Rung | Task shape | What it proves |
|---|---|---|
| 1 — Predict | Given a formula and a copy direction, write what the formula becomes and what value it returns, without touching the keyboard. Includes relative / absolute / mixed references. | Reference behavior is understood, not memorized — heavily tested in hiring and rarely taught explicitly [Sourced — hiring-task research]. |
| 2 — Complete | A sheet with formulas present except for one column; write that column so it survives copying across the full range. | One correct formula, correctly generalized — the difference between one correct cell and a correct column. |
| 3 — Build | From a tidy list: sort, filter, add live totals and conditional totals; then build a PivotTable and write the one-sentence finding it supports. | Building, not describing. The hiring research lists candidates who can describe a PivotTable but cannot build one on supplied data as a red flag [Sourced]. |
| 4 — Repair | A broken workbook: amounts stored as text (so a pivot shows a count instead of a sum), a lookup returning near-matches, a hard-coded total typed over a formula. Diagnose each fault, fix it, and write one line per fix explaining its effect. | Error literacy and audit skill — reading others' work, not only producing one's own. |
| 5 — Deliver | A timed, end-to-end task on one messy file, scored on accuracy, method (formulas stay live; no typed-over totals), and clarity (labeled outputs, nothing stray left in the file). | The hiring simulation itself, scored on the three-criterion rubric from the hiring-task research [Sourced]. This rung is the Excel block's exit checkpoint (Section 5). |

**Framing ritual:** Before entering any formula, the learner writes the expected output in words: "one row per order, a price on every row, and a visible flag — not an error — where the code has no price." [Recommendation]

**Domain cautions:** Teach one lookup approach as the default and name legacy alternatives only for recognition, so beginners do not split attention across equivalent methods in one lesson. [Recommendation] Every cleaning lesson keeps the raw data untouched on its own sheet; destroying the source is scored as an error, not a style choice.

### 3.2 SQL — one complete block, organized by pattern in its second half

**Canonical visual:** A row-flow diagram. Source tables are drawn as row stacks; each clause of the query is a gate the rows pass through — rows drop out at the filter gate, rows merge into group buckets at the aggregation gate, buckets are labeled with their computed values, then sorted. The lesson on query execution order uses this same diagram, so the visual and the execution model are one object, not two.

**Worked-example progression — topic: top-N per group:**

1. *Fully worked:* "Top product by revenue in each category." Narration in fixed order: state the grain first (one row per category), aggregate to one row per product, rank products inside each category, keep the top rank, and state the tie policy out loud (what happens if two products tie — and which ranking function that choice implies). Verification: count the output rows and confirm it equals the number of categories.
2. *Faded:* "Second order for each customer." Aggregation and ranking steps are given; the learner writes the final selection step and the tie handling. The dataset contains a customer with only one order — the hint asks what that customer should contribute to the output before any syntax help is offered.
3. *Messy re-solve:* The step-1 problem again, but the orders table now contains duplicate rows and a missing category value. The naive query returns an inflated revenue figure. The task is to find why, repair it, and write two plain sentences explaining the metric.
4. *Blank start:* A definition-first variant: the prompt is the ambiguous spoken form ("show me our best customers this quarter"). The learner must choose and state a definition (by revenue? by order count? over which exact period?) before writing any SQL, then write the query that implements *that* definition.

**Exercise ladder** (aligned to the hiring-task research's difficulty ladder [Sourced]):

| Rung | Task shape | Gate it represents |
|---|---|---|
| 1 — Fluency | Single-table filtering, sorting, limiting; simple aggregates; one straightforward join. Clean data, fully specified prompt. | Can write SQL at all without help. |
| 2 — Analyst core | Multi-table joins (including finding rows with *no* match), grouping with post-aggregation filtering, conditional aggregation, date bucketing. Prompt still specifies the metric precisely. | Day-one reporting competence; where most analyst screens are decided [Sourced]. |
| 3 — Window fluency | Top-N per group, nth event per user, rolling averages, prior-period comparisons, deduplication to the latest row per entity. Tie and duplicate handling must be stated, not assumed. | Separates tutorial-complete learners from interview-ready ones [Sourced]. |
| 4 — Multi-step reasoning | Retention, funnel, and cohort logic; coverage questions ("customers who bought at least one item from every category"); queries needing two or three staged steps where the grain changes between stages. Data includes duplicates and late events. | Product-analyst and data-scientist loops [Sourced]. |
| 5 — Judgment and scale | The metric itself is ambiguous and must be defined first; or the follow-up asks how the query survives real volume (aggregate before joining, prune columns, indexing awareness). | Senior, data-engineering, and analytics-engineering loops [Sourced]. Required at the block exit assessment; not required to pass ordinary lessons. |

**Framing ritual:** From the joins lesson onward, every blank-start task begins with a one-line grain statement — "one row per customer per month" — written before the query is checked. [Recommendation] A query at the wrong grain that still runs is scored as a wrong answer, and the checkpoint feedback says so in those words.

**Recurring traps to build lessons around** [Sourced — hiring-task research]: join multiplication when two many-sided tables are joined before aggregating; the three different answers given by counting all rows, counting a column, and counting distinct values; filtering before vs. after aggregation; ranking functions that differ only on ties. Each trap gets a "critique this query" lesson: a plausible query that commits the trap, which the learner must diagnose and repair.

**Dialect note:** PostgreSQL is the default dialect for interview readiness, with explicit leeway taught for date/time syntax, which varies most across dialects [Sourced — hiring-task research]. Lessons state the dialect on the page; silent dialect mixing inside one block is an anti-pattern.

### 3.3 Python — core language, then pandas as the center of gravity

**Canonical visual:** For core Python, a state trace: a small table showing each variable's value after each line runs, so a loop or function call is a visible change of state rather than a paragraph of prose. For pandas, the table transformation itself: the input frame drawn beside the output frame, with the rows or columns kept, dropped, grouped, or created highlighted — the same row-flow idea as SQL, drawn on dataframes.

**Worked-example progression — topic: grouping and aggregation in pandas:**

1. *Fully worked:* Total revenue by category from a small sales frame. Narration covers: inspect the frame first (shape, types, missing values) before any computation; group, then aggregate with several named metrics in one pass; verify by reconciling the grouped total against the ungrouped total.
2. *Faded:* Share of orders by channel. Grouping is given; the learner writes the normalization step and must state whether missing channel values are inside or outside the denominator — and why. Denominator treatment in share-of-total is an explicit interview attention point [Sourced — hiring-task research].
3. *Trap example:* Fill missing values using each row's *own group* average, shown next to the incorrect version that uses the single overall average. The two results differ visibly on the worked data; the narration explains that broadcasting a group-level value back onto rows is a distinct move from aggregating, with its own method, and that choosing the wrong scope is a silent error — no exception is raised.
4. *Blank start:* The same business question as a SQL rung-2/rung-3 exercise the learner has already passed, now in pandas on a messier extract: "top product per category, ties stated." Deliberately cross-tool: the lesson's point is the translation, not new pandas syntax.

**Exercise ladder:**

| Rung | Task shape | What it proves |
|---|---|---|
| 1 — Read and predict | Given a short snippet, predict its output (or the frame's shape after an operation) before running it. Covers indexing by label vs. by position and boolean filtering. | Reading code, not just writing it. |
| 2 — Complete | A notebook with the inspection and setup cells done; write the transformation cells. Includes selecting, filtering, and creating a derived column. | Guided production with real data from the start. |
| 3 — Build from blank | An empty notebook, a data file, and a question. Must include: inspection first, the transformation, and a verification cell (a total, a row count, or a hand-check of one group). | The blank-notebook skill whose absence is a documented quit point for guided platforms [Sourced — pedagogy research]. |
| 4 — Merge and reshape with hygiene | Combine two frames where the learner must, before running: predict the output row count; state the expected relationship between the tables (one-to-one, one-to-many, many-to-many); and after running, audit where each output row came from. Then reshape the result (long to wide or the reverse) and state which behavior the question wants when duplicate combinations exist — refusal vs. aggregation. | Merge validation, origin auditing, and row-multiplication awareness — the interview-grade additions platforms rarely teach [Sourced — hiring-task research]. |
| 5 — Judge and defend | A timed task plus a rewrite: a supplied row-by-row loop solution must be rewritten as a vectorized expression, with a plain-language note on why the difference matters at job scale; or a supplied notebook must be critiqued for a chained-assignment mistake or a group-scope error. | Performance judgment and code critique at analyst scale. Chunked processing and snapshot diffing are deliberately *not* here — they belong to the Data Engineering track. |

**Framing ritual:** Before the transformation cells, the learner writes two lines: the expected output shape ("one row per category, one column per metric") and one predicted value or total to check against. [Recommendation] This is the pandas form of SQL's grain statement; it makes the verification cell a comparison against a prior claim rather than a vague "looks right."

**Domain cautions:** Never teach a loop first and the vectorized form as an "optimization" later; teach the vectorized form as the default and the loop as the thing to recognize and rewrite. [Recommendation] Every merge lesson from the first one onward uses the predict–validate–audit sequence; presenting it later as an advanced extra guarantees it will be skipped under time pressure.

### 3.4 Statistics / Analytics — the advanced core's first half

**Canonical visual:** A picture of data, always before any formula. A distribution drawn as dots or bars that visibly splits when a filter is applied; a confidence interval drawn as a range over repeated samples; an A/B result drawn as two distributions with their overlap shaded. Formulas, where they appear at all, appear *after* the picture, labeled as the shorthand for what the picture shows, with an optional depth layer for learners who want the derivation.

**Worked-example progression — topic: "is this difference real?" (the A/B / two-group comparison):**

1. *Fully worked, picture only:* Two groups' results plotted; the narration walks through a fixed diagnostic order — is the signal real (any tracking change, outage, holiday, or definition change?), then segment (platform, region, new vs. returning), then locate the driver, then state a hypothesis. No test statistic is computed in this first pass. [Order of operations Sourced — hiring-task research]
2. *Worked with numbers:* The same structure on new data, now adding the interval and the plain-language reading of it: what the interval says, and — explicitly — what a p-value is *not*. The deliverable includes the three-sentence spoken explanation the learner would give a non-technical stakeholder.
3. *Contrast pair:* Two analyses of the same experiment side by side: one that stopped early on the first encouraging result, and one that ran a full weekly cycle with primary and guardrail metrics declared in advance. The learner identifies which is which and names the failure in the weaker one.
4. *Blank start:* A movement-diagnosis case: a metric has dropped, the data is supplied, the prompt defines nothing. The learner produces the structured written answer — verify, segment, hypothesize, recommend — ending with an explicit "so what for the business" line.

**Exercise ladder:**

| Rung | Task shape | What it proves |
|---|---|---|
| 1 — Read the picture | Given a chart or distribution, state what it shows, what it hides (truncated axis, missing denominator, survivorship in who is shown at all), and one question it cannot answer. | Visualization judgment before computation. |
| 2 — Compute and say it | Compute a summary (center, spread, share, rate) and write the two-sentence plain-language version a stakeholder could act on. Calculation alone does not pass the rung. | Statistics in words, not only in numbers. |
| 3 — Define the metric | Given an ambiguous goal ("measure whether the new checkout works"), name one primary metric, at least one guardrail metric, the population, and the period — and defend each choice in a sentence. | Metric judgment, the core of the product-analyst loop. Wrong metric, correctly computed, is a fail. |
| 4 — Diagnose or design | Either diagnose a supplied movement using the fixed order of operations, or design an experiment: hypothesis, randomization unit, primary and guardrail metrics, duration covering a full weekly cycle, and the ship / no-ship decision rule stated in advance. | The diagnose and design case families from the hiring-task research [Sourced]. |
| 5 — Judge a result | Given a completed analysis (query, chart, and conclusion), decide: believe it or not, ship or not — and name the check that would change the decision. Includes the rare-event trap: a model or metric that looks excellent by predicting the majority class every time, where error costs must replace the headline accuracy figure. | Trade-off judgment and critical reading of others' work. |

**Framing ritual:** The learner's first written line is the definition: "By *retention* I mean …, counted over …, excluding …" [Recommendation] In this domain the definition *is* the first step of the solution, and the checkpoint scores it separately from the arithmetic (Section 5).

**Domain cautions:** Never open a statistics lesson with a formula, a Greek letter, or a prerequisite warning. [Recommendation, grounded in Sourced math-anxiety research] Correlation-vs-causation is taught with a concrete confounder the learner must find in supplied data, not as a slogan. Outliers are investigated, never auto-deleted: the lesson scores the investigation note, not the deletion.

### 3.5 Data Engineering / Machine Learning / AI — the track layer

**What changes at track level:** The unit of a lesson is no longer a single operation; it is a *stage of a system* — one ingestion step, one transformation with tests, one stage of a modeling workflow. The worked example therefore shows a whole small system first (a handful of boxes or steps, end to end, on toy-scale data) and then zooms into one stage per lesson. A learner who has only ever seen stages in isolation cannot answer track-level interview questions, which are about how stages interact: leakage between stages, what breaks when a rerun happens, what happens when the source changes shape [Sourced — hiring-task research].

**Canonical visual:** For DE: a pipeline diagram with data volumes and failure points marked on the arrows, not just boxes — the arrow where duplicates enter, the arrow where a schema change lands. For ML: the workflow drawn as a one-way street with a wall between the data used to fit and the data used to judge, so leakage is a visible crossing of the wall rather than an abstract warning. For applied AI lessons: the same discipline — input, retrieval or tool step, model step, verification step — drawn as stages with the checkable artifact each stage produces.

**Worked-example progression — topic: DE, ingest and clean a messy file into a trustworthy table:**

1. *Fully worked:* Ingest a small file with a nested field, inconsistent keys, and duplicate records. Narration covers: profile before transforming (row count, key uniqueness, null rates); flatten and standardize; deduplicate on a stated key with a stated winner rule; write output so that *running the whole thing a second time produces the same table* — idempotence is named and demonstrated, not asserted. Verification: counts before and after each step, reconciled in a short log.
2. *Faded:* A second file from the same source with a new flaw (a field that changed type). Profiling and ingestion are given; the learner writes the validation checks and the deduplication step, and states what should happen — loudly or silently — when the check fails.
3. *Diff variant:* Two snapshots of the same table; the task is to produce the set of inserts, updates, and deletes that turns the first into the second.
4. *Blank start:* A new source, an output contract (columns, types, key, freshness), and no starter code. Deliverables: the pipeline steps, the validation checks, and a short "what breaks first at 100x volume, and what I would change" note — the scale follow-up in written form.

**Worked-example progression — topic: ML, first honest model:**

1. *Fully worked:* Frame the problem before any algorithm: what is being predicted, from data available *at prediction time*, judged by which metric and why that metric fits the cost of each error type. Then the workflow: split first, fit on the training part only, judge on the held-out part, and compare against a trivial baseline (predict the majority class / the overall mean) before any real model is credited with skill.
2. *Faded:* A second problem where framing and splitting are given; the learner chooses the evaluation metric from the error costs, runs the comparison against the baseline, and writes the verdict in plain language.
3. *Leakage hunt:* A supplied notebook that scores suspiciously well because a feature encodes the answer (or because preprocessing was fit on all the data before splitting). The learner finds the leak, explains the mechanism in two sentences, and re-runs honestly.
4. *Blank start:* A raw dataset and a one-line business goal. Deliverables: the framing note, the split, the baseline, one model, the metric with its justification, and a limitations line ("this score would not survive … because …").

**Exercise ladder (shared DE/ML/AI shape, track-specific content):**

| Rung | Task shape | What it proves |
|---|---|---|
| 1 — Trace the system | Given a diagram or a short pipeline/notebook, predict what comes out at each stage for a stated input — including what happens on a duplicate, a missing field, or an out-of-range value. | Systems reading before systems writing. |
| 2 — Complete one stage | One stage blanked inside a working whole: write the transformation, the feature step, or the validation check so the end-to-end run passes its checks. | Stage-level production with the surrounding contract visible. |
| 3 — Build the whole small system | End to end on toy-scale data, from raw input to checked output, including the run log / evaluation summary. | Integration: the stages the learner knows separately, composed. |
| 4 — Break and repair | A system with a planted defect — a leak, a non-idempotent step, a silent schema drift, a metric that rewards the wrong behavior. Diagnose, repair, and prove the repair by re-running. | The debugging and audit work that dominates real track-level jobs. |
| 5 — Design and defend | Given a requirement (volume, freshness, error costs, latency where relevant), choose the design — batch vs. streaming shape, model family, evaluation plan — and defend each choice against the named alternative in a short written brief. | Track-level design and trade-off judgment, which has no analyst analogue [Sourced expectation — hiring-task research]. This rung is the track exit checkpoint. |

**Framing ritual:** A contract written before any code: inputs (source, key, expected volume), outputs (shape, key, guarantees), and the one failure the design must never commit silently (a duplicated row, a leaked feature, an unlogged dropped record). [Recommendation]

**Domain cautions:** Toy scale is for learning the shape, never for reporting the result: every ML lesson that prints a score must print the baseline's score beside it, and every DE lesson that processes a file must state what changes at production volume. [Recommendation] AI-era tooling (assistants that generate queries or code) is taught as a *stage with a verification step after it* — generated output is treated exactly like a junior colleague's output: checked against the contract, the grain, and a spot-check, before it is used.


---

## 4. Illustrative end-to-end topic: SQL joins

[Recommendation — a worked illustration of the system above, not a sourced claim.]

Topic: SQL joins, lessons 1–4 of the topic, topic checkpoint in lesson 5's slot.

- **Lesson 1 (inner joins):** Recall opener reaches back to filtering and aggregation. Visual: two row stacks aligning on a key, unmatched rows visibly falling away. Worked example answers "orders with their customer names" with grain stated and row count verified against the orders table. Faded example changes the table pair. Blank-start task adds a duplicate key on the customer side — the row count check fails, and finding out why *is* the lesson's real content.
- **Lesson 2 (finding rows with no match):** The visual extends the same diagram — now the unmatched rows are the ones kept, highlighted. The contrast pair (the two join shapes side by side on identical data) does the teaching; the blank-start task is "customers who have never ordered," with one customer whose only order was canceled, forcing a stated decision about what counts.
- **Lesson 3 (join before vs. after aggregating):** A critique lesson. A plausible query inflates revenue by joining two many-sided tables first; the learner diagnoses it, repairs it by aggregating before joining, and writes the two-sentence metric explanation.
- **Lesson 4 (multi-table, messy):** Three tables, duplicates, a missing key value. Framing ritual, blank start, verification against a hand-computed total for one customer.
- **Topic checkpoint:** Mixed, unnamed patterns — one rung-2 build, one critique, one definition-first item — under the Section 5 pass rules, with failures sorted into the four buckets of Section 6 and repair sets issued per bucket. The topic's items enter the review rotation of Section 6.

The same skeleton, with domain content swapped, generates the Excel lookup sequence (Section 3.1), the pandas grouping sequence (Section 3.3), and the statistics comparison sequence (Section 3.4). That reusability is the point of a canonical template: lesson authors spend their judgment on the domain's traps and visuals, not on reinventing the lesson's shape.

Organization rule that follows from it: [Recommendation] the second half of a block is organized by job pattern, not by keyword — SQL's second half by its pattern families, Python's pandas half as translations of those patterns, Statistics by case family (define, diagnose, design, judge). Learners should own a repertoire of moves, not only a vocabulary.

---

## 5. Checkpoint design

*All numeric thresholds, frequencies, and time limits in this section are [Recommendation] unless marked otherwise. No platform's internal pass threshold is claimed anywhere in this section, because none of the pages opened during the research states one in a form that generalizes.*

### 5.1 Three checkpoint sizes, three different jobs

| Checkpoint | Frequency [Recommendation] | Contents | Job |
|---|---|---|---|
| **Lesson exit ticket** | Every lesson (template Section 7) | One closed-book recall item on the lesson + one spot-the-flaw item + the verifiable ability self-rating | Catches same-day illusion of competence while repair is still cheap. |
| **Topic checkpoint** | Every 3–5 lessons, at the end of each named pattern or topic (e.g., "joins," "groupby," "two-group comparisons") | A mixed set: items from *all* lessons in the topic, in shuffled order, with the pattern unnamed — the learner must first decide which move applies. At least one blank-start task and one critique task. | Tests selection, not just execution. A learner who can execute each pattern when it is named but cannot choose between them has recognition, not skill. |
| **Block exit checkpoint** | Once per block (Excel, SQL, Python, advanced core, each track) | The domain's rung-5 task under hiring-shaped conditions: timed, on messy data, with a short written narration (assumptions, pattern chosen, validation performed) submitted alongside the work. | Certifies the block in the shape hiring will test it. This is the only checkpoint whose result should be described to the learner as "interview-shaped." |

One incumbent analogue is worth naming: a help-center page cited in the research record describes a unit assignment as complete only once the learner reaches the required level in *all* skills in the unit, and recommends spacing unit assignments at least two weeks apart [Sourced, as cited in the lesson-anatomy research; not independently re-verified in the verification wave]. Data From Zero adopts the two transferable ideas — *all* skills in the unit, not an average across them; and spacing between major gates — without adopting any platform's level names or point system. [Recommendation]

### 5.2 Pass rules

- **Pass = production, unaided, on unseen data.** [Recommendation] A checkpoint item counts as passed only if the learner produced the answer from a blank start, on data they have not seen in a worked example, without opening the full-solution layer of the help stack. Using a concept hint is permitted and noted; using the half-solution caps the item at "passed with support," which does not satisfy a gate.
- **Threshold: all critical items, most items overall.** [Recommendation] Designate, per checkpoint, the small set of *critical* items — the ones whose failure invalidates downstream work (grain errors in SQL, reference errors in Excel, group-scope errors in pandas, definition errors in Statistics, leakage in ML). Rule: 100% of critical items and at least 4 of 5 items overall to pass a topic checkpoint; 100% of critical items at a block exit, with no compensation from other sections. Rationale: an average-based threshold lets a learner pass while carrying exactly the one misconception the next block assumes away. These numbers are design choices for Data From Zero, stated so they can be debated and changed in one place; they are not research findings.
- **Two attempts before intervention, then a changed strategy — not a third identical attempt.** [Recommendation] Attempt 1: full checkpoint. Attempt 2: only the failed items, after completing the repair loop in Section 6. If attempt 2 fails on the same item type, the learner is routed to a *different representation* of the same idea (the visual lesson, a contrast pair, or the preceding topic's checkpoint) rather than to another copy of the same test. Repeated identical failure is diagnostic information about the teaching, not only about the learner.
- **No time bonus, ever; time limits only where hiring imposes them.** [Recommendation] Ordinary lessons and topic checkpoints are untimed. Block exits carry a stated, generous time limit modeled on the hiring format — the limit exists to train pacing and to force the "finish a careful answer to the main question first" discipline, never to reward speed on its own.
- **Experienced learners may test out of scaffolding, never out of checks.** [Recommendation, from Sourced expertise-reversal material] A learner may skip the visual, worked, and faded sections of any lesson and go straight to the blank-start task and exit ticket. Passing both counts as passing the lesson. Failing either routes them back into the faded example — presented as calibration, not punishment.

### 5.3 What checkpoints must never do

- Never gate progress on a recognition item (multiple choice, fill-in-the-blank) alone. [Recommendation]
- Never report a single percentage as the learner's state. Report the ability list: which verifiable abilities are confirmed, which are passed-with-support, which are in repair. [Recommendation]
- Never let a streak, point total, or completion count substitute for a passed blank-start task. Completion-contingent rewards optimize for lesson completion, and platforms then serve easier content to protect the metric [Sourced risk — pedagogy research].

### 5.4 Note: checkpoint resistance to AI-generated answers

[Recommendation — design note closing a gap flagged in the verification wave; no new research is claimed here.]

Data From Zero is a free static site with no accounts and no server-side grading, so its checkpoints are self-checked by design — a learner who wants to deceive the site is only deceiving their own ability list. The design should still make honest production the path of least resistance, and make pasted answers visibly insufficient:

1. **Unseen, mutated data.** Checkpoint tasks use data the learner has not seen in a worked example, with surface features changed. A generated answer to the *named* pattern still has to be adapted to *this* data — and the adaptation is the skill.
2. **Framing before output.** Every checkpoint task requires the framing line first (grain, definition, contract, expected shape). A pasted solution without a correct framing line fails on the Framing bucket (Section 6), in the learner's own self-check.
3. **Verification as a scored step.** The learner must show the check — the reconciled total, the row count against the grain statement, the baseline comparison — not only the answer. Generated output rarely ships with a check that matches this dataset.
4. **Narration at block exits.** The written narration (assumptions, pattern chosen, validation performed) is personal to the attempt. It is also the exact artifact hiring's live rounds will demand unaided, which is the honest argument to put on the page: the checkpoint is rehearsal, not surveillance.
5. **Critique items.** Spot-the-flaw and judge-a-result items require evaluating a supplied artifact, including artifacts with the plausible-but-wrong shape that generated answers typically have. The curriculum teaches verification of generated output as a job skill in its own right (Section 3.5); the checkpoints practice it on the learner's own work too.

The stance to print on checkpoint pages: the site cannot and does not police how an answer was produced; it designs tasks so that producing the framing, the verification, and the narration *is* most of the work — and those are the parts a hiring process will test live.

---

## 6. Failure diagnosis and spaced review

### 6.1 Four failure buckets, four different repairs

Every failed checkpoint item returns a *diagnosis*, not just a mark. [Recommendation] Feedback classifies the failure into exactly one of four buckets, because each bucket has a different repair:

1. **Concept** — the wrong move was chosen (wrong join type, wrong denominator, wrong metric). *Repair:* re-study the canonical visual and the contrast pair for the confused patterns, then a faded example.
2. **Execution** — the right move, wrongly carried out (a syntax slip, a copied formula that drifted, a misordered clause). *Repair:* two rung-2 (Complete) exercises on the same pattern, then retry.
3. **Framing** — the work is internally correct but answers a different question (wrong grain, unstated tie policy, undefined metric, output in the wrong shape). *Repair:* rewrite only the framing line and the verification step for the failed task, explain in one sentence what the original framing got wrong, then retry the full task. This bucket exists because the hiring-task research found framing failures to be the most common *silent* failure mode — the work runs, and is wrong.
4. **Verification** — the answer is wrong and the learner's own check should have caught it (totals do not reconcile, row count contradicts the grain statement). *Repair:* a dedicated verification drill — three short tasks whose only job is to find the planted discrepancy — before any retry. A learner who cannot check work cannot safely work unsupervised, in any domain.

Retry timing: the failed item's repair set is done in the same session if time allows, but the *retry itself* is scheduled no earlier than the next study session. [Recommendation, grounded in Sourced spacing material] Same-minute retesting measures short-term copying of the just-seen solution; next-session retesting measures whether the repair stuck.

### 6.2 Spaced review, attached to checkpoints

- Each lesson's material re-enters the recall openers and mixed review sets on a fixed schedule. The intervals are [Recommendation]; the principle is [Sourced — pedagogy research: the spacing effect is among the most replicated findings in experimental psychology, and a simple fixed schedule captures most of the benefit of algorithmic scheduling]. Data From Zero's fixed schedule: **1 day, 3 days, 7 days, 21 days** after the lesson is passed. [Recommendation — these exact intervals are a design choice.]
- A review item failed twice returns its lesson to "needs repair" status and inserts the Section 6.1 loop for that item's failure bucket. [Recommendation] Review is therefore not a separate game layered over the curriculum; it is the mechanism that can reopen a closed lesson.
- Block exit checkpoints sample earlier blocks, not only their own: the Python exit includes SQL-pattern translations; the advanced-core exit includes one Excel- or SQL-shaped task. [Recommendation] Hiring demands the same pattern across tools, so the checkpoints must too.
- Implementation on a static site: [Recommendation] the schedule renders as a "review today" page generated from the roadmap structure, plus a printable/downloadable review checklist; progress is stored in the browser only. No accounts, no server scheduler.

---

## 7. Visual-teaching integration (summary)

The full technique catalog, build costs, and asset priorities live in 04-ui-ux-lessons. This section is the playbook-level summary lesson authors need: which visual each domain's lessons use, and the house rules every visual obeys.

### 7.1 Per-domain canonical visuals (selection)

| Domain | Canonical visual | What it makes obvious before syntax |
|---|---|---|
| Excel | The annotated sheet grid in place: formula cell plus the values it becomes when copied, locked vs. moving parts in two colors; source range → pivoted result with field-to-area arrows | Reference behavior; what a pivot does to rows |
| SQL — joins | Two small tables, arrows pairing rows in the middle, result table building row by row on the right, persistent row-count badge | Pairing as the mechanism; join types as policies about unpaired rows |
| SQL — grouping / windows | Row-flow gates (filter → group buckets → sort) and a table stepper: active partition outlined, current frame shaded, computed value appearing as the frame covers each row | GROUP BY collapses rows; window functions preserve them |
| Python | State trace (variable values after each line) and name-and-arrow object diagrams; DataFrame as a labeled grid with an index rail | Execution as visible state change; aliasing; selection and grouping on frames |
| Statistics | A picture of data first: distributions that split under a filter, running-frequency / running-mean traces, sampling-distribution builder, two-group overlap picture | Probability, expectation, spread, and significance intuition before any formula |
| Regression / ML | Scatterplot with a draggable line and residual sticks; scatterplot regions → histogram split finder → growing tree with synchronized partitions; a complexity slider with tracing error curves | Fit, residuals, and influence; classification as boundary-drawing; overfitting and the bias-variance tradeoff as visible events |
| DE / AI tracks | Pipeline diagram with volumes and failure points on the arrows; ML workflow as a one-way street with a wall between fit data and judge data | Stage interaction, failure points, and leakage as a visible wall-crossing |

### 7.2 House rules for every visual

[Recommendation throughout, synthesized from the visual-teaching research; the underlying dual-channel and split-attention principles are Sourced.]

1. **Sequence: show the data moving first, name the mechanism while it is visible, show syntax or formula last, then let the learner change one thing and predict first.** No hard concept is introduced by syntax or formula alone.
2. **Predict-before-reveal.** Before any animation or stepper advances, ask what will happen. Reveal on click. Watching becomes retrieval practice.
3. **One shared visual grammar.** Tables always look like tables, partitions always use the same wall style, groups always use the same buckets, a filter always uses the same chip style — across Excel, SQL, Python, and statistics. The bucket diagram for grouping is deliberately the *same artwork* in Excel pivots, SQL GROUP BY, and pandas groupby, with different syntax captions: one operation, three syntaxes.
4. **Color with a job, never decoration.** One color per table, per class, per partition, held constant through a whole lesson and stated in a legend. Never encode meaning in color alone — pair it with labels or patterns.
5. **Small, rigged data.** Every teaching dataset is tiny and deliberately loaded: a NULL key, a tie, an outlier, a duplicate — each odd row exists to make exactly one distinction visible. Realistic messy data belongs in projects; canonical visuals need data designed like a demonstration.
6. **Step controls over autoplay.** Play, step forward, step back, and a scrub control on every animated visual. Autoplay punishes slow readers, screen-reader users, and anyone re-checking one specific step.
7. **Static fallback for every interactive.** Each interactive degrades to a readable sequence of static frames (first state, key middle state, final state) for no-JavaScript readers, print, and search indexing.
8. **Visualize the failure modes, not only the happy path.** Fan-out after a join, aliasing in Python, overfitting on test data, a filter silently changing a join's meaning — the errors that dominate real beginner work are precisely the ones a visual can make unforgettable.

---

## 8. Vietnamese-learner rules

*This section owns all /vi/ rules for the package (per the Wave 4 dedupe map). It applies to lessons written under this playbook and to the /vi/ lesson template slots. Confidence: the Excel localization facts in Section 8.4 are [Sourced] from the pages named there and were confirmed in the verification wave; terminology traps, format manifestations, and code-switching patterns are curriculum judgment from the research record, presented as such — not as measured facts.*

### 8.1 The core decision: teach in Vietnamese, work in English

The design problem, in one pattern from the research record: a Vietnam data job posting opened during the research is written in English, lists Python (pandas), SQL, and JSON / CSV / API skills, and then adds — as a separate requirement — good communication skills in Vietnamese and English [Sourced]. The tools, keywords, and interview surface are English; the workplace conversation — understanding a manager's request, explaining a finding — happens in Vietnamese, English, or a mix. A local provider in the same research wraps an English-language global certificate with Vietnamese-language live instruction; the wrapper is the product the /vi/ section should be, except free, self-paced, and built in from the start.

**The dual-track rule:** [Recommendation]

1. **/vi/ explains, EN names.** Explanations, analogies, worked-example narration, and checkpoint questions are in Vietnamese on /vi/ pages. Every technical name — function, keyword, library, job title — stays in its English working form, introduced once with a Vietnamese gloss and then used in English thereafter.
2. **EN pages never assume Vietnamese.** The root (EN) path is complete on its own. The /vi/ path is not a translation of it; it is the same sequence re-taught with Vietnamese scaffolding, Vietnamese-context examples, and extra bridges where English itself is the obstacle (Section 8.3).
3. **No bilingual pages.** One language per page. Terms are language-neutral anchors that appear identically on both versions — which is precisely what makes switching between /vi/ learning and EN working possible.

Why not full translation? A learner taught only with translated terms arrives at an English job posting, an English error message, and an English interview unable to map what they learned to what they see. Why not English only? A beginner learning a new concept *and* a new language at once pays a double cost on every lesson, and the concept is the part that must survive. The gloss is a bridge, not a destination.

**The competitive frame, stated honestly:** incumbent localization is a moving target. The research record — confirmed against the vendors' own current pages in the verification wave — finds one major platform offering Vietnamese through AI-plus-human-review translation explicitly described as beta, with some partner courses English-only, and another offering automatic translation at scale while explicitly excluding downloadable files, externally hosted assignments, peer grading, hands-on labs and guided projects, and discussion posts [Sourced]. Local Vietnamese providers sell live human scaffolding, paid and cohort-bounded. The durable opening is therefore not translation — it is *scaffolding translation cannot produce*: Vietnam-context datasets, format-trap teaching, diacritics-aware cleaning, bilingual reporting practice, and glossary discipline. Package text about incumbent Vietnamese support must come from this section's sourced summary, not from older snapshots in the research record.

### 8.2 Terminology: the three-bucket rule and the glossary

**Bucket A — Always retain in English, never translate in running text.** SQL keywords (`SELECT`, `WHERE`, `GROUP BY`, `JOIN`), Excel function names (`SUM`, `VLOOKUP`, `XLOOKUP`, `COUNTIF`), Python keywords and library names (`pandas`, `DataFrame`, `groupby`, `merge`), file formats (CSV, JSON), and error names (`#N/A`, `KeyError`, `NULL`). These are typed, searched, and read verbatim at work. Translating them in prose teaches a word the learner will never see on screen.

**Bucket B — Retain in English, gloss in Vietnamese on first use per lesson.** Concept nouns that are also job-market keywords: *dataset, dashboard, insight, stakeholder, churn, conversion rate, outlier, median, distribution, hypothesis*. Format on /vi/ pages: English term in bold, Vietnamese gloss in parentheses on first use, English term alone after that. On EN pages: a one-line plain-English definition instead.

**Bucket C — Translate freely into Vietnamese.** Instructional and connective language: verbs of action in exercises (calculate, compare, check, explain), business-context nouns that are not technical terms (customer, order, delivery, branch, month-end close), and all analogy / storytelling text. This is where Vietnamese does its real work — carrying reasoning, not labels.

**What not to do:**

- Do not translate a Bucket A term in a heading, button, or checkpoint answer. A checkpoint that accepts a translated keyword trains the wrong reflex.
- Do not gloss the same term on every page. Gloss once per lesson, link to the glossary thereafter; repeated glossing teaches learners to skip the English word.
- Do not use a Vietnamese rendering that is also a common everyday word with a different meaning without flagging it.

**Glossary summary.** The full starter glossary in the research record has 32 terms, each with the site's chosen Vietnamese gloss and a trap note; the glossary is a living site asset with one source of truth, and every new Bucket B term introduced in a lesson must be added to it in the same change, with its trap note, or the lesson does not ship. [Recommendation] The renderings are the site's chosen glosses (editorial decisions for consistency), not claims that they are the only correct translations, and the trap notes are curriculum judgment. The highest-value entries, in brief:

| English term (retain) | Gloss discipline | Trap the gloss must flag |
|---|---|---|
| dataset | tập dữ liệu / bộ dữ liệu | Not a single file — a dataset can be many tables; equating dataset with one Excel file breaks joins later. |
| spreadsheet vs. table | bảng tính vs. bảng (dữ liệu) | The same Vietnamese word covers both; always qualify which one is meant. |
| row / record; column / field | dòng / bản ghi; cột / trường | *Record* is a noun (one entity's data), not the verb "to record"; *field* means one attribute, not an area. |
| range | vùng (cells) vs. khoảng (statistics) | A cell range and a statistical range (max − min) must never share one gloss in the same lesson. |
| join; group by | phép nối / kết nối bảng; nhóm theo — code stays English | Everyday wording suggests physical attaching and reads backwards; worked examples must narrate matching on a key and the order of operations. |
| null | giá trị rỗng / thiếu — code stays `NULL` | NULL is not zero and not an empty string. The single highest-value gloss in SQL. |
| aggregate / aggregation | tổng hợp / gộp nhóm để tính tổng hợp | Aggregation is any collapse of many rows into fewer (count, average, min, max) — not SUM alone. |
| average / mean; median | giá trị trung bình; trung vị | *Mean* is also an everyday English verb ("có nghĩa là"); median is not the same as trung bình, and skewed money data is where the difference bites. |
| distribution; variance / standard deviation | phân phối / phân bố; phương sai / độ lệch chuẩn | "Phân phối" also means logistics distribution; teach spread as "mức độ phân tán quanh trung bình" before any formula. |
| correlation | tương quan | The trap is inference, not translation: tương quan ≠ nguyên nhân. Build the warning into the first correlation lesson, in both languages. |
| dashboard; insight; stakeholder | Retain in English; gloss as phrases | Postings say "dashboard" in English; *insight* has no clean one-word equivalent — teach it as a phrase: a finding a decision-maker can act on; *stakeholder* means the person who asked for the analysis and will judge it — name concrete roles. |
| churn / churn rate; conversion rate | Retain in English; gloss fully | No everyday short Vietnamese term for churn is in common use; "chuyển đổi" also means digital transformation — specify conversion *into what* (orders, sign-ups) in examples. |
| pivot table; primary key / foreign key | Gloss, but teach the English UI name as the search key | Learners find help by searching the English name; "khóa" also means a lock or a course cohort — first-use narration must separate the meanings. |
| data cleaning; data type; string; boolean | làm sạch dữ liệu; kiểu dữ liệu; chuỗi ký tự; kiểu đúng–sai (literals stay English) | Cleaning is far more than deleting blank rows; a number stored as text cannot be summed; "chuỗi" also means a store chain; `TRUE` / `FALSE` stay English in formulas and code. |
| function / argument | hàm / đối số — tham số | The school term (đối số) and the workplace term (tham số) are both accepted; teach đối số first. Function *names* themselves stay English — see Section 8.4. |

Statistics false friends get a glossary trap note when they first appear: *significance* (everyday importance vs. statistical significance), *bias* (everyday prejudice vs. systematic error), *population* (people vs. the full set of records), *sample* (a product sample vs. a data sample). Curriculum judgment throughout this table.

### 8.3 How /vi/ pages differ beyond translation — seven ways, and only these

So the two paths stay the same path, a /vi/ lesson differs from its EN counterpart in exactly these seven ways: [Recommendation]

1. **An English-terms preview box at the top.** The 3–6 Bucket A/B terms the lesson will use, each with its gloss, before the lesson body — so working memory at the moment the new *concept* arrives is spent on the concept, not the vocabulary. EN pages get a plainer "key terms" box with definitions — same slot, different job.
2. **Worked examples narrated one step slower, with the "why" in Vietnamese.** Fuller narration between steps, the mistake a beginner is about to make named *before* the step that triggers it, and a "check yourself" pause after each worked example. Local providers compete on exactly this human accompaniment; a free self-paced site bakes the accompaniment into the page.
3. **Code-switching taught as a skill, not treated as a failure.** Worked examples follow the daily job loop: a request in Vietnamese (a manager-style ask) → the solution in English-named tools → a Vietnamese summary sentence the learner could actually send. Each lesson ends with a "say it at work" line — Vietnamese with embedded English terms — rehearsing the reporting register, not only the tool register. A recurring /vi/-only exercise type drills reading real-shaped English error messages and documentation paragraphs: what it means, and what to do.
4. **Localized examples replace, not decorate.** The *same* lesson uses a Vietnam-context dataset with identical structure, identical planted traps, and the same answer shapes, so a learner can switch paths mid-course without the exercises changing underneath them. Localization is a dataset swap with identical pedagogy, never a different lesson. (Example bank summary in Section 8.5.)
5. **Number, date, and text-format callouts inline.** Wherever a lesson first touches money, dates, percentages, or text matching, the /vi/ page carries a short format callout covering the Vietnam-specific trap for that data type (Section 8.4). EN pages carry the generic version. The callout is part of the lesson, not a footnote — these traps cause silent wrong answers, not errors, so learners will not discover them on their own.
6. **Checkpoint questions that test the mapping, not just the skill.** In addition to the shared skill checkpoints, /vi/ checkpoints add mapping items: given an English term, choose its meaning; given a Vietnamese workplace request, choose the English tool operation; given an English error, choose the fix. Passing the /vi/ path certifies two things — the data skill, and the ability to operate in the English working vocabulary.
7. **Search and help vocabulary.** Each /vi/ lesson ends with the English search phrases a learner would paste into a search engine or Q&A site for this topic. Vietnamese-language help for specific tool errors is thin compared to English; teaching learners *how to ask in English* multiplies every other resource available to them.

### 8.4 Format traps — including the Excel correction

**Excel function names are NOT localized for Vietnamese.** [Sourced, confirmed in the verification wave] A detailed explainer on Excel across languages, opened during the research, lists the languages for which Microsoft translated function names (French, German, Spanish, Italian, Portuguese, Dutch, Polish, Russian, and others) and explicitly lists Vietnamese among the languages **not** translated. Workbook files store formulas internally in English; in Vietnamese Excel the menus and help may be Vietnamese, but the learner still types `=SUM(...)` and `=VLOOKUP(...)`. Any course material that invents Vietnamese function names is teaching fiction. All Data From Zero formulas are therefore published in English names, with no translated formula variants anywhere. [Recommendation]

**The real trap is the list separator and the CSV locale.** [Sourced mechanism; Vietnam-specific manifestations are curriculum judgment] The same explainer confirms the mechanism: where the comma is the decimal mark, Excel uses the semicolon as the argument separator (its worked examples are European); and CSV field and decimal separators depend on the *creator's* regional settings, not on the file, so cross-locale CSVs mangle on open — the sourced guidance is to import via Power Query / From Text-CSV with explicit separator and decimal settings. Whether a given Vietnamese learner's machine expects commas or semicolons depends on their own regional settings — which is exactly why this is taught as a *check*, never assumed either way, and never stated as "Vietnamese Excel uses semicolons." Standing /vi/ callout on every formula lesson: if your Excel rejects the comma in a formula, use semicolons — same formula. [Recommendation] One diagnostic lesson — "formula triage" — covers the three real causes of a copied formula failing: separator mismatch, a function name copied from a language where names *are* translated, and a CSV that was never parsed correctly. Google Sheets adds its own per-file locale setting, which changes decimal and date interpretation; learners moving between Excel at work and Sheets at home meet both systems, and the /vi/ path names both.

**Numbers.** Vietnamese everyday writing commonly uses a dot as the thousand separator and a comma as the decimal mark — the reverse of US formatting (curriculum judgment; the underlying separator mechanism is Sourced above). Consequences taught explicitly: `1.500.000` in a Vietnamese source means one million five hundred thousand (VND), not one-point-five — a US-rules parse is wrong by orders of magnitude, silently. Percent and currency display differ by machine setting, not by file, so learners check the *stored value* (formula bar) rather than trusting the display. VND has no practical decimal subunit in everyday data; decimal VND in raw data is a flag to investigate, not a value to round away quietly. Curriculum response: one early "numbers are not numbers until you check" lesson in the Excel block with all three traps planted in VND data, recalled at the first money lesson in SQL and Python. [Recommendation]

**Dates.** Vietnam writes dates day / month / year; US-configured tools read `03/04/2026` as March 4 where a Vietnamese learner means 3 April — any date with day ≤ 12 can be silently swapped (curriculum judgment). Teach: store dates as real date values, display ISO `YYYY-MM-DD` in shared data, and run a "does a day greater than 12 exist?" sanity check on imported date columns. Dates stored as text do not sort, filter, or subtract correctly. Month arithmetic across Tet (Lunar New Year) is meaningless without naming where Tet fell that year; every Vietnam time-series example carries the caveat, alongside the local holiday and platform sale-day spikes that break naive month-over-month comparisons.

**Diacritics and Vietnamese text in data.** Curriculum judgment throughout this paragraph. Real Vietnamese datasets carry predictable text traps English-first curricula never mention: the same name in multiple forms ("Đà Nẵng", "Da Nang", "Đa Nang", all-caps variants) fragments counts and silently drops join rows, because exact-match operations treat them as different values. Diacritics-insensitive matching is a design decision — sometimes two spellings are the same customer, sometimes tone marks distinguish different words. Teach a normalization step (lowercase, trim, optionally strip diacritics into a separate matching key) that *preserves the original column* — never overwrite source text. The letter đ / Đ is not d plus a mark: naive stripping leaves it untouched, so normalization recipes must be tested on đ explicitly, plus stacked marks in words like "tiếng" or place names like "Buôn Ma Thuột". Real columns also mix Vietnamese labels, English labels, abbreviations, and no-diacritic typing ("don hang", "da huy") from fast operational systems; status and category values are mapped through an explicit mapping table in cleaning lessons. Curriculum response: the data-cleaning unit in each block (Excel, SQL, Python) uses the *same* messy-Vietnamese-text dataset pattern — province names, order statuses, customer names — so the normalization habit is practiced three times in three tools, with the Python version adding programmatic diacritics handling as the advanced form of a problem first met in Excel. [Recommendation]

**English-reading pitfalls.** Curriculum judgment. Documentation's imperative mood ("Returns the sum of…", "Raises ValueError if…") is specification, not description — conditions ("if", "unless", "only when") are where the meaning lives, and the error-reading drills of Section 8.3 include documentation sentences, not only error messages. Early statistics lessons state probabilities and rates as both decimals and percents until the decimal-point reflex is secure.

### 8.5 Localized example bank (summary)

All examples are original designs — invented businesses, invented data, real Vietnam structures. Never a real company's data, a copied tutorial dataset, or a classic toy dataset. Design rules for every localized example: [Recommendation]

- Money in VND, written the Vietnamese way in raw data and formatted cleanly in outputs, at realistic Vietnam scale (a single e-commerce order in the hundreds of thousands of VND; monthly store revenue in the hundreds of millions), so learners build magnitude intuition in VND rather than converting from dollars.
- Names, addresses, and administrative units are Vietnamese: provinces / cities, districts, wards; phone numbers in local format as *text* (leading zero preserved — a data-type lesson in itself).
- Calendars include Tet spikes, the local holidays, and the major platform sale days that dominate e-commerce data.

Starter bank (one per domain, expandable): an Excel provincial sales workbook for a beverage distributor (inconsistent province spellings, conditional totals by region, a PivotTable of Tet vs. non-Tet months); an Excel/Sheets coffee-shop chain daily revenue sheet (payment mix, percent stored as text, average vs. median under weekend skew, an outlier day from an extra zero in VND); a SQL e-commerce orders set for a fictional marketplace seller (canceled-order filtering with Vietnamese status values, joins to products, grouping by province and month, funnel counts, repeat-purchase analysis — with manager requests written in Vietnamese on /vi/ pages); a SQL delivery-logistics set (promised vs. actual times, late rate by district, NULL handling for undelivered rows where NULL ≠ 0 changes a driver's evaluation); a Python/pandas bank-transaction categorization set (a CSV with separator and format traps planted, VND amounts parsed to numbers, diacritics-insensitive memo matching, a hand-checked sample before trusting the categorization); a Python/statistics e-wallet onboarding comparison (proportions, conversion rate, correlation vs. causation, a distribution plot showing why median beats mean for VND amounts); and a portfolio capstone in the learner's chosen sector whose report is written twice — the full version in the Vietnamese reporting register and a short English summary — matching the bilingual requirement in real postings.

### 8.6 /vi/ build checklist (lesson-level)

1. One glossary source of truth implementing Section 8.2, with bucket tags; lessons reference it, never duplicate definitions.
2. Lesson template slots for /vi/ only, per Section 8.3: terms preview box, format callout box, "say it at work" line, English search phrases, error-reading drill where relevant.
3. Paired-dataset pipeline: every exercise dataset exists in an EN-context and a VI-context version with identical structure, traps, and answer shapes.
4. A single messy-Vietnamese-text dataset family reused across the Excel / SQL / Python cleaning units, including đ, stacked-diacritic, and no-diacritic cases.
5. Formula publication standard: English names, comma separators, standing separator callout on /vi/ pages. No translated formula variants anywhere.
6. Checkpoint bank extended with mapping items (term → meaning, VN request → EN operation, EN error → fix) for /vi/ only.
7. Date / number sanity-check exercises (day ≤ 12 swap detection, thousand-separator parsing, stored-value vs. display checks) placed in the Excel block and recalled in SQL and Python.

---

## 9. Anti-patterns to avoid

Each anti-pattern names the failure, its basis in the research record, and the template rule that prevents it.

1. **Tutorial hell / the illusion of competence.** The learner finishes course after course and freezes at a blank file, because the instructor made every decision. [Sourced — pedagogy research: the most consistently described failure pattern across learner discussions] *Prevention:* template Sections 5–6 (fading, then a blank-start task as the lesson's real test) and the Section 5.2 rule that passing requires unaided production on unseen data.
2. **Fill-in-the-blank as the terminal exercise.** Supplying most of the solution and asking for the last fragment produces fast, pleasant progress and learners who cannot start from nothing. [Sourced — pedagogy research] *Prevention:* fill-in formats are permitted only inside the faded example (template Section 5), never as Section 6 or as a checkpoint item.
3. **Clean-data-only teaching.** Every exercise on tidy, correctly typed data, so the first messy file the learner meets is at work or in an interview. [Sourced — hiring-task research, rated a critical gap there] *Prevention:* one deliberate flaw in every blank-start task; repair rungs in the Excel, Python, and DE/ML ladders.
4. **The given-metric shortcut.** Exercises that always state the metric, the denominator, and the output shape, so the learner practices arithmetic while hiring tests definition. [Sourced — hiring-task research, rated critical] *Prevention:* definition-first lessons, framing rituals in every domain, and the Framing failure bucket in Section 6.1.
5. **Silent solving.** Training learners to submit answers without narration, when live hiring rounds score the spoken reasoning — assumptions, pattern choice, validation, and the "so what for the business" line after the result. [Sourced — hiring-task research] *Prevention:* decision narration inside every worked example; written narration required at block exits.
6. **Front-loaded formulas (math anxiety by design).** Opening a statistics sequence with derivations and prerequisites, triggering avoidance before the applied version appears. [Sourced — pedagogy research] *Prevention:* picture first, formula last and optional (Section 3.4).
7. **One guidance level for everyone.** Full scaffolding imposed on experienced learners (who are measurably hindered by it) and insufficient scaffolding for true novices, in the same linear path. [Sourced — expertise reversal, pedagogy research] *Prevention:* the test-out rule in Section 5.2 — skip the scaffolding, never the checks.
8. **Split-attention pages.** Diagram in one place, labels in a key, explanation in a third place; or a video whose steps must be hunted by scrubbing. [Sourced — cognitive-load material; pedagogy research on video's limits] *Prevention:* labels on the visual itself (template Section 3); text-first lessons with the visual embedded at the step it explains.
9. **XP economies and punitive streaks.** Rewards contingent on completion push the curriculum toward easier content and punish the missed day that habit research says does not derail habit formation — while a broken streak does demotivate and drive abandonment. [Sourced — pedagogy research] *Prevention:* progress shown as a verifiable ability list with forgiving return design ("welcome back — here is your 10-minute re-entry lesson").
10. **Certificates as the product.** Optimizing for completion badges that hiring treats as background noise, while the portfolio-grade artifacts hiring actually rewards are left as optional extras. [Sourced — pedagogy research] *Prevention:* rung-5 deliverables in every domain are portfolio-shaped artifacts (a workbook someone else can audit, a defended analysis, a checked pipeline), and checkpoints certify abilities, not attendance.
11. **The depth cliff after a shallow on-ramp.** Micro-course formats that teach a tool's surface quickly and then stop, leaving no path to theory, judgment, or feedback. [Sourced — pedagogy research, on micro-course platforms] *Prevention:* blocks continue past the tool surface into the judgment rungs (SQL rung 5, Statistics rungs 3–5, DE/ML rung 5) inside the same path, so the cliff is a designed ascent, not an edge.
12. **Syntax-chapter organization in the second half of a block.** Organizing later lessons by keyword rather than by job pattern, so learners own a vocabulary but not a repertoire. [Basis: hiring-task research recommendation] *Prevention:* pattern-organized second halves, per Section 4.
13. **Skipping the verification step to save time.** Worked examples that end at the answer teach learners that producing output is the end of the job. In hiring and in real work, the reconciliation — the count, the total, the spot-check — is where wrong-grain and join-inflated answers get caught. [Basis: hiring-task research traps] *Prevention:* verification is a named step of every worked example (template Section 4) and a scored failure bucket (Section 6.1, bucket 4).

---

## Sources and research record

External pages opened during the lesson-design research (all accessed 2026-11-15), on which the [Sourced] claims above rest:

- Worked-example effect — https://en.wikipedia.org/wiki/Worked-example_effect — worked and faded examples, self-explanation prompts, expertise reversal, paired-example evidence and its counterpoint.
- Cognitive load theory explained with examples (Education Perfect) — https://www.educationperfect.com/article/cognitive-load-theory-what-every-teacher-should-know/ — split-attention effect and its fix; worked example followed by a scaffolded near-identical problem.
- The Dataquest Teaching Method (Dataquest) — https://www.dataquest.io/dataquest-teaching-method/ — lesson length, hands-on exercises immediately reinforcing each concept, real-time answer checking, deliberate elimination of video lectures.
- How to Use Dataquest (Dataquest) — https://www.dataquest.io/blog/how-to-use-dataquest/ — screen structure (concept, then code written and checked), guided projects, state persisting across screens.
- Khan Academy Help Center, Unit Missions — https://support.khanacademy.org/hc/en-us/articles/360030694212-How-do-I-create-Unit-Missions-for-my-students — all-skills gating and spacing recommendation, as cited in Section 5.1.
- Office Watch, Excel Formulas in Different Languages Explained — https://office-watch.com/2026/excel-formulas-different-languages-how-it-works/ — formulas stored in English; Vietnamese in the not-translated group for function names; list-separator and CSV locale mechanics; Power Query import guidance.
- DataCamp Help Center, Languages Available on DataCamp — https://support.datacamp.com/en-us/articles/17598838-languages-available-on-datacamp — Vietnamese via AI-plus-human-review translation, beta status, partner courses English-only (page updated 2026-11-13).
- Coursera Support, Translations for course content — https://www.coursera.support/s/article/learner-000002049 — automatic translation scale and the exclusion list (files, external assignments, peer grading, labs and guided projects, discussion posts).

Internal research files synthesized here (the full record stays in the research folder): the Wave 1 pedagogy and learner-pain file (platform methods, method evidence, pain points, the ten stances); the Wave 1 syllabus inventories (topic coverage per domain); the interview and job-task research (SQL pattern taxonomy and difficulty ladder, Excel task types and rubric, analytics case families, pandas traps, gap table); the lesson-anatomy research (this file's direct source for Sections 2–6 and 9); the visual-teaching research (summarized in Section 7; full catalog in 04-ui-ux-lessons); and the Vietnamese-learner research (Section 8, including the 32-term glossary summarized there). Verification-wave notes applied: [Recommendation] labels preserved on every threshold; the paired-example claim hedged per Section 1; the Khan Academy claim attributed as cited, not as independently verified; the separator claim kept in its hedged, check-don't-assume form; older incumbent-localization snapshots superseded by Section 8.1.

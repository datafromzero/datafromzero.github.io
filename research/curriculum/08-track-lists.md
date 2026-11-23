# Track lesson lists (approved by the owner, 2026-11-23)

Approved by the owner on 2026-11-23 with these answers to the open questions below: the lists as proposed, including the four DE merges; both BigQuery lessons kept, sharing one setup box; the ML capstone lets the learner pick the classical or the LLM half under one rubric; totals counted with the simulation and capstone (within 15% is enough). The DS GenAI lesson may grade an LLM classifier (lead's call). Basis: owner decisions of 2026-11-23 (HANDOFF), research #118 (findings F, gaps G, mapping), #87, SPEC D49/D50/D53, the 68 stubs and 44 core lessons. Counts are from #118's 106 postings (DA 25, DE 27, DS 26, MLE 28).

**Shared rules.** Python only apart from SQL; no R. Each track ends with a capstone (180 min) that grades an AI verification log in the core capstone's format (accept/revise/reject plus the check that decided each). Each track has one interview simulation (90 min) with its rubric printed in the lesson. Tracks do not re-teach the core (statistics, A/B design, metrics, star schema, leakage, error costs, Git, pytest, cloud cost, C38 verification, C43 RAG); they use it.

**Status:** keep = stub and slug kept; merge = first slug survives; new = new stub; moved-to-deep-dive = the ten DE internals lessons (own section). Orders renumbered in tens (unpublished, no URL change).

## Totals

| Track | Main path | Minutes | vs mean (721) |
|---|---:|---:|---:|
| Data Analyst | 17 | 710 | −1.6% |
| Data Engineer | 18 | 780 | +8.1% |
| Data Scientist | 16 | 690 | −4.3% |
| ML Engineer | 16 | 705 | −2.3% |

Largest/smallest 780/690 = 1.13 (within 15%). Totals include the simulation (90) and capstone (180). DE deep dive, not counted: 10 lessons, 280 min.

## Data Analyst (written first): 17 lessons, 710 min

Tableau Public is the default tool; every BI lesson has a short Power BI box.

| Order | Lesson | Status | Min | After it, the learner can… | #118 evidence |
|---:|---|---|---:|---|---|
| 10 | The analyst's loop (`the-analysts-loop`) | keep | 25 | turn a vague request into a scoped, measurable question | G4; communication 23/25 |
| 20 | Querying a cloud warehouse (`querying-a-cloud-warehouse`) | new | 30 | run the track's SQL in the BigQuery sandbox, with a cost line (bytes scanned and one cheaper rewrite) under each query | named platform 13/25; G8 |
| 30 | Segments, Pareto and RFM in SQL (`sql-segmentation-and-pareto`) | keep | 30 | build Pareto and RFM segments in SQL and date their definitions | SQL 23/25 (required 19) |
| 40 | Period-over-period reporting (`time-series-reporting`) | keep | 30 | report a change without incomplete-period or calendar traps | reporting duties 18/25 |
| 50 | Retention, churn and lifetime value (`retention-and-lifetime-value`) | keep | 30 | read cohorts and compute LTV with stated assumptions | mapping: Should |
| 60 | Reading an A/B test end to end (`ab-test-readout`) | keep | 30 | check an experiment and write the decision memo | A/B 1/25: reading depth only; G9 |
| 70 | A cleaning story (`messy-data-cleaning-story`) | keep, becomes chapter 1 of the dashboard project | 30 | merge two dirty sources with a cleaning log and reconciled totals | cleaning 21/25; G6, G1 |
| 80 | Designing a dashboard (`dashboard-design`) | keep | 25 | choose KPIs from the decision and lay out one screen | dashboard duties 18/25 |
| 90 | The model behind a dashboard (`bi-modeling-for-dashboards`) | keep | 30 | relate fact and dimensions without double counting | BI tool 22/25 |
| 100 | Build and publish your first dashboard (`first-bi-dashboard`) | keep | 35 | publish on Tableau Public with a README | Tableau 13, Power BI 12; portfolio 8/25 |
| 110 | A KPI dictionary and a metrics layer (`metrics-and-kpi-dictionary`) | keep | 30 | define "revenue" once and prove two dashboards agree | G3 |
| 120 | Keeping a dashboard right (`keeping-a-dashboard-right`) | new | 25 | add freshness, row-count and reconciliation checks; handle a change request | "build and maintain" 18/25; G1 |
| 130 | Presenting findings and handling pushback (`presenting-findings`) | new | 25 | give a five-minute readout and answer "are you sure?" with evidence | communication 23/25; F7; G9 |
| 140 | Analytics case questions (`case-interview-practice`) | keep | 30 | answer define, diagnose, design and judge cases aloud | G4, G7 |
| 150 | AI-assisted analysis with a verification log (`ai-assisted-analysis`) | new (owner decision) | 35 | run one analysis with an AI assistant and log every accept/revise/reject | F9: 6/25, 2 required; NACE |
| 160 | **Simulation:** take-home graded like a hiring manager (`take-home-simulation`) | keep, expanded | 90 | pass timed SQL drills at GitLab's bar and a dirty take-home, scored by the printed rubric | F14; G7; GitLab bar |
| 170 | **Capstone:** dashboard project and case study (`portfolio-case-study`) | keep, becomes capstone | 180 | ship cleaning log, dashboard, KPI entries, case study and the graded AI log | portfolio 8/25; G2 |

## Data Scientist (written second): 16 lessons, 690 min

| Order | Lesson | Status | Min | After it, the learner can… | #118 evidence |
|---:|---|---|---:|---|---|
| 10 | Exploring before you model (`exploring-before-modeling`) | new | 30 | profile a dirty extract and write the problem list before fitting anything | G6, G1; #87 finding 9 |
| 20 | Your first honest model (`first-honest-model`) | keep | 30 | beat a baseline on held-out data and write a limitations line | G5 |
| 30 | Building a modeling table in SQL (`sql-for-modeling-tables`) | new | 30 | write point-in-time feature queries with windows and cohorts, reconciled to source | SQL 21/26; mapping: Should |
| 40 | Logistic regression (`logistic-regression-in-practice`) | keep | 30 | pick a threshold from error costs | classical core |
| 50 | Overfitting and cross-validation (`cross-validation-and-overfitting`) | keep | 30 | run leakage-safe, stratified and time-based folds | DDaT junior floor; G5 |
| 60 | Regularization (`regularization`) | keep | 25 | tune ridge and lasso with CV | classical core |
| 70 | Decision trees and random forests (`decision-trees-and-forests`) | keep | 30 | control a tree's depth and read importances with caution | classical core |
| 80 | Gradient boosting (`gradient-boosting`) | keep | 30 | tune and early-stop a boosted model | classical core |
| 90 | Feature engineering (`feature-engineering`) | keep | 30 | encode, transform and impute inside the training fold | mapping: Should |
| 100 | Clustering (`clustering-and-segmentation`) | keep, shortened | 25 | justify k and say what clusters cannot prove | mapping: Could, keep small |
| 110 | Explaining a model and checking where it fails (`model-interpretation-and-fairness`) | keep, + governance checklist | 30 | find a failure slice, name a fairness risk, write a model card | F12; G10 |
| 120 | Forecasting with backtesting (`time-series-forecasting-basics`) | keep | 30 | backtest against a seasonal-naive baseline | G5 |
| 130 | Analyzing experiments in Python (`experiment-analysis-in-python`) | keep, + causal-inference reading segment | 35 | size, bootstrap and sanity-check a test; read a causal claim critically | experiments 6/26; causal 2/26 |
| 140 | GenAI tools in a DS project (`genai-tools-in-a-ds-project`) | new (owner decision) | 35 | grade an AI assistant's work and an LLM classifier against labels, with token cost | AI/LLM 13/26; F12; G2, G8 |
| 150 | **Simulation:** take-home with a written defense (`take-home-with-written-defense`) | new | 90 | deliver a timed take-home and defend it in writing, rubric-scored | take-home 2/26; G7 |
| 160 | **Capstone:** from model to decision (`decision-product-case-study`) | keep, becomes capstone | 180 | frame, model, evaluate and end with a decision memo and graded AI log | communication 22/26; G9, G2 |

## Data Engineer (written third): 18 lessons, 780 min

| Order | Lesson | Status | Min | After it, the learner can… | #118 evidence |
|---:|---|---|---:|---|---|
| 10 | What a data engineer owns (`role-and-lifecycle`) | merge: + `etl-elt-and-layers` | 35 | sketch a pipeline and place each step as ETL or ELT in raw, staging or serving | ETL/ELT 24/27 |
| 20 | Ingesting from APIs and files (`ingest-apis-and-files`) | keep | 30 | land paginated and dirty raw data defensively | G6 |
| 30 | File formats and partitioning (`file-formats-and-partitioning`) | keep, shortened | 25 | choose Parquet over CSV and avoid the small-files trap | formats 3/27: literacy only |
| 40 | Incremental loads (`incremental-loads-idempotency`) | keep | 30 | prove a rerun changes nothing | mapping: Must |
| 50 | Pipelines as small, testable functions (`pipeline-as-testable-code`) | keep, + AI-assistant verification segment (owner decision) | 35 | write tests first, then accept or reject an AI-written transform by running them | testing 23/27; AI 12/27; F10 |
| 60 | Data quality checks (`data-quality-checks`) | keep, + contracts and observability segment (owner decision) | 35 | write a contract and checks that fail loudly on a "break the data" set | F6; G1 |
| 70 | Scheduling with Airflow (`orchestration-with-airflow`) | keep, + Dagster paragraph | 30 | run a DAG with retries and read its logs | Airflow 10/27, Dagster 3 |
| 80 | Backfills and recovery (`backfills-and-failure-recovery`) | keep | 30 | backfill safely and write the incident note | DDaT "repeatable, reliable" |
| 90 | A dbt project, from source to mart (`dbt-project-and-first-model`) | merge: + `staging-intermediate-marts` | 35 | build staging, intermediate and mart models with stated grain | dbt 12/27 |
| 100 | Tests and documentation in dbt (`dbt-tests-and-documentation`) | keep | 30 | add built-in and custom tests; read lineage | testing 23/27; G1 |
| 110 | Materializations and macros (`materializations-and-incremental-models`) | merge: + `jinja-and-macros` | 35 | pick view, table or incremental with a cost line; write one macro | G8 |
| 120 | From a logical model to physical tables (`logical-to-physical-design`) | keep (D53) | 35 | turn a logical model into typed, keyed, indexed tables | modeling 20/27 |
| 130 | Dimensional models and SCDs (`dimensional-models-and-scd`) | keep | 30 | build Type 2 history and query it as of a date | modeling 20/27 |
| 140 | Review, CI and scheduled dbt runs (`ci-and-deployment-for-dbt`) | keep | 30 | run changed models in CI with dev and prod schemas | CI/CD 7/27 |
| 150 | Running on a cloud warehouse (`cloud-warehouse-in-practice`) | new | 30 | load to BigQuery sandbox, partition and cluster, and cut a model's bytes scanned | cloud 22/27; Snowflake 10/27; G8 |
| 160 | Beyond one machine: Spark, and streaming when it pays (`spark-distributed-processing`) | merge: + `streaming-concepts` | 35 | write a PySpark job, spot skew, decide batch vs streaming | Spark 8/27; streaming 9/27 |
| 170 | **Simulation:** design a pipeline and defend it (`pipeline-capstone-design`) | keep, becomes simulation | 90 | pass a SQL test and a timed design case (contract, failure points, scale), rubric-scored | F14 (SQL test + case study); G7 |
| 180 | **Capstone:** a pipeline repo someone else can run (`analytics-platform-capstone`) | keep | 180 | ship ingestion, dbt, tests, CI, backfill story, cost note, graded AI log | F13; portfolio 3–4/27; G2 |

Prerequisites pointing at the four merged slugs are rewired to the surviving slug; nothing was published, so no redirects.

## ML Engineer (written last): 16 lessons, 705 min

| Order | Lesson | Status | Min | After it, the learner can… | #118 evidence |
|---:|---|---|---:|---|---|
| 10 | scikit-learn pipelines (`sklearn-pipelines-and-column-transformers`) | keep | 30 | ship one leakage-safe fitted object | classical half 12/28 |
| 20 | Validating training and serving data (`validating-model-data`) | new | 30 | reject bad rows with pandera and pydantic schemas in a dirty-data clinic | G1, G6; D49 puts validation libraries in tracks |
| 30 | Experiment tracking (`experiment-tracking-and-reproducibility`) | keep | 30 | reproduce a past run from its record | MLflow 5/28 |
| 40 | Tuning and imbalance (`tuning-and-class-imbalance`) | keep | 30 | tune without touching the final test set | mapping: Should |
| 50 | Neural networks and the training loop (`neural-networks-and-training-loop`) | keep | 35 | train a small PyTorch net and read its curves | PyTorch 16/28 |
| 60 | Training deep models well (`deep-learning-training-practice`) | keep | 30 | regularize and transfer a pretrained model | training duty 16/28 |
| 70 | Text as numbers (`text-embeddings-and-transformers`) | keep | 30 | compare embeddings and beat a TF-IDF baseline | embeddings 8/28 |
| 80 | LLM APIs and structured output (`llm-apis-and-structured-output`) | keep, + cost and latency segment | 30 | validate JSON output within a token and latency budget | prompting 9/28; G8 |
| 90 | A retrieval pipeline with citations (`rag-retrieval-pipeline`) | keep | 35 | build RAG that cites and abstains | RAG 11/28 |
| 100 | Evaluating LLM and RAG systems (`llm-and-rag-evaluation`) | keep, expanded | 35 | grade outputs on a golden set with trap questions; report cost per answer | evaluation 16/28; F12; G5, G2 |
| 110 | Fine-tune, prompt or retrieve? (`fine-tuning-or-not`) | new | 25 | decide when fine-tuning beats prompting or RAG; read one LoRA run | fine-tuning 7/28; mapping: Could |
| 120 | Agents, tools and guardrails (`agents-tools-and-guardrails`) | keep, + governance checklist | 30 | gate a risky action and read an agent trace | agents/MCP 7/28; governance 6/28; G10 |
| 130 | Serving behind an API (`serving-a-model-api`) | keep | 35 | deploy a containerized endpoint | Docker 9/28; SFIA MLNG L3 |
| 140 | Monitoring, drift and retraining (`monitoring-drift-and-retraining`) | keep | 30 | alert on drift and fail a build on quality loss | monitoring 9/28 |
| 150 | **Simulation:** build and evaluate in a time box (`build-and-evaluate-simulation`) | new | 90 | deliver a model or RAG answerer plus an evaluation note in a time box, rubric-scored | process tasks 4/28; G7 |
| 160 | **Capstone:** ship it and prove it works (`ml-capstone`) | new | 180 | serve a classical or LLM system with evaluation report, failure slice, cost line, ship/no-ship memo and graded AI log | LLM 12 vs classical 12/28; G2, G5, G9 |

## Where the cross-track gaps live

| Gap | DA | DE | DS | ML |
|---|---|---|---|---|
| G1 data quality as a reflex | cleaning story (70), dashboard checks (120) | contracts and checks (60), dbt tests (100), tests first in every pipeline lesson | problem list before modeling (10), reconciled SQL table (30) | schema validation (20), quality gate in monitoring (140) |
| G2 AI-output verification | AI-assisted analysis (150), capstone log | segment in testable pipelines (50), capstone log | GenAI lesson (140), capstone log | LLM evaluation (100), capstone log (coding-assistant use) |
| G9 decision memos | A/B readout (60), presenting (130), take-home | design-and-defend trade-off note (170), incident note (80) | experiment memo (130), capstone decision memo | ship/no-ship memo in capstone |
| G8 cost lines | warehouse lesson (20) | materializations (110), cloud warehouse (150), capstone cost note | tokens and cost in GenAI lesson (140) | budget in LLM APIs (80), cost per answer in evaluation (100) |
| G6 dirty-data practice | cleaning story (70), dirty take-home (160) | defensive ingestion (20), "break the data" set (60) | exploring before modeling (10) | data clinic (20) |

One home lesson per gap per track; the memo and log formats come from the core (C15, C38) and are only applied. The two BigQuery lessons split by role (DA queries and exports; DE loads, partitions, runs dbt) and share one setup box.

## Deep dive: database internals (optional, after DE)

Ten lessons, 280 min, slugs and orders 200–290 unchanged: `query-plans-and-operators`, `indexes-honestly`, `join-algorithms`, `rows-columns-and-files`, `transactions-and-isolation`, `write-skew-and-serializable`, `locks-and-mvcc`, `wal-and-recovery`, `architectures-and-trade-offs`, `procedures-and-triggers`. Label: "Deep dive: database internals. Optional, not required for a first job."

**How the site marks it (cheapest first):**
1. **Order band, no schema change (recommended).** Main path 10–180, deep dive 200–290. One constant in `src/lib/roadmap.ts` (`DEEP_DIVES = { 'data-engineer': { fromOrder: 200, title: 'Deep dive: database internals' } }`) lets the sidebar (`src/lib/sidebar.ts`), `/start/` and the lesson header show a labeled optional group. The topological check still passes (deep-dive prerequisites sit in the main path; no main-path lesson depends on the deep dive). Codes stay DE20–DE29. Not a §5 CONTRACT change: one decision row and a §4 note.
2. **Optional field (MINOR §5 CONTRACT change).** An optional `part`/`module` field; D49 already has a pending `part` TODO for the core, so one field could serve both later.
3. **Separate stage:** changes the stage enum, folder and URLs. Not recommended.

## SPEC and CHANGELOG changes that would follow

- **Counts:** tracks go from 68 to 77: DA 13 → 17, DE 31 → 28 (18 main + 10 deep dive), DS 12 → 16, ML 12 → 16. The curriculum goes from **200 to 209** lessons in 8 stages; `v1.0.0` stays 132.
- **D49:** counts sentence to "curriculum 209 … Data Analyst 17, Data Engineer 28 (18 plus a 10-lesson optional deep dive), Data Scientist 16, ML Engineer 16"; the internals module becomes "an optional deep dive after the DE main path".
- **D53:** amend "Data Engineer 31, curriculum 200" to "Data Engineer 28, curriculum 209".
- **D50:** holds no lesson count; radars keep the 45-posting sample until the yearly re-sample.
- **§14:** "200 lessons" → 209.
- **New D55** (track shape): 16–18-lesson main paths, one rubric-scored simulation each, capstones grade an AI log, the deep-dive band, the DE merges.
- **CHANGELOG** (D54): "2026-11-xx: The four career tracks are reshaped into main paths of 16 to 18 lessons, with an optional database deep dive for Data Engineers."
- Also stale: HANDOFF line 32 still says SQL 35 and DE 30.

## Open questions for the owner

1. **Durations:** count capstones at 180 and simulations at 90 minutes, as here (core capstone: 240)? Without them: DA 440, DE 510, DS 420, ML 435, a 21% spread.
2. **DE merges:** approve all four? Fallback: keep `streaming-concepts`, drop the cloud-warehouse lesson (G8 then has no DE home).
3. **Two BigQuery lessons** (DA 20, DE 150), or DA cost as a segment only (16 lessons)?
4. **ML capstone:** learner picks the classical or LLM half (12/12 split), or both?
5. **DS GenAI:** does grading an LLM classifier fit the one-lesson decision beside assistant use, or wait?

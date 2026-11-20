# #72 Research: Working in the AI era — prompting without dependence, data beyond tables, infrastructure awareness

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/72 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#72](https://github.com/datafromzero/datafromzero.github.io/issues/72) (open), opened 2026-11-19

## Type

Curriculum gap

## Summary

Three additions to the advanced core, researched together: (1) using AI and prompts without dependence — the evidence (Anthropic's RCT: AI users scored 50% vs 67% on code they had just written, debugging hit hardest; Bastani et al., PNAS: the same GPT-4, +48% practice then −17% unassisted in answer mode, harm largely mitigated in hint mode; METR: experts 19% slower while believing 20% faster) says the mode of use, not the tool, decides — so the core teaches the context pack (schema, grain, sample rows, data dictionary; plan-before-code) and a structural verification discipline (predict-before-run, trap tables, reconciliation), in 2 new lessons plus a strengthened ai-assisted-code in the Python stage; agent-supervision depth (Missing Semester 2026's manager-of-an-intern model) goes to the tracks. (2) Data beyond tables: nested JSON and event streams are use-depth for all four roles, the other forms (document, key-value, wide-column, graph, text, files, geospatial) sit at recognize/use per role; formats reduce to two pairs (CSV/JSON text vs Parquet/Avro binary — columns for analysis, rows for movement); the bridge back is flatten/explode/normalize on the café dataset in nine shapes. (3) Infrastructure awareness at the owner's ceiling — know a bit about GCP/HPC and the like is enough: 8 concepts (cloud platforms, regions/zones, storage kinds, CPU vs GPU, clusters, HPC, containers vs VMs, batch vs streaming), each explainable in one sentence, with an explicit over-the-ceiling list and a verb test (core verbs: recognise, explain, flatten, explode, choose). Full report in the Evidence field.

## Evidence

## Working in the AI Era — Prompting Without Dependence, Data Beyond Tables, and Infrastructure Awareness: Research Report

**Purpose.** Three additions to the advanced core, researched together because they answer one question — what must a learner understand *around* the code before entering the DA, DE, DS and MLE tracks: (1) how to use AI assistants and prompts so they understand the problem more, not less — AI help without the dependence that AI-written code creates; (2) data as it actually exists beyond the table — other forms, other file formats, and the bridge back to tables; (3) data infrastructure at the owner's specified depth: *know a bit about GCP, HPC and the like — that is enough*. The report sets that ceiling precisely.

**Method.** Two research lines, all sources opened 2026-11-19: (F) AI use and learning — seven named evidence sources (Anthropic's education report and its randomised trial of AI assistance and coding-skill formation, METR's randomised productivity trial, Bastani et al. in PNAS, Gerlich on cognitive offloading, CS50's AI policy and tutor design, MIT Missing Semester's 2026 "Agentic Coding" lecture) plus the prompting guidance of OpenAI, Anthropic and DeepLearning.AI; (G) data forms and infrastructure — the primary docs of MongoDB, Neo4j, DynamoDB, Cassandra, Kafka, InfluxDB, PostGIS, BigQuery, pandas, Apache Parquet and Avro, Google Cloud's storage/GPU/regions material, Apache Spark's programming guide, and two universities' HPC introductions. Working files: `cluster-f-ai-use.md`, `cluster-g-data-forms-infra.md` in this folder.

**How to read the labels.** Unmarked statements are findings from the named sources. Statements marked **[Recommendation]** are design choices. Figures are quoted only as their sources state them, with the sources' own limits attached.

**Position against existing material.** The Python stage already ends with `ai-assisted-code`; the core already contains RAG/agents literacy (what these systems *are*) and cloud/warehouse/cost lessons; a filed reference note covers database vs warehouse vs lake vs lakehouse and CDC. This report adds the *working* layer those do not cover, and says explicitly what should be strengthened in place rather than duplicated.

---

## 1. The 10 most useful findings

**1. Whether AI helps or harms learning is decided by the mode of use — and this is now measured, three ways.** In Anthropic's randomised trial of AI assistance and coding-skill formation (Shen & Tamkin), junior engineers who worked with AI scored **50% vs 67%** on a quiz about code they had written minutes earlier — the largest gap was in *debugging* — with no significant speed gain; but participants who used AI for conceptual inquiry, or generated-then-comprehended, scored **≥65%**. In Bastani et al. (PNAS), the *same* GPT-4 raised practice performance **+48%** in answer mode and then **−17%** on the later unassisted exam, while a hint-mode tutor configuration (**+127%** in practice) largely mitigated the harm. METR's randomised trial adds the perception trap: experienced developers were **19% slower** with AI tools while believing they had been **20% faster**. [Recommendation] The core does not need an "AI theory" block; it needs to teach and *enforce one mode* — engaged use (ask, predict, verify, explain back) over delegation — because the evidence says the mode, not the tool, is the variable.

**2. The core prompting skill for data work is the context pack, not prompt tricks.** Across the vendor guidance (OpenAI's and Anthropic's prompt-engineering documentation, DeepLearning.AI's course), the transferable discipline is: ship the context with the question. For data work that means a standard pack — **schema, grain, a few sample rows, and the data dictionary's definitions** — plus an output contract and **plan-before-code**: the AI states its join keys, expected cardinality and output grain *before* any code exists, and the learner judges that plan while it is still cheap to reject. Most wrong AI data code traces to a schema or a definition the model was never given — a failure of briefing, not of prompting style. [Recommendation] Teach the context pack as a reusable template, the same way the SQL stage teaches a query skeleton.

**3. AI data errors run cleanly and merely look plausible — so verification must be structural, not visual.** The characteristic AI failures in data work are a join that fans out, a filter that silently drops null rows, an aggregation at the wrong grain, and a hallucinated library function — all of which execute without error. The antidote cluster F assembles is: **predict the answer before running AI code**; test on a tiny known-answer table with planted traps (duplicate keys, null join columns, boundary dates); reconcile against an independent total computed another way. This is the same known-answer discipline the roadmap already runs on (issues #61, #66, #71) — the AI layer is where it becomes a professional habit rather than a course mechanic.

**4. The skills AI use erodes first are debugging and code-reading — exactly the skills the core must exercise deliberately.** Shen & Tamkin's largest comprehension gap was debugging; cluster research for issue #71 independently found debugging taught almost nowhere. [Recommendation] The verification lesson below is built from planted-error exercises (an AI join with fan-out, a null-dropping filter, a hallucinated pandas function, a wrong-grain aggregation — each catchable by exactly one checklist item), so the eroding skills get repetitions inside the core, not just warnings.

**5. The frontier model already exists: Missing Semester's 2026 "Agentic Coding" lecture teaches the learner as a manager of an intern.** Its transferable stance: brief the agent in writing (AGENTS.md-style project context), delegate test-first ("write tests, audit them, then let the agent implement"), keep autonomy sandboxed rather than default, and remember its warning that **verifying code can be harder than writing it**. [Recommendation] The stance transfers whole into the core; the machinery (worktrees, eval harnesses, agent configuration) is track material, split by each track's failure modes (DE: pipeline code audited via tests and data contracts; MLE: eval harnesses; DS: leakage and wrong-grain checks; DA: reconciling AI-produced numbers against source systems as a job ritual).

**6. Two new core lessons suffice for the AI layer — plus strengthening one existing lesson.** [Recommendation] `prompting-with-the-data-in-the-room` (finding 2) placed early in the core beside the RAG/agents literacy, and `trust-but-verify-ai-output` (findings 3–4) placed after the statistics/metrics lessons, when learners have the vocabulary of error. The Python stage's `ai-assisted-code` is strengthened in place with the survival habits that belong at first contact: the tutor contract (set the AI to hint-and-question mode; Bastani is the reason), predict-first in the notebook, explain-back ("paste no code you cannot explain"), and a mirror exercise classifying one's own recent AI conversations against Anthropic's four usage patterns (direct vs collaborative). A long AI curriculum is not supported by the evidence; habits enforced by exercise design everywhere else are.

**7. Nested JSON is the second shape of data work — every other form has a depth ceiling per role.** Learners have met only tidy tables. The forms evidence (cluster G, from the systems' own docs): **nested/semi-structured JSON** is *use*-depth for all four roles — it is how data actually arrives (BigQuery keeps a native JSON type precisely because it "does not require a schema"; pandas ships `json_normalize` to flatten it). **Time-series/event streams** are the other universal (use for all four; Kafka's "something happened" record is the shape of clicks, orders, sensors and logs). Document stores, key-value, graph and geospatial sit at recognize/use depending on role (graph is *use* for DS — network, fraud and recommendation features; key-value *use* for DE and MLE serving). **Wide-column is recognize-only** for everyone except DE. Raw text and images/files are use-depth as *inputs* for DS/MLE/DE, with DA consuming their tabular outputs.

**8. File formats reduce to two pairs.** [Recommendation] Teach four formats as two pairs: **CSV and JSON are text you can open and read** — CSV flat, for hand-offs and extracts; JSON nested, for API payloads and landing. **Parquet and Avro are binary you cannot open** — Parquet column-oriented, built for analytical scans (read only the columns a query needs; Apache Parquet docs: "column-oriented… designed for efficient data storage and retrieval"); Avro row-oriented with its schema always travelling with the data, built for records moving between systems. One line carries the whole lesson: *columns for analysis, rows for movement; text for people, binary for scale.*

**9. The bridge back to tables is three verbs — and one dataset in nine shapes teaches all of them.** A table is the wrong shape in five named situations: the record is a tree (an order with nested line items); the connections are the question (fraud rings, friends-of-friends); the data has not finished happening (a stream); the "record" is a file (a photo, a PDF); the shape keeps changing (schema-on-read). The bridges are **flatten** (nested fields become dotted columns), **explode** (a list becomes one row per element) and **normalize** (one nested structure becomes several key-linked tables — with the vocabulary collision flagged: MongoDB's docs use "normalized/denormalized" for referenced vs embedded documents, the SQL stage's words in the opposite direction). [Recommendation] Re-issue the café dataset in the other shapes — a nested JSON order payload, a document, an event stream, a nodes/edges pair — and make learners flatten/explode/normalize each back to the tables they already know, so only the shape is ever new.

**10. The infrastructure ceiling is eight concepts, one sentence each — and a verb test keeps it there.** [Recommendation] A pre-track learner must be able to *recognise* each of these in a job ad, a diagram or a colleague's sentence, and explain it in one plain sentence — and operates none of them: **cloud platforms** (rented data centres: compute, storage, databases by the hour — AWS/GCP/Azure); **regions & zones** (geography and failure domains decide speed, cost and survival); **object vs block vs file storage** (whole files at scale / one machine's disk / a shared mounted folder); **CPU vs GPU** (a few powerful step-by-step cores vs thousands of parallel maths cores — which is why GPUs train neural networks; Google Cloud's GPU explainer); **clusters & distributed processing** (data split across machines that each process their piece and recover from failures — Spark's own framing); **HPC** (a shared supercomputer of many nodes plus a scheduler queuing big jobs — touched when training or analysis outgrows one machine; university HPC introductions); **containers vs VMs** (an app packaged with its dependencies sharing one OS vs a whole fake computer per app); **batch vs streaming** (a finished pile on a schedule vs each event as it happens). Over the ceiling, named so learners recognise the boundary: operating Kubernetes, tuning clusters, CUDA programming, MPI/Slurm operation, GPU architecture detail, multi-region design, infrastructure-as-code operation. The guardrail is a **verb test**: if a draft core lesson's verb is *operate, configure, tune* or *administer*, it belongs to a track; the core's verbs are *recognise, explain, flatten, explode, choose*. This is the owner's "know a bit about GCP/HPC and the like — that's enough," made precise and teachable.

---

## 2. Recommended additions to the advanced core [Recommendation]

The core after issue #71's proposal stands at 34 lessons (25 + the 9-lesson engineering block). This report adds **three lessons and one in-place strengthening** — not a new block — bringing the core to 37, with placement as noted.

| # | Slug | Title | Depth | Placement | Contents in one line |
|---|---|---|---|---|---|
| 1 | `prompting-with-the-data-in-the-room` | Prompting with the data in the room | use | Early core, beside the existing RAG/agents literacy | The context pack (schema, grain, sample rows, data dictionary) as a template; the output contract; plan-before-code judged on join keys/cardinality/grain; few-shot input→output tables; iteration discipline. Signature exercise: one café question prompted bare vs with the full pack — the bare prompt's wrong answer is the lesson. |
| 2 | `trust-but-verify-ai-output` | Trust, but verify: checking AI output | use/build (small) | After the core's statistics/metrics lessons; after #71's testing lesson | The verification checklist (§3) taught through planted-error exercises: fan-out join, null-dropping filter, hallucinated function, wrong-grain aggregation — each running cleanly, each caught by one checklist item. |
| 3 | `data-beyond-tables` | Data beyond tables: forms, formats, bridges | use | Beside the core's grain/star-schema lessons (its natural neighbour) | The nine forms at the depths of §1/finding 7; the two format pairs (finding 8); the five "wrong shape" situations; flatten/explode/normalize practised on the café dataset in its other shapes. |
| 4 | `infrastructure-awareness` | Infrastructure awareness: where data runs | recognize | Folded into the core's existing cloud/warehouse lessons as their opening movement (not a standalone lesson, unless the owner prefers one) | The eight-concept ceiling of finding 10, one sentence each, with the over-the-ceiling list printed on the page so learners can see the boundary — GCP, GPU and HPC land here, at the owner's specified depth. |

**Strengthened in place (no new lesson):** the Python stage's `ai-assisted-code` gains the tutor contract, predict-first, explain-back and the four-patterns mirror (finding 6). **Moved to tracks:** agent supervision depth — AGENTS.md briefs, test-first delegation, sandboxed autonomy, eval harnesses — split by track failure modes (finding 5); operating any Part-1 store or Part-2 infrastructure (finding 10's over-the-ceiling list).

---

## 3. The verification checklist (taught in lesson 2)

Compiled from cluster F §3 — the eight checks that catch AI data errors, in the order a working data person runs them:

1. **Predict before you run.** Write the expected shape, grain and a few expected values *before* executing AI-written code; a mismatch is a finding, not a surprise.
2. **Judge the plan first.** Join keys, join type, expected cardinality, output grain — approved on paper before code exists (finding 2).
3. **Run it on the trap table.** A tiny known-answer table with duplicate keys, null join columns and boundary dates; AI code must reproduce the known answers exactly.
4. **Reconcile independently.** One headline total computed a second way (different tool or different path — SQL vs pandas) must match.
5. **Check the silent places.** Row counts before/after every filter and join; null counts in key columns; fan-out shows up as row growth.
6. **Verify every API call exists.** Function names and arguments checked against the library's own docs — hallucinated functions are a named failure mode, not bad luck.
7. **Read the code you keep.** Explain-back: any line the learner cannot explain gets rewritten by the learner or removed.
8. **Ask the AI to attack its own answer.** A second prompt for edge cases and counterexamples — engaged mode applied to verification itself.

---

## 4. Forms and depths at a glance

From cluster G §1.1 (full evidence and per-form sources in the working file). Depth = entry-level need before tracks.

| Form | DA | DE | DS | MLE | Bridge back to tables |
|---|---|---|---|---|---|
| Nested JSON | use | use | use | use | flatten; explode |
| Time-series / event streams | use | use | use | use | land as timestamped rows; bucket by time |
| Raw text | use | use | use | use | one row per document; extracted facts as columns |
| Document stores | recognize | use | recognize | recognize | extract documents to rows; explode embedded arrays |
| Key-value | recognize | use | recognize | use | two-column extract; flatten values |
| Wide-column | recognize | use | recognize | recognize | warehouse/lake extract |
| Graph | recognize | recognize | use | recognize | nodes table + edges table |
| Images & files | recognize | use | use | use | metadata + model outputs as rows |
| Geospatial | use | recognize | use | recognize | lat/lon columns; geometry column + spatial joins |

---

## 5. Sources (all accessed 2026-11-19)

**AI use (cluster F).** Anthropic, education report on student Claude use (April 2025) and Shen & Tamkin, randomised trial of AI assistance and coding-skill formation (Anthropic, 2026) — anthropic.com. METR, randomised controlled trial of AI tools and experienced open-source developers (July 2025) — metr.org. Bastani et al., "Generative AI without guardrails can harm learning" (PNAS, 2025). Gerlich, "AI tools in society: impacts on cognitive offloading and the future of critical thinking" (Societies, January 2025). Harvard CS50 — AI policy and the CS50 Duck tutor design — cs50.harvard.edu. MIT Missing Semester, "Agentic Coding" lecture (2026 edition) — missing.csail.mit.edu. OpenAI prompt engineering guide — platform.openai.com/docs; Anthropic prompt engineering documentation — docs.anthropic.com; DeepLearning.AI, *ChatGPT Prompt Engineering for Developers* — deeplearning.ai.

**Data forms and infrastructure (cluster G).** MongoDB Manual, Data Modeling Introduction — mongodb.com/docs. Neo4j Getting Started (property graph) — neo4j.com/docs. AWS DynamoDB developer guide (key-value model) — docs.aws.amazon.com. Apache Cassandra documentation (wide-column model) — cassandra.apache.org. Apache Kafka documentation, introduction (events, topics) — kafka.apache.org. InfluxDB documentation (measurement/tags/fields) — docs.influxdata.com. PostGIS documentation (geometry model, SRID) — postgis.net. Google Cloud — BigQuery JSON data type and loading data; storage products catalogue; regions and zones; "What is a GPU?"; containers vs VMs — cloud.google.com. pandas documentation, `json_normalize` — pandas.pydata.org. Apache Parquet documentation — parquet.apache.org. Apache Avro documentation — avro.apache.org. Apache Spark programming guide (partitioned datasets, fault recovery) — spark.apache.org. University of Sheffield HPC documentation, "What is HPC?" — docs.hpc.shef.ac.uk; Columbia University, Introduction to HPC — cuit.columbia.edu.

## Affected datafromzero pages

none yet — no advanced-core pages are live (sitemap checked 2026-11-18: only /, /start/, /vi/, /vi/start/ exist); the additions belong to the advanced core stage, and one strengthening touches the Python stage's ai-assisted-code lesson (/python/).

## Suggested action

Add three lessons to the advanced core per §2 — prompting-with-the-data-in-the-room (early core, beside RAG/agents literacy), trust-but-verify-ai-output (after statistics/metrics and the engineering block's testing lesson), data-beyond-tables (beside grain/star schema) — and fold infrastructure-awareness into the existing cloud/warehouse lessons as their opening movement. Strengthen the Python stage's ai-assisted-code in place (tutor contract, predict-first, explain-back, four-patterns mirror). Move agent-supervision depth and all infrastructure operation to the tracks. Core: 34 → 37 lessons if issue #71's block is adopted. Lesson prose remains the owner's.

## Priority

Medium - outdated but still correct, or a clear beginner-level gap

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

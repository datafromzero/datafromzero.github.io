# #89 Research: Database internals beyond the SQL stage — depth per role, placement, and a DE-track module

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/89 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#89](https://github.com/datafromzero/datafromzero.github.io/issues/89) (open), opened 2026-11-20

## Database internals beyond the SQL stage — how deep, for whom, and where each topic belongs

**What this is.** The SQL stage (spine: Northeastern CS 5200, issue #52) teaches databases at use depth: querying, keys and grain, joins, aggregation, window functions, CTEs, views, CREATE TABLE and constraints, DML in transactions, one normalization lesson, one indexes-and-query-plans lesson, and one "beyond one database" lesson. A full DBMS course covers seven more topics that stage teaches lightly or not at all: **(1)** domain/conceptual modeling, **(2)** stored procedures and triggers, **(3)** relational algebra and calculus, **(4)** storage, query processing and indexing, **(5)** concurrency, transactions and recovery, **(6)** database architectures, **(7)** data warehousing, OLAP and data mining. This package answers, from primary sources only: how deep each topic must go per role, where each belongs (core / DE track / DS track / skip), what a DE-track internals module should contain, and which misconceptions are worth turning into exercises. Every cell of the depth table carries its primary sources; all sources were accessed 2026-11-19. Full working files are posted as comments on this issue (Clusters M, N, O).

**Depth scale.** **—** = no evidence of need · **R** = recognize (know what it is, read about it, answer concept questions) · **U** = use (do it in the job with real tools) · **E** = explain internals (how it works inside, and why) · **B** = build (implement it — appears only in CMU 15-445, and in no job source).

---

## 1. The 10 most useful findings

1. **Data modeling is the strongest topic in the package — stronger than the team expected.** 8 of 9 junior-DE postings in the named sample name it; the UK DDaT framework sets Data modelling at **Working** for the entry DE grade ("produce, maintain and update relevant data models… reverse-engineer data models from a live system"); and Meta's official onsite guide builds an entire interview round around it ("design a data mart… dimensional modeling… denormalization"). It is the only one of the seven topics with a named big-tech interview round. The team's "maybe core" is confirmed and upgraded: **core, at use depth.**
2. **The team's second expectation — "internals (4, 5, 6) belong to the DE track" — is refuted as stated, and refined.** For each of topics 4, 5 and 6 the evidence supports a **two-layer placement**: recognize-level concepts in the core (extending lessons the SQL stage already has — one indexes/plans lesson, one scale lesson), and use/explain depth in the DE track. What is DE-only is the *depth*, not the topic. A learner who will never open the DE track still meets slow queries, mid-refresh number changes, and warehouse vocabulary in every role.
3. **Relational algebra/calculus is the package's clearest skip.** Zero mentions in every posting, framework, interview guide and practitioner curriculum opened (19 postings; Meta's two official guides; DataLemur's DE guide; DDaT; the Zoomcamp; Dataquest's 30-course DE path). It exists only in the two academic syllabi (CS 5200, CMU 15-445). **But** the algebra's *operators* are the vocabulary of every query plan (finding 8) — so: skip the notation, teach the operators as a mental model inside plan-reading.
4. **Stored procedures are alive but relocated; triggers are the legacy half.** Snowflake and BigQuery both treat procedures as first-class, actively developed features (callable units, scheduled by tasks / orchestrators), while transformation logic itself lives in version-controlled dbt SELECTs. Triggers do not exist in Snowflake ("Triggers are not supported in Snowflake" — its own migration docs) or in BigQuery's DDL reference. They survive idiomatically only in PostgreSQL **source systems**, where an entry DE needs recognition-plus: read a definition, predict row-vs-statement firing, audit for hidden side effects before trusting a table's columns.
5. **The brief's premise about Spark was already out of date.** Databricks shipped SQL stored procedures in Unity Catalog (Runtime 17.0+, release notes 3 July 2025, following SQL/PSM); open-source Spark still has none (SPARK-48338 treats procedures as a future step). A lesson written from the older premise would be wrong on arrival — and is a good example of why platform claims in lessons need dates.
6. **Neither practitioner DE curriculum teaches procedures, triggers, algebra, or transactions.** The DataTalksClub DE Zoomcamp syllabus and Dataquest's 30-course DE path contain **zero** of topics 2, 3 and 5. Dataquest does teach topic 4 hands-on ("Optimizing PostgreSQL Databases" — EXPLAIN, indexing, "core database internals in practice"), which proves the internals that *are* taught to practitioners are the demonstrable ones.
7. **The biggest interview-vs-day-job gap is topic 6's conceptual layer.** CAP theorem and sharding are headline DataLemur interview questions (5 of its 15 DE questions are topic-6 concepts) yet appear in **zero** junior-DE duty lists — entry engineers use managed warehouses where consistency and partitioning are vendor decisions. The reverse gap is topic 2: a real day-job duty in Microsoft-stack shops that no interview guide tests. Senior-DE postings deepen topics 1, 4 and 6 — they do **not** add 2, 3 or 5-internals; the only senior topic-5 trace is ACID as a *property of a table format* (Citi: Apache Iceberg "optimizing for ACID transactions").
8. **Algebra's real home is the query plan, and that is demonstrable.** Calcite's docs: "Relational algebra is at the heart of Calcite; every query is a tree of relational operators." PostgreSQL's and DuckDB's EXPLAIN output *is* an operator tree. No controlled study exists showing that teaching algebra improves SQL writing (only tool/experience papers — Mior 2023, DOI 10.1145/3596673.3596978) — so the case for the operators rests on planner evidence, not learning science, and the file says so.
9. **Demonstrability is this package's superpower.** Almost every core claim of topics 4 and 5 can be *run*, not asserted, on café-scale data with free tools: the planner ignoring an index on a small table (and `SET enable_seqscan = off` proving its cost is higher), all three join algorithms produced by toggling planner settings, write skew breaking a business rule at Read Committed *and* Repeatable Read and then aborting at Serializable (PostgreSQL's own documented example, §13.2.3), lock waits visible in `pg_locks`, B-tree pages inspected with `pageinspect`, an entire database file format read from a hexdump (SQLite). The exceptions are honest: WAL/ARIES recovery internals and distributed consensus leave no learner-visible artefact at small scale — **explain-only**, anchored to the docs' contract.
10. **The best free path needs no CS degree and no money.** Stanford/Widom's edX "Databases" series (free to audit) for concepts → *Use The Index, Luke!* (free web edition) for indexing → the PostgreSQL documentation's Ch. 13 and §14.1 worked through as two-session demos → CMU 15-445's fully public Fall 2025 lectures/notes/videos as the depth ceiling. Two cautions: DDIA now has a **2nd edition** (Kleppmann & Riccomini, O'Reilly, March 2026) — cite the edition; and LeetCode's database set is mostly Premium-locked, so it fails as a required free resource (pgexercises covers the SQL-practice ground fully free).

---

## 2. Depth per topic × role (entry level; day job / interview)

| Topic | DE day / interview | DA day / interview | DS day / interview | MLE day / interview | Primary sources |
|---|---|---|---|---|---|
| 1. Domain / conceptual modeling (incl. dimensional) | **U / U→E** | **R** (light U at working grade; U in MS-stack BI shops) **/ R** | **R / R** | **R / R** | Meta onsite guide (data-mart round); junior-DE sample 8/9; DDaT DE "Data modelling — Working" |
| 2. Stored procedures & triggers | **R / —** (U only inside MS-stack estates; 0/9 junior cloud-native postings) | **U in SQL Server/BI shops; R elsewhere / R→U** in those shops | **R / R** | **R / —** | Cynet, System Soft, Cognizant postings (procedures as core analyst duty); O*NET 15-1243.00 "procedural codes" task (rating 56, the lowest quoted); Zoomcamp & Dataquest syllabi (absent) |
| 3. Relational algebra & calculus | **— / —** | **— / —** | **— / —** | **— / —** | Absence across all sources above; present only in CS 5200 and (as foundation) CMU 15-445 |
| 4. Storage, query processing, indexing | **U** (indexes, EXPLAIN, partitioning/clustering, tuning) **+ E** for core mental models **/ U→E** | **R / R** (conceptual index questions) | **R / R** | **R / R** (senior infra-MLE reaches U/E) | Ziff Davis ("query optimization fundamentals"), Miratech (Snowflake tuning); DataLemur Q9/Q12; Dataquest "Optimizing PostgreSQL Databases" |
| 5. Concurrency, transactions, recovery | **R→U-light** (what a transaction guarantees; ACID as a property of warehouses/table formats; idempotent loads) **/ R** | **R / R** | **R / R** | **R / R** | DataLemur Q11 (ACID name-check only); Citi senior posting (Iceberg ACID); O*NET 15-1243.00 "clusters, backup, or recovery" task (71 — operational, architect level) |
| 6. Database architectures | **U + E** for trade-offs **/ E** (largest conceptual interview cluster) | **R / R** | **R→U-light / R** | **U / R→U** | Junior-DE sample 7/9; DataLemur Q2/Q5/Q6/Q7/Q14; DDIA 2nd ed. chs. on replication/sharding/transactions; DDaT DS "Data engineering" skill |
| 7. Warehousing, OLAP, data mining | **U / U** | **U** as consumer/modeler of marts **/ R→U** | **U for data mining** (definitional); OLAP as consumer **/ U** | **R→U / R** | Junior-DE sample 6/9; Zoomcamp warehouse module; Dataquest Snowflake course; O*NET 15-2051.00 summary ("Apply data mining, data modeling…") |

*MLE column caveat:* DDaT defines no entry-level MLE (Senior/Lead only), so MLE cells rest on the postings sample and are the softest in the table. *DA topic-2 caveat:* the three DA postings were deliberately targeted at SQL Server/BI shops to test where procedures survive; their rate must not be read as "all DA jobs."

---

## 3. Placement verdicts

| Topic | Placement | Form it takes there |
|---|---|---|
| 1. Modeling | **CORE (use depth)**; DE track deepens | A core lesson on modeling the domain before tables (entities, relationships, grain; ER → tables, many-to-many becomes a table) — the SQL stage's keys/grain material grows a front end. DE track: dimensional modeling, data-mart design (the Meta round), reverse-engineering a live schema |
| 2. Procedures & triggers | **CORE recognize only**; DE track recognition-plus for PostgreSQL sources | Core: one short segment — what they are, where they still live, why the warehouses have no triggers, what replaced them (streams+tasks, orchestrators, dbt). DE: read a trigger definition, predict firing, audit a source table for hidden triggers. **No "write stored procedures" lesson sequence anywhere** — no curriculum, framework or platform direction supports it as an entry skill in 2026 |
| 3. Algebra & calculus | **SKIP** (calculus); algebra **as mental model only** | Core: at most one recognition sentence inside plan-reading ("the boxes in the plan are called operators"). DE: one lesson welded to EXPLAIN (§5, lesson 2). Calculus: a single glossary sentence at most — CMU gives it one lecture; no engine plans in it; no practitioner source uses it |
| 4. Storage / query processing / indexing | **SPLIT** — core recognize; DE use + explain-selected | Core extends its existing indexes/plans lesson (what an index is, what a plan shows, why the planner may ignore the index). DE: EXPLAIN-driven tuning, B-tree/hash/LSM mental models, join algorithms, estimate-vs-actual diagnosis |
| 5. Concurrency / transactions / recovery | **SPLIT** — core recognize; DE use-light + explain concepts; recovery algorithms **skip** | Core: ACID in one honest paragraph + "numbers can change mid-refresh" as consumer knowledge. DE: isolation levels and anomalies by demonstration, MVCC vs locking, what WAL is *for*; ARIES/recovery internals are explain-only narration, never a lab |
| 6. Architectures | **SPLIT** — core recognize→light use; DE use + explain trade-offs; MLE use (feature infrastructure) | Core extends its existing "beyond one database" lesson: OLTP vs OLAP, columnar, replication/partitioning vocabulary. DE: trade-off reasoning at DDIA depth (explain, not build). Interview-concept demand (CAP, sharding) is served by the DE layer, flagged as interview-shaped |
| 7. Warehousing / OLAP / mining | **SPLIT BY HALF** | Warehousing/OLAP: core at use-as-consumer + light design (star schemas, additive vs non-additive measures); DE track designs and builds. Data mining: **DS track** (definitional to the DS occupation per O*NET; absent from DE curricula beyond a BigQuery ML mention) |

---

## 4. Stored procedures and triggers, per stack (entry DE)

| Stack | Procedures | Triggers | Basis (official docs) |
|---|---|---|---|
| Snowflake | **Use (light)** — read, call, write simple procedures | **Skip** — feature absent; learn streams + tasks / triggered tasks instead | "Triggers are not supported in Snowflake" (migration docs); procedures scheduled by tasks |
| BigQuery | **Use (light)** — `CREATE PROCEDURE`, procedural language, system procedures | **Skip** — no `CREATE TRIGGER` in the GoogleSQL DDL reference; change reaction lives in the orchestrator | BigQuery procedures + DDL documentation |
| Databricks | **Recognize** — SQL procedures are new (2025, Unity Catalog, Runtime 17+); not yet a default expectation | **Skip** | `CREATE PROCEDURE` reference; 2025 release notes (3 July 2025) |
| Apache Spark (open source) | **Skip** — none exist; SQL Scripting is a step toward them | **Skip** | SPARK-48338 design document |
| dbt (any warehouse) | **Skip** as the transformation mechanism; recognize hooks/operations as the equivalent niche | **Skip**; snapshots cover SCD-2 declaratively | dbt hooks/operations + snapshots documentation |
| PostgreSQL (source systems) | **Use** — PL/pgSQL functions are idiomatic | **Use (recognition-plus)** — read, predict firing, audit for side effects | PostgreSQL trigger documentation (current) |

The accurate one-liner for learners: **transformation logic is orchestrated from outside and version-controlled wherever the team can manage it; procedures survive as callable units inside that orchestration, and triggers survive only in OLTP source systems** — where they are load-bearing (an `updated_at` column that only advances because a trigger maintains it is what incremental extraction quietly depends on).

---

## 5. The DE-track "database internals" module [Recommendation]

Eleven lessons, in order. Everything runs free: PostgreSQL in Docker (or a browser Postgres), DuckDB, SQLite — the tools the roadmap already uses. No CS degree assumed: each lesson starts from a café-scale table and a question, and the internals arrive as the answer. "Demo" = the learner watches the concept happen in a real run (Cluster O's demonstrability map gives the exact commands and doc anchors).

| # | Lesson | One-line content | Demo anchor |
|---|---|---|---|
| 1 | Modeling before tables | From the café ER diagram to the physical schema: why many-to-many becomes a table, why relationship attributes belong to neither entity, grain declared before DDL | ER vs schema side by side; the fan-out sum (join orders→items, then sum `orders.total`) as the cost of getting grain wrong |
| 2 | Reading the machine: plans and operators | EXPLAIN as an operator tree — scan, filter, project, join, aggregate — the algebra vocabulary without the notation; estimated vs actual rows | PostgreSQL + DuckDB plans for the same query; `ANALYZE` and watch an estimate improve |
| 3 | Indexes, honestly | B-tree shape (pages, levels, via `pageinspect`); when the planner *deliberately* ignores an index; expression indexes; the write cost of every index | Small table: plan stays `Seq Scan`; `enable_seqscan = off` shows the forced index plan costs *more*; grow the table and watch the plan flip |
| 4 | Join algorithms and optimizer mistakes | Nested loop / hash / merge as literal plan nodes; cardinality estimates and how skew breaks them | Toggle `enable_hashjoin`/`enable_mergejoin`; skewed café data (one product = most orders) exposes a bad estimate at the join node |
| 5 | Storage shapes: rows, columns, files | Row vs columnar layout and what each makes cheap; SQLite's entire file format as the one you can hold in your hand | Same aggregation in DuckDB vs PostgreSQL on ~1M generated rows (labelled: direction, not production magnitude); hexdump the SQLite header |
| 6 | Transactions: what ACID actually promises | Isolation levels as a table of *allowed anomalies*, read off PostgreSQL's own Table 13.1 — including where PG is stricter than the SQL standard | Two sessions: nonrepeatable read and phantom at Read Committed, stable at Repeatable Read |
| 7 | When transactions aren't enough: write skew | The anomaly that survives snapshot isolation; Serializable as the fix, and its price (aborts and retries) | The docs' own café-shaped example: two sessions each keep "at least one register open," close different ones, both commit — then Serializable aborts one |
| 8 | Locks, waits and MVCC | Readers don't block writers under MVCC; writer-vs-writer waits are *observable*, not folklore | Three sessions: a hanging UPDATE, the waiter visible in `pg_locks` (`granted = false`), `pg_blocking_pids()` names the blocker |
| 9 | WAL and recovery: the contract | What the write-ahead log guarantees and why; recovery internals taught honestly as explain-only — no fake lab | `pg_ls_waldir()` growth under a write burst; Docker kill-and-restart: automatic recovery in the server log, committed data intact. Sequence gaps after rollback as the small runnable half |
| 10 | The platform layer: architectures and trade-offs | Replication ≠ backup; partitioning prunes or it doesn't; OLTP vs OLAP as workload *shape*; CAP and sharding as interview-shaped concepts, labelled as such | Partitioned vs unpartitioned Parquet in DuckDB: a date-filtered query reads fewer files (visible in the plan); an all-dates query reads them all |
| 11 | Ghosts in the source system: procedures and triggers | Recognition-plus for the systems a DE actually inherits: read a trigger, predict row-vs-statement firing, find hidden triggers in the catalog; where procedures live now (warehouses as callable units, dbt as the transformation home) | One UPDATE touching 5 rows writes 5 audit rows; a 0-row UPDATE still fires the statement-level trigger; the culprit found via `information_schema.triggers` |

**DS track** takes from this package only: topic 7's data-mining half (its home), plus core-level recognition of 4/5/6 as a database *consumer*. **DA track**: core modeling (light use) and, for MS-stack BI shops, the topic-2 recognition material with a pointer to learn procedures on the job.

---

## 6. Trap bank — the misconceptions worth turning into exercises

One flagship trap per topic (Cluster N's comment holds the full bank of 26, each marked demonstrable or not). Every trap below is **Demo: YES** unless noted — the learner watches the belief break in a real run.

1. **Modeling — "If I join the tables I need, the numbers will be right."** Joining at the wrong grain multiplies rows: sum `orders.total` before vs after joining order_items in DuckDB; the row counts around the join expose the fan-out. The single most valuable modeling exercise in the bank.
2. **Procedures/triggers — "A trigger fires once per statement."** In PostgreSQL a row-level trigger fires once per affected *row*, and a statement-level trigger fires even when zero rows are affected. One UPDATE, five audit rows; a second UPDATE matching nothing, one statement-level firing.
3. **Algebra — "SQL runs in the order it is written."** The alias-in-WHERE error (logical order is FROM → WHERE → … → SELECT), then the same query's EXPLAIN tree read bottom-up. Its twin: "reordering joins changes the answer" — for inner joins it changes cost, never the result; two join orders, identical results, different plans.
4. **Indexing — "An index always speeds up a query."** On a small table the planner ignores the index on purpose; forcing it costs more. Companion: `WHERE lower(name) = …` cannot use a plain index on `name` — Seq Scan until an expression index exists.
5. **Concurrency — "Transactions make concurrent updates safe at any isolation level."** The write-skew run (lesson 7): the rule breaks at Read Committed *and* Repeatable Read; only Serializable saves it, by aborting. Companion: "readers block writers" — under MVCC they don't; the *writer* waits, visibly, in `pg_locks`.
6. **Architectures — "Columnar vs row is just a file-format detail."** The same aggregation over the same data in DuckDB vs SQLite/PostgreSQL, then a single-row lookup where the row store wins — the asymmetry *is* OLTP vs OLAP. (Companion, **Demo: NO** — "replication is a backup": a replica faithfully replicates a committed DELETE; taught as a one-line distinction.)
7. **Warehousing — "Any total can be summed up the hierarchy."** Daily distinct customers do not sum to weekly distinct customers; averages of averages are wrong. `SUM(daily_distinct)` vs `COUNT(DISTINCT customer)` over the café week — the two numbers disagree, visibly. Companion: a Type-1 dimension overwrite silently rewrites last quarter's report; Type 2 (dbt snapshots) exists to prevent exactly that.

---

## 7. Best free resources (verified access terms; full annotations in the Cluster O comment)

| Resource | Access | Covers | Level |
|---|---|---|---|
| CMU 15-445/645 (Fall 2025 edition public: 25 lectures, slides, notes, videos) — https://15445.courses.cs.cmu.edu/fall2025/ | Free, no login | Topics 3–6 at the deepest free level; lecture order is a ready module spine | CS-assumed reading; projects (BusTub, C++) are a stretch goal — its autograder opens to non-CMU students on Gradescope after due dates |
| Stanford/Widom "Databases" series on edX — https://www.edx.org/learn/computer-programming/stanford-university-databases-1-introduction-to-relational-databases | Free to audit (certificate paid) | Topics 1, 2, 3, 7 — concepts, deliberately not internals | Beginner-followable; the gentlest university-branded entry |
| *Use The Index, Luke!* — https://use-the-index-luke.com/ | Free web edition | Topic 4, superbly: B-tree anatomy, WHERE-clause index use, join methods, write costs | Anyone who writes SQL |
| PostgreSQL documentation, Ch. 13 + §14.1 + Internals part — https://www.postgresql.org/docs/current/ | Free | Topics 4–6, written to be taught from; Ch. 13 contains ready-made two-session anomaly scripts | Beginner-followable at Ch. 13/§14.1 |
| SQLite documentation (planner, file format) — https://sqlite.org/queryplanner.html · https://sqlite.org/fileformat2.html | Free, public-domain dedication | Topic 4 in plain cost terms; the only complete public file-format spec | Beginner-followable |
| freeCodeCamp DBMS courses (YouTube) — https://www.freecodecamp.org/news/master-database-management-systems/ | Free | A CS 5200-shaped syllabus on video (algebra, design, transactions, indexing) | Beginner-followable companion |
| *Readings in Database Systems* ("Red Book", CC BY-NC-SA) — http://redbook.io/ · Hellerstein et al., *Architecture of a Database System* (2007), DOI 10.1561/1900000002 | Free | Topics 6/4/7 at research level — second-stage reading | CS/research level |
| DDIA — Kleppmann 2017; **2nd ed. Kleppmann & Riccomini, O'Reilly, March 2026** | **Paid** (no free edition; Kleppmann's Cambridge distributed-systems notes are free under CC BY-SA but are not the book) | Topics 4–6 at explain-the-trade-offs depth — the practitioner canon | Practitioner |
| *Database Internals* — Petrov (O'Reilly, 2019) | **Paid**, no official free text found | Topics 4–6 — the most on-topic paid book; free substitutes are 15-445 + the official docs | Practitioner |

---

## 8. Sources (primary only; all accessed 2026-11-19)

**Postings sample (19 named, dated; full list in the Cluster M comment).** Junior DE (n=9): Dark Wolf Solutions, Vantor, Trilogy Federal, Peraton, Amentum, Miratech, FHLB New York, SWBC, Ziff Davis. DA, targeted MS-stack (n=3): Cynet Systems (2026-10-13), System Soft Technologies (2026-11-13), Cognizant (2026-10-27). DS (n=2): Kearney, NC State University. MLE (n=2) and senior DE ceiling contrast (n=3): Peraton, General Motors; Apple, Bright Vision Technologies, Citi.

**Interview sources.** Meta, Data Engineer Initial + Onsite Interview Guides (metacareers.com CDN PDFs) · DataLemur, "Data Engineering Interview Questions," https://datalemur.com/blog/data-engineer-interview-guide.

**Frameworks and occupations.** UK DDaT role pages: Data engineer (updated 29 May 2026), Data analyst, Data scientist, Machine Learning Engineer — https://understand-digital-data-roles-skills.service.gov.uk/ · O*NET: Database Architects 15-1243.00, Data Scientists 15-2051.00 — https://www.onetonline.org/.

**Curricula.** DataTalksClub DE Zoomcamp syllabus — https://github.com/DataTalksClub/data-engineering-zoomcamp · Dataquest Data Engineer path (30 courses) — https://www.dataquest.io/path/data-engineer/ · CMU 15-445/645 Fall 2025/Fall 2026 — https://15445.courses.cs.cmu.edu/ · Northeastern CS 5200 syllabus (Schedlbauer, Spring 2025) — http://artificium.us/syllabi/CS5200-Schedlbauer.html.

**Official documentation.** Snowflake (procedures; "Triggers are not supported in Snowflake," migrations reference; triggered tasks) — https://docs.snowflake.com/ · BigQuery (procedures; GoogleSQL DDL reference) — https://cloud.google.com/bigquery/docs/ · Databricks (`CREATE PROCEDURE`; SQL release notes 2025) — https://docs.databricks.com/ · Apache Spark SPARK-48338 — https://issues.apache.org/jira/browse/SPARK-48338 · dbt (hooks and operations; snapshots) — https://docs.getdbt.com/ · PostgreSQL (Ch. 13 transaction isolation incl. Table 13.1 and §13.2.3; §14.1 Using EXPLAIN; Ch. 37 triggers; pg_locks; pageinspect; §28.3 WAL) — https://www.postgresql.org/docs/current/ · DuckDB (EXPLAIN; profiling; storage) — https://duckdb.org/docs/ · SQLite (query planner; EXPLAIN QUERY PLAN; isolation; file format) — https://sqlite.org/ · Apache Calcite, "Algebra" — https://calcite.apache.org/docs/algebra.html.

**Books and papers.** Kleppmann & Riccomini, *Designing Data-Intensive Applications*, 2nd ed., O'Reilly, March 2026 · Petrov, *Database Internals*, O'Reilly, 2019 · Hellerstein, Stonebraker & Hamilton, *Architecture of a Database System*, 2007, DOI 10.1561/1900000002 · Hellerstein & Stonebraker (eds.), *Readings in Database Systems*, 5th ed. · Mior (2023), "Relational Playground," DataEd '23, DOI 10.1145/3596673.3596978 · Winand, *Use The Index, Luke!*, https://use-the-index-luke.com/.

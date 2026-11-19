# #52 Research: SQL core — academic depth interleaved with query practice

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/52 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#52](https://github.com/datafromzero/datafromzero.github.io/issues/52) (open), opened 2026-11-17

## Type

Curriculum gap

## Summary

## Summary

The SQL block is this site's core investment, so it should not be another syntax ladder. This report designs the block as an **interleave**: every concept from a graduate database course (CS 5200 Database Management Systems, Northeastern, Summer 2026 — the site owner's own course, archived by the team) is paired, inside the same lesson, with runnable query practice in the style of W3Schools and Programiz, self-checks in the style of Harvard's CS50 SQL, and an honest map of where MindX (the Vietnamese paid alternative) fits. Owner decision recorded 2026-11-17: **SQL only — no R** (CS 5200 used R as a delivery vehicle; it is stripped, the database knowledge stays). All practice data is self-created fiction (the café dataset from the Excel drills, extended), as with the rest of the site.

## 1. What each source contributes — and its verified limits

**CS 5200 (the academic spine).** Syllabus arc: data modeling → relational design & normalization → realizing a schema → SQL retrieval → stored procedures & triggers → relational algebra & calculus → storage, query processing & indexing → concurrency, transactions & recovery → architectures → warehousing/OLAP. Lesson archive (55 lessons) adds the teaching assets: an ER/UML modeling set, Normalization, Relational Algebra, Query Processing, Indexing in SQLite, Transactions, and 17 SQL lessons including Subqueries/CTE (on a sample movie database), Joins, Views, Window Functions, Execution vs Syntax Order, plus two practice sets on a purpose-built practice database. This is the only source in the set that teaches design, theory and internals together.

**W3Schools (the practice floor).** 46 tutorial lessons + 21 database lessons, all free, no account. Its "Try it Yourself" editor runs a real, writable, restorable database in the browser over a Northwind-style sample — the closest web equivalent of Excel's instant recalculation. Verified absences (checked 2026-11-17, including a 404 on the commonly cited normalization URL): **no CTEs, no window functions, no transactions lesson, no subqueries lesson** (approached only via EXISTS/ANY/ALL), **no design/normalization**, set operations stop at UNION/UNION ALL, indexes are one syntax page. Paid products sell structure and a certificate over the same content.

**Programiz (the zero-setup compiler).** Free tutorial tree plus a free in-browser SQL compiler that Programiz itself states is SQLite-based, sharing a small sample database (Customers/Orders/Shippings) with the tutorials. It has a genuinely good **CTE lesson** (free) and a complete join family; transactions are one thin TCL page (SAVEPOINT/ROLLBACK/COMMIT, no ACID or isolation); **window functions exist only in the paid Pro course**; no normalization/design, no triggers. Free pages give examples without scored practice; challenges and projects are Pro-gated.

**CS50 SQL, Harvard (the depth benchmark).** Seven weeks, one verb each: Querying → Relating (keys, joins, subqueries, set operations) → Designing (schemas, types, constraints, normalization, graded as an open-ended design problem set) → Writing (DML, CSV cleaning, triggers) → Viewing (views incl. security use, CTEs) → Optimizing (indexes, B-trees, EXPLAIN QUERY PLAN, locks, transactions) → Scaling (MySQL/PostgreSQL, stored procedures, replication, sharding, injection). Signature device: problem sets publish expected row/column counts so learners self-check. Free as OpenCourseWare with a free CS50 certificate at 70%+ on every assignment. Verified gaps: **no window functions, no relational algebra** — and its materials are **CC BY-NC-SA 4.0**, so it can be linked but not adapted into this site's CC BY 4.0 corpus. Beginner friction is real: terminal/cloud-IDE setup before the first query, and CS50's own FAQ estimates 10–20 hours per problem set.

**MindX Vietnam (the local paid alternative).** No standalone SQL course exists. SQL appears inside an 8-month Data Analyst program: Term 1 sessions 1–6 (including a query-optimization session) followed by Power BI, then Python in Term 2, ML in Term 3, and a short advanced-SQL block (multi-table joins, subqueries) plus capstone in Term 4. The SQL dialect is never named; window functions appear in MindX's blog roadmap but not in the published course outline. **Excel is entirely absent from the paid course**, even though MindX's own blog self-study roadmap sequences Excel (Power Query, PivotTable) → SQL → Power BI → Python. Tuition is not published (quoted after a consultation signup; installments offered). Nothing can be tried before a sales call.

## 2. Coverage matrix (verified 2026-11-17)

| Topic | CS 5200 | W3Schools | Programiz (free) | CS50 SQL | MindX DA |
|---|---|---|---|---|---|
| SELECT / filtering / aggregation | Yes | Yes | Yes | Yes (Wk 0) | Yes (Term 1) |
| Joins, all types | Yes | Yes | Yes | Yes (Wk 1) | Yes (Terms 1+4) |
| Subqueries | Yes | Only via EXISTS/ANY/ALL | Yes | Yes (Wk 1) | Yes (Term 4) |
| Set operations | Yes | UNION only | Partial | Yes (Wk 1) | Not in outline |
| CTEs (WITH) | Yes | **No** | Yes (strong page) | Yes (Wk 5) | Not in outline |
| Window functions | Yes | **No** | **Paid only** | **No** | Blog only |
| Views | Yes | Yes | Yes | Yes (Wk 5) | Not in outline |
| Triggers | Yes | No | No | Yes (Wk 3) | No |
| Schema design / normalization | Yes (deep) | **No** | **No** | Yes (Wk 2) | No |
| Relational algebra / execution order | Yes | No | No | No | No |
| Indexes / EXPLAIN / query processing | Yes | Syntax only | Syntax only | Yes (Wk 5) | One session |
| Transactions / ACID / concurrency | Yes (deep) | **No** | Thin (TCL syntax) | Yes (Wk 5) | No |
| Star schema / warehousing | Yes | No | No | No | No |
| Runnable practice, free, no setup | Practice DBs | In-browser DB + exercises | SQLite compiler | Cloud IDE (setup-heavy) | None public |

## 3. The interleaved design — 7 movements

One dataset story throughout: the café from the Excel drills, grown into a small chain (stores, staff, menu items, orders, order lines, customers, suppliers). Every lesson follows the same loop: **Concept** (one idea from the spine, in plain words) → **Query** (the concept as runnable SQL on the café data, in the same lesson) → **Check** (a known-answer self-check with the expected result published, plus one trap). Movements:

0. **From a spreadsheet to a database.** The café sheet they already know becomes tables. Why one wide sheet breaks (the same fact typed in many places, updated in one) told as a story; first CREATE TABLE + SELECT on the same data — the answers must match the Excel drills exactly (SUMIF West $1,025; capstone total $666.60). Spine: Need for Databases, Relational Model. Practice pattern: W3Schools-style instant editor.
1. **Querying with a mental model.** SELECT/WHERE/ORDER BY/LIMIT, then the lesson no tutorial has: **execution order** (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY) and relational algebra as pictures (filter = choose rows, project = choose columns). Spine: SELECT, Execution vs Syntax Order, Relational Algebra. Practice: Programiz compiler (SQLite) as the linked zero-setup sandbox; our own drills carry published expected outputs (the CS50 self-check device).
2. **Aggregating is PivotTables.** GROUP BY/HAVING/aggregates introduced as "the PivotTable you already know, written as text"; CASE as the written form of IF. Spine: GROUP BY. Bridge callbacks to the Excel stage in every lesson.
3. **Relating.** Keys first (primary/foreign, why they exist), joins as "VLOOKUP that can bring back many rows", many-to-many through a junction table (café: orders ↔ items), subqueries, EXISTS, set operations. Before joining the café tables, learners see its ER diagram — design arrives before the queries that need it. Spine: Joins, Subqueries/CTE (CTEs introduced here as named steps), ER Diagrams, the many-to-many short.
4. **Designing.** Schemas, types, constraints; normalization 1NF→3NF taught on the café data gone wrong (one wide orders table with repeating groups → decompose → prove with queries that every known answer is unchanged). Lookup tables. Spine: Normalization, Mapping Patterns, Lookup Tables, Design Workflow. Benchmark: CS50's Week 2 proves beginners can do open-ended design when it is graded as a task, not a lecture.
5. **Writing safely, shaping results.** INSERT/UPDATE/DELETE with **transactions as the safety story** (ACID in one plain lesson: the two-people-editing-the-same-stock-count problem), views (including views as a way to hide columns — the security use CS50 teaches), triggers at awareness level. Spine: Transactions (concept + SQLite), Views, Triggers. Programiz's TCL page is the citation for command syntax; the concept layer is ours.
6. **Thinking like the engine; the analytics shape.** **Window functions as the flagship** — the topic every free source in this study omits or paywalls — taught on café sales (running totals, rank per store, month-over-month). Then indexes with EXPLAIN QUERY PLAN (make a slow café query fast and prove it), and the exit ramp: star schema and fact tables (Spine: OLAP/Fact Tables) so the block hands off to the career tracks; one closing awareness lesson on scaling and NoSQL (Spine: Partitioning/Sharding, NoSQL Paradigms; CS50 Week 6 as the deep-dive link).

Estimated shape: ~30–35 lessons. Dialect: SQLite first (matches Programiz's compiler and CS50's start), with dialect-difference notes (MySQL/PostgreSQL) where jobs require them — the gap MindX leaves by never naming a dialect.

## 4. How this differs from each competitor (the point of the design)

1. **One dataset from Excel to SQL.** Learners query data they already know from the Excel stage and can verify every answer against it. W3Schools/Programiz use a stranger's sample database; MindX's paid course skips Excel entirely; CS50 changes datasets every week.
2. **Design and theory inside a beginner path.** Normalization, execution order, algebra-as-pictures and query plans are graduate-course material (CS 5200) rewritten for beginners and taught through SQL only — no competitor in this study offers design + explanation + syntax in one free path.
3. **Window functions and CTEs in the free core.** Verified: absent at W3Schools, paywalled at Programiz, absent at CS50 SQL, blog-only at MindX.
4. **Transactions and indexes as beginner lessons**, with EXPLAIN QUERY PLAN as a hands-on proof, not graduate trivia.
5. **Every drill self-checks.** Published expected results (adapted as a *practice pattern* from CS50) plus planted traps (the join trap already exists in our drills) — W3Schools/Programiz free tiers offer recall questions or unscored examples instead.
6. **Citations instead of copies.** Each lesson ends with named deep-dives (next section), so the site stays original while standing on named sources — and names MindX honestly as the local paid route for learners who want a classroom.

## 5. Citation and license rules for whoever builds this

- **CS50 SQL materials are CC BY-NC-SA 4.0** (cs50.harvard.edu/sql/license/): link as a deep-dive only; never adapt text, problem sets or datasets into this site (NonCommercial + ShareAlike clash with this site's CC BY 4.0).
- **W3Schools and Programiz**: link for extra repetitions, the keyword/function references, the CTE page and the compiler; do not copy lesson text, examples or sample data.
- **CS 5200**: the topic structure above is curriculum fact from the owner's own completed course (syllabus public on the course site); all lesson text for this site is written originally from it. The course textbook (*Introduction to Database Systems*, ITL Education Solutions, Pearson India, 2008) may be cited as further reading.
- **MindX**: facts above are from its public pages, cited; it is named as an external paid option, never copied.
- All practice data remains self-created fiction (café universe), per the site's standing rule.

## 6. Suggested action

Build the /sql/ block to the 7-movement design in §3: SQLite-first, café dataset throughout, concept → query → check in every lesson, window functions and CTEs in the free core, and the §5 citation rules wired into each lesson's "go deeper" footer. Keep the existing drafted SQL lessons/drills as the starting draft for Movements 0–3 and extend them rather than restarting.

## Sources (all accessed 2026-11-17)

1. CS 5200 syllabus, Summer 2026 (Schedlbauer, Northeastern) — https://s3.us-east-2.amazonaws.com/artificium.us/syllabi/CS5200-Schedlbauer-Summer-2026.html
2. W3Schools SQL tutorial home (topic tree, editor, exercises, quiz) — https://www.w3schools.com/sql/
3. W3Schools Try-SQL editor behaviour — https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all
4. W3Schools SQL exercises (categories, format) — https://www.w3schools.com/sql/sql_exercises.asp
5. W3Schools SQL UNION lesson (no INTERSECT/EXCEPT) — https://www.w3schools.com/sql/sql_union.asp
6. W3Schools normalization URL returns 404 — https://www.w3schools.com/sql/sql_normalization.asp
7. W3Schools paid SQL Course + Certificate (Campus) — https://campus.w3schools.com/products/sql-course
8. Programiz SQL tutorials (topic list via sitemap + opened lessons) — https://www.programiz.com/sql
9. Programiz SQL online compiler — https://www.programiz.com/sql/online-compiler/
10. Programiz CTE lesson — https://www.programiz.com/sql/cte
11. Programiz TCL commands lesson — https://www.programiz.com/sql/tcl-commands
12. Programiz note: its compiler is SQLite-based — https://dev.programiz.com/sql/update-with-join
13. Programiz Pro SQL course (window functions chapter, paid) — https://programiz.pro/course/learn-sql-basics
14. CS50 SQL course home — https://cs50.harvard.edu/sql/
15. CS50 SQL problem sets index — https://cs50.harvard.edu/sql/psets/
16. CS50 SQL license (CC BY-NC-SA 4.0) — https://cs50.harvard.edu/sql/license/
17. CS50 SQL FAQs (certificate rule, 10–20 h per problem set) — http://cs50.harvard.edu/sql/faqs/
18. CS50 SQL final project specification — https://cs50.harvard.edu/sql/project/
19. Harvard Online: CS50's Introduction to Databases with SQL (verified certificate $299) — https://harvardonline.harvard.edu/course/cs50s-introduction-databases-sql
20. MindX Data Analyst course page (syllabus terms 1–4, format, FAQ on tuition) — https://mindx.edu.vn/course/khoa-hoc-data-analyst-t1 (course page as indexed 2026-11-17)
21. MindX blog: self-study Data Analyst roadmap (Excel → SQL → Power BI → Python) — https://mindx.edu.vn/blog/lo-trinh-hoc-data-analyst-cho-nguoi-moi-bat-dau
22. MindX Data Engineer roadmap (PostgreSQL, Airflow, dbt, Spark, AWS) — https://mindx.edu.vn/course/lo-trinh-hoc-data-engineer

Template fields: Type = Curriculum gap. Priority = High (the SQL block is the site's declared core investment). Confidence = High (every coverage claim above was verified on the live pages on 2026-11-17; the two prices not published by their owners — MindX tuition, W3Schools bootcamp — are reported as unpublished/unverified rather than estimated). Affected pages: /sql/ (stage route; no SQL lesson pages are in the sitemap yet).

## Evidence

- https://s3.us-east-2.amazonaws.com/artificium.us/syllabi/CS5200-Schedlbauer-Summer-2026.html (accessed 2026-11-17): CS 5200 syllabus, Summer 2026 (Schedlbauer, Northeastern).
- https://www.w3schools.com/sql/ (accessed 2026-11-17): W3Schools SQL tutorial home (topic tree, editor, exercises, quiz).
- https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all (accessed 2026-11-17): W3Schools Try-SQL editor behaviour.
- https://www.w3schools.com/sql/sql_exercises.asp (accessed 2026-11-17): W3Schools SQL exercises (categories, format).
- https://www.w3schools.com/sql/sql_union.asp (accessed 2026-11-17): W3Schools SQL UNION lesson (no INTERSECT/EXCEPT).
- https://www.w3schools.com/sql/sql_normalization.asp (accessed 2026-11-17): W3Schools normalization URL returns 404.
- https://campus.w3schools.com/products/sql-course (accessed 2026-11-17): W3Schools paid SQL Course + Certificate (Campus).
- https://www.programiz.com/sql (accessed 2026-11-17): Programiz SQL tutorials (topic list via sitemap + opened lessons).
- https://www.programiz.com/sql/online-compiler/ (accessed 2026-11-17): Programiz SQL online compiler.
- https://www.programiz.com/sql/cte (accessed 2026-11-17): Programiz CTE lesson.
- https://www.programiz.com/sql/tcl-commands (accessed 2026-11-17): Programiz TCL commands lesson.
- https://dev.programiz.com/sql/update-with-join (accessed 2026-11-17): Programiz note: its compiler is SQLite-based.
- https://programiz.pro/course/learn-sql-basics (accessed 2026-11-17): Programiz Pro SQL course (window functions chapter, paid).
- https://cs50.harvard.edu/sql/ (accessed 2026-11-17): CS50 SQL course home.
- https://cs50.harvard.edu/sql/psets/ (accessed 2026-11-17): CS50 SQL problem sets index.
- https://cs50.harvard.edu/sql/license/ (accessed 2026-11-17): CS50 SQL license (CC BY-NC-SA 4.0).
- http://cs50.harvard.edu/sql/faqs/ (accessed 2026-11-17): CS50 SQL FAQs (certificate rule, 10–20 h per problem set).
- https://cs50.harvard.edu/sql/project/ (accessed 2026-11-17): CS50 SQL final project specification.
- https://harvardonline.harvard.edu/course/cs50s-introduction-databases-sql (accessed 2026-11-17): Harvard Online: CS50's Introduction to Databases with SQL (verified certificate $299).
- https://mindx.edu.vn/course/khoa-hoc-data-analyst-t1 (accessed 2026-11-17): MindX Data Analyst course page (syllabus terms 1–4, format, FAQ on tuition; course page as indexed 2026-11-17).
- https://mindx.edu.vn/blog/lo-trinh-hoc-data-analyst-cho-nguoi-moi-bat-dau (accessed 2026-11-17): MindX blog: self-study Data Analyst roadmap (Excel → SQL → Power BI → Python).
- https://mindx.edu.vn/course/lo-trinh-hoc-data-engineer (accessed 2026-11-17): MindX Data Engineer roadmap (PostgreSQL, Airflow, dbt, Spark, AWS).

## Affected datafromzero pages

/sql/ (stage route; no SQL lesson pages exist yet)

## Suggested action

Build the /sql/ block to the 7-movement design in §3: SQLite-first, café dataset throughout, concept → query → check in every lesson, window functions and CTEs in the free core, and the §5 citation rules wired into each lesson's "go deeper" footer. Keep the existing drafted SQL lessons/drills as the starting draft for Movements 0–3 and extend them rather than restarting.

## Priority

High - a page is wrong or broken, or URLs/roadmap structure are affected

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

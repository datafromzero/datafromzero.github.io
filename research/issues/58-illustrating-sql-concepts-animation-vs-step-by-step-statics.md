# #58 Research: illustrating SQL concepts — animation vs step-by-step statics

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/58 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#58](https://github.com/datafromzero/datafromzero.github.io/issues/58) (open), opened 2026-11-18

## Type

Curriculum gap

## Summary

## Summary

This report answers two questions for the SQL block (see issue #52): (1) does the learning-science evidence favor **animation** or **step-by-step static images** for teaching concepts, and when; (2) how do five strong SQL teaching sites — DataSchool (Chartio), Select Star SQL, SQLBolt, Julia Evans' zine, DataLemur — actually illustrate **GROUP BY, JOIN, window functions, CTEs and recursive CTEs**. Verdict up front: for SQL — abstract, symbolic, discrete table transformations — the evidence and the market agree more than expected. **Stepped statics under learner control are the right default; animation only earns its place as a pausable stepper for genuinely sequential processes (a sliding window frame, recursion iterations); and the single most valuable visual for CTEs and recursive CTEs does not exist anywhere in this survey — both are open ground.**

## 1. What the learning science says (primary sources read 2026-11-17)

**Höffler & Leutner (2007), meta-analysis, *Learning and Instruction*.** 26 studies, 76 comparisons: animation beats statics overall by **d = 0.37** — but the moderators decide everything. *Representational* animations (showing the actual content) d = 0.40; *decorational* animations **d = 0.05, not significant**. By knowledge type: procedural-motor d = 1.06 (only 5 comparisons, confounded with realistic video), declarative d = 0.44, **problem-solving d = 0.24 — the weakest category, and the one closest to writing queries**. The study excluded interactive animations, so it says nothing in favor of passive loops specifically.

**Tversky, Morrison & Bétrancourt (2002), "Animation: Can it facilitate?", *IJHCS*.** Reviewing the literature, animations routinely fail to beat *equivalent* statics; apparent wins trace to extra information or to interactivity and prediction bundled with the animation. Two principles: **Congruence** — the representation's structure must match the mental representation to be learned (motion only when change-over-time *is* the concept); **Apprehension** — the representation must be perceivable and comprehensible (animations are usually too fast and too complex). Their remedies: break the process into discrete steps, give the learner control, and ask for predictions.

**Mayer's multimedia program.** The **segmenting principle** (learner-paced segments beat continuous presentation; independent meta-analytic estimates: retention d ≈ 0.32, transfer d ≈ 0.36), **signaling** (cue what matters), **coherence** (cut decorative material). Directly on point: in Mayer, Hegarty, Mayer & Campbell (2005), annotated static diagrams beat narrated animation for explaining how a system works in **4 of 4 experiments** (median effect ≈ 0.57 favoring statics; reported here via Clark & Mayer's textbook summary, i.e. secondary).

**Transient information effect (cognitive load research).** Animation is transient: each frame vanishes, so learners must hold vanished states in working memory while processing new ones. Static graphics are permanent and re-inspectable. Castro-Alonso and colleagues (*Instructional Science*) found permanent presentations beat transient ones on an abstract-symbol task — SQL's exact content class. A re-analysis by Ploetzner and colleagues sharpens the boundary: animation's advantage (g = 0.34–0.65) appears only when **the specifics of the change itself** must be learned; when they are not, **g = 0.043** — nothing. Algorithm-visualization research (Hundhausen et al., 2002) adds that passive viewing gives no reliable benefit; engagement and prediction do.

**Applied to SQL:** a query's semantics are a small number of discrete state changes to a table (rows filtered, grouped, matched, accumulated). The states matter, not the motion between them — so the evidence predicts stepped statics ≈ or > animation, with two exceptions where the *path* is the concept: a window frame sliding across ordered rows, and a recursive CTE growing iteration by iteration.

## 2. What the five sites actually do (verified on the live pages, 2026-11-17)

| Concept | DataSchool | Select Star SQL | SQLBolt | Julia Evans (zine) | DataLemur |
|---|---|---|---|---|---|
| GROUP BY | **Animated GIFs**: rows sort into groups and collapse into counts; separate GIFs for COUNT(*) vs COUNT(col) on NULLs (visual book). Separately, an interactive PostgreSQL editor book (SQLBox) | Prose mental model ("shape of the table") + interactive in-browser exercises; one static chart | Type the query, watch the result table change; static numbered execution-order walkthrough | One hand-drawn input→query→output diagram per idea; HAVING gets its own page; separate worked example | **Excel pivot-table analogy** with real Sheets screenshots beside matching SQL output; before/after collapse tables |
| JOIN | **Animated GIFs of a physical scan**: build empty combined table, walk the key column, copy matching rows; separate GIFs for unmatched rows dropped and duplicate keys multiplying rows | Series of **static before/after diagrams** (match, unmatched, inner result, left result, duplicate multiplication); JOIN reframed as a combined table feeding FROM; no Venn diagrams | Prose key-matching definition — notably **no Venn diagrams**; learner "sees" the join by producing the combined table (exercise engine supports LEFT JOIN only) | Input table → query in a dashed bubble → output table diagrams; longest clause treatment in the zine (pp. 10–11) | Query built in **three narrated steps** over printed tables; annotated result screenshots with red boxes on unmatched rows |
| Window functions | **Signature "slow-motion" GIFs**: window frame grows row-by-row (running total), fixed 3-row window slides (moving average), partition splits weekend/weekday; static before/after tables around them | **Not covered** — its core "previous row" problem is deliberately solved with a self join instead | **Not covered** (absent from the 18-lesson list and topics index) | Covered (pp. 14–16) around one claim — "OVER() assigns every row a window"; diagrams + playground with ROW_NUMBER and LAG | A strength: **"virtual window" partition images** + row-by-row arithmetic narration (running sums spelled out per row, restarting per partition) |
| CTE | **Not covered** in either book's TOC | **Not covered** — nesting is always subqueries/derived tables | **Not covered** (topics index lists only Subqueries and Set operations) | **Not covered** — no WITH in TOC or playground; subqueries instead (p. 22) | Covered: one problem solved **twice in lockstep** — "Solution #1: Using CTE" vs "Solution #2: Using Subquery" step by step |
| Recursive CTE | Not covered | Not covered | Not covered | Not covered | **Mentioned only** — one sentence naming recursion as a CTE advantage (manager-hierarchy example); no lesson, no question tag |

Site models in one line each: DataSchool = two free archived books (interactive-editor book + GIF visual book, content last modified 2019–2021); Select Star SQL = free single-author interactive book, one real dataset (Texas executions), in-browser SQLite exercises, reference completeness deliberately refused; SQLBolt = 18 free lessons, one device only (type → result changes), no diagrams at all; Julia Evans = one $12 zine, *Become a SELECT Star!* (27 pp, SELECT reasoning only) + a free SQL Playground (SQLite in WebAssembly, preloaded with the zine's tables); DataLemur = interview-prep platform, free 33-lesson tutorial funneling into a graded, company-tagged question bank (Premium $15/mo or $60/yr).

## 3. The pattern across the market

1. **Every animation found is a passive, looping GIF.** None can be paused at a frame, stepped, or scrubbed — exactly the format the science rates weakest (transient, system-paced, apprehension risk). DataSchool's GIFs are the best teaching animations in the set, and even they leave control behind.
2. **All genuine learner control comes from running queries**, not from visuals: Select Star's and SQLBolt's in-browser execution, DataSchool's SQLBox, Evans' Playground. Visuals explain; execution confirms.
3. **The advanced end is empty.** CTEs are taught visually by exactly one site (DataLemur, for interview candidates, in PostgreSQL-interview framing); recursive CTEs are taught by none. Window functions — the one concept where motion genuinely matches the concept (Congruence) — get a real treatment only from DataSchool's GIFs and DataLemur's narration.
4. **Nobody combines the pieces**: stepped statics + prediction prompts + a runnable query on the same tables + a permanent record of all steps. That combination is what the evidence supports, and it is unoccupied.

## 4. Design rules for Data From Zero

Defaults for every SQL lesson visual (and reusable beyond SQL):

1. **Stepped statics are the default unit.** Each concept is a short sequence of static table frames — input → one change → next state → output — that the learner advances by click/tap (segmenting; apprehension). One change per frame, never two.
2. **All steps stay on the page.** A persistent strip of the frames (or a step rail) means no state ever vanishes — the direct counter to the transient information effect, and free re-inspection while answering the check question.
3. **Predict before reveal.** Before the step that shows a result, ask which rows survive / what the next value is (Tversky; Hundhausen). The check questions in issue #52's design slot in here naturally.
4. **Animation exists only as a stepper.** Where motion is used, it is the same frames auto-advancing with pause and scrub controls, learner-started, never an autoplay loop. No decorative motion anywhere (coherence; decorational d = 0.05).
5. **Consistent visual grammar.** Borrow the zine grammar (not the hand-drawn style): input table → the clause in a callout → output table; one consistent color per SQL clause across every lesson (signaling); page/section titles that state the takeaway as a claim.
6. **Every visual sits beside its runnable query** on the same café tables, so the learner runs the exact transformation they just stepped through (Select Star / Playground pattern).
7. **Mobile-first frames.** Steps stack vertically and stay legible on a phone; stepped statics are also the lightest format — relevant to the audience's metered connections (see issue #11).

Per-concept prescriptions:

- **GROUP BY** — stepped statics: rows visibly sort into group frames → each group collapses to one row. DataSchool's GIF proves learners want this movie; ours is the same movie, stepped and permanent. Final frame is the PivotTable the learner already knows from the Excel stage.
- **JOIN** — stepped statics with row highlighting: the match scan advances one key row per step (DataSchool's scan, learner-paced), with dedicated frames for the two traps — unmatched rows disappearing (INNER) or surviving with NULLs (LEFT), and duplicate keys multiplying rows. **No Venn diagrams** (they misrepresent joins; SQLBolt's prose-only approach and Select Star's table diagrams both avoid them).
- **Window functions** — the flagship and the one justified animation: a **stepper** in which the window frame advances one row per click across the ordered café sales, with the running arithmetic printed beside each step (DataLemur's narration device) and the partition boundary shown as a persistent frame. This is the concept where the change itself is the lesson (Congruence; Ploetzner's boundary), so motion — under learner control — earns its cost here.
- **CTE** — static pipeline diagrams: each CTE is one frame producing a named intermediate table, chained input → step → step → final (Evans' grammar, extended). Pair with DataLemur's solve-twice exercise pattern: the same café question answered once with nested subqueries, once with CTEs, frames side by side.
- **Recursive CTE** — stepped statics, iteration frames: anchor rows → iteration 1 → iteration 2 → …, a growing table strip with the newly added rows highlighted each round (e.g. a café chain's staff hierarchy or a category tree). No surveyed site teaches this at all; a clear stepped treatment is a first.
- **Execution order** (cross-cutting) — the static numbered walkthrough (SQLBolt's one diagram-like device; Evans' "queries don't start with SELECT" chart) rendered as a stepped frame sequence over one café query.

Explicitly not to do: autoplay GIF loops as the primary explanation of anything; video-first explanations for symbolic content; Venn diagrams for joins; visuals that show a transformation the learner cannot then run themselves.

## 5. Suggested action

Adopt §4 as the visual standard for the /sql/ build in issue #52: stepped-static frame sequences with prediction prompts and a persistent step rail as the default component; a learner-controlled stepper variant reserved for window functions and recursive CTEs; clause color-coding and the input→query→output grammar across all lessons. Cite DataSchool's window-function chapter and Evans' zine/playground as the deep-dive links for learners who want more; do not copy their images, GIFs or examples (all lessons here stay original, on the café dataset).

## Sources (all accessed 2026-11-17)

Learning science:
1. Höffler & Leutner (2007), "Instructional animation versus static pictures: A meta-analysis", Learning and Instruction 17(6) — manuscript: https://pure.eur.nl/ws/files/47916026/REPUB_101918.pdf
2. Tversky, Morrison & Bétrancourt (2002), "Animation: Can it facilitate?", Int. J. of Human-Computer Studies 57 — https://vis.csail.mit.edu/classes/6.859/readings/pdfs/Tversky-Animation.pdf
3. Castro-Alonso et al., transient vs permanent presentations (abstract-symbol task), Instructional Science — https://link.springer.com/article/10.1007/s11251-021-09541-w
4. Berney & Bétrancourt (2016), animation pacing meta-analysis (EARLI paper) — https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf
5. Mayer's multimedia principles (segmenting, signaling, coherence) — overview: https://wiki.ubc.ca/MET:Cognitive_Theory_of_Multimedia_Learning

Site survey:
6. DataSchool, How to Teach People SQL (visual book TOC) — https://dataschool.com/how-to-teach-people-sql/
7. DataSchool, How Aggregations Work (GROUP BY GIFs) — https://dataschool.com/how-to-teach-people-sql/how-sql-aggregations-work/
8. DataSchool, Inner Join Animated — https://dataschool.com/how-to-teach-people-sql/inner-join-animated/
9. DataSchool, How Window Functions Work — https://dataschool.com/how-to-teach-people-sql/how-window-functions-work/
10. DataSchool, Learn SQL: GROUP BY (SQLBox) — https://dataschool.com/learn-sql/group-by/
11. Select Star SQL (TOC + chapters) — https://selectstarsql.com/ ; The Long Tail (GROUP BY): https://selectstarsql.com/longtail.html ; Execution Hiatuses (JOIN): https://selectstarsql.com/hiatuses.html
12. SQLBolt (lesson list + topics index) — https://sqlbolt.com/topics ; execution order lesson: https://sqlbolt.com/lesson/select_queries_order_of_execution
13. Julia Evans, Become a SELECT Star! (zine + TOC) — https://wizardzines.com/zines/sql/ ; announcement: https://jvns.ca/blog/2020/02/03/new-zine--become-a-select-star/
14. Julia Evans, "SQL queries don't start with SELECT" — https://jvns.ca/blog/2019/10/03/sql-queries-don-t-start-with-select/
15. Julia Evans, SQL Playground — https://sql-playground.wizardzines.com/
16. Julia Evans, "How I write useful programming comics" — https://jvns.ca/blog/2020/12/05/how-i-write-useful-programming-comics/
17. DataLemur SQL tutorial index — https://datalemur.com/sql-tutorial ; GROUP BY: https://datalemur.com/sql-tutorial/sql-group-by ; JOINs: https://datalemur.com/sql-tutorial/sql-joins-inner-outer-left-right ; CTE vs subquery: https://datalemur.com/sql-tutorial/sql-cte-subquery ; window functions: https://datalemur.com/sql-tutorial/sql-aggregate-window-functions

Template fields: Type = Curriculum gap. Priority = Medium. Confidence = High for the survey (every page opened 2026-11-17; absences evidenced by full tables of contents) and High for the direction of the science verdict; two science figures are flagged in §1 as secondary-reported (the Mayer et al. 2005 median via Clark & Mayer; segmenting effect sizes via a later meta-analysis), and the Ploetzner re-analysis and Hundhausen results are reported from the research file's reviewed summaries. Affected pages: /sql/ (stage route; no SQL lesson pages in the sitemap yet).

## Evidence

- https://pure.eur.nl/ws/files/47916026/REPUB_101918.pdf (accessed 2026-11-17): Höffler & Leutner (2007), "Instructional animation versus static pictures: A meta-analysis", Learning and Instruction 17(6).
- https://vis.csail.mit.edu/classes/6.859/readings/pdfs/Tversky-Animation.pdf (accessed 2026-11-17): Tversky, Morrison & Bétrancourt (2002), "Animation: Can it facilitate?", Int. J. of Human-Computer Studies 57.
- https://link.springer.com/article/10.1007/s11251-021-09541-w (accessed 2026-11-17): Castro-Alonso et al., transient vs permanent presentations (abstract-symbol task), Instructional Science.
- https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf (accessed 2026-11-17): Berney & Bétrancourt (2016), animation pacing meta-analysis (EARLI paper).
- https://wiki.ubc.ca/MET:Cognitive_Theory_of_Multimedia_Learning (accessed 2026-11-17): Mayer's multimedia principles (segmenting, signaling, coherence) — overview.
- https://dataschool.com/how-to-teach-people-sql/ (accessed 2026-11-17): DataSchool, How to Teach People SQL (visual book TOC).
- https://dataschool.com/how-to-teach-people-sql/how-sql-aggregations-work/ (accessed 2026-11-17): DataSchool, How Aggregations Work (GROUP BY GIFs).
- https://dataschool.com/how-to-teach-people-sql/inner-join-animated/ (accessed 2026-11-17): DataSchool, Inner Join Animated.
- https://dataschool.com/how-to-teach-people-sql/how-window-functions-work/ (accessed 2026-11-17): DataSchool, How Window Functions Work.
- https://dataschool.com/learn-sql/group-by/ (accessed 2026-11-17): DataSchool, Learn SQL: GROUP BY (SQLBox).
- https://selectstarsql.com/ ; https://selectstarsql.com/longtail.html ; https://selectstarsql.com/hiatuses.html (accessed 2026-11-17): Select Star SQL (TOC + chapters); The Long Tail (GROUP BY); Execution Hiatuses (JOIN).
- https://sqlbolt.com/topics ; https://sqlbolt.com/lesson/select_queries_order_of_execution (accessed 2026-11-17): SQLBolt (lesson list + topics index); execution order lesson.
- https://wizardzines.com/zines/sql/ ; https://jvns.ca/blog/2020/02/03/new-zine--become-a-select-star/ (accessed 2026-11-17): Julia Evans, Become a SELECT Star! (zine + TOC); announcement.
- https://jvns.ca/blog/2019/10/03/sql-queries-don-t-start-with-select/ (accessed 2026-11-17): Julia Evans, "SQL queries don't start with SELECT".
- https://sql-playground.wizardzines.com/ (accessed 2026-11-17): Julia Evans, SQL Playground.
- https://jvns.ca/blog/2020/12/05/how-i-write-useful-programming-comics/ (accessed 2026-11-17): Julia Evans, "How I write useful programming comics".
- https://datalemur.com/sql-tutorial ; https://datalemur.com/sql-tutorial/sql-group-by ; https://datalemur.com/sql-tutorial/sql-joins-inner-outer-left-right ; https://datalemur.com/sql-tutorial/sql-cte-subquery ; https://datalemur.com/sql-tutorial/sql-aggregate-window-functions (accessed 2026-11-17): DataLemur SQL tutorial index; GROUP BY; JOINs; CTE vs subquery; window functions.

## Affected datafromzero pages

/sql/ (stage route; no SQL lesson pages exist yet)

## Suggested action

Adopt §4 as the visual standard for the /sql/ build in issue #52: stepped-static frame sequences with prediction prompts and a persistent step rail as the default component; a learner-controlled stepper variant reserved for window functions and recursive CTEs; clause color-coding and the input→query→output grammar across all lessons. Cite DataSchool's window-function chapter and Evans' zine/playground as the deep-dive links for learners who want more; do not copy their images, GIFs or examples (all lessons here stay original, on the café dataset).

## Priority

Medium - outdated but still correct, or a clear beginner-level gap

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

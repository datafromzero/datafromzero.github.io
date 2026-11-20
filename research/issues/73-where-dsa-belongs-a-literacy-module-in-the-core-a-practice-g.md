# #73 Research: Where DSA belongs — a literacy module in the core, a practice gym beside the tracks

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/73 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#73](https://github.com/datafromzero/datafromzero.github.io/issues/73) (open), opened 2026-11-19

## Type

Curriculum gap

## Summary

DSA — the hardest, most practice-hungry item in the roadmap — placed by evidence. Demand splits in two: on the job all four roles use library implementations plus cost intuition (hashing behind GROUP BY/joins is the load-bearing idea); interviews demand hand-implementation and formal Big-O unevenly — MLE at big tech faces a named "Coding (DSA/Implementation)" round at LeetCode-medium fluency (interviewing.io; TIH rubric), DE is split (Meta's official guide: timed SQL + coding screens; Dataquest's DE path teaches implemented linked lists/queues/stacks and formal complexity), DS is gated mainly by SQL + statistics, and no source documents any DSA round for DA. The §8.2 cut (no hand-implemented structures, no formal Big-O in the core) therefore HOLDS for the core — the core's a-feel-for-scale lesson already carries the transferable part — and breaks only at MLE-big-tech and DE, which are track-shaped problems. Fluency costs 75–450 problems over 6 weeks–6 months plus spaced review (Day 1/4/11/30), so DSA cannot live in lessons: the recommendation is one short literacy module in the core (10 concepts; dict/set at use depth, the rest recognition; graph added deliberately — Dataquest omits it, Airflow DAGs demand it) as the front door to a parallel practice gym (Tier 1: ~30–40 café Colab drills; Tier 2: curated NeetCode ladder, DP last; Tier 3: DataLemur for DA/DE season), with per-track finish lines instead of four curricula. §3 of the report records eight open questions for the owner–team design brainstorm, as requested. Full report in the Evidence field.

## Evidence

## Where DSA Belongs: Research Report

**Purpose.** Data structures and algorithms (DSA) is the hardest item left unplaced in the roadmap: genuinely difficult, and famously hungry for practice. This report answers three questions: what do the four roles (DA, DE, DS, MLE) actually need — split into *on the job* versus *in interviews*; does the curriculum package's earlier cut (§8.2: no hand-implemented sorting/data structures, no formal Big-O in the core path) survive the evidence; and where, structurally, should DSA live in a roadmap of static lessons, Colab notebooks and one café dataset?

**Method.** Two research lines, all sources opened 2026-11-19: (H) demand by role — employer-official material (Meta's data-engineering interview guide), Tech Interview Handbook and its FAANG coding rubric, interviewing.io's MLE guide, DataLemur's role interview guides, and Dataquest's Data Engineer path as the curriculum witness; (I) pedagogy and placement — the practice models of NeetCode, LeetCode study plans, Educative's pattern taxonomy, Striver's A2Z sheet, spaced-review practice, and the placement choices of Dataquest, OSSU, CS50x vs CS50P, Kaggle Learn and DataLemur. Working files: `cluster-h-dsa-demand.md`, `cluster-i-dsa-pedagogy.md` in this folder.

**How to read the labels.** Unmarked statements are findings from the named sources. **[Recommendation]** marks design choices. Community/anecdotal evidence is labelled **[community]**, and evidence gaps are stated as gaps.

---

## 1. The findings

**1. DSA demand splits cleanly in two — and the two halves want different things.** On the job, all four roles mostly *use* library implementations and need cost intuition: hashing behind GROUP BY and joins, heaps behind top-k, queues as pipeline shapes, trees and graphs as data shapes. In interviews — unevenly, and worst at big tech — the demand flips to hand-implementation and formal complexity analysis that daily work rarely requires. Any placement decision that ignores this split will either under-prepare candidates for big-tech loops or tax every learner for a gate only some employers impose.

**2. The single most valuable DSA idea in data work is the hash map — and learners already use it daily.** GROUP BY, joins, deduplication, `value_counts()` and dict lookups are all hashing underneath. Dataquest's DE-path guided project "Building Fast Queries on a CSV" teaches exactly this: build dictionary-based indices so queries stop scanning. A learner who understands "a dict turns a repeated scan into a lookup" owns the load-bearing structure of data work — at use-the-library depth, no hand-implementation required.

**3. The demand matrix, per role.** Depths: R = recognize, U = use library with cost intuition, I = implement by hand, L = LeetCode-medium fluency.

| Role | On the job | Interviews, typical companies | Interviews, big tech |
|---|---|---|---|
| DA | R→U | Not tested — the documented gate is a SQL assessment (DataLemur) | Not tested — same SQL-first picture |
| DE | U, plus I for a small core set | U — SQL fluency + data-shaped coding (DataLemur; Meta's official guide: timed SQL + coding screens) | I approaching L in some loops; a FAANG-landed DE reports a ~170–186-problem grind **[community]** |
| DS | U | R→U — data-shaped Python; the binding gates are SQL speed and statistics | U; rises toward I/L only for research/applied DS routed through SWE-style loops (by analogy — no DS-specific DSA round documented) |
| MLE | U→I | U→I, **weakly documented — an evidence gap, stated as such** | L — a named "Coding (DSA/Implementation)" round is a standard loop component (interviewing.io), scored with formal complexity analysis (TIH rubric); some research teams skip it |

No source opened documents any DSA round for DA at any company tier. MLE at big tech is the extreme case; DE is the split case (SQL + data-shaped coding first, DSA second but real).

**4. The §8.2 cut survives — as a core decision. It breaks in exactly two places, both of them track-shaped.** Half 1 (no hand-implementation in the core) holds for all four roles: even interview guidance (TIH) says interviewers do not expect sorting implemented from scratch, and on-the-job demand tops out at library use for DA/DS. Half 2 (no formal Big-O in the core) holds *because* the core already replaced it with cost intuition — issue #71's `a-feel-for-scale` lesson teaches the transferable part (growth shapes, fear the nested loop, trade memory for speed — the same three objectives Dataquest names for its algorithms course). The cut breaks as a *roadmap-wide* statement at **MLE at big tech** (named DSA round, LeetCode-medium fluency, scored Big-O) and **DE as taught by serious curricula** (finding 5). In both cases the demand is role-specific, employer-tier-specific, and practice-volume-shaped — the definition of track material. Taxing 100% of learners in the core for it would still under-deliver, because notation is not fluency.

**5. The strongest placement evidence is Dataquest's own DE path.** A mainstream commercial curriculum for data people (9 parts, 30 courses) places *Introduction to Algorithms* at Part 2 and *Introduction to Data Structures* at Part 6 — with objectives including implementing linked lists, queues, stacks and dictionaries, and formal time/space complexity analysis — **inside the DE path**, not in a shared beginner core, and not at the same depth in its DA/DS paths. A provider with hiring outcomes on the line arrived independently at track placement for the deep material.

**6. Fluency has physics: 75–450 problems, 6 weeks to 6 months, near-daily practice, plus spaced review.** Every credible practice model (NeetCode's pattern roadmap, LeetCode's study plans, Educative's 14 patterns, Striver's sheet) converges on that volume, and the retention mechanism is a re-solve rhythm (Day 1/4/11/30 in the models cluster I reviewed). A lesson is a static page finished in one sitting; **fluency cannot be a lesson — it can only be a habit with a home.** This, more than difficulty, is why DSA does not fit the main path's shape.

**7. Four candidate homes were assessed; the answer is a composite with one clear home.** (i) *A literacy module in the core alone* fits the machinery perfectly but manufactures false confidence — recognition sold as "DSA covered" collapses at the first timed Medium. (ii) *A parallel practice gym beside the tracks* is the only shape that matches how DSA is actually acquired — drill decks and a pattern ladder as static pages plus Colab notebooks, where known-answer checking works better than for any other topic (a function passes the hidden tests or it does not) — but optional things get skipped, so the gym must be wired into the tracks, not offered as an extracurricular. (iii) *Per-track curricula* quadruple the owner's authoring load to serve a ~20% difference: the pattern core is role-blind in both the NeetCode (18 categories) and Educative (14 patterns) taxonomies — differentiation is real but it is a difference of *finish line*, not of content. (iv) *A curated external path alone* has the highest quit risk of the four: it exports Office-background beginners to a raw 4,000+ problem bank with no literacy on-ramp and breaks the roadmap's one-path promise.

**8. The minimal literacy set is ten items — mostly recognition, two at use depth.** Dict and set at **use** (learners already have both from the Python stage; the literacy is naming the cost); stack, queue/deque, heap/priority queue, tree, graph and recursion at **recognize** (one plain sentence each, café-anchored: top-10 products from an order stream for the heap; menu categories and JSON nesting for the tree); sorting/searching costs as **intuition only** (binary search halves; sorting isn't free; list scans are the slow path — continuous with `a-feel-for-scale`, no formal Big-O, honouring §8.2); linked list **recognize-only** — deliberately shallower than Dataquest, which teaches its implementation. One deliberate addition beyond Dataquest's list: **graph**, which Dataquest omits — a DE learner meets DAGs in week one of Airflow, and DS learners meet networks and recommendations. Explicitly *not* in the set: dynamic programming, tries, union-find, balanced-tree internals, hand-implemented sorting — interview-only or already cut. Two patterns ride along in the gym's first tier rather than the core: two pointers and sliding window — the latter has a direct echo learners already know (rolling windows in SQL and pandas), making it the cheapest real pattern to teach a data audience.

**9. Honesty limits of this research.** Typical-company MLE interview demand is an **evidence gap** — sources opened document the big-tech loop well and typical employers barely at all; the matrix says so rather than guessing. The one FAANG-DE problem-count figure is a single community anecdote, labelled. A widely circulated "Google interview guide" PDF is a LeetCode Discuss community copy, not an employer document, and was excluded. Where DS-at-big-tech depth is marked as rising, it is by analogy to the SWE/MLE loop, and is labelled as such in cluster H.

---

## 2. Recommended design [Recommendation]

**Core — one short literacy module (1–2 lessons), §8.2 preserved.** The ten-item set of finding 8 at recognize/use depth, café-flavoured, extending `a-feel-for-scale` rather than competing with it, and framed on the page as *the map, not the territory*: its job is to make the gym's ladder readable. No hand-implemented sorting, no formal Big-O — the cut stands as written.

**The gym — DSA's real home.** A standalone practice space linked from the end of the core and from every track page, in three tiers:

- **Tier 1 — ours.** ~30–40 café-flavoured drills in Colab (dict/set/stack/queue/heap/two-pointers/sliding-window shapes on café data), known-answer checked, sized to what one author can write and verify.
- **Tier 2 — curated external ladder.** NeetCode categories in roadmap order (Arrays & Hashing → Trees → Heap → Graphs), each rung named, ordered and annotated (including where NeetCode hosts free versions of premium-walled problems); dynamic programming last, flagged DS/MLE-leaning.
- **Tier 3 — interview season.** DataLemur-style applied practice for DA/DE (SQL-first, as the demand evidence says those interviews actually are).

The gym's first page prints the **spaced-review protocol** (solve → re-solve Day 4 → Day 11 → Day 30): a static site cannot enforce the habit, but it can specify it.

**Finish lines, not four curricula.** Each track page states its line in one sentence: **DA** → literacy module + Tier 1 (and an open statement that DSA is the smallest part of a DA interview — no anxiety grinding); **DE** → + Tier 2 through Graphs, plus the implement-by-hand basics (linked list, stack, queue, hash table) and formal Big-O as the DE tier of the gym, Dataquest-shaped; **DS** → + Tier 2 full, weighted to data-shaped problems; **MLE** → + Tier 2 full including DP, timed practice, complexity named in self-checks. Every tier carries an **honesty label** naming the employer tier it prepares for, so learners aiming at typical companies can stop at the core with a clear conscience.

**Net effect on the roadmap:** core +1–2 lessons (37 → 38–39 if issues #71 and #72 are adopted); one new practice space; zero new track curricula.

---

## 3. Open questions for the design brainstorm

Recorded at the owner's request, for study together with the full cluster files before any structure is committed:

1. **Gym vs track pages.** This report's synthesis puts one shared gym beside the tracks with per-track finish lines (cluster I's model); cluster H's instinct was interview-craft modules *inside* each track. The synthesis argues the gym is where those modules live — but the counter-proposal, with an authoring-cost estimate for both shapes, is wanted.
2. **Where the gym lives in the site.** A third space beside Learn and Reference? A section under Reference? URL and SPEC §3 implications — published URLs never change, so this choice is permanent.
3. **A new page type.** SPEC §5.1's lesson fields do not fit a drill deck (a deck has a pattern, a tier, a re-solve schedule, not a narrative). Does the gym need its own schema, and what are its fields?
4. **Checking drills in Colab.** Known-answer checking for code drills needs hidden tests (the learntools lessons of issue #66 apply: adversarial cases, the run-from-the-top ritual, the documented false-pass failure). What is the house pattern — one checker cell per drill notebook?
5. **Tier 1 scope and order.** 30–40 drills is the proposal; which patterns, in what order, all café-flavoured? Two pointers and sliding window first (the rolling-window echo), or hash-map shapes first (the highest work value)?
6. **Spaced review on a static site.** Print the Day 1/4/11/30 protocol and trust the learner, or is there a lightweight mechanism compatible with the lessons-are-static rule (the gym is not lessons — may it differ)?
7. **Sequencing.** The literacy module is core content (Milestone 8 lesson writing); the gym is a new build. Which comes first, and does the core module's publication wait for the gym to exist, since the module's framing points at it?
8. **Naming.** The gym needs a learner-facing name that says "practice, optional-but-wired-in" without saying "interview cram" — the honesty labels carry the employer-tier message; the name carries the invitation.

---

## 4. Sources (all accessed 2026-11-19)

**Demand (cluster H).** Meta, Data Engineering interview preparation guide (official, Meta CDN PDF). Tech Interview Handbook — coding interview preparation and FAANG coding-interview rubrics — techinterviewhandbook.org. interviewing.io, "Becoming an MLE at FAANG" guide — interviewing.io. DataLemur — SQL interview guide; Data Engineer, Data Scientist (Meta/Amazon/Microsoft) interview guides — datalemur.com. Dataquest — Data Engineer path page (Parts 2 and 6 course objectives), Python course catalogue, "The Data Engineer Roadmap for Beginners" (updated 2026-11-12) — dataquest.io. LeetCode Discuss — one FAANG-DE preparation account **[community, single anecdote]**.

**Pedagogy and placement (cluster I).** NeetCode roadmap — neetcode.io/roadmap. LeetCode study plans — leetcode.com/studyplan. Educative, Grokking the Coding Interview pattern taxonomy — educative.io. Striver's A2Z DSA sheet — takeuforward.org. Dataquest DE path (placement: algorithms Part 2, data structures Part 6) — dataquest.io. OSSU Computer Science curriculum (front-loaded DSA courses, as contrast) — github.com/ossu/computer-science. Harvard CS50x (data-structures week) vs CS50P (none) — cs50.harvard.edu. Kaggle Learn course catalogue (no DSA — the data-platform verdict) — kaggle.com/learn.

## Affected datafromzero pages

none yet — the literacy module belongs to the advanced core stage (no core pages live; sitemap checked 2026-11-18) and the practice gym would be a new space whose URL is itself one of the open questions in §3; no existing page changes.

## Suggested action

Adopt the placement in §2 for curriculum planning: (1) add one short DSA literacy module (1–2 lessons) to the advanced core beside a-feel-for-scale, §8.2 unchanged; (2) plan the practice gym as a standalone space with the three tiers and the printed spaced-review protocol, wired into every track page; (3) state per-track finish lines (DA: literacy + Tier 1; DE: + Tier 2 through Graphs + implement-by-hand basics + formal Big-O; DS: + Tier 2 full, data-shaped; MLE: + Tier 2 full incl. DP, timed) with employer-tier honesty labels. Resolve the eight open questions in §3 in the design brainstorm before any build brief is written. Lesson and drill prose remains the owner's.

## Priority

Medium - outdated but still correct, or a clear beginner-level gap

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

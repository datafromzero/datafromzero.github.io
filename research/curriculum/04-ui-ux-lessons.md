# 04 — UI/UX Lessons

**Project:** Data From Zero — free, visual-first, bilingual-ready (English root, /vi/ section); one static site, two spaces (Learn = spacious study layout; Reference = dense book layout)
**Path shape:** Excel → SQL (one complete block) → Python → advanced core → five tracks (Data Analyst, Data Engineer, Data Scientist, Analytics Engineer, ML/AI Engineer)
**Purpose:** The single canonical guide for how the site itself teaches: what its pages, navigation, and visuals must do so that a beginner chooses the right starting point fast, sees the whole syllabus before committing, and learns concepts visually — faster and clearer than the paid incumbents.
**Evidence basis:** A first-time-visitor audit of seven incumbent platforms' public pages (all accessed 2026-11-15; no accounts created, no paywalls crossed) plus a visual-teaching technique catalog distilled from the best visual explainers on the web (same access date). Judgments tied to the audit name the platform and page. Build rules for the static stack are marked [Recommendation] — they are design targets for Data From Zero, not measured facts about any external site.
**Canonical ownership (per the Wave 4 dedupe map):** This file owns site-level UX patterns (from the audit) and concept-level visual techniques (from the visual-teaching research). The lesson template that consumes the visuals belongs to 03-teaching-playbook; topic inventories belong to 02-syllabus-inventory; all /vi/ language rules belong to 03-teaching-playbook Section 8.

**How Data From Zero is judged** (the project's standing standard): beating the incumbents on clarity, visual/intuitive teaching, time-to-skill, and career outcomes. Every section below is written against those four tests.

---

## 1. What the audit found — scores and the two poles

The audit scored seven platforms on four dimensions (1–5): beginner clarity (can a total beginner find the right starting point fast), syllabus transparency (how much of the actual content is visible before committing), visual teaching aids (diagrams, interactives, and worked visuals as teaching tools), and friction (5 = almost no friction; 1 = heavy walls and upsell pressure). Scores from the audit table, reproduced exactly:

| Platform | Beginner clarity | Syllabus transparency | Visual teaching aids | Friction (5 = least) |
|---|---|---|---|---|
| DataCamp | 4 | 4 | 4 | 3 |
| Coursera | 3 | 3 | 2 | 2 |
| freeCodeCamp | 4 | 5 | 3 | 5 |
| Dataquest | 5 | 4 | 4 | 4 |
| Codecademy | 4 | 4 | 4 | 3 |
| Kaggle Learn | 3 | 3 | 4 | 5 |
| roadmap.sh | 3 | 5 | 5 | 5 |

Two poles define the open position:

- **The clarity benchmark: Dataquest.** The clearest beginner information architecture among the paid platforms (beginner clarity 5, the audit's only 5 on that dimension). Its homepage separates Career paths from Skill paths and labels each path card with exactly the metadata a beginner needs to choose — skill tags, course count, project count, realistic duration, enrolled-learner count, and honest sorting labels such as "Best for Beginners" — with the Data Analyst path explicitly tagged best for beginners. Its free-trial terms are the most honestly stated in the audit ("No credit card required," stated in the FAQ and again at the footer), including realistic completion math (at a stated weekly pace, most learners finish a career path in a matter of months, expressed as a range). What to copy in spirit is in Section 3; its gaps — no price on the homepage, an unsubstantiated speed claim in its page title, salary-forward card labels that steer by pay rather than fit, and a text-only lesson format — are in Section 4.
- **The map-teaches-nothing gap: roadmap.sh.** The strongest single visual artifact in the audit — a whole-journey node chart, scored 5 for visual teaching aids *as a map* — paired with the audit's central negative finding: the chart tells the learner *what* to learn and *in what order*, but teaches nothing by itself. It is a map, not a lesson; every node is a doorway to external resources. The page gives no time estimates, no difficulty gradient, and no "you are here / what next" teaching guidance, and its accompanying text is thorough but generic guide prose that buries the map. Kaggle Learn is the mirror image: excellent free courses presented as a flat menu with no sequence, no prerequisites, and no visual model of how the pieces connect (beginner clarity 3).

**The open position, in one sentence:** a visual map whose every node opens a real, visual, bite-size lesson in a set order — roadmap.sh's map, plus the simulations and step-through visuals of the best visual explainers, all in one shared visual grammar, free, with the full syllabus visible before any commitment. No audited incumbent occupies it. Sections 2–3 specify the site patterns that claim it; Sections 5–7 specify the visuals.

A note on the scores' limits: the audit is a public-pages pass. Pricing pages for three platforms, one platform's path page, and one platform's individual course page were not retrieved in that pass, and the roadmap chart's interactive layer could not be read as text — so pricing statements in this file rely only on figures printed on pages that were opened, and are labeled accordingly in Section 4.

---

## 2. Site patterns to adopt — copy in spirit

Each pattern names its source platform and the page the audit opened (2026-11-15). "Copy in spirit" means: adopt the pattern's function, in Data From Zero's own design — never the platform's copy, artwork, or page text.

1. **Path cards with decision metadata (Dataquest — homepage).** Every path labeled with skills, course count, project count, realistic duration, and a plain-English tag ("Best for Beginners") on the homepage itself — a beginner can choose without clicking anything. Data From Zero applies this at two levels: the five tracks after the core, and the stages of the linear path itself, each card carrying the same metadata fields.
2. **Full syllabus visible before commitment (freeCodeCamp — curriculum page; roadmap.sh — Data Analyst roadmap page).** The complete ordered curriculum readable with no account; signing in — where it exists at all — saves progress and never unlocks content. On Data From Zero there is nothing to unlock: every lesson, exercise, and answer layer is public. This is the transparency standard the whole site is held to.
3. **A whole-journey visual map (roadmap.sh — homepage and Data Analyst roadmap).** One spatial chart showing the entire path at once — the natural centerpiece for a site whose premise is a roadmap. Adopted as *navigation*, with the audit's correction built in: the map is the table of contents, not the teaching. Every node opens a real lesson on this site (Section 4, item 7).
4. **Course-page anatomy: outcomes + prerequisites + outline + rating (DataCamp — Introduction to Python course page).** The strongest course page in the audit: a plain-language description, a "What you'll learn" list written as observable skills, an explicit "Prerequisites: none" line, a numbered chapter outline, a public rating with review count, and a long beginner FAQ. Data From Zero's lesson/stage pages adopt the anatomy — observable-skill outcomes, an explicit prerequisites line (including "none"), a numbered outline — and improve on its one weakness: the audit found lesson-level detail and exercise counts hidden until enrollment there; here, lesson titles, exercise counts, and durations are public on the stage page itself.
5. **Facts box with honest time math (Codecademy — Learn Python 3 course page; Dataquest — homepage).** Level, hours, and project counts up front — including one incumbent's footnote that its hour figure is an average from combined completion rates, and the other's hours-per-week-to-months conversion. Data From Zero states, on every stage page: level, estimated hours, lesson count, project count, and the pace assumption behind any months figure. An estimate without its assumption does not ship.
6. **Cited outcome statistics (Dataquest — homepage; Coursera — Google Data Analytics certificate page).** Salary and outcome claims carrying named sources and dates instead of bare numbers — trust that survives a skeptical reader. Data From Zero prints no outcome, salary, or demand figure without its source and date beside it, and prints none at all where no source was opened. (The demand figures themselves live in the career material, not in this file.)
7. **Goal-based entry (Coursera — homepage).** A short intent picker ("What brings you here?") that routes by goal rather than by catalog taxonomy. Data From Zero's version routes to a *starting point on the one linear path* — including the test-out entry for experienced learners (see 03-teaching-playbook Section 5.2) — not to different catalogs. One path, several doors.
8. **Learn-by-doing from lesson one, no setup (Dataquest — homepage; Kaggle Learn — course list page).** Hands-on exercises against real datasets in the first minutes, with small, real early wins ("usable skills in a few hours" scoping). On a static site, doing is routed through in-page self-check mechanics and linked free environments; the first lesson of every stage produces a working result — a real query, a real chart — inside the lesson (see 03-teaching-playbook Section 2).
9. **Anti-hype honesty (freeCodeCamp — homepage).** Telling beginners mastery takes years and not to quit their day job — credibility as a brand asset, and a differentiator against every paid rival's timeline marketing. Data From Zero shows the whole road and its realistic length up front, and never prints a speed multiplier or a job-readiness deadline it cannot source.
10. **Freshness dates on content (roadmap.sh — Data Analyst roadmap page).** Published and updated dates displayed on the page — cheap to do, almost nobody does it. Every lesson and stage page on Data From Zero carries its last-updated date; the roadmap page carries one per stage.

Two further structural patterns from the audit's platform notes, adopted as site rules:

- **One recommended linear curriculum (freeCodeCamp).** A single ordered path — Excel → SQL → Python → core → tracks — with "start at the beginning" as the default advice. No catalog maze, no filtering, no decision fatigue. Personalization is limited to entry point (pattern 7) and test-out, never to a different order.
- **Progress without an account (Kaggle Learn, freeCodeCamp, roadmap.sh — all friction 5).** Content requires no signup; progress lives in the browser. The audit's friction leaders are all free and wall-less; Data From Zero matches that exactly and says so on the homepage.


---

## 3. The clarity standard — what "beating Dataquest" concretely means

Dataquest's 5 is the number to beat, and the audit shows both why it earned it and where it stops. Data From Zero's clarity standard is Dataquest's metadata discipline, extended past the homepage into the lesson itself:

| Clarity element | Incumbent best (audit) | Data From Zero standard [Recommendation] |
|---|---|---|
| Choosing a path | Path cards with skills, counts, duration, and a beginner tag, on the homepage | Same metadata on every stage and track card — plus the prerequisite line and the "what you will be able to do" list in observable-skill language, on the card or one click from it |
| Knowing the cost | Free tier and trial terms stated plainly; paid price absent from the homepage | No price exists. The homepage states "free, all of it" where incumbents state nothing (Section 4, item 2) |
| Knowing the time | Hours-per-week-to-months conversion, stated as a range | The same conversion on every stage page, with the pace assumption printed next to the estimate (pattern 5, Section 2) |
| Knowing what a lesson feels like | Method explained up front ("read a concept, immediately apply it; no videos") | Method explained up front *and* demonstrated: the first lesson of each stage is itself the sample, fully public, visuals included — no enrollment-shaped sample exists because there is no enrollment |
| Knowing what comes next | An always-visible "what to learn next" inside paths | The linear path is always visible: the roadmap map (navigation form) sits one click from every lesson, with "you are here" marked from browser-stored progress |
| Trusting the numbers | Outcome stats with named sources and dates | The same sourcing habit, applied to *every* number on the site — including the site's own time estimates, which carry their assumptions instead of a source |

Where Dataquest stops, per the audit and its reviews: the lesson format is text-only, and learners who need to *see* a process before doing it stall — joins, grouping, and window functions are processes, and text alone underserves them. That is precisely the clarity gap Sections 5–7 close: the same metadata honesty, plus a canonical visual inside every hard lesson.

---

## 4. Patterns to beat / avoid

Each item names the pattern, the platform(s) the audit found it on (pages accessed 2026-11-15), and the counter-design. These are the site's anti-requirements: a design review that finds any of them on Data From Zero has found a defect.

1. **Auto-subscription traps (Coursera).** Enrolling in one course silently subscribing the learner to a whole paid certificate — admitted in that platform's own FAQ, and the audit's clearest dark pattern. *Counter-design:* there is nothing to subscribe to, and the site says so. No accounts gate content; no trial exists to convert.
2. **Hidden pricing (DataCamp, Dataquest, Codecademy).** Homepages that say "free" loudly and a price nowhere; one platform's full price discoverable only in page metadata, its projects, quizzes, and certificate revealed as paid in a bottom-of-page upsell block. *Counter-design:* a free site weaponizes this contrast — "free, all of it, forever" stated where rivals state nothing, including on the pages for the parts incumbents paywall (projects, checkpoints, review sets).
3. **Catalog overload as a feature (Coursera, Codecademy, roadmap.sh).** A five-figure course count marketed as value, four overlapping product types a beginner cannot distinguish, dozens of undifferentiated roadmap links — abundance while beginners drown. *Counter-design:* one curated linear path with progressive disclosure. The homepage offers a starting point, not a catalog; the full syllabus is one page, fully visible (transparency is not the same as overload — the syllabus is a single ordered list, not a searchable marketplace).
4. **B2B-first homepages (DataCamp, Codecademy).** Enterprise pitches occupying the top of the page an individual beginner lands on. *Counter-design:* the learner is the only audience the homepage addresses. There is no teams pitch above the path cards — there is no teams pitch at all.
5. **Marketing page before curriculum (Coursera).** A certificate page that is overwhelmingly persuasion and FAQ before any inspectable syllabus. *Counter-design:* invert the ratio — syllabus and first lesson first, persuasion minimal. A stage page's first screen is its outline and its first lesson's opening, not an outcome claim.
6. **Unsubstantiated speed claims (Dataquest).** A "learn 10x faster"-style claim in a page title, undercutting the same page's well-cited statistics. *Counter-design:* never print a multiplier that cannot be sourced. Time-to-skill is improved by design (Section 8) and described with sourced comparisons or not at all.
7. **Map without teaching (roadmap.sh) and menu without a path (Kaggle Learn).** One shows everything and teaches nothing on the page; the other lists excellent free courses with no sequence, prerequisites, or journey. *Counter-design:* the gap between them is the product — a visual map whose every node opens a real, visual, bite-size lesson in a set order, with prerequisites and durations on the map's stage pages. A node that links off-site as its primary content is a defect.
8. **Gamification as pressure (DataCamp).** XP totals and streak mechanics foregrounded in marketing — motivating for some, manipulative-feeling for others, and (per the pedagogy research) a completion-contingent reward structure that optimizes for lesson completion over retention. *Counter-design:* progress without loss-aversion mechanics — visible checkmarks on the map and a verifiable ability list beat a streak that punishes a missed day. Any streak-like mechanic, if ever used, includes forgiveness by default.
9. **Video-first passivity (Coursera).** The largest incumbent's core medium is watching lectures; its public pages show almost no interactive or diagrammatic teaching aids (visual teaching aids 2, the audit's lowest score). *Counter-design:* interactive-first — progress requires producing something (see 03-teaching-playbook), and every hard concept carries a manipulable or steppable visual (Sections 5–7). Video is never the primary vehicle for a concept.
10. **Text-wall presentation (freeCodeCamp).** Total transparency delivered as an unadorned list — no durations, no difficulty signals, no visual hierarchy (visual teaching aids 3 despite transparency 5). *Counter-design:* transparency deserves design effort. The unclaimed combination is that platform's openness *plus* Dataquest's card metadata *plus* roadmap.sh's map — which is exactly Sections 2–3 of this file.

Two audit observations that are annoyances rather than dark patterns, recorded so the build avoids them by default: a cookie-consent banner as the first thing a course-list page shows (Kaggle Learn) — consent furniture never precedes content on a lesson page; and lesson titles rendering as placeholders while counts stay transparent (Codecademy) — counts without names are half-transparency, so Data From Zero publishes names, counts, and durations together or none of them.

---

## 5. Visual teaching — the core lesson and the house sequence

**Confidence: High** — the same pattern recurs across the visual explainers opened for the visual-teaching research (a visual introduction to probability and statistics; a visual introduction to machine learning in two parts; an interactive-article journal; two independent SQL join visualizers; a window-functions teaching guide; a Python step-through visualizer). All accessed 2026-11-15.

The strongest visual teachers share one sequence, and it is the opposite of most incumbent courses:

1. **Show the data moving first.** The learner watches rows pair up, a distribution fill in, a split divide a scatterplot, or a variable change value — before any definition.
2. **Name the mechanism in plain language while it is visible.** The label lands on something the eye already tracked.
3. **Only then show syntax or formula.** Code and notation become a caption for a picture the learner already understands.
4. **Let the learner change one thing and predict first.** Drag a probability bar, edit a join key, move a split point, step one line forward — then compare the result to the prediction.

House rule: **no hard concept is introduced by syntax or formula alone. Every hard concept gets one canonical visual first.** This exploits the dual-channel advantage the pedagogy research identifies — verbal and visual channels are separate and limited, so pairing a visual with concise text beats either alone — and it is the main antidote to math anxiety, because the picture answers the question before the formula can frighten anyone.

Three sub-patterns do most of the work:

- **Scrollytelling with a pinned visual.** Short text blocks scroll on one side while one diagram transforms step by step on the other. The diagram never resets; it accumulates. The learner feels continuity — the same table, the same distribution — while one variable changes at a time.
- **Manipulable parameters.** A slider, draggable bar, or toggle controls the exact quantity the lesson is about: a coin's true probability, a die's bias, a tree's depth. The chart redraws instantly, so cause and effect are experienced, not asserted.
- **Step-through state.** A slider or Next/Back control scrubs through execution states. At each step exactly one thing has changed: the current line, one variable value, one stack frame, one arrow pointing at an object. Beginners learn by diffing states, not by reading final output.

### 5.1 Cross-cutting techniques worth standardizing

[Recommendation throughout — design synthesis from the sources opened; the per-technique evidence sits in the catalog, Section 6.]

1. **Predict-before-reveal.** Before any animation or stepper advances, ask what will happen ("Will this customer appear in a LEFT JOIN result?"). Reveal on click. This converts watching into retrieval practice, which the pedagogy research ranks among the highest-evidence methods available to a static site.
2. **One shared visual grammar.** Tables always look like tables, partitions always use the same wall style, groups always use the same buckets, a filter always uses the same chip style — across Excel, SQL, Python, and statistics. Recognition transfers; relearning a new diagram language per stage does not.
3. **Color with a job, never decoration.** One color per table, per class, per partition, held constant through a whole lesson and stated in a legend. Color is how the eye tracks identity through a transformation; changing it mid-lesson breaks the tracking the visual exists to provide. Never encode meaning in color alone — pair it with labels or patterns, for color-vision accessibility.
4. **Small, rigged data.** Every teaching dataset is tiny and deliberately loaded: a NULL key, a tie, an outlier, a duplicate — each odd row exists to make exactly one distinction visible. Realistic messy data belongs in projects; canonical visuals need data designed like a demonstration, not sampled like a dataset.
5. **Step controls over autoplay.** Play, step forward, step back, and a scrub slider, on every animated visual. Autoplay punishes slow readers, screen-reader users, and anyone on a second viewing looking for one specific step.
6. **The visual is the lesson; text is the caption.** Short text blocks that name what the visual just showed, in the order the eye saw it. If a paragraph is needed to explain a diagram, the diagram is wrong.
7. **Static fallback for every interactive.** Each interactive component degrades to a readable sequence of static frames (first state, key middle state, final state) for no-JavaScript readers, print, and search indexing. This is also the cheapest accessibility and performance insurance available.


---

## 6. Technique catalog — mapped to the hard concepts

Build-cost key: **Static SVG** = one hand-authored or generated vector diagram, no JavaScript required. **CSS** = layout, highlighting, or transition in styles alone. **Interactive JS** = a small client-side component; vanilla JavaScript or a tiny framework island, no server, no account. Confidence is High where the technique is grounded in an opened exemplar, Medium where it is a transfer of a proven pattern to a new domain — and is labeled as such.

### 6.1 SQL joins

Confidence: High — two independent join visualizers opened for the research converge on the same design.

| Technique | Concept it teaches | Why it works | Build cost |
|---|---|---|---|
| Row-pairing animation on two tiny tables | What a join actually does: pair rows whose keys are equal, stitch each pair into one wider row | Replaces the abstract definition with the literal mechanism. Once a learner has watched pairing, every join type becomes a policy about unpaired rows, not a new operation to memorize. | Interactive JS (small); a stepped CSS/SVG version also works |
| Same data, five outcomes panel | INNER vs LEFT vs RIGHT vs FULL OUTER vs CROSS | One deliberately loaded example — one row with a NULL key, one parent row with no children, one key that appears twice — makes all five results visibly different, and each difference names its own cause. Changing the join type while the input tables stay frozen isolates the one variable that matters. | Static SVG for the summary; Interactive JS for the switcher |
| Venn diagram — as a summary, never as the lesson | Which regions of overlap each join keeps | Venn shading is a good memory hook *after* the pairing mechanism is understood, and a misleading first explanation: it hides row multiplication, NULL behavior, and duplicate keys. Order matters: pairing first, Venn last. | Static SVG |
| NULL and orphan spotlight | Why NULL keys never match; why orphan keys disappear in an INNER JOIN | A single highlighted row whose key is NULL, shown failing to pair with every row including another NULL, makes three-valued logic concrete without naming it first. The same spotlight shows an orphan key being padded by an outer join. | Static SVG + CSS highlight |
| Fan-out counter | Duplicate keys multiply rows; joins can return more rows than either input | A live row-count readout that grows as a duplicate key is added turns a silent production bug (inflated totals) into something the learner has personally caused and can therefore recognize later. Always pair the visual with the defensive habit: compare row counts before and after a join. | Interactive JS |
| Editable tables | Transfer: the learner's own keys, not the author's | The strongest join visualizer opened lets the learner edit rows and re-run the join for real, rather than showing a canned picture. Prediction becomes testable. On a static site this needs only in-browser computation over a handful of rows — no database. | Interactive JS |

**Canonical visual:** two small tables on the left, arrows pairing rows in the middle, result table building row by row on the right, with a persistent row-count badge. One component, reused for every join type.

### 6.2 SQL window functions and GROUP BY

Confidence: High — the animated approach in the window-functions teaching guide opened for the research and the logic-flow framing in the SQL visualizer material agree on the central contrast: aggregation collapses rows, window functions preserve them.

| Technique | Concept it teaches | Why it works | Build cost |
|---|---|---|---|
| Sliding / growing frame highlight | OVER (ORDER BY …) as a moving window; running totals and moving averages | A translucent frame that grows by one row, or slides at a fixed size, over a sorted table makes the word "window" literal. The learner watches the aggregate recompute inside the frame at each step instead of imagining it. | CSS animation or small Interactive JS stepper |
| Partition walls | PARTITION BY restarts the calculation per group | Visible dividers between partitions, with the frame resetting at each wall, separate the two ideas beginners conflate: grouping the calculation vs grouping the output. | Static SVG; Interactive JS for the stepper version |
| Side-by-side collapse vs preserve | GROUP BY collapses to one row per group; a window function keeps every row and adds a column | Two output tables from the same input, shown simultaneously, with row counts visible. This single contrast is the whole intuition; everything else is vocabulary. | Static SVG |
| Tie-handling strip | ROW_NUMBER vs RANK vs DENSE_RANK differ only on ties | One sorted strip of rows with a deliberate tie, numbered three ways in three aligned columns. The difference is visible as a gap (or no gap) after the tied rows — no prose can make it clearer. | Static SVG |
| Neighbor pointers | LAG / LEAD read the previous / next row in the partition | An arrow from each row to the row above or below it, with the carried value shown landing in a new column, demystifies functions that sound abstract in syntax form. | Static SVG + CSS |
| Execution-order flow diagram | Why a window result cannot be filtered in the same query's WHERE clause | A simple left-to-right flow — source, filter, grouping, window, final selection — with the window step highlighted after the filter step, explains an error learners otherwise meet as an unexplained failure. | Static SVG |

**Canonical visual:** a table stepper where the learner advances one row at a time; the active partition is outlined, the current frame is shaded, and the computed value appears in the new column at the moment the frame covers it.

### 6.3 Excel and Sheets: lookup logic, references, and aggregation

Confidence: Medium — no dedicated Excel visual-teaching exemplar was opened in the research; the techniques below are transfers of proven patterns from the SQL and Python sources, applied to spreadsheet-specific pain points named in the Wave 1 files. Treat the mapping as design synthesis, not as a claim about what any spreadsheet platform currently does.

| Technique | Concept it teaches | Why it works | Build cost |
|---|---|---|---|
| Lookup as physical matching | VLOOKUP / XLOOKUP / INDEX-MATCH: find the row where the key matches, travel across to the return column | Drawing the lookup as a highlighted key column, a horizontal match line to the found row, then a turn into the return column gives learners a path to trace with a finger. Most lookup errors (wrong column, wrong range, approximate match) become visible as a wrong turn on that path. | Static SVG; Interactive JS version lets the learner pick the key |
| Dollar-sign freeze animation | Absolute vs relative references ($A$1 vs A1) when a formula is filled down or across | Show a small grid, fill a formula, and animate which references move with the fill and which stay pinned. The dollar sign stops being a ritual and becomes a visible pin. | CSS / small Interactive JS |
| Range shading for aggregation | SUMIFS / COUNTIFS / pivot grouping: which cells were included and why | Shade exactly the cells that satisfied all criteria, in a different shade per criterion, with the intersection darkest. Learners debug criteria by seeing the included set, not by re-reading the formula. | Static SVG |
| Pivot as drag-to-group | Pivot tables group rows and aggregate values; they do not change source data | Source rows physically sort themselves into labeled buckets, each bucket collapsing to its aggregate, while the source table stays untouched on the left. Mirrors the SQL GROUP BY collapse visual, so the two stages reinforce each other. | Interactive JS (stepped version: Static SVG sequence) |
| Formula tracing arrows | Precedents and dependents; where a number came from | Arrows from input cells into a formula cell, colored by sheet, teach auditing as following a trail — the spreadsheet version of data lineage, preparing learners for the same idea in SQL and pipelines. | Static SVG |

**Canonical visual:** a miniature grid component (not a screenshot of Excel) drawn in HTML table + CSS, so it stays crisp, translatable, and usable on mobile. Screenshots of a real spreadsheet should never be the teaching visual: they cannot be stepped, highlighted, or localized.

### 6.4 Python data structures and pandas

Confidence: High — grounded in the Python step-through visualizer material opened for the research, which demonstrates each of these state diagrams in a working tool.

| Technique | Concept it teaches | Why it works | Build cost |
|---|---|---|---|
| Step-through trace with frames and heap | Variables, loops, function calls, return values | Code on one side, live state on the other: the current line is highlighted, each function call gets its own frame holding its local variables, and objects sit separately with arrows from names to objects. Stepping forward and backward lets the learner find the exact step where a value became unexpected — the core debugging skill. | Interactive JS (precomputed steps for fixed examples; no server execution needed) |
| Name-and-arrow object diagram | Assignment copies a reference, not the object; aliasing and mutation surprises | Two names with arrows pointing at one shared list object makes the classic surprise — appending through one name changes what the other name shows — predictable instead of baffling. A true copy is drawn as a second object. This one diagram prevents a whole class of beginner bugs. | Static SVG for the fixed example; Interactive JS for step-through |
| Stack-frame growth for recursion | Each call has private local variables; frames return in reverse order | Several frames of the same function alive at once, each holding its own copy of the argument, then unwinding one by one, replaces the vague idea of "calling itself" with a visible pile that grows and shrinks. | Static SVG sequence or Interactive JS stepper |
| DataFrame as a labeled grid with an index rail | pandas selection: loc vs iloc, boolean filtering, groupby | The DataFrame drawn as a real grid with the index as a separate rail, row labels and column labels in different colors. A boolean filter is a row of true/false chips that keeps or drops whole rows; a groupby is the same bucket visual used for SQL and pivots. One shared visual language across Excel, SQL, and pandas is a deliberate advantage: the learner recognizes the operation in new syntax. | Static SVG; Interactive JS for filter/groupby stepper |
| Method-chain pipeline | Chained pandas operations transform a table step by step | The table's shape and a few rows shown after each link in the chain, with the changed part highlighted. Long one-line chains stop being opaque when the intermediate tables — which the code never prints — are made visible. | Static SVG sequence |
| Split-apply-combine buckets | groupby: split into groups, apply a function, combine results | The same three-panel bucket diagram as SQL GROUP BY and Excel pivots: rows flow into labeled buckets, each bucket reduces to a value, values assemble into the result. Reuse the identical artwork with different syntax captions. | Static SVG |

**Canonical visual:** a precomputed step-through player for short, fixed examples — steps stored as data in the page, rendered as code highlight + variable table + object arrows. Do not attempt live Python execution on a static site; link out to a free playground for the learner's own code, and keep the in-page player for the canonical examples.

### 6.5 Probability, distributions, and statistical intuition

Confidence: High — grounded in the visual statistics source's chapter structure and its Basic Probability page opened for the research.

| Technique | Concept it teaches | Why it works | Build cost |
|---|---|---|---|
| Repeat-the-experiment accumulator | Law of large numbers; theoretical vs empirical probability | Flip one coin, then flip many, while a running frequency line settles toward the true probability. The learner watches variability shrink instead of being told it does. Buttons for a single trial and a batch trial, plus draggable bars that change the true probability, are the whole interaction. | Interactive JS (small simulation) |
| Running-mean convergence trace | Expectation as a long-run average | Roll a die repeatedly and plot the running sample mean converging on the expected value; then bias the die by dragging its face probabilities and watch the target itself move. Expectation becomes "where the running average is heading" — correct and usable. | Interactive JS |
| Spread builder | Variance and standard deviation as average distance from the center | Draw dots, mark each dot's distance to the mean, square and average those distances in view. Spread stops being a formula and becomes a property the learner can see widening and narrowing as the data changes. | Interactive JS; Static SVG for the definition panel |
| Draggable distribution | Parameters change a distribution's shape: mean shifts it, spread stretches it | One curve, two controls. The learner builds the mapping from parameter to shape by hand, which later makes the distribution families feel like variations rather than separate topics. | Interactive JS |
| Sampling-distribution builder | Central Limit Theorem; sampling variability; standard error | Repeatedly draw samples from a visibly non-normal parent, plot each sample mean, and watch the pile of means form its own bell shape that narrows as sample size grows. The single most counterintuitive result in introductory statistics — and almost impossible to believe from a formula alone. | Interactive JS (the highest-value statistics build) |
| Prior-to-posterior morph | Bayesian updating: new data moves a belief, strong priors move less | A prior curve, observations added one at a time, morphing toward the posterior, with the count of observations visible. Updating becomes a visible tug-of-war between prior and data. | Interactive JS |
| Two-group overlap picture | Statistical significance intuition; effect size vs sample size | Two overlapping distributions whose separation and width the learner controls, paired with a plain-language readout of how distinguishable the groups are. Teaches the right first question — how big is the difference compared to the spread — before any test is named. | Interactive JS |

**Canonical visual:** small, fast simulations with three controls at most. The source's discipline is the model: one bite-sized concept per visualization, short text, the simulation as the lesson.

### 6.6 Regression

Confidence: High for the visual approach (regression is a named chapter in the visual statistics source opened for the research, and the residual / line-fitting pattern is the standard visual treatment consistent with that source); Medium for the specific component designs, which are synthesis for Data From Zero's stack.

| Technique | Concept it teaches | Why it works | Build cost |
|---|---|---|---|
| Drag-the-line fitting | A regression line summarizes a cloud of points; slope and intercept have geometric meanings | The learner drags a line through a scatterplot and watches a live error readout improve or worsen, then reveals the best-fit line. Fitting becomes a search the learner has already attempted by hand, so least squares answers a felt problem. | Interactive JS |
| Residual sticks | Residuals are vertical distances from point to line; good fit means small, patternless residuals | The vertical stick drawn for every point — optionally squared, to show why large errors dominate a squared-error criterion. A second panel plotting residuals alone teaches the diagnostic habit: look for patterns in what the line missed. | Static SVG for the fixed case; Interactive JS with drag-the-line |
| Leverage pull | Outliers and high-leverage points drag the line | One movable point that visibly bends the fitted line as it is dragged teaches influence more honestly than any warning paragraph. Learners remember the point they personally dragged. | Interactive JS |
| Prediction vs explanation split panel | A line can predict well without explaining cause | The same fitted line shown once as a prediction machine (new x in, predicted y out) and once with a confounder drawn in — making the correlation-is-not-causation point structurally instead of as a slogan. | Static SVG |

### 6.7 Machine learning model intuition

Confidence: High — grounded in the two-part visual introduction to machine learning and in the interactive-article model, both opened for the research.

| Technique | Concept it teaches | Why it works | Build cost |
|---|---|---|---|
| Scroll-driven boundary drawing | Classification is drawing boundaries in feature space | Start with a one-feature threshold on a strip plot, add a second feature to make a scatterplot, then shade the regions the rule creates. The learner sees a model as a boundary before hearing the word classifier. | Interactive JS / scroll-triggered SVG states |
| Histogram-to-split finder | A decision tree split chooses a point that makes each side purer | The scatterplot becomes per-feature histograms; slide a split point and watch the class mix on each side update live. Purity stops being jargon when one side visibly becomes mostly one color. | Interactive JS |
| Growing-tree synchrony | Recursion: the tree grows by repeating the same split step on subsets | The tree diagram and the data partitions grow together, side by side, each new fork highlighting the subset it splits. Neither diagram alone teaches recursion; the synchronization does. Accuracy updating as layers are added — improving as the tree deepens, then undercut by the test-data reveal — sets up overfitting honestly. | Interactive JS |
| Train-flow vs test-flow reveal | Overfitting: perfect on training data, worse on unseen data | Training points flow through the finished tree to their leaves; then unseen test points run through the same tree and some land wrong. The definition of overfitting becomes a visible event, not a vocabulary item. | Interactive JS |
| Stump-to-full-tree slider | Bias-variance tradeoff; model complexity as a dial | One slider (minimum node size or depth) morphs the model from a single split to a fully grown tree while training and test error curves trace themselves: the overly simple stump errs consistently (bias), the fully grown tree errs inconsistently on test data (variance), and test error rises again as complexity passes its best point. The U-shaped total-error curve is the payoff visual. | Interactive JS (flagship ML build) |
| Complexity-error abstract chart | Bias falls and variance rises with complexity; total error is their sum | After the concrete slider, show the abstract two-curves-plus-sum chart. Concrete first, abstract second — reversing that order is why the tradeoff usually fails to land. | Static SVG |
| Parameter-as-knob panels | Hyperparameters, attention, feature visualization, embeddings | The interactive-article model: a rigorous piece where the reader adjusts the model's actual parameters and watches the output respond, with diagrams that are instruments rather than illustrations. At Data From Zero's level, borrow the principle at smaller scale: every ML concept page gets one knob that controls the concept itself (depth, learning rate, threshold) — never a decorative animation. | Interactive JS |
| Animated transformation | Neural networks, gradient descent, linear algebra as movement | The reference pattern from visual math video: objects transform continuously — a grid warps under a matrix, a point descends a cost surface, activations flow through layers — so the operation is seen as movement rather than symbol shuffling. On a web page, approximate it with short, loopable, muted SVG/CSS animations of the same transformations, each paired with a stepper for learners who need control instead of playback. Video alone is passive; a scrubbable animation keeps the intuition and restores agency. | CSS / SVG animation; keep short and pausable |

**Canonical visual:** the boundary-to-tree sequence rebuilt at lesson scale — one dataset, one scatterplot, one tree, one slider — reused across the classification, overfitting, and bias-variance lessons, so the learner meets one familiar visual three times with increasing depth.

---

## 7. What incumbents do NOT do visually — the ten gaps

Confidence: High — taken directly from the Wave 1 UI/UX audit and pedagogy research; no new claims about incumbents are added here. Scores below use the corrected grouping from the verification wave: DataCamp, Dataquest, Codecademy, and Kaggle Learn scored 4 for visual teaching aids; Coursera scored 2; freeCodeCamp scored 3; roadmap.sh scored 5 *for its map only*. Even the 4s credit screenshots, exercise imagery, and notebook formats more than concept diagrams.

1. **Video-first passivity at the largest incumbent.** Coursera's core medium is the lecture video, and its public pages show almost no interactive or diagrammatic teaching aids. A learner watches a join; they never watch rows pair up.
2. **A map that teaches nothing.** roadmap.sh's node chart states what to learn and in what order while teaching none of it. Every node is a doorway to external resources, not a lesson.
3. **A menu with no path and no visuals of the journey.** Kaggle Learn lists strong free micro-courses with no sequence, no prerequisites, and no visual model of how the pieces connect.
4. **Text-wall transparency.** freeCodeCamp exposes its full curriculum with no durations, no difficulty signals, and no visual hierarchy — openness without design. Nothing shows a beginner what a concept looks like before they commit to it.
5. **Text-only process teaching.** Dataquest's no-video, write-real-code model is pedagogically strong, but its own reviews note that learners who need to see a process before doing it stall. Window functions, grouping, and joins are processes; text alone underserves them.
6. **Screenshots instead of instruments.** DataCamp's pages use product and exercise screenshots as teaching evidence. A screenshot cannot be stepped, edited, or predicted against — it proves the product exists rather than teaching the concept.
7. **Fill-in-the-blank visuals.** Where incumbents do show code visuals, the dominant exercise pattern pre-writes most of the code. The visual state that matters most — the blank page, and the intermediate states of the learner's own attempt — is never shown.
8. **No shared visual language across tools.** Each platform, and usually each course inside a platform, invents its own diagrams. Nobody carries one bucket visual from Excel grouping through SQL GROUP BY to pandas groupby, although the operation is the same. Cross-tool recognition is unclaimed territory.
9. **Statistics taught as formulas first.** The pedagogy research documents math anxiety as an avoidance barrier and notes that platforms front-load formulas. No audited incumbent leads statistics with manipulable distributions or sampling simulations of the kind in Section 6.5.
10. **No visual for the failure modes.** Fan-out after a join, aliasing in Python, overfitting on test data, a filter silently converting an outer join's result — these are the errors that dominate real beginner work, and they are precisely the ones a visual can make unforgettable. Incumbents overwhelmingly visualize the happy path.


---

## 8. Time-to-skill — the UX contribution

Time-to-skill is one of the four tests the project is judged on, and the site's design — not only the curriculum's order — decides much of it. The mechanisms below are [Recommendation], each tied to an audit finding or a pedagogy finding; no speed multiplier is claimed anywhere (Section 4, item 6).

- **Zero setup, zero wall between arrival and first result.** The audit's friction leaders are free and wall-less; every wall an incumbent adds (account before content, trial before syllabus, enterprise pitch before path cards) is time spent not learning. Data From Zero's first lesson starts on the page the beginner lands on, in the browser, with the dataset already there.
- **Decision time removed, not learning time.** Path cards with decision metadata (Section 2, pattern 1), one linear order (no catalog search), and an always-visible "what next" convert the hours incumbents spend learners on *choosing* into hours spent *doing*. Choice overload is the largest incumbent's defining information-architecture problem in the audit; a single path is the fix.
- **Concepts arrive pre-understood.** The visual-first sequence (Section 5) front-loads intuition so syntax is learned as a caption for a known picture, instead of being decoded and conceptualized simultaneously. The pedagogy research's dual-channel finding is the basis: two channels used well carry more than one channel used twice.
- **No re-learning of diagram languages.** One shared visual grammar across stages (Section 5.1, item 2) means the grouping visual learned in Excel is spent again in SQL and again in pandas. Incumbents reset the visual language per course; the transfer saving compounds across the whole path.
- **Review that prevents re-study.** The fixed-interval review system and recall openers specified in 03-teaching-playbook keep earlier skills warm inside later lessons, instead of letting them decay until a later stage forces a full re-learn. Platforms in the pedagogy research largely measure lessons completed, not knowledge retained; measuring retained ability is the time saving.
- **Honest total scope, stated early.** Showing the whole road and its realistic length up front (freeCodeCamp's anti-hype pattern, Section 2, pattern 9) prevents the most expensive time loss of all: months spent on a path whose length was mis-sold, followed by abandonment. Dropout concentrates in the first two weeks per the completion research in the pedagogy file; early wins inside honestly stated scope are the retention design.

What the site must never do for time-to-skill: shorten lessons by removing the blank-start task or the verification step (the two elements that convert exposure into skill), publish pace estimates without their assumptions, or claim a comparative speed figure without a source opened for it.

---

## 9. Static-site performance and mobile constraints

Confidence: Medium-High — engineering guidance for the static stack named in the project plan (one site, Learn + Reference spaces). Everything in this section is [Recommendation]: design targets for Data From Zero, not measured facts about any external site. Accessibility items that originate in the visual-teaching research (reduced motion, color-alone encoding, static fallbacks) are build rules, not audit findings — no incumbent was scored on accessibility in the audit.

### 9.1 Budget rules

- **Static first.** Every visual ships as static SVG or CSS by default. JavaScript is added only where manipulation is the teaching mechanism (sliders, steppers, editable tables, small simulations). A page with no interactive concept ships no component JavaScript.
- **Island discipline.** Each interactive visual is an isolated island that loads only on its own lesson page, hydrates lazily when it approaches the viewport, and never blocks the text — which must be fully readable before hydration.
- **No heavy animation libraries for simple work.** CSS transitions and native scroll/intersection APIs cover steppers, highlights, and reveal effects. Reserve any animation library for a proven need on a flagship visual, loaded only on that page. Load animation code after the page is visible and initialize each section only when the reader scrolls near it.
- **Simulation caps.** In-browser simulations (coin flips, sampling, tree growth) run on dozens to hundreds of points, precomputed where the sequence is fixed. Nothing animates thousands of DOM nodes; if a visual ever needs that scale, it belongs on a canvas element with a static SVG fallback, and that decision needs an explicit reason.
- **Fonts and images.** Visuals are SVG and HTML, not raster screenshots, so they stay sharp, small, translatable, and theme-able. Do not ship a video file where a scrubbable SVG sequence teaches the same point.
- **Two spaces, one component library.** Learn (spacious) and Reference (dense) render the same visual components at different densities. A component that only works in one space is two components to maintain, translate, and test — avoid it.

### 9.2 Mobile rules

- **Design the visual for a narrow screen first.** The audit flags roadmap.sh's dense node chart as inherently hard on a phone; Data From Zero's visuals must not repeat that. Tables in a visual keep at most a handful of columns; wide tables become stacked card pairs on small screens rather than shrinking to unreadable type. The roadmap map itself, on mobile, renders as the ordered stage list with the same metadata as the cards — the spatial chart is a desktop enhancement, never the only navigation.
- **Scrollytelling collapses vertically.** The desktop pattern (text beside a pinned visual) becomes, on mobile, alternating text and visual blocks in one column, with the visual sticky only where it remains fully visible without covering the text.
- **Touch targets and controls.** Steppers, sliders, and join-type switchers need large, thumb-reachable controls, and every drag interaction needs a tap/step alternative. Dragging a distribution bar or a regression line must also work as plus/minus steppers.
- **No hover-dependent teaching.** Anything revealed on hover on desktop must be revealed on tap on mobile, and must never be the only place a definition or result appears.
- **Reduced motion and pausing.** Respect the reader's reduced-motion preference: animations start paused or in their final state, autoplay is never the only mode, and every animation can be paused and stepped manually. This is an accessibility requirement, not a preference toggle.
- **Offline and low-bandwidth reality.** Because visuals are inline SVG and small scripts rather than media files, lessons remain usable on slow connections — a material advantage for the bilingual audience the project serves, and a reason to keep per-page script weight minimal.

### 9.3 Risks to avoid

- **Animation as decoration.** Movement that does not encode a change in the data teaches nothing and costs performance, battery, and attention. House test: if removing the motion loses no information, remove the motion.
- **Simulation sprawl.** Each interactive is code that must be maintained, translated, and tested in two languages and two site spaces. Ten excellent, reused components beat forty one-off interactives. Build a small component library — table-pairing, table-stepper, distribution, scatterplot-and-line, state-tracer, bucket-grouping — and compose lessons from it.
- **Canvas-only or JS-only content.** Content locked inside a canvas or available only after hydration is invisible to search, print, translation review, and screen readers. Every visual needs a text equivalent that states its conclusion in words.
- **Screenshot teaching assets.** A screenshot of a real spreadsheet, editor, or product UI cannot be stepped, highlighted, localized, or re-themed, and it ages with the vendor's UI. Teaching visuals are drawn components (HTML/CSS/SVG), per Section 6.3's canonical-visual rule.

---

## 10. Visual asset priorities — the top 10 to build first

Ordered by teaching value per build cost, and by position on the linear path (Excel, then SQL as one complete block, then Python, then advanced core), so the earliest stages — where dropout concentrates — get visuals first. The priority order and cost column are [Recommendation] (design synthesis for the static stack); the concept coverage is grounded in the catalog, Section 6.

| Priority | Asset | Concepts covered | Why first | Cost |
|---|---|---|---|---|
| 1 | Join pairing visualizer: two editable mini-tables, pairing animation, five join types, live row counts, NULL / duplicate cases built in | All SQL joins; NULL logic; fan-out | Joins are the first major stumbling block in SQL and the single most reusable component on the path. One build serves the join lesson, the interview-prep material, and the Reference space. | Interactive JS |
| 2 | Collapse-vs-preserve table stepper | GROUP BY vs window functions; partitions; running totals; ranking ties | One stepper component teaches the most-confused contrast in intermediate SQL, and the same component is reused for Excel pivots and pandas groupby with different captions. | Interactive JS |
| 3 | Spreadsheet grid visual kit: lookup path tracer, reference-freeze animation, criteria shading | Excel lookups, absolute references, SUMIFS, pivots | Excel is stage one and currently has no visual exemplar anywhere in the audit set; a native HTML grid kit is cheap, translatable, and sets the visual grammar the SQL stage then reuses. | Static SVG + CSS, one Interactive JS piece |
| 4 | Bucket grouping diagram (split-apply-combine) | GROUP BY, pivots, pandas groupby — one operation, three syntaxes | The cheapest high-transfer asset on the list: one artwork, three stages, and the clearest demonstration that Data From Zero teaches operations, not just tools. | Static SVG |
| 5 | Python state tracer (precomputed steps) | Variables, loops, functions, aliasing, recursion | Ports the proven step-through pattern to fixed canonical examples with no server execution. Aliasing and call frames are the two Python visuals beginners cite as turning points; both are step diagrams, not simulations. | Interactive JS (precomputed data) |
| 6 | Distribution playground: draggable probability bars, running-frequency and running-mean traces | Probability, expectation, variance, law of large numbers | The anti-math-anxiety flagship for the statistics core. Small simulation, enormous conceptual payoff, and it establishes the simulation style later statistics lessons reuse. | Interactive JS |
| 7 | Sampling-distribution builder | Central Limit Theorem, sampling variability, standard error | The hardest idea in introductory statistics and the one most dependent on visualization to be believed at all. Built once the distribution playground's components exist, it is mostly composition. | Interactive JS |
| 8 | Scatterplot + drag-the-line regression visual with residual sticks | Regression, residuals, outliers, leverage | Regression is where statistics becomes modeling. The draggable line plus movable outlier teaches fit, error, and influence in one component the ML stage then builds on. | Interactive JS |
| 9 | Decision-tree boundary sequence: scatterplot regions, histogram split finder, growing tree with synchronized partitions | Classification, splits, purity, recursion, train vs test | The scrollytelling sequence rebuilt at lesson scale. Higher cost, so it comes after the cheaper wins, but it is the ML stage's defining visual and the strongest shareable asset in the advanced core. | Interactive JS |
| 10 | Bias-variance slider: stump-to-full-tree morph with tracing error curves | Overfitting, model complexity, bias-variance tradeoff | Directly continues asset 9 on the same dataset and components, which keeps its marginal cost low and gives the ML track its conceptual climax: one slider the learner will remember. | Interactive JS |

**Deliberately deferred:** full explorable essays in the interactive-journal style (high craft cost per page; borrow the one-knob principle instead), any live code-execution visual (route learners to free external playgrounds), animated video production (passive, heavy, and untranslatable compared with scrubbable SVG sequences), and a dense whole-journey node chart as a teaching surface (keep the roadmap chart as navigation, per Section 4 item 7, and put the build effort into the lessons its nodes open).

---

## 11. Design-review checklist

A page or component ships only when every line below passes. [Recommendation]

**Clarity**
- [ ] A first-time visitor can name the right starting point from the homepage without clicking (path/stage cards carry skills, counts, durations, and a beginner tag).
- [ ] The page states its prerequisites explicitly, including "none" where true.
- [ ] Every time estimate carries its pace assumption; every outcome or demand figure carries its source and date.
- [ ] The full syllabus is reachable in one click and readable without any account; lesson names, counts, and durations are published together.
- [ ] The page carries a last-updated date.

**No dark patterns**
- [ ] Nothing on the page gates content behind signup, trial, or payment — and the page says the content is free where an incumbent would upsell.
- [ ] No speed multiplier, deadline, or outcome claim appears without a source.
- [ ] No streak, XP, or leaderboard mechanic punishes absence or rewards completion over recall.

**Visual teaching**
- [ ] Every hard concept on the page has exactly one canonical visual, shown before its syntax or formula, with labels on the visual itself.
- [ ] The visual uses the shared grammar (tables, walls, buckets, chips) and holds its colors constant through the lesson; meaning is never carried by color alone.
- [ ] The teaching data is small and rigged (a NULL, a tie, an outlier, or a duplicate where the distinction needs one).
- [ ] Every interactive has step controls, a predict-before-reveal prompt where a prediction is natural, and a static fallback sequence.
- [ ] At least one failure mode relevant to the concept is visualized, not only the happy path.

**Performance and mobile**
- [ ] The page's text is fully readable before any JavaScript hydrates; a page with no interactive concept ships no component JavaScript.
- [ ] The visual works at phone width without shrinking type; drag interactions have tap/step alternatives; nothing essential is hover-only.
- [ ] Reduced-motion readers get a paused or final-state visual; every animation can be paused and stepped.
- [ ] The visual is drawn (SVG/HTML/CSS), not a screenshot, and has a text equivalent stating its conclusion.

---

## Sources and research record

Audit pages opened (all accessed 2026-11-15; public pages only, read as a first-time visitor):

- DataCamp — https://www.datacamp.com · https://www.datacamp.com/courses/introduction-to-python
- Coursera — https://www.coursera.org · https://www.coursera.org/professional-certificates/google-data-analytics
- freeCodeCamp — https://www.freecodecamp.org · https://www.freecodecamp.org/learn
- Dataquest — https://www.dataquest.io
- Codecademy — https://www.codecademy.com · https://www.codecademy.com/learn/learn-python-3
- Kaggle Learn — https://www.kaggle.com/learn
- roadmap.sh — https://roadmap.sh · https://roadmap.sh/data-analyst

Not retrieved in the audit pass (stated here so no claim in this file rests on them): the dedicated pricing pages of DataCamp, Dataquest, and Codecademy; a Dataquest path page; an individual Kaggle course page; the roadmap chart's interactive layer (the chart renders graphically; the page's text layer was read in full).

Visual-teaching sources opened (all accessed 2026-11-15):

- Seeing Theory — a visual introduction to probability and statistics (homepage and chapter map; Basic Probability page: coin-flip frequency, draggable true-probability bars, running sample mean, card-draw variance) — https://seeing-theory.brown.edu/ · https://seeing-theory.brown.edu/basic-probability/index.html
- A Visual Introduction to Machine Learning, Parts 1 and 2 — scatterplot boundaries, histogram split finding, growing decision tree, training vs test data, stump vs fully grown tree, bias and variance error curves — http://r2d3.us/visual-intro-to-machine-learning-part-1/ · https://r2d3.us/visual-intro-to-machine-learning-part-2/
- Using Artificial Intelligence to Augment Human Intelligence (Distill) — interactive generative-model interfaces, diagrams as instruments — https://distill.pub/2017/aia/
- SQL Join Visualizer — editable tables executed live, Venn shading per join type, NULL-key and fan-out cases — https://www.nrtechstudio.com/tools/sql-join-visualizer/
- Mastering SQL Joins: An Interactive Guide — Venn diagrams plus runnable examples, row multiplication, the filter-after-outer-join trap — https://www.hisqlboy.com/blog/mastering-sql-joins
- How Window Functions Work in SQL, with Animated GIFs (DataSchool) — growing and sliding window animations, partitioned windows, window vs aggregate output contrast — https://dataschool.com/how-to-teach-people-sql/how-window-functions-work/
- How the Python Tutor Visualizer Can Help Students in Your Python Courses — step-through trace tables, call-stack frames, aliasing arrows, recursion frames — https://pythontutor.com/articles/python-visualizer.html

Supporting context noted in the research (searched 2026-11-15, not counted as opened pages): the animated-mathematics video pattern as the reference for transformation-as-movement (Section 6.7), and the explorable-explanations / reactive-notebook pattern as the reference for reader-as-scientist manipulation. Claims in this file rest on the opened pages above.

Internal research files synthesized here (the full record stays in the research folder): the Wave 1 UI/UX audit (platform scores, platform-by-platform findings, patterns to adopt and to beat — Sections 1–4 of this file); the visual-teaching research (the house sequence, the technique catalog, the incumbent visual gaps, the performance/mobile rules, and the top-10 asset list — Sections 5–7, 9, and 10); and the Wave 1 pedagogy and learner-pain file (dual-channel learning, math anxiety, completion and retention findings cited in Sections 5 and 8). Verification-wave notes applied: the visual-score grouping in Section 7 uses the corrected grouping (Kaggle Learn, free, among the 4s; roadmap.sh's 5 qualified as map-only); the visual-teaching file's budget rules, build costs, and priority order are carried as [Recommendation] design synthesis, not as sourced findings; accessibility material is labeled as build rules, not audit findings.

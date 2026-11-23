# datafromzero — Site specification

**Status:** v1.0 (baseline) · **Owner:** datafromzero · **Org:** github.com/datafromzero ·
**Site:** https://datafromzero.github.io · **Tagline:** *From A1 to AI*

This document is the long-term contract for the site. It is written to outlive any one build,
framework version or contributor. Anything marked **CONTRACT** is a public interface: once shipped,
it must not change without a migration (redirects, schema migration, a MAJOR version bump).

Read together with `design/README.md` (visual design, logo, homepage motion).

---

## 0. Principles (in priority order)

1. **Permanence.** Every published URL keeps working forever. Content outlives the framework.
2. **Stability & speed.** Static site, minimal JavaScript, works with JS disabled, fast on a phone.
3. **Academic quality.** Versioned, citable (DOI), sourced, dated, reviewed.
4. **Beginner-first.** Audience knows only Microsoft Office; most read on phones.
5. **Delight, sparingly.** GSAP motion only on the homepage (D28).

---

## 1. Decision record

| # | Decision | Choice | Consequence |
|---|---|---|---|
| D1 | Source of truth for content | **Single repo** `datafromzero/datafromzero.github.io` | Content, site code, datasets and notebooks live together. Content is **written from scratch** (D24); `johnha912/data-odyssey` is not migrated. |
| D2 | Domain | **datafromzero.github.io** now; custom domain may be added later | GitHub Pages redirects github.io → custom domain automatically. Never use absolute self-links in content (§3.4). |
| D3 | Languages (**paused by D30**) | **English at root, Vietnamese under `/vi/`** | `/sql/joins/` and `/vi/sql/joins/`. English URLs never gain a prefix. Paused: English only until the owner reactivates §8 (D30). |
| D4 | Running code | **Links out** to Google Colab (Python only since D43) and Google Sheets templates (Excel stage) | The in-page SQL runner of D42 (2026-11-18) supersedes the "no in-browser runtime" half for SQL; Python and Excel stay links out. Content is authored so one can be added later without edits (§6.4). |
| D5 | Versioning & citation | **GitHub Releases + Zenodo DOI**, `CITATION.cff` | Semantic versions for the curriculum (§9). |
| D6 | URL style | **Topic slugs, no numbers** (`/sql/joins/`) | Order lives in frontmatter, never in URLs or file names. |
| D7 | Authorship | **Single author**; Issues welcome; small PRs (typos, fixes) reviewed by owner | No CONTRIBUTING workflow for new lessons; a short CONTRIBUTING.md for fixes. |
| D8 | Analytics | **Google Analytics 4 with a consent banner** | GA loads only after the visitor accepts (§11). |
| D9 | Theme | **Dark by default + light toggle** on every page; print always light | Amended in 2026-11 (owner): the homepage has a light theme too (the black-on-white inverse, design/README.md §2), and the one switch for the whole site is in the bottom taskbar (D31). The state is Starlight's (`data-theme` on `<html>`, `localStorage` key `starlight-theme`), so the homepage and the docs agree; only an explicit choice leaves dark, and an inline head script applies it before first paint. |
| D10 | Exercise solutions | **Hidden directly under each exercise** (click to reveal) | Must work without JS (`<details>`). |
| D11 | Lesson metadata | Objectives, prerequisites, time + level, last-reviewed date + sources — **all required** | Enforced by schema at build time (§5). |
| D12 | Practice data | **Own datasets in the repo**, used from Excel through Python | Datasets are versioned and immutable (§7). |
| D13 | Licenses | **Content CC BY 4.0, code MIT**, datasets CC BY 4.0 | `LICENSE` (MIT) + `LICENSE-CONTENT` (CC BY 4.0) at repo root. |
| D14 | Reference area | Glossary, syntax lookup (Excel / SQL / pandas), statistics formulas, career guides | §4. |
| D15 | Learner progress | **Not stored** | No localStorage, no accounts. |
| D16 | Comments | **None** | Each page has "Suggest an edit" + "Report an issue" links only. |
| D17 | Content validation | **Strict, all errors at once** | Ids are lowercase kebab-case; every id reference (`prerequisites`, `replaced_by`, `see_also`, `used_in`) must exist; a file's type, `stage` and `area` follow its folder. The build lists every problem and fails (§5). |
| D18 | Draft lessons | **Never deployed** | `status: draft` lessons appear only in local dev. Published or deprecated lessons may not depend on, or be replaced by, a draft (§5.1). |
| D19 | Dataset page frontmatter | **Deferred** until the first dataset | The build rejects pages under `datasets/` (other than the index) until §5.4 defines their fields. |
| D20 | Citation access date | **Reader adds it** | Pages are static, so "Cite this lesson" cannot know when it was read; a note asks the reader to add their access date (§9). |
| D21 | Using components in content | **Auto-imported, enforced** | `.mdx` files use the §6 components without import lines; the build rejects imports, other components and `<script>` in content (§6). |
| D22 | Homepage motion (superseded by D28) | **GSAP `ScrollTrigger` + `SplitText` + `DrawSVG`**, ≈ 90 KB gzipped JS | Richer motion on `/` and `/stories/*` only; Lighthouse mobile must stay ≥ 90 performance and ≥ 95 accessibility. |
| D23 | Scroll-linked effects | **CSS scroll-driven animations first**, GSAP fallback | Pure scroll-linked effects (progress bar, rail fill) run on the compositor with zero JS where `animation-timeline` is supported; GSAP scrub only as fallback. Triggered choreography stays GSAP. |
| D24 | Content source | **Written from scratch**, outline first, English first | A researched curriculum map is approved by the owner, then lessons are created as drafts; the owner writes the text, or (amended 2026-11-17, owner request) asks the team for a draft text that the owner edits and approves, and the team adds frontmatter, exercises, notebooks, datasets, links and checks. A lesson stays `status: draft` until the owner publishes it. Vietnamese follows in later PRs (§14). |
| D25 | Prerequisite graph | **Order follows prerequisites; footer shows Unlocks next** | Within a stage, `order` is a topological order of `prerequisites`; cycles and duplicate ids fail the check. Each lesson lists the published lessons it unlocks, computed at build time (§5.1, §12). |
| D26 | Page transitions | **Cross-document View Transitions, CSS only** | `@view-transition { navigation: auto; }` with a root cross-fade of 120 ms (≤ 150 ms), declared only inside `prefers-reduced-motion: no-preference` so reduced-motion readers get none. No named per-element morphs, no JavaScript, no change to first paint. Chrome/Edge 126+ and Safari 18.2+ animate; Firefox navigates normally. |
| D27 | Prefetch | **Speculation Rules `prefetch`, moderate eagerness; never prerender** | One JSON `<script type="speculationrules">` (`src/lib/speculation-rules.ts`) in every page head: same-origin links only, excluding `#` links, `target=_blank`, `download`, `rel=external` and file paths. Astro's own prefetch script is off (`prefetch: false`), so every page ships one fewer script. Prerender is forbidden: it would run page code, and later analytics (§11), before the visit. Chromium only; Safari and Firefox navigate normally, so no request is spent on pages that may not be read. |
| D28 | Motion scope and budget | **Full GSAP plugin set, each effect loaded on demand, on the homepage `/` only**; project pages, stories, reference and datasets get no effects, and lessons get none except the figures of D41 (learner-controlled steppers and CSS-only concept animations with a pause button) (narrowed by the owner in 2026-11: project pages and `/stories/*` were included before) | Effects load on demand in deferred chunks after first paint (effects may share a chunk when that saves requests); a section is built when it nears the viewport or, after the intro, while the reader is idle; the budget is JavaScript before first paint ≈ 3 KB gzipped, Lighthouse mobile ≥ 90 (target 100) and the frame budget in §12. Replaces D22's plugin list and 90 KB total. Project pages keep only CSS (the View Transitions of D26); the `/start/` roadmap is static HTML (D34). A story's `motion` field (§5.4) stays in the schema and has no effect for now. |
| D29 | Curriculum map (amended by D32) | **Approved: 161 lessons in 9 stages; DuckDB for SQL; BI tool neutral; one English dataset set in USD** | The map is `research/curriculum/06-curriculum-map.yaml` (rationale in `07-…`); lessons are created as drafts from it (§14) and their frontmatter is the source of truth from then on. `v1.0.0` = the four core stages (102 lessons); the five branches follow in 1.x. SQL lessons run DuckDB in the page (D42, D43) and cite DuckDB docs; dbt lessons use dbt-duckdb. Dashboard lessons teach principles, then short parallel how-tos for Power BI Desktop and Looker Studio. Datasets are English with prices in US dollars and cents; `/vi/` reuses them. |
| D30 | Vietnamese paused | **English only for now**; Vietnamese and other languages later, when the owner decides | No `vi` locale is built (one switch, `VI_ENABLED` in `src/site.ts`), so there is no language picker and no `hreflang` alternates. Every `/vi/` URL that was published (`/vi/` and the six project pages) redirects to its English twin (`src/redirects.ts`, static meta-refresh pages, not in the sitemap). A page under `src/content/docs/vi/` fails the build. D3 and §8 are paused, not deleted: the `translated_from_version` field stays in the schemas (§5, CONTRACT) and its rule applies again once §8 is reactivated. |
| D31 | Bottom taskbar (amended by D34, D35) | **A floating bar at the bottom of every page** (homepage, project pages, lessons, reference): shortcuts menu, "Start learning", light / dark switch, back to top | Approved by the owner in 2026-11 (mockup ported to `src/components/taskbar/Taskbar.astro`). Shortcuts link only to pages that exist (drafts are not deployed). On project, lesson and reference pages it may ship **one** script under 1 KB gzipped (`src/scripts/taskbar.ts`): no GSAP, no library, motion is CSS transitions only and none under reduced motion. Without JavaScript the menu is a `<details>` toggle, back to top is an anchor and the theme switch is hidden. The bar never covers content (a spacer after the footer) and is hidden in print. |
| D32 | Four career branches | **Data Analyst, Data Engineer, Data Scientist and ML / AI Engineer**; Analytics Engineer is no longer a branch | Owner decision (2026-11-17): analytics engineering skills live in Data Engineer and Data Analyst, and four careers are easier for a beginner to choose between. The homepage moved to four careers in its own follow-up PR: the 02 tree has four branches and section 05 "Pick a direction" (the owner-approved career section) replaced the marquee and "05 Begin". The eleven Analytics Engineer drafts were folded in: eight moved to Data Engineer (dbt project, layers, materializations, tests and documentation, dimensional models, Jinja as stretch, CI, the dbt capstone), the KPI dictionary moved to Data Analyst, the freshness and incident lesson was merged into `data-engineer-backfills-and-failure-recovery`, and the role lesson was dropped (its transformation-as-code objective moved to `data-engineer-dbt-project-and-first-model`). Amends D29: **159 lessons in 8 stages**; `v1.0.0` is still the four core stages (102 lessons) and the four branches follow in 1.x. `analytics-engineer` is removed from the lesson `stage` enum and from career `stages` (§5, CONTRACT) and from the route map (§3.1). No `/analytics-engineer/` URL was ever published (all were drafts, D18), so no redirect is needed. |
| D33 | Career quiz page | **`/career-quiz/`: ten questions that suggest one of the four careers (D32), from the research in GitHub issue #32**; the one script exception off the homepage | Owner-approved (2026-11-17). A project page (`src/content/docs/career-quiz.md`, quiz from `src/components/project/CareerQuiz.astro`, copy and weights in `src/lib/career-quiz.ts`, scoring in `src/lib/career-quiz-score.ts` with a unit test). Besides the taskbar script it may ship **one** script, on this page only: under 4 KB gzipped, vanilla, no GSAP, no library. It scores on submit and shows the result in a polite live region; it stores nothing (no `localStorage`, no cookies), sends nothing and tracks nothing, so it saves no progress and needs no account: no §15 conflict. Results are a ranking (suggested direction, close second, honest ties), never percentages, and never the words perfect, optimal, test result or match score. Without JavaScript every question is shown with a printed "How to score it yourself" (rule, tie-break, every answer's points). The career profiles behind the weights are adapted from the O*NET 31.0 Database (USDOL/ETA) under CC BY 4.0: the page carries the prescribed modified-information credit with a link to the license, and links the free Mini Interest Profiler on My Next Move for a validated instrument. The questions are original (no Interest Profiler items). |
| D34 | Navigation for learners (amended by D35) | **Docs-style order and lesson codes** (owner request, 2026-11-17) | The sidebar (`src/lib/sidebar.ts`) reads like a language's docs: Get started (Start here, Career quiz), then each stage with published lessons in study order, then the project pages (About, Changelog, Cite, License, Privacy) last, in a group named "About this site" (renamed from "Project" on 2026-11-20 so it is not mistaken for the tracks' case-study projects); drafts appear only in `astro dev`. Every lesson has a code, a stage prefix plus `order / 10` (E, S, P, C, DA, DE, DS, ML; E1 … E22), shown in the sidebar, the lesson header, Before this lesson, Unlocks next and `/start/`; inserted lessons keep their neighbors' codes (order 25 is E2.5) until the owner renumbers the stage; **the SQL stage was renumbered to S1–S39 with no fractional codes (owner decision, 2026-11-21, after four drafts were inserted): orders are now 10 to 390 and every lesson-code mention was updated; URLs did not change, but the cheatsheet anchors `#sN` of D44 moved with the codes (see the changelog)**. `/start/` shows the stages as closed `<details>` cards instead of the SVG map and the repeated list. The taskbar menu no longer repeats the project links (they are in every footer) and drops section numbers. |
| D35 | Mobile navigation: one bottom bar | **On phones the bottom bar is the only navigation** (owner decision, 2026-11-17; amends D31 and D34) | Starlight's header menu button (sidebar toggle, below 50rem) and its "On this page" bar (below 72rem) are hidden by CSS in `Taskbar.astro`; the desktop sidebar and right-hand table of contents are unchanged and search stays in the header. The bar has two controls: the **menu button** (two bars that cross into an X) with a two-line label, a small mono line `E8 · <current section>` over the lesson or page title (the section follows the reader's scroll: a docs page's h2s, the homepage's sections), and the **primary button**, `Next E9 →` on a lesson (the next published lesson by `order` in the same stage, else the first lesson of the next stage that has any, in `ROADMAP_STAGES` order, else `/start/`), "Start E1 →" (the first published lesson) on `/start/` itself, and "Start here →" to `/start/` on every other page, homepage included (owner decisions). Back to top shows at every width (restored on phones at the owner's request). The bar is liquid glass (a translucent tint, 14 px backdrop blur, a top-edge sheen; solid where blur is unsupported) and its sheet rows rise in one after another with a slight spring, in CSS only (no GSAP off the homepage, D28/D31). The sheet opens above the bar with two tabs, **This lesson** (the page's h2s, "This page" off lessons; the homepage's sections) and **Course** (each stage with published lessons as a `<details>` of `E1 Title` rows, the current lesson marked; stages without lessons as muted "SQL · coming soon" lines), and a bottom row: Home, Career quiz, Report a problem (D37) and the light / dark switch (moved from the bar); the Course pane ends with "See the whole roadmap" to `/start/`, which is no longer in the bottom row because the primary button already starts the lessons (owner, 2026-11-17). Tabs are radio inputs switched with `:has()`, so they work without JavaScript; the default tab is the first one that exists. Drafts never appear. `taskbar.ts` stays the only script on these pages and under 1 KB gzipped. |
| D36 | Mobile search sheet | **Search opens as a full-screen glass sheet on phones and a glass dialog on desktop** (owner request, 2026-11-17; extends D35) | Starlight's `Search` component is overridden by `src/components/starlight/Search.astro`, a copy of Starlight 0.43.1's (its default cannot take content inside the dialog) with a "Where to begin" block added and a restyle in CSS; the markup, the Pagefind UI script and Ctrl+K are Starlight's own, so no new client JavaScript ships and search still works the same. Below 50rem the dialog fills the screen and slides up from the bottom (CSS animation, 0.28 s, `--tb-ease`, none under reduced motion) with the taskbar's glass (`--tb-glass`, `--tb-edge`, `--tb-sheen`, blur 14px; a solid sheet where `backdrop-filter` is missing). The top row is a 48px pill field (focused on open, with a clear button) and Starlight's own Cancel button restyled as text. While the field is empty, three links show: Start here, the first published lesson with its code, Career quiz (drafts never appear); a CSS `:has()` rule hides them once there is a query. Results are cards: the page title, then its sub-results indented with the excerpt and Pagefind's `mark` highlighted; every row is at least 44px and keeps the keyboard focus ring. From 50rem the dialog stays centered with the same glass and cards. |
| D37 | Report a problem from any page | **A "Report a problem" pane in the taskbar sheet that hands off to a GitHub issue form** (owner request, 2026-11-17: form to GitHub, no new JavaScript) | An icon button in the sheet's bottom row selects a third hidden radio of the sheet's tab group (`:has()`, no script; it works on pages without headings too) and shows a plain `<form method="get" target="_blank" rel="noopener">` to `https://github.com/datafromzero/datafromzero.github.io/issues/new`. Hidden fields: `template=page-report.yml`, `page` (the page's full URL, built at build time), `title` (`[E8] Lesson title`; the plain title off lessons). The reader picks a `kind` (Bug on the page, Feedback, Content error: GitHub prefills issue-form dropdowns by option label) and writes `details` (required). `.github/ISSUE_TEMPLATE/page-report.yml` is the issue form (ids `page`, `kind`, `details`; label `report`); the lesson footer's "Report an issue" link uses the same template with `page` and `title` filled in. The site stores and sends nothing itself (no account, no comments, SPEC §15); the reader needs a GitHub account and can paste a screenshot on GitHub. |
| D38 | Career panel button | **"Go to <career>" once that career has published lessons, else "Start at E1"** (owner decision, 2026-11-17) | On the homepage's 05 section (D32), each career's detail panel button is built at build time: if the career's branch stage (`data-analyst`, `data-engineer`, `data-scientist`, `ml-engineer`) has a published lesson it links to that stage's first lesson ("Go to Data Analyst →"); otherwise it links to the first published lesson of the roadmap ("Start at E1 →"), and to `/start/` when no lesson is published at all. The same links are in the static (no-script) version. The four career cards share their rows (label, title, description, "See the path") through CSS grid rows shared between the cards, so the titles line up at every width. |
| D39 | Data tag before v1.0.0 | **Pre-release tag `v0.1.0` for notebook data** (owner decision, 2026-11-18; the SQL stage has no notebooks since D43, the tag stays for later notebooks) | Notebooks need a fixed URL for the data (§7) before the `v1.0.0` release (§9, §14). The site version becomes 0.1.0 (`package.json`, `CITATION.cff`) and `v0.1.0` is a GitHub pre-release created by the owner (it points at the merge of #54; the data is the same); notebooks (from the Python stage on) load `datasets/<name>/v1/...` from that tag. Because `v1/` folders are immutable, the URLs stay valid; notebooks may switch to `v1.0.0` URLs later, but they do not have to. No Zenodo release for `v0.x` tags. **`v0.2.0`** (owner approval, 2026-11-20): the second pre-release data tag, at the merge that added `app-events` v1 (D52); site version 0.2.0; notebooks that use `app-events` load it from `v0.2.0`, cafe-sales notebooks may keep `v0.1.0`. |
| D40 | SQL stage shape | **35 lessons (39 since D53): an Excel-side first lesson, then the research additions; every task publishes its expected result** (owner decisions, 2026-11-18, from research issue #52) | S1 `sql-from-spreadsheet-to-sql` comes first: what a database and SQL are, seen from Excel, with a few small queries matched to sheet actions (owner: beginners need a first taste before keys and grain). The stage runs in three parts (owner, 2026-11-18): **analysis on one table** first (S1–S17: select, filter, NULL, types, CASE, aggregates, GROUP BY, text, dates, execution order, CTEs, window functions), then **data knowledge and joins** (S18–S32: keys and grain, joins, subqueries, set operations, funnels, cohorts, views, star schema, AI help), then **the database itself** (S33–S39: constraints, transactions, normalization, indexes, structured and NoSQL stores at preview level; the core stage after Python goes deeper). Four lessons are added from issue #52: `sql-query-execution-order`, `sql-views` (with triggers at awareness level), `sql-star-schema` (built as views on cafe-sales v1) and `sql-scaling-and-nosql`; the ER diagram lives in `sql-relational-model`. The engine stays DuckDB (D29), tried in the page (D42, D43); the dataset stays cafe-sales v1 (no new tables). Each worked step and exercise shows its expected result shape (rows × columns) so learners self-check. CS50 SQL materials (CC BY-NC-SA) are linked, never adapted. Amends D29/D32: **164 lessons**; `v1.0.0` is the four core stages (**107 lessons**); both counts grew by 2 in D45 (**166** and **109**). Codes were renumbered while every SQL lesson was a draft, so no published code changed. |
| D41 | Lesson step-by-step figures | **CSS-only, learner-controlled steppers in lesson figures** (owner decisions, 2026-11-18; auto-play dropped for the data steppers after research issue #58; autoplay concept animations added by owner request the same day) | A figure may show a concept where rows move (aggregation, grouping, joins, windows, CTE pipelines, set operations, recursion) as at most 6 steps the learner advances: controls Back, 1 to N, Next (44 px tall targets, keyboard arrows, visible focus). It is an inline SVG built at build time by `scripts/make-animation.mjs` from our own lesson rows, styled by `src/styles/step-animation.css`. The controls are a native radio group with labels (`<input type="radio">`, `<label>`), and the checked radio selects the state through sibling selectors (`.rK:checked ~ svg .iN`): **zero JavaScript, no library, no `:has()`** (lessons still ship no JS beyond D31). Step 1 is the default view; each step changes one thing, runs a 0.45 s opacity transition from the previous state (none for reduced motion, the steps still switch), and Back works. Under the figure all step captions stay on the page as a numbered list, the current one marked; each starts with a clause badge, and a caption before a revealing step carries a "Predict:" prompt that does not give the result away (captions state operations, not the numbers a step reveals). **One fixed color per SQL clause role** (FROM/JOIN, ON, WHERE/HAVING, GROUP BY, SELECT/aggregates, OVER, ORDER BY; seven color-blind-safe hues, each at least 3:1 on both pure black and pure white), used only inside figures; groups inside one role are shade steps, and labels and numbers always stay. Print and any reader that ignores the radios get the static storyboard: the final frame plus all captions, without controls. Each figure stays under about 15 KB of markup. Original work drawn from our own data; GIF, WebP and a user-switched color mode were rejected, and so was auto-play for these data steppers. No new authoring component: plain `<figure>`, `<svg>`, `<input>` and `<label>` markup (§6). **Concept animations** (owner request, 2026-11-18): a lesson may also carry abstract, schematic, **autoplay looping** diagrams that explain an idea with no real data (rows are plain boxes with labels such as Row 1, Col 3, t1, Σ; aggregate against window, kinds of CTE, join types, the logical order of a query). They are CSS keyframes only, no JavaScript: a loop of 4 to 8 s in 8 phases that holds its final state for about a second before repeating, one animation per figure with a short caption under it. A native checkbox styled as a 44 px **Pause / Play** button stops every animation in the figure through a sibling selector (WCAG 2.2.2, because they play longer than 5 s). **Step buttons** (owner request, 2026-11-18): next to Pause sit Back, Next and one button per step ("1 2 3 … N", N = 3 to 6 distinct steps, each saying in plain words what changes), a native radio group `[auto, 1..N]` with the radios in the flow like the data steppers (no JavaScript, no `:has()`); choosing a step stops the loop and draws the settled frame at the end of that step's last phase from the same markup (each part carries its delay `--d`, the step sets `--off` and every animation is paused), and Play returns to autoplay; the in-figure label and the numbered caption list under the figure use the same words, with the current one marked, each radio is labeled "Step k of N: caption", arrow keys move between steps. Reduced motion shows step 1, still, and the buttons switch frames instantly; print shows the final state, all captions and no controls. Same clause colors and generator (`loop` option, specs `scripts/animations/concept-*.mjs`); about 5 KB of markup each, the CSS is shared. They go at the top of a lesson's "How it works" section. Never text over text at any moment of the loop. **Live counts and Key idea** (owner decision, 2026-11-19; piloted on three data steppers and five concept animations, then rolled out the same day to every concept animation and the three data steppers: all carry a Key idea, and all but `concept-cte-kinds` also a strip): both figure types may carry two optional additions, CSS only, no JavaScript, written by the generator from optional spec fields (a spec without them renders exactly as before). (1) A **count strip** of up to 5 small labeled counters above the picture (`counts: [{ label, value, role }]` per step, `counters: [{ label, role, values: [[phase, text]] }]` for concept animations): each shows "—" until its step, shows the number of rows at that step (for example `rows 10`, `groups 3`, `after HAVING 2`, or `FROM 7`, `WHERE 5`, `GROUP BY 3`, `HAVING 2`, `LIMIT 1`), and the counters set at the current step are lit in their clause color (a step that covers several phases keeps them lit to its end). (2) Under the controls a **Key idea** panel for the current step only: one plain sentence of at most 110 characters (`key`) and up to 3 **What changed** chips (`changes: [['+', 'column orders'], ['−', '1 row dropped'], ['~', 'rows reordered']]`; the sign is drawn by CSS and spoken as Added, Removed, Changed). The panel holds the text of every step in one grid cell, so its height is that of the tallest and nothing below it moves. In a stepper the checked radio selects the counter state and the panel item (`visibility`, no `:has()`); in a concept animation the counters and the panel use the same keyframes as the picture, so they follow the phases in autoplay and a step button shows them at the end of its last phase (and the strip and panel are `aria-hidden` there, because the captions and step labels already carry the words). **Nothing spoils a Predict:** a count, key idea or change appears only at the step that shows it, and step 1 shows inputs only; numbers in the data steppers were recomputed with DuckDB 2.0.0 on cafe-sales. Print shows the final counter values and, as a block before the caption list, every step's Key idea and What changed, numbered `Step 1 · key idea` by a CSS counter (the live panel itself keeps one copy of each text, so nothing is written twice); reduced motion shows step 1 and the steps switch instantly, with no animation of the counters. Our own look: Geist, our tokens and clause colors. Cost: the generator writes each counter label once and swaps only the value, and the words "Key idea", "Step n", Added, Removed and Changed come from the stylesheet, so a figure grows by about 1.5 KB of markup, 0.37 KB gzipped on average (0.46 KB at most), and the shared CSS is about 3 KB (about 1 KB gzipped). Amends D28 (lessons: no effects). |
| D42 | In-page SQL runner | **Learners write and run SQL inside the lesson page, with nothing to set up** (owner decision, 2026-11-18, amended the same day): the `<RunSQL query={`…`} />` component (§6) turns a "Try it" query or an exercise starter into **two separate boxes**: the editor (a CodeMirror 6 editor with SQL colors, Run, Tables, an optional Auto-run switch, Reset query and Reset data) and the output ("n rows × m columns · time" and the result table, which scrolls inside its own box). The boxes sit side by side where the block is at least 36 rem wide (the lesson column plus up to 5 rem on each side of wide screens) and stack on phones; box 2 always shows an empty state ("Your result appears here…") before the first run. Amends D4, D31, D41 and §15. | Learners should not leave the page for Colab or another tab, and should never notice the setup: they open the lesson and write queries, as on HackerRank or Programiz. **Loading is invisible.** DuckDB-Wasm (`@duckdb/duckdb-wasm`, exact version pinned in `package.json`, the `eh` bundle) is **self-hosted** in `dist/_astro` (no CDN, no third-party request before consent, §11). A lesson page ships one small deferred script (`src/scripts/run-sql.ts`, about 0.8 KB gzipped) that fetches nothing. After the load event, at idle (`requestIdleCallback`), once a block is within one screen of the viewport (`IntersectionObserver`), it loads in the background the controller (`sql-block.ts`, about 4 KB gzipped), the editor (CodeMirror, `sql-editor.ts`, about 120 KB gzipped), and the engine with the five cafe-sales CSVs from `datasets/cafe-sales/v1/` (`sql-runtime.ts` about 46 KB, the worker about 189 KB, the Wasm engine about 7.7 MB gzipped because GitHub Pages compresses `.wasm` with gzip, the CSVs about 35 KB). The engine compiles in a worker, so the page stays responsive. A visitor who only reads a lesson and never nears a block downloads about 3 KB for the runner (the script and 2 KB of CSS); one who scrolls near a block downloads about 8.1 MB once, then the browser cache serves it. **Exception:** with Data Saver (`navigator.connection.saveData`) or a 2G connection nothing is preloaded; loading starts on the first focus or Run. The UI uses no technical words about loading: if Run is pressed before the preparation has finished, box 2 shows "Getting ready…" with a thin progress bar and, once per page and never stored, "The first run takes a few seconds to get ready. After that, every run is instant." (a polite live region); the query then runs automatically. A loading failure says "Couldn't start. Check your connection and press Run again." **Bundles:** `eh` (34.2 MB raw, 7.7 MB gzip) is smaller than `mvp` (39.4 MB, 8.7 MB), and `coi` needs cross-origin isolation headers that GitHub Pages cannot send, so `eh` stays (it needs WebAssembly exception handling, present in every current browser); all 222 lesson queries (26 `<RunSQL>` plus 196 fenced) give identical results on `eh` and `mvp`. The stable release stays (owner-approved default). **Tables panel:** a Tables button lists the five tables with their columns, types and row counts, built at build time from `cafe-sales.sql` (`src/lib/cafe-schema.ts`), so it shows before anything loads; a table name adds `SELECT * FROM <table> LIMIT 10;` to the editor and Preview shows its first 5 rows. **Errors** show the first line of the engine's message without its jargon label plus a short tip for the common beginner mistakes (a missing or misspelled column, text without single quotes, a missing comma, an unclosed quote, a missing GROUP BY, an ambiguous column, SUM of text); each tip was tested against the engine (`src/scripts/sql-errors.ts`, `tests/sql-errors.test.ts`). **Auto-run** (off by default) re-runs a query that only reads data 800 ms after typing stops, only when the engine is already loaded, and shows errors quietly. Keyboard: Ctrl/Cmd+Enter runs; Tab indents and Escape then Tab leaves the editor; focus is visible; light and dark follow the site theme. **Playground:** `/sql/playground/` (§3.1) is the same runner on a full-height page: editor and output side by side (stacked on phones), Tables as a side drawer, a friendly first query, five example queries that replace the editor text on click, Reset data and Reset query; without JavaScript it says it needs JavaScript and lists the examples. One database per page: every block shares it, so a table or view made in one block is seen by the next; Reset data drops everything and reloads the five tables. The result caps at 50 rows with a "n more rows" note. **Nothing is stored** (no `localStorage`, cookies or IndexedDB) and **nothing is sent anywhere**. Without JavaScript a lesson block is the plain highlighted code with a note. The engine is DuckDB 1.4.3 (Wasm build `1.32.0`); the lessons are checked against DuckDB 2.0.0 and 217 of 219 lesson queries give identical results (the two differences are unordered `INTERSECT` rows). A blank starter is fine for open exercises (owner-approved default), and rolling `<RunSQL>` out to all 35 lessons waits for the interleaved rewrite. The Colab button was dropped from the SQL stage by D43. Planned next, not part of this decision: Correct / Wrong self-checking on exercises (needs its own decision). Python and Excel are not affected. |
| D43 | No notebooks or Colab in the SQL stage | **Every SQL query runs in the lesson page; Colab is introduced in the Python stage** (owner decision, 2026-11-18) | The 39 SQL lessons have no `notebook` field, no `<OpenInColab />` and no `notebooks/sql/` files: the in-page runner (D42) replaces them, and a learner who starts SQL should not have to meet Colab, pip and Python first. Amends D4 (Colab links remain for Python), D39 (the `v0.1.0` tag and the data URLs stay valid for later notebooks) and D40 (S1 to S39 are written for the page runner). The optional `notebook` frontmatter field, the `<OpenInColab />` component and the `nbstripout` gate stay for the Python stage. |
| D44 | Stage cheatsheets; a math block in two tracks | **One printable, no-JavaScript cheatsheet page per stage at `/{stage}/cheatsheet/`, SQL first** (`/sql/cheatsheet/`, "SQL in a nutshell"; owner decision, 2026-11-19). **Second owner decision, same day:** linear algebra ("NumPy for math") will be a small math block at the start of the Data Scientist and ML Engineer tracks, not part of Python and not part of the core; the lessons are planned, not written. | A cheatsheet is a normal docs page (a page in `src/pages/`, not a lesson, so `classify()` ignores it) with an "On this page" list, in the sidebar after the stage's lessons and linked from the stage on `/start/` (`CHEATSHEETS` in `src/lib/roadmap.ts`). Its content is data (`src/data/cheatsheets/{stage}.ts`, shape in `src/lib/cheatsheet.ts`) drawn by one reusable component (`src/components/cheatsheet/Cheatsheet.astro`), so Excel and Python can reuse it. **The Excel cheatsheet (`/excel/cheatsheet/`, "Excel in a nutshell") is data-first: its parts follow the flow of the data (shape, clean, query and summarize, combine tables, repeatable processing and quality, communicate), and each card ends with a "Next" line naming its twin in the coming stages (linked SQL lessons, pandas method names only); owner request 2026-11-19.** **Content comes only from published lessons** of the stage (their big idea, Common trap and Check yourself), in the lessons' own cafe-sales vocabulary; each entry is a short pattern, one plain sentence, the most common trap where the lesson names one, and a link to its lesson. **The Python cheatsheet (`/python/cheatsheet/`, "Python in a nutshell") exists (owner request, 2026-11-20):** 27 cards, one for each of the lessons P1 to P27, in seven parts that follow the flow of the data (Python basics P1–P8; load and look P9–P11; select, derive, group, merge P12–P15; clean: missing, dates, text P16–P18; reshape and window-like columns P19–P20; charts and outside data P21–P23; ship it P24–P27), with three drawings of our own (split-apply-combine, a merge with `validate` and `indicator`, wide and long). Each card has its pattern in the lesson's own cafe-sales names, one plain sentence and the Common trap of its lesson; where a pandas pattern has a twin taught earlier, a short "Twin" line names it (linked SQL and Excel lessons, published ones only). Every pattern must run on the cafe-sales data (`scripts/check-cheatsheet-python.py`, wired as `npm run check:cheatsheet-python` and a step of `npm run check`; it needs pandas, numpy, openpyxl, matplotlib and seaborn and skips with a message when they are missing); its `$` lines are shell commands, checked only for existing. Lessons P1–P27 show the footer line "Sum it up: this lesson in the Python cheatsheet →" (card anchors `#p1` to `#p27`). SQL follows the three parts of D40 (S1–S17, S18–S32, S33–S39) and carries three small build-time inline SVG drawings of our own (clause order, join types, aggregate against window) in the clause colors of D41. Every SQL pattern must parse and run in DuckDB on the cafe-sales tables (`scripts/check-cheatsheet-sql.py`); `tests/cheatsheet.test.ts` checks that every cited lesson is published and inside its part. **Card anchors are part of the URL contract, like reference pages (owner decision, 2026-11-19): a card's id is its lesson code in lowercase (`/sql/cheatsheet/#s8`, `/excel/cheatsheet/#e15`); when several cards share a lesson (Excel E4, E13) the first card on the page carries the id; an anchor is never renamed or reused without a redirect-style note in the changelog. Every published lesson that has a card shows one line in its footer next to "Unlocks next", "Sum it up: this lesson in the SQL cheatsheet →" (Excel likewise), built at build time from the sheet data (`cheatsheetLink` in `src/data/cheatsheets/index.ts`) so it cannot drift; lessons without a card show none; the Python stage has one too (below). The target card gets a calm `:target` outline and a `scroll-margin-top`; no JavaScript.** **Zero JavaScript of its own** (the page ships only what every docs page ships, D31) and readable without JavaScript. One column on phones, a card grid on wide screens; print is one A4 sheet, both sides (two pages), black on white, no site chrome. The math block amends the note "linear algebra and calculus are not taught" in `research/curriculum/07-curriculum-rationale.md` (calculus is still not taught); when the two tracks are built, record the lessons in the curriculum map and SPEC §14. |
| D45 | Python stage shape | **27 lessons: the Python stage follows the research of issue #61** (owner decision, 2026-11-19) | The draft stage (25 lessons) was checked against five Python-for-data syllabi and changed as follows. **Cut:** `comprehensions` as a standalone lesson, folded into `lists-and-loops` (one-line list form only). **Renamed and extended:** `files-csv-json` becomes `files-and-tables` (adds `read_excel`, one `read_sql` query, the encoding rules and one DuckDB demo that reuses the SQL stage). **Split:** `charts` becomes `charts-matplotlib` (keeps the id `python-charts`, which other stages cite) and `charts-seaborn`. **Added:** `pandas-derived-columns` (`assign`, `map`, `apply`) and the exit capstone `cafe-quarterly-pack`, before `notebook-to-script`. Two awareness boxes, not lessons: Polars at the end of the stage and Plotly closing `charts-seaborn`. `environments-and-pip` is a required late lesson, no longer a stretch lesson. The twelve SQL-to-pandas bridge traps and the ten beginner traps of the issue each appear as a named exercise slot with a known-answer check, in the lesson the issue assigns (the traps the issue leaves open went to the obvious lesson, listed in the PR). **Notebooks** live in the repository, one per lesson, at `notebooks/python/{lesson-id}.ipynb` (named by lesson id, not slug), open through the Colab GitHub URL (§7) and read the cafe-sales tables from the `v0.1.0` tag (D39); the Google Drive folder named in the issue is not used. `reviewed` stays a date and every lesson stays `status: draft`. Lessons follow the interleaved shape of `LESSON-STANDARD.md`, with the known-answer slots inside Learn by doing. NumPy linear algebra is not taught in this stage and does not go to the advanced core, whatever §4 of the issue says: it belongs to the math block of the Data Scientist and ML Engineer tracks (D44), and `numpy-vectorization` shows one `@` example and points forward. Amends D32 and D40: **166 lessons in 8 stages** (Excel 22, SQL 35, Python 27, core 25, Data Analyst 13, Data Engineer 20, Data Scientist 12, ML Engineer 12; SQL and Data Engineer counts after D53); `v1.0.0` is the four core stages (**109 lessons**). No `/python/` page was ever published (every Python lesson is a draft, D18), so the renames and the cut need no redirect. |
| D46 | Accented menu names for the text-cleaning trap | **A new companion dataset `datasets/cafe-menu-accents/` (v1, one CSV of 48 rows, linked to cafe-sales by `store_id` and `product_id`)** (owner decision, 2026-11-19) | The text-cleaning lesson of the Python stage (`pandas-text-cleaning`, trap 7 of research issue #61) needs accented names that exist in two Unicode forms, NFC and NFD, which look identical and do not match in a filter, a groupby or a merge until normalized. `datasets/cafe-sales/v1/` is immutable (§7), so the file is not added there: it is a separate dataset folder with its own `v1/`, `README.md` (license CC BY 4.0), `schema.yaml` and generator `scripts/build-cafe-menu-accents.py` (`--check` confirms the CSV, no random numbers). `v1/menu_accents.csv` has `menu_item_id`, `store_id`, `product_id` and `board_name`: the 16 products on the three cafes' menu boards with accented names such as café, crème brûlée, jalapeño, açaí and piña colada (48 rows). Store 1's names are NFC, store 2's are NFD, store 3's are mixed (NFD for even product ids), so the 48 lines hold 26 different texts but 16 names after NFC normalization. It ships no `.xlsx` or `.sql` (an exception to the last bullet of §7: only the Python stage uses it). Notebooks load it from a release tag (§7); it is newer than `v0.1.0`, so a lesson links it only after the owner creates the first tag that contains it. A lesson lists it as `datasets: [cafe-menu-accents]`. No batch 1 lesson uses it; the text-cleaning lesson comes later. |
| D47 | Short lesson names in lists | **An optional `short_title` (at most 24 characters) is the lesson's one-line name in the sidebar and the taskbar's Course list** (owner decision, 2026-11-20) | Long titles wrapped onto two or three lines and made the sidebar hard to scan. The sidebar row and the Course row show `short_title` when present, else `title`; the sidebar row keeps the code column and has the full title as its hover tooltip, and its accessible name is the code plus the visible name. The page heading, `<title>`, Unlocks next, Before this lesson, `/start/` and the Next button keep the full title. `npm run check:lessons` fails when the name a published lesson shows in the sidebar (its `short_title`, else its title) is too wide for one line: over 26.5 when each capital letter counts 1.25 and every other character 1 (amended 2026-11-20 after all-capital names such as `UNION, INTERSECT, EXCEPT` still wrapped). URLs and ids are unchanged. A draggable or wider sidebar was considered and rejected: dragging needs JavaScript on lesson pages (D31) and a wider column alone still wraps. |
| D48 | Where the advanced core's engineering lessons run | **The learner's own laptop first, GitHub Codespaces as the fallback** (owner decision, 2026-11-20, from research issue #71) | The engineering block of the advanced core (terminal, Git, project layout, environments, testing) needs a real terminal, which Colab does not give. The main path is a free local setup on Windows, macOS or Linux: VS Code, Git, and uv (which also installs Python), checked by a `check_environment.py` script that prints pass or fail for each part and the fix for each failure; Windows lessons use Git Bash inside VS Code so every command matches macOS and Linux; ChromeOS uses its Linux environment once that path is verified. GitHub Codespaces (free tier, no payment method, blocked rather than billed at the limit) is the fallback for learners without a usable laptop or on a phone; lessons name its one trap (a stopped codespace is deleted after 30 days, so push your work). Lessons are written so one template repository works both ways (clone it, or open it in a codespace); where the two paths differ, the page says so. Colab stays the Python stage's home. The block's lesson list, order and size are decided separately. |
| D49 | Advanced core shape | **43 lessons in six parts of about four hours each, with one project that grows part by part, then one capstone case (44 lessons)** (owner decisions, 2026-11-20, from research issues #71, #72, #73, #88, #89 and #92) | Each part leans on what the learner already knows, familiar first, opens with a **skip check** (4 to 6 questions in `<details>`, no JavaScript; all right means go to the next part) and ends with a **project step** on cafe-sales; there is no separate capstone. **1 Statistics I** (orders 10 to 70, Colab and pandas): descriptive report. **2 Statistics II and decisions** (80 to 150): decision memo; `telling-the-story` also teaches chart choice, decluttering and takeaway titles for every role (owner question, 2026-11-20; visualization defines the Data Analyst in #87), while interactive charts and BI dashboards stay in the Data Analyst track and model plots in the Data Scientist and ML Engineer tracks. **3 Shapes of data** (160 to 210): new `modeling-the-domain` (entities, relationships, reading an entity-relationship diagram, many-to-many as a table, grain declared before DDL; use depth for all roles, #89 finding 1), grain and facts, star schema, ML framing, leakage, error-cost metrics; project step: a star schema, placed at the end of `designing-a-star-schema` and not at the end of the part, because the three ML lessons after it never touch a star (owner approval, 2026-11-21). **4 Engineering on your laptop** (220 to 290, D48): `laptop-setup-and-terminal`, Git (saving a history), `python-project-layout`, `environments-and-dependencies` (uv), `debugging-and-retries`, `testing-with-pytest`, `logging-config-secrets`, `readable-code-and-classes` (type hints, docstrings, ruff, reading docs, library classes and one `@dataclass`; inheritance recognized only); project step: a tested repository. **5 Teamwork, scale and the platform** (300 to 350): Git branches, pull requests and review, `data-beyond-tables` (nested JSON, events, the two format pairs, flatten, explode, normalize), `a-feel-for-scale` (dict and set cost at use depth, no formal Big-O), cloud (the eight infrastructure concepts of #72, access control and governance), new `inside-the-database` (query plans as operator trees, why the planner skips an index, what a transaction promises and why numbers move during a refresh, replica versus backup, stored procedures and triggers recognized; recognition depth, #89 finding 2), warehouses and cost (adds additive versus non-additive measures); project step: a reviewed pull request, Parquet, the star schema loaded into DuckDB with one plan read and one cost estimate. **6 Working with AI** (360 to 430, about four hours; owner request to put it last before the tracks, #88): `what-ai-can-and-cannot-do` (the capability map as a cliff: tidy tasks near the ceiling, realistic ones far below, every number dated), `prompting-with-the-data-in-the-room` (the context pack as a standing file), `trust-but-verify-ai-output` (45 minutes; every AI task ends in accept, revise or reject), `find-the-planted-error` (errors named first) and `hunt-the-unflagged-error`, `ai-statistics-and-stories` (wrong test choice, p-hacking, causal verbs, citations that do not resolve), `what-stays-human`, RAG and agents; project step: one AI-assisted analysis with its context pack and a verification log, the README and the final memo, then the capstone. **Capstone** (order 440, about 4 hours, owner request 2026-11-20): `capstone-two-quiet-weeks`, a real openly licensed dataset (UCI Bike Sharing, Capital Bikeshare 2011–2012, CC BY 4.0, downloaded from UCI, not hosted) with our own brief; no politics (owner); any of Excel, SQL or Python; an open answer graded by a rubric on the chain of reasoning; AI use allowed and documented in a verification log; the reference answer, in `<details>`, ends with a section that says the author knew the learner would use AI and names the shortcuts AI takes on this data (research #92 design rules); then `/choose-your-track/` (D50). The thesis of the part is that the fundamentals are the detectors of AI mistakes. Capability numbers live in one dated box per lesson, reviewed every six months; the rest of the part is reviewed yearly. **No separate ethics lesson:** consent and personal data (PII) go into C1, access control and governance into the cloud lesson, and personal data in prompts into the AI lessons. Docker is an awareness box in the cloud lesson; build depth is in the DE and ML tracks, as are CI/CD, inheritance authorship and validation libraries (pandera, pydantic). **Database internals (#89):** relational algebra and calculus are not taught in the core (the operators are taught as the boxes of a query plan); the Data Engineer module's lesson on plans and operators names the algebra operators at recognition depth (placement left to the team by the owner, 2026-11-21); the Data Engineer track gets a ten-lesson database internals module (orders 200 to 290: plans and operators, indexes, join algorithms, row and column storage, transactions and isolation, write skew, locks and MVCC, WAL and recovery, architectures and trade-offs, procedures and triggers), each shown by a real run on free tools except recovery internals; data mining belongs to the Data Scientist track. Building agents, RAG pipelines and evaluation harnesses belongs to the ML Engineer and Data Engineer tracks. The DSA practice gym of #73 is planned after the tracks exist and is not built. Ids and slugs of existing lessons are unchanged and `order` is renumbered in steps of 10 (core and tracks are unpublished, so no URL changes). Counts: core **44** (43 plus the capstone), curriculum **200** lessons in 8 stages (Excel 22, SQL 39, Python 27, core 44, Data Analyst 13, Data Engineer 31, Data Scientist 12, ML Engineer 12; SQL and Data Engineer counts after D53); `v1.0.0` is the four core stages (**132** lessons). Worked examples of the statistics lessons keep their `app-events` or `cafe-sales` dataset; project steps use cafe-sales, except the Part 2 step, a decision memo on the `app-events` experiment `signup_flow_v2`, because cafe-sales has no experiment (owner decision, 2026-11-21). Part sizes (sum of lesson minutes, before skip check and project step): 200 (Part 1 after formulas, D51), about 280 (Part 2 as written, accepted by the owner on 2026-11-21; planned 240), about 216 (Part 3 as written, approved by the owner on 2026-11-21; planned 170), 270 (Part 4 as written, approved by the owner on 2026-11-22; planned 245), 210 (Part 5 as written, approved by the owner on 2026-11-22; planned 165) and 240. Showing the six parts on `/start/` needs a `part` field in the lesson schema (§5, a CONTRACT change) and is left as a TODO. Amends D32, D40, D45 and D48. |
| D50 | Choose your track | **A page at `/choose-your-track/` after the core: what a track is, a link to the career quiz, four small radars (one per career) on eight skills with the score printed by each label, the mathematics each track needs at entry and what career switchers misjudge** (owner requests, 2026-11-20; evidence and chart form from research issue #87) | Every track is master's-like in knowledge and judgment; mathematics differs by track (the Data Scientist and ML Engineer tracks are math-heavy, the Data Analyst track needs friendly statistics, the Data Engineer track is software and systems; #87 §4), so the page no longer says all four are math-heavy. Eight skills (#87 §2): statistics and math, experiments and A/B testing, ML and modeling, software engineering, pipelines, platforms and cloud, SQL and data modeling, business communication, visualization and storytelling; domain knowledge is a sentence, not an axis. The owner kept the four radars only (2026-11-20: grouped bars were redundant); #87 §6 found radars the hardest form for this task (Albo et al., IEEE TVCG 2016), so each radar follows its conditions: one role per chart, one axis order, one scale, a light fill and the number printed beside every label. Everything is built at build time in `src/components/project/TrackChooser.astro` from `src/data/track-skills.ts` (scores, per-cell reasons with a confidence per skill, the math table, the warnings), with no JavaScript. Every reason cites primary sources only, linked on the page: a dated sample of 45 job postings, O*NET OnLine, the UK Digital and Data Capability Framework and SFIA 9; never the site's GitHub issues. The page says the scores are a guide, not a measurement. Linked from `/start/` after the core, from the career quiz, the sidebar and the end of the core. Re-sample the postings yearly, ML engineer first. |
| D51 | Math in lessons | **Formulas are written in LaTeX between double dollar signs and rendered at build time to MathML: no KaTeX stylesheet, no fonts, no JavaScript on the page** (owner request, 2026-11-20; the advanced core starts to use formulas) | `remark-math` 6.0.0 with `singleDollarTextMath: false` and `rehype-katex` 7.0.1 with `output: 'mathml'` (KaTeX 0.16.47 runs at build time only), set in `astro.config.mjs`. **A single `$` is never math**: lessons use it for money ("$3.50", "$5"), so inline math is `$$…$$` on one line and display math is a `$$` block on its own lines. The browser draws the MathML natively; the TeX source stays in the page as the `annotation` of each formula, and screen readers read the MathML. `src/styles/math.css` sets the color (`--fg`) and size, centers a display formula and lets a wide one scroll inside its own box instead of the page. A formula never replaces words: it comes after a plain-words explanation and every symbol is defined (`LESSON-STANDARD.md`). No math in headings (build error, §6). **A TeX error fails the build:** rehype-katex alone ships a red `span.katex-error`, so `src/lib/rehype-math-errors.ts` throws `file:line: TeX error in a formula: …` for any such element (invalid fixture `math-tex-error`). **No published or draft page used `$…$` math (checked 2026-11-20), so no migration is needed.** cspell and markdownlint ignore `$$…$$`; `check:lessons` does not read math as prose. The fixture `tests/fixtures/valid/docs/sql/sql-joins.mdx` carries one inline and two display formulas and the dollar amounts "$3.50 or $5", and `tests/fixtures.test.mjs` checks that the amounts stay text. `\$` in prose still works but is no longer needed. Amends the math row of §2 and the dollar rule of §6. |
| D52 | The `app-events` dataset, v1 | **`datasets/app-events/` v1: a fictional budgeting app with four tables (`users` 21,841 rows, `events` 177,379, `subscriptions` 3,840 rows for 2,905 subscriptions, `experiment_assignments` 15,868), three A/B tests, paginated JSON files, and a generator `scripts/build-app-events.py` (seeded; `--check` rebuilds, asserts every planted quirk and fails when the README or `schema.yaml` quotes a number the data no longer has)** (planned in the approved curriculum map; built 2026-11-20, owner review pending) | Part 2 of the advanced core (hypothesis tests, comparing groups, correlation and causation, defining metrics, diagnosing a movement, experiments, telling the story) and 43 lessons in all need data whose truth is known. The README states the true parameters (`paywall_v2` has a real lift of x1.20 with a novelty effect that makes week one larger; `welcome_tips` has none, with a running p-value that dips under 0.05; `signup_flow_v2` has none and a sample-ratio mismatch with a stated cause) and lists every planted quirk with the lessons that use it, among them a mix shift, a renamed event, an outage, late and duplicated events, a confounder, a reversal, a leaky column and a one-day Memorial Day dip as a labeled distractor. **Additions to the approved map, disclosed:** the columns `events.received_at` (so that late can be measured) and `subscriptions.cancel_reason` (the leaky column); a `v1/api/` folder of paginated JSON pages for the ingestion lessons (events received from June 16, all subscription rows; page 7 of events repeats 3 rows on purpose); a `.sql` that creates the tables and loads them with `COPY ... FROM` the CSV files, because the events table is too big to embed as INSERT statements; and the random labels (salts) of the three experiments, chosen from a few dozen to a few hundred candidates so that each experiment tells its story (the truth does not depend on the choice). **Not in the data:** rate limits and retries (a static file cannot refuse a request, so the ingestion lesson supplies its own wrapper), deletes between two snapshots (a deleted account is only the absence of its `users` row) and any stored continuous measure (revenue and session length are derived by the lesson). The workbook holds all four tables; no Excel lesson uses the dataset. Notebooks load from a release tag newer than `v0.1.0`, so a lesson links the dataset only after the owner creates the first tag that contains it (as for D46). **Where it runs:** the in-page SQL runner (D42) cannot load `app-events` today (`src/scripts/sql-runtime.ts` is written for cafe-sales, and `events.csv` is 13 MB), and the SQL-stage lessons that the map ties to it use cafe-sales; until a decision is made the dataset is for Colab and Python notebooks, a local DuckDB and Excel. The seed and the three experiment salts are part of the v1 contract. |
| D53 | SQL modeling, access and database logic | **Four SQL lessons added: reading ER diagrams, access and injection, triggers and procedures, a table-design workflow; codes renumbered S1–S39** (owner decisions and approval, 2026-11-21, from the DBMS course map and research issue #107) | `sql-reading-er-diagrams` (S19, before the joins: crow's foot with a verb phrase on every link, read both ways; UML class diagrams as a separate recognition box), `sql-access-and-injection` (S30: views and least privilege, injection and parameters), `sql-triggers-and-procedures` (S35: triggers and procedures, their costs for analytics; the trigger blocks are read only because the in-page engine, DuckDB 1.4.3, has no `CREATE TRIGGER`, and become runnable when it reaches 2.0; no notebook, D43 holds), `sql-designing-tables-workflow` (S37: conceptual, logical and physical levels, user stories, translation patterns). Crow's foot figures carry symbols and verbs only; multiplicity numbers belong to UML (LESSON-STANDARD). Every SQL `order` is its rank × 10 and the codes after S18 moved (published URLs unchanged; old SQL cheatsheet anchors `#s20`–`#s35` now point at other cards, noted in the changelog under D44). Course crosswalk (topics and order only, no course text, no R): module 1 → S1; 3 → S19, S37 and C16; 4 → S18, S36, S37; 5 → S33, S37; 6 → the query lessons; 7 → S35; 9 relational algebra → the Data Engineer database internals module (D49); 10 → S38 and `inside-the-database`; 11 → S34, core Part 5 and the DE module; 12 → S39; 13 → S31, C17, C18 and the warehouse lesson; 15 → S30; 2 (R), 8 and 14 skipped. The deep modeling of #107 (generalization strategies, weak entities, the full key taxonomy, logical to physical) is one Data Engineer draft lesson `logical-to-physical-design` (order 135). Amends D40, D43 and D49 counts (SQL 39, Data Engineer 31, curriculum 200, `v1.0.0` 132). |
| D54 | What's new page | **`/changelog/` is a short "What's new" list built from the bold summaries of `CHANGELOG.md`; the full detail stays in that file on GitHub** (owner request, 2026-11-23; amends §9) | Every top-level bullet of `CHANGELOG.md` starts with a bold, dated, learner-facing summary of at most about 20 words (`- **2026-11-23: What changed.** Detail.`) and keeps its detail after it. The page (`src/components/project/ProjectExtras.astro`, parsing in `src/lib/changelog.ts`) shows only the summaries, by month, newest first, and ends with one line linking the full file; a summary that names a published lesson by its title links to it. A summary stays the single source: no copy of the file is kept. `npm run check:changelog` (a step of `npm run check`, tested in `tests/changelog.test.ts`) fails with the file and line of a bullet without a summary. Reason: learner-facing pages stay short, as vendors separate user release notes from developer detail. The URL, zero JavaScript (D31) and print are unchanged. |

---

## 2. Tech stack

| Layer | Choice | Rule |
|---|---|---|
| Framework | Astro + Starlight (latest stable at build time) | Exact versions pinned in `package.json`; `package-lock.json` committed |
| Runtime | Node.js current LTS | Pinned in `.nvmrc` and in CI |
| Content | Markdown (`.md`) by default; `.mdx` **only** when a component from §6 is used | Keeps content portable to any future framework |
| Schemas | Astro content collections + Zod | Build fails on invalid frontmatter |
| Search | Starlight built-in (Pagefind) | Static, no external service |
| Math | `remark-math` + `rehype-katex` (KaTeX, MathML output for accessibility) | Formulas in `$$…$$` only; a single `$` is money (D51) |
| Motion | GSAP 3.13+ (any plugin, each effect loaded on demand, D28) | Homepage only (§10); JS before first paint ≈ 3 KB gzipped (D28) |
| Hosting | GitHub Pages via GitHub Actions | Deploy on push to `main` |

---

## 3. URL contract — **CONTRACT**

### 3.1 Route map

| Route | What | Collection |
|---|---|---|
| `/` | Homepage (custom page, GSAP) | — |
| `/start/` | How to use datafromzero, plus the roadmap: the stages on a vertical rail, each stage with published lessons a native `<details>` (closed by default) listing its lessons in `order` with their codes and the codes they need first (`src/lib/roadmap.ts`); built at build time, no client JavaScript (D34) | `docs` |
| `/excel/` · `/excel/{lesson}/` | Stage 1 — Excel / Google Sheets | `lessons` |
| `/sql/` · `/sql/{lesson}/` | Stage 2 — SQL | `lessons` |
| `/python/` · `/python/{lesson}/` | Stage 3 — Python | `lessons` |
| `/core/` · `/core/{lesson}/` | Stage 4 — Advanced core (six parts: statistics, decisions, shapes of data, engineering on your laptop, teamwork, scale and the platform, working with AI; D49) | `lessons` |
| `/data-analyst/{lesson}/` | Branch — Data Analyst | `lessons` |
| `/data-engineer/{lesson}/` | Branch — Data Engineer | `lessons` |
| `/data-scientist/{lesson}/` | Branch — Data Scientist | `lessons` |
| `/ml-engineer/{lesson}/` | Branch — ML / AI Engineer | `lessons` |
| `/reference/glossary/` · `/reference/glossary/{term}/` | Glossary | `glossary` |
| `/reference/excel/{function}/` | e.g. `/reference/excel/xlookup/` | `reference` |
| `/reference/sql/{keyword}/` | e.g. `/reference/sql/group-by/` | `reference` |
| `/reference/pandas/{name}/` | e.g. `/reference/pandas/merge/` | `reference` |
| `/reference/stats/{formula}/` | e.g. `/reference/stats/standard-deviation/` | `reference` |
| `/careers/{career}/` | Career guides (the 4 roles, D32) | `careers` |
| `/stories/{slug}/` | History / story / visualization pages (static for now, D28) | `stories` |
| `/datasets/` · `/datasets/{name}/` | Dataset documentation + download | `datasets` |
| `/cite/` · `/changelog/` · `/about/` · `/license/` · `/privacy/` | Project pages | `docs` |
| `/sql/cheatsheet/` | SQL in a nutshell: the one-page printable cheatsheet of the SQL stage (D44), content from published lessons only, no JavaScript of its own (a page in `src/pages/`, not a lesson); later stages get `/{stage}/cheatsheet/`; anchors on cheatsheet pages (`#s8`, the lowercase lesson code on a lesson's first card) are part of the contract, like reference pages | — |
| `/python/cheatsheet/` | Python in a nutshell: the printable cheatsheet of the Python stage (D44), one card for each of P1–P27 in the data flow, with a SQL and Excel twin line where one exists, content from published lessons only, no JavaScript of its own (a page in `src/pages/`, not a lesson); anchors `#p12` etc. as for the SQL sheet | — |
| `/excel/cheatsheet/` | Excel in a nutshell: the printable cheatsheet of the Excel stage (D44), data first, content from published lessons only, no JavaScript of its own (a page in `src/pages/`, not a lesson); anchors `#e15` etc. as for the SQL sheet | — |
| `/sql/playground/` | SQL playground: the in-page runner of D42 on a full-height page, five cafe-sales tables ready; nothing stored or sent (a page in `src/pages/`, not a lesson) | — |
| `/career-quiz/` | Career quiz: ten questions that suggest one of the four careers, scored in the browser by one small script that stores and sends nothing; works on paper without JavaScript (D33) | `docs` |
| `/choose-your-track/` | Choose your track: how the four careers differ and a skills radar chart with its table and derivation, no JavaScript (D50); a project page, `docs` collection (a Markdown page plus `TrackChooser`) | `docs` |
| `/vi/…` | Vietnamese mirror of every route above, **same slugs**. **Paused (D30):** the published `/vi/` pages redirect to English | |

### 3.2 Slug rules
- Lowercase English, kebab-case, ASCII only: `/sql/window-functions/`. Vietnamese pages reuse the English slug.
- **No numbers, dates or versions in slugs.** Order comes from `order` in frontmatter.
- Always a trailing slash (`trailingSlash: 'always'`).
- The slug is derived from the file name; the file name **is** the slug.

### 3.3 Change rules
- **Never rename or delete a published URL.** If a rename is unavoidable:
  1. add an entry to `src/redirects.ts` (old → new),
  2. keep the lesson `id` unchanged (§5.1),
  3. note it in `CHANGELOG.md`.
- A retired page stays online with `status: deprecated` and a link to its replacement.
- Anchors (`#heading-id`) on reference pages are part of the contract — headings there are not renamed casually.

### 3.4 Linking inside content
- Internal links are **root-relative** (`/sql/joins/`), never absolute (`https://datafromzero.github.io/…`).
- Link to other lessons by path; the build validates every internal link (§12).

---

## 4. Information architecture

```
datafromzero
├─ Learn (Study mode — open, quiet, one idea per screen)
│  ├─ 1 Excel / Sheets → 2 SQL → 3 Python → 4 Advanced core
│  └─ Branches: Data Analyst · Data Engineer · Data Scientist · ML/AI Engineer
├─ Reference (Book mode — indexed, compact, searchable)
│  ├─ Glossary
│  ├─ Syntax: Excel functions · SQL keywords · pandas
│  ├─ Statistics formulas
│  └─ Careers (4 guides)
├─ Stories (history, explainers, visualizations — motion allowed)
├─ Datasets
└─ About · Cite · Changelog · License · Privacy
```

Sidebar order and grouping are generated from frontmatter (`stage`, `order`), never hand-maintained.

---

## 5. Content model — **CONTRACT**

Schemas are registered in `src/content.config.ts` and defined in `src/lib/content-schemas.ts`;
validation runs on every build (`src/lib/content-validation.ts`). Adding an **optional** field = MINOR change.
Adding a required field, renaming or removing a field = MAJOR change + migration script.

Rules for every type (D17):
- `id` is lowercase kebab-case (`a-z`, `0-9`, `-`) and unique across all content types (an English page and
  its Vietnamese translation share one id).
- The file's folder decides its type (paths in the headings below). A file nested deeper than its type allows fails the build.
- Every id reference must point to an existing entry of the right type.
- `sources[].url` and `sheet` must be `http(s)` URLs.
- The build reports all problems at once, naming the file and field, and fails.

### 5.1 Lesson (`src/content/docs/{stage}/{slug}.md`)

```yaml
---
id: sql-joins                 # permanent internal key; never changes, even if the slug does
title: Joining tables
short_title: Joins               # optional, ≤ 24 chars, one sidebar line; required when a published title is over 26 chars (D47)
description: Combine rows from two tables with INNER and LEFT JOIN.   # ≤ 160 chars, used for SEO/social
stage: sql                    # excel | sql | python | core | data-analyst | data-engineer |
                              # data-scientist | ml-engineer
order: 40                     # sort key inside the stage; use gaps of 10 so lessons can be inserted
level: beginner               # beginner | intermediate | advanced
duration: 25                  # minutes, integer
objectives:                   # 2–5 items, each starts with a verb
  - Explain what a join key is
  - Write an INNER JOIN and a LEFT JOIN
prerequisites:                # lesson ids (not URLs); validated at build time
  - sql-select-basics
datasets: [cafe-sales]        # dataset names (§7); optional
notebook: notebooks/python/py-pandas-joins.ipynb   # optional, Python stage on (D43); drives the "Open in Colab" button
sheet: https://docs.google.com/spreadsheets/d/…/copy   # optional; Excel stage "Make a copy" link
reviewed: 2026-11-15          # last date the content was checked for correctness
sources:                      # at least 1; documentation, papers, books
  - title: PostgreSQL documentation — Joined tables
    url: https://www.postgresql.org/docs/current/queries-table-expressions.html
status: published             # draft | published | deprecated
replaced_by: null             # lesson id, required when status = deprecated
---
```

- `stage` must match the lesson's folder.
- `status: draft` lessons are built only in local dev, never deployed (D18). A published or deprecated
  lesson may not list a draft in `prerequisites` or `replaced_by`.
- A deprecated lesson shows a notice linking to `replaced_by` (§3.3).

Rendered at the top of every lesson: **code · level · duration · last reviewed** (the code is the stage prefix plus
`order / 10`, e.g. E8; a label, never part of a URL, D34), then **Objectives** and
**Before this lesson** (prerequisite links). Rendered at the bottom: **Unlocks next** (the lessons that list
this one in `prerequisites`, drafts excluded, in the reader's language, computed at build time without
JavaScript; hidden when empty), **Sources**, **Cite this lesson**, **Suggest an edit**, **Report an issue**, prev/next.
- Inside one stage, `order` must be a topological order of `prerequisites`: a prerequisite in the same stage
  has a smaller `order`. Prerequisite cycles fail the check (`scripts/check-graph.ts`, §12).

### 5.2 Reference entry (`src/content/docs/reference/{area}/{slug}.md`)

```yaml
---
id: ref-sql-group-by
title: GROUP BY
area: sql                     # excel | sql | pandas | stats
summary: Groups rows that share values so aggregates are computed per group.
syntax: |                     # optional, shown in a code block at the top
  SELECT col, AGG(x) FROM t GROUP BY col;
see_also: [ref-sql-having, glossary-aggregate]   # ids
used_in: [sql-aggregation]    # lesson ids; optional (can also be computed)
reviewed: 2026-11-15
sources: [ … ]
---
```
Reference pages use a fixed section order: **Syntax → Parameters → Examples → Common mistakes → See also.**

`area` must match the folder. `see_also` is required (an empty list is allowed); its ids may be reference
entries or glossary terms. `used_in` must name existing lessons that are not drafts (D18).

### 5.3 Glossary term (`src/content/docs/reference/glossary/{slug}.md`)

```yaml
---
id: glossary-primary-key
term: Primary key
short: A column whose value uniquely identifies each row.   # ≤ 140 chars, used in hover/inline tooltips
aliases: [PK]                 # required; an empty list is allowed
reviewed: 2026-11-15
---
```
`term` is also used as the page title.

### 5.4 Career guide, Story, Dataset
- **Career** (`/careers/{career}/`): `id`, `title`, `summary`, `skills[]`, `stages[]` (which stages/branches to finish), `reviewed`, `sources[]`.
- **Story** (`/stories/{slug}/`): `id`, `title`, `description`, `published`, `reviewed`, `sources[]`, `motion: true|false`.
- **Dataset** (`/datasets/{name}/`): files are defined in §7. Page frontmatter is **not defined yet** (D19);
  until it is, the build rejects dataset pages other than `datasets/index`.

---

## 6. Authoring components — **CONTRACT**

The only components content may use. Each must degrade to readable static HTML without JS.

| Component | Purpose | No-JS fallback |
|---|---|---|
| `<Exercise id="sql-joins-1">` … `</Exercise>` | Numbered exercise block | Plain block |
| `<Solution>` … `</Solution>` (inside `Exercise`) | Hidden answer, "Show solution" | Native `<details>` |
| `<OpenInColab />` | Button from the lesson's `notebook` field | Plain link |
| `<OpenInSheets />` | "Make a copy" button from the lesson's `sheet` field | Plain link |
| ``<RunSQL query={`SELECT …`} />`` | Two boxes (editor and output) with Run, Tables, Auto-run and resets against the cafe-sales tables (D42); the editor and engine load in the background near the block | The plain highlighted code block and a note |
| `<Term id="glossary-primary-key">primary key</Term>` | Inline glossary link with short definition | Plain link |
| Starlight `<Aside>` (note / tip / caution / danger) | Callouts | Built in |
| `$$…$$` (inline) and a `$$` block (display) | Math (KaTeX at build time, D51) | MathML |

Rules:
- No other components or raw `<script>` in content. New components are added here first (MINOR change).
- Components are available in every `.mdx` file **without import lines** (D21). The build fails, naming the
  file and line, on any `import`/`export` in content, any component not in this table, any `<script>`,
  event-handler attribute (`on…=`), `set:html` or `javascript:` URL (in `.md` or `.mdx`), a `Solution` outside an `Exercise`, or math inside a heading.
- `Term` shows the definition as a native popover, with no JS: opened by hover/focus where interest
  invokers exist (`interestfor`), otherwise by a small "?" button next to the link (`popovertarget`,
  tap or click). Both dismiss with Esc or an outside click; the link always goes to the glossary page.
- Math (D51): inline `$$a = b / c$$` inside a line, display math as a block of its own (`$$`, the formula, `$$` on separate lines,
  no blank line inside), in `.md` and `.mdx` alike. A single `$` is plain text, so "$3.50" needs no escape. Write the words first, then the
  formula, and define every symbol. No math in a heading. It renders to MathML at build time, with no JavaScript.
- Step-by-step figures and concept animations (D41) are not components: the generator `scripts/make-animation.mjs` prints plain `<figure class="sa">` or `<figure class="ca">` markup
  (`<input>`s, an `<svg>`, `<label>` controls and an `<ol>` or a caption) that the lesson `.mdx` carries as raw HTML, styled by
  `src/styles/step-animation.css`. Lowercase HTML elements pass the content rules; no `<script>`, no `style` attribute, no new import.
- `RunSQL` takes the starting SQL in a `query` template string (an empty one fails the build, naming the file); a blank starter is a comment such as `-- Write your query here`. It goes in place of the fenced block of a "Try it" query or an exercise starter; hints, half-solutions and solutions stay plain code blocks.
- Exercise ids are permanent (`{lesson-id}-{n}`) so teachers can reference "Exercise sql-joins-2".

### 6.4 In-browser code
Write runnable examples as fenced code blocks with a meta flag: ```` ```sql dataset=cafe-sales ````.
SQL examples that learners should run use `<RunSQL>` (D42, above). Other fenced blocks stay plain code; a future
Python runner (Pyodide) could pick them up without editing content.

---

## 7. Datasets — **CONTRACT**

```
datasets/
  cafe-sales/
    v1/
      orders.csv
      customers.csv
    README.md          # description, columns, types, row counts, how it was generated, license
    schema.yaml        # machine-readable column definitions
```
- A small set of **synthetic** datasets the author creates, reused from Excel through Python so learners
  see the same data in every tool. No personal data.
- **Immutable once released.** A change in columns or values = new folder `v2/`; `v1/` stays forever,
  so old notebooks and spreadsheets keep working.
- Notebooks (Python stage on, D43) load data from a **release-tag URL**, not `main`:
  `https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/v1.0.0/datasets/cafe-sales/v1/orders.csv`
  Until `v1.0.0` exists, notebooks use the pre-release tag `v0.1.0` (D39), for example
  `https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/v0.1.0/datasets/cafe-sales/v1/cafe-sales.sql`.
  `v1/` never changes, so those links keep working after `v1.0.0`.
- Each dataset also ships an `.xlsx` (Excel stage) and a `.sql` load script (SQL stage) generated by a script in `scripts/`.
  A dataset whose largest table is too big to embed (`app-events`, D52) writes its `.sql` as `CREATE TABLE` statements followed by `COPY ... FROM` the CSV files in the same folder, to be run from that folder, instead of INSERT statements.
- A dataset may also ship `v1/api/`: the same rows as paginated JSON pages (`events/page-001.json`, ...) with an envelope (`page`, `page_size`, `total_rows`, `total_pages`, `next_page`, `rows`) and an `index.json`, for the ingestion lessons (D52). The README says which rows the pages hold and any planted paging quirk.
- License: CC BY 4.0.

A **companion dataset** (D46) is a second folder in `datasets/` with the same layout (`v1/`, `README.md`, `schema.yaml`, a generator in `scripts/`, CC BY 4.0) whose rows refer to a main dataset by key. `cafe-menu-accents` refers to cafe-sales by `store_id` and `product_id` and ships only a CSV, because only the Python stage uses it. Adding a companion never changes a released `v1/` folder of the main dataset.

Notebooks (none in the SQL stage, D43; Colab is introduced in the Python stage): `notebooks/{stage}/{lesson-id}.ipynb`, opened via
`https://colab.research.google.com/github/datafromzero/datafromzero.github.io/blob/main/notebooks/…`.
Notebooks are cleared of outputs before commit (CI check).

---

## 8. Internationalization

> **Paused (D30).** The site is English only until the owner reactivates this section. Nothing below is
> built meanwhile: no `vi` locale, and any page under `src/content/docs/vi/` fails the build. The rules stay
> as written for when Vietnamese returns (set `VI_ENABLED` in `src/site.ts`, remove the `/vi/` redirects).

- Starlight i18n with `root` locale **English** and `vi` locale. UI strings translated in `src/content/i18n/vi.json`.
- Vietnamese files mirror English paths: `src/content/docs/vi/sql/joins.md` with the **same `id`**.
- Untranslated pages fall back to English with Starlight's "not yet translated" notice.
- A translation records `translated_from_version` (curriculum version it was translated from) so stale translations can be listed.
  It is required on every Vietnamese page of a typed collection (§5), and the page must have an English
  counterpart at the mirrored path with the same `id`.
- Code, SQL keywords and dataset column names stay in English in both languages.

---

## 9. Versioning, citation, changelog

- **Curriculum version** (SemVer), tagged on GitHub as `vX.Y.Z`:
  - **MAJOR** — curriculum restructure, a required schema change, or any URL redirect batch
  - **MINOR** — new lessons, reference entries, datasets, components, optional fields
  - **PATCH** — corrections, clarifications, link fixes
- Each GitHub Release is archived by **Zenodo** (GitHub integration) → one **concept DOI** (always latest) + one DOI per version.
- `CITATION.cff` at repo root (title, author, version, date, concept DOI, license). Updated on every release.
- `/cite/` page: APA + BibTeX for the whole work, generated at build time from `CITATION.cff` (the build fails if its `version` differs from `package.json`); the DOI line reads "after the first release" until Zenodo exists, then shows the concept DOI and per-version DOIs.
- Every lesson footer shows **Cite this lesson**: author, year (from `reviewed`), title, site, curriculum version, URL.
  Static pages cannot know when they were read, so a note asks the reader to add their access date (D20).
- `CHANGELOG.md` follows *Keep a Changelog*, and every bullet starts with a bold, dated, learner-facing summary (D54); `/changelog/` is a short "What's new" list of those summaries by month, linking the full file on GitHub (single source, no copy); `/license/` shows `LICENSE` and `LICENSE-CONTENT` the same way.
- The site footer shows the current version and its DOI badge.

---

## 10. Design & motion

- Tokens, typography and logo rules: see `design/README.md` §2–3. Dark is default; every page, the homepage included, has a light theme behind the switch in the bottom taskbar (D9, D31); `@media print` forces black-on-white, hides nav/buttons, prints link URLs.
- Every page has the bottom taskbar (D31, D35: on phones it is the only navigation). Off the homepage it is the only script beyond Starlight's own (under 1 KB gzipped, CSS transitions only), except the career quiz's one scoring script on `/career-quiz/` (D33: under 4 KB gzipped, no GSAP, no storage).
- **GSAP is allowed on the homepage `/` only**, any plugin, each effect loaded on demand (D28). Project pages
  (`/start/`, `/about/`, `/cite/`, `/changelog/`, `/license/`, `/privacy/`), stories, lessons, reference and datasets
  load no motion script.
- Every animation respects `prefers-reduced-motion`; all content is visible with JS disabled.
- Page-to-page navigation uses CSS-only cross-document View Transitions (D26) and Speculation Rules prefetch (D27); neither adds executable JS to lesson pages.
- Study pages (lessons): wide line-height, max ~70ch, one idea per section.
  Reference pages: compact, scannable, fixed section order (§5.2).

---

## 11. Analytics & privacy

- **Google Analytics 4**, loaded **only after consent** (Consent Mode v2, default `denied`).
- A consent card laid out like the owner's johnha.info (owner decision, 2026-11-17): a glass card floating at the
  bottom (centered on phones, bottom-left of the content on wide screens), always above the bottom taskbar and hidden
  while the taskbar menu is open. Reject all and Accept all have equal weight; Customize opens "Strictly necessary"
  (always on) and an Analytics switch with Save choices. Choice remembered; "Cookie settings" link in the footer to
  change it.
- Declining must leave the site fully functional; GA script must never block rendering.
- The Measurement ID is the single value `GA_ID` in `src/site.ts`. While it is empty there is no banner, no GA code, no "Cookie settings" link and no added JavaScript. The choice is kept in `localStorage` key `dfz-consent`; only page views are collected for now.
- `/privacy/` page states what is collected, why, retention, and how to opt out.
- Events worth tracking (optional): `open_in_colab`, `open_in_sheets`, `show_solution`, `report_issue`.

> Note: GA plus a banner costs some speed and simplicity; it was chosen for richer insight.
> If the banner hurts the experience, GoatCounter (no cookies, no banner) is the drop-in fallback.

---

## 12. Quality gates (CI on every PR and on `main`)

| Check | Tool | Blocks merge |
|---|---|---|
| Build + schema validation | `astro build` (Zod content collections) | Yes |
| Internal links & anchors | `starlight-links-validator` | Yes |
| Prerequisite / see-also ids exist; no cycles in prerequisites; `order` follows prerequisites within a stage (D25) | `scripts/check-graph.ts` | Yes |
| External links | `lychee` (weekly scheduled job, opens an issue) | No |
| Spelling (American English) | `cspell` with project dictionary | Yes |
| Markdown style | `markdownlint` | Yes |
| Notebooks have no outputs | `nbstripout --verify` | Yes |
| Accessibility + performance | Lighthouse CI on `/`, one lesson, one reference page | Yes if a budget is missed |

**Budgets:** Lighthouse mobile ≥ 90 (performance), ≥ 95 (accessibility). Lesson pages ship no
framework JS beyond Starlight's own and the taskbar script (D31: one script under 1 KB gzipped, no GSAP, no library). JavaScript before first paint ≈ 3 KB gzipped on the homepage; effects load on demand (D28).
**Motion performance budget:** every frame of motion fits 8.3 ms of main-thread work (120 Hz). Per-frame
work is O(1) and writes only `transform` and `opacity`; sizes are measured once and on ScrollTrigger's
refresh; section setup runs one section per task after a presented frame: sections near the viewport first (also while
scrolling, in small slots), the rest after the intro while the reader is idle; a section that fails to build is
reverted and the others continue; `will-change`
exists only while its animation is active. Measured with `npm run perf` (dev only, noisy, not a CI gate):
Chromium, CPU throttled 4×, 390×844 and 1280×800, intro, scroll, warm (the same scroll once every section
is built), pointer, history (the homepage slider: buttons, keys, drag), careers (the 05 career figures: each card opened in turn, its canvas loop running) and a docs page. Targets at 4×:
no long animation frame above 50 ms after the intro, scroll p95 main-thread frame at or under 16.7 ms
(a proxy for 8.3 ms on a real phone), docs pages with zero layout, style and paint work while scrolling.
**Accessibility target:** WCAG 2.2 AA (contrast, keyboard navigation, alt text, MathML).

**Maintenance:** Dependabot monthly, grouped; Node LTS upgraded once a year; Astro/Starlight major upgrades
only in their own PR with a full CI pass. `reviewed` dates older than 18 months are listed by a scheduled job.

---

## 13. Repository layout

```
datafromzero.github.io/
├─ src/
│  ├─ content/
│  │  ├─ docs/                # Starlight docs: lessons, reference, careers, stories, project pages
│  │  │  ├─ excel/ sql/ python/ core/
│  │  │  ├─ data-analyst/ data-engineer/ data-scientist/ ml-engineer/
│  │  │  ├─ reference/{glossary,excel,sql,pandas,stats}/
│  │  │  ├─ careers/ stories/ datasets/
│  │  │  └─ vi/               # Vietnamese mirror (same structure; paused, D30)
│  │  └─ i18n/vi.json         # kept for when Vietnamese returns (D30)
│  ├─ components/
│  │  ├─ content/             # the §6 authoring components (auto-imported in .mdx)
│  │  ├─ lesson/              # lesson header and footer
│  │  └─ starlight/           # Starlight component overrides
│  ├─ lib/                    # schemas, validation, content rules (§5, §6)
│  ├─ pages/index.astro       # custom homepage (the only page with GSAP)
│  ├─ styles/                 # tokens.css, print.css, math.css
│  ├─ site.ts                 # site name, author, repository, URL
│  ├─ redirects.ts            # §3.3
│  └─ content.config.ts       # registers the collections (§5)
├─ public/                    # favicon.svg, logo files, og-image
├─ datasets/                  # §7
├─ notebooks/                 # §7
├─ sheets/excel/              # practice workbooks for Excel lessons ({lesson-id}.xlsx), built from datasets/
├─ scripts/                   # graph check, review report, dataset builders, migration scripts
├─ tests/                     # unit tests and fixtures (valid/ and invalid/ cases; never deployed)
├─ .github/workflows/         # deploy, ci, link-check, review-reminder
├─ design/                   # handoff: design README, logo files, homepage prototype (reference only)
├─ CITATION.cff  CHANGELOG.md  CONTRIBUTING.md  SPEC.md (this file)
├─ LICENSE (MIT)  LICENSE-CONTENT (CC BY 4.0)
└─ README.md
```

---

## 14. Content production (replaces migration, D24)

Content is written from scratch; `johnha912/data-odyssey` is not migrated.
1. **Curriculum map.** Research proposes every lesson per stage (id, slug, title, order, level, duration,
   objectives, prerequisites, key sources). The owner approves the map once; slugs then become permanent (§3).
2. **Stubs.** Approved lessons are created as `status: draft` files (never deployed, D18). The build validates
   ids, prerequisites and cycles from day one.
3. **Writing.** The owner writes the lesson text, or asks the team for a draft text that the owner edits and
   approves (D24). The team adds or completes frontmatter, exercises and
   solutions, notebooks, Google Sheets templates, datasets (§7), `Term` links and sources, and keeps the build green.
4. **Publishing.** The owner reviews and sets `status: published`. Vietnamese translations follow in later PRs (§8).
5. **Release.** Tag `v1.0.0` once the four core stages are published; enable Zenodo; publish `CITATION.cff` (§9).

Counts (D49, D53): 200 lessons in 8 stages; the advanced core is 43 lessons in six parts plus a capstone of about four hours, one project growing part by part. The DSA practice gym is planned after the tracks exist; nothing is built.

## 15. Explicitly out of scope (for now)

Accounts, saved progress, comments, in-browser code execution (except the SQL runner of D42: DuckDB-Wasm, self-hosted, loaded in the background near a block, no storage), paid content, newsletters, AI chat on the site.
Each would need a new decision entry in §1 before being built.

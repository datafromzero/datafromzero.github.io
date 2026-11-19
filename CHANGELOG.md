# Changelog

All notable changes to datafromzero are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the curriculum uses
[Semantic Versioning](https://semver.org/) as described in SPEC.md §9.

## [Unreleased]

### Added
- SQL in a nutshell (`/sql/cheatsheet/`, SPEC D44, owner decision, 2026-11-19): a one-page cheatsheet of the SQL stage in the three parts of
  the stage. Each card has a short pattern, one plain sentence, the most common trap and a link to its lesson, all taken from the published
  lessons; three small drawings show the order a query runs, the join types, and aggregate against window. It needs no JavaScript, is
  linked from the sidebar and from the SQL stage on Start here, and prints on one A4 sheet, both sides, black on white. Every pattern was
  run in DuckDB on the cafe-sales tables. Stage cheatsheets for Excel and Python will follow the same design.
- Roadmap decision (D44, owner, 2026-11-19): linear algebra will be a small math block at the start of the Data Scientist and ML Engineer
  tracks. The lessons are planned, not written yet.
- The 35 SQL lessons are published (owner decision, 2026-11-19), each with in-page runnable queries and concept
  animations. The checks still to do in each lesson, formerly owner notes on the page, are tracked in issue #59.
- Lesson figures, live counts and Key idea (D41 amended, owner decision, now on every figure): a strip of small labeled counters above the figure
  ("—" until its step; the counter that changed is lit in its clause color; in autoplay they follow the phases) shows what each
  clause does to the number of rows, for example `rows 10`, `groups 3`, `after HAVING 2`. Under the controls the current step
  also gets one short Key idea sentence and What changed chips (`+` added, `−` removed, `~` changed). CSS only, no JavaScript, in
  both the data steppers and the concept animations; print shows the final counts and every step's text, and nothing appears
  before its step, so a Predict is never given away. Piloted on the three data steppers (S8, S14, S19, numbers recomputed with
  DuckDB 2.0.0) and five concept animations, then rolled out to all 34 concept animations (including every join variant). Each
  claim in a Key idea was checked on DuckDB 2.0.0 or the spec's evidence; `concept-cte-kinds` has a Key idea but no strip because it
  shows three structures, not rows to count. The markup is lean: a counter label is written once, and the words "Key idea",
  "Step n", Added, Removed and Changed come from the stylesheet, so a figure grows by about 0.37 KB gzipped on average. Print now
  shows every step's Key idea as one numbered block before the caption list. `scripts/refresh-concept-figures.mjs` also re-pastes
  the data steppers.
- SPEC D43 (owner decision): the SQL stage has no notebooks or Colab; every query runs in the lesson page (D42), and Colab
  is introduced in the Python stage. `scripts/refresh-concept-figures.mjs` re-pastes every concept figure into the lessons
  from the generators (`--check` tests that they are current).
- Concept animations, 29 more (D41 amended, owner decisions): one abstract, looping schematic per SQL idea, each with a plain-words
  metaphor, a changing phase label, a Pause button and its own spec `scripts/animations/concept-*.mjs` (`node scripts/make-animation.mjs
  concept-<key>`): query, select-order-limit, where, null, expression, case, aggregate, conditional-agg, text-clean, date truncation,
  rank-ties, sliding-window, removing duplicates, keys, fanout, self-join, subquery, set-ops, funnel, cohort, recursive, view, star, ai-check,
  constraints, transaction, normalize, index and shard. Facts shown were checked in DuckDB 2.0.0 (RANK skips after ties, a CHECK that
  is NULL passes, ROLLBACK works only inside BEGIN, and so on). Every concept animation, the 10 earlier ones too, now also has step
  buttons: Back, Next and 3 to 6 numbered steps (CSS only), each step saying in plain words what changes. A step stops the loop and
  shows the settled frame of that step; the same words label the figure and are listed under it, and "Play" resumes. Reduced motion
  shows step 1 and the buttons switch instantly; print shows the final frame and the captions.
- SQL runner, next step (D42 amended, owner decisions): the block is now two separate boxes, the editor and the output, side by
  side where there is room and stacked on phones, with an empty state in the output before the first run. The editor is CodeMirror
  with SQL colors; a Tables button lists the five cafe-sales tables with columns, types and row counts and inserts or previews a
  table; errors show the first line of the engine's message plus a tested tip for common beginner mistakes; an optional Auto-run
  switch re-runs read-only queries 800 ms after typing stops. Nothing is set up by the learner: the editor and engine load in the
  background after the page has painted once a block is within a screen of the viewport (not with Data Saver or 2G), a Run pressed
  too early shows "Getting ready…" and then runs by itself, and the interface uses no loading jargon. New page `/sql/playground/`:
  the same runner full height, with a "Try:" list of examples. Reading a lesson without nearing a block still costs about 3 KB.
- SPEC D42 (owner decision): learners run SQL inside the lesson page. The new `<RunSQL query={...} />` component turns a "Try it"
  query or an exercise starter into an editable box with Run, Reset query and Reset data (Ctrl or Cmd plus Enter runs it) and
  shows the result table with its row and column count. The engine is DuckDB-Wasm, self-hosted, loaded only on the first Run
  click, with the five cafe-sales tables created from our own CSV files; nothing is stored and nothing is sent anywhere. One database
  per page, so a table made in one block is seen by the next. Without JavaScript the block is the plain code. Piloted in GROUP BY and
  HAVING, window functions and INNER JOIN; the Colab button stays as a second route. Amends D4, the "no in-browser code" line of §15
  and the zero-JS rule for lessons.
- SPEC D41 (owner decisions): lesson figures may be CSS-only steppers the learner controls. Back, numbered step buttons and Next
  (a native radio group, no JavaScript) move through at most 6 steps, one change per step with a short fade; all step captions stay
  on the page as a numbered list with a clause badge and "Predict:" prompts. Each SQL clause has one fixed color inside figures.
  Print and reduced motion show the final frame with all captions. Built by `scripts/make-animation.mjs` from our own cafe-sales
  rows; pilots in GROUP BY and HAVING, window functions and INNER JOIN. The same decision adds concept animations (owner request):
  abstract, autoplay, looping CSS-only schematics with no real data (aggregate against window function, kinds of CTE, join types,
  the logical order of a query), a 44 px Pause / Play button for WCAG 2.2.2, and a static final frame for reduced motion and print.
- SPEC D40 (owner decisions, research issue #52): the SQL stage has 35 lessons in three parts (analysis on one table, then keys and
  joins, then the database itself), starting with an Excel-side first lesson
  ("From a spreadsheet to SQL: your first queries") and adding query execution order, views, star schema, and scale and
  NoSQL; each task publishes its expected result.
- SPEC D39 (owner decision): version 0.1.0 and a pre-release tag `v0.1.0`, so SQL notebooks can load the cafe-sales
  data from a fixed URL before `v1.0.0`.
- Link previews (owner request): every page now declares a 1200×630 preview card (`og:image`, `twitter:image`),
  black with the logo and "From A1 to AI.", so chat apps and social sites show it instead of picking the first image on
  the page (they had picked the new author avatar). Source `design/og/card.html`, rendered by `scripts/build-og.mjs`.
- Homepage author line (owner request): between the careers section and the footer, the owner's avatar, name (linking to
  johnha.info), one line of the story and "Read the story" to the About page. Static, no script.
- SPEC D37 (owner request): "Report a problem" in the taskbar sheet, on every page. A flag button in the bottom row opens
  a small form (kind, what happened) that continues on GitHub's issue form with the page and title filled in; the
  lesson footer's "Report an issue" link uses the same form (`.github/ISSUE_TEMPLATE/page-report.yml`). No script and
  no account on the site: the reader needs a GitHub account and can paste a screenshot there.
- The 22 Excel / Sheets lessons are published (owner decision, 2026-11-17), each with a downloadable practice
  workbook. Checks still to do in the real apps, and the Google Sheets copy links, are tracked in issue #41. The
  bottom taskbar now lists a shortcut to the first lesson of every stage that has published lessons.
- `.claude/MISTAKES.md`: a log of every mistake made once and the rule that prevents it, read by the lead and every
  agent before work and extended after every review. `npm run check:lessons` (part of `npm run check`) enforces the
  rules that can be checked mechanically: American spelling, no first-person notes outside the owner's to-do notes, no bare `$`
  in SVG, and `datasets` naming only existing folders.
- Draft text for the 21 other Excel lessons (team drafts under D24, still `status: draft`), each with three exercises
  (faded, blank-start on messy data, spot-the-flaw), static SVG pictures, and a practice workbook in `sheets/excel/` built
  from `cafe-sales` by its own module in `scripts/lesson_sheets/` (one pre-built sheet per exercise). Power Query ships
  three CSV files to import. `excel-date-functions` now lists `excel-text-functions` as a prerequisite.
- Analytics on (SPEC §11, D8): Google Analytics 4 property `G-0TNDBK1ZJX`, loaded only after the visitor accepts the
  consent banner (Consent Mode v2, defaults denied). Event data is kept for 2 months, as `/privacy/` now states.
- First dataset, `cafe-sales` v1 (SPEC §7, D29): three fictional Bay Area cafes, January to June 2026, prices in US
  dollars and cents. Five tables (stores 3, customers 150, products 16, orders 1,800, order lines 3,287) as CSV,
  one `.xlsx` workbook and a DuckDB load script, with `README.md` and `schema.yaml`. Synthetic and deterministic:
  `scripts/build-cafe-sales.py` rebuilds it, and `--check` confirms the CSV files match. Rigged on purpose: one
  walk-in order without a customer, one canceled order, one extra-zero quantity, a store that opens in April, a
  product never sold, tied prices and referral links. Not released until `v1.0.0`.
- Practice workbooks for Excel lessons in `sheets/excel/`, built from the dataset by `scripts/build-lesson-sheets.py`;
  the first is for `excel-grid-and-tidy-layout` (draft).
- Homepage hero: the sub-copy and the two buttons are removed; the bottom taskbar already carries "Start learning".
- Career quiz at `/career-quiz/` (SPEC D33, from the research in issue #32): ten original questions about how you
  like to work, each answer giving 2 points to the career it fits best and 1 to a close second. The result is a
  suggested direction with the reason, a close second and the shared-core line (ties go to more 2-point answers,
  then an honest tie); never percentages. One small scoring script on that page only (under 4 KB gzipped, no
  library, no storage, sends nothing); without JavaScript every question is shown with "How to score it yourself"
  and every answer's points. Carries the O*NET 31.0 Database CC BY 4.0 credit and a link to the free Mini Interest
  Profiler on My Next Move. Listed in the taskbar shortcuts.
- Homepage section 05 "Pick a direction" ("Four careers. One start.", owner-approved mockup): four career cards that
  open one detail panel at a time (what the career does, the path from Excel to the career, the portfolio, "Start at
  A1 →"), with a looping canvas figure per career (bars, tanks and pipes, clusters and a plane, a network) on the GSAP
  ticker in a deferred chunk, paused off screen and while no card is open; a still frame with reduced motion; every
  career's details listed without JavaScript. Below it, "Not sure which career fits you?" links to the quiz.
  `npm run perf` gained a `careers` scenario.
- Homepage section 04 "A short history of data" ("From punch cards to AI."), after "Same question. Three tools.":
  the 12 milestones researched in issue #29, from the 1804 Jacquard loom to ChatGPT in 2022, each with its year,
  title and one line, then a closing "Now — Your turn" card that links to `/start/`. A `<details>` below lists
  every card's primary and second source (accessed November 16, 2026). With motion: a seamless-loop card slider
  (center card full size, side cards scaled and faded), moved by drag (Draggable, a deferred chunk), Previous /
  Next buttons and ←/→, snapping to a card and announcing it in a polite live region. Without JavaScript or with
  reduced motion the cards are a horizontal scroll-snap list and GSAP is not loaded for it. Begin is now 05; the
  taskbar's "On this page" lists both. `npm run perf` gained a `history` scenario (SPEC §12 now lists the
  `warm` and `history` scenarios).
- Bottom taskbar on every page (SPEC D31, owner-approved mockup): a floating glass bar with a shortcuts menu
  (hamburger that morphs to ×, the page title or, on the homepage, the section on screen; the sheet grows
  upward with Home, Start here, About, the homepage sections and the project pages), "Start learning →", a light /
  dark switch and back to top. One script under 1 KB gzipped off the homepage, CSS transitions only (none with
  reduced motion); without JavaScript the menu is a `<details>` toggle. Starlight's header theme picker is gone:
  the taskbar switch keeps Starlight's state, so the homepage and the docs share one theme.
- Light theme for the homepage (SPEC D9 amended): every section, the hero logo and its CSS animation, the dot grid,
  the selection box, the tools tabs, the marquee and the 04 logo morph follow `data-theme`; the homepage grays
  are tokens with a black-on-white inverse (design/README.md §2). Dark stays the default.
- Homepage hero lockup (owner's choice, sample 1): the logo and the wordmark "From A1 to AI." side by side (stacked
  on phones), the wordmark being the page's only `<h1>`. CSS first: the words rise from a mask and the last word's
  reel rolls 1 → I; GSAP (deferred) adds an Excel-style selection box that moves from "A1" to "AI" with the roll,
  or just fades in on "AI" when the chunk arrives late. Tapping the logo replays logo and wordmark. Geist 500 is
  preloaded and the wordmark's width reserved, so the lockup never shifts (CLS 0).
- Homepage section 03 "One idea, three tools" (owner's choice, option B), replacing "Two ways in": one question
  answered in Excel, SQL and Python beside the same result table (example numbers). Without script the three
  solutions are stacked; with script they are an ARIA tab list (also with reduced motion), and the motion chunk
  adds the Flip underline, the code fade, the row pulse and an auto-cycle with a Pause / Play button.
- Curriculum map approved (SPEC D29): 161 draft lessons across the nine stages, created from
  `research/curriculum/06-curriculum-map.yaml` with ids, order, prerequisites, objectives and sources.
  Drafts are validated but never deployed. SQL lessons use DuckDB; dashboard lessons are tool-neutral;
  datasets are English with prices in US dollars.
- Curriculum research package in `research/curriculum/` (competitor map, syllabus inventory, teaching
  playbook, UI/UX lessons, career and distribution), indexed in the knowledge graph.
- Site scaffold: Astro + Starlight, English at the root and Vietnamese under `/vi/`, deploy to GitHub Pages.
- Design system: tokens, Geist fonts, dark default with a light option on docs pages, print styles, logo and favicon.
- Content model (SPEC §5): schemas and build-time validation for lessons, reference entries,
  glossary terms, careers and stories; lesson header and footer.
- Authoring components (SPEC §6): `Exercise`, `Solution`, `OpenInColab`, `OpenInSheets` and `Term`,
  with build errors on misuse; math via `remark-math` and `rehype-katex` (MathML output, no client JavaScript).
- Quality gates (SPEC §12): prerequisite graph check (`scripts/check-graph.ts`, cycles and `order`),
  `starlight-links-validator`, cspell, markdownlint, Lighthouse CI, fixture tests, `npm run check`;
  workflows `ci.yml`, `link-check.yml` and `review-reminder.yml`; Dependabot (monthly, grouped).
- Lesson footer: **Unlocks next** lists the lessons that require this one (SPEC §5.1).
- Navigation (SPEC D26, D27): cross-document View Transitions (CSS root fade, off for reduced motion)
  and Speculation Rules prefetch (same-origin, moderate, no prerender) replacing Astro's prefetch script.

- Project pages (SPEC §3.1): `/start/` with the roadmap map (static SVG laid out by the prerequisite layers, plus a text list),
  `/cite/` (APA and BibTeX generated from the new `CITATION.cff`), `/changelog/`, `/license/`, `/privacy/` and `/about/`
  (facts only; the owner can extend it); footer links on docs pages and the homepage.
- Analytics (SPEC §11): `GA_ID` in `src/site.ts`, empty for now. When set: consent banner, Consent Mode v2 defaults denied,
  GA4 loaded only after Accept, "Cookie settings" footer control. Empty: no banner and no added JavaScript.

- Full GSAP plugin set (SPEC D28), every effect in a deferred chunk fetched when its section nears the viewport or
  the page is idle; reduced motion never loads GSAP, and lesson, reference and dataset pages ship no new script:
  - Homepage: one brand ease (CustomEase, the same curve as the CSS `--ease`) across sections; the hero caption decodes
    once after the intro (ScrambleText; the real text stays available to assistive tech); in 04 the logo's void and
    layers morph into place (MorphSVG); in 02 small lights travel down the branches once drawn and pause off screen
    (MotionPath); in 03 each panel has an Enlarge button that animates the layout change (Flip, transforms only; a real
    button with `aria-pressed`, hidden without script); the marquee can be flicked sideways with a finger, mouse or trackpad and the
    03 headline trails fast scrolling a few pixels (Observer; vertical scrolling stays native).
  - `/start/`: the roadmap map draws itself (DrawSVG rails, markers pop, stages and lesson rows arrive); the static SVG and
    the text list are unchanged without script or with reduced motion.
  - Project pages: headings below the fold reveal line by line (SplitText), one small shared chunk.
  - Skipped: ScrollSmoother (it moves scrolling from the compositor to the main thread and breaks the CSS sticky stages)
    and InertiaPlugin (the marquee's exponential smoothing already is the friction curve).

### Fixed
- Concept animations: the step buttons 1 to N have their bottom edge again (it was missing on every lesson).
- SQL runner: a result cell with line breaks (an `EXPLAIN` plan) keeps them and scrolls sideways inside the result box,
  so the plan boxes line up.
- Print: the Back, Next and step buttons of the lesson steppers are hidden, as those of the concept animations already were;
  the final frame and the step captions print.
- SQL S19: the ambiguous-column error is quoted the way the page shows it.
- Lesson tables on phones: a long formula in a cell now wraps, so the other columns no longer shrink to one letter
  per line (Excel E4, E5, E7, E13, E21).

### Changed
- About page (owner request): the story no longer names a course platform ("a few SQL and Python courses on bootcamp
  sites").
- Consent (SPEC §11, owner request): the banner is now a glass card like the one on johnha.info, with a cookie icon,
  "Your privacy choices", Reject all and Accept all side by side, and Customize for an Analytics switch. It floats
  above the bottom taskbar (bottom-left of the content on wide screens) and steps aside while the taskbar menu is
  open. The homepage "Your turn" card now says "Start here".
- Taskbar sheet (SPEC D35): "Start here" leaves the bottom row (the primary button already starts the lessons); the
  Course list ends with "See the whole roadmap". The primary button's first lesson comes from the same helper as the
  search suggestions.
- SPEC D38 (owner decision): on the homepage the four career cards share their rows, so the titles line up at every
  width. Each career's panel button reads "Go to Data Analyst" (and so on) once that career has published lessons,
  and "Start at E1" until then, linking to the first published lesson.
- Search focus ring: the keyboard ring on the field is no longer cancelled by the border rule.
- SPEC D36 (owner request): search opens like a phone search. Below 50rem the dialog is a full-screen glass sheet that
  slides up from the bottom, with a pill field, a text Cancel button and, while the field is empty, links to Start
  here, the first lesson and the career quiz. Results are cards with the match highlighted and sub-results
  indented. On desktop the centered dialog gets the same glass and cards. Ctrl+K and the search index are unchanged.
- Taskbar: back to top is back on phones; the bar and its sheet are liquid glass (more see-through, blurred, with a top
  sheen) so the lesson shows faintly underneath; sheet rows rise in one after another and buttons give when pressed, in
  CSS only (GSAP stays on the homepage, D28).
- Sidebar: lesson codes sit in their own muted mono column beside the title, so wrapped titles line up and "E1" no
  longer reads as part of the title.
- Taskbar: the primary button reads "Start here →" (to `/start/`) on the homepage and other pages, and "Start E1 →"
  (the first published lesson) on `/start/` itself, so it never points at the page you are on; the menu label drops its
  empty first line so the title sits level with the icon.
- Homepage footer: two centered rows (the license line, then the project links) instead of items pushed to both sides.
- SPEC D35 (owner decision): one navigation on phones. The bottom bar is now two controls: a menu button with a
  two-line label (the lesson code and current section, over the title) and a primary button, "Next E9" on a lesson
  and "Learn" elsewhere. The sheet has two tabs, This lesson (the page's headings) and Course (every published
  lesson by stage, the current one marked), and a bottom row with Home, Start here, Career quiz and the light / dark
  switch. Starlight's header menu button and its "On this page" bar are hidden on phones; the desktop sidebar and
  table of contents are unchanged. Tabs work without JavaScript.
- Homepage 04 "A short history of data": each card has a small line picture under its year (13 icons drawn for the
  site, no brand logos). "Sources for these dates" is shorter: per milestone a two-to-three-line summary (the card's
  line and why it matters, from issue #29) and two short links, Primary source and Second source, whose accessible
  names carry the full titles.
- Taskbar menu icon: two bars that cross into an X when the menu opens, instead of three bars with one fading out.
- SPEC D34, §3.1, §5.1: docs-style navigation. The sidebar lists Get started, then each stage's lessons in study
  order with codes (E1 … E22), then the project pages last. Every lesson shows its code in the header, in Before this
  lesson and in Unlocks next. `/start/` shows the stages as cards that open on their lesson lists, replacing the SVG
  map and the repeated text list.
- Taskbar menu (owner request): the project links (changelog, cite, license, privacy, GitHub) are no longer repeated
  in the menu, since every page footer has them; the homepage "On this page" entries and the scrolling label drop their
  section numbers ("The core", not "01 The core").
- SPEC §1 D24 and §14: the owner may ask the team for a draft lesson text, which the owner edits and approves before
  publishing; the first is `excel-grid-and-tidy-layout`.
- Homepage: the 02 tree now shows four careers (DA, DE, DS, ML; SPEC D32) on evenly spaced branches, and the meta
  description says four data careers.
- SPEC §1 decision D32 (owner decision, amends D29), §3.1, §4, §5.1, §13: four career branches. Analytics Engineer is
  no longer a branch; its eleven draft lessons were folded into Data Engineer (eight dbt and modeling lessons, the
  dbt capstone included) and Data Analyst (the KPI dictionary). The freshness and incident lesson was merged into
  `data-engineer-backfills-and-failure-recovery` and the role lesson was dropped, so the map now has 159 draft
  lessons in eight stages. `analytics-engineer` is gone from the lesson `stage` enum, career `stages`, the `/start/`
  roadmap map and the curriculum map. None of these lessons was published, so no URL changes.
- SPEC §1 decision D30, §3.1, §8, §13: Vietnamese is paused; the site is English only for now. No `vi` locale is
  built (no language picker, no `hreflang`), the seven published `/vi/` URLs (`/vi/`, `/vi/start/`, `/vi/about/`,
  `/vi/cite/`, `/vi/changelog/`, `/vi/license/`, `/vi/privacy/`) redirect to their English pages, the sitemap has no
  `/vi/`, and a page under `src/content/docs/vi/` fails the build. D3 and §8 are marked paused; the
  `translated_from_version` field stays in the schemas. CLAUDE.md's language rule follows.
- SPEC §0, §1 decision D28, §2, §3.1, §10, §12: GSAP runs on the homepage only. Project pages and stories get no
  effects; the `/start/` roadmap map is a static SVG again. CLAUDE.md's motion rule and design/README.md §6 follow.
- Homepage nav: "Reference" becomes "Example", and the hero's second button "Browse reference" becomes
  "See an example"; both point to section 03 (`#tools`), since there is no reference section any more.
- Faster first paint on docs and project pages: font files are no longer inlined as base64 into the
  render-blocking stylesheet (150 KB to 80 KB), the regular Latin Geist is preloaded, and the consent
  banner's styles load only when analytics is enabled (`/start/` lab LCP 2.56 s to 1.55 s).
- The weekly external link check resolves root-relative links locally instead of reporting them as errors.
- SPEC §1, §2, §10, §12: decision D28 (supersedes D22); any GSAP plugin, each effect loaded on demand, on the
  homepage, stories and project pages; budget measured as JavaScript before first paint. Build plan item 9 is now
  "Motion & speed" (the DFS story was dropped).
- The author of record is the organization "datafromzero" (citations, copyright, footer); no personal name
  appears on the site or in the repository documents.
- SPEC §3.1, §9, §11: wording for the roadmap map, generated citation, single-source changelog and license pages, and `GA_ID`.
- SPEC §5.1: `order` within a stage must follow the prerequisites; the footer shows "Unlocks next".
- SPEC §1: decisions D17 (strict content validation), D18 (draft lessons are never deployed),
  D19 (dataset page frontmatter deferred) and D20 (readers add the citation access date).
- SPEC §5: ids are kebab-case and unique across all types; types follow folders; id references
  must exist; `sources[].url` and `sheet` must be http(s); `see_also` and `aliases` required
  (empty list allowed); `term` is the glossary page title.
- SPEC §5.1: draft lessons are built only in local dev; published lessons may not depend on drafts.
- SPEC §5.4: dataset pages are rejected until their frontmatter is defined.
- SPEC §8: `translated_from_version` required on every typed Vietnamese page.
- SPEC §9: "Cite this lesson" takes its year from `reviewed`; no generated access date.
- SPEC §1, §6: decision D21; components are auto-imported in `.mdx`, and the build rejects imports,
  other components, `<script>`, event handlers, `set:html`, `javascript:` URLs and math in headings; `Term` uses a native popover (hint on hover/focus where supported, a tap/click "?" button otherwise, both dismissed with Esc, no JS); literal
  dollar signs are written `\$`.
- SPEC §13: repository layout updated for `src/lib/`, `src/site.ts` and the component folders.
- SPEC §1, §2: decision D22; homepage and story motion may use GSAP `SplitText` and `DrawSVG` besides
  `ScrollTrigger`, with a homepage JavaScript budget of about 90 KB gzipped.
- SPEC §1: decision D23; pure scroll-linked effects use CSS scroll-driven animations, with GSAP as fallback.
- SPEC §1, §14: decision D24; content is written from scratch (outline first, English first) instead of
  migrated from `data-odyssey`; §14 now describes content production.
- SPEC §1, §5.1, §12: decision D25; `order` must follow prerequisites within a stage, and lessons show
  "Unlocks next".
- Homepage motion performance pass for 120 Hz displays (SPEC §12, "Motion performance budget"); the design and
  choreography are unchanged:
  - The hero pointer glow is a small window onto a copy of the dot grid that moves by `transform` only; the
    full-size mask is no longer repainted on every pointer move.
  - The marquee runs from one ticker callback with smoothed scroll velocity (no tween created per scroll event)
    and is promoted to its own layer only while it is on screen.
  - Section timelines are built in separate tasks right after a presented frame: nearby sections first, the rest
    after the intro while the reader is not scrolling, so scrolling no longer pays for setup. Reads are batched
    before writes.
  - Headings revert their SplitText wrappers once the reveal has played; `will-change` is set only while a
    scrubbed animation is active.
- `npm run perf` (dev only, not part of `npm run check` or CI): measures frame times, long animation frames,
  style, layout and paint cost on the built site with a 4× CPU throttle at 390 and 1280 px.

### Removed
- The 35 SQL notebooks (`notebooks/sql/`) and the two scripts that only served them (`pin-notebook-duckdb.py`,
  `wrap-notebook-error-cells.py`), and the Colab button, setup paragraph and `notebook` field from SQL lessons S8, S14 and S19
  (D43). The `v0.1.0` data tag, the optional `notebook` field, `<OpenInColab />` and the notebook output check stay for the Python stage.
- Homepage: the marquee (and its pause control) and the "05 Begin" section, replaced by "05 Pick a direction".
- The hero caption ("Excel → SQL → Python → DA · DE · DS") and its ScrambleText decode, and the separate
  "From A1 / to AI." headline (the lockup wordmark replaces it).
- Section 03 "Two ways in" (Study / Reference panels, the Enlarge button and its Flip effect, the headline lag).
- Project-page motion: the roadmap map drawing on `/start/` and the heading reveal (`project-boot.ts`, `scripts/project/`).
- The Vietnamese homepage (`/vi/`, now a redirect), its Vietnamese font subset and the Vietnamese homepage copy
  (`src/i18n/home/vi.ts`, kept in git history). The docs UI strings (`src/content/i18n/vi.json`) stay for later.

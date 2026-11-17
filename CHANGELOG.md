# Changelog

All notable changes to datafromzero are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the curriculum uses
[Semantic Versioning](https://semver.org/) as described in SPEC.md §9.

## [Unreleased]

### Added
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

### Changed
- Sidebar: lesson codes sit in their own muted mono column beside the title, so wrapped titles line up and "E1" no
  longer reads as part of the title.
- Taskbar: off lessons the primary button is "Start E1 →" (the first published lesson) instead of "Learn →" to
  `/start/`, which the sheet already links; the menu label drops its empty first line so the title sits level with the icon.
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
- Homepage: the marquee (and its pause control) and the "05 Begin" section, replaced by "05 Pick a direction".
- The hero caption ("Excel → SQL → Python → DA · DE · DS") and its ScrambleText decode, and the separate
  "From A1 / to AI." headline (the lockup wordmark replaces it).
- Section 03 "Two ways in" (Study / Reference panels, the Enlarge button and its Flip effect, the headline lag).
- Project-page motion: the roadmap map drawing on `/start/` and the heading reveal (`project-boot.ts`, `scripts/project/`).
- The Vietnamese homepage (`/vi/`, now a redirect), its Vietnamese font subset and the Vietnamese homepage copy
  (`src/i18n/home/vi.ts`, kept in git history). The docs UI strings (`src/content/i18n/vi.json`) stay for later.

# Data From Zero — Curriculum Research Package

How to use this package, what it contains, and what decisions each file is meant to drive.

This package distills public catalog, syllabus, pricing, and program-structure research on the major data-learning platforms into an original build brief for Data From Zero. It is a research package, not course content. Nothing in it copies lesson text, exercise text, or course descriptions. Course, track, and certification titles are cited as facts; all analysis and recommendations are written in our own words.

Research window: 2026-11-15. Every factual claim in the underlying wave files traces to a page opened on that date, with URL and access date recorded in the source file. Wave 4 spot-checked the highest-risk claims against live official pages on the same date.

---

## 1. The project this package serves

Data From Zero is a free, visual-first learning site that teaches its own original content. The path shape is already decided and is not reopened by this research:

- **One linear path:** Excel → SQL (one complete block) → Python → advanced core → five career tracks.
- **The five tracks:** Data Analyst, Data Engineer, Data Scientist, Analytics Engineer, ML/AI Engineer.
- **Free in full.** No paywall, no account wall for reading and learning, no free-tier funnel. The whole path is the product.
- **Visual-first teaching.** Each core concept gets a canonical visual or interactive demonstration, not just prose and code.
- **Bilingual-ready by structure:** English at the root, Vietnamese under `/vi/`. The Vietnamese edition is scaffolding — terminology, examples, and format guidance built for Vietnamese learners — not a machine translation of the English pages.
- **Repo as source of truth.** Site content lives as Markdown in the repository; a sync step mirrors it into the website. A published page's URL does not change; a rename requires a redirect.

Judge every recommendation in this package against four tests from the project charter: does it beat the incumbents on clarity, on visual and intuitive teaching, on time-to-skill, and on career outcomes?

Two scope notes that apply to the whole package:

- **SQL is one complete block.** It is not split into a beginner block early and an advanced block later. Joins, aggregation, subqueries and CTEs, window functions, and design basics belong together, in one place, before Python.
- **The advanced core is shared.** Statistics, analytics thinking, and evaluation foundations sit between Python and the five tracks, so each track builds on the same core instead of re-teaching it.

---

## 2. Contents index

| File | What it is | Primary build decisions it drives |
|---|---|---|
| `00-README.md` (this file) | Package guide, project shape, evidence rules, and boundaries | How the build team reads and trusts everything else in the package |
| `01-competitor-map.md` | Synthesis of all platforms studied: positioning, scale, paywall models, strengths, weaknesses, and the gaps Data From Zero exploits | Positioning, differentiation, what to match and what to deliberately not copy |
| `02-syllabus-inventory.md` | Topic inventories per domain: Excel and BI, SQL, Python, statistics and analytics foundations, data engineering, ML/DL and AI, plus interview and certification overlays | What topics exist, in what order, at what depth — the lesson backlog and the lesson-graph structure |
| `03-teaching-playbook.md` | Lesson anatomy, worked-example progression, exercise ladders, checkpoint design, visual-teaching techniques, and Vietnamese-learner design | How each lesson is built: template, timing, practice design, review schedule |
| `04-ui-ux-lessons.md` | Site-level patterns from the incumbent audit: information architecture, course and path page anatomy, trust and friction patterns | Site navigation, path and lesson page layouts, progress display, reference-space design |
| `05-career-and-viral.md` | Career layer and distribution: what hiring screens test, what a portfolio must prove, which credentials are worth aligning to, audience and positioning moves, shareability mechanics | Track endings, project ladders, checkpoint claims, launch and sharing design |

Read in order for a first pass. After that, each file is designed to be used standalone by the person building that layer.

### Canonical source rule

Wave 4 produced a dedupe map so the package does not carry two competing versions of the same topic. When files overlap, one file is canonical:

- Topic lists in `02` come only from the syllabus inventory files. Other waves contribute overlays, not second lists.
- The interview layer (patterns, ladders, take-home design) is owned by the Wave 2 interview research.
- The lesson template is owned by the Wave 3 lesson-anatomy research.
- Visual techniques are owned by the Wave 3 visual-teaching research.
- Site-level patterns and platform scores are owned by the Wave 1 UI/UX audit.
- What certifications test is owned by the Wave 2 certification map.
- All `/vi/` rules — terminology, glossary, format traps, scaffolding — are owned by the Wave 3 Vietnamese-learners research.

If a draft contradicts the canonical file on its own topic, the canonical file wins and the draft is fixed.

---

## 3. How each package file maps to build decisions

### 01 — Competitor map → positioning and scope guardrails

Use it to decide what Data From Zero must match to be credible (sequencing transparency, project cadence, honest time math) and where it wins by structure rather than by volume (free in full, visual teaching, Vietnamese scaffolding, one committed order). It also records what not to chase: matching a catalog count, minting a competing credential, or rebuilding a company-tagged interview bank.

### 02 — Syllabus inventory → the lesson backlog

Use it as the checklist for coverage. Each domain section is the topic backlog for that stage of the path, with hiring and certification overlays showing which topics are tested first and hardest. Build order follows the linear path; within a domain, build order follows the inventory order unless the teaching playbook gives a pedagogical reason to resequence.

Two explicit scope decisions are recorded here so they are not misread as oversights:

- **Algorithm inventory scope.** There is no dedicated algorithm inventory in this package at the same completeness standard as the SQL, Python, and Excel inventories. Algorithmic material exists in three places only: ML algorithm families inside the ML inventory, a data-structures-and-algorithms block described in the OSSU supplement, and coding-round patterns in the interview layer. Package `02` states that scope plainly. Do not present the package as containing a full algorithms curriculum, and do not let a syllabus page imply one exists. If the ML/AI track later needs complexity intuition, sorting and searching, and common interview algorithm patterns as first-class topics, that inventory must be commissioned separately.
- **Mathematics foundations note.** Statistics is inventoried in depth. Linear algebra and calculus for ML are not inventoried as a main-path block; they appear as sequencing choices in the WQU and OSSU supplements and as assumed background in the ML inventory. The ML/AI track pages must state what math they assume and where a learner can get it, rather than leaving the assumption silent.

### 03 — Teaching playbook → lesson production standard

Use it as the production template: the timed lesson anatomy, the worked-example-to-independent-problem progression, the five-rung exercise ladder per domain, and the checkpoint tiers with failure diagnosis and spaced review. Thresholds in the underlying research that are marked [Recommendation] are design choices for Data From Zero, not research findings. They keep that label in the package. Do not quote them elsewhere as evidence.

The playbook also carries a short note on checkpoint integrity in an era of AI-generated answers: checkpoints are designed around blank-start work and narration of choices, so a copied answer is visible as a gap in reasoning rather than as a pass.

### 04 — UI/UX lessons → site build

Use it for the two-space design (Learn as a spacious study layout; Reference as a dense book layout), for path-card and lesson-page anatomy, and for the friction rules: full syllabus visible before commitment, no hidden pricing because there is no price, progress shown as checkmarks on a map rather than as streak pressure. Visual-technique build costs and the top visual assets to build first are in `03` and `04` together — `03` owns the concept techniques, `04` owns the site patterns that present them.

### 05 — Career and viral → endings and distribution

Use it for how each stage and each track ends: the job tasks learners must be able to do, the portfolio artifacts they must be able to show, and the external proof points worth naming (for example, free third-party certificates and drill plans) without pretending Data From Zero issues them.

**Boundary — read this before using `05`.** The career file covers *what to learn and prove*: hiring-task taxonomies, portfolio standards per track, and credential alignment. It does **not** cover resume writing, LinkedIn presentation, or application workflow end to end. No file in this package does. Do not scope `05`, or any page built from it, as full job-search coaching. If that layer is wanted later, it needs its own research and its own file.

The viral half of `05` covers audience, positioning moves, and shareability mechanics (the map as the shareable artifact, the open license, the public challenge pattern). It is distribution design, not a marketing plan with dates and budgets.

---

## 4. Evidence and confidence

### How the research was done

- Wave 1 mapped 13 platform and syllabus areas. Wave 2 added the interview and job-task layer, projects and portfolio expectations, the AI-era layer, a certification map, and two supplements (WorldQuant University and OSSU) added by the Owner on 2026-11-15. Wave 3 distilled lesson design, visual teaching, and Vietnamese-learner specifics. Wave 4 verified and deduped.
- Wave 4 checked 30 highest-risk claims across Waves 1 and 2 claim by claim against live official pages, plus 12 Wave 3 claims and a full cross-wave dedupe. Result across the two main verification passes: 19 confirmed, 7 partially confirmed, 2 unverified, 2 contradicted — and both contradicted items were inconsistencies inside the sources themselves, not errors introduced by the research files. The Wave 3 pass found no contradicted claims. Headline finding: no invented numbers were found anywhere in the corpus. Every failure was framing, sample-blending, or versioning, and each is fixed by the rules below.
- Confidence is marked per section in the source files. In this package, a claim carried without a caveat has either been confirmed in Wave 4 or rests on a directly opened primary page in its own wave. Claims that remain second-hand, sample-specific, or design judgment are labeled as such where they appear.

### Honesty rules for anyone quoting this package (binding)

These rules come directly from the Wave 4 strike and flag list. They govern the package files themselves and any site copy, deck, or post built from them.

1. **Never present a self-contradictory vendor total as one number.** DataCamp's own pages give different track and catalog hour totals in different places; Coursera's own pages give different course counts and hour totals for the same program (see `01` for the Google Data Analytics and IBM cases). When a vendor contradicts itself, show the versions with their sources, or pick one version and name it. Never average them, never pick the largest, and never cite a blended figure as if a single page stated it.
2. **DataCamp price — one dated formulation only.** Write: list price about $28 per month billed annually; the pricing page simultaneously promotes an $11 per month special price. Date the observation (checked 2026-11-15). Do not publish either figure alone as "the price," because the page shows both at once and promotions rotate.
3. **IBM program counts — versioned, never blended.** IBM Data Analyst: 11 courses in the current V3 version (older issued badges show 9), about 151 learning hours. IBM Data Engineering: state the course count and the hour figure as two separately sourced facts with their versions; do not present "16 courses / 217 hours" as a single-source fact, because the hour figure in the badge text attaches to the earlier course set.
4. **Job-demand rankings — #1-or-#2, never unanimity.** Strike any sentence claiming SQL is the most-demanded skill in every sample. In one named sample Excel ranks first (81%) ahead of SQL (60%); in others SQL ranks first. The defensible formulation is: SQL and Excel are #1 or #2 in every named sample, with the order depending on the sample. The path order Excel → SQL → Python stands on learning-sequence grounds as well as demand grounds, and does not need a false unanimity claim.
5. **Job-demand percentages — named samples only.** Drop the unverified 47% SQL / 33% Excel pair attributed to a 2.5M-listing dataset via a second-hand transcript; it could not be re-verified. Drop the 31% low endpoint for Python in analyst postings; it appears in no opened page. Use named-sample figures with sample, size, and date attached (the opened samples put Python at about 40–50% and Excel across 41–81% depending on sample). Never blend samples into a single percentage.
6. **Repository counts — approximate and date-stamped.** Star and fork counts drift daily. Write "about 211K stars, November 2026" for the OSSU Computer Science repository and "about 22K stars" for its Data Science repository. Never republish a precise star count as a current fact.
7. **Certification figures — only what official pages state.** Do not publish the MO-210 voucher prices ($104 / $120) as official fact; the official page gives no fixed US price. Label the MO-210 passing score (700) and 50-minute duration as "per secondary guides" or omit them. For AWS CLF-C02, the domain weightings (24 / 30 / 34 / 12), the 700 passing score, and the 50 scored plus 15 unscored question structure are verified from the exam guide text and may be used — cite the AWS exam guide itself, not a proxy host. CLF-C02 price and duration remain unverified and stay omitted.
8. **WQU lab counts — FAQ governs.** The Data Foundations Lab is 8 projects total (2 units of 4). Do not carry the stray "six per unit" header reading from the Lab page into any count or comparison.
9. **Recommendation labels travel with the numbers.** Lesson timing, checkpoint pass thresholds, and review intervals from the lesson-anatomy research are [Recommendation] design choices. Any reuse keeps the label.
10. **Vietnamese-learner claims — current sources only.** Incumbent Vietnamese support changed during the research window: DataCamp now offers a beta Vietnamese translation (AI plus human review, partner courses English-only) and Coursera's auto-translation explicitly excludes labs, guided projects, downloadable files, externally hosted assignments, and peer-graded work — both verified against official help and support pages in Wave 4. Do not quote the older subtitle-era description. The Vietnamese Excel facts are: function names are **not** localized (learners type English names such as SUM and VLOOKUP), and the real trap is the list-separator and CSV locale mechanism, which depends on the learner's own regional settings — teach the diagnostic check, never assert a fixed Vietnamese separator. Glossary trap notes and pattern observations that the source file labels as inference or search-pattern disclosure stay labeled that way.

### What remains unverified or out of scope

- CLF-C02 price and duration: unverified from an official page; omitted by design.
- One Wave 3 claim about Khan Academy unit gating was not independently re-opened in Wave 4; it is cited in the package with its Wave 3 attribution, not as a Wave 4-verified fact.
- Discussion and community evidence in the positioning research is paraphrased pattern-level material gathered via search excerpts and aggregating articles; it is not population statistics and is not presented as such.
- Google Trends comparisons could not be retrieved in the research session; demand arguments rest on job-posting analyses and surveys instead, with samples named.

---

## 5. How to work with this package

1. **Start from the decision, not the file.** Positioning question → `01`. Coverage question → `02`. "How do I build this lesson?" → `03`. "How does the site present it?" → `04`. "What must the learner be able to prove, and how does this spread?" → `05`.
2. **Respect the canonical rule in §2.** If you need a topic list, take it from `02`. If you need a site pattern, take it from `04`'s audit lineage. Do not re-derive a second version inside a page draft.
3. **Carry the honesty rules into site copy.** Any number that reaches a public page — a comparison, a salary figure, a demand percentage, a star count — must satisfy §4 first. When in doubt, name the sample and the date, or drop the number.
4. **Keep the boundaries visible.** Pages built from `05` say "what to learn and prove" and link onward for resume and application help rather than implying coverage that does not exist. Pages touching algorithms state the inventory scope in §3 rather than implying a full algorithms track.
5. **Treat the wave files as the audit trail.** This package is the synthesis; the underlying wave files in the research folder hold the per-claim URLs, access dates, and confidence marks. Cite the package for decisions; consult the wave files when a specific number is challenged.

---

## 6. Source map (for verification)

Underlying research, all in the curriculum-distillation research folder:

- Wave 1 (13 files, `wave-1/`): DataCamp map; Coursera map; freeCodeCamp / Dataquest / Codecademy map; Udemy / edX / Pluralsight / LinkedIn Learning map; Kaggle Learn and practice-sites map; syllabus inventories for Excel/BI, SQL, Python, statistics/analytics/DS, and DE/ML/AI; pedagogy and learner pain; UI/UX audit; viral and positioning.
- Wave 2 (`waves/`): interview and job tasks; projects and portfolio; AI-era layer; certification map; WorldQuant University supplement; OSSU supplement.
- Wave 3 (`waves/`): lesson anatomy; visual teaching; Vietnamese learners.
- Wave 4 (`waves/`): verification of Waves 1 and 2A/2B; verification of Waves 2C–2F; verification of Wave 3 plus the cross-wave dedupe map and package gap list.

STATE.md in the research folder records wave completion, the Wave 4 resolutions, and the binding strike/flag list that §4 of this README operationalizes. Where this README and a wave file differ, STATE.md's Wave 4 resolutions govern.

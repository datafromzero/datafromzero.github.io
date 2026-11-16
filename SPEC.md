# datafromzero — Site specification

**Status:** v1.0 (baseline) · **Owner:** Nguyen "John" Ha · **Org:** github.com/datafromzero ·
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
5. **Delight, sparingly.** GSAP motion only on the homepage and story pages.

---

## 1. Decision record

| # | Decision | Choice | Consequence |
|---|---|---|---|
| D1 | Source of truth for content | **Single repo** `datafromzero/datafromzero.github.io` | Content, site code, datasets and notebooks live together. Content is **written from scratch** (D24); `johnha912/data-odyssey` is not migrated. |
| D2 | Domain | **datafromzero.github.io** now; custom domain may be added later | GitHub Pages redirects github.io → custom domain automatically. Never use absolute self-links in content (§3.4). |
| D3 | Languages | **English at root, Vietnamese under `/vi/`** | `/sql/joins/` and `/vi/sql/joins/`. English URLs never gain a prefix. |
| D4 | Running code | **Links out** to Google Colab (Python/SQL) and Google Sheets templates (Excel stage) | No in-browser runtime now. Content is authored so one can be added later without edits (§6.4). |
| D5 | Versioning & citation | **GitHub Releases + Zenodo DOI**, `CITATION.cff` | Semantic versions for the curriculum (§9). |
| D6 | URL style | **Topic slugs, no numbers** (`/sql/joins/`) | Order lives in frontmatter, never in URLs or file names. |
| D7 | Authorship | **Single author**; Issues welcome; small PRs (typos, fixes) reviewed by owner | No CONTRIBUTING workflow for new lessons; a short CONTRIBUTING.md for fixes. |
| D8 | Analytics | **Google Analytics 4 with a consent banner** | GA loads only after the visitor accepts (§11). |
| D9 | Theme | **Dark by default + light toggle** on docs pages; homepage always dark; print always light | |
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
| D22 | Homepage motion | **GSAP `ScrollTrigger` + `SplitText` + `DrawSVG`**, ≈ 90 KB gzipped JS | Richer motion on `/` and `/stories/*` only; Lighthouse mobile must stay ≥ 90 performance and ≥ 95 accessibility. |
| D23 | Scroll-linked effects | **CSS scroll-driven animations first**, GSAP fallback | Pure scroll-linked effects (progress bar, rail fill) run on the compositor with zero JS where `animation-timeline` is supported; GSAP scrub only as fallback. Triggered choreography stays GSAP. |
| D24 | Content source | **Written from scratch**, outline first, English first | A researched curriculum map is approved by the owner, then lessons are created as drafts; the owner writes the text and the team adds frontmatter, exercises, notebooks, datasets, links and checks. Vietnamese follows in later PRs (§14). |

---

## 2. Tech stack

| Layer | Choice | Rule |
|---|---|---|
| Framework | Astro + Starlight (latest stable at build time) | Exact versions pinned in `package.json`; `package-lock.json` committed |
| Runtime | Node.js current LTS | Pinned in `.nvmrc` and in CI |
| Content | Markdown (`.md`) by default; `.mdx` **only** when a component from §6 is used | Keeps content portable to any future framework |
| Schemas | Astro content collections + Zod | Build fails on invalid frontmatter |
| Search | Starlight built-in (Pagefind) | Static, no external service |
| Math | `remark-math` + `rehype-katex` (KaTeX, MathML output for accessibility) | Formulas in `$…$` / `$$…$$` |
| Motion | GSAP 3.13+ (`ScrollTrigger`, `SplitText`, `DrawSVG` only) | Homepage and `/stories/` only (§10); homepage JS ≈ 90 KB gzipped max (D22) |
| Hosting | GitHub Pages via GitHub Actions | Deploy on push to `main` |

---

## 3. URL contract — **CONTRACT**

### 3.1 Route map

| Route | What | Collection |
|---|---|---|
| `/` | Homepage (custom page, GSAP) | — |
| `/start/` | How to use datafromzero, the roadmap overview | `docs` |
| `/excel/` · `/excel/{lesson}/` | Stage 1 — Excel / Google Sheets | `lessons` |
| `/sql/` · `/sql/{lesson}/` | Stage 2 — SQL | `lessons` |
| `/python/` · `/python/{lesson}/` | Stage 3 — Python | `lessons` |
| `/core/` · `/core/{lesson}/` | Stage 4 — Advanced core (statistics, Git, modeling, cloud) | `lessons` |
| `/data-analyst/{lesson}/` | Branch — Data Analyst | `lessons` |
| `/data-engineer/{lesson}/` | Branch — Data Engineer | `lessons` |
| `/data-scientist/{lesson}/` | Branch — Data Scientist | `lessons` |
| `/analytics-engineer/{lesson}/` | Branch — Analytics Engineer | `lessons` |
| `/ml-engineer/{lesson}/` | Branch — ML / AI Engineer | `lessons` |
| `/reference/glossary/` · `/reference/glossary/{term}/` | Glossary | `glossary` |
| `/reference/excel/{function}/` | e.g. `/reference/excel/xlookup/` | `reference` |
| `/reference/sql/{keyword}/` | e.g. `/reference/sql/group-by/` | `reference` |
| `/reference/pandas/{name}/` | e.g. `/reference/pandas/merge/` | `reference` |
| `/reference/stats/{formula}/` | e.g. `/reference/stats/standard-deviation/` | `reference` |
| `/careers/{career}/` | Career guides (the 5 roles) | `careers` |
| `/stories/{slug}/` | History / story / visualization pages (GSAP allowed) | `stories` |
| `/datasets/` · `/datasets/{name}/` | Dataset documentation + download | `datasets` |
| `/cite/` · `/changelog/` · `/about/` · `/license/` · `/privacy/` | Project pages | `docs` |
| `/vi/…` | Vietnamese mirror of every route above, **same slugs** | |

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
│  └─ Branches: Data Analyst · Data Engineer · Data Scientist · Analytics Engineer · ML/AI Engineer
├─ Reference (Book mode — indexed, compact, searchable)
│  ├─ Glossary
│  ├─ Syntax: Excel functions · SQL keywords · pandas
│  ├─ Statistics formulas
│  └─ Careers (5 guides)
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
description: Combine rows from two tables with INNER and LEFT JOIN.   # ≤ 160 chars, used for SEO/social
stage: sql                    # excel | sql | python | core | data-analyst | data-engineer |
                              # data-scientist | analytics-engineer | ml-engineer
order: 40                     # sort key inside the stage; use gaps of 10 so lessons can be inserted
level: beginner               # beginner | intermediate | advanced
duration: 25                  # minutes, integer
objectives:                   # 2–5 items, each starts with a verb
  - Explain what a join key is
  - Write an INNER JOIN and a LEFT JOIN
prerequisites:                # lesson ids (not URLs); validated at build time
  - sql-select-basics
datasets: [cafe-sales]        # dataset names (§7); optional
notebook: notebooks/sql/sql-joins.ipynb   # optional; drives the "Open in Colab" button
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

Rendered at the top of every lesson: **level · duration · last reviewed**, then **Objectives** and
**Before this lesson** (prerequisite links). Rendered at the bottom: **Sources**, **Cite this lesson**,
**Suggest an edit**, **Report an issue**, prev/next.

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
| `<Term id="glossary-primary-key">primary key</Term>` | Inline glossary link with short definition | Plain link |
| Starlight `<Aside>` (note / tip / caution / danger) | Callouts | Built in |
| `$…$`, `$$…$$` | Math (KaTeX) | MathML |

Rules:
- No other components or raw `<script>` in content. New components are added here first (MINOR change).
- Components are available in every `.mdx` file **without import lines** (D21). The build fails, naming the
  file and line, on any `import`/`export` in content, any component not in this table, any `<script>`,
  event-handler attribute (`on…=`), `set:html` or `javascript:` URL (in `.md` or `.mdx`), a `Solution` outside an `Exercise`, or math inside a heading.
- `Term` shows the definition as a native popover, with no JS: opened by hover/focus where interest
  invokers exist (`interestfor`), otherwise by a small "?" button next to the link (`popovertarget`,
  tap or click). Both dismiss with Esc or an outside click; the link always goes to the glossary page.
- A literal dollar sign in prose must be written `\$`; otherwise `$…$` is read as math.
- Exercise ids are permanent (`{lesson-id}-{n}`) so teachers can reference "Exercise sql-joins-2".

### 6.4 Future in-browser code (not now)
Write runnable examples as fenced code blocks with a meta flag: ```` ```sql dataset=cafe-sales ````.
They render as normal code today; a future `RunnableCode` enhancement (DuckDB-WASM / Pyodide) can
pick them up without editing content.

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
- Notebooks load data from a **release-tag URL**, not `main`:
  `https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/v1.0.0/datasets/cafe-sales/v1/orders.csv`
- Each dataset also ships an `.xlsx` (Excel stage) and a `.sql` load script (SQL stage) generated by a script in `scripts/`.
- License: CC BY 4.0.

Notebooks: `notebooks/{stage}/{lesson-id}.ipynb`, opened via
`https://colab.research.google.com/github/datafromzero/datafromzero.github.io/blob/main/notebooks/…`.
Notebooks are cleared of outputs before commit (CI check).

---

## 8. Internationalization

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
- `/cite/` page: APA + BibTeX for the whole work (concept DOI) and per-version DOIs.
- Every lesson footer shows **Cite this lesson**: author, year (from `reviewed`), title, site, curriculum version, URL.
  Static pages cannot know when they were read, so a note asks the reader to add their access date (D20).
- `CHANGELOG.md` follows *Keep a Changelog*; `/changelog/` renders it.
- The site footer shows the current version and its DOI badge.

---

## 10. Design & motion

- Tokens, typography and logo rules: see `design/README.md` §2–3. Dark is default; docs pages get a light toggle; `@media print` forces black-on-white, hides nav/buttons, prints link URLs.
- **GSAP is allowed only on `/` and `/stories/*`.** Never on lessons, reference, datasets or project pages.
- Every animation respects `prefers-reduced-motion`; all content is visible with JS disabled.
- Study pages (lessons): wide line-height, max ~70ch, one idea per section.
  Reference pages: compact, scannable, fixed section order (§5.2).

---

## 11. Analytics & privacy

- **Google Analytics 4**, loaded **only after consent** (Consent Mode v2, default `denied`).
- A minimal consent banner (Accept / Decline), choice remembered; "Cookie settings" link in the footer to change it.
- Declining must leave the site fully functional; GA script must never block rendering.
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
| Prerequisite / see-also ids exist; no cycles in prerequisites | `scripts/check-graph.ts` | Yes |
| External links | `lychee` (weekly scheduled job, opens an issue) | No |
| Spelling (American English) | `cspell` with project dictionary | Yes |
| Markdown style | `markdownlint` | Yes |
| Notebooks have no outputs | `nbstripout --verify` | Yes |
| Accessibility + performance | Lighthouse CI on `/`, one lesson, one reference page | Yes if a budget is missed |

**Budgets:** Lighthouse mobile ≥ 90 (performance), ≥ 95 (accessibility). Lesson pages ship no
framework JS beyond Starlight's own. Homepage JS ≈ 90 KB gzip max (D22).
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
│  │  │  ├─ data-analyst/ data-engineer/ data-scientist/ analytics-engineer/ ml-engineer/
│  │  │  ├─ reference/{glossary,excel,sql,pandas,stats}/
│  │  │  ├─ careers/ stories/ datasets/
│  │  │  └─ vi/               # Vietnamese mirror (same structure)
│  │  └─ i18n/vi.json
│  ├─ components/
│  │  ├─ content/             # the §6 authoring components (auto-imported in .mdx)
│  │  ├─ lesson/              # lesson header and footer
│  │  └─ starlight/           # Starlight component overrides
│  ├─ lib/                    # schemas, validation, content rules (§5, §6)
│  ├─ pages/index.astro       # custom homepage (GSAP)
│  ├─ styles/                 # tokens.css, print.css, math.css
│  ├─ site.ts                 # site name, author, repository, URL
│  ├─ redirects.ts            # §3.3
│  └─ content.config.ts       # registers the collections (§5)
├─ public/                    # favicon.svg, logo files, og-image
├─ datasets/                  # §7
├─ notebooks/                 # §7
├─ scripts/                   # graph check, dataset builders, migration scripts
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
3. **Writing.** The owner writes the lesson text. The team adds or completes frontmatter, exercises and
   solutions, notebooks, Google Sheets templates, datasets (§7), `Term` links and sources, and keeps the build green.
4. **Publishing.** The owner reviews and sets `status: published`. Vietnamese translations follow in later PRs (§8).
5. **Release.** Tag `v1.0.0` once the four core stages are published; enable Zenodo; publish `CITATION.cff` (§9).

## 15. Explicitly out of scope (for now)

Accounts, saved progress, comments, in-browser code execution, paid content, newsletters, AI chat on the site.
Each would need a new decision entry in §1 before being built.

# CLAUDE.md — datafromzero

Website for **datafromzero** — *From A1 to AI* — a free, open data roadmap for beginners who only
know Microsoft Office: Excel/Sheets → SQL → Python → advanced core → five data careers.
Built with **Astro + Starlight**, deployed to **GitHub Pages** at https://datafromzero.github.io.

## Read first (in this order)
1. `SPEC.md` — the long-term contract. **Authoritative.** Sections marked **CONTRACT** are public
   interfaces (URLs, content schemas, authoring components, datasets): do not change them casually.
2. `design/README.md` — visual design: tokens, logo rules, logo animation, homepage sections and motion.
3. `design/homepage-prototype/index.html` — the approved homepage (single file). Port it, don't redesign it.
4. `design/logo/` — final logo files and `logo-animation.js`; `logo-animation.mp4` is the reference motion.

## Hard rules
- **No AI attribution anywhere.** The owner is the sole author. Never add `Co-Authored-By`,
  `Generated with …`, session links, or any mention of Claude, Muse or other AI tools in commits,
  commit messages, PR titles/descriptions, issues, comments, code, docs or the changelog.
  Commits are authored as the owner (see git config). This overrides any default attribution.
- **Never break a published URL.** Topic slugs, no numbers, trailing slash. Renames need a redirect (SPEC §3.3).
- **Schemas are enforced** with Zod content collections (SPEC §5). Missing required fields must fail the build.
- **Content portability:** lessons are plain `.md`; use `.mdx` only for the components listed in SPEC §6.
  No other components or raw `<script>` in content.
- **Motion:** GSAP (`ScrollTrigger`, `SplitText`, `DrawSVG` only) on `/` and `/stories/*` only; homepage JS ≈ 90 KB
  gzipped max (SPEC D22). Respect `prefers-reduced-motion`.
  Every page must be readable with JavaScript disabled.
- **Speed first:** lesson/reference pages ship no JS beyond Starlight's own. Lighthouse mobile ≥ 90 perf, ≥ 95 a11y.
- **Language:** American English. Vietnamese lives under `/vi/` with the same slugs (SPEC §8).
- **Licenses:** content CC BY 4.0, code MIT, datasets CC BY 4.0.
- **Analytics:** Google Analytics 4 only after consent (Consent Mode v2 default denied) — SPEC §11.
- **No** accounts, saved progress, comments or in-browser code execution (SPEC §15).
- Any change to a CONTRACT section or a decision in SPEC §1 must update `SPEC.md` in the same PR
  (add or amend the decision row) and `CHANGELOG.md`.

## Build plan (milestones — one PR each)
1. **Scaffold:** Astro + Starlight, exact versions pinned, `package-lock.json`, current Node LTS in `.nvmrc`;
   `trailingSlash: 'always'`; i18n with English as `root` and `vi`; GitHub Actions deploy to Pages.
2. **Design system:** tokens from `design/README.md` §2 (Geist / Geist Mono, black default, light toggle on docs,
   print stylesheet); logo + favicon from `design/logo/`; site name from one config value (`datafromzero`).
3. **Content model:** `src/content.config.ts` with the schemas in SPEC §5; lesson header (level · duration ·
   reviewed, objectives, prerequisites) and footer (sources, cite this lesson, suggest edit, report issue).
4. **Authoring components** (SPEC §6): `Exercise`, `Solution` (`<details>`), `OpenInColab`, `OpenInSheets`, `Term`.
5. **Homepage:** port `design/homepage-prototype/index.html` to `src/pages/index.astro` with GSAP from npm;
   logo animation ported to CSS from `design/logo/logo-animation.js` (first paint never waits for GSAP).
6. **Quality gates** (SPEC §12): links validator, prerequisite-graph check, cspell, markdownlint,
   nbstripout check, Lighthouse CI, Dependabot (monthly, grouped). One build-time graph module
   (`src/lib/graph.ts`, CLRS ch. 20/22, run by `scripts/check-graph.ts` per SPEC §12): DFS cycle detection that prints the cycle path, topological-order
   check against `order`, reverse edges for a "Unlocks next" list in the lesson footer, and longest-path
   layering for the roadmap map. Zero runtime JS. Record "Unlocks next" (§5.1) and the roadmap map
   (§3.1 `/start/`) in SPEC when they are built.
   Then a small navigation PR (done, D26/D27): cross-document View Transitions (CSS, ≤150 ms, off for reduced motion) and
   Speculation Rules prefetch (moderate eagerness, same-origin, no prerender).
7. **Project pages:** `/start/`, `/cite/`, `/changelog/`, `/about/`, `/license/`, `/privacy/`; `CITATION.cff`;
   GA4 consent banner. `/start/` shows the roadmap map: static SVG from the graph module's layering.
8. **Content** (SPEC §14, D24): curriculum map researched and approved by the owner → lessons created as drafts →
   the owner writes the text; `content-producer` adds frontmatter, exercises, notebooks, sheets, datasets, `Term`
   links and sources → the owner publishes. English first; `vi-translator` follows. Lesson content PRs always
   wait for the owner.
9. **Story: depth-first search** — a `/stories/` page animating DFS discovery/finish times on the real lesson
   graph (GSAP allowed). Story text by the owner.

## Agent team
Subagents live in `.claude/agents/` (model and effort set per agent). Roster, standard flow and
token rules: `.claude/agents/README.md`. Default flow per milestone: implementer → `qa-runner`
→ `spec-reviewer` → lead commits. Do small edits inline; delegate whole milestones or batches.

## Merging
The owner lets the lead merge PRs without asking when all of these hold: the build and CI are green
(before `ci.yml` exists: a clean local `npm run build`); `spec-reviewer` approved, or the change is
tooling/docs only with no CONTRACT impact; no owner decision is pending; the PR description has no AI
attribution. Always ask the owner first for: CONTRACT changes or SPEC decisions not yet approved, lesson
or story content (the owner is the sole author), dependencies that ship JS to lesson pages, anything in
SPEC §15, and deleting or renaming a published URL.

Ask the owner before: changing a CONTRACT, adding a dependency that ships JS to lesson pages,
or anything in SPEC §15.

## Knowledge graph
Before answering architecture, SPEC or "where is X defined / what depends on X" questions, read
`.claude/kb/GRAPH_REPORT.md` and use `node scripts/kb.mjs query|path|explain` (skill: `.claude/skills/kb/SKILL.md`)
instead of re-reading SPEC.md or grepping. Open the cited file:line before relying on details.
After changing SPEC.md, CLAUDE.md, design/README.md, `src/`, `scripts/` or config, run `npm run kb` and include the result.

## Commands
Use the Node version in `.nvmrc` (`nvm use`).
- `npm ci` — install exact pinned dependencies
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/` (must pass schema + link validation)
- `npm run preview` — serve the production build locally
- `npm run check` — every blocking gate locally: spelling, markdownlint, knowledge graph, build (schemas + links),
  prerequisite graph, unit and fixture tests, notebooks (skipped when none or `nbstripout` is missing)
- Single gates: `npm run spell` · `lint:md` · `check:graph` · `check:kb` · `check:notebooks` · `test:unit` · `test:fixtures`
- `npm run lighthouse` — builds the fixture site (`tests/fixtures/valid`) and runs Lighthouse CI (mobile, perf ≥ 90, a11y ≥ 95);
  Chrome from `CHROME_PATH`, else `/opt/pw-browsers/chromium` when present
- `npm run review-report` — lessons whose `reviewed` date is older than 18 months
- Fixtures live in `tests/fixtures/` (never in `src/content`); invalid cases are one folder per rule with `expect.txt` and `via.txt`

Deploys run from `.github/workflows/deploy.yml` on every push to `main`
(repo Settings → Pages → Source must be **GitHub Actions**).

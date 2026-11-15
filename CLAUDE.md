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
- **Motion:** GSAP (`ScrollTrigger` only) on `/` and `/stories/*` only. Respect `prefers-reduced-motion`.
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
   logo animation via `design/logo/logo-animation.js`.
6. **Quality gates** (SPEC §12): links validator, prerequisite-graph check, cspell, markdownlint,
   nbstripout check, Lighthouse CI, Dependabot (monthly, grouped).
7. **Project pages:** `/start/`, `/cite/`, `/changelog/`, `/about/`, `/license/`, `/privacy/`; `CITATION.cff`;
   GA4 consent banner.
8. **Content migration** (SPEC §14): copy Markdown from `johnha912/data-odyssey`, add frontmatter, fix links.

## Agent team
Subagents live in `.claude/agents/` (model and effort set per agent). Roster, standard flow and
token rules: `.claude/agents/README.md`. Default flow per milestone: implementer → `qa-runner`
→ `spec-reviewer` → lead commits. Do small edits inline; delegate whole milestones or batches.

Ask the owner before: changing a CONTRACT, adding a dependency that ships JS to lesson pages,
or anything in SPEC §15.

## Commands
Use the Node version in `.nvmrc` (`nvm use`).
- `npm ci` — install exact pinned dependencies
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/` (must pass schema + link validation)
- `npm run preview` — serve the production build locally
- `npm run check` — all quality gates locally *(added with the quality-gates milestone)*

Deploys run from `.github/workflows/deploy.yml` on every push to `main`
(repo Settings → Pages → Source must be **GitHub Actions**).

# Handoff: state of the work on 2026-11-17

For the next lead session. Read `CLAUDE.md` first (rules, merging policy, commands), then this file.
`SPEC.md` is authoritative; decisions D1–D34 are in its §1. Use `node scripts/kb.mjs query <topic>` to find things.

## Who is who

- **Owner:** the sole author of all lesson and story text (under D24 the owner may ask the team for a draft, which
  the owner edits and approves). Writes in Vietnamese in chat; the site is American English only for now (D30).
  Reply in Vietnamese.
- **Lead session:** plans, delegates to the agents in `.claude/agents/`, reviews, opens and merges PRs under the
  merging policy in `CLAUDE.md`.
- **External research:** arrives as GitHub issues that use the research-report template (label `research`).
  Build from the issue text exactly; keep its sources and honesty notes.

## What is live on `main`

- **Site:** Astro + Starlight, deployed to GitHub Pages on every push to `main`.
- **Homepage** (dark and light, GSAP only here, each effect a deferred chunk):
  - Hero: the logo and "From A1 to AI." lockup only.
  - 01 The core.
  - 02 "One trunk. Four careers."
  - 03 "Same question. Three tools."
  - 04 "A short history of data" (card slider with a line icon per card; short sourced summaries).
  - 05 "Pick a direction" (four career cards with canvas 3D figures, link to the quiz).
- **Bottom taskbar** on every page (D31, D35): a menu button labeled with the lesson code and the section being read,
  and `Next E9 →` on lessons (`Start E1 →` on `/start/`, `Start here →` everywhere else). Its sheet has two tabs, This lesson and Course, plus Home, Start
  here, Career quiz and the light/dark switch. On phones it replaces Starlight's menu button and "On this page" bar.
- **Project pages:** `/start/`, `/about/`, `/cite/`, `/changelog/`, `/license/`, `/privacy/`, `/career-quiz/` (D33).
- **Dataset:** `datasets/cafe-sales/` v1 (D29), built by `scripts/build-cafe-sales.py`; not released until `v1.0.0`.
- **Curriculum (D29, D32):** 159 lessons in 8 stages, all `status: draft` (never deployed):
  Excel 22, SQL 30, Python 25, core 25, Data Analyst 13, Data Engineer 20, Data Scientist 12, ML Engineer 12.
  The map is `research/curriculum/06-curriculum-map.yaml`; lesson frontmatter is the source of truth.
- **Quality gates:** `npm run check` locally; CI runs `checks` and `lighthouse` on every PR.
- **Open issues and PRs:** issue #41 (Excel checks in the real apps, Sheets copy links).

## What comes next (build plan item 8, content)

1. **Excel stage (22 lessons): published** on 2026-11-17 at the owner's request. Each lesson links its practice
   workbook in `sheets/excel/{lesson-id}.xlsx` (built by `scripts/lesson_sheets/`, one pre-built sheet per exercise).
   Open work is in issue #41: the owner checks steps that could not be run here (Power Query, Sheets `QUERY`, some menu
   names) and sends Google Sheets `/copy` links; each link becomes a `sheet` field plus `<OpenInSheets />`.
2. **Next stages:** SQL (30 lessons, DuckDB in Colab, notebooks in `notebooks/sql/`), then Python and core. Use the
   lesson flow in `.claude/agents/README.md`: `content-producer` batches of ≤ 5 in parallel worktrees, following
   `.claude/agents/LESSON-STANDARD.md`, then `content-reviewer`, then fixes by the same writer. SQL needs a model
   lesson first (the lead or one writer drafts it; the owner approves it before the other batches start).
3. **Glossary:** no glossary entries exist yet, so lessons use no `Term` links. Glossary pages have no `status`
   field and would publish at once; ask the owner before adding them.
4. **Source links:** DuckDB, Power BI and Looker Studio URLs in the drafts were all opened on 2026-11-17 and return
   200. The DuckDB `docs/stable/...` URLs are redirect stubs to the current version (`docs/2.0/...`); the anchors
   `#foreign-keys`, `#syntax` and `#joins` exist there. Keep the `stable` form. Recheck only if a lesson adds new ones.
5. **Release `v1.0.0`** when the four core stages (102 lessons) are published; then enable Zenodo (SPEC §9, §14).

## Open items and owner decisions still pending

- **Google Analytics:** on since 2026-11-17 (`G-0TNDBK1ZJX`, retention 2 months, consent first). If the owner changes
  the retention in GA4, update `GA_RETENTION` in `src/site.ts` so `/privacy/` stays true.
- **Vietnamese:** paused (D30). `src/content/i18n/vi.json` is kept; `/vi/` URLs redirect to English.
  A Vietnamese terminology research prompt was given to the owner earlier; no result has arrived.
- **Homepage accessibility score is 97, not 100:** the 01 steps are dimmed to 25% until reached, which fails the
  contrast audit. It is the approved design; change it only if the owner asks.
- **Course tab** lists every published lesson by stage automatically (`src/components/taskbar/Taskbar.astro`, D35).
- **Consent banner** is at the top of the page in normal flow (`src/components/starlight/Banner.astro`, and first in
  the homepage body), never fixed; opening or closing it fires `dfz:layout` so the homepage motion re-measures.
- **Design prototype:** `design/homepage-prototype/index.html` is the original approved prototype and no longer
  matches the homepage; `design/README.md` §4–§5 describe the current design.

## Working rules that are easy to miss

- **Always give the owner a link.** When work is done: merge it (when the merging policy allows or the owner asked),
  wait for the Pages deploy, check the live page, then send its URL. For anything not live (drafts, open PRs), send a
  preview the owner can open (PDF or screenshots) and say why it is not on the site.

- **No AI attribution** in commits, PR bodies, issues, code or docs. The GitHub tool appends a "Generated by"
  footer to new PR bodies: update the PR body right after creating it to remove the footer.
- **Commits** are authored as the repo's configured git user.
- **Branches:** work on the session's assigned branch, open a PR to `main`, merge when CI is green and
  `spec-reviewer` approved. After a merge, reset the branch to `origin/main` and push.
- **Conflicts in `.claude/kb/`:** take either side, run `npm run kb`, commit the result.
- **Ask the owner first** for: CONTRACT changes, new SPEC decisions, lesson or story content, anything in SPEC §15,
  and removing a published URL.
- **Node:** `.nvmrc` says 26; checks have also been run on Node 22 without problems.

## Environment notes (per account, not stored in the repo)

- The GitHub App must be installed for the new account, with access to `datafromzero/datafromzero.github.io`.
- The cloud environment's network allow-list is per account. Hosts that were useful: `demos.gsap.com`, `gsap.com`,
  `duckdb.org`. Package registries work by default.
- Scratchpad files, mockup pages and chat history do not carry over. Everything needed is in this repository.

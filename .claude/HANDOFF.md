# Handoff: state of the work on 2026-11-17

For the next lead session. Read `CLAUDE.md` first (rules, merging policy, commands), then this file.
`SPEC.md` is authoritative; decisions D1–D33 are in its §1. Use `node scripts/kb.mjs query <topic>` to find things.

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
  - 04 "A short history of data" (card slider with sources).
  - 05 "Pick a direction" (four career cards with canvas 3D figures, link to the quiz).
- **Bottom taskbar** on every page (D31): shortcuts menu, Start learning, light/dark, back to top.
- **Project pages:** `/start/`, `/about/`, `/cite/`, `/changelog/`, `/license/`, `/privacy/`, `/career-quiz/` (D33).
- **Dataset:** `datasets/cafe-sales/` v1 (D29), built by `scripts/build-cafe-sales.py`; not released until `v1.0.0`.
- **Curriculum (D29, D32):** 159 lessons in 8 stages, all `status: draft` (never deployed):
  Excel 22, SQL 30, Python 25, core 25, Data Analyst 13, Data Engineer 20, Data Scientist 12, ML Engineer 12.
  The map is `research/curriculum/06-curriculum-map.yaml`; lesson frontmatter is the source of truth.
- **Quality gates:** `npm run check` locally; CI runs `checks` and `lighthouse` on every PR.
- **Open issues and PRs:** the Excel-stage drafts PR (waits for the owner).

## What comes next (build plan item 8, content)

1. **Excel stage (22 lessons):** every lesson has full draft text (team drafts under D24), three exercises and a
   practice workbook in `sheets/excel/{lesson-id}.xlsx`, built from `cafe-sales` by its own module in
   `scripts/lesson_sheets/` (`python3 scripts/build-lesson-sheets.py [lesson-id]`; byte-stable output). Each
   exercise has its own pre-built sheet (`calc_ex1..3`); `raw_*` sheets are never edited. All still `status: draft`.
   The owner reviews each lesson, resolves its `TODO(owner)` notes (menu names and behaviors that could not be run
   here: Power Query, Sheets QUERY, Sheets error wording), uploads the workbook to Google Drive, adds the `sheet`
   link, sets `reviewed` and `status: published`.
2. **Next stages:** SQL (30 lessons, DuckDB in Colab, notebooks in `notebooks/sql/`), then Python and core. The
   Excel batches worked well as four parallel `content-producer` agents in worktrees, the model lesson as the
   standard, then one `spec-reviewer` pass per batch (it always found real issues: exercises overwriting the worked
   example's cells, filters hiding summary cells, unsourced app behavior, first-person notes in learner text).
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
- **Two menus on phones** on inner pages: Starlight's top menu (page list) and the taskbar menu (shortcuts).
  The owner was told and has not asked to merge them.
- **Taskbar shortcuts** list only pages that exist. Add Excel, SQL, Python and the branches when lessons publish.
- **Design prototype:** `design/homepage-prototype/index.html` is the original approved prototype and no longer
  matches the homepage; `design/README.md` §4–§5 describe the current design.

## Working rules that are easy to miss

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

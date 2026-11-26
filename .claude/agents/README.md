# Agent team

Files in this folder define Claude Code subagents (frontmatter `name`, `model`, `effort`). This README and
`LESSON-STANDARD.md` have no `name`, so they are not loaded as agents.

**Nothing from China (SPEC D62, owner):** never use or name a Chinese-made model, tool, library, service, app or brand, in lessons, notebooks, Colab files, starters, datasets, figures, examples or sources. LLM work uses IBM Granite (`ibm-granite/granite-4.0-1b`). Check the maker of anything new on its official page. Reviewers grep every batch for it and report any hit as must-fix.

## Roster

| Agent | Model · effort | Role | When |
|---|---|---|---|
| *lead* (main session) | Opus · medium | Plans, writes briefs, small edits, merges batches, commits, PRs | always |
| `content-producer` | Sonnet · high | Lessons: draft text (D24) or material around the owner's text; exercises, workbooks, notebooks (Python stage only, D43), sources | each lesson batch |
| `content-reviewer` | Sonnet · high · read-only | Fact-checks a lesson batch: recomputes numbers, checks formulas and tool claims, lesson standard | each lesson batch |
| `site-builder` | Sonnet · medium (high for visual work) | Code, config, schemas, components, CI, project pages, tokens, homepage motion, a11y | code changes |
| `spec-reviewer` | Opus · high · read-only | CONTRACT, SPEC decisions, code, URL and dataset changes | each code PR, each SPEC change |
| `qa-runner` | Haiku · low · read-only | Build and checks, failures only | after code changes |
| `maintainer` | Haiku · medium | Dependency bumps, typos, link fixes, stale-review lists, triage | ongoing |
| `vi-translator` | Sonnet · high | **Paused (D30).** Vietnamese mirror | when the owner reactivates §8 |

Changes on 2026-11-17: `frontend-designer` merged into `site-builder` (the visual milestones are done; ask for
effort high in the brief for visual work). Lesson batches are now reviewed by `content-reviewer` (Sonnet) instead
of `spec-reviewer` (Opus): that review is mostly recomputing numbers and checking docs, which does not need Opus.
`LESSON-STANDARD.md` replaces reading the 463-line playbook in every lesson brief.

Why these models: price per 1M output tokens is roughly Haiku $0.50 · Sonnet $10 · Opus $20 · Fable $40. Opus only
where judgment is the product and its output is short (planning, CONTRACT review). Sonnet does the volume of code and
text. Haiku does mechanical, verifiable work. Fable is not on the team; escalate to it only if Opus fails at a task.

## Flows

**Lesson batch** (≤ 5 lessons per agent; run batches in parallel with `isolation: worktree`):
1. lead: a short brief naming the lesson ids, the mode (draft or around the owner's text) and anything special; the
   standard lives in `LESSON-STANDARD.md`, so do not repeat it.
2. `content-producer` writes, runs `npm run check`, commits in its worktree.
3. `content-reviewer` checks the commit (budget ~25 calls; list issues already known so it skips them).
4. Findings go back to the **same** `content-producer` by SendMessage (warm context: one fix pass cost 10–30 calls
   instead of a fresh agent's 150).
5. lead adds every new kind of mistake from the review to `.claude/MISTAKES.md` (and to `LESSON-STANDARD.md` if it
   is a lesson rule), so the next batch does not repeat it.
6. lead merges the batches, resolves `project-words.txt` and `.claude/kb/` (run `npm run kb`), runs `npm run check`,
   opens one PR per stage. Lesson PRs wait for the owner.

**Code change** (one milestone = one PR): lead brief → `site-builder` → `qa-runner` → `spec-reviewer` → lead logs new
mistakes in `.claude/MISTAKES.md` → lead commits.

## Token rules

- Measured on the Excel stage: one `content-producer` batch of 5 lessons cost about 380k–480k tokens and 140–215 tool
  calls; one review about 80k–115k tokens. Most of a writer's cost is reading; keep briefs short and point to files.
- Spawning an agent starts cold. The lead does changes of a few lines itself; delegate whole batches, never one file.
- Brief with exact SPEC section numbers and paths. Never ask an agent to read the whole SPEC or playbook.
- Give reviewers a call budget and the list of known issues. Never run a reviewer on a red build.
- Pass errors and diffs, not full logs or whole files.
- Look things up in the knowledge graph (`node scripts/kb.mjs query|explain <terms>`) before reading whole files.
- Escalation ladder: Haiku → Sonnet → Opus. An agent stuck twice on the same error reports back.
- Worktrees live in `.claude/worktrees/` (ignored by the knowledge graph and cspell). Worktrees start without
  `node_modules`: the agent runs `npm ci` once.

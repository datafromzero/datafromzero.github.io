# Agent team

Files in this folder define Claude Code subagents (frontmatter `name`, `model`, `effort`).
This README has no `name`, so it is not loaded as an agent.

## Roster

| Agent | Model · effort | Role | Build milestones |
|---|---|---|---|
| *lead* (main session) | Opus · medium (high for planning) | Plans, briefs agents, does small edits itself, commits, opens PRs | all |
| `spec-reviewer` | Opus · high · read-only | Reviews each finished change against SPEC CONTRACT + CLAUDE.md rules | every PR |
| `site-builder` | Sonnet · medium | Config, schemas, components, CI, quality gates, project pages | 1, 3, 4, 6, 7 |
| `frontend-designer` | Sonnet · high | Tokens, theme, homepage port with GSAP, a11y, Lighthouse | 2, 5 |
| `content-producer` | Sonnet · high | Lesson stubs, frontmatter, exercises, notebooks, sheets, Term links around the owner's text | 8 |
| `vi-translator` | Sonnet · high | Vietnamese mirror under `/vi/` and UI strings | after 8 |
| `qa-runner` | Haiku · low · read-only | Build + checks, reports failures only | every step |
| `maintainer` | Haiku · medium | Dependency bumps, typos, stale-review lists, triage | ongoing |

Why: price per 1M output tokens is roughly Haiku $0.50 · Sonnet $10 · Opus $20 · Fable $40.
Opus is used only where judgment is the product (planning, contract review) and its output is
short. Sonnet does the volume of code and text. Haiku does mechanical, verifiable work.
Fable is not on the team: this is a static site; escalate to it only if Opus fails at a task.

## Standard flow (one milestone = one PR)

1. **lead** writes the brief: goal, exact SPEC sections, files, done-criteria.
2. **builder / designer / migrator / translator** implements.
3. **qa-runner** checks. On FAIL, the same implementer fixes (pass the FAIL excerpt, not full logs).
4. **spec-reviewer** reviews the green diff once. Fixes go back to the implementer.
5. **lead** commits (as the owner, no AI attribution) and opens the PR.

## Token rules

- Spawning an agent starts cold. The lead does changes of a few lines itself; delegate whole
  milestones or batches, never one file at a time.
- Brief with exact SPEC section numbers and paths. Never ask an agent to "read the whole SPEC".
- Never run Opus on a red build: qa-runner first, spec-reviewer second.
- Pass errors and diffs, not full logs or whole files.
- Look things up in the knowledge graph (`node scripts/kb.mjs query|explain <terms>`, report in `.claude/kb/GRAPH_REPORT.md`) before reading whole files.
- Escalation ladder: Haiku -> Sonnet -> Opus. An agent stuck twice on the same error reports back.
- Independent work (e.g. translating stage 1 while migrating stage 2) can run in parallel in the
  background; use `isolation: worktree` when both edit files.

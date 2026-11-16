---
name: kb
description: Project knowledge graph for datafromzero. Use for questions about where something is defined, what a SPEC section or decision (D1-D23) says, which files depend on or mention a file, how parts of the architecture connect, or which agent/rule/milestone covers a topic. Use before Grep or reading SPEC.md, CLAUDE.md or design/README.md in full.
---
# Knowledge graph lookup

An index of SPEC sections, decisions, CLAUDE.md rules and milestones, design sections and tokens,
source files, exported symbols, components, Starlight overrides, dependencies, agents and issue
templates, with edges for imports, mentions and overrides. Built by one deterministic Node script.

1. Read `.claude/kb/GRAPH_REPORT.md` first: god nodes, communities, every decision in one line,
   CONTRACT sections with file:line, a "where is" index and suggested questions.
2. Look up details before using Grep/Read:
   - `node scripts/kb.mjs query <terms>` matching nodes plus neighbors (depth 2), each with file:line
   - `node scripts/kb.mjs path <a> <b>` shortest connection between two nodes
   - `node scripts/kb.mjs explain <id>` one node, its location and all edges
   Ids: `S5.1` SPEC section, `D18` decision, `R3` rule, `M5` milestone, `DG3` design section,
   `src/lib/x.ts` file, `src/lib/x.ts#Name` symbol, `agent:name`, `pkg:name`, `sl:Name`, `token:--bg`.
3. After changing SPEC.md, CLAUDE.md, design/README.md, `src/`, `scripts/` or config, run `npm run kb`
   (CI can run `node scripts/kb.mjs check`, which fails when the committed graph is stale).
4. The graph is an index, not a source of truth: open the cited file:line before relying on details.

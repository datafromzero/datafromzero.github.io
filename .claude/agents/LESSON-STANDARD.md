# Lesson standard (compact)

The one page lesson agents read instead of the 463-line playbook. Distilled from
`research/curriculum/03-teaching-playbook.md` §2–§3 and from every review finding on the Excel stage.
No frontmatter `name`, so it is not loaded as an agent. Past mistakes and their rules: `.claude/MISTAKES.md`. Open the playbook only for a domain section you need
(§3.2 SQL, §3.3 Python, §3.4 statistics, §3.5 DE/ML/AI).

## Read, in this order

1. This file.
2. The model lesson of the stage (Excel: `src/content/docs/excel/grid-and-tidy-layout.mdx`; SQL: `src/content/docs/sql/from-spreadsheet-to-sql.mdx`
   for one-table lessons and `relational-model.mdx` for keys and joins); match its voice and length.
3. Your lessons' entries in `research/curriculum/06-curriculum-map.yaml` (`visual`, `notes`, `research`).
4. `datasets/cafe-sales/README.md` (tables, row counts, built-in surprises). Not the whole SPEC.

## Shape (seven `##` headings, exactly; SQL lessons have eight)

Warm-up · The question · The picture · **How it works (SQL lessons only)** · Worked example · Finish it · On your own ·
Check yourself.

- **Warm-up:** 2–3 recall prompts from earlier lessons (use their frontmatter objectives), at least one asks the
  learner to produce something; answers in lowercase `<details>`.
- **The question:** one business question with the data visible (a small table); promise the answer.
- **The picture:** one static inline SVG (at most two stacked), labels on the grid itself. A concept where rows move may use
  a step animation instead of one of them (see Step-by-step figures below).
- **How it works** (SQL lessons; the owner added it because the stage lacked theory): 200–400 words of prose right
  after the picture and before the worked example, in our own words with cafe-sales numbers. In this order: (1) the
  idea in one or two sentences; (2) the mechanism, a numbered list of what SQL does to the rows in logical order
  (`FROM` first for a query with several clauses), tied to the picture with "in the picture above…" without depending
  on it; (3) the rules, stated precisely, one bullet each (`GROUP BY`: every selected column is a key or inside an
  aggregate, and `WHERE` and `HAVING` run at different moments; windows: the row count never changes, and the default
  frame; joins: a join keeps every pair of rows where `ON` is true, `NULL` never equals anything, and a repeated key
  multiplies rows); (4) one **Excel** sentence that names the E-lesson by code and title; (5) one **common
  misconception** and why it is wrong. A tiny snippet only if it clarifies a rule; no new exercises. List every predict
  and spot-the-flaw prompt in the lesson first: no sentence of the section may state a prompt's answer or reuse its
  query. Define each term on first use.
  Theory lives here only: the prose after the picture and the later sections must not restate it (the Excel mapping
  table may stay at the end of the section). **Sourcing:** each rule rests on a sentence in a page you opened (the
  DuckDB 2.0 docs, the engine the lesson runs), written in your own words; add the page to `sources` only if a claim of
  the section sits there. A rule the docs do not state is shown by a result you ran, or goes in `TODO(owner)`, and the
  report says which. Recompute every number with DuckDB 2.0.0. Never copy or closely paraphrase another teaching site's
  text, examples or diagrams. Count the section in the lesson's body words and raise `duration` by the length rule.
- **Worked example:** numbered steps, each with *why*; the last step verifies (row count, reconciled total, a
  second method); then a self-explanation `<details>`.
- **Finish it:** `<Exercise>` 1, faded: first steps given, learner finishes.
- **On your own:** `<Exercise>` 2, blank start on messy-by-design data; the learner writes the expected output in
  words (framing line) before working.
- **Check yourself:** one closed-book recall `<details>`, `<Exercise>` 3 spot-the-flaw (a plausible wrong
  solution), then "Can you do it?" (a testable ability statement) and the named pattern in one sentence.
- Every exercise: hint `<details>`, half-solution `<details>`, then exactly one `<Solution>`.
- One new idea per lesson. Keep within `duration`; say so in the report if it cannot fit.

## Pilot shape (interleaved)

**Status: pilot, waiting for the owner to approve or reject it.** Written for the owner's direction: "interleave theory
and exercises so the learner can study easily, balancing knowledge and practice; no dry, wordy prose; animations must be
beautiful and memorable; always stand where a learner who knows nothing about data analysis stands." Piloted on S8
(`group-by-having`), S14 (`window-functions`) and S19 (`inner-join`). Until the owner decides, every other lesson keeps
the shape above, and a lesson uses one shape or the other, never a mix. Everything outside "Shape" and "How it works"
above (rules, figures, files, done means) applies unchanged.

**Headings, in this order** (`##` unless marked): The question · Warm-up · The big idea · Learn by doing (with 3 to 5
`###` units, numbered) · Remember · Finish it · On your own · Check yourself. The `How it works` and `The picture`
headings are gone: their content moves as below.

- **The question:** as above, in one or two human sentences, with the data visible. No "by the end you will" paragraph.
- **Warm-up:** at most 2 recall prompts (use earlier lessons' objectives), at least one that produces something.
- **The big idea:** one plain sentence saying what the tool does to the rows, then the concept animation on its own
  line as an MDX comment marker, `{/* CONCEPT: concept-name */}`, which the lead replaces with the generated markup.
  No other text between the sentence and the animation.
  After changing a spec or `step-animation.mjs`, run `node scripts/refresh-concept-figures.mjs` (`--check` to test) to re-paste every concept figure.
- **Learn by doing:** one line of orientation, then the units. A unit is about 80 to 200 words of prose plus its
  queries and carries exactly one rule:
  1. **Idea:** the rule in one to three short sentences, plain words, with one Excel or cafe comparison only when it
     helps. Define every new word in the sentence that uses it (row, column, key, aggregate, grain, NULL...); a lesson
     never uses a term before it has been explained. Idea sentences never state the answer to a Predict in the unit.
  2. **Try it:** the worked-example query in a `<RunSQL>` block, introduced with "**Try it:**" (no step numbers: the
     SQL stage has no notebook to stay in step with, D43).
  3. **Predict:** keep the existing prompts, before the query.
  4. **Result:** the Expected line (columns only after a "how many rows?" prompt), then the data **stepper** if this unit
     is the one it illustrates (D41: byte for byte from the generator), and any static figure that the unit's rule
     explains.
  5. **Why:** one line. A unit may use a self-explanation `<details>` instead of the line.
  The last unit is a short **check** (reconcile the result with a second route or an Excel total). Theory is never
  stated twice: a rule appears in the unit where it is first needed and nowhere else except the Remember box. The
  `Excel` mapping table is dropped: each unit carries its own Excel line.
- **Remember:** an `<Aside type="tip" title="Remember">` after the last unit with 3 to 5 one-line rules and one bold
  **Common trap:** line (the former misconception, still correct, with the failing result named). A summary, so very
  short; no new rule appears in it.
- **Practice:** Finish it, On your own and Check yourself unchanged; only wording fixes the new shape needs (a hint
  that said "step 4" now says "unit 2").
- **Voice:** speak to "you"; short sentences; paragraphs of at most 3 sentences; one idea per paragraph; the cafe
  example first, the general rule second; no "it is important to note", no stacked definitions, no jokes or fluff. One
  word for one thing: where a figure says "group" (or "partition"), the text says the same.
- **Length:** the same limit, about 100 body words per minute of `duration`. The pilot should read lighter, so cut every
  word a unit does not need; keep every rule, source, number and Predict.
- **Sourcing and numbers:** unchanged. Each rule keeps the doc sentence it rested on; recompute every number with DuckDB.

## Rules the reviews kept catching

- **Exercises never overwrite** the worked example's sheet, cells or output. Each exercise has its own pre-built
  sheet (`calc_ex1`, `calc_ex2`, `calc_ex3`). Anything the text calls "done for you"
  must exist in the file.
- **Raw data is never edited**, not in examples and not in solutions (`raw_*` sheets, source CSVs).
- **Summary cells sit where a filter cannot hide them** (above the data or on another sheet).
- **Every number is computed by a script you ran** from `datasets/cafe-sales/v1/` or the lesson file. State which
  rows count (for example completed orders only vs all 1,800, including the canceled \$5.00 order) and say whether a
  figure includes the extra-zero line (order 2075).
- **Every tool claim is checked** in official docs you opened (Microsoft Support or Learn, Google Docs Editors Help,
  DuckDB, pandas). Show Excel and Google Sheets side by side; when a feature exists in only one, say so plainly.
  Give the Mac shortcut wherever you give a Windows one.
- **Unverified behavior goes in a `TODO(owner)` paragraph, never in learner text.** Learner text has no first
  person, no "I could not find", and no process notes like "checked as SQL".
- **Quotes are exact**, or they are paraphrases without quote marks.
- **SVG pictures match the real data** (codes, store numbers, results).

## Runnable SQL (SPEC D42)

In every SQL lesson, a query the learner should run is a `<RunSQL query={`...`} />` (no import; SPEC §6), not a fenced block:
every **Try it** query and every exercise's starter query (the given first steps, or the broken query of a spot-the-flaw).
An exercise with a blank start gets a `<RunSQL query={`-- Write your query here, then press Run.`} />` before its hint.
Hints, half-solutions and solutions stay fenced blocks. Rules:

- The query must run on its own against the five cafe-sales tables (the page starts each visit fresh); a block that needs a
  table or view from an earlier block says so in the sentence before it. Never use `/* as in step 1 */` fragments in a
  `RunSQL`: give the full query, or keep a plain fenced block.
- No backtick, backslash or `${` inside the query (it is a template string); the build stops the lesson if the query is empty.
- Keep the **Expected:** line next to it: the output box shows "n rows × m columns" above the result, so the learner can check it.
- The block is two boxes (editor, output) with a Tables button listing the five tables; in the text say "the editor" and "the output",
  never "on the left / on the right". A blank starter (`-- Write your query here`) is fine for an open exercise.
- The block loads itself in the background; never tell learners to wait for it or mention an engine, a download or DuckDB.
- Results come from DuckDB 1.4.3 in the browser, and the numbers in the lesson from DuckDB 2.0.0. Where a query has no
  `ORDER BY`, row order can differ (set operations, for example); say "in any order" or add the `ORDER BY`.
- The SQL stage has no notebooks and no Colab link (D43): every query runs in the page. Never write `con.sql`, `.show()`,
  `%pip`, "notebook" or "Colab" in a SQL lesson, and never add a `notebook` field or `<OpenInColab />`.

## Step-by-step figures (SPEC D41)

Pictures and animations are **original work**, drawn from our own cafe-sales rows and our design tokens; external
visuals (other sites' GIFs, posters, diagrams) may inspire the concept only. Never download, trace or recreate one,
and never copy its layout, colors, characters, captions or sample tables.

- **When:** only where the idea is rows moving or merging: aggregation and GROUP BY, joins, window functions, CTE
  pipelines, set operations, recursion. Not for syntax, formulas or anything a still picture shows as well. At most one
  per lesson, in "The picture", in place of one of its two SVGs.
- **What the learner gets:** a stepper, not an animation. Back, buttons 1 to N and Next (native radios, no JavaScript);
  step 1 is the default; each step changes one thing with a 0.45 s fade; all captions stay listed under the figure, the
  current one marked. Print and reduced motion: the final frame plus all captions (the radios stay hidden in print).
- **How:** write a spec in `scripts/animations/<lesson-id>.mjs` (copy `sql-inner-join.mjs`): `steps` is
  `[{ role, clause, text, predict? }]` (at most 6), then draw the FINAL frame with `row`, `text`, `rect`, `path` and give
  each part that changes an effect: `in: n` (appears at step n), `out: n` (dimmed from n), `hide: n` (gone from n; a
  frame for one step only is `in: n, hide: n+1`). Shade with `tint(role, level)`, outline with `edge(role)`; `row`
  draws the tint under the text. Run `node scripts/make-animation.mjs <name> --stats` and paste the `<figure class="sa">`
  block into the lesson (no blank lines inside it; MDX ends HTML at a blank line). The generator escapes `$` and `*`.
  Rerun and re-paste when the data changes.
- **Data:** rows come from the real tables; recompute counts with DuckDB 2.0.0 and say in the spec comment which query
  you ran. A miniature may stand in for the full table; say so on the figure.
- **Captions:** one plain sentence per step, starting with its clause badge (`clause`, colored by `role`). Order: input
  (FROM/JOIN), then the clauses in the order the engine applies them. Before a step that reveals a result, the caption
  before it ends with a **Predict:** prompt that does not give the result away. All captions are visible from step 1, so a
  caption names the operation, never a number or name a later step reveals. The `<title>` and `<desc>` describe the final frame.
- **No overlap:** text never overlaps other text at any step or mid-fade; parts only fade in at their own slot, nothing
  slides through other rows. Put a value in the column of the table it describes. Check with Playwright (text boxes at
  each step).
- **Clause colors** (fixed in every lesson, only inside figures; tokens `--c-*` in `src/styles/step-animation.css`; each
  hue is at least 3:1 on pure black and on pure white; color is never the only cue):

  | Role | Clauses | Hue |
  | --- | --- | --- |
  | `src` | FROM, JOIN (input tables) | blue `#0072b2` |
  | `mat` | ON (the match) | violet `#9a6be0` |
  | `flt` | WHERE, HAVING (kept or dropped) | red `#c0392b` |
  | `grp` | GROUP BY (group keys) | green `#00a07a` |
  | `out` | SELECT, aggregates (output) | gold `#ad9100` |
  | `win` | OVER, PARTITION BY | magenta `#d6479a` |
  | `ord` | ORDER BY | gray `#808080` |

  Groups, partitions or keys inside one role are shade steps `k1` to `k4` of that hue (three groups use `k1`, `k2`, `k4`),
  always next to a label (store_id, product_id). Dimmed means dropped and also gets a "dropped" label.

### Live counts and Key idea (SPEC D41)

Optional, in both figure types; a spec without them renders as before. Every concept animation and the three data steppers carry them;
only `concept-cte-kinds` has a Key idea without a strip (it shows three structures, not rows to count). A new figure adds the strip when
each step changes something countable (rows, groups, pairs, rounds, shards, characters), and leaves it out, saying so in the spec
comment, when counting would add nothing.

- **Count strip** (up to 5 counters above the picture): a stepper step lists the counters it sets, `counts: [{ label, value, role? }]`
  (`role` defaults to the step's clause color); a concept animation gives `counters: [{ label, role, values: [[phase, 'text'], ...] }]`.
  A counter shows "—" until its first step; a counter set at the current step is lit (a step of several phases keeps it lit to its end).
  Labels are short (`rows`, `groups`, `after HAVING`, `FROM`, `WHERE`) and values are the rows or items drawn in the picture at that step;
  with 4 or 5 counters keep every label word under about 8 letters (the strip is 64 px per counter at 390 px). A value may be a short
  text (`1 of 3`, `3 × 3`, `n1 − n2`) when the figure is abstract. Align the counter phases with the step boundaries of `phases`: a counter
  that ticks in the phase after its step's last phase shows at the next step, not at the step the caption describes.
  Recompute every number in a data stepper with DuckDB 2.0.0 and note the query in the spec comment.
- **Key idea and What changed** (under the controls, current step only): `key: 'one plain rule'` (a sentence of at most 110 characters, the
  takeaway of that step, not a restated caption) and `changes: [['+', 'column orders'], ['−', '1 row dropped'], ['~', 'rows reordered']]`
  (at most 3 chips of a few words). A concept animation gives them as a third item of each `phases` entry, with the step's `role`:
  `[2, 'caption', { role: 'grp', key: '...', changes: [...] }]`. Once one step has a key idea, every step has one.
- **No spoilers:** a count, key idea or change belongs to the step that shows it; step 1 gives inputs only, and no key idea names the
  result a "Predict:" prompt asks for before the step that shows it.
- **Print and reduced motion:** print shows the final counts and, in a block before the caption list, every step's Key idea and What
  changed, numbered `Step 1 · key idea`, `Step 2 · key idea` by a CSS counter; reduced
  motion shows step 1 and the buttons switch instantly. Check the step frames, the 50 ms samples of a loop (never two counter states or two
  key ideas at once), no scroll on tap, and 390 and 1280 px in light and dark.
- **Size:** the generator writes each counter label once and swaps only the value; the words "Key idea", "Step n" and the spoken
  Added, Removed and Changed come from the stylesheet. Expect about 0.3 to 0.4 KB gzipped per figure for a strip and a panel.
- **Claims:** every sentence in a key idea or chip is checked on DuckDB 2.0.0 or against the spec's evidence comment before it stays, and
  never states what a "Predict:" or "how many" prompt after the figure asks for (for example CASE without ELSE).
- After a change to a generator or spec, re-paste both kinds with `node scripts/refresh-concept-figures.mjs` (`--check` tests that the
  lessons are current; it also re-pastes the data steppers, found by the name of their radios).

## Concept animations (SPEC D41)

The data steppers above serve the exercises and the worked example. A **concept animation** explains the idea itself:
abstract, schematic, looping, like an animated cheat-sheet figure. Owner request, 2026-11-18.

- **Where:** at the top of "How it works", before its prose, one per lesson (the join lessons use the variant of their
  join type). Never in place of the data stepper of "The picture".
- **One metaphor, in plain words:** each animation has one picture the learner can say aloud, written as its title line
  ("Many rows → one answer", "Every row keeps its seat and gets a note", "Keys shake hands", "A CTE is a named scratch table").
  A small step label under it (`tags`) changes with the phase ("1 · rows" → "2 · grouped" → "3 · one row each").
- **Motion where it carries the idea:** rows, keys and tables really slide (`move`, ease-in-out, one phase), not just fade.
  `half: 'a'` or `'b'` makes one part leave in the first half of a phase and the next follow in the second. Rounded chips
  (`chip`), a soft ring where something landed (`pulse: true`), empty dashed seats where a part left (`ghost`). Distances are
  multiples of 10 px.
- **Abstract only:** no cafe-sales values and no real numbers. Rows are plain cells with labels such as Row 1, Col 3, t1,
  t2, A, B, C, x1, Σ. Original drawing, our tokens and clause colors; nothing taken from other sites' diagrams.
- **How:** a spec `scripts/animations/concept-<name>.mjs` that calls `anim({ id, h, loop: { cycle }, title, desc,
  caption })` (cycle 4 to 8 s; copy `concept-aggregate-window.mjs`). The loop is 8 phases. A part has an effect
  `{ in: k, hide: m }` (appears at phase k, gone from phase m; default: stays to the end), an arrow or line `{ in: k, draw: true }`.
  Parts that are always there have no effect. Draw with `chip`, `move`, `tags`, `row`/`grid`, `box`, `badge`, `arrow`, `venn`, `ghost`. Ready animations (paste with the command
  after the name): `concept-group-by` (S8), `concept-aggregate-window` (S14), `concept-cte-kinds`, `concept-join:inner|left|right|full|cross`,
  `concept-join:all` (LEFT, RIGHT, INNER, FULL in turn, for the lesson that compares them) and `concept-logical-order`. Also ready (one per key, marker `{/* CONCEPT: <key> */}`): `concept-query`, `-select-order-limit`, `-where`, `-null`, `-expression`, `-case`, `-aggregate`, `-conditional-agg`, `-text-clean`, `-date-trunc`, `-rank-ties`, `-sliding-window`, `-dedup`, `-keys`, `-fanout`, `-self-join`, `-subquery`, `-set-ops`, `-funnel`, `-cohort`, `-recursive`, `-view`, `-star`, `-ai-check`, `-constraints`, `-transaction`, `-normalize`, `-index`, `-shard` (each with `concept-` in front). The facts each one shows are in its spec's header comment with the DuckDB run that checked them.
  `node scripts/make-animation.mjs concept-join:left --stats` prints the markup for the lesson (variants after a colon).
  About 3 to 5 KB of animation markup (two are about 7 KB) plus about 3 KB of step controls per animation; the CSS is shared.
- **Pause and steps:** autoplay is the default. Under the figure the learner has Pause / Play (a native checkbox, 44 px, WCAG 2.2.2),
  Back, Next and one button per step, "1 2 3 … N" with N = 3 to 6 (a native radio group `[auto, 1..N]`, no JavaScript). Choosing a step
  stops the loop and shows the settled frame at the end of that step, with its label; Back and Next move through the steps, arrow keys
  work, the focus ring is visible, and "▶ Play" returns to autoplay. A numbered list of the step captions sits under the figure with the
  current one marked, and each radio is labeled "Step k of N: caption". Never remove any of it. Everything comes from the generator.
- **Steps and captions:** a spec gives `phases: [[firstPhase, 'caption'], ...]` to `anim`: 3 to 6 steps, the first starts at phase 1, a
  step lasts until the next one starts (a step may cover several phases of the 8). The generator draws the in-figure label ("k · caption")
  and builds the buttons and the caption list from the same words, so never call `tags` for the phase label and never repeat a caption.
  Say what changes at that step, in plain words ("Row 2: false, stopped", "Fewer reach step 3"), not the idea of the whole figure, and
  keep each under about 40 characters. Step k shows the frame at the end of its last phase, so everything that step does must be finished
  by then.
- **Static view:** print shows the final state (everything that stays to the end, arrows drawn), all captions and no controls, so design
  the last phase as the picture you would print. Reduced motion shows step 1, still, and the step buttons switch frames instantly (no
  motion at all). Hold the last phase for about a second: leave it idle.
- **No overlap:** text never over text at any moment. A moving part never crosses a label: put the label where nothing passes, or show it after the part has arrived. Two labels that share a slot get windows that touch without
  overlapping (`{ in: 5, hide: 6 }` then `{ in: 6, hide: 7 }`). Check the frames every 0.1 s in Playwright (390 and 1280 px, light and dark), and sample
  the middle of a phase too, not only its start (a part is still invisible at the instant its phase begins). Then click every step button and
  check that its frame equals the running loop paused at the end of the last phase of that step.
- **Caption:** one short line under the figure (`caption`), in plain words; it is part of the page, not an alt text.

## Python stage (D45, D46): teaching rules

Owner decision, 2026-11-19: adopt every recommendation of research issue #66 §1 as the rules below. They sit on the interleaved
shape above and on the "Files per lesson" bullet for Python. Each rule is checkable by reading the lesson and the notebook; a
reviewer ticks them one by one.

1. **Density and minutes.** A lesson teaches 3 to 4 new concepts, one per numbered unit of Learn by doing, plus at most one last
   Check unit that teaches nothing new. Learn by doing opens with the line "About N minutes, K new ideas: a, b, c." where N is
   the frontmatter `duration` and K the number of concept units. A fifth concept goes to another lesson. The length rule holds
   (about 100 body words per minute).
2. **Predict first, result hidden.** Every concept unit runs Idea (never states the result), Try it, **Predict:**, then the
   result inside `<details><summary>Reveal the result</summary>`, copied from a run of the notebook.
3. **Match, then diverge.** The "You already know this" Aside names one earlier Excel or SQL lesson by code and title and carries
   two bold lines: **Match** (the familiar action, its Python twin and the same number) and **Diverge** (the one place the
   outputs differ). A unit shows the divergence with a run. A twin is the closest tool, not the closest word: VLOOKUP's twin is
   `Series.map`, never `merge`.
4. **Production from a blank cell.** From `dataframe-first-look` on, Exercise 2 starts from an empty cell with only the expected
   result stated, no `None` placeholder. Before that the pre-filled share thins out: placeholders (`answer = None`) in the first
   lessons, a one-line comment starter in the middle, a comment-only cell from `lists-and-loops` on.
5. **Free, collapsed hints and solutions.** Every notebook exercise is followed by a hint cell and a solution cell, each a
   markdown cell holding a `<details>` block, so nothing costs points and nothing shows until opened. The page carries the same
   hint, half-solution and Solution.
6. **One adversarial case per trap.** A trap named in a lesson's Remember box has a check case where the naive code gives a wrong
   answer: `check(..., traps={naive_answer: "message"})`, `check_function(...)` with the boundary value, or `rerun_cell(...)`.
   The notebook comment names the trap, so wrong code cannot pass by luck.
7. **Expected outputs on the page.** Every Try it and every exercise prints its expected output on the lesson page, copied from a
   run (never typed): in the revealed result for units, in the Solution for exercises. A learner can verify with no notebook
   state at all.
8. **Run all from the top** is a named ritual, taught in `first-notebook`: restart the session, run every cell from the first,
   read the last cell. Every notebook's Setup cell says so in one comment and the notebook ends with a scoreboard cell. No cell
   raises on purpose (a lesson that shows an error uses `show_error`), so Run all never stops.
9. **Starter notebook.** `first-notebook` starts with three cells before its Setup: a text cell that names the medium, one
   pre-written arithmetic cell on cafe prices, and a text cell saying the lesson's cells start below.
10. **Pandas lessons, later.** The boolean mask is printed alone before it filters, with `.shape` before and after. Groupby is
    entered through three doors in sequence: PivotTable recall in the Warm-up, split-apply-combine as the big idea, and
    `value_counts()` shown to be a groupby in the first exercise. Every merge uses `validate=` from the first one, with the
    expected row count predicted before the run and `indicator=` where provenance matters.
11. **Data and numbers.** Cafe-sales values only, never foo and bar. Every stated number and output is computed from `datasets/`
    and checked by running the notebook from the top against the local files (solutions injected), with the notebook's own
    data cell reading the release tag. The accented menu names of D46 live in `datasets/cafe-menu-accents/` (frontmatter
    `datasets: [cafe-menu-accents]`), linked to the products by `product_id`, and are read from the first release tag that contains them.
12. **Animations.** D41 applies unchanged: data steppers and autoplay concept animations with Pause are allowed in Python lessons,
    exactly as in the SQL stage (owner, 2026-11-19; the "no autoplay loops" line of issue #66 is superseded).
13. **Sources.** Official pages only (python.org, Colab, jupyter.org, ipython.org, pandas, NumPy; Microsoft Learn or DuckDB for
    an Excel or SQL twin), each opened, with the access date in the title. A Colab screen, menu name or shortcut that no opened
    page states goes in `TODO(owner)` and the report says so.

## Markup

- `.mdx` only when a lesson uses components (`git mv` from `.md`; the slug stays). Components: `Exercise`,
  `Solution`, `Aside`, `OpenInColab`, `OpenInSheets`; no `Term` until glossary pages exist; no imports or scripts.
- Exercise ids: `{lesson-id}-{n}`, permanent.
- Dollar signs: `\$` in prose and tables, `&#36;` inside SVG; `*` inside SVG text: `&#42;`.
- SVG: `<svg viewBox="0 0 360 H" width="360" role="img" aria-labelledby="…">` with `<title>` and `<desc>`,
  `fill="currentColor"`, grid lines by `stroke-opacity`, no `style` attribute, no CSS variables, unique ids per page.
- No links to other lessons' URLs while they are drafts: name them by title.
- American English (gray, color, canceled). Frontmatter: change only `sources`, `datasets` and the body unless the
  brief says otherwise; keep `status: draft`.
- A title too wide for one sidebar line gets a `short_title` of at most 24 (D47; capitals count 1.25, the line holds 26.5;
  prefer words to long runs of capitals): the one-line sidebar name, 2–4 words,
  naming the tool or idea (`Files and tables`, `LAG, LEAD, moving avg`), never a different meaning from the title.

## Files per lesson

- Excel: a workbook module `scripts/lesson_sheets/excel_{id_with_underscores}.py` with `build()` (shared helpers in
  `common.py`, do not edit it), built by `python3 scripts/build-lesson-sheets.py {lesson-id}` into
  `sheets/excel/{lesson-id}.xlsx`; sheets `raw_*`, `calc`, `calc_ex1..3`, `output`. Plus the `TODO(owner)` paragraph
  about the Google Drive `sheet` link, copied from the model lesson.
- Python: a notebook `notebooks/python/{lesson-id}.ipynb` without outputs (the `notebook` field), loading data from the
  release-tag URL in SPEC §7 (now `v0.1.0`, D39); the lesson renames to `.mdx` for `<OpenInColab />`. Colab starts in the
  Python stage (D43). SQL lessons have no notebook. Learners arrive knowing only Excel and SQL (owner, 2026-11-19, D45): `first-notebook`
  opens with a story and no typing (run written cells, change one value, then write a line); every lesson up to `dataframe-first-look` starts with a
  "You already know this" Excel and SQL bridge and meets each new piece of syntax next to its twin; pure-Python lessons stay small, point toward the
  DataFrame and use cafe-sales values, never foo and bar; notebooks start with pre-filled cells and grow blank working cells gradually. The rules of "Python stage (D45, D46): teaching rules" apply to every Python lesson.
- SQL lessons (D40): every worked step and exercise shows its expected result shape under the task, outside the
  `<Solution>` ("Expected: 3 rows, 2 columns"); do not print answers the learner should predict. Keep a test script
  in your report that runs every query on DuckDB against `datasets/cafe-sales/v1/cafe-sales.sql`. Explain only what
  the lesson's prerequisites have not taught yet; name earlier lessons by title and code at first use.
- Length: about 100 body words per minute of `duration` (a 20-minute lesson is at most about 2,200 words with the
  exercises); report the count. Body words: everything after the frontmatter except the `<svg>` blocks, code and the
  `TODO(owner)` paragraph included, split on whitespace.

## Done means

`npm ci` (worktrees start without `node_modules`), `npm run kb`, `npm run check` all pass; each lesson returns 200 on
`npx astro dev`; one commit authored as the owner (`git log -1 --format=%an` prints `johnha912`), no AI attribution.
Report in at most 25 lines: commit, files, key numbers and how they were checked, sources opened, `TODO(owner)`
items, doubts.

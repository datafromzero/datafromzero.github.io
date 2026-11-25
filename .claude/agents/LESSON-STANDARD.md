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
(`group-by-having`), S14 (`window-functions`) and S20 (`inner-join`). Until the owner decides, every other lesson keeps
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
  `concept-join:all` (LEFT, RIGHT, INNER, FULL in turn, for the lesson that compares them) and `concept-logical-order`. Also ready (one per key, marker `{/* CONCEPT: <key> */}`): `concept-query`, `-select-order-limit`, `-where`, `-null`, `-expression`, `-case`, `-aggregate`, `-conditional-agg`, `-text-clean`, `-date-trunc`, `-rank-ties`, `-sliding-window`, `-dedup`, `-keys`, `-fanout`, `-self-join`, `-subquery`, `-set-ops`, `-funnel`, `-cohort`, `-recursive`, `-view`, `-star`, `-link-table`, `-grain-rollup`, `-question-star`, `-ai-check`, `-constraints`, `-transaction`, `-normalize`, `-index`, `-shard` (each with `concept-` in front). The facts each one shows are in its spec's header comment with the DuckDB run that checked them.
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

## Entity-relationship diagrams (crow's foot)

Owner decisions, 2026-11-21: tables joined by lines follow the convention of dbdiagram, DBeaver, Lucidchart and MySQL Workbench (crow's foot,
Information Engineering), and the symbols are the whole cardinality notation, with a verb phrase on every link. Every figure that draws
tables as boxes and joins them by lines (an ER diagram, a star schema, a link table, a normalization split, in a hand-drawn SVG or a
concept animation) follows it. Figures that show row matches (join steppers, shaded-column data grids) or a pipeline of query steps are
not ER diagrams and do not use it.

1. **Row to row.** A link line starts at the parent's primary-key (PK) row and ends at the child's foreign-key (FK) row, at the vertical
   center of each row, on the box edge. It is orthogonal (horizontal and vertical segments only), never crosses a box and never carries an
   arrowhead. Prefer a straight line: put the PK row and the FK row at the same height. A self-reference (`customers.referred_by`) loops out of
   one side of the box from the PK row to the FK row of the same box.
2. **Ends use crow's foot symbols only**, drawn at the box edge where the line meets it, 10 px wide. The only bounds are zero, one and many:

   | Meaning | Symbol (from the box edge) |
   | --- | --- |
   | exactly one | two bars |
   | zero or one | bar, then a circle |
   | one or many | crow's foot, then a bar |
   | zero or many | crow's foot, then a circle |

   **No numbers beside the symbols.** `1`, `0..1`, `1..*` and `0..*` are UML multiplicity, a different notation: it uses plain lines with the
   multiplicity written at each end (OMG UML 2.5.1, 11.5.4), and it appears only in the lesson that teaches reading ER diagrams, in its own
   diagram, never mixed with crow's feet. The symbol beside a table says how many rows of that table go with one row of the table at the
   other end: two bars beside `stores` and a crow's foot beside `orders` read "an order has exactly one store; a store has one or many orders".
3. **A verb phrase on every link**, the name of the relationship (Visio: the name is a verb that briefly describes the association; UML: a
   name string near the middle of the line, not near an end, with a reading triangle). It sits on the middle segment of the line: centered
   above a horizontal one, centered on a vertical one (a halo in the page color lets the line break around it). It is active, lowercase,
   one or two words, at most 14 characters: takes, places, contains, appears in, refers, holds, sells, buys, describes, has, pairs with.
   It reads **from the parent (the PK end) to the child (the FK end)**: "each customer places zero or many orders". The other way it turns
   passive: "each order is placed by zero or one customer". A legend or caption of every figure gives both readings once. When the reading
   direction runs upward or to the left, a small filled triangle stands **beside the label** (never on the line) and points the way the verb
   reads; downward and to the right need none.
4. **Cardinalities come from the data and the constraints**, checked with queries on `datasets/…/v1/` (DuckDB) and reported by count: a
   nullable FK gives a circle and a bar at the parent end (count the NULLs); every parent with at least one child in the data gives a
   bar at the child end, a parent with none gives a circle (count the parents with no child). Cafe-sales, verified: `orders.store_id`,
   `order_items.order_id` and `order_items.product_id` never NULL and never orphan; `orders.customer_id` NULL on 1 of 1,800 orders, 5 of 150
   customers with no order; every order has 1 to 3 lines; 1 of 16 products (16, Pumpkin Spice Latte) has no line; `customers.referred_by`
   NULL on 120 of 150, no orphan, 121 customers referred nobody (a referrer has 1 or 2). In a star schema every dimension to fact link is
   exactly one to zero or many when the fact has an unknown member for a missing key (the core star lesson); where the fact key can be NULL
   (the SQL star: 1 line with no customer) the dimension end is zero or one.
5. **Drawing.** PK and FK markers on the rows; lines and symbols are `currentColor` (a refused or highlighted link may use a clause color in an
   animation); legible in light and dark at 360 px drawn width (the page scales a drawing up to 520 px): text at least 10 px, boxes at most two
   columns, the end stub of a link at least 30 px so the symbol fits, and a verb needs about 5 px a character on its segment (9 px more for
   the triangle), so leave 56 px or more between two columns for `appears in`. A figure whose links would be too short to carry the verb
   moves a verb to a longer segment (`verbAt`) or widens the gap, it never drops the verb. `<svg>` keeps `role="img"`, `<title>` and
   `<desc>`; the `<desc>` spells every link in words, verb and cardinalities ("stores takes orders: each store takes one or many orders and
   each order is taken by exactly one store") and, like any figure `<desc>`, never states the answer to a Predict or exercise that comes
   later. Write `*` as `&#42;` in SVG text.
6. **Tooling.** `scripts/lib/erd.mjs` holds the geometry: `link(points, a, b, { verb })` returns the line, the symbols, the verb and the
   triangle (it throws without a verb, or when the verb does not fit), and `svg(link)` renders them for a hand-drawn figure. In a concept
   animation call `a.link(points, a, b, { verb }, fx)` (an `fx` with `draw: true` draws the line and fades the symbols and the verb in). The
   symbols are named `'1'`, `'0..1'`, `'1..*'` and `'0..*'` in code only; nothing prints them. Change the generator, then run
   `node scripts/refresh-concept-figures.mjs` and revert unrelated rewrites. Look at every changed figure in light and dark at 390 px, and
   at every step of an animation, before it ships.

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

## Data Scientist track (D55): conventions set by batch 1 (DS1 to DS5)

Written 2026-11-24 by the first DS batch. The next batches (DS6 to DS16) read this section and keep it; a change goes into this section in the same PR.

- **One target, one table for the whole track.** The example is a churn model for the budgeting app `app-events`. The *person* is the entity; the *prediction
  moment* is 7 days after signup (the cutoff, a timestamp: signup time plus 7 days, never a calendar date); the *target* is `churned` = 1 when the person has no
  `session_start` and no `add_expense` between the cutoff and 30 days after signup (days 8 to 30); the *decision* is who gets a win-back offer. The *table*
  has one row for each person who signed up from 2026-01-01 to 2026-05-31 (a full 30 days of follow-up before the export): **17,816 people, 9,696 churned
  (54.4%)**. Columns: `user_id`, `signup_date`, `channel`, `platform`, `region`, then the week-1 features `sessions_7d`, `expenses_7d`, `recent_3d` (visits and
  expenses in the last 3 days before the cutoff), `active_days_7d`, `onboarded`, `saw_paywall` (either paywall event name), `bought_plus`, then `churned`.
  Features count only events that are not retry copies, had happened by the cutoff (`event_ts`) and had arrived by it (`received_at`); the label reads the raw
  events after the cutoff. Why churn and not "buys Plus": the core already uses "buys within 14 days of signup" (C19 to C21), and a track that reused it would
  re-teach the core (D55). Quote this definition, never another (SPEC rule: one counting convention per quantity). The README's second natural target
  (a subscription ended) was left for a later lesson if one needs it; it is censored by the end of the data (README, "Base rates").
- **The query is one string.** The table is built by the query of DS3 (`ONE_STATEMENT` in `notebooks/data-scientist/data-scientist-sql-for-modeling-tables.ipynb`).
  Every other notebook of the track pastes the same text as `MODELING_SQL` and runs `table = con.sql(MODELING_SQL).df()`; the chart scripts read it from the DS3
  notebook and stop if it is missing. If the query changes, change all notebooks, rerun the charts and every number. No derived file was added (D57 not used).
- **Notebooks.** `notebooks/data-scientist/{lesson-id}.ipynb` (the id is `data-scientist-...`, as `core-...` for the core), frontmatter `notebook:` with that path, `<OpenInColab />`
  in "Learn by doing". Data from the release tag **`v0.2.0`** (`https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/v0.2.0/datasets/app-events/v1/users.csv`
  and `events.csv`; `subscriptions.csv` where needed), with the `LOCAL = "../../datasets/app-events/v1/"` fallback the core notebooks use, read into DuckDB
  (`pip install duckdb` fallback in the setup cell) and handed to pandas with `.df()`. Skeleton: title and goals, `Setup` (imports, `SEED`, `EXERCISES`, `same`/`check`),
  `Data`, optional given cells (column lists, the split, helper models: "Run this cell as it is"), `Unit k` cells (a Predict-first line and one code cell), the
  three exercises (task, starter or empty cell, check cell, hint, half-solution, solution), `Run all from the top`. Never name a loop variable `label` or `name`
  that a unit uses later (the scoreboard loop reuses `label`). Print Python floats (`float(...)`), not NumPy scalars, inside lists and dicts: NumPy 2 prints
  `np.float64(...)`.
- **Seed and splits.** `SEED = 2026` for every split, resample and model; `random_state=SEED` or `np.random.default_rng(SEED)`. The track's split is
  `train_test_split(X, y, test_size=0.25, random_state=SEED, stratify=y)` on the table (13,362 training, 4,454 test people, 54.4% churners in both); a validation part
  is cut from the training part the same way (10,021 and 3,341); the test part is used once, at the end of a lesson that tunes. Exercises use seed 5 with an 80/20
  split and seeds 100 to 119 for "twenty other splits". Check a headline seed against about 20 other seeds before printing it (DS2: 0.690 against a median of 0.691).
- **Reporting numbers.** Chances, ROC AUC, odds ratios and accuracy as proportions to 3 decimals (accuracy may also be "63.2 of 100"); money to the dollar (to the cent
  only for a price); shares of people as percent with one decimal. A gain is a difference of the same metric, with a **95 percent percentile bootstrap interval of the
  held-out people, both models scored on the same resamples**: 2,000 resamples for a gain on one split (3 decimals), 300 refits for coefficients (2 decimals in prose), 300
  resamples for a threshold. Print the seed beside any resampled number and say that its last digit can move on another NumPy. Cross-validation reports the mean and the
  range of the folds, never mean plus or minus a standard error (folds are not independent). Every comparison names the baseline beside it: the flat guess
  (`DummyClassifier(strategy="prior")`, ROC AUC 0.5) and the "signup columns only" rung (AUC 0.668), then the model (day-7 logistic regression, AUC 0.690).
- **Costs of the DS4 example** (assumptions, said so in the lesson): an offer costs $2; one leaver in four who gets it comes back, worth $12, so the regret of a wasted
  offer is $2 (`FP`) and of a leaver left without one $1 (`FN`); the rule threshold is 2 / (2 + 1) = 0.667.
- **Charts.** `scripts/charts/ds-batch-N.py` with `--out`, `--paste` and `--check` (N is the batch: ds-batch-1.py for DS1 to DS5, then 2 to 4), built on the `Svg` class of
  `da-batch-1.py` (plain SVG, `currentColor` text, blue, green, purple, ochre in that order, title and desc, centered by the class). Matplotlib and seaborn are not used for the
  pages: their SVG needs a converter that changes with the version, and a chart that must match its lesson byte for byte (`--check`) cannot depend on it. A chart sits at
  `{/* CHART: ds4-odds */}` in the lesson (name = lesson number + a word) and is pasted with `--paste`; a chart repeats the code of the notebook cell it draws and
  asserts the numbers the lesson prints. Look at every chart in light and dark at 390 px before shipping. At most one concept animation per batch (none in batch 1: a still
  fold diagram shows all folds at once, which an animation would not).
- **Lesson shape.** The interleaved Python shape (above), with the units numbered; "About 30 minutes, K new ideas: ..." and a last check unit only when it teaches nothing new.
  A TODO(owner) paragraph at the top (what is invented, what was not checked, the versions of the run). Body words at most about 3,300 for a 30-minute lesson (SQL and
  code count: a unit costs 400 to 550 words). `reviewed` is left at the stub's date until the owner publishes. Prerequisites name the code of what the lesson uses.
  Draft DS lessons are named in italics, never linked.
- **Library versions of batch 1** (every number comes from these; the same notebooks give the same outputs on pandas 2.2.3, NumPy 2.1.3, scikit-learn 1.6.1 and DuckDB 1.4.3):
  Python 3.13, pandas 3.0.5, NumPy 2.5.3, scikit-learn 1.9.1, DuckDB 2.0.0. Do not pass `penalty=` to `LogisticRegression` (deprecated in 1.8); `C=` is fine.
- **Answers already used by DS1 to DS5** (do not reuse them as exercise answers): 835 copies, 1,303 renamed events, 393 events of 40 deleted accounts, 97 exact copies and
  874 subscriptions with several rows, 0.323 (churners with no activity), 10,466 and 12,386 people (first expense within an hour), 46 people touched by the arrival rule, 1,665 churners of May 15 to 31,
  AUC 0.704 (seed 5, 80/20), the 20-seed AUC range 0.684 to 0.701, odds ratios 4.283 and 3.231, the thresholds 0.65 and 0.27, 1,003 and 974 people flagged, ten-fold AUC
  0.692 (0.673 to 0.730), three time folds 0.646, 0.702, 0.726, and 0.653 against 0.668 for a tuned tree. Exercise classes taken: seed shopping, all-column `duplicated`,
  `COUNT(*)` against `COUNT(column)` over NULLs, dropping zero-activity rows, a horizon measured from the cutoff, `class_weight="balanced"` with a cost threshold, tuning on a pilot and reporting the
  winning score. Truth checks used: region has no effect (DS2 Exercise 2, DS4 unit 2), channel sets activity (DS2 unit 4, DS4 unit 2).
- **What the next lessons can lean on:** `tree(depth, leaf)` and `logit()` of DS5 (DS7 opens the tree), the three splits of DS4, `odds_ratios` of DS4 (DS6 regularization:
  compare `C`), the week-1 columns (DS9 feature engineering: encode, scale and impute inside the folds, with the folds of DS5), `region` as the column that adds nothing (DS11 fairness slices:
  platform and channel are the slices with a real gap), the cohort table of DS3 (DS12 forecasting uses daily counts of the events table instead).

### Batch 2 (DS6 to DS10): additions

Written 2026-11-24 by the second DS batch; the later batches keep these on top of the section above.

- **The honest story, told plainly.** On this table no model beats the day-7 logistic model: five-fold CV means 0.688 to 0.692 (the range of the five models' means, never of one model's folds) for logistic (0.692), ridge and lasso (0.692), tree (0.688), forest
  (0.691), boosted (0.692 at best), and on the 4,454 test people 0.690 (logistic), 0.690 (ridge), 0.689 (lasso), 0.688 (forest, boosted), 0.684 (tuned tree). Every model lesson ends in a short
  last unit that scores the new model once on the test part beside the day-7 model, each gain with the paired 95 percent interval of 2,000 resamples (`auc_gain`, a given cell, seed 2026).
  Say "ties" when the interval includes 0, and keep the track's one story: the columns, not the algorithm, set the ceiling. A lesson never hides a null result.
- **Test part.** Each tuning lesson scores the track's one test part once, after its own choices, and a later lesson does not tune on it. A real project would keep one final test part for the
  last model only; the lesson TODO says so if a reviewer asks.
- **Demos where the method shows.** On the full 13,362 people regularization, tree depth, learning rate and engineered columns change almost nothing. Show their effect on a pilot sized to it
  (500 people with 60 random columns, DS6), on a column of random numbers (DS7), on a deliberately leaky or wrongly coded column (DS9), or on made-up data with real groups (DS10). When a
  headline pilot or seed is used, check about 20 other seeds (100 to 119) and say where the headline sits (DS6's pilot is at the unfavorable end: medians 0.634, 0.653, 0.661 for no
  penalty, ridge, lasso against 0.609, 0.642, 0.649; the lasso beat no penalty in 20 of 20 pilots, the ridge in 18, the lasso beat the ridge in 14). The 20-seed loop lives in an optional notebook cell, because a number the page quotes must be reproducible from the repository.
- **Version traps found.** `LogisticRegression` takes `l1_ratio=1` from scikit-learn 1.8 and `penalty="l1"` before (in 1.6 `l1_ratio=1` is ignored with a warning and gives a ridge); the notebook
  helper `lasso_args` picks by version. `HistGradientBoostingClassifier` switches early stopping on by itself above 10,000 training rows (the 10,021 fitting people are just above it; DS8 explains the switch in Exercise 3's Solution, never in a unit).
  `TargetEncoder`'s `random_state` and `shuffle` are deprecated in 1.9 (removed in 1.11) and its seeding moves to `cv`, so it is described and not run (a small `GroupShare` transformer stands in). Print `n_iter_` whenever a default matters.
- **Charts read the notebooks.** `scripts/charts/ds-batch-2.py` runs each lesson's own notebook cells up to "Finish it" and draws from the variables they leave, then asserts the printed
  numbers; it takes about ten minutes. Units that a chart draws keep the data in a named variable (`stages`, `cv_table`, `built_in_by`, `ruler_rows`).
- **Answers already used by DS6 to DS10** (do not reuse): [0.03, 0.700] (lasso C on the validation part), [0.585, 0.636] (250-person pilot), 0.553 (platform alone), [0.687, 0.691, 0.690]
  (`max_features` 1, 4, 19), [877, 0.835] (the purest depth-3 leaf), 0.077 against 0.020 (activity columns shuffled together, one at a time), [0.701, 0.694, 0.682] (2, 8, 31 leaves after 300
  trees), [0.03, 0.691] (learning rate on folds), 0.681 (5,000-person pilot with early stopping), 3,336 (people with no ratio), [1,314, 0.278] (five segments), 0.175 (two segments' churn gap).
  Exercise classes taken: choosing C on one validation part, more columns than people, "a lasso zero means no signal", `max_features`, reading a leaf, one-at-a-time against grouped
  permutation, the silent early-stopping default, a flag made after the fill, the outcome among the clustering columns. Truth checks used: platform's signal travels through the channel
  (DS6), a continuum has no groups (DS10), a random column beats real ones in built-in importance (DS7).

### Batch 3 (DS11 to DS14): notes added by the third DS batch

- **Written-for-the-lesson illustrations.** A lesson that grades AI output (DS14) runs no model. An assistant answer or a column of classifier labels is written for the lesson, shown in an Aside "written for this lesson, in the style of an
  assistant" and said so again in the notebook and the `TODO(owner)` paragraph; a number computed from it (an accuracy, a recall) describes the illustration, and the lesson says that it says nothing about any real model. A text set
  that the datasets do not have (DS14's 60 cancellation notes, labeled with the five `cancel_reason` values) is written in the notebook and named as written.
- **Token cost.** Tokens are estimated at 4 characters each (OpenAI help page, opened and dated); a price is the row of a vendor's pricing page with the page's date in the source title, and the lesson tells the reader to recheck it. Say that
  the real count is the usage an API returns, and that a newer tokenizer may give more tokens for the same text (the Anthropic page says about 30 percent).
- **Experiment table (DS13).** `EXP_SQL` in the DS13 notebook builds `exp`: one row for each of the 15,868 people in an experiment, with channel, platform, region, `converted`, `revenue_14d` (the price of the plan each purchase in the 14 days
  after assignment started with: monthly $7.99, annual $59.99, the README prices) and `hours_to_buy`. Chart scripts read it from that notebook.
- **Forecasting (DS12).** One series: `signup_complete` events counted by UTC day, 181 days, 21,871 signups. A backtest forecasts whole weeks (Monday to Sunday) from the days up to the Sunday night before, from the 9th week (March 2): 17
  forecast weeks. The dataset's expected values (README rules: line 90 to 125, weekday factors, 1.3 on days 1 to 3, the campaign) are a yardstick, never a forecast. The README's holiday dip is in visits, not in signups.
- **Intervals.** A gap between groups or two forecasts: 2,000 resamples of the held-out people (DS11) or of whole weeks (DS12), seed 2026; a bootstrap of people for experiments (DS13, 2,000 resamples); a simulated share (power, A/A) is
  printed to two decimals. Avoid scikit-learn arguments newer than 1.6 (`partial_dependence(custom_values=...)` is 1.7): the notebooks must give identical outputs on both library sets.
- **Answers already used by DS11 to DS14** (do not reuse them as exercise answers): permutation losses 0.0977, 0.0246, 0.0554 and 0.0289; the tree's 0.094 and 0.063; recall 0.047 and 0.421 on web and apps, 0.041 and 0.369 at 0.75, and the web and
  app shares 0.071 and 0.434 at 0.6; seasonal naive 20.92, model 18.62, flat 22.68, 20.25, 18.38, 22.86 and 12.26 for the month-start weeks; sizes 7,047, 11,010 and 50,342 per arm, simulated power 0.72 and 0.34; bootstrap intervals for `paywall_v2`
  (+$0.627, +20.7 percent) and the adjusted onboarding gap -0.011; platform p-values 0.014 and 0.477 for `signup_flow_v2`; classifier accuracy 0.833, recalls 0.857, 0.905, 0.8, 0.778 and 0.667, costs $0.0043, $0.0852 and $0.256.

### Batch 4 (DS15 and DS16): simulation and capstone

- **Shape.** The two lessons copy the Data Analyst simulation and capstone (`take-home-simulation`, `portfolio-case-study`), not the interleaved Python shape: The question, Warm-up, How this simulation (capstone) works, The brief, a rubric of eight items scored 2, 1 or 0 (16 in all; 13 ready, 8 to 12 redo, under 8 rebuild), then a Reference answer in one `<details>`. The clock covers the learner's work, not the reading, so the 100 words per minute rule does not apply. Words so far: DA simulation 3,622 for 90 minutes, DA capstone 2,710 for 180, DS15 3,286 for 90 (its defense page 296 words, limit 300), DS16 3,849 for 180 (the reference's code and printed output count; show a cell only when the lesson explains it, and cite the other cells' output from the notebook).
- **Notebook layout.** Given cells (setup, data, helpers: "Run this cell as it is"), then "Your work" with text cells for each deliverable and empty code cells, then "Reference answer: open only after you finish". The reference cells read only the given cells, so a starter run and a solved run print the same thing. No exercises and no check cells: the rubric is the check.
- **The rubric names no trap.** Items are worded generically, with counts where a count settles them ("every column has a line saying when it was known"); the cases, numbers and answers sit inside the reference. A learner reads the rubric before the reference.
- **DS15 take-home.** A new target on purpose, so no answer of DS1 to DS14 repeats: a person's first Plus subscription, monthly plan, started 2026-01-01 to 2026-05-31, `canceled` = 1 when it ended within 30 days of starting (the first renewal; in the data the cancels of a first renewal end on days 25 to 30). **1,792 people, 348 canceled (19.4%)**; 668 first subscriptions were annual and 389 monthly ones started in June, both left out. Prediction moment: the purchase time plus 14 days. `TAKE_HOME_SQL` in the DS15 notebook builds the file, with four columns that break the timing rule on purpose: `cancel_reason`, `plus_uses` (all uses up to the export), `plan_now` (the latest saved plan, switched at a later renewal) and `active_events` (all visits and expenses up to the export, which breaks the rule and does not move the score). Split `train_test_split(test_size=0.25, random_state=2026, stratify)`: 1,344 and 448 people, 261 and 87 cancelers; the split comes before the column screen, which runs on the 1,344 training people only (the screen flags and chooses nothing). The reviewer's three questions: is the number real, could it be known in time, what do we do with it.
- **DS16 capstone.** Stakeholder Maya Okafor (invented), decision: the DS4 win-back offer at day 7. The track's table, the DS4 parts (fit 10,021, validation 3,341, test 4,454) and the day-7 model fitted on the fitting part; `value_per_1000` earns, against sending nobody, `TP x (0.25 x $12 - $2) - FP x $2` for every 1,000 people (DS4's cost framing, so its $464 against $544 is $80 rounded and $80.6 unrounded). The honest result: the model's rule at the validation-chosen threshold 0.65 and the rule "offer every paid-social person" tie (value $80.6 and $81.3, difference -$0.7 with interval -6.3 to 4.5; over 20 other splits -7.9 to +5.8, median +0.2, the model rule ahead in 12); the memo recommends a pilot of the paid-social rule, so its numbers are that rule's: 792 leavers and 215 stayers offered, break-even return rate 0.212, -$25 at a return rate of 0.20 (the model rule: 825, 233, 0.214, -$31). The held-out people are "used in this lesson only after every choice", never "used once". The back-test fits on signups before March 2 and scores 13 full weeks; the retraining trigger (gap over 0.05 or weekly AUC under 0.60, two weeks in a row) is the lesson's choice and fires 0 times.
- **Seed check.** DS15's held-out AUC at seed 2026 (0.645) is at the favorable end of 20 other splits (median 0.610, range 0.519 to 0.648); the reference says so and quotes about 0.61. So are the other two numbers its defense page quotes: the share of cancelers in the top fifth (33.7 percent here, median 0.287 over 20 splits, 0.213 to 0.326, so the page says about 29 percent) and the gain over the channel rule (+0.039 here, median +0.021, -0.027 to +0.040, above 0 in 15 of 20). Leave this as a worked example of "every quoted statistic is checked against others, not only the headline".
- **Version traps found.** DuckDB 2.0 has no `relation.fetchone()`: call `con.execute(sql).fetchone()`. `GroupBy.apply(include_groups=False)` needs pandas 2.2 or later, so the slice tables use a loop. The notebooks give identical output on pandas 3.0.5, scikit-learn 1.9.1, DuckDB 2.0.0, NumPy 2.5.3 and on pandas 2.2.3, scikit-learn 1.6.1, DuckDB 1.4.3, NumPy 2.1.3.
- **Charts.** `scripts/charts/ds-batch-4.py` runs the lesson's own notebook with the network off and draws from its variables (about 30 seconds), then asserts the printed numbers.
- **AI log in a DS lesson.** The reference log rows are illustrations "written for this lesson, in the style of an assistant" (as DS14), with a check of the notebook behind each: a name that does not exist in the library (`hasattr`), scaling before the split (0.6898 either way), a rounded saving, an assumption turned into a finding, a platform gap that is a channel gap, a retraining schedule the back-test does not support.
- **Answers already used by DS15 and DS16** (do not reuse): 1,792, 348, 0.618, 0.898, 0.975 (held-out AUC with the honest columns, `plus_uses`, all four late columns), 0.891 and 0.849 (`cancel_reason` and `plus_uses` alone, on the training people), 41 training people with `annual_now`, 0.574, 0.590, 0.570 (cross-validated), 0.605 and 0.645 (rule and model, held out), +0.039, +0.021, 33.7% and 28.7% in the top fifth; 0.65, 1,058, $80.6, $81.3, -$367.3, 0.214 and 0.212, 825 and 233, 792 and 215, -$25, 2,424 leavers, $359, 0.037, 0.636, 0.716 and 0.717 (paired gain +0.001), -7.9 to +5.8, 0.6898.

## Data Engineer track (D55): conventions set by batch 1 (DE1 to DE5)

Written 2026-11-24 by the first DE batch. The next batches (DE6 onward) read this section and keep it; a change goes into this section in the same PR.

- **Where learners work.** One starter repository for the whole track, `https://github.com/datafromzero/de-pipeline-starter` (D48: the learner's laptop first, with VS Code, Git and uv; GitHub Codespaces as the fallback). It is built in this repo at `starters/de-pipeline/` and published by the owner (the repository exists; `starters/README.md` has the steps for pushing new tags); a DE lesson's `TODO(owner)` says which tags it needs pushed. Terminal 1 runs the mock API (`uv run python mock_api.py`) and stays open; terminal 2 is where the learner types; Windows uses Git Bash (C22). Commands are `uv run ...`, never `make`, because Git Bash has no `make`. Laptop and codespace run the same commands; the differences are: a codespace is created from the repository page instead of cloned, a stopped codespace is deleted after 30 days (push your work), and the Airflow lesson (DE7) needs Linux: the Airflow page (opened) says Airflow runs on POSIX-compliant systems and on Windows via WSL2 or Linux containers, so Windows learners use a codespace or WSL2 there (the README says so too). Owner checks in real GitHub Codespaces, 2026-11-24 and 25: `uv run pytest -q` passed at DE5 (16 passed, 1 skipped); at DE14 pytest gave 22 passed and 1 skipped, `ci/dbt_ci.sh` ended with PASS=46 and `airflow dags test` ended in state success; at DE18 Java 21 was present (the dev container feature), pytest passed, `scripts/clean_clone_check.sh` ended with PASS=46 and exit 0, `fetch_app_events` read 13,041,745 bytes and 177,379 events, and the Spark job `events_by_name` ran 4 jobs with matching counts. So Codespaces is verified for the whole main path; Windows, macOS and WSL2 are not.
- **The dataset and the seed.** `cafe-sales` (frontmatter `datasets: [cafe-sales]`; the stubs said `app-events`). The mock API serves its 3,287 order lines of 1,800 orders from copies of the v1 files in the starter (`mock_api_data/`; `source_files/` holds `products.csv` and `stores.csv`, landed like a partner's files). It adds `updated_at` (order time plus 5 minutes), 12 corrected lines (the extra-zero line 6952, quantity 20 corrected to 2, and 11 chosen by the seed), and an invented `channel` on versions updated from 2026-05-01. Faults are pure functions of **seed 2026** (the DS convention): pages with a 429 (`Retry-After: 1`) or a 500, a second failure with chance 0.3, a repeated record, a column added partway. Numbers quoted for seed 2026: a full pull is 33 pages, 3,288 records, 3,287 lines; 5 failed requests on pages 4 (429), 15 (500 twice) and 21 (429 twice), waits of 4.5 seconds; line 6000 ends page 10 and starts page 11; `channel` from page 20 (page 20 holds both kinds); `until` May 2 23:59:59 gives 1,989 lines, `until` March 31 23:59:59 gives 1,308. A lesson says "seed 2026" beside every fault number. **Seed check:** `starters/de-pipeline/scripts/seed_check.py` prints seeds 100 to 119 beside 2026 (seed 2026 has 2 pages with a 429, 1 with a 500 and 5 failed requests; the 20 others have medians 4, 1.5 and 6.5, and the repeated record on pages 8 to 25); the lessons say that the faults belong to the seed and not to the API. The README of the starter is the API's contract; a change to the API changes the README, `tests/test_mock_api.py` and every number above.
- **Terminal commands and their output.** A command the learner runs is a `bash` fence (no `$`); its output is a `console` fence (`$ command` line, then the output) inside the `<details>` of the Predict, copied from a run of the command in a clean clone of the starter at the lesson's tag (`make_history.py` builds it; run `uv sync` first so no install lines appear, set `NO_COLOR=1`). Setup commands without a Predict show their expected output outside a reveal. Where a line holds a path of the learner's computer or a memory address, shorten it to `...` and say so under the block; never retype or tidy anything else. Timings are "on one run here": a time is the median of 7 runs and a ratio is quoted with the runs it came from (for example 29, 29 and 32); that the ratio belongs to the data size and the machine is said in the solution of the exercise that tests it, never in the unit. Pytest runs use `-q --tb=short`. Every exercise solution was run, and its output is shown from that run.
- **Files and checkpoints.** Tags `de-NN-start` and `de-NN-done` (`de-NN-start` is the commit of `de-(NN-1)-done`; `de-01-start` is the starter on first clone). Because the folder cannot carry Git history, `starters/de-pipeline-checkpoints/de-0N-done/` holds only the files lesson N saves or replaces, and `make_history.py TARGET` builds the repository with one commit and the tags for each lesson (it needs `LESSONS` raised for each new batch). The lesson says "To catch up, run `git checkout de-NN-start`". A block that says "Save as" equals the whole file; a block that says "replace X" is a contiguous piece of the file at `de-NN-done`; a **given file** (a measuring script, a tested helper) is fetched with `git show de-NN-done:path > path`, and the lesson shows only the lines it explains. `python3 starters/de-pipeline-checkpoints/check_lessons.py` looks up every `python` and `markdown` block of the lessons in the checkpoint files and fails on one outside an exercise that matches none (exercise code, half-solutions and flawed code are only listed); it also checks that every file a `bash` block names (`git show de-NN-done:PATH`, `python -m pipeline.NAME`, `scripts/NAME.py`) exists. Exercise code goes to `exercises/` and never edits a file that a later checkpoint replaces; an exercise that must not touch the learner's work sets `DATA_DIR` to a folder of its own (`config.py` reads it). The tests of every tag pass on a clean clone (`uv run pytest -q`; the one test that needs landed data skips without it).
- **Lesson shape and size.** The interleaved Python shape with numbered units (Idea, Try it, **Predict:**, result in `<details>`, Why), "About N minutes, K new ideas: ..." and a `TODO(owner)` paragraph that names the versions of the run, what was not run (Windows, macOS, Codespaces), and every stub change. A draft DE lesson is named in italics by title and code and never linked (SPEC D18); once the track is published (2026-11-25) every DE lesson is linked as `[*Title*](/data-engineer/slug/) (DE7)`, like core, Python and SQL lessons. Body words (everything except `<svg>` blocks; code, output and the TODO paragraph counted) for batch 1: DE1 3,342 for 35 minutes, DE2 3,249 for 30, DE3 2,663 for 25, DE4 3,213 for 30, DE5 3,841 for 35 (after the review fixes). A lesson that shows the files it saves runs a little over 100 words a minute; the limit is the DS one, about 110 words a minute (a 30-minute lesson at most about 3,300). Sources are pages opened and dated; a vendor price page that cannot be read is not used (the BigQuery pricing page is a script-built page that returned no text, so DE1 prices batch against stream in hours alive, and no vendor price appears).
- **The AI segment (DE5).** An assistant's answer is written for the lesson and labeled so: an Aside "written for this lesson, in the style of an assistant", the request in italics, the code in files whose first line says "Written for the lesson, in the style of an assistant's answer. Not produced by a model." No model is run (as DS14 and C38). The learner judges it with their own tests, run against it without touching their code (`pytest --candidate FILE`, a root `conftest.py` option: an option in `tests/conftest.py` is not seen unless `tests` is named), and logs the verdict in the C38 table `answer | checks run | verdict | reason`. The segment teaches the limit as well: both answers pass a count on the real pull, only a three-row test with a corrected line rejects one, and Exercise 3 shows a function that passes every test because no test varies its arguments.
- **Spot-the-flaw exercises (review of batch 1).** An exercise flaw must not be a rule that a unit's Idea, Why, Remember or Common-trap line already states, and an Idea must not state the answer of the Predict under it (move it into the Why after the reveal). After drafting, read every Remember and Common-trap line against the three exercise flaws, and every Idea against its Predict; a neutral line ("count the records against an expectation after every landing") replaces a trap line that is an exercise's flaw, and the flaw's explanation goes in that exercise's Solution.
- **Charts.** None in batch 1. A DE chart, if one is needed, is drawn by `scripts/charts/de-batch-N.py` on the `Svg` class of `da-batch-1.py` with `--out`, `--paste` and `--check` as for DS, at most two to a lesson.
- **Versions of batch 1.** Python 3.13.18 (`.python-version` 3.13, `requires-python >= 3.11`), uv 0.11.32, DuckDB 2.0.0, requests 2.34.2, pytest 9.2.0, all exact in `pyproject.toml` and `uv.lock` (DuckDB 2.0.1 was out; the track keeps 2.0.0, the engine of the SQL stage and DS). DuckDB 2.0 traps found: `con.execute(...).fetchone()` on an aggregate leaves an unfinished result and the next call on the connection fails, so use `fetchall()[0]`; `read_json(columns=...)` drops a field that the list does not name, without an error; `COPY ... PARTITION_BY` takes columns, not expressions; the plan line `Scanning Files: a/b` of `EXPLAIN ANALYZE` appears only for reads of several files; `INSERT ... ON CONFLICT` with the same key twice in one statement applies one update and the winner is not guaranteed, so staging keeps one row for each key first.
- **Answers already used by DE1 to DE5** (do not reuse them as exercise answers): 148 units on page 1 and 25,736 bytes, 4 / 9 / 19 orders a day and 5 in an hour, 720 and 2.5 hours alive; 33 pages, 3,288 records, line 6000, `channel` on page 20, fingerprint 423af966d628, `7e2d8b367d90` (products.csv), 300 records after a quiet stop; 874,526, 274,462 and 62,362 bytes, 78,384 and 485,976 bytes, 1/6 and 31/181 files, (3, 68385), the counts 3, 3, 2, 15 and 1,800, ratios 16 to 28 and 43 to 48; 1,989, 1,298, 1 updated, 6 unchanged, quantities 3,105 and 5,155, fingerprints baceae31, 8c3ca150 and 62d4f04d, 1,308 and 1,979, 454 / 395 / 459 / 632 / 703 / 644 lines and 3 / 1 / 0 / 1 / 3 / 4 corrected for January to June; 17 tests. Exercise classes taken: a second consumer sketch and a weekly-batch sketch, a filter applied before landing in raw, land a file, a vanished field, an error taken for the end of the data, partition by store, counting partition values, extrapolating a benchmark, another road to the same table, corrected lines by month, a watermark saved before the load, test-first on a one-line filter, tests that a rule-breaking edit must fail, a function that ignores its arguments. Truth checks used: the repeat across pages 10 and 11, the field of page 20, the corrected line 6952.
- **What the next lessons can lean on.** `pipeline.ingest` (`fetch_page`, `land`, `window_name`, the manifest), `pipeline.stage` (`staged_lines`, `write_staging`: typed Parquet in `data/staging/`), `pipeline.transform.dedupe_latest`, `pipeline.load` (`run`, `connect`, `fingerprint`, `--until`, `--replay`, the table `order_lines` in `data/serving/cafe.duckdb`, `load_state`), the root `conftest.py` and its `--candidate` option, and `docs/pipeline-sketch.md`. DE6 (data quality) puts checks on `order_lines` and the staged files; DE7 (Airflow) wraps `land` and `load.run` in tasks and reads their logs; DE8 (backfills) uses `--until` and `--replay`; the dbt lessons start from `data/staging/*.parquet` and `source_files/`; the cloud lesson loads the same Parquet files.
- **Deep dive 6 to 11 (sessions, servers, figures).** Lesson 7 was split in two by the owner's rule (over about 110 words a minute: two complete lessons, a topic slug each, the next free order): `mvcc-and-row-versions` (255) and `locks-and-mvcc` (260). Several `psql` sessions are driven one command at a time by a script, each started with `PGAPPNAME=<letter>` so `pg_stat_activity` and `pg_locks` name the terminal; a statement that blocks is shown as `(B waits)`, its result after `(B goes on)`, and the lesson says these lines are notes. Trailing spaces and the empty line after each result are dropped, and a tab in a server message becomes eight spaces (markdownlint MD010). The WAL and architecture lessons use a throwaway server (`initdb -D crashlab -A trust`, port 5433, replica on 5434) that needs the PostgreSQL programs on the learner's computer; the Docker route only reads those transcripts. Figures: `scripts/charts/de-deep-dive-2.py` (one per lesson, values copied from the transcripts). Answers used: 0 / 0 / 1 open registers, `40001`, B's count 1 after the lock, xids 1003/1005/1006 and ctids (5,1)/(15,67), 131,072 then 262,144 bytes, `UPDATE 0` by a saved ctid, records 86/64/34 bytes (184), 356 deletes, note 34 after the crash, 1,800 then 0 unlogged rows, replica 355 then 0, March pruning 1 of 6, the 2026-07-01 00:00:00 order 500000, 5 audit rows and 1 statement row, 355 rows moved by `status = status`.

### Batch 2 (DE6 to DE10): additions

Written 2026-11-24 by the second DE batch; the later batches keep these on top of the section above.

- **Checkpoints are append-only.** `make_history.py` gives every commit one author and one date, rebuilds the published hashes of lessons 1 to 5 (`PUBLISHED`) and stops if one differs. A published checkpoint file is never edited; a later checkpoint replaces a whole file (the lesson then shows a piece, or says "given file"). New files by lesson: DE6 (the contract and the checks) `contracts/order_lines.json`, `checks.py`, `scripts/break_data.py`, `break_channel.py`, and DE6b (the gate) `gate.py`, `load.py` (gate wired in), `scripts/quarantined.py`, `tests/test_gate.py`; DE7 `daily.py`, `load.py` (`merge` extracted), `tests/test_daily.py`, `airflow/` (own `pyproject.toml`, `uv.lock`, `env.sh` with the `short` filter, DAG, `examples/de07_bare.py`, DAG tests); DE8 `airflow/read_log.py`, the DAG with `max_active_runs=1`, `scripts/range_fingerprint.py`; DE9 `pyproject.toml` and `uv.lock` with dbt, `dbt/` project, `scripts/dbt_counts.py`; DE10 `dbt/` tests and descriptions, `STAGING_DIR` in `sources.yml`, the `scratch` target, `scripts/break_staging.py`.
- **Given files.** A lesson may fetch a file with `git show de-NN-done:PATH > PATH` and show only the lines it explains (the standard's rule for a given file). Use it for plumbing (reports, setup, lock files, a break-the-data script, a test file whose first test is shown), not for the code a unit teaches. `check_lessons.py` now reads `python`, `markdown`, `sql`, `yaml`, `json` and `toml` blocks, and a `bash` block that equals a file.
- **Airflow setup (the lightest honest one).** Airflow 3.3.2 lives in `airflow/` with its own environment (a path dependency on the starter would tie its lock to the starter's, so `src` is put on `PYTHONPATH` by `env.sh`). `airflow dags test DAG DATE` runs one DAG run in one process with a SQLite database and starts no scheduler: DE7 uses only that. DE8 needs the scheduler, so `airflow standalone` runs in terminal 3 with `DATA_DIR` set to a folder of its own. Output is long, so `env.sh` defines `short` (a `sed` filter); a learner pipes into it, and the lesson shows the command with the pipe. A manual run takes the interval that ends at the date given; a backfill takes the interval that starts at it (the run id names the end); a bare cron string gives an empty interval in Airflow 3 (the Timetables page), so the DAG uses `CronDataIntervalTimetable`. Which runs of a concurrent backfill fail on the DuckDB lock depends on timing: a lesson says "on the run shown" and shows the lock error, which is always the same.
- **dbt setup.** dbt-core 1.12.6, dbt-duckdb 1.11.1, DuckDB 2.0.0, in the main environment (exact pins in `pyproject.toml` and `uv.lock`). Commands run from `dbt/`; the profile `path` is relative to `profiles.yml`, a source's `external_location` to where dbt runs. `flags` in `dbt_project.yml` switch off anonymous usage statistics and colors. A broken copy of the staged data is read through `STAGING_DIR` and built in the `scratch` target, so the learner's own tables are never touched. A `dbt ls` in a lesson uses `--quiet`; `dbt show --inline` prints a small table.
- **Real outputs only.** Timestamps and timings of dbt and Airflow differ on every run; a lesson says "on one run here" and the check against the captured run ignores the clock and the durations. A path of the learner's computer is shortened to `...` and the lesson says so under the block.
- **Answers already used by DE6 to DE10** (do not reuse as exercise answers): 17 checks, 18 checks with a rule of your own, 351 lines updated from June 15 with no channel, store 9 for line 5500, 7 store-days of March 9 to 15 with no line, 1,989 / 1,988 / 1 (the load as of May 2), fingerprint c277fb7c; 19 / 18 / 1 for May 1 and 30, 21 lines for May 2 and May 4; the backfill of May 1 to 5 (107 lines, 172 units, fingerprint 9d0ef5b3), May 6 to 8 (51 lines, 78 units, a02cf0ba), April 10 (22 lines, 34 units, b59ef2a8); 3,287 / 3,286 lines, 453 store-days, $22,625.75 (the API's completed lines, not the cafe-sales files'), 24 category-months, 9 store and payment-method rows; 6 tests on `stg_order_lines`, 30 store-days before an opening date. Exercise classes taken: a contract rule for a column that is empty on purpose, an unknown store, a check at the grain of the file, an arrow missing from a DAG, retries that heal a flaky source, an alert that cannot fire on a file that does not import, the incremental loader used for a backfill, `max_active_runs`, a mart by category, a payment mix, a hard-coded path instead of `source()`, an `accepted_values` test, a rule as a singular test, a failing test fixed by deleting the row.
- **No figures.** As in batch 1: no SVG and no concept animation in DE6 to DE10. Body words (everything but `<svg>`, code and output counted): DE6 about 3,000 for 30 minutes and DE6b about 3,000 for 30 (one lesson of 3,915 after the review fixes, split in two, see above), DE7 about 3,400 for 30, DE8 about 3,300 for 30, DE9 about 3,450 for 35, DE10 about 3,290 for 30.
- **A lesson over its word limit is split into two lessons with their own topic slugs (owner decision, 2026-11-24), rather than cut.** DE6 is now *Data quality checks that fail loudly* (`data-quality-checks`, order 60: the contract and the checks it makes) and DE6b, *Quality gates: stop a run or quarantine a line* (`quality-gates-stop-or-quarantine`, order 65: the gate, the quarantine and the counts); prose calls the second half "DE6b", so the numbers of DE7 onward stay. Each half is a complete lesson with its own Question, units, Predict, Remember and three exercises. Both sit between the checkpoints `de-06-start` and `de-06-done`: the second half says what it needs from the first (`contracts/order_lines.json` and `checks.py`, fetched from `de-06-done`), so no extra tag exists. `check_lessons.py` lists both under checkpoint 6.
- **Not run.** Windows, macOS, WSL2 and Codespaces for DE6 to DE10; the Airflow web interface and the dbt documentation site in a browser; Dagster.

### Batch 3 (DE11 to DE14): additions

Written 2026-11-24 by the third DE batch; the later batches keep these on top of the two sections above.

- **Checkpoints.** `de-11-done` holds both DE11 (*Materializations and incremental models*, order 110) and DE11b (*Jinja and macros*, order 115, split off from the merged stub by the length rule, as DE6 and DE6b); `de-12-done` the physical design (`scripts/sql.py`, `scripts/row_groups.py`, `sql/`), `de-13-done` the star and the snapshot (`scripts/partner_files.py`, `dbt/snapshots/`, `dim_*`, `fct_order_lines`), `de-14-done` CI (`ci/dbt_ci.sh`, `.github/workflows/dbt-ci.yml`, the `ci` and `ci_defer` targets, a README with the new layout). `PUBLISHED` in `make_history.py` now also holds the hashes of lessons 6 to 10 (`de-10-done` = `de-11-start` = deb0e4779c60), so a rebuild proves those checkpoints did not change; `check_lessons.py` reads DE1 to DE14. When two lessons share a checkpoint, the first shows only contiguous pieces of a file the second edits (DE11's incremental model is shown as its config block and its filter block; DE11b replaces the amount formula by a macro call).
- **Given files.** `git show de-NN-done:PATH` for plumbing (`scripts/stage_until.py`, `model_report.py`, `sql.py`, `row_groups.py`, `partner_files.py`, `dim_store.sql`, `star.yml`, `sql/physical_design.sql`, `sql/layout.sql`, the CI files) with only the lines the unit teaches printed. A bash command that a console block prints is a line of a bash block of the same lesson (the console is pasted from the capture script, which runs the same text).
- **Numbers and invented data, said so in the lesson.** The incremental model runs on the world as the API showed it at 2026-05-02 23:59:59 (1,989 lines), then the full pull (3,287); the second build selects 1,301 lines (1,298 new, 2 repeats at the newest timestamp, 1 correction of line 6952) and the table grows by 1,298; the mart goes from 276 to 453 rows. The partner's product file has an invented history (`partner_files.py` version 1, 2, 3: Blueberry Muffin bakery to food on 2026-04-15 12:00, Avocado Toast food to bakery on 2026-05-20 09:30); no price changes, so the completed total stays \$22,625.75; as it was the bakery total is \$3,221.75 and as it is now \$2,635.25 (difference \$586.50, 108 lines of the muffin). The table of DE12 unit 3 is the 3,287 real lines copied 300 times (986,100 lines, nine row groups of 122,880). dbt nodes: 20 at `de-10-done`, 23 after DE11, 29 at `de-11-done`, 46 at `de-13-done`.
- **Answers already used by DE11 to DE14** (do not reuse as exercise answers): 22 nodes with an ephemeral `stg_stores`; the cost line of the mart (3,287 read, 453 written); 3,286 completed lines against 3,267 in a mart merged by store-day; a Binder Error after a column is added to an incremental model; canceled amount \$5.00 in store 2 only; 3 / 0 for canceled lines; discount shares 0.4, 0.2 and 0.7 percent; five broken copies against a contract table (four refused, product 99 accepted until a foreign key); 9 of 9 and 2 of 9 row groups (by date), 3 of 9 and 5 of 9 (by store); `UNIQUE (order_id, product_id)`; 17 and 18 snapshot rows, 16 of 17 versions used, 191 lines lost by a rebuilt snapshot (3,096 of 3,287); 20 nodes and then 11 for `state:modified+`; 351 repeated lines when the as-of condition is dropped; "Nothing to do" with exit status 0. Exercise classes taken: an ephemeral model, a cost line, an incremental aggregate, a loop with two expressions, a macro of your own, a macro that ignores its argument, a cross-column CHECK, a sort order for another question, an alternate key read off the data, version 3 of a source, a query from the star, a snapshot dropped to tidy it, a selection for another change, a workflow of your own, a state taken after the edit.
- **Not run.** GitHub Actions (the workflow was written from the pages opened and checked as YAML; every command in it was run), Windows, macOS, Codespaces, BigQuery and Snowflake (their behavior is quoted from the pages opened; no price is used).
- **Length.** Body words for the batch after the review fixes: DE11 3,592 for 35 minutes, DE11b 3,229 for 30, DE12 4,015 for 37 (35 in the stub), DE13 3,503 for 32 (30), DE14 3,434 for 32 (30): the three raised durations keep the lessons under 110 words a minute.

## Data Engineer track (DE15 to DE18): notes added by the fourth DE batch

- **No account needed.** DE15 runs on DuckDB: a row group of 122,880 rows stands in for a warehouse block, `scripts/blocks.py` applies the min-max rule, stops if its block count differs from the engine's plan, and counts logical bytes with BigQuery's type sizes. The BigQuery lines (`bq`, DDL, dry run) were first read from pages and labeled not run; **DE15's BigQuery lines were run once in the BigQuery sandbox on 2026-11-25** (one project, dataset location US, no billing account) and the lesson shows the results, dated, as one observation. The statement stays in the checkpoint file `sql/bigquery_layout.sql` so that `check_lessons.py` compares it; that published file still starts with the old "Not run" comment, so the lesson shows only its four statement lines. Say where the stand-in differs (DuckDB prunes a subquery filter, the dbt page says BigQuery does not) and name what the sandbox page does not say. **A byte count for a warehouse names every column the query references**, in `WHERE`, `JOIN` and `GROUP BY` as well as `SELECT` (`blocks.py` counts only the columns it is given; MISTAKES, 2026-11-25).
- **Spark in its own folder.** `spark/` has its own `pyproject.toml` and `uv.lock` (PySpark 4.3.0, source archive built by uv, Java 17, 21 or 25 needed). Commands end with `2>/dev/null` because Spark logs to the error stream, and the lesson says to remove it when a command prints nothing. The stream is a file source read with `availableNow`, one file for each trigger; its counts (177,220, 177,376 and 177,379 for 1 hour, 1 day and 3 days) repeated across runs.
- **Simulation and capstone.** Shape of DS15 and DS16 (rubric of eight items, 16 points, the reference in one `<details>`). Reference code lives in a checkpoint file (`sql/sql_test_reference.sql`, `sql/owner_questions.sql`, README sections, `scripts/clean_clone_check.sh`) so that every block is compared; a fence of four backticks may hold a README block, and `check_lessons.py` reads it. DE17 3,288 words for 90 minutes, DE18 3,336 for 180; DE15 3,364 for 31 as drafted and 3,632 for 33 after the real sandbox run was added on 2026-11-25 (limit about 110 a minute), DE16 3,246 for 35.
- **Answers already used by DE15 to DE18** (do not reuse): 23,666,400, 5,898,240 and 10,567,606 bytes (15,777,600 and 3,932,160 were the first draft's SELECT-only counts, wrong), 42,402,000 (the 986,100 lines), 167,636 and 306,437 (the mart's five referenced columns and all ten), 50 bytes (the two `stg_stores` columns), 4,407,900 of 34,513,200, 989,380 (the September week); from the sandbox run: 24,117,248, 10,485,760, 20,971,520, 2,366,640, 8,229,072, 8,150,816, 514,317 of 986,100 rows kept; 78,535 and 44.3 percent, 129,597 and 47,782 (platform), 63,453 and 35.8 percent, 177,220, 177,376 and 177,379; 2,849 and 2,905, hour 14 with 9,534, 2,865 and 1,419, 1,307 on June 3, 608 and 2 days 23:52:23; $9,017.75, $4,611.25, $8,996.75, $22,625.75 and the category totals of the star, 606 and 525 lines by the current category.

### Published 2026-11-25 (owner approval, "ok rồi, lên web đi", after reading PDFs of all 31 lessons)

What the `TODO(owner)` paragraphs held, moved here when they were removed from the 31 lessons (published lessons carry none):

- **Status.** DE1 to DE18 (20 lessons, DE6b and DE11b among them) and the deep dive DE20 to DE29 (11 lessons, with `mvcc-and-row-versions` at order 255) are `status: published`, `reviewed: 2026-11-25`. The owner accepted the three slugs added by the length rule (`quality-gates-stop-or-quarantine`, `jinja-and-macros`, `mvcc-and-row-versions`), the raised durations and the prose codes DE6b and DE11b. The sidebar, lesson header and `/start/` show the same codes: `lessonCode` reads a half order as "b" (DE6b, DE11b, DE25b; owner, 2026-11-25).5.
- **Versions run.** Main path: Linux, Python 3.13.18, uv 0.11.32, DuckDB 2.0.0, requests 2.34.2, pytest 9.2.0, dbt-core 1.12.6 with dbt-duckdb 1.11.1 (dbt-core 1.12.7 and dbt 2 release candidates existed; the track stays on 1.12.6), Airflow 3.3.2 (3.4.0 exists, not used), PySpark 4.3.0 with py4j 0.10.9.9 and OpenJDK 21.0.12, actionlint 1.7.12. Deep dive: PostgreSQL 16.15 on Linux (PostgreSQL 19 exists; no run on 17 to 19), DuckDB 2.0.0, SQLite 3.53.1, psycopg 3.3.9, built by `scripts/de-internals/lab.py` (seed 2026). Checkpoint tags `de-01-start` to `de-18-done` are pushed to `de-pipeline-starter`.
- **Not run, said in the lessons where it matters.** Windows, macOS and WSL2 (DE7, DE8, DE16); GitHub Actions itself (DE14: the workflow was checked with actionlint and as YAML, every command in it was run, and the lessons claim nothing about a red check or a required check); Snowflake (DE12, DE18, DE29) and BigQuery beyond DE15's one sandbox run of 2026-11-25 (DE12, DE18, DE29: behavior is quoted from pages opened, no price is used; the run was one project in location US, and the 60-day partition expiry's mechanism is a reading, not a test); Dagster, Kafka and any cluster (DE7, DE16); the Airflow web interface and `dbt docs serve` (DE7, DE8, DE10); the Docker route of the deep-dive lab for the lessons that need `initdb` (DE27, DE28); a second server version. No model was run in any AI segment: the answers are written for the lesson, in the style of an assistant (DE5, DE17, DE18).
- **Readings that rest on no opened page** (the lessons word them as the lesson's own reading or as one run): the 5xx retry rule (DE2); which default strategy dbt-duckdb uses without `incremental_strategy` (DE11, not claimed); whether a view over a table counts for BigQuery's 10 MB minimum (DE15: seen once in the 2026-11-25 sandbox run, a view joined to a table was billed two minimums); the lock-queue order behind a waiting `ALTER TABLE` (DE26), the 32-value jump of a sequence after a crash (DE27) and the `PRUNE` WAL record (DE27); the roles the Docker lab image gives a learner for `pageinspect`, `pg_walinspect` and `session_replication_role` (not checked); the hash join's second batch and the one-over-distinct-count estimate (DE22); the larger cost of the `customer_id` index (DE21, said untested).
- **Stub changes** (the stubs are gone; each lesson's frontmatter is the source of truth): dataset `app-events` became `cafe-sales` in the pipeline lessons; objectives were reworded to what the units run; prerequisites were rewired to the published core, SQL and Python lessons the pages use; unused sources were dropped and the pages opened were added (`/docs/16/` for PostgreSQL). DE15 (cloud warehouse), DE17 (simulation) and DE18 (capstone) are new in D55.
- **Deep dive and the tag.** The first lessons tell learners to fetch `scripts/de-internals/lab.py` and `storage_shapes.py` from the tag `de-internals-v1` of the site repository. The owner creates that tag on `main` after the merge (Releases, new tag); it must point at a commit whose `scripts/de-internals/` equals the reviewed one, or the checksums the lessons print will not match.
- **Linking.** Draft-time italic mentions were turned into links with codes; two inexact italic titles were corrected to the real titles (DE11 and DE15).

## Markup

- `.mdx` only when a lesson uses components (`git mv` from `.md`; the slug stays). Components: `Exercise`,
  `Solution`, `Aside`, `OpenInColab`, `OpenInSheets`; no `Term` until glossary pages exist; no imports or scripts.
- Exercise ids: `{lesson-id}-{n}`, permanent.
- Dollar signs: a plain `$` in prose is money and stays text (`$3.50`; `\$` also works); inside SVG write `&#36;`; `*` inside SVG text: `&#42;`.
- Math (SPEC D51): inline `$$r = m / n$$` on one line; display math as `$$`, the formula, `$$` on three separate lines (no blank line
  inside; same in `.md` and `.mdx`). Use a formula only next to a words-first explanation, after the idea and a worked number from the
  data; define every symbol in the sentence before or after it; one formula per idea; never in a heading. It renders to MathML at build time
  (no JavaScript), so keep TeX plain: `\frac`, `\sum`, `\sqrt`, subscripts, `\text{…}` for words.
- SVG: `<svg viewBox="0 0 360 H" width="360" role="img" aria-labelledby="…">` with `<title>` and `<desc>`,
  `fill="currentColor"`, grid lines by `stroke-opacity`, no `style` attribute, no CSS variables, unique ids per page.
- No links to other lessons' URLs while they are drafts: name them by title.
- American English (gray, color, canceled). Frontmatter: change only `sources`, `datasets` and the body unless the
  brief says otherwise; keep `status: draft`.
- A title too wide for one sidebar line gets a `short_title` of at most 24 (D47; `check:lessons` sums measured Geist glyph widths, the line holds 185 px;
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

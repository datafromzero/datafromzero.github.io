# #61 Research: Python for data — stage check, SQL bridge traps, and the Colab decision

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/61 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#61](https://github.com/datafromzero/datafromzero.github.io/issues/61) (open), opened 2026-11-19

## Type

Curriculum gap

## Summary

The draft Python stage (25 lessons) was checked against five respected Python-for-data syllabi (Kaggle Learn, freeCodeCamp, Dataquest, McKinney's Python for Data Analysis 3rd ed., pandas Getting Started). Its pandas spine and order are right, but it misses the field's most-taught pandas skill (deriving columns with map/apply/assign, 5 of 5 syllabi), loads only CSV/JSON although its learners arrive from Excel and SQL, carries one pure-Python lesson too many, and has no end-to-end exit artifact. Twelve SQL-to-pandas behaviour traps are named for teaching. Separately, the stage's practice environment is decided: Google Colab, with lesson notebooks stored in the Drive folder "Data From Zero — Colab Notebooks" under the project account (folder: https://drive.google.com/drive/folders/1vWGvs3VEU14gYC_j-cLudnqJmBhYCj6Y).

## Evidence

## Python for Data (Not Python for Developers) — Research Report

**Purpose.** A check of the draft Python stage (25 lessons) against the field, with the gaps filled, so the owner can decide keep / change / add / cut lesson by lesson. The stage sits third in the decided linear path — Excel → SQL (35 lessons) → Python → advanced core → four tracks (Data Analyst, Data Engineer, Data Scientist, ML/AI Engineer) — and its learners arrive knowing spreadsheets, SQL joins, GROUP BY, window functions and CTEs. Scope is the analyst's daily Python: notebooks, files and APIs, pandas, NumPy basics, charts, small functions, reading errors, one runnable script, environments and pip. Out of scope (confirmed in §7): object-oriented design, decorators, generators beyond recognition, async, packaging, web frameworks, testing frameworks, hand-implemented algorithms.

**Method.** Five research lines, all sources opened 2026-11-18: (A) coverage — the draft compared against five respected syllabi (Kaggle Learn Python + Pandas, freeCodeCamp Data Analysis with Python, Dataquest Data Analyst in Python, McKinney's *Python for Data Analysis* 3rd ed., pandas official Getting Started tutorials); (B) the SQL↔pandas bridge, anchored in pandas' own documentation including its *Comparison with SQL* page; (C) newer tools and chart libraries, from official docs plus a named sample of five real job postings; (D) beginner pain points, from official documentation; (E) minimum Python, stage exit and proof points, from Kaggle Learn, freeCodeCamp, LeetCode and CS50P. Working files: `cluster-a-coverage.md` … `cluster-e-minimum-exit.md` in this folder.

**How to read the labels.** Unmarked statements are findings from the named sources. Statements marked **[Recommendation]** are curriculum design choices, not findings. Job-demand numbers come only from the named five-posting sample in §5 and are reported as counts out of 5, never as market percentages; no percentages from different samples are blended anywhere in this report.

**Confidence.** High for the coverage verdicts, the SQL-bridge traps and the NumPy placement (multiple primary sources agree). Medium for job demand: the sample is five postings, named and dated, and is evidence of direction, not of the whole market. One planned source is silent: the Stack Overflow Developer Survey 2025 (over 49,000 respondents) dropped its libraries category after 2024 and reports no figures for pandas, Polars, matplotlib, seaborn or Plotly, so it is used nowhere in the verdicts.

---

## 1. Verdict in one paragraph

The draft's pandas spine is right: its core sequence (select/filter, groupby, merge, missing data, dates, text, reshape) matches the common core of all five syllabi, and its order (small pure-Python block, DataFrame early) matches Kaggle Learn and McKinney. Four fixes matter. First, the single most-taught pandas skill in the field — deriving new columns with `map` / `apply` / `assign` (5 of 5 syllabi) — has no lesson. Second, the draft loads only CSV and JSON, although its learners arrive from Excel and SQL: `read_excel` and `read_sql` are the two most natural bridge lessons in the stage (4 of 5 syllabi teach multi-source loading). Third, the pure-Python block is one lesson heavier than the evidence requires and can compress from eight lessons to six. Fourth, the stage has no end-to-end analysis artifact, which 3 of 5 syllabi include. The draft's three distinctive bets — merge *validation*, notebook-to-script, and ai-assisted-code — are taught by none of the five; §2 keeps all three, deliberately, with the project's own justification rather than borrowed authority.

---

## 2. Recommended lesson list — keep, change, add, cut

Tags: **[Keep]** unchanged · **[Change]** same lesson, named additions or a new frame · **[Add]** new · **[Cut]** removed as a standalone lesson. The list is in teaching order.

### Pure Python — the minimum, compressed

1. `first-notebook` — **[Keep]** The entry every syllabus shares; also the first exposure point for the environment trap (§6, trap 1).
2. `values-and-types` — **[Keep]** Types and conversion are the learner's first defence against dtype surprises later (§6, trap 4).
3. `strings` — **[Keep]** Plain-string methods transfer one-to-one to the pandas `.str` accessor; f-strings carry chart titles and findings text.
4. `conditionals` — **[Keep]** Taught explicitly as the bridge: a boolean mask is SQL's WHERE applied to a whole column.
5. `lists-and-loops` — **[Change]** Absorbs `comprehensions` (one-line form only) and a one-section tuples note (`df.shape` returns one); loops are reframed as "repeat over files and names", never over rows; `while` drops to recognition only.
6. `dicts-and-sets` — **[Change]** Dicts stay at full strength (rename, `map`/`replace` dicts, `agg` dicts, DataFrame-from-dict); sets shrink to a recognition sidebar — pandas verbs (`.unique()`, `.isin()`, `drop_duplicates()`) do the set work, and Kaggle's Python course omits sets entirely and still reaches pandas.
7. `functions-and-modules` — **[Change]** Split in two halves: *calling* literacy (positional and keyword arguments, reading a signature with `help()`) moves up beside lesson 2, because every pandas call depends on it; *defining* small functions stays here, ahead of `apply`.
8. `errors-and-debugging` — **[Keep]** Validated: McKinney and Dataquest are the two syllabi that teach error-reading to beginners, against three that never name it; this lesson also carries the traceback rule (§6, trap 10).

**Net effect [Recommendation]:** the pre-DataFrame block compresses from eight lessons to six. Kaggle Learn reaches pandas with seven pure-Python lessons in total, and freeCodeCamp places its Python block *after* NumPy and pandas — the draft's topics are right, its weight is not.

### Files and NumPy

9. `files-and-tables` — **[Change]** Renamed from `files-csv-json` and extended: CSV and JSON stay, and `read_excel` plus one SQLite query via `read_sql` are added (Gap: 4 of 5 syllabi). This lesson also hosts the DuckDB demo (§5) and the encoding rules (§6, traps 2 and 6).
10. `numpy-vectorization` — **[Keep]** One drill lesson at exactly the scope of §4: arrays, dtype, vectorized arithmetic, boolean masks, `axis`, `np.where`, seeded `default_rng`. No linear algebra.

### pandas core

11. `dataframe-first-look` — **[Change]** Now explicitly carries the summary toolkit — shape, dtypes, `describe`, `value_counts`, `nunique`, spotting duplicates (3 of 5 syllabi teach a named summary lesson; the draft had it only by implication).
12. `pandas-select-and-filter` — **[Change]** Names `sort_values` explicitly (taught by Kaggle and McKinney, named nowhere in the draft) and drills boolean masks as "WHERE for columns".
13. `pandas-derived-columns` — **[Add]** Deriving columns with `assign`, `map`, `apply` and one lambda pattern — the SQL bridge is "a computed column in SELECT, applied to every row at once". The largest single gap in the draft: taught by 5 of 5 syllabi, named by no draft lesson.
14. `pandas-groupby-aggregate` — **[Keep]** Carries two traps from §3: groupby drops NaN keys by default, and `count()` is not `COUNT(*)`.
15. `pandas-merge-and-validate` — **[Keep]** Merging is mainstream (3 of 5), but validation as a named practice is taught by none of the five — a deliberate differentiator, kept and leaned into: `validate=` and `indicator=` become house rules (§3, traps 1 and 6).
16. `pandas-missing-data-and-types` — **[Change]** Names `drop_duplicates` explicitly (freeCodeCamp and McKinney both teach it; no draft lesson did) and carries the pyarrow footnote from §5 — a footnote, not a topic.
17. `pandas-dates-and-resample` — **[Change]** Adds date-range generation and `shift` — `shift` completes the SQL window bridge, being the pandas twin of `LAG` / `LEAD`; time zones stay awareness-only (McKinney's time-series chapter is the breadth benchmark: ranges, shifting, zones, resampling).
18. `pandas-text-cleaning` — **[Change]** Adds a bounded regex block — find/extract one pattern, recognition-plus-extraction level (Dataquest and McKinney teach regex inside text work) — and the diacritics rule from §6, trap 7: normalize text (NFC) before any filter, groupby or merge.
19. `pandas-reshape-wide-long` — **[Change]** Names `pivot_table` explicitly and frames it as "the Excel PivotTable, in code" — the most familiar analysis shape this cohort owns; `crosstab` stays awareness-level (McKinney and the pandas tutorials both name pivot-style reshaping).
20. `pandas-transform-rank-rolling` — **[Keep]** Precedent is mainly McKinney (groupby transform, ranking, moving windows) but real; `rank(method=...)` is taught as the `RANK` / `DENSE_RANK` mapping from §3.

### Charts, web data, workflow, exit

21. `charts-matplotlib` — **[Add by split]** pandas `.plot()` plus matplotlib: figure/axes, the five analyst chart types, titles and labels, subplots, `savefig` to PNG (§5 gives the evidence for matplotlib first).
22. `charts-seaborn` — **[Add by split]** Seaborn as the shortcut layer on top of matplotlib — one-line statistical charts and themes — closing with the Plotly awareness box (§5). The draft's single unnamed "charts" lesson was carrying what Dataquest spreads over three courses.
23. `apis-and-web-data` — **[Change]** Names both halves explicitly so the lesson cannot quietly become APIs only: calling an API (requests, JSON in, DataFrame out) and one HTML-table read (3 of 5 syllabi teach scraping/HTML parsing as a skill distinct from APIs).
24. `environments-and-pip` — **[Keep]** Taught by none of the five as a named lesson — because the hosted-notebook syllabi own the learner's environment and a self-hosted roadmap cannot. Scoped to one workflow: create an environment, install pandas, run a script.
25. `cafe-quarterly-pack` — **[Add]** The stage-exit capstone (§7): one full analysis — load, clean, join, group, reshape, chart, conclude — on the café chain data the learner already knows from the Excel and SQL stages. Taught by 3 of 5 syllabi in some form; missing from the draft, whose last lessons were all workflow.
26. `notebook-to-script` — **[Keep]** Taught by none of the five as a named lesson; kept because it converts the capstone into a rerunnable `.py` script — it stands or falls with lesson 25 existing, and now it stands.
27. `ai-assisted-code` — **[Keep]** The draft's clearest differentiator (0 of 5 syllabi; several lists predate AI coding tools, so the absence is weak evidence either way). It has no syllabus precedent to borrow, so it is designed from the project's own rule, continuous with the SQL stage: AI output is verified against known answers, never trusted.

**Awareness boxes, not lessons [Recommendation]:** Polars gets one "where next" box at the end of the stage; Plotly gets one closing box in lesson 22. Neither gets drills (§5).

### Cut list

- **[Cut]** `comprehensions` as a standalone lesson — folded into lesson 5; only the one-line form survives.
- **[Cut]** Set algebra drills, `while` drills, row-by-row loop processing, hand-parsing CSV with `split(",")`, manual counting/sorting/min-max scans — each is replaced by a named pandas verb in §2; hand-parsing additionally teaches a habit (it breaks on quoted commas) that learners must later unlearn.
- **[Cut — confirmed out of scope]** OOP design and classes, decorators, generators beyond recognition, async, packaging and publishing, web frameworks, type-system depth, testing beyond one assert, algorithm and data-structure implementation. The developer-course contrast is CS50P, whose syllabus runs to unit tests, regular expressions and classes — a different job. Statistics and modelling libraries (statsmodels, scikit-learn) are *not* cut from the roadmap: Dataquest and McKinney both introduce them, but Data From Zero's own sequencing places them in the advanced-core stage after Python, so the Python stage only points forward to them by name.

---

## 3. The SQL bridge — what transfers, and the traps that must be taught

For clean data the translation is close to one-to-one, and pandas' own *Comparison with SQL* page is the anchor: `SELECT` columns → `df[[...]]`; a computed column → `assign(...)`; `WHERE` → a boolean mask (`&` / `|`, never `and` / `or`, each condition in parentheses); `IS NULL` → `isna()` / `notna()`; `GROUP BY` + `COUNT(*)` → `groupby(...).size()`; joins → `merge(..., how=...)` including `cross`; `DISTINCT` → `drop_duplicates()`; `ORDER BY` → `sort_values`; `LIMIT` → `head`; `UNION ALL` → `concat`, `UNION` → `concat` + `drop_duplicates`; window functions split into three pandas families — `rank(method="min")` is `RANK()`, `method="dense"` is `DENSE_RANK()`, `groupby(...).shift(1)` is `LAG`, `cumsum()` / `rolling()` / `expanding()` divide up `SUM() OVER (...)`. Two structural differences have no syntax twin: there is no `HAVING` (aggregate first, then filter the result — or `groupby.filter()` when the original rows are needed back), and there is no `WITH` (a CTE becomes a named intermediate DataFrame — [Recommendation] teach "one named DataFrame per CTE" as a style rule; it also makes each step printable and debuggable).

Everything that breaks in practice breaks around missing values, duplicate keys and the index. These twelve traps are the taught content of the bridge; each is documented in the pandas user guide or API reference (§8):

1. **Missing join keys match each other.** In SQL, NULL keys never join; in `merge`, rows whose key is missing on both sides pair up. Silent extra rows after a merge.
2. **There is no single NULL.** NaN, NaT and `pd.NA` compare three different ways; `== np.nan` finds nothing. Only `isna()` / `notna()` are safe.
3. **A `!=` filter keeps missing rows.** SQL's `<>` drops NULL rows (the comparison is unknown); pandas keeps NaN rows under `!=`. Filters silently include rows the learner meant to exclude.
4. **`groupby` drops missing group keys by default** (`dropna=True`). SQL keeps one NULL group. Grouped totals stop reconciling with the plain total — the most dangerous trap, because the result looks finished.
5. **`value_counts()` hides missing values too**, and `count()` counts non-missing values per column where `size()` counts rows — the `COUNT(col)` vs `COUNT(*)` distinction survives the crossing, under new names.
6. **Join fan-out is silent.** Duplicate keys multiply rows exactly as in SQL, but nothing warns; many-to-many is a Cartesian product. [Recommendation] House rules: `validate=` on every merge that has an expected cardinality, `indicator=` when provenance matters — this is what lesson 15 exists for.
7. **Series arithmetic aligns on the index, not on position.** Two columns from differently ordered frames produce NaN where labels do not match. SQL has no analogue; this is the pandas-native trap (§6, trap 8).
8. **Missing values sort last by default — in both directions.** A descending sort does not bring them first; NaN placement is a pandas choice (`na_position`), not the database's.
9. **One missing value turns an integer column into floats.** IDs and counts come back as `3.0`; joins and displays inherit the surprise (the dtype trap, §6, trap 4).
10. **Overlapping columns are silently renamed `_x` / `_y`.** The merge succeeds and the provenance is gone unless `indicator=` or explicit suffixes are used.
11. **Aggregates skip missing values — and an all-missing sum is 0, not NULL.** A group with no data reports a real-looking zero.
12. **`COUNT(col)` vs `COUNT(*)`** — see trap 5; taught together in the groupby lesson.

---

## 4. NumPy — one lesson for the analyst, the rest deferred

[Recommendation] The analyst minimum is one drill lesson, placed before the first DataFrame (where McKinney puts his Chapter 4 and where the draft already has it): creating arrays (`np.array`, `zeros`, `ones`, `arange`, `linspace`) and reading `.shape` / `.ndim` / `.dtype`; vectorized arithmetic and ufuncs with no loops; boolean masks and counting with `.sum()` on a boolean array — this *is* pandas boolean indexing seen one level down; reductions with `axis=`; `np.where` as the array form of `CASE WHEN`; broadcasting at recognition level (the two friendly cases and the error message, not the general rule); random with a seed the modern way — `rng = np.random.default_rng(42)` — explicitly *not* the legacy `np.random.seed(42)` pattern copied from older tutorials; sorting and `np.unique` at recognition level, since pandas covers both in daily work.

The data-scientist layer is deferred in every named source and is deferred here: matrix product (`@` / `matmul`, and that `*` is element-wise), the `numpy.linalg` toolkit (`solve`, `lstsq`, `eig`, `svd`, `qr` — McKinney lists it as a reference table, not as analyst technique), distribution-level simulation, full broadcasting rules, fancy indexing and array internals. Placement evidence agrees three ways: McKinney teaches NumPy before pandas but closes the chapter at the matrix material; DataCamp's introductory NumPy course runs arrays → mathematics → transformations; and Kaggle Learn offers no NumPy course at all. [Recommendation] In the Python stage, name the DS layer, show one `@` example, and move on; it belongs to the modelling part of the advanced core, where least squares gives it a reason to exist.

---

## 5. Newer tools and chart libraries

**The demand evidence (named sample only).** Five real data-analyst postings, opened 2026-11-18: Nordstrom (Data Analyst, Omnichannel Engagement), Shell (Data Science Analyst), an unnamed consumer-tech company via hirist.tech on Jooble (Data Analyst, Python/SQL), Cross Border Talents for a financial-services client (Data Analyst), and Lazard (Quantitative Data Analyst). Counts in this sample: Python 5 of 5 · pandas 5 of 5 · matplotlib 3 of 5 · seaborn 3 of 5 (always paired with matplotlib, never alone) · Plotly 1 of 5 (as Plotly Dash, a dashboard tool) · Polars 2 of 5 (never as a core requirement — once as an accepted alternative to pandas, once as "familiarity") · DuckDB 2 of 5 (same soft language) · pyarrow 0 of 5.

**Polars — awareness only [Recommendation].** A separate, multithreaded DataFrame library whose own comparison page sells it on performance over medium and large datasets — a problem beginners do not yet have — and whose expression syntax is a second DataFrame language to learn. One "where next" box; no drills, no parallel syntax.

**DuckDB — awareness plus one guided demo [Recommendation].** The exception, because this cohort has already paid for SQL: DuckDB's Python docs show `duckdb.sql(...)` querying pandas DataFrames and files directly (`SELECT ... FROM pandas_df`), so one worked example inside lesson 9 — one GROUP BY over a DataFrame and over the CSV itself, result back with `.df()` — buys the "SQL on anything" trick at near-zero new-syntax cost and reinforces the SQL stage instead of competing with it. No DuckDB drills, no administration.

**pyarrow-backed pandas types — skip as a topic [Recommendation].** pandas' PyArrow guide lists real benefits (NA support for all types, performant IO), but the same official docs warn that `ArrowDtype` "is considered experimental… may change without warning", no posting in the sample asks for it, and a second set of dtype spellings would multiply exactly the dtype surprises of §6, trap 4. One footnote in lesson 16 is enough.

**Charts — matplotlib first, seaborn second, Plotly awareness [Recommendation].** The foundation-teaching syllabi agree: McKinney's Chapter 9 is matplotlib first by design (seaborn and pandas plotting build on it; titles, labels, subplots and saving a figure are matplotlib concepts), and freeCodeCamp teaches matplotlib as the foundation with seaborn restyling. Kaggle Learn's Data Visualization course is the seaborn-first outlier — a short chart-types course that never has to teach customisation or export. The job sample points the same way (matplotlib and seaborn 3 of 5, always together; Plotly 1 of 5, as Dash). The static-images constraint settles Plotly: its own docs describe figures rendered by the plotly.js JavaScript library, with a self-contained interactive HTML export of "5Mb+" — interactivity the lessons cannot display. A Kaleido static export exists but adds a dependency to discard the library's one purpose. Lessons 21–22 therefore drill matplotlib (with pandas `.plot()`) then seaborn, and Plotly gets one closing box: interactive charts and dashboards live there, next to Tableau and Power BI.

---

## 6. The ten beginner traps — and where each is pre-empted

Each item is a documented trap in the official documentation named in §8; "documented" is claimed, frequency is claimed only where the source itself claims it.

| # | Trap | What the beginner sees | Prevention taught | Lesson |
|---|---|---|---|---|
| 1 | pip installs into a different Python than the notebook kernel uses (Jupyter's docs call multiple environments "often the source of reported issues") | `ModuleNotFoundError` for a package they just installed | One environment per project; check the kernel name before installing | `first-notebook`, `environments-and-pip` |
| 2 | Relative paths resolve against the working directory; Windows backslashes are eaten as escape characters | `FileNotFoundError` on a file that visibly exists | Print the working directory; use forward slashes / `pathlib` | `files-and-tables` |
| 3 | View-versus-copy confusion (the old `SettingWithCopyWarning`) | Edits that may or may not land — under pandas 3 Copy-on-Write, subsets consistently behave as copies and the warning is gone | `.loc` for assignment; `.copy()` when a subset becomes its own table | `pandas-select-and-filter` |
| 4 | dtype surprises: IDs read as numbers lose leading zeros; number columns read as text will not sum; mixed types warn | Totals that will not compute, codes that no longer match | `dtype=` on read for ID columns; check `dtypes` at first look | `dataframe-first-look`, `pandas-missing-data-and-types` |
| 5 | Date parsing: day/month order is ambiguous (`dayfirst` is documented as "not strict"), and `errors="coerce"` silently turns bad values into NaT | Dates a month out, or rows quietly dateless | State the format explicitly; count NaT before and after parsing | `pandas-dates-and-resample` |
| 6 | CSV encoding: `read_csv` defaults to UTF-8, so a legacy-encoded Excel export crashes or garbles | `UnicodeDecodeError`, or text full of mojibake | Name the `encoding=` parameter; re-export as UTF-8 where possible | `files-and-tables` |
| 7 | Vietnamese diacritics: NFC and NFD forms of the same word look identical but compare unequal (the `unicodedata` docs' own warning), splitting filters, groupbys and merges; legacy-encoded Excel CSVs compound it | A store or product name that "obviously matches" returns no rows | Normalize text columns to NFC before any filter, groupby or merge | `pandas-text-cleaning` |
| 8 | Index misalignment: arithmetic and assignment align on labels, not row position | NaN appearing in a column that "had all its values" | Reset or align indexes deliberately before combining (§3, trap 7) | `dataframe-first-look` |
| 9 | Chained assignment: `df[mask]["col"] = value` writes to a throwaway intermediate (under pandas 3 it consistently never works) | An assignment that silently does nothing | One-step `.loc[mask, "col"] = value`, always | `pandas-select-and-filter` |
| 10 | Not reading the traceback: the exception name and message are the documented last line, and beginners paste the whole block into search or AI unread | Long, frightening error walls | Read the last line first; name the error type before searching | `errors-and-debugging` |

---

## 7. Stage exit and free proof points

**Exit artifact [Recommendation] — the Café Chain Quarterly Pack.** Three files on the project's café chain data: the cleaned orders dataset (CSV), the notebook that produced it, and a one-page findings note whose every headline number traces to a notebook cell. The notebook must show the full analyst loop — read, inspect, clean (missing values, dtypes, dates, text), join orders to stores and products, group and reshape, chart. It proves transfer across all three tools on one dataset and is portfolio-ready as-is. Two companions: the same analysis re-delivered as a rerunnable `.py` script (lesson 26's real test — someone else reproduces the outputs without opening the notebook), and optionally a SQL↔pandas twin notebook — ten fixed café questions answered both ways, with a note wherever the two behaviours differ (§3 made personal).

**Free external proof points** (cost verified on each provider's own page, accessed 2026-11-18; all are completion evidence, not accredited qualifications):

- **Kaggle Learn — Python, Pandas and Data Cleaning certificates.** Free ("No cost, like all Kaggle Learn Courses"; a completion certificate per finished course). They prove the minimum-Python block and the pandas core respectively; Kaggle's own certificates page frames the next step as building a portfolio — which is what the exit artifact is.
- **LeetCode — Introduction to Pandas study plan badge.** 15 beginner problems (create a DataFrame, shape, select, create/modify columns, drop duplicates, drop/fill missing, rename via dict, change dtype, concat, pivot, melt, method chaining). A profile badge, not a certificate; it proves small-frame fluency, not project ability.
- **freeCodeCamp — Data Analysis with Python Certification.** Free; five auto-tested projects spanning NumPy, pandas, Matplotlib and Seaborn. Caveat from the provider's own page: the content "is not being updated" (archived) — still valid as proof, not as a syllabus to copy.
- **HackerRank — Python (Basic) Skills Certificate.** Free per HackerRank's help centre, but developer-flavoured (it tests classes and objects, beyond this stage's scope): an optional extra, never a stage requirement.

---

## 8. Sources (all accessed 2026-11-18)

**Syllabi and courses.** Kaggle Learn — Python course https://www.kaggle.com/learn/python · Pandas course https://www.kaggle.com/learn/pandas · Data Visualization course https://www.kaggle.com/learn/data-visualization · Course certificates https://www.kaggle.com/learn-course-certificates · freeCodeCamp — Data Analysis with Python https://www.freecodecamp.org/learn/data-analysis-with-python/ · Dataquest — Data Analyst in Python path https://www.dataquest.io/path/data-analyst/ · McKinney, *Python for Data Analysis*, 3rd ed. (open edition; ch. 4 NumPy, ch. 9 plotting) https://wesmckinney.com/book/ · pandas — Getting started tutorials https://pandas.pydata.org/docs/getting_started/intro_tutorials/ · Harvard CS50P https://cs50.harvard.edu/python/ · DataCamp — Introduction to NumPy https://www.datacamp.com/courses/introduction-to-numpy · LeetCode — Introduction to Pandas study plan https://leetcode.com/studyplan/introduction-to-pandas/ · HackerRank help centre (certifications are free) https://help.hackerrank.com/articles/2563639100

**pandas and NumPy documentation.** Comparison with SQL https://pandas.pydata.org/docs/getting_started/comparison/comparison_with_sql.html · Merge, join, concatenate https://pandas.pydata.org/docs/user_guide/merging.html · Group by https://pandas.pydata.org/docs/user_guide/groupby.html · Working with missing data https://pandas.pydata.org/docs/user_guide/missing_data.html · Intro to data structures https://pandas.pydata.org/docs/user_guide/dsintro.html · PyArrow functionality https://pandas.pydata.org/pandas-docs/version/2.0.3/user_guide/pyarrow.html · `pandas.ArrowDtype` (experimental warning) https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.ArrowDtype.html · NumPy — absolute basics for beginners https://numpy.org/doc/stable/user/absolute_beginners.html · NumPy — Random Generator https://numpy.org/doc/stable/reference/random/generator.html · NumPy — linear algebra https://numpy.org/doc/stable/reference/routines.linalg.html

**Tools, charts, survey.** Polars — comparison with other tools https://docs.pola.rs/user-guide/misc/comparison/ · DuckDB — Python API overview https://duckdb.org/docs/stable/clients/python/overview · Plotly — renderers https://plotly.com/python/renderers/ · Plotly — interactive HTML export https://plotly.com/python/interactive-html-export/ · Stack Overflow Developer Survey 2025 — technology https://survey.stackoverflow.co/2025/technology (no libraries table; see §1) · Job postings (all accessed 2026-11-18): Nordstrom — Data Analyst, Omnichannel Engagement https://builtin.com/job/data-analyst-omnichannel-engagement-hybrid-seattle/8378235 · Shell — Data Science Analyst https://jobs.weekday.works/shell-data-science-analyst-eglt · Unnamed consumer-tech company via hirist.tech on Jooble — Data Analyst https://in.jooble.org/jdp/-2030054905986940952 · Cross Border Talents — Data Analyst https://cross-border-talents-47.careers-page.com/jobs/2790a20e-e852-4a64-93a0-a845b99f74e7 · Lazard — Quantitative Data Analyst https://www.builtinnyc.com/job/quantitative-data-analyst/9931313

**Pain-point documentation.** Jupyter — troubleshooting / multiple environments https://jupyter.org · pandas — returning a view versus a copy (user guide) and pandas 3.0 release notes (Copy-on-Write) https://pandas.pydata.org/docs · Python — `unicodedata` (normalization forms) https://docs.python.org/3/library/unicodedata.html · Python — `pathlib` and venv documentation https://docs.python.org/3/library/pathlib.html

**Known limits of this research.** Kaggle's Pandas course page rendered only partially in text fetch and once returned HTTP 429; its six lesson titles were corroborated against independent listings of the course. McKinney's chapter list was taken from full 3rd-edition table-of-contents reproductions of the open edition. Two of the five job postings (Cross Border Talents, Lazard) were verified from the postings' own indexed full-text excerpts after direct opens hit a browser rate limit; the quoted requirement lines are verbatim from those excerpts. Nothing in this report rests on a source that could not be opened at all.

---

## 9. Addendum (2026-11-18) — Learning environment: Colab, decided

**Question added after delivery:** when learning Python, do learners prefer Google Colab / their own setup, or the learning platform's own environment? **Finding:** no large survey asks this directly; the evidence is behavioural. (1) Every major interactive platform converged on a hosted in-platform runtime — Kaggle Learn (hosted notebooks), Dataquest and DataCamp (in-browser editors), Codecademy (in-browser) — with zero setup as the headline feature. (2) A documented university cohort (Hochegger, *Teaching Python to Biology Undergraduates*, 60 students, opened 2026-11-18) ran the progression in-page Pyodide → Colab → local development: browser-first removed setup friction, but only 5 of 60 students voluntarily moved to local development, and the instructor's corrective is to make local development mandatory and scheduled in the next iteration. (3) freeCodeCamp is the counterexample model — no in-page runtime; lessons plus Jupyter taught explicitly, projects in an external notebook environment. A small Peruvian Colab study (8 students) reported learners wanted to continue on Colab; sample too small to carry weight.

**Owner decision (2026-11-18): Google Colab is the Python stage's practice environment.** This site is static and cannot host a runtime like Dataquest's; the SPEC's Milestone 4 Open-in-Colab buttons are the equivalent of in-platform practice, and they also pre-empt trap 1 in §6 (install/kernel confusion on day one). Local setup remains in the stage exactly where the evidence says it must be: as required late lessons (`environments-and-pip`, `notebook-to-script`), never as an optional extra. In-page Pyodide snippets are possible on a static site but are not recommended: page weight conflicts with the project's measured performance budget and the Vietnam network findings. **Storage:** notebooks are authored and saved under the account johnha0912@gmail.com in the dedicated Drive folder "Data From Zero — Colab Notebooks" (created and verified 2026-11-18).

## Affected datafromzero pages

none yet — no /python/ pages are live (sitemap checked 2026-11-18: only /, /start/, /vi/, /vi/start/ exist); stage route /python/.

## Suggested action

Adopt the recommended list in the Evidence report (27 lessons + 2 awareness boxes): compress the pre-DataFrame block from 8 lessons to 6; add pandas-derived-columns; extend files-csv-json into files-and-tables (add read_excel, read_sql, one DuckDB demo); split charts into charts-matplotlib then charts-seaborn (Plotly awareness only); add the cafe-quarterly-pack capstone before notebook-to-script; keep ai-assisted-code, environments-and-pip, notebook-to-script and merge validation as deliberate differentiators. Teach the 12 SQL-bridge traps in the lessons named in the report. Build work is structural (lesson list, curriculum map, notebook skeletons in the Drive folder named in the Summary); lesson prose remains the owner's.

## Priority

High - a page is wrong or broken, or URLs/roadmap structure are affected

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

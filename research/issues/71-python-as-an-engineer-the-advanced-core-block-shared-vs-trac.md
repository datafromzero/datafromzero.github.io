# #71 Research: Python as an engineer — the advanced core block (shared vs track, depth, environment, traps)

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/71 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#71](https://github.com/datafromzero/datafromzero.github.io/issues/71) (open), opened 2026-11-19

## Type

Curriculum gap

## Summary

The advanced core teaches no engineering-style Python, yet all four tracks (DA, DE, DS, MLE) assume it on day one. This research tests the team's draft block of ~7 lessons against job-market evidence (a named sample of 12 entry-level postings, 3 per role, plus O*NET), the three curricula that own this layer (DataCamp Software Engineering, Software Carpentry, Missing Semester), eight competitor programs, official scikit-learn/Airflow docs, and verified environment free tiers. Verdict: a required core block of 9 lessons (one short) at use depth — terminal, project layout with CLI arguments, environments via uv, classes-lite (read/use + one dataclass; inheritance authorship moves to the DE and DS/MLE tracks), readable code + reading docs, errors/debugging/retries, pytest on known-answer café tables, logging/config/secrets, and a short feel-for-scale lesson. Docker splits the roles (required in DE/MLE postings, absent for DA): awareness in the core cloud lessons, building in those two tracks. Environment: GitHub Codespaces (120 free core-hours/month, no payment method; Colab cannot host this block), with a lesson-zero resurrection drill against its 30-day auto-delete trap. The market gap is real: logging, config/secrets and reading docs appear in no competitor syllabus, while GitGuardian counts 28.65M new hardcoded secrets on public GitHub in 2025. Full report in the Evidence field: 10 findings, the lesson list with depths/prerequisites/track moves, a skills-by-role table, the environment onboarding, and 11 sourced traps ready to become exercises.

## Evidence

## Python as an Engineer — the Advanced Core Block: Research Report

**Purpose.** The advanced core (25 lessons: statistics, metrics and A/B testing, prediction framing, Git, grain and star schema, cloud and warehouses, RAG/agents literacy) teaches no engineering-style Python, yet all four tracks assume it on day one. This report tests the team's draft block of ~7 lessons, decides what is shared core (needed by DA, DE, DS and MLE alike) versus track material, sets the depth per skill, picks the teaching environment, and lists the traps to teach against. It is not about the computer-science material already cut from the core path (hand-implemented sorting/data structures, formal Big-O; curriculum package 02, §8.2) — it is about working-programmer skills for data people who arrive knowing Colab notebooks and pandas.

**Method.** Five research lines, all sources opened 2026-11-19: (A) role-demand evidence — a named sample of 12 entry-level job postings (3 per role) plus O*NET occupation pages and the Data Engineering Zoomcamp's stated prerequisites; (B) the draft list tested against DataCamp's Software Engineering for Data Scientists, Software Carpentry and MIT's Missing Semester; (C) competitor programs — Dataquest DE path, Codecademy, Udacity DE Nanodegree, DataTalksClub's DE and MLOps Zoomcamps, Google's and IBM's certificates, McKinney and *Effective Python* as book contrasts; (D) environment comparison with free tiers verified on official pages; (E) traps with named sources, plus the OOP-depth question answered from the official scikit-learn and Airflow docs. Working files: `cluster-a-role-demand.md` … `cluster-e-traps-oop.md` in this folder.

**How to read the labels.** Unmarked statements are findings from the named sources. Statements marked **[Recommendation]** are design choices. Job-demand numbers are counts inside the named 12-posting sample (cluster A lists every posting) — never market percentages. Where a skill is recommended for the core despite zero posting evidence, the report says so and names the other ground (framework, incident data, or curriculum consensus).

**Confidence.** High for curriculum contents, official-docs requirements and environment free tiers (primary pages opened). Medium for role-demand generalisation: 12 postings is a directional sample, and O*NET has no ML Engineer occupation (Software Developers 15-1252.00 is used as its proxy, as in issue #32).

---

## 1. The 10 most useful findings

**1. Job postings screen for tools and outcomes, not for code craft — so postings alone cannot design this block.** In the 12-posting sample, Git is the only engineering skill named across DA, DE and DS postings (3/3 each — though DA asks only for "familiarity," while DS postings attach code review and reproducible workflows to it), and Python+SQL are paired in 11 of 12. The craft micro-skills are invisible: type hints, logging, config/secrets, CLI arguments, regex, debugging tools, reading docs/source, pandera/pydantic and SQLAlchemy *by name* each appear in **0 of 12** postings, and pytest is named 0/12 even where postings demand "testing" and "clean, testable, maintainable code" (DE 1/3, DS 2/3, in those words). MLE postings never name Git but name CI/CD 3/3 — Git is presupposed, not screened. [Recommendation] Treat posting silence as "not screened," never as "not needed": several core choices below rest on framework and incident evidence instead, and are labelled that way.

**2. Terminal first is the one true consensus in the field.** Software Carpentry and Missing Semester both *open* with the shell, at use/build depth. Dataquest's Data Engineer path places command line and Git in Part 3 of 9, immediately after basic Python. DataCamp's Software Engineering course is silent on the shell only because its sandbox hides it — an artifact, not a judgement (cluster B). The DE side of the labour market agrees: shell is a stated prerequisite in the DE Zoomcamp and named in DE postings ("Linux command line, shell utilities"). [Recommendation] The block opens with the terminal, and it lands before (or fused with) the core's existing Git lessons, because every later lesson in the block is operated from the shell.

**3. Testing is demanded in words, taught almost nowhere, and our known-answer tables are the ideal vehicle.** DE and DS postings require testing as a practice (finding 1); O*NET lists testing among core tasks for Database Architects and Data Scientists. Yet across the competitor syllabi in cluster C, exactly one explicit testing unit exists — MLOps Zoomcamp's module on testing, linting, pre-commit and CI/CD — and nobody teaches testing early. Software Carpentry deliberately teaches *assertions* rather than a framework at this level. [Recommendation] Core teaches pytest on small known-answer tables (the café data, whose right answers the learner already trusts from three stages) — assertions first inside the lesson, pytest as the runner — placed *after* a debugging lesson, per cluster B's ordering evidence (Missing Semester teaches debugging and profiling as one lecture, before any formal testing culture).

**4. The OOP question has a clean, documented answer: read/use plus one dataclass in the core; inheritance authorship belongs to the tracks.** No posting in the sample names OOP or inheritance at entry (0/12). The official docs show where authorship actually bites: scikit-learn's developer documentation requires a custom transformer to inherit `BaseEstimator` and `TransformerMixin` and implement `fit`/`transform` with the `get_params` contract — a DS/MLE track need, exercised when building sklearn pipelines. Airflow's documentation requires a custom operator to extend `BaseOperator` and override `__init__`/`execute` — a DE track need. DataCamp's Software Engineering course is the outlier that builds a full chapter on writing classes with inheritance for data scientists; Software Carpentry and Missing Semester never teach writing a class at all (cluster B). [Recommendation] Core depth: use library classes fluently, write one small `@dataclass`, and *recognise* the subclass-and-override pattern when a doc page demands it — so the track lesson that teaches authorship starts from recognition, not from zero.

**5. Docker is the sharpest role split in the sample — awareness in the core, building in two tracks.** Postings: required for DE (2/3; the third asks "exposure") and MLE (3/3), exposure-only for DS (1/3), absent for DA (0/3). Both Zoomcamps teach Docker from scratch in week/module 1 rather than assuming it. [Recommendation] The core's existing cloud/warehouse lessons gain a Docker awareness box (what a container is; run one prepared image; why "it works on my machine" dies here). Building images and Dockerfiles is DE-track and MLE-track material.

**6. The three skills nobody teaches are exactly the ones incidents measure: logging, config/secrets, and reading documentation.** Across every syllabus opened in cluster C — Codecademy, Dataquest, Udacity, both Zoomcamps, both certificate families — logging as a discipline, configuration/secrets management, and reading library docs/source appear as named subjects in *none*. They are also 0/12 in postings. But the incident record is not silent: GitGuardian's *State of Secrets Sprawl 2026* reports **28.65 million new hardcoded secrets added to public GitHub commits in 2025** (+34% year on year), and over 64% of secrets confirmed valid in 2022 were still valid in January 2026. [Recommendation] All three stay in the core — logging/config/secrets as one lesson justified on incident evidence, docs-reading folded into the readable-code lesson — and the report flags them as the block's clearest differentiation: this is the layer the whole market skips.

**7. The environment question has a decisive answer, because the alternatives have died or cannot run a terminal.** GitHub Codespaces is the only free option that passes the block's whole requirement list (real terminal, persistent project files, pip/venv, pytest, git) identically in a browser on Windows, macOS, Chromebook and phone-class devices, with zero local install. Verified on GitHub's official billing docs (accessed 2026-11-19): a plain GitHub Free account includes **120 core-hours/month** (≈60 real hours on the default 2-core machine) plus 15 GB-months of storage, with **no payment method required** — at the limit GitHub blocks use; it never bills. The rivals fell away on their own pages: Gitpod Classic shut down in October 2025 and its pricing page is now a contact-sales page; Firebase Studio closed signups in June 2026 and shuts down in March 2027; Replit's free tier no longer appears on its pricing page as a bookable quota; vscode.dev has no terminal by Microsoft's own docs; Colab's FAQ confirms its VMs are deleted when idle and shell-style access is disallowed on free runtimes. Local VS Code remains the graduation path, not the front door: Carpentries practice prices staffed local setup at roughly a two-hour installfest with a 1:8–10 helper ratio, and it excludes phone/Chromebook learners outright.

**8. The notebook-to-script traps are measured, not folklore — and the block's first job is un-teaching notebook habits.** Pimentel et al. (MSR 2019), in a large-scale study of GitHub notebooks, attempted execution of 863,878 valid notebooks: **only 24.11% executed without errors, and only 4.03% produced the same results** as their stored outputs. Joel Grus's "I Don't Like Notebooks" (JupyterCon 2018) names the mechanism — hidden state and out-of-order execution. Our Python stage already fights this with its run-from-the-top ritual (issue #66); the engineering block is where the learner learns *why* scripts, tests and declared dependencies are the cure. Section 5 turns each trap into an exercise.

**9. Nobody teaches this layer whole — the block is a genuine market gap, and short-core-plus-track-depth beats one long block.** The best scope match is a paid course (Codecademy's *Software Engineering for Data Scientists*: OOP, unit testing, logging, CLI, Git — 22 hours, Pro-walled); the best placement is Dataquest's (engineering topics early, right after basic Python); the best single unit is MLOps Zoomcamp's testing/CI module. Udacity's Data Engineering Nanodegree assumes intermediate Python and teaches zero engineering subjects across four production projects; both Google certificates (16 courses) contain no terminal, Git, testing or scripting at all; IBM is the middle case (a real Linux/shell course, no Git/Docker/testing) (cluster C). [Recommendation] A required core block of 9 lessons (one of them short) at *use* depth, with all *build*-depth versions in the tracks, keeps the core passable for a future DA — the DA column of the skills table (§3) is the passability test: nothing in the required block may be track-only for DA.

**10. Teach one environment tool well: uv.** The DE Zoomcamp's FAQ recommends uv for managing Python versions and virtual environments; the Python stage already taught pip basics (`environments-and-pip`). [Recommendation] The block's environments lesson standardises on uv (create environment, pin dependencies, reproduce from the dependency file) and teaches `pyproject.toml`/requirements literacy — not a poetry/conda survey. Tool churn is the risk to name on the page: the *concepts* (isolation, pinning, reproduction) are the lesson; uv is today's spelling.

---

## 2. Recommended lesson list for the block [Recommendation]

All nine lessons are required core unless marked otherwise. Depth scale: **recognize** (can read it and know what it does) / **use** (can do it with documentation at hand) / **build** (can produce it unaided). Roles = where the skill is needed at entry, from §3. The block sits inside the advanced core as one contiguous run, ordered as listed, placed **before** the core's cloud/warehouse lessons (which gain the Docker awareness box) and **interleaved with** the existing Git lessons (terminal first, then Git, per finding 2). Prerequisites assume the Python stage complete, including `environments-and-pip` and `notebook-to-script`.

| # | Slug | Title | Depth | Roles | Prerequisites | Notes / what moves where |
|---|---|---|---|---|---|---|
| 1 | `terminal-and-shell` | The terminal: your second home | use | DA · DE · DS · MLE | Python stage complete | Files, paths, pipes, running scripts; shell data-wrangling taste (count/sort/peek at a big file) from Missing Semester/SC consensus. Merges the "files and paths at scale" candidate. |
| 2 | `python-project-layout` | A real Python project | build (small) | all four | 1 | Modules, packages, imports, `__main__`, project layout; CLI arguments at use level (argparse) so a script takes a file and a date instead of hard-coded values; notebooks-vs-scripts-in-teams as the closing section (builds on `notebook-to-script`). |
| 3 | `environments-and-dependencies` | Environments and dependencies, for real | use | all four | 2 | uv as the one tool (finding 10); dependency files as the reproduction contract; the wrong-environment trap as an exercise. Upgrades the Python stage's pip lesson; conda/poetry = recognition sidebar only. |
| 4 | `classes-for-data-work` | Classes, without fear | use + build (one dataclass) | all four (authorship depth: DE/MLE) | 2 | Why libraries are built from classes; reading a class's docs; one small `@dataclass` for a café record. Inheritance: recognize the pattern only — **authorship moves to DE track (custom Airflow operators) and DS/MLE tracks (custom sklearn transformers)**, per finding 4. |
| 5 | `readable-code-and-docs` | Readable code, and reading code | use | all four | 2, 4 | Type hints and docstrings as readability habits (zero posting evidence either way — taught as craft, labelled as such); formatter/linter (ruff) as a one-command habit; **reading library docs and source** as a taught skill (finding 6); code-review etiquette as a closing section (DS postings name code review 2/3; the *practice* happens in track projects). |
| 6 | `errors-and-debugging` | When it breaks: errors, retries, debugging | use | all four | 2 | Traceback fluency (extends the Python stage's error lesson); one debugger at use level (breakpoints in the editor); error handling with specific exceptions; the retry pattern for flaky APIs/files; the silent-`except` trap as the anchor exercise. Missing Semester's debugging lecture is the model. |
| 7 | `testing-with-pytest` | Testing on known answers | build (small) | all four (required by DE/DS demand) | 6 | Assertions first, pytest as runner; tests over small known-answer café tables; one deliberately corrupted transform the tests must catch. CI: recognition only here — **CI/CD builds move to DE and MLE tracks** (MLOps Zoomcamp module as the model). |
| 8 | `logging-config-secrets` | Logging, configuration, secrets | use | all four | 2, 6 | `logging` instead of `print` in scripts; configuration via environment variables and a config file; secrets never in code (GitGuardian figures, finding 6) with a committed-secret exercise; hard-coded values refactored to config. Thinnest curriculum consensus of the block (cluster B) — kept on incident/practice grounds, flagged honestly. |
| 9 | `a-feel-for-scale` | A feel for scale (short lesson) | recognize → use | all four | Python stage NumPy lesson | Time and memory intuition without formal Big-O (per the §8.2 cut): dict vs list lookup measured, not asserted; chunked reading of a file too big for memory; why vectorised code is fast, revisited with timings. Kept short by design; if the core must shrink, this is the lesson that folds into worked examples inside lessons 1 and 7. |

**Candidates judged and placed elsewhere.** Docker: awareness box in the core cloud lessons; build depth → DE + MLE tracks (finding 5). SQL from Python: parameterised queries and safe connection habits are already seeded by the Python stage's `files-and-tables` (`read_sql`); SQLAlchemy depth → DE track. Data-validation libraries (pandera, pydantic): the *concept* is core (lesson 7's assertions on tables); the libraries → DE track (pipeline validation) with DS as helpful. HTTP/JSON beyond the Python stage → helpful depth in DS/MLE tracks (API-serving and data-collection work); core keeps the Python stage's level. Regex depth → no track owns it at entry (0/12 postings); the Python stage's bounded treatment stands. Debugger mastery, shell scripting beyond lesson 1, packaging/publishing a library → track or reference material, not core.

**Size verdict (brief Q8).** [Recommendation] 9 required lessons (one short) + track deepeners, as tabled — not a longer single block. The core grows 25 → 34 lessons; every added lesson passes the DA test (needed, at use depth, by an entry DA who automates reporting), and everything a DA would experience as another role's homework (inheritance authorship, Docker builds, CI, validation libraries) sits in the tracks where it is exercised immediately.

---

## 3. Skills × roles at entry level

From cluster A's evidence matrix (12 named postings + O*NET + DE Zoomcamp prerequisites; full basis per cell in `cluster-a-role-demand.md`). **Required** = named as expected at entry, or a framework core task. **Helpful** = exposure/familiarity language, or presupposed by named tools. **Track-only** = not a core need; depth belongs in the named track(s). **—** = not expected at entry.

| Skill | DA | DE | DS | MLE |
|---|---|---|---|---|
| Terminal / shell | helpful | **required** | helpful | helpful |
| Git (beyond basics) | helpful | **required** | **required** | helpful (presupposed by CI/CD) |
| Modules / project layout | helpful | helpful | helpful | helpful |
| Classes — use library classes | helpful | helpful | helpful | helpful |
| Classes — write a small class/dataclass | — | helpful | helpful | helpful |
| Classes — inheritance authorship | — | track-only (DE) | track-only (DS) | track-only (MLE) |
| Type hints | — | — | — | — |
| Testing (pytest) | — | **required** | **required** | helpful |
| Logging | — | helpful | — | helpful |
| Config & secrets handling | — | helpful | — | helpful |
| Error handling / retries | — | helpful | helpful | helpful |
| CLI arguments | helpful | helpful | — | — |
| Virtual environments & dependency files | — | helpful | helpful | helpful |
| Docker | — | **required** | helpful | **required** |
| SQL from Python (parameterised) | helpful | helpful | helpful | helpful |
| HTTP / APIs beyond basics | — | helpful | helpful | helpful |
| Regex (beyond recognition) | — | — | — | — |
| Debugging tools | — | helpful | helpful | helpful |
| Code review participation | — | helpful | **required** (named 2/3) | helpful |
| Data validation (concept) | helpful | **required** | helpful | helpful |
| Data validation libraries (pandera/pydantic) | — | track-only (DE) | helpful | helpful |
| Reading docs & source | helpful | helpful | helpful | helpful |
| Scale intuition (chunking, memory) | helpful | helpful | helpful | helpful |
| CI/CD | — | track-only (DE) | — | track-only (MLE) |

Reading note: the many "helpful" cells with 0/12 posting counts are framework- and practice-based judgements, marked as such in cluster A; the table's *required* cells are the only ones that rest on direct posting/framework evidence. Type hints and regex score "—" across the board on evidence, yet type hints are still taught in core lesson 5 as a readability habit — a [Recommendation] the team makes with its eyes open, because the cost is one section and the payoff compounds in every track.

---

## 4. Environment recommendation and onboarding [Recommendation]

**Primary environment: GitHub Codespaces** for the whole block (finding 7). It is the same GitHub account the core's Git lessons already require; it opens identically on Windows, macOS, Chromebook and a phone browser; the free tier (120 core-hours/month, no payment method, hard block instead of billing — GitHub billing docs, accessed 2026-11-19) covers roughly 60 hours of 2-core work per month, several times the block's needs. **Colab stays the Python stage's home** — it cannot host this block (ephemeral VMs, no real shell on free runtimes, files that vanish). **Local VS Code + Python is the graduation option**, offered as an optional final step of the block with a guided setup, for learners whose next track expects local work — not as the front door (Carpentries installfest evidence, finding 7).

**The known trap, taught against on day one:** a codespace feels like your own computer but is a hotel room — it auto-stops after 30 idle minutes and is **auto-deleted after 30 days stopped**, taking unpushed work with it (GitHub lifecycle docs; DataTalksClub's FAQ documents the matching "my setup disappeared" complaints from its learners).

**Lesson zero (the block's first sitting, inside `terminal-and-shell`):**
1. Create the codespace from the block's template repository — one click, no installation, nothing to configure.
2. Run the verification script (`check_environment.py`, Carpentries-style): it prints pass/fail for Python version, terminal, git identity and pytest — the learner is not "set up" until it passes, and the page lists the fix for each failure.
3. Write one tiny script, run it from the terminal, watch it print.
4. **The resurrection drill:** commit and push; delete the codespace entirely; recreate it from the repository; watch the file return. This single ritual teaches git-as-safety, kills the 30-day-deletion trap before it can bite, and proves the environment is disposable — the deepest lesson of the block, taught in its first hour.
5. Phone/Chromebook note on the page: everything above works in the browser; a hardware keyboard is recommended from lesson 2 onward, stated plainly rather than discovered painfully.

---

## 5. Trap list — ready to become exercises

Each trap: the failure, its named source, and the exercise it becomes. Sources accessed 2026-11-19; full citations in cluster E.

| # | Trap | What happens | Source | Exercise |
|---|---|---|---|---|
| 1 | Hidden notebook state | Cells run out of order leave variables that no fresh run would produce; results cannot be reproduced | Grus, "I Don't Like Notebooks" (2018); Pimentel et al. (MSR 2019): 24.11% of 863,878 notebooks ran clean, 4.03% reproduced | A café notebook that "works" — restart-and-run-all makes it fail; find the cell order that was hiding the bug |
| 2 | Relative paths that break | `data/orders.csv` works from one folder, breaks when the script moves or is run from elsewhere | Cluster E (educator/docs sources) | Move a working script one folder deeper; fix it with paths anchored to the script's own location |
| 3 | Secrets in code | API keys committed to a repo are scraped within minutes and stay valid for years | GitGuardian, *State of Secrets Sprawl 2026*: 28.65M new hardcoded secrets on public GitHub in 2025 | A repo with a planted key: find it, move it to an environment variable, rewrite the code to read it — and state why deleting the line in the next commit is not enough |
| 4 | Untested transforms | A cleaning step silently drops or duplicates rows; every downstream number is wrong and nothing complains | Cluster E; the field's "testing demanded, taught nowhere" gap (finding 3) | A transform with a planted row-eating bug; the learner's known-answer test must catch it before the "report" ships |
| 5 | Mutable default arguments | `def add(row, seen=[])` shares one list across calls; state leaks between runs | Python Language Reference (defaults evaluated once, at definition) | A function that remembers yesterday's café orders; diagnose and fix with the `None` pattern |
| 6 | Import confusion | A file named `pandas.py` (or `data.py`) in the project shadows the library; imports fail or import the wrong thing | Real Python / Python docs (cluster E) | A project that imports its own author by accident; rename and restructure until the library wins |
| 7 | Silent `except:` | A bare except swallows every error — including the one that mattered — and the script "succeeds" with empty output | PEP 8 (bare except catches SystemExit/KeyboardInterrupt, "can disguise other problems"); flake8 E722 | A script that prints success and writes an empty file; narrow the exception and let it fail loudly |
| 8 | Hard-coded values as config | File paths, dates and thresholds baked into code; every reuse is a code edit and a new bug chance | Cluster E | Refactor a café report script so paths/dates/thresholds arrive as CLI arguments and config (feeds lesson 2 and 8) |
| 9 | Copy-pasted cell divergence | The same cleaning logic pasted into five notebooks drifts into five versions; a fix lands in one | Cluster E (notebook-practice sources) | Five notebook snippets with one subtly different copy; extract the shared logic into one module function and import it everywhere |
| 10 | Installing into the wrong environment | `pip install` succeeds — into a different Python than the one running the script; "it installed but won't import" | Cluster E | A two-environment machine where the package exists and the import still fails; diagnose with `which python` / `sys.executable`, fix by installing with the right interpreter |
| 11 | No declared dependencies | Code that runs on the author's machine fails on a fresh one; versions were never written down | Cluster E (bonus trap) | Recreate a project from its repository alone on a clean codespace; whatever is missing from the dependency file announces itself |

---

## 6. Sources (all accessed 2026-11-19)

**Role demand (cluster A).** The 12-posting named sample (3 per role; companies include Policy & Research Group, ATI Limited, Susquehanna University; Validate Health, True Anomaly, Semios; NYC City Jobs, GE Vernova, Govini; Allstate, Cognizant, dunnhumby — full list with URLs and quoted skill phrases in `cluster-a-role-demand.md`). O*NET occupation pages: 15-2051.01 (BI Analysts), 15-1243.00 (Database Architects), 15-2051.00 (Data Scientists), 15-1252.00 (Software Developers, as MLE proxy): onetonline.org. Data Engineering Zoomcamp prerequisites and FAQ (incl. the uv recommendation): github.com/DataTalksClub/data-engineering-zoomcamp.

**Draft test (cluster B).** DataCamp, Software Engineering for Data Scientists in Python: datacamp.com — **paywall: chapter 1 free; chapters 2–4 judged from DataCamp's own outline/FAQ plus Class Central's syllabus mirror, flagged in the cluster file.** Software Carpentry lesson catalogue and lessons: software-carpentry.org. Missing Semester: missing.csail.mit.edu.

**Competitors (cluster C).** Dataquest Data Engineer path: dataquest.io (account-walled lesson screens; path-level evidence). Codecademy, Software Engineering for Data Scientists skill path: codecademy.com — **Plus/Pro paywall**. Udacity Data Engineering Nanodegree syllabus: udacity.com — **paid program; syllabus page public**. DataTalksClub DE Zoomcamp and MLOps Zoomcamp: github.com/DataTalksClub (free, public). Google Data Analytics / Advanced Data Analytics and IBM Data Engineering certificates: coursera.org (**subscription; audit limits vary**). McKinney, *Python for Data Analysis* 3rd ed., open edition: wesmckinney.com/book. *Effective Python* contents: effectivepython.com.

**Environment (cluster D).** GitHub Codespaces billing and lifecycle docs (free-tier core-hours, no-card rule, 30-minute auto-stop, 30-day auto-delete): docs.github.com. Colab FAQ (VM deletion, shell limits): research.google.com/colaboratory/faq.html. Gitpod/Ona pricing (post-shutdown state), Firebase Studio notices, Replit pricing, VS Code for the Web docs (no terminal): vendors' official pages as cited in the cluster file. Carpentries workshop setup practice: carpentries.org / Software Carpentry setup pages.

**Traps and OOP depth (cluster E).** Pimentel et al., "A Large-Scale Study About Quality and Reproducibility of Jupyter Notebooks," MSR 2019 (headline figures quoted from the paper). Grus, "I Don't Like Notebooks," JupyterCon 2018. GitGuardian, *State of Secrets Sprawl 2026* (published 2026-03-17): gitguardian.com. Python Language Reference (default argument evaluation) and PEP 8 (bare except): docs.python.org / peps.python.org. scikit-learn developer docs, "Developing scikit-learn estimators": scikit-learn.org. Apache Airflow docs, custom operators: airflow.apache.org.

## Affected datafromzero pages

none yet — no advanced-core pages are live (sitemap checked 2026-11-18: only /, /start/, /vi/, /vi/start/ exist); the block belongs to the advanced core stage, after the Python stage (/python/).

## Suggested action

Adopt the recommended 9-lesson block in §2 as the advanced core's engineering layer, in the order tabled, placed before the core's cloud/warehouse lessons and interleaved with the existing Git lessons; add the Docker awareness box to the cloud lessons; move inheritance authorship, Docker builds, CI/CD, SQLAlchemy depth and validation libraries (pandera/pydantic) to the tracks named in §2–§3. Standardise the block's environment on GitHub Codespaces with the §4 lesson-zero outline (verification script + resurrection drill). Core grows from 25 to 34 lessons; lesson prose remains the owner's.

## Priority

Medium - outdated but still correct, or a clear beginner-level gap

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

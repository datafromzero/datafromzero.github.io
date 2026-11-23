# #118 Research: what employers will hire for in 2026 and beyond — demand, entry-level skills, AI changes, proof, tools and competitors per data career, with mapping to the four tracks

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/118 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#118](https://github.com/datafromzero/datafromzero.github.io/issues/118) (open), opened 2026-11-23

## Research: what employers will hire for in 2026 and beyond, per data career — demand, entry-level skills, AI changes, proof, tools, competitors, and what it means for our four tracks

*Compiled 2026-11-23 from primary sources only: official labor statistics and reports, 106 real entry-level job postings opened in full on 2026-11-22, official frameworks (SFIA 9, UK DDaT, O*NET), employer-published hiring material, vendor research and certification blueprints, peer-reviewed studies and labelled preprints, and course providers' own pages. Every fact is as of the date its page was opened (2026-11-22 throughout, except the BLS edition note in Finding 1). Counts from the posting samples are raw counts of postings mentioning an item; the samples describe themselves, not the whole market — each sample's skew is stated in its career section.*

## Summary

Data Scientist is the only one of the four careers with its own strong official projection (US BLS 2025–35: +35%); the other three must be read through proxies, platform data and postings, because BLS has no "data analyst", "data engineer" or "ML engineer" occupation. Across 106 entry-level postings opened in full, the screens are remarkably consistent: SQL is near-universal in all four careers, data cleaning/quality/testing work is demanded far more than any course teaches it, and stakeholder communication outranks most technical skills for DA and DS. AI has already changed the entry-level screen: postings now ask juniors to use AI assistants *and verify their output* (DA 6 of 25, DE 12 of 27), roughly half of DS postings mention AI/LLM work (13 of 26), and the ML Engineer title has split into an LLM/RAG half and a classical half (12 and 12 of 28). The junior floor in every framework is supervised *doing* — pipelines, dashboards, models that run — and work-sample tests are the best-evidenced selection method in the hiring literature, yet almost no posting describes its own process, so courses that simulate real work samples fill a real gap. The durable stack is boring on purpose: SQL, Python, Git, one cloud data platform, and per career one craft core (BI + metrics for DA; dbt + Airflow + testing for DE; scikit-learn + honest evaluation for DS; PyTorch + serving + LLM evaluation for MLE) — all practicable on free tiers. The strongest free competitor (the DataTalks.Club Zoomcamps) owns deployment and capstone proof but is thin on statistics, metric definition and AI-output verification; the commercial platforms own polish but rarely require an integrative, self-directed build. The gaps a free text course can own are listed in the Gaps section of the first comment.

**One line per career — what makes a beginner hireable from 2026 on:**
- **Data Analyst:** fluent SQL + one BI tool + a governed metrics layer, proven by a published dashboard whose numbers you can defend, plus documented AI-assisted work you verified.
- **Data Engineer:** SQL + Python pipelines with tests and data-quality checks as a reflex, dbt and Airflow at working depth, on one cloud warehouse — proven by a pipeline repo someone else can run.
- **Data Scientist:** Python + SQL with honest evaluation (cross-validation, backtesting, experiment reading) and decision-shaped communication; the degree bar is lower than folklore says (master's required in 3 of 26 postings, PhD in 0).
- **AI/ML Engineer:** PyTorch and scikit-learn for the classical half of the market, and LLM APIs, RAG and *evaluation* for the other half — evaluation duties (16 of 28) already outrank deployment duties (9 of 28).

## Findings

**Finding 1 — Edition warning: the BLS numbers changed under us.** The live Occupational Outlook Handbook is now the **2025–35 edition** (May 2025 pay; projections to 2035; all-occupations average growth +3%). Figures from the 2024–34 edition used in earlier project research are superseded and must not be mixed with these unlabeled. Sources: BLS OOH occupation pages (opened 2026-11-22).

**Finding 2 — Only Data Scientist has a direct official projection; the other three careers are proxy reads.** DS: **+35%** over 2025–35, 275,600 jobs (+95,400), ~24,800 openings/year, median pay $120,230, typical entry bachelor's; O*NET rates it Bright Outlook / Rapid Growth. DA proxies all grow on very large bases: market research analysts +7% ($78,760; 952,700 jobs; ~82,000 openings/yr), operations research analysts +12% ($88,940), management analysts +10% ($101,860; ~94,100 openings/yr). DE proxies split: database administrators **0%** ($104,620 — BLS's own text attributes this to cloud consolidation) vs database architects **+9%** ($139,500; O*NET Bright, as are Data Warehousing Specialists). MLE's research proxy (computer and information research scientists) grows +22% at the highest median ($140,300) but on a tiny, master's-gated base of 38,600 jobs. Sources: BLS OOH; O*NET (opened 2026-11-22).

**Finding 3 — Platform and employer-side data point the growth at AI-titled and big-data roles.** WEF *Future of Jobs 2025* ranks Big Data Specialists the #1 fastest-growing role and AI/ML Specialists #3, with AI and big data the #1 fastest-growing skill; LinkedIn's *Jobs on the Rise 2025* ranks Artificial Intelligence Engineer the #1 fastest-growing US job title. The same WEF report lists Data Entry Clerks among the fastest-*declining* roles — the compositional risk inside the DA proxy growth. Sources: WEF Future of Jobs 2025; LinkedIn Economic Graph publications (opened 2026-11-22).

**Finding 4 — Titles are merging and splitting in ways a curriculum must name.** "Analytics engineer" (term coined by dbt Labs in 2018, per dbt Labs) was the plurality title among individual contributors in dbt Labs' 2025 State of Analytics Engineering survey — 48% vs 36% data engineer, 16% data analyst (vendor-run, self-selected sample: treat as directional, not market share). O*NET counts Business Intelligence Analysts *inside* Data Scientists. In our own samples: 4 of 27 DE postings were analytics-engineering titles with DE duties; 6 of 26 "Data Scientist" postings were really analytics/BI roles and 4 leaned ML/software engineering. No primary source defines "ML engineer" vs "applied scientist" — the boundary is employer-local. Sources: dbt Labs (getdbt.com); O*NET; this report's posting samples.

**Finding 5 — SQL is the universal screen; the second screen differs by career.** DA sample (N=25): SQL 23 of 25 (required tier in 19). DE (N=27): SQL 27 of 27. DS (N=26): Python 23, SQL 21. MLE (N=28): Python 26, SQL 14. A course that treats SQL as "the SQL part, finished before the tracks" misreads the market: SQL is exercised *inside* every track's work.

**Finding 6 — Data cleaning, quality and testing are the most under-taught demanded skills.** DA postings name cleaning/validation/quality work in 21 of 25. DE postings name data-quality, validation or testing duties in **23 of 27** — dbt tests, unit/integration tests, freshness and null checks are entry-level expectations, not senior extras. dbt Labs' 2025 survey independently names data quality the #1 challenge in analytics engineering (56% of respondents, as published). Almost no competitor path (see competitor table) teaches testing as a discipline rather than a feature.

**Finding 7 — For DA and DS, communication outranks most technical skills.** Stakeholder/non-technical communication appears in 23 of 25 DA postings and 22 of 26 DS postings — ahead of Python for DA (14 of 25, required-tier in only 6) and ahead of every named DS library (pandas 6 of 26, scikit-learn 4 of 26). Frameworks agree: SFIA 9 and the UK DDaT framework both put presenting findings and documenting for reproducibility in the junior floor.

**Finding 8 — The DS degree bar is lower than folklore; the MLE bar is real but uneven.** DS sample: bachelor's is the stated requirement in 14 of 26; master's required in 3, strongly preferred in 1, required-or-experience in 1; **PhD required in 0**. MLE sample: a degree required in 20 of 28, master's-or-higher in only 6 — two of them titled "Entry Level"/"New Grad". What postings actually screen is demonstrable work: personal projects/GitHub explicitly valued in 7 of 28 MLE and at least 6 of 26 DS postings; portfolios explicitly welcomed in 8 of 25 DA postings.

**Finding 9 — AI-assistant use with verification is now an entry-level screen, not a perk.** DA: 6 of 25 postings expect the candidate to use AI assistants — one (CPI, India) requires using Codex "while critically evaluating their output"; one (Pioneer, Berlin) requires AI-assistant use outright. DE: 12 of 27 mention AI, overwhelmingly as coding assistants or "use AI tools and verify the output" duties (DraftKings, First Citizens, BUX, Bloom & Wild); deep LLM/RAG requirements in only 1. DS: 13 of 26 mention AI/LLM as skill, duty or requirement, with named tools (Claude Code, Codex, Cursor) appearing in junior DS postings. MLE: AI coding assistants named in 5 of 28, once as a hard requirement. NACE's *Job Outlook 2026 Spring Update* independently lists using AI tools, prompting effectively, and analysing/revising AI outputs among the AI skills employers screen for. Sources: posting samples; NACE (opened 2026-11-22).

**Finding 10 — The measured AI effect on the work itself is task-shaped, and the strongest study cuts against the hype.** Microsoft Research's *Working with AI* (preprint, 2025; 200,000 Copilot conversations) finds chatbot use and success concentrated in information-handling tasks — gathering, drafting, explaining — which is the DA core. Anthropic's Economic Index (Sep 2025) shows "directive" delegation in Claude use rising from 27% to 39%. But METR's randomised trial (preprint, 2025) found experienced developers were **19% slower** with AI tools on real codebases while believing they were 20% faster — the single most important calibration fact for teaching DE/MLE learners to verify AI output, including their own productivity impressions.

**Finding 11 — The entry-level market is the exposed edge.** Stanford Digital Economy Lab, *Canaries in the Coal Mine?* (working paper, Aug 2025; ADP payroll data): workers aged 22–25 in the most AI-exposed occupations saw a **13% relative employment decline**, driven by reduced hiring and concentrated where AI automates rather than augments. Counterweight from peer-reviewed field evidence (QJE, 2025): AI assistance raises novice performance most. The teachable conclusion is not "AI takes junior jobs" but "the junior who can verify and direct AI output is the one the remaining junior roles describe" — which is exactly the candidate the postings in Finding 9 describe. (SignalFire's firm report — new graduates at 7% of Big Tech hires — points the same way but is a firm publication retrieved via summaries; marked uncertain, not relied on.)

**Finding 12 — New examinable cores have formed around LLM systems.** Databricks' Generative AI Engineer blueprint formalises LLM data preparation (chunking, retrieval) and an Evaluation & Monitoring domain (12% of the exam, as published); Google's and Databricks' current blueprints put LLM APIs, RAG, structured output and LLM evaluation inside the MLE credential; LinkedIn's Skills on the Rise 2025 lists AI-related skills at the top. For DS, the genuinely new requirement is evaluating and monitoring generative systems, not building them.

**Finding 13 — Frameworks agree on the junior floor, and two careers have no junior rung at all.** SFIA 9 names all four skills (data analytics DAAN, data engineering DENG, data science DATS, machine learning MLNG) from Level 2 — supervised application. The UK DDaT framework has Trainee/Associate rungs for Data Scientist but **no trainee tier for Data Engineer** (entry is the full role) and defines ML Engineer **only at Senior/Lead**; O*NET has no ML-engineer occupation. Implication: for DE and MLE, "entry level" postings routinely demand the full role at 0–3 years — our samples confirm it (true new-grad DE postings: 3 of 27; one "Junior" DE role demands 2 years each of warehousing, SQL/ETL, Python and AWS).

**Finding 14 — Work samples are the best-evidenced selection method — and almost no posting describes its own process.** Schmidt & Hunter's classic validity for work-sample tests (r = .54) was revised downward by Sackett et al. (2022) to .33, with structured interviews now top at .42 — still, work samples remain among the strongest predictors, which makes simulating them defensible course design. Yet postings rarely say so: interview tasks described in 3 of 25 DA, 1 of 27 DE, 2 of 26 DS and 4 of 28 MLE postings; take-homes named in **0** DA and **0** MLE postings. The process evidence must come from employer-published guides instead (GitLab's public handbook bars are used in the career sections).

**Finding 15 — Durable tools are boring; vendor-specific surfaces are not.** Stack Overflow Developer Survey 2025 (49,000+ respondents, as published): SQL used by 59%, Git/GitHub 81%, Docker 71%; PostgreSQL the most desired and admired database for the third straight year; 46% of respondents distrust AI-tool accuracy. Microsoft retired its DP-203 data-engineering certification in March 2025 — the SQL/Spark/Git skills it tested survived; the service-specific surface did not. Kaggle's survey series ends at 2022 and is too old to cite for durability. Free practice is genuinely possible: BigQuery sandbox (10 GB storage, 1 TB queries/month, per Google's docs), Databricks Free Edition (which *replaced* Community Edition — older tutorials pointing at Community Edition are stale), Kaggle Notebooks (~30 GPU hours/week as Kaggle states), Colab free (T4; Google publishes no hour allowance), and the local open-source stack (DuckDB, PostgreSQL, dbt Core, Airflow, Spark). Snowflake has **no free tier** — only a 30-day, $400-credit trial.

## Career section 1 — Data Analyst

**Demand and trend.** No BLS occupation; proxies grow steadily on huge bases (Finding 2): the volume is real, the risk is compositional (routine reporting is the most AI-exposed part — Findings 3, 10, 11). Indeed Hiring Lab (Jan 2026, as published) reported ~45% of data & analytics postings mentioned AI terms by Dec 2025 — the highest share of any sector it tracks.

**Entry-level skill table** — sample: 25 postings opened in full 2026-11-22; 9 countries (US 9, Canada 4, Germany 3, Singapore 3, India 2, UK 1, Australia 1, Mexico 1, 1 unstated); non-tech industries 16 of 25 (healthcare ×4, retail ×4, finance/insurance ×4, media, telecom, manufacturing, non-profit). "Mention" = named anywhere; required/preferred split given where the posting separates tiers.

| Skill / tool | Postings mentioning (of 25) | Required or preferred | Depth expected (as stated in postings) |
|---|---|---|---|
| SQL | 23 (required tier 19) | Required | Working fluency: joins, aggregation; the screen, not a plus |
| Any BI / visualisation tool | 22 | Required (one of) | Tableau 13, Power BI 12, Looker 5 — build and maintain dashboards (18 name dashboard duties) |
| Data cleaning / validation / quality | 21 | Required (as duty) | Recurring duty, not a project phase |
| Stakeholder communication | 23 | Required | Present to non-technical audiences |
| Excel | 12 (required tier 10) | Required | Still a first-class tool at entry level |
| Python | 14 (required tier only 6) | Mostly preferred | Analysis support, not the primary screen |
| Named cloud warehouse/platform | 13 | Mixed | BigQuery/Snowflake/Redshift/Databricks/Azure named — analyst works on the platform, not just in the BI tool |
| Statistics concepts | 9 | Mixed | Thin: descriptive statistics spelled out in 1; A/B testing named in 1 |
| AI-assistant use | 6 | Required in at least 2 | Use AI tools *and critically evaluate output* |
| Portfolio / project work | 8 | Welcomed as experience | "Practical portfolios" named outright by UOB; "portfolio work" by SingHealth |
| dbt / Git | 2 / 2 | Preferred | Rare at DA entry level — an edge, not a screen |

**AI-driven changes.** The DA task core (gather, draft, explain) is what chatbots are measurably most used for (Finding 10); the screen response is Finding 9 — use AI, verify output. NACE's employer survey adds prompt effectiveness and revising AI outputs as screened skills.

**Proof of work and interview tasks.** Frameworks (SFIA DAAN Level 2–3; UK DDaT data analyst): clean and prep data from multiple sources, fix quality issues, build/maintain dashboards to a standard, document so others can reproduce, present to non-technical stakeholders. GitLab's published bar (its own process — one employer, not a market norm): SQL with multi-table joins, aggregation, CTEs and conditional filters. In the sample, only 3 postings state any interview task (first-call SQL questions; a short technical exercise; a cognitive assessment) and 0 name a take-home — so a course must simulate the work sample itself: a timed SQL set, a dashboard built to a brief, a findings memo.

**Durable tools.** SQL, Excel, Python/pandas (80% of data practitioners in the JetBrains/PSF Python survey 2024), one BI tool (Tableau or Power BI), a governed metrics layer (dbt's 2025 survey reports rising semantic-layer investment). Free practice: BigQuery sandbox; Power BI Desktop (free); Tableau Public (free).

## Career section 2 — Data Engineer

**Demand and trend.** Official proxies split (Finding 2) but employer-side signals are strong: WEF's #1 fastest-growing role is Big Data Specialists, and our sample shows demand spreading well beyond tech — at least 14 of 27 postings in non-tech industries. The analytics-engineer title is absorbing the warehouse-facing half of the role (Finding 4).

**Entry-level skill table** — sample: 27 postings opened in full 2026-11-22; 7 countries (US 12, Netherlands 5, UK 3, Canada 3, Germany 2, Greece 1, Italy 1); 4 analytics-engineering titles with DE duties; true new-grad roles only 3.

| Skill / tool | Postings mentioning (of 27) | Required or preferred | Depth expected |
|---|---|---|---|
| SQL | 27 | Required | Universal; includes a SQL competency test in the one posting describing its process |
| Python | 24 | Required | Pipeline code, not notebooks only |
| ETL / ELT concepts | 24 | Required | Named patterns, layers |
| Data quality / validation / testing duties | 23 | Required | dbt tests, unit/integration tests, freshness/null checks |
| Data modeling (dimensional, star, SCD) | 20 | Required | Working depth |
| dbt | 12 (hands-on required ~7) | Required/preferred | Models, tests, docs |
| Airflow | 10 (Dagster 3, Prefect 1) | Mixed | Orchestration at working depth |
| Cloud platform (any named) | 22 | Required | AWS 14, GCP 10, Azure 9 |
| Warehouse | — | Mixed | Snowflake 10, Databricks 7, BigQuery 3, Redshift 1 |
| Spark / PySpark | 8 | Mixed | Batch processing |
| Streaming (Kafka named 6; theme 9) | 9 | Mostly preferred | Present, not dominant at entry level |
| Git / CI/CD | 9 / 7 | Mixed | Named less than practised — still teach as default |
| File formats (Parquet/Iceberg/Delta) | 3 | — | Named rarely; Delta in all 3 |
| Statistics | 0 explicit | — | Not screened for |
| AI tools | 12 | Mostly duties | Coding assistants + "verify the output"; deep LLM engineering in 1 |

**AI-driven changes.** Coding assistance has shifted toward full program creation (Anthropic Economic Index: directive delegation 27% → 39%), and postings convert that into a duty to verify. METR's RCT (Finding 10) is the calibration. Databricks' GenAI blueprint adds LLM data preparation and governance at the credential level.

**Proof of work and interview tasks.** UK DDaT: entry is the full role — build/maintain ETL to established patterns with security and integrity, document source-to-target mappings, pipelines "repeatable, reliable and reusable", run quality checks and remediation, support monitoring. SFIA DENG Level 2–3 agrees. Employer-published formats are scarce (GitLab's async code review + live pairing is engineering-wide; DE-specific use unverified). Only 1 of 27 postings describes its tasks (SQL test + case study); 3–4 explicitly welcome portfolio/project evidence. A credible DE portfolio is therefore a runnable pipeline repo: ingestion, tests, docs, a backfill story.

**Durable tools.** SQL + Python/PySpark + Airflow + dbt + PostgreSQL (SO 2025's most desired/admired database) + one warehouse/lakehouse. The DP-203 retirement (Finding 15) is the standing warning against teaching a vendor surface instead of the transferable skill. Free practice: local DuckDB/PostgreSQL/dbt Core/Airflow/Spark; BigQuery sandbox; Databricks Free Edition.

## Career section 3 — Data Scientist

**Demand and trend.** The strongest official projection of the four (Finding 2: +35%, 2025–35). But the title is unstable: 6 of 26 sampled postings are analytics/BI roles and 4 lean ML engineering — the growth is real, the label is not a promise about the work.

**Entry-level skill table** — sample: 26 postings opened in full 2026-11-22; USA 11, Canada 3, Germany 3, UK 2, France 1, Netherlands 1, India 1, pan-European remote 1, unstated 3; non-tech industries the majority (finance ×4, insurance ×2, healthcare ×2, retail ×3, energy, government ×2, media ×2, logistics ×2).

| Skill / tool | Postings mentioning (of 26) | Required or preferred | Depth expected |
|---|---|---|---|
| Python | 23 | Required | Primary working language |
| SQL | 21 | Required | Data extraction at working depth |
| Stakeholder communication | 22 | Required/core duty | Present and recommend to non-technical audiences |
| Cloud platform named | 13 | Mixed | AWS/GCP/Azure/Databricks (Databricks 5) |
| Git / version control | 7 | Mixed | Expected hygiene, rarely headlined |
| BI / visualisation tool | 7 | Mixed | Secondary for DS titles |
| pandas / NumPy | 6 / 4 | Required where named | Named less than used — postings say "Python" |
| scikit-learn | 4 | Required where named | Under-named relative to survey usage (see Tools) |
| R | 4 | Preferred | Minority and shrinking in this sample |
| Experimentation / A-B testing | 6 (7 with generic "run experiments") | Required where named | The DS differentiator where it appears |
| Causal inference | 2 | Core duty where named | Rare, high-signal (research/policy, marketing measurement) |
| AI / LLM (skill, duty or requirement) | 13 | Mixed, incl. required | From GenAI-tool fluency to required LLM-agent building (1 posting) |
| Degree | Bachelor's required 14; Master's required 3; PhD required 0 | — | Quantitative field or equivalent experience accepted in several |

**AI-driven changes.** Anthropic names data scientists among occupations with prevalent AI use. The new requirement is evaluating/monitoring generative systems (Finding 12), and junior postings already name the tools (Claude Code, Codex, Cursor) and, in one case, require hands-on LLM-agent building. AI fluency is listed as "essential" by one employer (Fospha).

**Proof of work and interview tasks.** UK DDaT uniquely offers Trainee/Associate DS rungs: prepare data, explore and visualise, interpret statistical output accurately, apply standard techniques to new problems in Python/R, evaluate and compare models on proper metrics, present results and recommend a decision. In the sample: take-home/technical exercise named in 2 postings; portfolio explicitly encouraged in 1; Kaggle named as a bonus in 1; project experience valued in at least 6. No employer-published DS interview guide could be opened from an employer domain — stated as a gap, not filled.

**Durable tools.** pandas/NumPy + scikit-learn (68% of ML users in JetBrains 2024 — co-#1 with PyTorch, not a legacy skill) + SQL + notebooks + one cloud. Free practice: Kaggle Notebooks, Colab free.

## Career section 4 — AI/ML Engineer

**Demand and trend.** No official occupation; the signals are platform-side and loud (LinkedIn: AI Engineer the #1 fastest-growing US title, 2025; WEF: AI/ML Specialists #3 fastest-growing role). The UK framework's Senior/Lead-only definition and O*NET's silence mean the junior market is employer-defined — and our sample shows it splitting in two.

**Entry-level skill table** — sample: 28 postings opened in full 2026-11-22; 8 countries (US 19, Canada 4, India 3, Mexico/Colombia 1, Germany 1, Belgium/Netherlands 1); 13+ non-tech employers (insurance, banking, health, audit, professional services). Titles: Machine Learning Engineer 16, GenAI Engineer 5, AI/Applied AI Engineer 4, associates 3.

| Skill / tool | Postings mentioning (of 28) | Required or preferred | Depth expected |
|---|---|---|---|
| Python | 26 | Required | Universal |
| PyTorch | 16 | Required | The deep-learning default (TensorFlow 11) |
| Role shape | LLM/RAG-centric 12 · classical-only 12 · hybrid 4 | — | Two markets under one title family |
| Evaluation / experimentation duties | 16 | Core duty | Outranks deployment |
| Training / model development duty | 16 | Core duty | Classical half's core |
| RAG | 11 | Required where named | LLM half's core pattern |
| Prompt engineering | 9 | Required where named | Named plainly as a skill |
| Vector databases / embeddings | 8 | Required where named | |
| Agents / MCP | 7 | Mixed | Named frameworks: LangChain 6, LangGraph 4 |
| Cloud named | 14 | Mixed | AWS 12, Azure 11, GCP 7 |
| SQL | 14 | Required where named | Half the market still queries data |
| Deployment + monitoring / drift duties | 9 | Core duty where named | Less common than evaluation at entry level |
| Docker / Kubernetes | 9 / 7 | Mixed | Serving literacy |
| MLflow / FastAPI | 5 / 4 | Preferred | Named tools of tracking and serving |
| Responsible AI / governance | 6 | Mixed | Present at entry level, esp. regulated industries |
| Degree | Required 20; Master's+ 6 | — | Projects/GitHub explicitly valued in 7 |

**AI-driven changes.** The role *is* the AI change: RAG, vector search, prompt/context design, LLM evaluation, guardrails and monitoring are now examinable blueprint content (Finding 12), and AI coding assistants appear inside MLE postings themselves (5 of 28; once a hard requirement — including one GenAI associate role that requires agentic coding tools and MCP but never names Python).

**Proof of work and interview tasks.** SFIA MLNG Level 3 already expects deploying a model to production and monitoring it, communicating limitations. In the sample, only 4 postings describe any process (a pre-joining capstone at one employer; a coding challenge + candidate presentation at another); take-home and system-design rounds are named in **0** — not because they don't exist, but because postings don't say; a course should simulate the published framework bar (train, deploy, monitor, evaluate) rather than guess at formats. No employer-published MLE interview guide could be opened — gap stated.

**Durable tools.** PyTorch (66% of ML users, JetBrains 2024) + scikit-learn + Hugging Face + FastAPI + Docker (71%, SO 2025) + LLM APIs with structured output, RAG and evaluation. Free practice: Kaggle Notebooks, Colab free, Hugging Face free tier, local open-source models for small exercises.

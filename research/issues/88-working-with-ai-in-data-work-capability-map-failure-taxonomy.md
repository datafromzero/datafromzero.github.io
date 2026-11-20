# #88 Research: Working with AI in data work — capability map, failure taxonomy, and design for the core's last part

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/88 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#88](https://github.com/datafromzero/datafromzero.github.io/issues/88) (open), opened 2026-11-20

## Working with AI in data work — what AI can and cannot do, and the human knowledge that catches its mistakes

**What this is.** The last part of the advanced core — the part learners finish just before choosing a track — teaches working with AI: prompting with the data in the room, verifying AI output, and judging RAG and agents. This package strengthens that part with primary-source evidence only: benchmark papers and leaderboards (with snapshot dates), peer-reviewed studies, official reports (WEF, McKinsey, LinkedIn/Microsoft, OECD, UNESCO, NIST), and official course pages. Every figure is quoted exactly as its source states it; pre-2024 sources are flagged. Full working files are posted as comments on this issue (Clusters P, Q, R).

**The one-sentence version.** Current AI is a strong drafter and a weak authority: on tidy, well-specified tasks it performs near the ceiling of old benchmarks, and on realistic data work — big undocumented schemas, multi-step workflows, method choice, facts from memory — measured success falls to between roughly one task in five and two in three, with failures that run cleanly and look plausible. The skills that catch those failures are the fundamentals this roadmap already teaches. That is the part's thesis, and every section below is evidence for it.

---

## 1. The 10 most useful findings

1. **The capability story is a collapse curve, and one paper draws it.** The Spider 2.0 paper (ICLR 2025) measures the same o1-preview code agent at **91.2%** success on Spider 1.0 (tidy schemas), **73.0%** on BIRD (large, noisy databases), and **21.3%** on Spider 2.0's enterprise workflows (schemas of 1,000+ columns, multiple dialects, multi-step deliverables). Nothing about the model changed — the *realism* did. This single comparison is the most teachable capability fact we have.
2. **Multi-step work is where AI is worst — and where it is improving fastest.** DABstep (June 2025): the best agent scored **14.55%** on Hard multi-step analysis tasks (Easy split up to 80.56%). A 2026 preprint tabulating later leaderboard results reports Hard-split scores of 48.68–69.58% — a several-fold rise in about a year. METR's cross-year measurement explains the tempo: frontier models' 50%-completion time horizon has been "doubling approximately every seven months since 2019" (arXiv:2503.14499). Any capability number printed in a lesson needs an "as of" date; the *checks* do not expire.
3. **Statistics fails at method choice, not arithmetic.** On StatQA (NeurIPS 2024; 11,623 examples), the best model (GPT-4o) reached **64.83%**, and the paper's key finding is the error *type*: LLMs primarily make **applicability errors** — applying a test whose assumptions the data does not meet — whereas humans mostly make task-confusion errors. The AI failure a learner must catch is a confidently wrong *choice*, delivered in correct-looking output.
4. **Fabricated citations are the best-documented AI failure anywhere.** Walters & Wilder (*Scientific Reports* 2023, pre-2024): of 636 generated citations, **55%** of GPT-3.5's and **18%** of GPT-4's were fabricated, and 43%/24% of the *real* ones contained substantive errors. The failure survives grounding and newer models: retrieval-grounded legal tools hallucinated on **17–33%** of queries (Magesh et al. 2025), and a March 2026 peer-reviewed check across three current models found **28.3%** of references completely fabricated. The rule "resolve every citation or it does not exist" is not caution; it is the measured base rate.
5. **Hallucinated code furniture is measured at scale.** Spracklen et al. (USENIX Security 2025): of 2.23 million package references in LLM-generated code, **19.7%** named packages that do not exist — and 43% of hallucinated packages reappeared in all ten re-runs of the same prompt, so the invention is stable, not random. For low-frequency APIs, GPT-4o produced only **38.58%** valid invocations (CloudAPIBench). In text-to-SQL, schema linking — picking the wrong or nonexistent column — is the largest single error category, and JOIN errors the second (Pourreza & Rafiei 2023, pre-2024).
6. **Two failure classes have NO published frequency — and the part should say so.** Silent NULL mishandling / filter errors, and invented data values stated without computation, are deterministic mechanisms a learner can be shown firing on café-scale data, but no benchmark taxonomy located isolates them or states a rate. Teaching them with a borrowed percentage would be exactly the sin this part exists to prevent.
7. **AI will p-hack on request, mostly without warning.** In a documented mini-experiment (single-author preprints — flagged as unrefereed wherever used), all three frontier systems performed multiple testing, HARKing and selective reporting when asked to "find a statistically significant difference," and complied with a specification search in **57 of 60 trials**; warnings appeared in 0/20 ChatGPT trials, 13/20 Claude, 1/20 Gemini. No refereed measurement exists yet; the behavior is documented, the rate is provisional.
8. **Human + AI is, on average, worse than the better of the two alone — unless the human is the stronger party.** Vaccaro, Almaatouq & Malone's preregistered meta-analysis (*Nature Human Behaviour* 2024; 106 studies, 370 effect sizes): human–AI combinations performed significantly worse than the best of human or AI alone (Hedges' *g* = −0.23), with gains concentrated where humans alone already outperformed the AI. Combined with Dahlkemper et al. (2023, pre-2024) — students could separate wrong ChatGPT explanations from a correct expert text only where they knew the content; where they didn't, the wrong answer "was rated just as good as the sample solution" — this is the evidence chain for teaching fundamentals *before* tracks: **fundamentals are the detection instrument.**
9. **What employers reward is the human layer, stated in their own reports.** WEF *Future of Jobs Report 2025*: "AI and big data" is the fastest-growing skill, analytical thinking is the #1 core skill ("seven out of 10 companies considering it as essential"), and "two-thirds plan to hire talent with specific AI skills." LinkedIn's *Skills on the Rise 2025* puts **AI literacy #1 in the US**, measured partly by growth in paid job postings. McKinsey *State of AI 2025* (n=1,993): 51% of AI-using organisations have seen a negative consequence (inaccuracy the most common), and the highest performers are distinguished by "defined processes to determine how and when model outputs need human validation." In the EU, staff AI literacy has been a legal employer duty since 2 February 2025 (AI Act, Article 4). **Honest gap:** no primary source quantifies AI-use requirements in *data-role postings specifically* — the demand evidence is cross-industry, and the part should not invent a data-postings percentage.
10. **The pedagogy for this part already exists in the literature: planted errors, scaffolded.** A 2025 systematic review of 40 studies (Dieterich et al., *Educational Psychology Review*) finds contrasting erroneous examples "more often effective than correct examples and problem-solving," with the active ingredient being prompts to identify, explain and correct the error. For novices, errors must be **highlighted first** (Große & Renkl 2007, pre-2024) — unflagged hunts come later. And the OECD/European Commission AI Literacy Framework (draft May 2025, final 2026) names this part's exact target competency: "**Evaluate whether AI outputs should be accepted, revised or rejected**."

---

## 2. Capability map (Q1) — as of the newest evidence, 2025–2026

Classifications: **Reliable** = treat output as a draft needing checks, in the setting stated · **Unreliable** = useful, but verify every result · **Bad** = failure is the norm, or fails silently, in realistic settings.

| Task area | Class | Strongest evidence (as published) | Change |
|---|---|---|---|
| SQL generation | **Unreliable** — reliable only on clean, single-database, well-specified questions | Spider 2.0 (ICLR 2025): 91.2% (Spider 1.0) → 73.0% (BIRD) → **21.3%** (enterprise workflows); best parser on Spider 2.0-lite 5.7%. BIRD (2023, pre-2024): GPT-4 54.89% execution accuracy vs human 92.96% | Fast |
| pandas / data-wrangling code | **Unreliable** | DSBench (ICLR 2025): best agent solves **34.12%** of realistic analysis tasks. DataSciBench (2025): best of 23 models 64.51%; error analysis names hallucinated column names and non-existent functions. DS-1000 (2023, pre-2024): best system 43.3% | Fast |
| Statistics and inference | **Unreliable, leaning bad** on method choice | StatQA (2024): best 64.83%; dominant error = applicability errors. Graduate-exam study (2025): GPT-3.5 fails, GPT-4 passes, GPT-4o-mini in between — generation-dependent, uneven | Medium |
| Charts and visualization code | **Unreliable** | DataSciBench calls visualization "one of the more challenging tasks" and needs plot-validity checks + a vision-model judge to score it; no benchmark shows near-ceiling performance. Chart *choice and honesty* are unmeasured | Medium |
| Data modeling (schema, grain, keys) | **Bad — and largely unmeasured** | No primary benchmark grades schema design. Indirect: Spider 2.0 workflows presuppose exactly this understanding and are solved at 21.3%; DSBench modeling tasks leave a 34.74% performance gap for the best agent | Unknown — no benchmark |
| Pipelines / multi-step workflows | **Bad** at realistic length | DABstep (2025): best Hard-split **14.55%** (Easy up to 80.56%). TheAgentCompany (NeurIPS 2025): best agent completes 30.3% of workplace tasks autonomously | Fastest |
| ML code (end-to-end) | **Unreliable** | MLE-bench (ICLR 2025): best setup reaches ≥ Kaggle bronze in **16.9%** of competitions at pass@1, 34.1% at pass@8 — attempts and scaffolding, not single-shot reliability | Fast |
| Written analysis and explanation | **Bad** for facts and citations; fluent in form | Citation fabrication: 55%/18% (2023); 17–33% even for retrieval-grounded tools (2025); 28.3% fully fabricated across three 2026 models. Summarizing *supplied* material is the safe use; furniture from memory is not | Medium, stubborn |

**Reading the map for learners.** The pattern to teach is not "AI is bad at X" — it is *where the cliff is*: single questions against a known schema, short self-contained transformations, and prose about material the learner supplied are the strong zone. The cliff edge is realism: schemas the model cannot fully see, several dependent steps, method choice, and anything the model must recall rather than compute.

---

## 3. Failure taxonomy (Q2) — and the human check for each

| # | Failure | Documented evidence (as published) | The check that catches it |
|---|---|---|---|
| 1 | Hallucinated functions, APIs, packages, columns | 19.7% of 2.23M package references invented (Spracklen 2025); 38.58% valid low-frequency API calls (2024); schema linking = largest text-to-SQL error class (2023) | Look up every function in the docs of the *installed* version; check package names against the registry; diff every column name against the real schema |
| 2 | Plausible-but-wrong numbers; wrong grain; fan-out joins | JOIN errors = second-largest text-to-SQL failure class (2023); BIRD 54.89% vs human 92.96%; Spider 2.0 workflows 21.3%; DABstep Hard 14.55% — agents "hallucinate incorrect analysis plans" and calculate "before reading the relevant sections of documentation" | Predict row counts before running; count rows before/after every join; reconcile one headline total by an independent second path |
| 3 | Silent NULL mishandling; filter errors | **Frequency unmeasured** — no benchmark taxonomy isolates it (honest gap, finding 6). Mechanism is deterministic SQL/pandas semantics | Profile NULLs per column; `COUNT(*)` vs `COUNT(column)`; row counts around every filter; hand-check one small slice |
| 4 | Misread statistics: p-hacking, causal leaps, base rates | P-hacking compliance documented (unrefereed preprints, finding 7); CLadder: GPT-4 62.03% on causal questions vs 49.27% random baseline (2023); base-rate handling unstable across tasks (2024–2025 studies) | State hypothesis and test *before* results; count how many tests were run; recompute the headline statistic in a second tool; no causal verb without a design; every rate carries its denominator |
| 5 | Hallucinated citations | 55%/18% fabricated (2023); 47% fabricated in medical writing (2023); 58–88% hallucination on legal reference queries (2024); 17–33% for grounded tools (2025); 28.3% fully fabricated (2026) | Resolve the DOI or search the exact title and open the source; an unresolvable citation is treated as nonexistent |
| 6 | Confident narrative "slop" | Direct measurement in analysis prose: **thin**. Mechanism proven adjacently: every ChatGPT explanation in Dahlkemper et al. (2023) was "wrong, imprecise, incomplete, or misleading," yet students perceived little quality difference vs a correct expert text | Trace every number in the prose to a re-runnable output; explain-back before shipping; ask "what result would change this conclusion — did we look?" |
| 7 | Data leakage; invented data values | Leakage measured: a divergence attack recovered 10,000+ training examples from ChatGPT for ~$200 (Nasr et al., ICLR 2025). Invention: documented risk, **no published frequency** | Accept no figure not produced by code that ran against the actual data in this session; keep sensitive data out of prompts |

---

## 4. Fundamentals as detectors (Q3)

The over-reliance evidence (Cluster Q comment, Part B) in one paragraph: explanations do not reduce over-reliance — cognitive forcing functions do (Buçinca et al. 2021, pre-2024); participants with an AI assistant wrote *less* secure code while believing it *more* secure (Perry et al., CCS 2023); automation bias is measured across 74 studies in clinical decision support (Goddard et al. 2012, pre-2024) and a 2025 review finds explanations "may inadvertently reinforce misplaced trust, especially among less experienced professionals with low AI literacy" (Romeo & Conti 2025). Detection is knowledge work, and it is teachable as a routine.

| Failure | Detector (fundamental) | Learner's concrete move |
|---|---|---|
| Hallucinated functions/APIs/columns | **Reading documentation** | Find each function in the installed version's docs; `help()`/`dir()`; registry check for packages |
| Wrong numbers, grain, fan-out | **Data modeling & grain** (+ numeracy) | State expected grain and row count first; row counts around joins; independent reconciliation total |
| Silent NULL / filter drops | **SQL semantics** (three-valued logic, NaN behavior) | NULL profile; `COUNT(*)` vs `COUNT(col)`; slice checked by eye |
| Misread statistics | **Statistics** | Hypothesis before results; count the tests; second-tool recompute; causal verbs need a design |
| Hallucinated citations | **Reading documentation** (source verification) | Resolve or reject — every time |
| Narrative slop | **Domain sense** (+ numeracy, statistics) | Number-tracing; explain-back; the reversal question |
| Leakage / invented data | **Domain sense** (provenance) | No code, no number; hygiene with sensitive data |

No failure in the taxonomy is caught by prompting skill alone. Every check in the right-hand column is an application of a fundamental the roadmap teaches earlier — which is the justification, with receipts, for fundamentals before tracks.

---

## 5. What stays human (Q4)

Each item is tied to a source statement (Cluster R comment, Part A):

- **Problem framing and analytical judgment** — WEF 2025: analytical thinking is the most sought-after core skill, "seven out of 10 companies considering it as essential," ranked above every technical skill in the same report where AI skills grow fastest.
- **Choosing the goal and the metric** — McKinsey 2025: objectives are set by people; the companies seeing the most value "set growth or innovation as additional objectives" beyond efficiency and practise "tracking KPIs for AI solutions."
- **Verification, sign-off, accountability** — McKinsey 2025: high performers have "defined processes to determine how and when model outputs need human validation to ensure accuracy." NIST AI RMF (2023, pre-2024): "Human roles and responsibilities in decision making and overseeing AI systems need to be clearly defined and differentiated." Microsoft's Work Trend Index 2025 names the new universal role the "**agent boss**" — someone who "builds, delegates to and manages agents": delegation expands; answerability stays human.
- **Stakeholder trust and communication** — LinkedIn 2025: after AI skills, the most frequent growth skills are "strategic thinking, communication, and adaptability." WEF 2025 keeps "leadership and social influence" and "empathy and active listening" in the top tier.
- **Ethics and responsibility for harm** — UNESCO's AI Competency Framework (2024) makes Ethics of AI one of four aspects; the OECD/EC framework threads "fair, inclusive, and accountable use" through all domains.
- **Deciding under uncertainty** — WEF 2025: "resilience, flexibility and agility" is the #2 core skill and "the most significant differentiator between growing and declining job roles."
- **Knowing what not to delegate** — OECD/EC Manage domain: identify "what should remain a human responsibility, such as judgement, creativity, relationships, argumentation." MIT Missing Semester 2026: "Sometimes verifying code can be harder than writing the code yourself; for critical code, consider writing it by hand."

Employer demand, stated precisely (finding 9): AI literacy is the #1 fastest-growing skill in the US (LinkedIn 2025, partly postings-measured); two-thirds of employers plan to hire for specific AI skills (WEF 2025); data engineers are among the most in-demand AI-related hires (McKinsey 2025); EU employers carry a legal AI-literacy duty (AI Act Art. 4, since Feb 2025). No data-role-specific postings percentage exists in the primary literature — the part teaches the direction, not an invented number.

---

## 6. Recommended shape of the core's last part [Recommendation] — ~4 hours

Design rules from the evidence (Cluster R, Part B): a **durable spine + dated annex** (capability numbers carry "as of" dates and live in the annex; the spine names no model); **verification before generation** (every AI task ends in an explicit accept / revise / reject decision — the OECD framework's named competency); **planted errors, scaffolded** (flagged first, unflagged later); **explain-back as the assessment**; the **context pack as a standing file** (the data-work equivalent of Missing Semester's AGENTS.md); review cadence printed on the page (light review of the annex every six months, full review yearly, aligned to the annual LinkedIn/McKinsey cycle — the OECD framework itself went draft → final within about a year).

The three already-planned lessons are kept and strengthened; four are added or split out. Total ≈ 240 minutes.

| # | Lesson | One-line content | Min |
|---|---|---|---|
| 1 | The capability map, honestly | What current AI does reliably / unreliably / badly in data work, taught as the collapse curve (tidy 91.2% → enterprise 21.3%); all numbers in the dated annex | 30 |
| 2 | Prompting with the data in the room | The context pack (schema, grain, sample rows, data dictionary) maintained as a standing file; plan before code — state join keys, cardinality and grain before any code exists | 30 |
| 3 | Trust, but verify: the checking routine | Predict before you run; row counts and NULLs around every join and filter; reconcile one total a second way; confirm every function exists in the docs; end every task with accept / revise / reject | 45 |
| 4 | The failure zoo: planted-error drills | Café-dataset drills (§7), flagged errors first, then unflagged hunts; each drill ends by naming the check that catches that failure class | 60 |
| 5 | Reading AI's statistics and stories | Applicability errors; the p-hacking demonstration (ask for "a significant difference," watch the search happen); causal verbs need a design; number-tracing through AI prose; resolve every citation | 30 |
| 6 | What stays human | Framing, metric choice, accountability, stakeholder trust; the delegate / do-yourself / never-delegate sort across a dozen data tasks | 20 |
| 7 | RAG and agents: what they are, how to judge them | Retrieval grounding reduces but does not remove fabrication (17–33% even grounded); the manager-of-an-intern model; test-driven delegation; what the tracks will build on this | 25 |

**What goes to the tracks instead** [Recommendation]: building agents and RAG pipelines (MLE/DE tracks), evaluation harnesses and benchmark design (MLE/DS), LLM engineering — prompt systems, structured outputs, cost/latency trade-offs (MLE), AI-assisted experimentation practice (DS), and warehouse-scale AI code review (DE). The core teaches *judging* AI output; the tracks teach *building with* AI systems. Missing Semester 2026's structural choice is also adopted as a note for the whole roadmap: AI practice is folded into earlier parts (the Python stage's AI-assisted-code lesson) rather than siloed here — this part systematises habits, it does not introduce AI for the first time.

---

## 7. Planted-error exercises on the café dataset [Recommendation]

Each drill: the learner receives an AI-produced artefact (query, script or short analysis) containing one planted failure from §3, on the small café sales dataset whose correct answers are known. Flagged version first (the error class is named), unflagged later. Every drill ends with the learner naming the check, not just the error.

1. **The doubled revenue.** A SQL query joins orders to order_items, then sums `orders.total` — revenue comes out roughly double. (Failure 2: fan-out.) Check: row counts before/after the join; state the grain.
2. **The function that isn't.** A pandas script calls a plausible, non-existent method to compute daily totals. (Failure 1.) Check: find it in the installed version's docs — it isn't there.
3. **The vanishing unhappy customers.** A filter `WHERE rating <> 'bad'` silently drops every NULL-rated order from a satisfaction analysis; the reported average quietly improves. (Failure 3.) Check: NULL profile; `COUNT(*)` vs `COUNT(rating)`.
4. **The average of averages.** The AI averages the seven daily average-basket values to get the weekly figure. (Failures 2/4: wrong grain.) Check: recompute from raw rows; the two numbers disagree.
5. **The helpful p-hacker.** Given café sales and asked to "find what the new promotion changed," the AI tries a dozen cuts and reports the one significant result, triumphantly. (Failure 4.) Check: how many tests were run? Was the hypothesis written before the results?
6. **The confident story.** A short AI narrative: "the new menu caused weekend revenue to rise," supported by a correlation, a percentage with no denominator, and one citation that does not resolve. (Failures 4/5/6, combined — the capstone drill.) Check: number-tracing; causal verb audit; resolve the citation.
7. **The column that almost exists.** Generated SQL uses `order_total` where the schema says `total_amount` — and in one variant, binds silently to a real but wrong column. (Failure 1, SQL form.) Check: diff every name against the schema in the context pack.
8. **The number from nowhere.** The AI states "average basket size was $18.40" without running anything. (Failure 7.) Check: no code, no number — reproduce it or delete it.

---

## 8. Sources (primary only; all accessed 2026-11-19; ⚠ = pre-2024, flagged)

**Benchmarks.** Spider 2.0 — Lei et al., ICLR 2025, arXiv:2411.07763, https://arxiv.org/abs/2411.07763 · BIRD — Li et al., arXiv:2305.03111 ⚠, https://bird-bench.github.io/ · DSBench — Jing et al., ICLR 2025, arXiv:2409.07703 · DataSciBench — Zhang et al., arXiv:2502.13897 · DS-1000 — Lai et al., ICML 2023 ⚠ · DABstep — Egg et al., arXiv:2506.23719 (2025) · MLE-bench — Chan et al. (OpenAI), ICLR 2025, arXiv:2410.07095 · TheAgentCompany — Xu et al., NeurIPS 2025, arXiv:2412.14161 · StatQA — Zhu et al., NeurIPS 2024, arXiv:2406.07815 · METR, "Measuring AI Ability to Complete Long Tasks," arXiv:2503.14499 (2025).

**Failures and detectors.** Spracklen et al., USENIX Security 2025 (package hallucination) · Jain & Kwiatkowski 2024, arXiv:2407.09726 (CloudAPIBench) · Pourreza & Rafiei, NeurIPS 2023 ⚠ (text-to-SQL error classes) · Jin et al., NeurIPS 2023 ⚠ (CLadder) · Walters & Wilder, *Scientific Reports* 2023 ⚠, DOI 10.1038/s41598-023-41032-5 · Bhattacharyya et al., *Cureus* 2023 ⚠ · Dahl et al., *Journal of Legal Analysis* 2024 · Magesh et al., *Journal of Empirical Legal Studies* 2025 · *Critical Care Explorations* 2026, DOI 10.1097/CCE.0000000000001474 · Nasr et al., ICLR 2025 (training-data extraction) · Vaccaro, Almaatouq & Malone, *Nature Human Behaviour* 2024 (human–AI meta-analysis) · Buçinca et al., CSCW 2021 ⚠ · Perry et al., ACM CCS 2023 · Dahlkemper et al., *Phys. Rev. PER* 2023 ⚠ · Kawahara 2026 preprints (p-hacking compliance — unrefereed, flagged in text). Full details in the Cluster P/Q comments.

**Stays human, demand, design.** WEF, *Future of Jobs Report 2025*, https://www.weforum.org/publications/the-future-of-jobs-report-2025 · LinkedIn, *Skills on the Rise 2025*, https://www.linkedin.com/business/talent/blog/learning-and-development/skills-on-the-rise · Microsoft, *2025 Work Trend Index*, https://blogs.microsoft.com/blog/2025/04/23/the-2025-annual-work-trend-index-the-frontier-firm-is-born/ · McKinsey, *The State of AI 2025*, https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/the-state-of-ai-2025 · EU AI Act Article 4, https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-4 · NIST AI RMF 1.0 (2023 ⚠) · OECD + European Commission, *AI Literacy Framework*, https://ailiteracyframework.org (draft May 2025; final 2026) · UNESCO, *AI Competency Framework for Students* (2024) · MIT Missing Semester 2026, "Agentic Coding," https://missing.csail.mit.edu/2026/agentic-coding/ · Dieterich, Rumann & Rodemer, *Educational Psychology Review* 2025, DOI 10.1007/s10648-025-10071-x · Große & Renkl, *Learning and Instruction* 2007 ⚠, DOI 10.1016/j.learninstruc.2007.09.008 · DeepLearning.AI course pages (2023 ⚠ / 2024). Full details in the Cluster R comment.

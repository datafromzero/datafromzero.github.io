# #87 Research: Skill profiles of the four data roles — evidence check for the "choose your track" page

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/87 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#87](https://github.com/datafromzero/datafromzero.github.io/issues/87) (open), opened 2026-11-20

## Skill profiles of the four data roles — evidence check for the "choose your track" page

**What this is.** The track-choice page shows the four roles (Data Analyst, Data Engineer, Data Scientist, ML/AI Engineer) scored 1–5 on a set of skills (1 = not needed at entry, 5 = the skill that defines the role). The team's draft scores were judged from earlier internal research (issues #71, #32, #73). This package checks them against outside evidence: a named sample of **45 real job postings** (Indeed + LinkedIn; US 15, UK 15, India 15; DA n=10, DE n=12, DS n=11, MLE n=12, coded 2026-11-19 under a strict rule — an axis counts only when the posting text explicitly names the skill), **O\*NET** importance ratings for six occupation anchors, three official frameworks (**UK DDaT**, **SFIA 9**, **ESCO**), degree-curriculum evidence for the mathematics question, time-allocation surveys for the misjudgments, and the visualization literature for the chart-form question. Full working files are posted as comments on this issue (Clusters J, K, L).

**Honesty notes up front.** (1) No percentages appear except figures published by a named source, quoted with its sample and date. (2) O\*NET has **no rated item** for SQL, ML, pipelines, cloud, experiments or visualization — scores on those axes rest on postings and frameworks, and any O\*NET-derived number there would be invented. (3) MLE has the weakest footing of the four roles: O\*NET has no ML-engineer occupation (the Software Developers proxy was measured and *rejected* — it rates mathematics *below* the BI Analyst occupation, inverting every curriculum source), DDaT defines MLE only at Senior/Lead grades, and ESCO has no such occupation (it is an alternative label for "artificial intelligence engineer"). Treat every MLE cell as one notch softer than its stated confidence. (4) ESCO skill lists were read via a verbatim republication under ESCO's open licence because the portal is JavaScript-rendered; re-verify against the live portal before external publication. Judgments are marked **[Recommendation]**.

---

## 1. The 10 most useful findings

1. **The draft's biggest problem is a missing axis, not a wrong score.** Visualization and storytelling is DA's joint-most-demanded skill in postings (10/10, tied with SQL; 0/12 for both DE and MLE) and a standalone named skill in DDaT and SFIA 9 (VISL, whose update adds "narratives and storytelling around data") — and the draft has no axis for it. Without it, the DA profile is missing its peak.
2. **No original score moves by more than one point.** The draft's judgment was broadly sound. The moves: DS ML and modeling 4→5 (postings 11/11 — definitional); MLE Statistics 3→4 and MLE Pipelines 3→4 (on the merged axis, §3); DA Statistics 2→3; DS Experiments 4→3; DA/DS Pipelines 1→2 each. Everything else stands.
3. **"Cloud/infrastructure" should not be its own axis — merge it into Pipelines.** Postings bundle the two (DE: pipelines 12/12, cloud 11/12, usually in the same sentence); as separate axes they would trace near-identical shapes for DE. The merged axis reads "Pipelines, platforms and cloud."
4. **"Domain knowledge" should not be an axis either.** Explicit entry demand is near-flat (postings: DA 1/10, DE 2/12, DS 3/11, MLE 0/12; would-be scores 3/1/2/1) because at entry it is an employer-context layer — which industry hires you — not a skill a track teaches. Handle it in one prose sentence on the page.
5. **Experiments is the weakest-evidenced axis on the chart.** No framework names a skill for experimental design, A/B testing or causal inference for any role, and O\*NET has no item at all; the scores rest on postings alone, where the demand is rare (DS 2/11 — both specialist postings). **[Recommendation]** Keep the axis, renamed **"Experiments and A/B testing"** ("causality" is jargon a beginner cannot picture), but do not present its scores with the same confidence as the others. It survives because it is DS's clearest secondary differentiator.
6. **The frameworks disagree about what a data scientist *is* — follow the postings.** ESCO defines a research scientist (63 essential skills, roughly a third academic-research activities: grant applications, publishing, IP management); DDaT defines a product-delivering practitioner (8 skills, ML not even named); SFIA defines a modelling specialist. The postings side with DDaT/SFIA — business problems, ML + statistics, zero research-career content. The page's DS is the practitioner.
7. **"Math-heavy, like a master's" is true for two roles and wrong for two.** DS: fits (mathematics is O\*NET's #1 knowledge item for the occupation, IM 88; 44% of new hires were reported as master's-required). MLE: fits at the ceiling (CMU's MS in Machine Learning assumes a year of probability/statistics plus matrix algebra and multivariate calculus *before entry*, with Convex Optimization in the core). DA: overstated (entry math is intuition-level statistics; DDaT rates the associate grade at Awareness, its lowest level). DE: **overstated the most** — DDaT lists no mathematics or statistics skill for data engineers at *any* seniority, and a named DE master's (UW–Madison) builds its required core entirely from systems courses. DE is code-heavy, not math-heavy. Detail in §4.
8. **Calculus — the topic beginners fear most — is the least load-bearing of the five math topics.** No role needs it at entry except MLE (working fluency, because backpropagation is the chain rule). DS master's cores ask only a "basic grounding" (Columbia) or one undergraduate course (Georgia Tech OMSA prerequisites). DA and DE ask for none at any level checked.
9. **The #1 misjudgment in every role is the same: data preparation is the plurality of the job and the headline skill is a minority of the week.** Anaconda's 2022 survey (3,493 respondents; time-allocation n = 1,966): preparation + cleansing 37.75% of time, against ~26.44% for *all* model work combined. The famous "80% cleaning" figure is a 2016 CrowdFlower survey of ~80 data scientists (60% cleaning/organizing + 19% collecting, added together by Forbes) — cite it, if at all, as a small 2016 survey. Per-role warnings in §5.
10. **The radar chart is the wrong primary form for this page — the evidence is one-directional.** In the only controlled study of exactly this data genre (multi-dimensional *profile* data), Albo et al. (IEEE TVCG 2016) found the radar chart "the least effective and least liked" of the designs tested; an eye-tracking study (Applied Ergonomics 2023) found radar the worst of five chart types at information extraction. The geometry agrees: one fixed set of values covers 43% of the polygon under one axis order and 21% under another (Plotly's guide demonstration) — the "shape" a beginner reads is partly an artefact of axis order. **[Recommendation]** Grouped horizontal bars as the primary form; conditions for keeping a radar as a secondary element in §6.

---

## 2. Recommended axes [Recommendation]

Eight axes — the draft's seven, with one merge, one rename, one addition; domain knowledge rejected. Each axis was checked for collapse (an axis demanded equally by all four roles is useless on a comparison chart): none of the eight collapses. The genuinely flat material in the sources — O\*NET's generic activities (Analyzing Data 80–96, Working with Computers 86–99 for every occupation) — maps to no axis, correctly: that is the shared core the learner has already finished.

| # | Axis (page name) | Change vs draft |
|---|---|---|
| 1 | Statistics and math | Keep |
| 2 | Experiments and A/B testing | Renamed from "Experiments and causality" |
| 3 | ML and modeling | Keep. Watch item: LLM/GenAI demand (RAG, agents) is growing inside this axis in MLE/DS postings; split only if it keeps growing |
| 4 | Software engineering | Keep |
| 5 | Pipelines, platforms and cloud | Merged: draft "Pipelines and platforms" + candidate "Cloud/infrastructure" |
| 6 | SQL and data modeling | Keep |
| 7 | Business communication | Keep |
| 8 | Visualization and storytelling | **Added** |

---

## 3. Recommended scores, with the evidence per cell

Scale: 1 = not needed at entry · 5 = the skill that defines the role. Confidence is per row. Postings counts are x/n from the named sample (§ header); O\*NET figures are importance ratings (0–100).

| Axis | DA | DE | DS | MLE | Confidence |
|---|---:|---:|---:|---:|---|
| Statistics and math | **3** | **2** | **5** | **4** | Medium |
| Experiments and A/B testing | **2** | **1** | **3** | **1** | Low |
| ML and modeling | **1** | **1** | **5** | **5** | High |
| Software engineering | **2** | **4** | **3** | **5** | High |
| Pipelines, platforms and cloud | **2** | **5** | **2** | **4** | High |
| SQL and data modeling | **4** | **5** | **3** | **2** | High |
| Business communication | **5** | **2** | **4** | **2** | Medium |
| Visualization and storytelling | **5** | **1** | **3** | **1** | High |

**Statistics and math — 3/2/5/4.** DA 3: postings name statistical techniques in only 1/10 ads (they phrase the requirement as tools and degrees), but O\*NET rates BI Analysts' Mathematics Knowledge 71 and all three frameworks make statistics a named core DA skill — applied/descriptive statistics, hence 3 not 4. DE 2: postings 0/12 and ESCO lists statistics as *optional only* for DE; O\*NET's Mathematics Knowledge 67 for Database Architects is general math for an architect-skewed occupation, not a statistics demand; 2 records "quantitative fluency, no statistics." DS 5: postings 9/11; O\*NET Mathematics Knowledge 88 / Skill 85 — the widest clean separation in the entire extract. MLE 4: postings phrase the work as frameworks, not statistics (3/12), but DDaT holds MLE to the same applied-maths skill as DS at a Practitioner floor, and the curriculum evidence (§4) is fluency-level.

**Experiments and A/B testing — 2/1/3/1 (Low).** Postings only: DA 1/10, DE 0/12, DS 2/11 (Apple causal inference/incrementality; NiCE experimental design — both specialist), MLE 0/12. DS keeps the peak at 3, not the draft's 4: experimentation is a specialism within DS, not a default entry demand. No framework or O\*NET corroboration exists for any cell in this row.

**ML and modeling — 1/1/5/5.** DA 1: postings 2/10 (light predictive mentions); no framework gives DA an ML skill. DE 1: postings 1/12. DS 5 (raised from 4): postings 11/11; O\*NET DS model-validation tasks rate 81/76; core in all three frameworks. MLE 5: postings 12/12; SFIA's MLNG is a standalone skill; DDaT's role definition is the ML lifecycle. DS and MLE tie here — they separate on Statistics (5 vs 4) and Software engineering (3 vs 5), not on ML.

**Software engineering — 2/4/3/5.** The cleanest analyst-vs-engineer separator in the sources (O\*NET Programming spread: 25–38 for analyst anchors vs 60–75 for engineering anchors). DA 2: postings 0/10 under strict coding, but DDaT names "Developing code for analysis" — code exists, engineering craft barely does. DE 4: postings 9/12 (clean/tested code, Git, production-ready code named explicitly). DS 3: the row's live disagreement — postings 1/11 vs O\*NET Programming 69 and DDaT's "Programming and build (data science)"; entry DS coding is real but notebook-grade, hence the midpoint. MLE 5: postings 8/12 with the strongest wording in the sample (well-tested, well-documented code; CI/CD; code review); ESCO makes Python essential for the AI-engineer occupation — the only ESCO data role with a named language.

**Pipelines, platforms and cloud — 2/5/2/4.** DA 2 (raised from 1): a substantial minority of DA ads (4/10 pipelines, 4/10 cloud) ask ETL/warehouse awareness. DE 5: pipelines 12/12 — the sample's only unanimous axis — and cloud 11/12; core in all three frameworks. DS 2 (raised from 1): DS ads do ask for pipeline building (5/11) and DDaT gives DS a full "Data engineering" skill; cloud alone would score 1 (1/11) — the merged score is carried by pipelines. MLE 4 (raised from 3): pipelines 6/12 + cloud 5/12 with Docker/Kubernetes/MLOps named; SFIA's MLNG has MLOps at its core. Deployment is half the MLE job in every source that describes the work itself.

**SQL and data modeling — 4/5/3/2.** DA 4: postings 10/10 (unanimous); held at 4 because the modeling half is light for DA and visualization/communication are its defining pair. DE 5: postings 11/12; data modelling is a named DDaT skill and ESCO-essential. DS 3: postings 8/11 — a working requirement, not the differentiator. MLE 2: postings 3/12; DDaT lists no SQL skill for MLE at all.

**Business communication — 5/2/4/2 (Medium).** DA 5: postings 9/10; DDaT carries two communication/impact skills for DA; O\*NET's analyst anchors top the outward-communication items (Interpreting the Meaning of Information for Others 89/95 vs 63–69 for the technical occupations). DE 2: postings 0/12 pull toward 1, but DDaT names the skill for DE at Awareness — its lowest entry bar — so 2 records "present, minimal, grows with seniority." DS 4: postings only 3/11, against DDaT's "Delivering business impact" and O\*NET DS Interpreting 87 + presentations task 80 — frameworks describe the job's *output* (influence decisions) while ads describe its *inputs* (tools); 4 follows the frameworks, flagged Medium for exactly that tension. MLE 2: postings 0/12; DDaT's Practitioner communication floor describes senior MLEs and was not allowed to lift the entry score.

**Visualization and storytelling — 5/1/3/1.** DA 5: postings 10/10 (see finding 1); O\*NET task evidence peaks for the analyst anchors (BI "generate reports" 91). DE 1: postings 0/12; no framework gives DE a visualization skill. DS 3: postings 4/11; O\*NET DS visualization task 83; ESCO makes "deliver visual presentation of data" essential for DS. MLE 1: postings 0/12; DDaT and SFIA give it nothing.

---

## 4. Mathematics depth per track (Q3)

Depth key: **None** · **Intuition** (read and use results produced by tools/others) · **Fluency** (derive and compute by hand) · **Theory** (proofs, asymptotics). Entry level = first job in the role.

| Role | Probability | Inference | Linear algebra | Calculus | Optimization |
|---|---|---|---|---|---|
| DA | Intuition | Intuition | None | None | None |
| DE | None | None | None | None | None |
| DS | Fluency | Fluency | Fluency | Intuition | Intuition |
| MLE | Fluency | Fluency | Fluency | Fluency | Fluency |

Basis, briefly (full file: Cluster K comment). DA: O\*NET Mathematics Skill 63 / Knowledge 71 (mid-pack, 17–22 points below DS); DDaT associate grade at Awareness for "Applying statistical and analytical tools and techniques"; no source at any DA level names linear algebra, calculus or optimization. DE: DDaT lists no mathematics/statistics skill at any of its four DE levels; UW–Madison's MS in Data Engineering core is distributed systems, big-data systems and databases — no mathematics course. DS: O\*NET Mathematics Knowledge 88 (the occupation's #1 knowledge item), Skill 85; Columbia's MS in Data Science core (probability & statistics; statistical inference & modeling) assumes "a working knowledge of calculus and linear algebra"; Georgia Tech's OMSA requires one college course each in calculus, linear algebra and probability/statistics before admission. MLE: rests on curricula because the O\*NET proxy fails (finding in the header notes) — CMU's MS in Machine Learning assumes a year of probability/statistics, matrix algebra and multivariate calculus, with Convex Optimization and Probability & Mathematical Statistics in the core.

**Ceiling notes.** Theory depth lives only at the research end of DS/MLE. DS seniority raises fluency, not theory, except in research roles; DDaT even drops Head of Data Science back to Practitioner on applied maths (leadership dilutes hands-on depth). DA's ceiling grows *inside* statistics (experimentation specialists reach inference fluency) and never into calculus/linear algebra — the math-heavy analytics credential that exists (MIT Sloan's MBAn, with convex optimization in its core) is an elite credential, not the job. DE's ceiling stays flat in math at every level checked.

**Survey caveat.** Neither flagship survey can support a per-role math claim: Kaggle's latest edition is 2022 and its published summary covers only the ~2,000 "data scientist"-titled respondents' tools (per-role education breakouts exist only in the raw dataset, computed by third parties); Stack Overflow's 2025 survey publishes education and role as separate overall distributions with no data-role cross-tab. The one published education figure that does exist is O\*NET's: for Data Scientists, 44% of new hires were reported as master's-required (48% bachelor's, 4% associate's).

**Honest one-line math messages for the track pages [Recommendation].**
- **DA:** "The math here is friendly statistics — averages, percentages, charts, and reading A/B test results honestly; no calculus, no linear algebra, no master's required."
- **DE:** "This is a software job, not a math job: the hard part is code and systems, and you can start with none of the five classic math topics."
- **DS:** "This is the math track: probability and statistics you can compute by hand, plus working linear algebra — deep enough to matter, but learned one topic at a time, not a master's degree up front."
- **MLE:** "The most math-heavy track: probability, linear algebra, multivariable calculus, and optimization at real working fluency — the closest of the four to a master's in machine learning."

So the site-wide message should be retired as a blanket claim **[Recommendation]**: "math-heavy, like a master's" is the DS/MLE story. DA's story is statistics-with-judgment; DE's story is engineering. A single warning label for all four tracks scares off exactly the beginners the DA and DE tracks fit.

---

## 5. What career switchers misjudge (Q4) — the page's warnings

Full sourced list: Cluster L comment. The strongest warning per role, plus the cross-role one:

- **All roles — the headline skill is a minority of the week.** Data preparation is the plurality activity in every survey (§1, finding 9); communication is the second surprise (Anaconda 2022: reporting/presentation 16.20% + visualization 12.99% ≈ 29% of time). And titles mislead: role content varies sharply by employer (Built In notes "little consistency between employers about what they call these roles") — choose by the work described, not the title's prestige.
- **DA — "the job is analysing and building dashboards."** Most of the time goes *before* the analysis: cleaning and validating data, fighting over which definition of a metric is right, clarifying what the request even asks — and a share of finished dashboards are never used at all. It is partly a customer-service job (practitioner essays, Towards Data Science / Data With Sarah [community]; corroborated by the Anaconda time split).
- **DS — "the job is building models."** All model work combined is ~26% of the week (Anaconda 2022); the rest is cleaning, ad-hoc requests ("pull this number for tomorrow's meeting"), and selling results to decision-makers who are often not data-literate (Anaconda 2021: only 36% of respondents called their decision-makers "very data literate").
- **MLE — "it's data science with more models."** It is software engineering that specialises in ML — "a software developer first and a machine learning expert second" (Built In). In production systems the ML code is a small fraction of the whole; the job is the surrounding system and its maintenance (Sculley et al., "Hidden Technical Debt in Machine Learning Systems," NeurIPS 2015 — stated qualitatively in the paper; the "only 5% is ML code" figure often attached to it does **not** appear there and should not be quoted).
- **DE — "it's backend software engineering with different tools."** The centre of gravity is SQL and data modelling, and correctness of *data* rather than correctness of *logic* (Intuit engineering blog; Petralia [community]). Much of the week is invisible plumbing: last night's failed pipeline, a dashboard number that looks wrong, validation checks — noticed only when it breaks (DASCA career-path guide).

---

## 6. Chart form (Q5) [Recommendation]

**Primary form: grouped horizontal bars** — one group per skill (8 groups), four bars per group (DA, DE, DS, MLE in a fixed order and fixed colours), all on the shared 1–5 scale, with the number printed at the end of each bar. The page's primary reading task is per-skill comparison across roles ("which role needs the most SQL?"), which is exactly the task radar performs worst at in every empirical test found and bars perform best at (Cleveland & McGill's perceptual hierarchy: position on a common scale is judged most accurately; angle and area — radar's encodings — least). Acceptable alternative: **small multiples** — four panels, one per role, each showing that role's eight skills as bars on the identical scale — if the design wants per-role profiles.

**If a radar is kept anyway** (secondary/decorative only), the conditions from the sources: never overlay all four roles (one role per chart, at most two overlaid); one fixed axis order everywhere; identical 1–5 scale with labelled gridlines; no area fill, or only a very light one; print the numbers beside it; and never invite "bigger shape = better role" readings in the text — the shape is partly an artefact of axis order (§1, finding 10).

One design note: our lessons are static pages with no JavaScript in lessons. A bar chart is a static image or pure CSS; nothing in this recommendation requires interactivity.

---

## 7. Open questions for the design brainstorm

1. **DS communication: 4 (frameworks) or 3 (postings)?** The frameworks describe the job's output, the ads its inputs. If the page's promise is "what the job is really like," 4 stands; if "what gets you hired," 3 is defensible. The table takes 4, Medium confidence.
2. **Does the Experiments axis earn its place at Low confidence**, or should it fold into Statistics with a note that A/B testing is a DS specialism? Keeping it is this package's recommendation — but it is the one axis whose scores a single new evidence source could move.
3. **When does the ML axis split?** LLM/GenAI work (RAG, agents, LLM frameworks) already appears inside MLE and DS postings. A future "GenAI and LLM systems" axis would change MLE's shape most; the split trigger needs a rule (e.g. appears in a majority of MLE postings in a re-sample).
4. **Re-sample cadence.** The posting sample is dated 2026-11-19 and entry-level MLE evidence is the thinnest. A yearly re-sample of the same boards/countries would keep the page honest; the MLE column should be revisited first.
5. **Retire the blanket "math-heavy" line?** §4 recommends per-track messages instead. That changes track-page copy beyond this page — owner call.

---

## 8. Sources (all accessed 2026-11-19)

**Postings sample (45; full per-posting log in the Cluster J comment):** Indeed — indeed.com, uk.indeed.com, in.indeed.com · LinkedIn Jobs public pages (5 postings coded from search-indexed text; truncation limitation stated in Cluster J).

**O\*NET OnLine (importance ratings):** Data Scientists https://www.onetonline.org/link/details/15-2051.00 · Business Intelligence Analysts https://www.onetonline.org/link/details/15-2051.01 · Market Research Analysts https://www.onetonline.org/link/details/13-1161.00 · Database Architects https://www.onetonline.org/link/details/15-1243.00 · Data Warehousing Specialists https://www.onetonline.org/link/details/15-1243.01 · Software Developers (MLE proxy — measured, then rejected for math; used with flags elsewhere) https://www.onetonline.org/link/details/15-1252.00

**Frameworks:** UK DDaT Capability Framework — https://understand-digital-data-roles-skills.service.gov.uk/ (role pages: data-analyst, data-engineer, data-scientist, machine-learning-engineer) · SFIA 9 — https://sfia-online.org/en/sfia-9/skills/data-engineering · /data-science · /machine-learning · /data-analytics · ESCO — https://esco.ec.europa.eu/ via CareerLab's verbatim republication under ESCO's open licence, https://careerlab.onskilldemand.com/careers/ (portal JavaScript-rendered; re-verify before external publication).

**Curricula (math depth):** CMU MS in Machine Learning — https://ml.cmu.edu/academics/primary-ms-machine-learning-masters and /machine-learning-masters-curriculum · Columbia MS in Data Science — http://bulletin.columbia.edu/columbia-engineering/academic-departments-programs/data-science/graduate-programs/ · Georgia Tech OMSA — https://www.analytics.gatech.edu/admissions · UW–Madison MS in Data Engineering — https://pdc.wisc.edu/degrees/data-engineering-ms/ · MIT Sloan MBAn (ceiling case) — via GMAC program profile.

**Surveys:** Anaconda, *State of Data Science* 2022 — https://know.anaconda.com/rs/387-XNW-688/images/ANA_2022SODSReport.pdf (2020/2021 editions via BigDATAwire and InfoWorld coverage) · CrowdFlower, *2016 Data Science Report* (via contemporaneous coverage; dated and decomposed in Cluster L) · Kaggle ML & DS Survey 2022 — https://www.kaggle.com/c/kaggle-survey-2022 · Stack Overflow Developer Survey 2025 — https://survey.stackoverflow.co/2025/developers

**Misjudgments:** KDnuggets, "Data Science Career: 7 Expectations vs Reality" — https://www.kdnuggets.com/2022/06/data-science-career-7-expectations-reality.html · Built In, "Machine Learning Engineer vs. Data Scientist" — https://builtin.com/articles/machine-learning-engineer-vs-data-scientist · Sculley et al., NeurIPS 2015 — https://proceedings.neurips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf · Intuit Blog, "Data Engineer vs. Software Engineer" — https://www.intuit.com/blog/innovative-thinking/data-engineer-vs-software-engineer/ · DASCA, "The Data Engineering Career Path" — https://www.dasca.org/world-of-data-science/article/the-data-engineering-career-path-what-beginners-should-expect · Towards Data Science and Data With Sarah essays [community] — URLs in Cluster L.

**Chart form:** Albo, Lanir, Bak & Rafaeli, *IEEE TVCG* 22(1), 2016 — https://doi.org/10.1109/TVCG.2015.2467322 · Abeynayake et al., *Applied Ergonomics* 109, 2023 — https://doi.org/10.1016/j.apergo.2023.103996 · Diehl, Beck & Burch, *IEEE TVCG*, 2019 · Heijungs, *Braz. J. Chem. Eng.* 39, 2022 · *Significance* (RSS), "Off the 'radar'? Here are some alternatives" — https://significancemagazine.com/off-the-radar-here-are-some-alternatives/ · Plotly, "Radar Charts: A Complete Guide" (2026) — https://plotly.com/blog/radar-chart-guide/ · Datawrapper Blog, "Personalities on the radar" — https://www.datawrapper.de/blog/radar-chart-personalities

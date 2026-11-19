# #32 Research: career quiz (data careers)

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/32 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#32](https://github.com/datafromzero/datafromzero.github.io/issues/32) (closed), opened 2026-11-17

## Type

Curriculum gap

## Summary

## Career quiz research — a direction suggestion for beginners, built on O*NET data

**Type:** Content research (new page). **Priority:** Medium. **Affected pages:** none yet — this research feeds the planned `/career-quiz/` page, which does not exist yet.
**Access date for every source below: 2026-11-16.** Every fact comes from a page opened that day. No salary, wage, growth or demand figures appear anywhere in this research, by design: the quiz must not make those claims.
**Scope note:** the quiz covers **four** careers — Data Analyst, Data Engineer, Data Scientist, ML/AI Engineer. Analytics Engineer was removed from the quiz by an owner decision on 2026-11-16 and is out of scope here.

## 1. Framework and occupation codes used

**Framework:** the quiz is *inspired by* the interest-matching approach of the O*NET Interest Profiler (National Center for O*NET Development, sponsored by the US Department of Labor, Employment and Training Administration), which measures John Holland's six interest areas — Realistic, Investigative, Artistic, Social, Enterprising, Conventional (RIASEC) — by asking people how much they would *like* doing single work activities, then matching the *shape* of the person's profile against each occupation's own interest profile. Our quiz borrows that idea (match on what a person enjoys, not on what they can already do) at a much smaller scale: 10 original questions, written for this site, mapped to four careers using O*NET occupation data (see §2 for why that is permitted). It is not the Interest Profiler, not a RIASEC instrument, and must never be presented as one.

**Occupation anchors.** O*NET has no occupation titled "Data Analyst", "Data Engineer" or "ML/AI Engineer", so each quiz career is anchored to the closest real O*NET occupation(s). One correction to the original brief, verified on O*NET Online: **Business Intelligence Analysts is 15-2051.01, under Data Scientists — not under 13-1161** (13-1161.01 is Search Marketing Strategists).

| Quiz career | O*NET anchor(s) | Why |
|---|---|---|
| Data Analyst | Business Intelligence Analysts — **15-2051.01** (primary); Market Research Analysts and Marketing Specialists — **13-1161.00** (cross-check) | BI Analysts is the closest match to the modern analyst job: reports, dashboards and business data for stakeholders. Market Research Analysts covers the survey/consumer end. |
| Data Engineer | Database Architects — **15-1243.00** (primary); Data Warehousing Specialists — **15-1243.01** and Database Administrators — **15-1242.00** (secondary) | Database Architects' reported job titles on O*NET include **"Data Engineer"** — the only direct title evidence in the set. The other two cover the warehouse/pipeline and operations sides. |
| Data Scientist | Data Scientists — **15-2051.00** (primary); Statisticians — **15-2041.00** (cross-check) | Exact title match; Statisticians confirms which signals are deep statistics rather than applied data science. |
| ML/AI Engineer | Software Developers — **15-1252.00** (neighbor) + Data Scientists — **15-2051.00** (overlap) | No standalone ML/AI Engineer occupation exists in O*NET; searches for the title resolve to Data Scientists. The building half of the job is best represented by Software Developers, the modeling half by Data Scientists. **This is the blurriest boundary in the set — treat ML/AI trait claims as medium confidence.** |

BLS Occupational Outlook Handbook pages were used as an independent day-to-day cross-check (Data Scientists exactly; the other three are labeled proxies, because BLS likewise has no "Data Analyst", "Data Engineer" or "ML/AI Engineer" occupation). See the source table.

## 2. What we may use — licensing, checked against the official terms

O*NET material sits under two different regimes, and the distinction decides how this quiz must be built:

- **The O*NET Database** (occupation facts: tasks, work activities, work styles, interests) is **CC BY 4.0**: "You are free to copy or adapt the information from this database, as long as you: credit the O*NET 31.0 Database and the U.S. Department of Labor, Employment and Training Administration as the original source, link to the license, and indicate where any changes were made to the original." The trait profiles in §3 are adapted from that database, so the quiz page must carry the prescribed credit (modified-information version): *"This page includes information from the O*NET 31.0 Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the CC BY 4.0 license. O*NET® is a trademark of USDOL/ETA. Data From Zero has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these modifications."*
- **The Interest Profiler itself** (its items and scoring materials) is different: verbatim copying is allowed only under **CC BY-ND 4.0** (no modified redistribution), and modifying or extending the tools requires the **O*NET Tools Developer License** — royalty-free, but it mandates the attribution notice above **and a formal validation study** before launch, conducted to the *Standards for Educational and Psychological Testing*.
- **Our approach stays clear of both traps:** the quiz's questions are wholly original and copy no Interest Profiler items, scoring materials or database text, so neither tool license is triggered; the occupation *data* behind the career profiles is used under CC BY 4.0 with the credit above. Two standing cautions: never imply that USDOL/ETA endorses or tested this quiz, and use "O*NET" only as an adjective in credits, never as a noun or in possessive form (it is a USDOL/ETA trademark).
- Optional, zero-risk addition the O*NET Center itself offers: link readers who want the real, validated instrument to the free Mini Interest Profiler on My Next Move.

## 3. What distinguishes each career (the quiz may only separate careers on these)

Scores are O*NET's 0–100 ratings from each occupation's own page (importance/impact/interest ratings — they compare occupations with each other; they are not percentages of workers).

### Data Analyst — the business-facing explainer
- Enterprising interest **57** (BI Analysts) and **75, leading the profile** (Market Research Analysts), vs **12–34** for every non-analyst occupation in the set.
- Business interest areas that appear nowhere else: Finance 58, Accounting 55, Business Initiatives 50 (BI Analysts); Marketing/Advertising 92 (Market Research Analysts).
- Signature tasks: "Generate standard or custom reports summarizing business, financial, or economic data for review by executives, managers, clients, and other stakeholders"; maintain dashboards and BI tools.
- BLS cross-check agrees: gather data, analyze it, convert findings into tables, graphs and reports, present to clients and management.

### Data Engineer — the reliability builder
- The only cluster where **Conventional interest (85–94)** matches or beats Investigative; Information Technology interest **93–95** paired with Mathematics/Statistics of only **37–50** — the inverse of the scientist profile.
- Cautiousness **69–82** (Database Administrators' 82 is the set's highest) and Dependability **84–88**; Innovation (41) and Tolerance for Ambiguity (44) bottom out here.
- Signature tasks: develop database architectures; design for "scalability, security, performance, and reliability"; warehouse process models (sourcing, loading, transformation, extraction); security measures and user access levels.
- BLS cross-check agrees: design and build storage systems, keep them efficient and error-free, secure and back up data, make data easy for users to reach.

### Data Scientist — the open-question investigator
- Investigative interest **100** (Data Scientists) — the set's ceiling; Mathematics/Statistics specific interest **98** (Data Scientists) and **100** (Statisticians), vs 37–69 for all others.
- Tolerance for Ambiguity **66** — the set's highest. Innovation 81 vs 41–68 in the engineer cluster.
- Signature task found nowhere else: "Test, validate, and reformulate models to ensure accurate prediction of outcomes of interest."
- BLS cross-check agrees: choose and clean data, build/test/update statistical and ML models, visualize findings, recommend actions to stakeholders.

### ML/AI Engineer — the tool builder (medium confidence — see §1)
- Realistic interest **44** (Software Developers) vs 1–32 for all others; Engineering specific area **61** vs 13 or less everywhere else; "Thinking Creatively" ranked 4th among work activities (83) — no other occupation places it that high; Innovation **84**, the set's highest.
- Signature tasks: analyze user needs and software requirements; develop testing/validation procedures; design and modify software systems.
- BLS cross-check agrees (Software Developers): design applications piece by piece, write and test code, maintain and document after release, work in teams.
- The usable separator from Data Scientist is the **output**: models and analysis (scientist) vs working software systems that other people run (engineer).

### Two clean axes the questions exploit
1. **Math depth:** Mathematics/Statistics interest runs **98–100** (scientist) → **56–69** (analyst) → **37–50** (engineer) — the cleanest Analyst-vs-Scientist separator in the data.
2. **Explaining vs building:** "Interpreting the Meaning of Information for Others" scores **87–95** for analyst and scientist occupations but only **62–63** for Database Architects and Administrators — it separates {Analyst, Scientist} from {Engineer}, though not Analyst from Scientist.

## 4. Shared by all four — deliberately NOT used to separate careers

Working with Computers, Analyzing Data or Information, Processing Information and Getting Information are top work activities in every anchor occupation (scores 73–99); Attention to Detail is the **#1 work style in all eight** occupations read, with Dependability and Intellectual Curiosity in every top set; Investigative + Conventional are the top two interest types in 7 of 8. These describe data work in general. The quiz asks nothing that merely measures them — and the result page says all four careers share them (see §7).

## 5. Draft question set — 10 questions, original wording

Plain American English; no tool names, no jargon, nothing that needs technical knowledge; every option describes real work someone has to do, so no option is the obviously "smart" one. Weights: **2** = the career the option fits best, **1** = a close second. DA = Data Analyst, DE = Data Engineer, DS = Data Scientist, ML = ML/AI Engineer. Each question has exactly one 2-point option per career.

**Q1. You are helping a small shop make sense of a year of sales records. Which part would you most enjoy?**
- A. Putting the messy records in order, so the numbers can be trusted. — DE 2, DA 1
- B. Finding the story in the numbers and showing the owner what it means. — DA 2, DS 1
- C. Testing ideas about what drives sales, and checking whether they hold up. — DS 2, ML 1
- D. Building a small tool that answers the owner's questions automatically. — ML 2, DE 1

**Q2. Which workday sounds better to you?**
- A. A clear checklist: the same reports run every morning, and they have to be right. — DE 2, DA 1
- B. An open question nobody has answered yet, with no instructions for how to start. — DS 2, ML 1
- C. A question from a manager in the morning, and a clear answer by the end of the day. — DA 2, DS 1
- D. A long project building something new that people will use every day. — ML 2, DE 1

**Q3. At work, you would rather spend most of your time…**
- A. Talking with the people who need answers, and learning what they really need. — DA 2, DS 1
- B. Working on the systems behind the scenes that keep information flowing. — DE 2, ML 1
- C. Digging into a hard problem on your own until it makes sense. — DS 2, ML 1
- D. Designing and building something step by step, testing as you go. — ML 2, DE 1

**Q4. Which result would make you proudest at the end of a project?**
- A. A clear chart or report that helps someone make a decision. — DA 2, DS 1
- B. A data setup that quietly works every day without anyone noticing. — DE 2
- C. A model that predicts something useful, like which customers are likely to leave. — DS 2, ML 1
- D. An app or tool that people open and use themselves. — ML 2, DE 1

**Q5. How do you feel about working with numbers and patterns?**
- A. I like numbers when they answer a practical question about money, customers, or sales. — DA 2
- B. I enjoy puzzles about chance and averages — like why a streak of coin flips happens, or how a poll can mislead. — DS 2
- C. I prefer clear rules and exact steps over guessing; being precisely right matters to me. — DE 2
- D. I like numbers when I can use them to make a machine do something clever. — ML 2, DS 1

**Q6. Where would you rather be in a team?**
- A. Front and center: presenting findings and answering questions about them. — DA 2, DS 1
- B. Behind the scenes: if I do my job well, nobody has to think about my work at all. — DE 2
- C. Off to the side, running experiments and bringing back what I find. — DS 2, DA 1
- D. Building the thing the rest of the team will use. — ML 2, DE 1

**Q7. A problem lands on your desk. Which one do you reach for first?**
- A. The numbers in two reports do not match, and someone has to find out why. — DA 2, DE 1
- B. Data arrives from five places in five formats, and it all has to come together in one place. — DE 2, DA 1
- C. Nobody knows whether the new discount helped or hurt — and the data could answer it. — DS 2, DA 1
- D. The team keeps answering the same question by hand, and it should answer itself. — ML 2, DE 1

**Q8. Which of these sounds most like you?**
- A. I like making messy information neat and easy for others to use. — DA 2, DE 1
- B. I like setting things up so they run the same way every time, without surprises. — DE 2
- C. I like asking "what if" and testing whether an idea survives the data. — DS 2, DA 1
- D. I like taking things apart to see how they work, and putting them back together better. — ML 2, DE 1

**Q9. In a new job, you would most look forward to…**
- A. Learning how the business makes money and what its customers do. — DA 2
- B. Learning how the company's systems fit together under the hood. — DE 2, ML 1
- C. Learning new methods for finding patterns and testing ideas. — DS 2, ML 1
- D. Learning to build smarter tools with the newest technology. — ML 2, DS 1

**Q10. A result you worked on turns out to be uncertain — the data cannot give a definite answer. How do you feel?**
- A. Fine, as long as I can explain clearly what we know and what we do not. — DA 2, DS 1
- B. Uncomfortable — I would rather fix the data until the answer is solid. — DE 2
- C. Interested — uncertain questions are where the interesting findings hide. — DS 2, ML 1
- D. Fine — I would build the tool so it shows how sure it is, and let people decide. — ML 2, DS 1

**Balance check:** every career can reach 20 points from 2-point answers; with 1-point answers the maximum totals are DA 26, DE 29, DS 29, ML 28 — close enough that no career is structurally favored, and results are shown as a ranking, never as percentages.

## 6. Scoring and the result screen

**Rule (simple enough to print on the page):** each answer gives 2 points to the career it fits best and 1 point to a close second. Add up the points for each career. The highest total is your suggested direction; the second-highest is shown as your runner-up.

**Tie-breaking:** if two careers tie on total points, the one with more 2-point answers wins. If they are still tied, show both as equal matches — for a suggestion tool, an honest tie is better than a fake coin flip.

**Result layout:**
- Headline: "Your suggested direction: **Data Analyst**" (career name filled in), labeled *suggestion*, never "match", "perfect" or "optimal".
- One-sentence reason, generated from the winning career's theme (see §7), e.g. "because your answers kept choosing clear answers, explained to people."
- Runner-up line: "Close second: Data Scientist — worth a look too."
- The shared-core line (§7) and the disclaimer (§8) appear on every result.
- Nothing is saved, sent or tracked; the quiz runs entirely in the browser. Say so on the start screen, not only at the end.

## 7. Result copy — one sentence per career, plus the lines every result shows

- **Data Analyst:** "You like turning numbers into clear answers other people can act on — that is the daily work of a Data Analyst."
- **Data Engineer:** "You like building the tidy, reliable systems that keep data flowing — that is the daily work of a Data Engineer."
- **Data Scientist:** "You like open questions, patterns, and testing whether an idea really holds up — that is the daily work of a Data Scientist."
- **ML/AI Engineer:** "You like building smart tools that other people can use — that is the daily work of an ML/AI Engineer."
- **Reason themes** (used to build the "because…" line): Analyst — *clear answers, explained to people*; Engineer — *tidy, reliable systems that just work*; Scientist — *open questions and testing ideas*; ML/AI Engineer — *building tools people use*.
- **Shared-core line (every result):** "All four careers start with the same core on this roadmap — Excel, then SQL, then Python — so this picks a direction, not a locked door. Switching later is normal, and most of what you learn carries over."

## 8. Honesty and fairness — the checks this design passed, and the evidence behind them

- **Suggestion, not assessment — and the research says it must be.** A meta-analysis of 74 studies (Van Iddekinge et al., 2011) found a single interest scale predicts job performance at only about r = .10: interests say something real about what people *choose and persist at*, and very little about how well they will perform. The O*NET Center frames its own profiler the same way — a tool for "career counseling, exploration, and planning". The quiz therefore never uses the words test, assessment, score-based verdict, perfect or optimal, and the start screen says: *"This quiz suggests a direction based on what you enjoy. It is not a test, it measures no ability, and it saves nothing."*
- **No salary, demand or "best career" claims** — none in the questions, none in the results, none in the intro. (Two of the four existing quizzes reviewed in §9 break this rule; see there.)
- **Known bias in interest inventories, and what we did about it.** A meta-analysis of 47 inventories and 503,188 respondents (Su, Rounds & Armstrong, 2009) found a large average gender gap on the Things–People dimension (d = 0.93; Realistic d = 0.84, Social d = −0.68) — and, just as important, that effect sizes varied widely by inventory (0.08–0.79) and that item-writing choices "can substantially reduce sex differences": wording steers results. Mitigations in this draft: every career gets both people-facing and systems-facing options across the set (no career is "the people one" or "the machine one"); options describe tasks, never identities ("someone who loves machines"); language is gender-neutral throughout; results never mention or infer anything about the reader. **Not covered by this research:** cultural and language-group bias in RIASEC measurement, and test–retest stability of very short quizzes — flagged as open questions, not claimed either way.
- **No obviously "smart" answer.** Each option is a real piece of data work that someone must do and that one of the careers genuinely centers on; no option mentions talent, intelligence, or advanced skills, and none requires knowing any tool or term.
- **No stereotypes.** Options avoid gendered, age and background assumptions; scenarios use neutral workplaces (a small shop, a team, a manager) rather than industry-specific scenes a career-switcher could not picture.
- **Switching is presented as normal**, via the shared-core line in §7 — the opposite of the "commit to one path" advice found in one reviewed quiz.

## 9. Existing data-career quizzes — what they do well and badly (questions not copied)

1. **Data Career Path Finder — Maven Analytics** (paid course platform; https://mavenanalytics.io/find-your-path/start). 20 questions mixing interests and self-rated skills. *Well:* no salary bait anywhere on the landing page; substantial length; gentle beginner framing. *Badly:* promises a "**perfect** role / perfect data career" — a precision no survey can deliver; run by a course seller, so every result is also a product recommendation; questions not inspectable before taking it.
2. **"Which Data Science Careers Are Right for Me?" — Forage, republished by Boston University's careers blog** (https://careers.bu.edu/blog/2025/02/03/which-data-science-careers-are-right-for-me/). 11 questions. *Well:* needs zero technical knowledge; plain-language role descriptions; honest advice that skills are shared across roles. *Badly:* **results sit behind a sign-up wall** ("You'll need to sign up for your results"); questions are horoscope-style (favorite superpower, party planning, YouTube habits) with no visible logic linking answers to careers; the article baits with a $119,040 mean wage and a 36% growth figure; the whole piece funnels into paid-partner job simulations.
3. **Data Career Path & Skills Gap Diagnostic — Analyze Conquer Evolve** (coaching site; https://www.analyzeconquerevolve.com/assessments/data-career-diagnostic). 14 questions, 5 outcomes. *Well:* **email is explicitly optional** on the results form — the best practice found in this set; current outcome set; concrete post-result advice (read 10 real job postings). *Badly:* the result is labeled your "**Optimal** Data Career Match"; a follow-on diagnostic tests SQL window functions and pandas — knowledge a beginner does not have yet; a $67 coaching upsell sits under the results; its advice says "commit to one path" with no mention of a shared core.
4. **Data Scientist Types Quiz — Data36** (independent educator, 2019; method document: https://data36.com/wp-content/uploads/2019/10/data_scientist_types_quiz_tomi_mester.pdf). 8 questions, 3 types. *Well:* the method is published and inspectable; the result is a **percentage blend**, not a verdict; the best honesty notes in the set — no type is better, every type needs all the skills, 8 questions cannot be 100% accurate, question your result. *Badly:* dated taxonomy (no ML/AI Engineer outcome; "Data Strategist" is rarely a hiring title); a 2019 "more openings than applicants" demand claim; descriptions funnel to the author's paid course; every type is written as "she" throughout.
- *Checked, no career-direction quiz found (2026-11-16):* 365 Data Science (career pages lead with per-role average salaries instead), DataCamp, Dataquest, Thinkful.

**Mistakes this design avoids, distilled:** no email or sign-up wall; no salary/demand bait; never "perfect/optimal"; questions about real work, not personality proxies; no knowledge-testing; blend-and-runner-up instead of a single box; no paid funnel attached to the result.

## 10. Source table (all accessed 2026-11-16)

| # | Source | Supports | URL |
|---|--------|----------|-----|
| 1 | National Center for O*NET Development, "Interest Profiler (IP)" | Framework: RIASEC, versions, purpose | https://www.onetcenter.org/IP.html |
| 2 | Lewis & Morris, "Career Returns within the O*NET Interest Profiler Tools" (Oct 5, 2025) | Matching method, fit thresholds, Job Zones | https://prod-02-mx-b.onetcenter.org/dl_files/IP_Career_Returns.pdf |
| 3 | My Next Move, "O*NET Interest Profiler" | Item framing ("how much you'd like to") | https://www.mynextmove.org/explore/ip |
| 4 | O*NET Resource Center, "O*NET 31.0 Database Content License" | Database = CC BY 4.0, prescribed credit line | https://www.onetcenter.org/license_db.html |
| 5 | O*NET Resource Center, "O*NET Career Exploration Tools Content License" | Tools: CC BY-ND verbatim / Developer License to modify | https://www.onetcenter.org/license_tools.html |
| 6 | O*NET Resource Center, "O*NET Tools Developer License" (full text) | Validation-study and notice requirements | https://www.onetcenter.org/license_toolsdev.html |
| 7 | O*NET Online, Data Scientists 15-2051.00 | Data Scientist anchor data | https://www.onetonline.org/link/details/15-2051.00 |
| 8 | O*NET Online, Statisticians 15-2041.00 | Data Scientist cross-check | https://www.onetonline.org/link/details/15-2041.00 |
| 9 | O*NET Online, Business Intelligence Analysts 15-2051.01 | Data Analyst anchor data | https://www.onetonline.org/link/details/15-2051.01 |
| 10 | O*NET Online, Market Research Analysts 13-1161.00 | Data Analyst cross-check | https://www.onetonline.org/link/details/13-1161.00 |
| 11 | O*NET Online, Database Architects 15-1243.00 | Data Engineer anchor data | https://www.onetonline.org/link/details/15-1243.00 |
| 12 | O*NET Online, Data Warehousing Specialists 15-1243.01 | Data Engineer secondary anchor | https://www.onetonline.org/link/details/15-1243.01 |
| 13 | O*NET Online, Database Administrators 15-1242.00 | Data Engineer secondary anchor | https://www.onetonline.org/link/details/15-1242.00 |
| 14 | O*NET Online, Software Developers 15-1252.00 | ML/AI Engineer neighbor anchor | https://www.onetonline.org/link/details/15-1252.00 |
| 15 | BLS Occupational Outlook Handbook, Data Scientists | Day-to-day cross-check (exact) | https://www.bls.gov/ooh/math/data-scientists.htm |
| 16 | BLS OOH, Database Administrators and Architects | Data Engineer cross-check (proxy) | https://www.bls.gov/ooh/computer-and-information-technology/database-administrators.htm |
| 17 | BLS OOH, Software Developers, QA Analysts, and Testers | ML/AI Engineer cross-check (proxy) | https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm |
| 18 | BLS OOH, Market Research Analysts | Data Analyst cross-check (proxy) | https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm |
| 19 | Su, Rounds & Armstrong (2009), "Men and things, women and people", Psychological Bulletin (abstract via PubMed) | Gender-gap evidence + item-wording effect | https://pubmed.ncbi.nlm.nih.gov/19883140/ |
| 20 | Van Iddekinge et al. (2011), "Are you interested?", Journal of Applied Psychology (abstract via APA PsycNET) | Interests predict choice, not performance | https://psycnet.apa.org/record/2011-14078-001 |
| 21 | Maven Analytics, Data Career Path Finder | Existing quiz 1 | https://mavenanalytics.io/find-your-path/start |
| 22 | Boston University careers blog, "Which Data Science Careers Are Right for Me?" (Forage) | Existing quiz 2 | https://careers.bu.edu/blog/2025/02/03/which-data-science-careers-are-right-for-me/ |
| 23 | Analyze Conquer Evolve, Data Career Path & Skills Gap Diagnostic | Existing quiz 3 | https://www.analyzeconquerevolve.com/assessments/data-career-diagnostic |
| 24 | Data36, Data Scientist Types Quiz method/results document (2019) | Existing quiz 4 | https://data36.com/wp-content/uploads/2019/10/data_scientist_types_quiz_tomi_mester.pdf |

## Suggested action

Build `/career-quiz/` with the 10 questions and scoring rule above. Put the O*NET CC BY 4.0 credit (§2) in the page footer, the suggestion-not-a-test disclaimer on the start screen, and the shared-core line on every result. If the wording of any question changes during the build, re-check it against §8: no jargon, no obviously "smart" option, no career reduced to a stereotype. Open questions flagged, not resolved: cultural/language bias of interest matching, and how stable a 10-question result is over time — neither blocks a clearly-labeled suggestion tool.


## Evidence

All 24 sources are listed in full in the Source table in Summary; every source was accessed 2026-11-16.
- https://www.onetcenter.org/IP.html (accessed 2026-11-16): O*NET Interest Profiler framework — RIASEC, versions, purpose.
- https://prod-02-mx-b.onetcenter.org/dl_files/IP_Career_Returns.pdf (accessed 2026-11-16): Interest Profiler matching method, fit thresholds, Job Zones.
- https://www.mynextmove.org/explore/ip (accessed 2026-11-16): Interest Profiler item framing ("how much you'd like to").
- https://www.onetcenter.org/license_db.html (accessed 2026-11-16): O*NET 31.0 Database Content License — CC BY 4.0, prescribed credit line.
- https://www.onetcenter.org/license_tools.html (accessed 2026-11-16): Career Exploration Tools license — CC BY-ND verbatim / Developer License to modify.
- https://www.onetcenter.org/license_toolsdev.html (accessed 2026-11-16): O*NET Tools Developer License full text — validation-study and notice requirements.
- https://www.onetonline.org/link/details/15-2051.00 (accessed 2026-11-16): O*NET Data Scientists — Data Scientist anchor data.
- https://www.onetonline.org/link/details/15-2041.00 (accessed 2026-11-16): O*NET Statisticians — Data Scientist cross-check.
- https://www.onetonline.org/link/details/15-2051.01 (accessed 2026-11-16): O*NET Business Intelligence Analysts — Data Analyst anchor data.
- https://www.onetonline.org/link/details/13-1161.00 (accessed 2026-11-16): O*NET Market Research Analysts — Data Analyst cross-check.
- https://www.onetonline.org/link/details/15-1243.00 (accessed 2026-11-16): O*NET Database Architects — Data Engineer anchor data.
- https://www.onetonline.org/link/details/15-1243.01 (accessed 2026-11-16): O*NET Data Warehousing Specialists — Data Engineer secondary anchor.
- https://www.onetonline.org/link/details/15-1242.00 (accessed 2026-11-16): O*NET Database Administrators — Data Engineer secondary anchor.
- https://www.onetonline.org/link/details/15-1252.00 (accessed 2026-11-16): O*NET Software Developers — ML/AI Engineer neighbor anchor.
- https://www.bls.gov/ooh/math/data-scientists.htm (accessed 2026-11-16): BLS OOH Data Scientists — day-to-day cross-check (exact).
- https://www.bls.gov/ooh/computer-and-information-technology/database-administrators.htm (accessed 2026-11-16): BLS OOH Database Administrators and Architects — Data Engineer cross-check (proxy).
- https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm (accessed 2026-11-16): BLS OOH Software Developers, QA Analysts, and Testers — ML/AI Engineer cross-check (proxy).
- https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm (accessed 2026-11-16): BLS OOH Market Research Analysts — Data Analyst cross-check (proxy).
- https://pubmed.ncbi.nlm.nih.gov/19883140/ (accessed 2026-11-16): Su, Rounds & Armstrong (2009) — gender-gap evidence + item-wording effect.
- https://psycnet.apa.org/record/2011-14078-001 (accessed 2026-11-16): Van Iddekinge et al. (2011) — interests predict choice, not performance.
- https://mavenanalytics.io/find-your-path/start (accessed 2026-11-16): Maven Analytics Data Career Path Finder — existing quiz 1.
- https://careers.bu.edu/blog/2025/02/03/which-data-science-careers-are-right-for-me/ (accessed 2026-11-16): Boston University careers blog / Forage — existing quiz 2.
- https://www.analyzeconquerevolve.com/assessments/data-career-diagnostic (accessed 2026-11-16): Analyze Conquer Evolve Data Career Path & Skills Gap Diagnostic — existing quiz 3.
- https://data36.com/wp-content/uploads/2019/10/data_scientist_types_quiz_tomi_mester.pdf (accessed 2026-11-16): Data36 Data Scientist Types Quiz method/results document (2019) — existing quiz 4.


## Affected datafromzero pages

none yet — planned /career-quiz/

## Suggested action

Build /career-quiz/ with the 10 questions and scoring rule above. Put the O*NET CC BY 4.0 credit (§2) in the page footer, the suggestion-not-a-test disclaimer on the start screen, and the shared-core line on every result. If the wording of any question changes during the build, re-check it against §8: no jargon, no obviously "smart" option, no career reduced to a stereotype. Open questions flagged, not resolved: cultural/language bias of interest matching, and how stable a 10-question result is over time — neither blocks a clearly-labeled suggestion tool.

## Priority

Medium - outdated but still correct, or a clear beginner-level gap

## Confidence

High

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

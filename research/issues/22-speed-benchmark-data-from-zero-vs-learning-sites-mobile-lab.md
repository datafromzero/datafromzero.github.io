# #22 Research: Speed benchmark: Data From Zero vs learning sites (mobile lab, Nov 2026)

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/22 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#22](https://github.com/datafromzero/datafromzero.github.io/issues/22) (closed), opened 2026-11-16

## Type

Tool or version change

## Summary

Mobile lab-speed benchmark of Data From Zero against 12 learning sites (homepage plus one typical lesson/tutorial page each, 24 URLs). Data From Zero leads the measured set on Performance score, total weight, transferred JavaScript and Total Blocking Time; five pages (Kaggle Learn ×2, the Mode/ThoughtSpot SQL tutorial, Datapot ×2) produced no first paint under the test conditions and are reported as not measurable rather than scored.

## Evidence

Method (identical for every page): Lighthouse, performance category only, mobile emulation with simulated throttling (the default mobile profile: Moto-class device, ~1.6 Mbps, 4× CPU slowdown), 3 runs per URL, median reported. Measured 2026-11-15/16 (America/Los_Angeles). The PageSpeed Insights API could not be used: its keyless daily quota was exhausted (HTTP 429 on repeated attempts across two days), so lab data was collected with a local Lighthouse run of the same version family and profile instead. Absolute values from a local run can differ from PageSpeed's servers (shared-machine CPU adds variance, which the 3-run median dampens); the comparison is valid because every page was measured the same way on the same machine. CrUX field data could not be collected for the same quota reason; the PageSpeed links below run live and show field data where it exists. JS before first paint is reported as render-blocking script transfer flagged by Lighthouse; every measured page scored 0 KB there (scripts are deferred/async/module across the set, including ours), so the JS column is total script transfer.

| Site — page | Perf | LCP (s) | TBT (ms) | CLS | SI (s) | JS (KB) | Render-blocking JS (KB) | Requests | Total (KB) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Data From Zero — home | 96 | 1.78 | 79 | 0.000 | 3.90 | 57 | 0 | 13 | 131 |
| Data From Zero — lesson | 94 | 2.60 | 0 | 0.001 | 3.34 | 34 | 0 | 18 | 166 |
| W3Schools — home | 31 | 6.18 | 3,340 | 0.000 | 9.83 | 675 | 0 | 187 | 1,342 |
| W3Schools — lesson | 31 | 5.73 | 9,694 | 0.000 | 9.49 | 1,515 | 0 | 350 | 2,118 |
| Kaggle Learn — home | not measurable (no first paint in 6 attempts) | | | | | | | | |
| Kaggle Learn — lesson | not measurable (no first paint in 6 attempts) | | | | | | | | |
| Coursera — home | 25 | 26.99 | 11,040 | 0.131 | 9.55 | 1,257 | 0 | 91 | 1,777 |
| Coursera — lesson | 58 | 2.39 | 21,426 | 0.004 | 7.99 | 3,126 | 0 | 189 | 3,991 |
| freeCodeCamp — home | 29 | 5.79 | 4,384 | 0.011 | 12.63 | 2,982 | 0 | 56 | 3,281 |
| freeCodeCamp — lesson | 27 | 14.55 | 5,064 | 0.000 | 10.04 | 2,896 | 0 | 58 | 3,198 |
| roadmap.sh — home | 36 | 16.29 | 5,437 | 0.000 | 7.11 | 1,275 | 0 | 187 | 1,774 |
| roadmap.sh — lesson | 34 | 22.25 | 16,700 | 0.003 | 14.09 | 2,473 | 0 | 310 | 2,958 |
| Khan Academy — home | 10 | 9.56 | 5,346 | 0.712 | 11.06 | 713 | 0 | 85 | 1,533 |
| Khan Academy — lesson | 10 | 10.97 | 9,884 | 1.269 | 8.35 | 1,076 | 0 | 145 | 1,845 |
| Microsoft Learn (Excel) — home | 37 | 17.30 | 2,839 | 0.000 | 4.75 | 710 | 0 | 45 | 3,334 |
| Microsoft Learn (Excel) — lesson | 35 | 15.03 | 5,049 | 0.000 | 6.07 | 681 | 0 | 31 | 2,277 |
| SQLBolt — home | 59 | 2.46 | 2,086 | 0.000 | 19.02 | 657 | 0 | 67 | 5,235 |
| SQLBolt — lesson | 61 | 2.34 | 2,734 | 0.000 | 5.92 | 1,106 | 0 | 62 | 1,477 |
| Mode SQL Tutorial (now ThoughtSpot) — lesson | not measurable (no first paint in 6 attempts) | | | | | | | | |
| Datapot (VN) — home | not measurable (no first paint in 6 attempts) | | | | | | | | |
| Datapot (VN) — lesson | not measurable (no first paint in 6 attempts) | | | | | | | | |
| MindX (VN) — home | 42 | 4.80 | 3,893 | 0.001 | 5.90 | 407 | 0 | 69 | 705 |
| MindX (VN) — lesson | 37 | 5.13 | 5,733 | 0.001 | 8.74 | 827 | 0 | 97 | 1,099 |
| 200lab (VN) — home | 65 | 2.02 | 2,370 | 0.000 | 5.45 | 416 | 0 | 71 | 974 |

Redirects found while measuring (accessed 2026-11-16): mode.com/sql-tutorial now resolves to thoughtspot.com/sql-tutorial (the tutorial survives under ThoughtSpot); datapot.vn now redirects to datapot.edu.vn, whose course URL is /lo-trinh/dafp-data-analytics-foundation-plus — the edu.vn URLs in the table are the canonical ones measured.

PageSpeed Insights links (live runs; field data shown where CrUX has coverage):
- Data From Zero — home: https://datafromzero.github.io/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdatafromzero.github.io%2F&form_factor=mobile
- Data From Zero — lesson: https://datafromzero.github.io/start/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdatafromzero.github.io%2Fstart%2F&form_factor=mobile
- W3Schools — home: https://www.w3schools.com/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.w3schools.com%2F&form_factor=mobile
- W3Schools — lesson: https://www.w3schools.com/sql/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.w3schools.com%2Fsql%2F&form_factor=mobile
- Kaggle Learn — home: https://www.kaggle.com/learn — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.kaggle.com%2Flearn&form_factor=mobile
- Kaggle Learn — lesson: https://www.kaggle.com/learn/python — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.kaggle.com%2Flearn%2Fpython&form_factor=mobile
- Coursera — home: https://www.coursera.org/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.coursera.org%2F&form_factor=mobile
- Coursera — lesson: https://www.coursera.org/professional-certificates/google-data-analytics — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.coursera.org%2Fprofessional-certificates%2Fgoogle-data-analytics&form_factor=mobile
- freeCodeCamp — home: https://www.freecodecamp.org/learn — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.freecodecamp.org%2Flearn&form_factor=mobile
- freeCodeCamp — lesson: https://www.freecodecamp.org/learn/data-analysis-with-python/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.freecodecamp.org%2Flearn%2Fdata-analysis-with-python%2F&form_factor=mobile
- roadmap.sh — home: https://roadmap.sh/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Froadmap.sh%2F&form_factor=mobile
- roadmap.sh — lesson: https://roadmap.sh/data-analyst — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Froadmap.sh%2Fdata-analyst&form_factor=mobile
- Khan Academy — home: https://www.khanacademy.org/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.khanacademy.org%2F&form_factor=mobile
- Khan Academy — lesson: https://www.khanacademy.org/math/statistics-probability — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.khanacademy.org%2Fmath%2Fstatistics-probability&form_factor=mobile
- Microsoft Learn — home: https://learn.microsoft.com/en-us/training/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Ftraining%2F&form_factor=mobile
- Microsoft Learn — lesson: https://learn.microsoft.com/en-us/training/browse/?products=excel — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Ftraining%2Fbrowse%2F%3Fproducts%3Dexcel&form_factor=mobile
- SQLBolt — home: https://sqlbolt.com/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fsqlbolt.com%2F&form_factor=mobile
- SQLBolt — lesson: https://sqlbolt.com/lesson/select_queries_introduction — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fsqlbolt.com%2Flesson%2Fselect_queries_introduction&form_factor=mobile
- Mode/ThoughtSpot — lesson: https://www.thoughtspot.com/sql-tutorial — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.thoughtspot.com%2Fsql-tutorial&form_factor=mobile
- Datapot — home: https://datapot.edu.vn/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdatapot.edu.vn%2F&form_factor=mobile
- Datapot — lesson: https://datapot.edu.vn/lo-trinh/dafp-data-analytics-foundation-plus — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdatapot.edu.vn%2Flo-trinh%2Fdafp-data-analytics-foundation-plus&form_factor=mobile
- MindX — home: https://mindx.edu.vn/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmindx.edu.vn%2F&form_factor=mobile
- MindX — lesson: https://mindx.edu.vn/course/khoa-hoc-data-analyst — https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmindx.edu.vn%2Fcourse%2Fkhoa-hoc-data-analyst&form_factor=mobile
- 200lab — home: https://200lab.io/ — https://pagespeed.web.dev/analysis?url=https%3A%2F%2F200lab.io%2F&form_factor=mobile

Five-line summary:
1. Data From Zero leads the measured set on Performance: 96 (home) and 94 (/start/) vs the best competitor page at 65 (200lab home) — a 29–31 point margin.
2. It is the lightest by a wide margin: 131–166 KB total transfer vs 705 KB for the lightest competitor page (MindX home) and up to 5,235 KB (SQLBolt home).
3. JavaScript shows the clearest gap: 34–57 KB transferred vs 407 KB for the lightest competitor and 3,126 KB for the heaviest (Coursera lesson).
4. Where it does not lead: lesson-page LCP — /start/ at 2.60 s is beaten by SQLBolt's lesson (2.34 s) and 200lab's home (2.02 s); CLS (~0) and render-blocking JS (0 KB) are ties with several sites, not advantages.
5. Kaggle Learn, the Mode/ThoughtSpot tutorial and Datapot are reported as not measurable (no first paint in repeated attempts), not as zero scores; CrUX field data is missing from this run and should be captured in a follow-up once API access allows.

## Affected datafromzero pages

/ and /start/ (benchmark subjects); no site change requested.

## Suggested action

Keep the current performance budgets as regression guards for future milestones (lesson pages especially: hold LCP ≤ 2.6 s and JS ≤ 60 KB on the /start/ pattern). Re-run this benchmark after the lesson system ships, and add a CrUX pass when PageSpeed API access is available. Treat the not-measurable three as a prompt to check how they gate rendering, not as evidence about their real-user speed.

## Priority

Medium - outdated but still correct, or a clear beginner-level gap

## Confidence

High for the measured 19 pages (same method, 3 runs, medians, raw reports retained). Low for the 5 not-measurable pages — absence of a paint event under headless test conditions is not a real-user measurement. Medium for cross-run comparability with PageSpeed-hosted numbers.

## Checks

- [x] Evidence links work and include access dates
- [x] No text, code or images copied from other sites

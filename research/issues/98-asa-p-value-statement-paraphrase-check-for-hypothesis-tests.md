# #98 Research: ASA p-value statement — paraphrase check for "Hypothesis tests and p-values, honestly"

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/98 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#98](https://github.com/datafromzero/datafromzero.github.io/issues/98) (open), opened 2026-11-21

**Objective:** Verify the four paraphrases of the ASA statement on p-values in the published lesson "Hypothesis tests and p-values, honestly" (https://datafromzero.github.io/core/hypothesis-testing/) against the statement itself, and fix the lesson's source citation if a better primary source exists.

**Verdict up front:** All four paraphrases are FAITHFUL — no lesson text needs to change. The one fix: the lesson cites only the ASA press release PDF; the source list should cite the journal article itself (details at the end).

---

## Source read

- Publisher version (version of record): Wasserstein & Lazar (2016), "The ASA Statement on p-Values: Context, Process, and Purpose," *The American Statistician* — full text at https://www.tandfonline.com/doi/full/10.1080/00031305.2016.1154108 (accessed 2026-11-20). The page opened (no 403 this time), but its text extraction dropped the statement section itself, so the verbatim principles and explanations below were read in the publisher's PDF of the same article (the version of record, carrying the journal's citation page), mirrored at https://www.stat.berkeley.edu/~aldous/Real_World/ASA_statement.pdf
- Also read directly: the ASA press release PDF at https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf (ASA's own site).

## The six principles (verbatim, as numbered in the statement, pp. 131–132)

1. "P-values can indicate how incompatible the data are with a specified statistical model."
2. "P-values do not measure the probability that the studied hypothesis is true, or the probability that the data were produced by random chance alone."
3. "Scientific conclusions and business or policy decisions should not be based only on whether a p-value passes a specific threshold."
4. "Proper inference requires full reporting and transparency."
5. "A p-value, or statistical significance, does not measure the size of an effect or the importance of a result."
6. "By itself, a p-value does not provide a good measure of evidence regarding a model or hypothesis."

## A to D: ratings

**A → Principle 2 — FAITHFUL**
The second half is nearly the principle's own wording. The first half is supported by the statement's definition and by the explanation under Principle 2: "Researchers often wish to turn a p-value into a statement about the truth of a null hypothesis, or about the probability that random chance produced the observed data. The p-value is neither. It is a statement about data in relation to a specified hypothetical explanation, and is not a statement about the explanation itself." The "computed by assuming H0" part matches the statement's definition of a p-value as a probability "under a specified statistical model." No correction needed.

**B → Principle 5 — FAITHFUL**
Nearly verbatim. The principle reads "does not measure the size of an effect or the importance of a result," and its explanation adds: "Smaller p-values do not necessarily imply the presence of larger or more important effects, and larger p-values do not imply a lack of importance or even lack of effect." No correction needed.

**C → Principle 3 — FAITHFUL**
The lesson's second sentence is the principle with "specific" dropped — no change in meaning. The "Not a verdict" gloss is supported by the explanation: "A conclusion does not immediately become 'true' on one side of the divide and 'false' on the other," and "this does not mean that p-values alone can ensure that a decision is correct or incorrect." No correction needed.

**D → Principle 4 — FAITHFUL**
The statement supports "report how many cuts you made" directly. Under Principle 4: "Researchers should disclose the number of hypotheses explored during the study, all data collection decisions, all statistical analyses conducted, and all p-values computed. Valid scientific conclusions based on p-values and related statistics cannot be drawn without at least knowing how many and which analyses were conducted, and how those analyses (including p-values) were selected for reporting." The "not only the one that worked" part is also supported: "P-values and related analyses should not be reported selectively. Conducting multiple analyses of the data and reporting only those with certain p-values (typically those passing a significance threshold) renders the reported p-values essentially uninterpretable. Cherry-picking promising findings, also known by such terms as data dredging, significance chasing, significance questing, selective inference, and 'p-hacking,' leads to a spurious excess of statistically significant results in the published literature and should be vigorously avoided." One nuance: the statement's own wording is "the number of hypotheses explored" and "all statistical analyses conducted" — the lesson's "cuts" is a fair plain-language rendering of that, not a distortion. No correction needed.

## Press release vs article — same wording? YES, for the six principles

The ASA press release PDF (March 7, 2016) lists all six principles word-for-word identical to the article. The one real difference: the press release prints only the six headings and notes that "The statement has short paragraphs elaborating on each principle" — it does not include the explanation paragraphs. So the lesson's current citation supports the principle headings but not any quote from the explanations (like the disclosure sentence behind D).

## Bibliographic details — confirmed from the article's own citation page

Ronald L. Wasserstein & Nicole A. Lazar (2016), "The ASA's Statement on p-Values: Context, Process, and Purpose," *The American Statistician*, 70(2), 129–133. DOI: 10.1080/00031305.2016.1154108. (Accepted author version posted online 7 Mar 2016; published online 9 Jun 2016.)

## Suggested action

In the source list of "Hypothesis tests and p-values, honestly," replace the press-release citation with:

Wasserstein, R. L., & Lazar, N. A. (2016). The ASA Statement on p-Values: Context, Process, and Purpose. *The American Statistician*, 70(2), 129–133. https://www.tandfonline.com/doi/full/10.1080/00031305.2016.1154108

This is the open, primary, publisher URL and — unlike the press release PDF — it carries the full statement including the explanations, so it backs every quote the lesson leans on. No changes to the lesson's four paraphrase sentences.

**Confidence:** high — every quote above was read in the publisher's version of the article on 2026-11-20; the press-release comparison was made against the PDF on amstat.org itself.

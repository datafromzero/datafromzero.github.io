---
title: "ML / AI Engineer: all lessons"
description: Every ML / AI Engineer lesson in the order to study them, with your done ticks.
---

## What you finish with

**There is no certificate.** datafromzero gives no verified certificate: it has no accounts, so it cannot check who finished. This is the message of the author of the site to every learner:

> A certificate has no value if you do not have personal projects that fit what employers need, and the skills and way of thinking to back them up. However strong the issuer is, if your ability does not yet fit or meet the job, the certificate is worth nothing.

What you can show instead is a project. If you want a sheet for yourself, the [completion page](/completion/) prints on two pages, and says on it that it is not a verified certificate.

### How long it takes

From the first Excel lesson to the capstone of this track, the lessons state about **132 hours** in all: 7,900 minutes in 149 lessons. That is 27 weeks at 5 hours a week, or 14 weeks at 10 hours a week.

| Stage | Lessons | Minutes | Hours and minutes |
|---|---:|---:|---:|
| Excel / Sheets | 22 | 835 | 13 h 55 min |
| SQL | 39 | 1,895 | 31 h 35 min |
| Python | 28 | 1,315 | 21 h 55 min |
| Advanced core | 44 | 2,700 | 45 h 00 min |
| ML / AI Engineer | 16 | 1,155 | 19 h 15 min |
| Total | 149 | 7,900 | 131 h 40 min |

Left out: the optional deep dive on deep learning and NLP (8 lessons, 255 minutes), which is planned and not published yet, and not required for a first job. The minutes are the ones printed on each lesson. They are estimates for a beginner who does every exercise, so some lessons will take you longer. If you already know a stage, take its placement test (Excel / Sheets, SQL, Python and the advanced core each end their page with one) and take that stage's hours off the total.

### The capstone

The capstone, [*Capstone: ship it and prove it works*](/ml-engineer/ml-capstone/) (MLE16), lets you choose the classical half or the language-model half, and has you hand in [six things](/ml-engineer/ml-capstone/#the-brief): a context pack, the system behind an endpoint, an evaluation report, a cost line, a ship or no-ship memo, and an AI verification log with an explain-back. You score them yourself with a 16-point rubric, or ask a mentor. Nothing is sent to this site.

### What employers screen for

[Research issue #118](https://github.com/datafromzero/datafromzero.github.io/blob/main/research/issues/118-what-employers-will-hire-for-in-2026-and-beyond-demand-entry.md) read 28 entry-level ML Engineer postings in full (2026-11-22). Python is named in 26 of them, PyTorch in 16, and evaluation or experimentation duties in 16. Twelve are built around language models and retrieval, twelve around classical models only, and four mix the two, which is why the capstone has two halves. A degree is required in 20 and a master's or higher in 6. Projects or GitHub are explicitly valued in 7, and only 4 describe an interview process. These postings are one sample, not the whole market.

### Show your project

A project does not promise an interview or a job. It is evidence you can point to, and the same issue puts work samples among the stronger predictors of job performance, though structured interviews score higher (its Finding 14).

1. Put the repository on GitHub, public. The starter's code is MIT and its data is CC BY 4.0, so keep its `LICENSE` and credit datafromzero.
2. Start the README with the decision the system serves and the number you needed before you ran the evaluation. Then give the baseline, the gain with its interval, one failure slice, the cost line and the way back.
3. Add one line to your CV and one to your LinkedIn profile, in your own words and with what you actually did:
   - **CV:** "Served a model behind an API with a request check, a health check and a test; measured its gain over a baseline on held-out data with a paired 95 percent interval; wrote a ship or no-ship memo with a rollback plan. Practice data, synthetic. (link)"
   - **LinkedIn:** "Ship-it project on practice data: an endpoint, an honest evaluation with a failure slice and a cost line, and a memo that says what would change my mind. (link)"
4. Be ready to talk it through:
   - Say the number you needed to see before you ran the evaluation, and whether you saw it.
   - Give the gain, and say "tie" if its interval includes zero.
   - Show one failure slice and how many cases are in it.
   - Say what the service does when it cannot answer, and how you would switch it off.

When you are done, you can print the [completion page](/completion/).

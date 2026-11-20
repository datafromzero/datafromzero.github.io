---
id: core-find-the-planted-error
title: Find the planted error
description: 'Four AI answers on the cafe data, each with one named mistake: a doubled total, an invented function, a dropped null, an average of averages.'
stage: core
order: 390
level: intermediate
duration: 30
objectives:
  - Catch a fan-out join that doubles revenue, using row counts around the join
  - Catch a function that does not exist, using the documentation of the installed version
  - Catch a filter that silently drops nulls, using a null profile
  - Catch an average of averages by recomputing from the raw rows
  - Name the check that catches each failure, not only the failure
prerequisites:
  - core-trust-but-verify-ai-output
datasets:
  - cafe-sales
reviewed: 2026-11-20
sources:
  - title: Spracklen et al., We have a package for you! Package hallucinations by code-generating LLMs (USENIX Security 2025)
    url: https://arxiv.org/abs/2406.10279
  - title: 'Pourreza and Rafiei, DIN-SQL: decomposed in-context learning of text-to-SQL with self-correction (NeurIPS 2023)'
    url: https://arxiv.org/abs/2304.11015
  - title: 'Dieterich, Rumann and Rodemer, learning from erroneous examples: a systematic review (Educational Psychology Review, 2025)'
    url: https://doi.org/10.1007/s10648-025-10071-x
  - title: Große and Renkl, finding and fixing errors in worked examples (Learning and Instruction, 2007)
    url: https://doi.org/10.1016/j.learninstruc.2007.09.008
status: draft
---

TODO(owner): Planted errors, scaffolded (research issue #88, finding 10): here every error class is named before the learner looks; the next lesson hides it. Each drill ends with the check, written in the learner's own words. Silent null handling has no published frequency: teach the mechanism, quote no rate.

## Warm-up

Draft: the owner writes this section.

## The question

Draft: the owner writes this section.

## The picture

Draft: the owner writes this section.

## Worked example

Draft: the owner writes this section.

## Finish it

Draft: the owner writes this section.

## On your own

Draft: the owner writes this section.

## Check yourself

Draft: the owner writes this section.

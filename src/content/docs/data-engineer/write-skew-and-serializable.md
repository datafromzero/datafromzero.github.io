---
id: data-engineer-write-skew-and-serializable
title: 'When transactions are not enough: write skew'
short_title: Write skew
description: Break a business rule with two transactions that each look correct, at Read Committed and at Repeatable Read, then let Serializable abort one.
stage: data-engineer
order: 250
level: advanced
duration: 25
objectives:
  - Reproduce write skew in two sessions
  - Explain why snapshot isolation allows it
  - Retry a transaction that Serializable aborts
prerequisites:
  - data-engineer-transactions-and-isolation
datasets:
  - cafe-sales
reviewed: 2026-11-20
sources:
  - title: 'PostgreSQL documentation: transaction isolation (serializable isolation level)'
    url: https://www.postgresql.org/docs/current/transaction-iso.html
status: draft
---

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

---
id: sql-join-fanout
title: 'Join fan-out: aggregate before you join'
description: Spot a join that inflates totals, explain it with a diagram, and repair it by aggregating the many side before joining.
stage: sql
order: 160
level: intermediate
duration: 30
objectives:
  - Explain how a join on a non-unique key multiplies rows
  - Diagnose an inflated revenue figure from a many-to-many join
  - Pre-aggregate one side in a subquery or CTE before joining
  - Reconcile the repaired total against the source
prerequisites:
  - sql-left-join-anti-join
  - sql-group-by-having
datasets:
  - cafe-sales
reviewed: 2026-11-16
sources:
  - title: 'DuckDB documentation: Joins'
    url: https://duckdb.org/docs/stable/sql/query_syntax/from#joins
  - title: 'DataLemur: SQL interview patterns'
    url: https://datalemur.com/blog/sql-interview-patterns
  - title: 'Interview Query: Data science SQL interview questions'
    url: https://www.interviewquery.com/p/data-science-sql-interview-questions
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

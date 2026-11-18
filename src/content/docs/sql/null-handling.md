---
id: sql-null-handling
title: 'NULL: unknown is not zero'
description: 'Treat NULL as unknown: test with IS NULL, see why comparisons with NULL fail, and avoid the NOT IN trap.'
stage: sql
order: 50
level: beginner
duration: 20
objectives:
  - Test for missing values with IS NULL and IS NOT NULL
  - Predict the result of a comparison that involves NULL
  - Explain why NULL is neither zero nor an empty string
  - Avoid the NOT IN trap with NULL in the list
  - Replace NULL with a default using COALESCE
prerequisites:
  - sql-where-filtering
datasets:
  - cafe-sales
reviewed: 2026-11-16
sources:
  - title: 'SQLite documentation: NULL handling in SQLite versus other database engines'
    url: https://www.sqlite.org/nulls.html
  - title: 'DuckDB documentation: Comparison operators'
    url: https://duckdb.org/docs/stable/sql/expressions/comparison_operators
  - title: 'DuckDB documentation: CASE expression'
    url: https://duckdb.org/docs/stable/sql/expressions/case
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

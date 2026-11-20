---
id: data-engineer-query-plans-and-operators
title: 'Reading the machine: plans and operators'
short_title: Plans and operators
description: Read EXPLAIN as a tree of operators in PostgreSQL and DuckDB, compare estimated and actual rows, and watch ANALYZE fix an estimate.
stage: data-engineer
order: 200
level: advanced
duration: 30
objectives:
  - Read a plan bottom-up as scan, filter, project, join and aggregate operators
  - Compare estimated with actual rows in EXPLAIN ANALYZE
  - Refresh statistics with ANALYZE and watch an estimate change
  - Say why inner joins in any order give the same result but a different cost
prerequisites:
  - core-inside-the-database
  - data-engineer-role-and-lifecycle
datasets:
  - cafe-sales
reviewed: 2026-11-20
sources:
  - title: 'PostgreSQL documentation: using EXPLAIN'
    url: https://www.postgresql.org/docs/current/using-explain.html
  - title: 'DuckDB documentation: EXPLAIN'
    url: https://duckdb.org/docs/stable/guides/meta/explain
  - title: 'Apache Calcite documentation: algebra'
    url: https://calcite.apache.org/docs/algebra.html
status: draft
---

TODO(owner): Database internals module (research issue #89, section 5): runs on free tools, PostgreSQL on the laptop (installer or Docker), DuckDB and SQLite, on cafe-scale data; every claim is shown by a real run except recovery internals, which are explained, not faked.

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

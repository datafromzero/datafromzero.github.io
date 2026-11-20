---
id: data-engineer-indexes-honestly
title: Indexes, honestly
description: See a B-tree index page by page, watch the planner ignore an index on a small table on purpose, and count what every index costs on writes.
stage: data-engineer
order: 210
level: advanced
duration: 30
objectives:
  - Describe a B-tree index as pages and levels
  - Show the planner choosing a sequential scan on a small table, and why forcing the index costs more
  - Add an expression index for a filter on lower(name)
  - Weigh the write cost of every extra index
prerequisites:
  - data-engineer-query-plans-and-operators
datasets:
  - cafe-sales
reviewed: 2026-11-20
sources:
  - title: Winand, Use The Index, Luke! (free web edition)
    url: https://use-the-index-luke.com/
  - title: 'PostgreSQL documentation: pageinspect'
    url: https://www.postgresql.org/docs/current/pageinspect.html
  - title: 'PostgreSQL documentation: indexes on expressions'
    url: https://www.postgresql.org/docs/current/indexes-expressional.html
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

---
id: core-inside-the-database
title: 'Inside the database: plans, transactions and copies'
short_title: Inside the database
description: Read a query plan as a tree of steps, say what a transaction promises and why a number can change mid-refresh, and tell a replica from a backup.
stage: core
order: 340
level: intermediate
duration: 30
objectives:
  - Read a query plan as a tree of operators (scan, filter, join, aggregate) from the bottom up
  - Say why the planner may ignore an index on a small table
  - Say what a transaction promises and why a dashboard number can change during a refresh
  - Say why a replica of a database is not a backup
  - Recognize a stored procedure and a trigger, and say where each still lives in a modern data stack
prerequisites:
  - sql-indexes-and-explain
  - sql-modify-data-transactions
  - sql-scaling-and-nosql
  - core-cloud-storage-compute-and-access
datasets:
  - cafe-sales
reviewed: 2026-11-20
sources:
  - title: 'PostgreSQL documentation: using EXPLAIN'
    url: https://www.postgresql.org/docs/current/using-explain.html
  - title: 'PostgreSQL documentation: transaction isolation'
    url: https://www.postgresql.org/docs/current/transaction-iso.html
  - title: 'PostgreSQL documentation: high availability, load balancing and replication'
    url: https://www.postgresql.org/docs/current/high-availability.html
  - title: 'Google Cloud documentation: BigQuery stored procedures'
    url: https://cloud.google.com/bigquery/docs/procedures
  - title: Winand, Use The Index, Luke! (free web edition)
    url: https://use-the-index-luke.com/
status: draft
---

TODO(owner): Recognition depth only (research issue #89, findings 2 and 4): every role meets slow queries, numbers that move during a refresh and warehouse vocabulary. The operators in the plan are the relational algebra vocabulary; teach no notation. Stored procedures live on as callable units in warehouses; triggers survive in transactional source systems (Snowflake and BigQuery have none). Each idea ends with a pointer to the Data Engineer track lesson that goes deeper.

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

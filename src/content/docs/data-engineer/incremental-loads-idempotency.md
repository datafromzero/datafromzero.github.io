---
id: data-engineer-incremental-loads-idempotency
title: Incremental loads and idempotent reruns
description: Load only new data with a watermark, and design every step so running it twice gives the same table.
stage: data-engineer
order: 40
level: advanced
duration: 30
objectives:
  - Use an updated_at watermark for an incremental extract
  - Explain idempotency and why reruns must be safe
  - Write an upsert or delete-and-insert that is rerun safe
  - Produce the inserts, updates and deletes between two snapshots
  - Prove the second run changed nothing
prerequisites:
  - data-engineer-ingest-apis-and-files
  - sql-modify-data-transactions
datasets:
  - app-events
reviewed: 2026-11-16
sources:
  - title: 'DuckDB documentation: INSERT statement'
    url: https://duckdb.org/docs/stable/sql/statements/insert
  - title: 'DuckDB documentation: Transaction management'
    url: https://duckdb.org/docs/stable/sql/statements/transactions
status: draft
---

TODO(owner): Mapped Must in #118.

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

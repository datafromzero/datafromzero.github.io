---
id: data-engineer-locks-and-mvcc
title: Locks, waits and MVCC
description: Watch a writer wait for another writer in pg_locks, name the blocker, and see that readers never block writers under MVCC.
stage: data-engineer
order: 260
level: advanced
duration: 25
objectives:
  - Show that a reader does not block a writer under MVCC
  - Find a waiting update in pg_locks and name its blocker
  - Choose a lock timeout for a nightly load
prerequisites:
  - data-engineer-write-skew-and-serializable
datasets:
  - cafe-sales
reviewed: 2026-11-20
sources:
  - title: 'PostgreSQL documentation: pg_locks'
    url: https://www.postgresql.org/docs/current/view-pg-locks.html
  - title: 'PostgreSQL documentation: explicit locking'
    url: https://www.postgresql.org/docs/current/explicit-locking.html
  - title: 'PostgreSQL documentation: introduction to MVCC'
    url: https://www.postgresql.org/docs/current/mvcc-intro.html
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

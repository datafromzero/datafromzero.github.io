---
id: data-engineer-logical-to-physical-design
title: From a logical model to physical tables
short_title: Logical to physical
description: Turn a logical model into physical tables, choosing how to store subtypes, weak entities and composite keys, and which types and indexes to declare.
stage: data-engineer
order: 120
level: advanced
duration: 35
objectives:
  - Choose a storage strategy for a generalization (one table, one table per subtype, or a shared table plus subtype tables) and name its cost
  - Model a weak entity with a composite key that includes its owner's key
  - Tell superkeys, candidate keys, alternate keys and the primary key apart, and declare the alternates as unique
  - Pick physical data types and the first indexes from the queries the model must serve
  - Read UML aggregation and composition and decide which becomes a cascading delete
prerequisites:
  - sql-designing-tables-workflow
  - sql-indexes-and-explain
  - data-engineer-dbt-tests-and-documentation
reviewed: 2026-11-21
sources:
  - title: 'Object Management Group: Unified Modeling Language 2.5.1'
    url: https://www.omg.org/spec/UML/2.5.1/
  - title: 'PostgreSQL documentation: Constraints'
    url: https://www.postgresql.org/docs/current/ddl-constraints.html
  - title: 'PostgreSQL documentation: Data Types'
    url: https://www.postgresql.org/docs/current/datatype.html
status: draft
---

TODO(owner): stub from research issue #107 (owner decision, 2026-11-21: the deep modeling material goes to the Data Engineer track, SPEC D53). It follows the SQL lesson *Designing tables: a workflow* and comes before *Dimensional models and slowly changing dimensions*. Sources are placeholders until the writer opens the pages that carry each claim.

TODO(owner): Owner decision 2026-11-21 (D53). Modeling appears in 20 of 27 Data Engineer postings (#118).

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

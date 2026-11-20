---
id: core-modeling-the-domain
title: Modeling the domain before the tables
short_title: Modeling the domain
description: Describe the cafe business as entities and relationships, read an entity-relationship diagram, and turn it into tables with keys and a declared grain.
stage: core
order: 160
level: intermediate
duration: 30
objectives:
  - Name the entities, attributes and relationships of a small business from a plain description
  - 'Read an entity-relationship diagram: entities, primary and foreign keys, one-to-many and many-to-many links'
  - Turn a many-to-many relationship into a table of its own
  - Put an attribute that belongs to a relationship on the right table
  - Declare the grain of each table before writing CREATE TABLE
prerequisites:
  - sql-relational-model
  - sql-normalization
  - sql-create-table-constraints
datasets:
  - cafe-sales
reviewed: 2026-11-20
sources:
  - title: 'Chen, The entity-relationship model: toward a unified view of data (ACM TODS, 1976)'
    url: https://doi.org/10.1145/320434.320440
  - title: 'PostgreSQL documentation: constraints and foreign keys'
    url: https://www.postgresql.org/docs/current/ddl-constraints.html
  - title: 'Stanford Online (edX): Databases, relational databases and design'
    url: https://www.edx.org/learn/computer-programming/stanford-university-databases-1-introduction-to-relational-databases
  - title: 'UK Government Digital and Data Profession Capability Framework: data roles'
    url: https://understand-digital-data-roles-skills.service.gov.uk/
status: draft
---

TODO(owner): Part 3 of 6, Shapes of data (SPEC D49): open with a skip check of 4 to 6 questions in `<details>` (no JavaScript); if all are right, the learner goes on to Part 4.

TODO(owner): Use depth for all four roles (research issue #89, finding 1): data modeling is named in 8 of 9 junior data engineer postings in the sample and has its own interview round at large employers; analysts and scientists read the diagrams. The Data Engineer track deepens it (dimensional-models-and-scd). Close with the fan-out sum (join orders to items, then sum the order total) as the cost of a wrong grain.

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

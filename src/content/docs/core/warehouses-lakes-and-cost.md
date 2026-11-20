---
id: core-warehouses-lakes-and-cost
title: Warehouses, data lakes and what things cost
description: Compare transactional and analytical databases, a warehouse and a data lake, and read how storage and scanning are billed.
stage: core
order: 350
level: intermediate
duration: 30
objectives:
  - Tell OLTP from OLAP and row from columnar storage
  - Describe a data warehouse and a data lake and when each fits
  - Explain scan-based pricing and one way to cut a bill
  - Say why the same query can cost very different amounts
  - Tell an additive measure (revenue) from one that does not add up (distinct customers, averages)
prerequisites:
  - core-cloud-storage-compute-and-access
  - core-grain-facts-and-dimensions
  - core-inside-the-database
reviewed: 2026-11-16
sources:
  - title: 'Google Cloud documentation: BigQuery introduction'
    url: https://cloud.google.com/bigquery/docs/introduction
  - title: 'Google Cloud documentation: BigQuery pricing'
    url: https://cloud.google.com/bigquery/pricing
  - title: 'Microsoft Learn: DP-900 study guide'
    url: https://learn.microsoft.com/en-in/credentials/certifications/resources/study-guides/dp-900
status: draft
---

TODO(owner): Part 5 of 6 ends here (SPEC D49): finish with the project step on cafe-sales: the repository goes through a reviewed pull request, the data is saved as Parquet, and the star schema is loaded into DuckDB as a stand-in warehouse, with one query plan read and one cost estimate.

TODO(owner): Warehousing at consumer depth for every role (research issue #89, topic 7): star schemas and additive versus non-additive measures (daily distinct customers do not sum to weekly distinct customers). Data mining belongs to the Data Scientist track.

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

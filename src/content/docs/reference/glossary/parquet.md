---
id: glossary-parquet
term: Parquet
short: A file format that stores a table column by column, made for fast analysis and small files.
aliases: [Apache Parquet]
reviewed: 2026-11-27
---

Apache Parquet is an open source, column-oriented data file format designed for efficient data storage and retrieval, according to its documentation. Column by column means that a query that needs two columns can read just those two. A [CSV](/reference/glossary/csv/) file is text with no types; a Parquet file keeps the type of each column and compresses well.

## Where you meet it

- [*Data beyond tables: nested JSON, events and formats*](/core/data-beyond-tables/) (C31): choosing a file format and adding a Parquet export.
- [*File formats and partitioning*](/data-engineer/file-formats-and-partitioning/) (DE3): JSON, CSV and Parquet compared on size, types and speed.

## Source

- [Apache Parquet documentation: Overview](https://parquet.apache.org/docs/overview/)

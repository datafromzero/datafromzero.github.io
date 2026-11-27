---
id: glossary-dataframe
term: DataFrame
short: 'pandas''s table of rows and columns with labels, like a sheet or a SQL table.'
aliases: [data frame, DataFrames]
reviewed: 2026-11-27
---

A DataFrame is the table of [pandas](/reference/glossary/pandas/): two-dimensional, with labeled rows and columns, and each column can hold another type of value. The pandas documentation calls it a general 2D labeled, size-mutable tabular structure with potentially heterogeneously-typed columns. `.shape` gives its rows and columns, `.head(3)` shows its first three rows, and `.dtypes` shows the [type](/reference/glossary/dtype/) of each column.

## Where you meet it

- [*Reading files and tables: paths, CSV, JSON and Excel*](/python/files-and-tables/) (P9): a CSV file read into a DataFrame.
- [*Your first DataFrame: a first look*](/python/dataframe-first-look/) (P11): shape, dtypes and a first look.

## Source

- [pandas documentation: Package overview](https://pandas.pydata.org/docs/getting_started/overview.html)

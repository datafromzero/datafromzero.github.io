---
id: glossary-csv
term: CSV
short: A plain-text file where each line is one row and commas separate the values.
aliases: [comma-separated values, CSV file]
reviewed: 2026-11-27
---

CSV stands for comma-separated values. It is a plain-text file where each line is one row, commas separate the values of a row, and the first line often holds the column names. RFC 4180 describes this common format and says it is for information only, not an Internet standard. Because it is only text, a CSV file carries no data types: the program that opens it has to guess whether `2026-03-05` is a date. Spreadsheets, SQL tools and pandas can all open one, and the cafe-sales tables come as CSV files.

## Where you meet it

- [*Numbers are not numbers until you check*](/excel/numbers-dates-text-types/) (E4): a CSV file with day/month/year dates.
- [*Repeatable cleaning with Power Query*](/excel/power-query-basics/) (E14): loading CSV files with Power Query.
- [*Reading files and tables: paths, CSV, JSON and Excel*](/python/files-and-tables/) (P9): reading a CSV file into a table.

## Source

- [RFC 4180: Common Format and MIME Type for CSV Files](https://www.rfc-editor.org/rfc/rfc4180)

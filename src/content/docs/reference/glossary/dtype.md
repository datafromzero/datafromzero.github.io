---
id: glossary-dtype
term: dtype
short: 'A column''s data type in pandas, such as int64 for whole numbers or float64 for decimals.'
aliases: [data type, dtypes]
reviewed: 2026-11-27
---

A dtype (data type) says what kind of value a column holds and how much room each value takes, such as `int64` for whole numbers or `float64` for decimals. The NumPy documentation says a dtype describes how the bytes of one array item are to be read, including the type and the size of the data. In pandas every column has one dtype, which `.dtypes` shows, and it decides what you can do with the column: you can add numbers, but not text. That is why the lessons check the dtypes right after loading a file.

## Where you meet it

- [*Your first DataFrame: a first look*](/python/dataframe-first-look/) (P11): read the dtypes of a table.
- [*Missing values, types and duplicates*](/python/pandas-missing-data-and-types/) (P16): fix a column that holds numbers as text.

## Source

- [NumPy documentation: Data type objects (dtype)](https://numpy.org/doc/stable/reference/arrays.dtypes.html)
- [pandas documentation: Essential basic functionality](https://pandas.pydata.org/docs/user_guide/basics.html)

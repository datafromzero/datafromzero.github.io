---
id: glossary-pipeline
term: Pipeline
short: A series of steps that moves data from where it is made to where it is used, such as from the till to a report.
aliases: [data pipeline]
reviewed: 2026-11-27
---

A data pipeline is a series of processing steps that prepares data for analysis, as Amazon's definition says. A pipeline for the cafes could ask the till system for yesterday's orders, clean them and update the sheet the owner reads each morning. The Data Engineer lessons call it a promise: data moves from a source you do not control to a reader who needs it, every time it is asked. In scikit-learn, a Pipeline is a smaller thing: a chain of steps that is applied to the rows of a table, the last one being the model.

## Where you meet it

- [*What a data engineer owns: lifecycle, ETL, ELT and layers*](/data-engineer/role-and-lifecycle/) (DE1): the five stages of a pipeline and what a data engineer owns.
- [*scikit-learn pipelines: one leakage-safe object*](/ml-engineer/sklearn-pipelines-and-column-transformers/) (MLE1): a scikit-learn pipeline, the smaller kind.

## Source

- [AWS: What is a data pipeline?](https://aws.amazon.com/what-is/data-pipeline/)

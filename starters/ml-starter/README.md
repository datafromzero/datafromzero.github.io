# ml-starter

The starter repository of the [datafromzero](https://datafromzero.github.io) Machine Learning Engineer track. You ship one
churn model across the lessons that work in a repository: check its data, track its runs, and later serve it, watch it and
retrain it. Lessons about modeling itself (pipelines, tuning, neural networks) work in Colab notebooks, so this repository
begins at lesson MLE2. Everything runs on your own laptop (VS Code, Git, uv); GitHub Codespaces is the fallback.

Code is MIT (see `LICENSE`). The table in `data/churn_table.csv` is made from the synthetic app-events data, CC BY 4.0:
credit datafromzero, https://datafromzero.github.io.

## Start

```bash
git clone https://github.com/datafromzero/ml-starter.git
cd ml-starter
uv sync
uv run check_environment.py
uv run pytest -q
```

In a codespace: open the repository on GitHub, choose Code, then Codespaces, then create one. The dev container
installs uv and runs `uv sync` for you. A stopped codespace is deleted after 30 days, so push your work.

## Layout

```text
data/churn_table.csv   the churn table of the Data Scientist track: 17,816 people, 13 columns
scripts/build_table.py rebuilds that table from the app-events files with the query of lesson DS3
src/ml_starter/        your code: settings, the table and its split, the pipeline of lesson MLE1
tests/                 pytest tests
check_environment.py   tells you what is missing on your computer and how to fix it
```

The target is `churned`: 1 when a person has no `session_start` and no `add_expense` from day 8 to day 30 after signup. The
prediction moment is day 7, so every other column is known by then. Lesson DS3 explains the table; the dataset README
(`datasets/app-events/README.md` in the site repository) explains the data.

## Checkpoints

Each lesson names a tag, so that you can catch up or compare:

| Tag | What it holds |
| --- | --- |
| `mle-02-start` | the starter as it is on first clone |
| `mle-NN-done` | the repository after lesson MLE NN, with the files that lesson saves |
| `mle-NN-start` | the same commit as `mle-(NN-1)-done` |

To catch up before lesson MLE3, run `git checkout mle-03-start`. To return to your own work, `git switch -`. A checkout
replaces your files: commit or stash what you want to keep first.

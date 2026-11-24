# Starters

Starter repositories for the career tracks, built here and published by the owner as public repositories.

| Folder | Becomes | Track |
| --- | --- | --- |
| `de-pipeline/` | `https://github.com/datafromzero/de-pipeline-starter` | Data Engineer |
| `de-pipeline-checkpoints/` | its Git history and the tags the lessons name | Data Engineer |

Both folders are code, not site content: the site build, the spelling check and the links check do not read them
(`cspell.json` and `.markdownlint-cli2.jsonc` ignore `starters/`).

## Publishing `de-pipeline-starter`

The repository exists at `https://github.com/datafromzero/de-pipeline-starter`, with `main` and the tags `de-01-start` to
`de-05-done` pushed. `uv run pytest -q` passed in a real GitHub Codespace at that state (16 passed, 1 skipped), so
Codespaces is verified for DE1 to DE5. Codespaces is not yet verified for DE6 to DE10, and Airflow, the lesson that needs
Linux, was run only in this repository's build environment (Linux), not in Windows with WSL2, on macOS or in a codespace.

TODO(owner): the tags `de-06-start` to `de-11-start` are built but not pushed. To publish them:

1. Build the history in a folder that does not exist yet: `python3 starters/de-pipeline-checkpoints/make_history.py ../de-pipeline-build`.
   Every commit has the same author and date, so the commits of lessons 1 to 5 get the hashes of the repository on GitHub;
   the script stops if they do not (`PUBLISHED` in the script lists the hashes), because a change to a published checkpoint
   would not be a fast-forward. Add the hash of each new lesson to `PUBLISHED` once it is pushed.
2. In that folder, add the repository as a remote and push, with the tags: `git remote add origin https://github.com/datafromzero/de-pipeline-starter.git`,
   then `git push origin main --tags` (a fast-forward of the `main` that is there).
3. Open a codespace on the repository and run `uv run pytest -q`; for DE7 and DE8 also `cd airflow`, `uv sync`, `source env.sh`
   and `uv run pytest -q`.

Before the push, run `python3 starters/de-pipeline-checkpoints/check_lessons.py`. It covers every `python`, `markdown`, `sql`,
`yaml`, `json` and `toml` block of the ten lessons: a block outside an exercise must equal a checkpoint file or be a piece of
one, or the script fails; blocks inside an exercise (task code, half-solutions, solutions, flawed code) are matched when they
can be and listed when they cannot. It also reads every `bash` block: a `git show de-NN-done:PATH`, a `python -m pipeline.NAME`
and a `scripts/NAME.py` must name a file that exists. It does not check `console` output or the exercise solutions: run those
in a clean clone built by `make_history.py`.

# Starters

Starter repositories for the career tracks, built here and published by the owner as public repositories.

| Folder | Becomes | Track |
| --- | --- | --- |
| `de-pipeline/` | `https://github.com/datafromzero/de-pipeline-starter` | Data Engineer |
| `de-pipeline-checkpoints/` | its Git history and the tags the lessons name | Data Engineer |
| `ml-starter/` | `https://github.com/datafromzero/ml-starter` | Machine Learning Engineer |
| `ml-starter-checkpoints/` | its Git history and the tags the lessons name | Machine Learning Engineer |

These folders are code, not site content: the site build, the spelling check and the links check do not read them
(`cspell.json` and `.markdownlint-cli2.jsonc` ignore `starters/`).

## Publishing `de-pipeline-starter`

The repository exists at `https://github.com/datafromzero/de-pipeline-starter`, with `main` and every tag from `de-01-start` to
`de-18-done` pushed (`de-15-start` is the pushed `de-14-done`). Owner checks in real GitHub Codespaces, 2026-11-24 and 25: at DE5
`uv run pytest -q` passed (16 passed, 1 skipped); at DE14 pytest gave 22 passed and 1 skipped, `ci/dbt_ci.sh` ended with PASS=46
and `airflow dags test` ended in state success; at DE18 Java 21 was present (from the dev container feature), pytest passed,
`scripts/clean_clone_check.sh` ended with PASS=46 and exit 0, `fetch_app_events` read 13,041,745 bytes and 177,379 events, and the
Spark job `events_by_name` ran 4 jobs with matching counts. Not tested, or not reported: GitHub Actions itself (DE14; only the script it calls was run),
Windows with WSL2, macOS, and an older codespace after Codespaces: Rebuild Container (DE16 tells such a learner to fetch the new
`.devcontainer/devcontainer.json` from `de-16-done`).

DE16 adds `spark/`, with PySpark 4.3.0 and its own `uv.lock`: it needs Java 17, 21 or 25. The checkpoint `de-16-done` carries a
`.devcontainer/devcontainer.json` that installs Java 21 with the Dev Containers Java feature (`ghcr.io/devcontainers/features/java:1`,
option `version`); earlier checkpoints keep the old file. To publish a new checkpoint:

1. Build the history in a folder that does not exist yet: `python3 starters/de-pipeline-checkpoints/make_history.py ../de-pipeline-build`.
   Every commit has the same author and date, so the commits of lessons 1 to 5 get the hashes of the repository on GitHub;
   the script stops if they do not (`PUBLISHED` in the script lists the hashes, and also those of lessons 6 to 10, which later lessons build on and which no longer change), because a change to a published checkpoint
   would not be a fast-forward. Add the hash of each new lesson to `PUBLISHED` once it is pushed.
2. In that folder, add the repository as a remote and push, with the tags: `git remote add origin https://github.com/datafromzero/de-pipeline-starter.git`,
   then `git push origin main --tags` (a fast-forward of the `main` that is there).
3. Open a codespace on the repository and run `uv run pytest -q`; for DE7 and DE8 also `cd airflow`, `uv sync`, `source env.sh`
   and `uv run pytest -q`.

Before the push, run `python3 starters/de-pipeline-checkpoints/check_lessons.py`. It covers every `python`, `markdown`, `sql`,
`yaml`, `json` and `toml` block of the lessons DE1 to DE18 (DE6 is two lessons, DE6 and DE6b, and DE11 is two, DE11 and DE11b): a block outside an exercise must equal a checkpoint file or be a piece of
one, or the script fails; blocks inside an exercise (task code, half-solutions, solutions, flawed code) are matched when they
can be and listed when they cannot. It also reads every `bash` block: a `git show de-NN-done:PATH`, a `python -m pipeline.NAME`
and a `scripts/NAME.py` must name a file that exists. It does not check `console` output or the exercise solutions: run those
in a clean clone built by `make_history.py`.

## Publishing `ml-starter`

The repository exists at `https://github.com/datafromzero/ml-starter` (created by the owner, 2026-11-25), with `main` and the
tags `mle-02-start`, `mle-02-done`, `mle-03-start` and `mle-03-done` pushed (hashes in `PUBLISHED`; the owner pushed the tags from a
codespace because the proxy of the writing environment refuses tag pushes). Owner check in a real GitHub codespace, 2026-11-25: at
`mle-03-done` `uv run pytest -q` gave 14 passed on Python 3.13, with one warning from MLflow's own code (an SQLAlchemy
`SADeprecationWarning` about the `noload` loader strategy; harmless, not from the lesson code).

1. Build the history in a folder that does not exist yet: `python3 starters/ml-starter-checkpoints/make_history.py ../ml-starter-build`.
   Every commit has the same author and date, so a rebuild gives the same hashes; `PUBLISHED` in the script is empty until the first
   push. Then add the hash of each pushed lesson to it, so that a later change to a published checkpoint stops the script.
2. In that folder: `git remote add origin https://github.com/datafromzero/ml-starter.git`, then `git push origin main --tags`.
3. Open a codespace on the repository and run `uv run pytest -q` at `mle-03-done` (14 tests pass here; MLflow adds about 100 packages).

Before the push, run `python3 starters/ml-starter-checkpoints/check_lessons.py`. It covers every `python`, `toml`, `json`, `sql`, `yaml`
and `markdown` block of the lessons MLE2 and MLE3: a block outside an exercise must equal a checkpoint file or be a piece of one. It
also reads every `bash` block for the files it names. It does not check `console` output or exercise solutions: run those in a clean
clone built by `make_history.py`. Checked here on Linux with uv 0.11.32 and Python 3.13.18; not on Windows, macOS or in a codespace.

### New checkpoints: MLE13 to MLE16 (drafts, not pushed)

`make_history.py` now builds six lessons (`LESSONS = [2, 3, 13, 14, 15, 16]`), and `PUBLISHED` still holds only the starter and lessons 2 and 3, whose hashes a rebuild reproduces. The owner pushes these tags from a codespace, in this order, after `git push origin main`:

| Tag | What it holds |
| --- | --- |
| `mle-13-start` | the same commit as the pushed `mle-03-done` |
| `mle-13-done` | the service (`serve.py`, `export.py`), its tests, `Dockerfile`, `.dockerignore`, `scripts/person.json`, `scripts/compare_service.py`, and `pyproject.toml` and `uv.lock` with `fastapi`, `uvicorn`, `skops` and the dev dependency `httpx2` |
| `mle-14-start`, `mle-14-done` | the request log, the monitor, the rollback command, the replay script, the quality gate and `docs/rollback_plan.md`; `serve.py` and `tests/test_serve.py` are replaced |
| `mle-15-start`, `mle-15-done` | `reference/mle15_reference.py`, the reference answer of the simulation |
| `mle-16-start`, `mle-16-done` | `reference/capstone_classical.py` and the folder `llm/` (own `pyproject.toml` and `uv.lock` with PyTorch 2.15.0 from the CPU index, `rag.py`, `questions.py`, `reference/`) |

For example: `git push origin mle-13-start mle-13-done mle-14-start mle-14-done mle-15-start mle-15-done mle-16-start mle-16-done`. Then add the hashes of lessons 13 to 16 to `PUBLISHED`.

Notes. FastAPI 0.165.0, uvicorn 0.54.0 and skops 0.16.0 were already in the lock file through MLflow 3.18.0; the new packages are `httpx2` 2.16.2 with `httpcore2` and `truststore` (Starlette's test client prefers `httpx2`). The `Dockerfile` was built and run on Docker Engine 29.9.2 (`python:3.13-slim`) with host networking for the build on the writing machine; not run on Docker Desktop, Windows, macOS or in a codespace, and no image was pushed or deployed. The `llm/` folder needs about 6 GB of memory and downloads about 3.1 GB of models; run one language-model process at a time. `check_lessons.py` now covers MLE2, MLE3 and MLE13 to MLE16 (`dockerfile` blocks too). Capture the `console` blocks in a clean clone as before.

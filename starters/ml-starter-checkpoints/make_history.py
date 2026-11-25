"""Build the Git history of the ML starter, with the checkpoint tags of the lessons that work in it.

    python3 starters/ml-starter-checkpoints/make_history.py TARGET_DIR

TARGET_DIR must not exist. It becomes a repository whose `main` is the state after the last lesson,
with these tags (the lessons say "check out mle-03-start to catch up"):

    mle-02-start                     the starter as the learner first clones it
    mle-NN-done                      the starter after lesson MLE NN, with the files the lesson saves
    mle-NN-start                     the same commit as the done tag of the lesson before it

Only lessons that work in the repository have a folder: MLE2 and MLE3 so far (MLE1, MLE4 and MLE5 work in Colab notebooks).
The files of each lesson are the folder `mle-NN-done/` next to this script: only the files the lesson adds or
replaces. The lesson pages quote them, and `check_lessons.py` compares every quoted block.

Every commit has the same author and date (below), so a rebuild gives the same hashes. `PUBLISHED` holds the hashes of
commits that were pushed; the script stops if a rebuild of a published lesson gives another one, because the files of a
published checkpoint never change (a change would not be a fast-forward of what learners already cloned). Lessons 0 (the starter), 2 and 3 were pushed
on 2026-11-25.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
STARTER = HERE.parent / "ml-starter"
LESSONS = [2, 3]  # the lessons of the track that have a checkpoint folder, in order; add each new one here
AUTHOR = ("johnha912", "johnha912@users.noreply.github.com")
DATE = "2026-11-25T12:00:00+0000"
# The commits whose files never change again, by lesson (the starter commit is key 0): add a lesson's hash once it is pushed.
PUBLISHED = {
    # Pushed to datafromzero/ml-starter on 2026-11-25.
    0: "0123560c9ba02a70f4a375677feb9b2dd2cb7c84",
    2: "82f82985e64e5a5330dcf869e66c839b9fe244a2",
    3: "6641a1797bf098329c18a8ff52a47620a1392dbb",
}
IGNORED = shutil.ignore_patterns(".venv", "__pycache__", ".pytest_cache", "*.pyc", "mlflow.db", "mlruns")


def git(target, *args):
    environment = {
        **os.environ,
        "GIT_AUTHOR_NAME": AUTHOR[0], "GIT_AUTHOR_EMAIL": AUTHOR[1], "GIT_AUTHOR_DATE": DATE,
        "GIT_COMMITTER_NAME": AUTHOR[0], "GIT_COMMITTER_EMAIL": AUTHOR[1], "GIT_COMMITTER_DATE": DATE,
    }
    command = ["git", "-c", "commit.gpgsign=false", *args]
    return subprocess.run(command, cwd=target, check=True, capture_output=True, text=True, env=environment).stdout.strip()


def keep_published(target, number):
    """Stop when a rebuild of an already published commit gives another hash."""
    if number in PUBLISHED and git(target, "rev-parse", "HEAD") != PUBLISHED[number]:
        sys.exit(f"The commit of lesson {number} is not the published one: a published checkpoint changed.")


def main(target):
    target = Path(target)
    if target.exists():
        sys.exit(f"{target} exists; choose a folder that does not")
    shutil.copytree(STARTER, target, ignore=IGNORED)
    git(target, "init", "-b", "main")
    git(target, "add", "-A")
    git(target, "commit", "-m", "Starter for the Machine Learning Engineer track")
    keep_published(target, 0)
    git(target, "tag", f"mle-{LESSONS[0]:02d}-start")
    for position, number in enumerate(LESSONS):
        shutil.copytree(HERE / f"mle-{number:02d}-done", target, dirs_exist_ok=True, ignore=IGNORED)
        git(target, "add", "-A")
        git(target, "commit", "-m", f"MLE{number} done")
        keep_published(target, number)
        git(target, "tag", f"mle-{number:02d}-done")
        if position + 1 < len(LESSONS):
            git(target, "tag", f"mle-{LESSONS[position + 1]:02d}-start")
    print(f"Built {target} with the tags " + ", ".join(f"mle-{n:02d}-done" for n in LESSONS) + f" and mle-{LESSONS[0]:02d}-start.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])

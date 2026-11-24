"""Build the Git history of the starter, with the checkpoint tags of the lessons.

    python3 starters/de-pipeline-checkpoints/make_history.py TARGET_DIR

TARGET_DIR must not exist. It becomes a repository whose `main` is the state after the last lesson,
with these tags (the lessons say "check out de-03-start to catch up"):

    de-01-start                      the starter as the learner first clones it
    de-NN-done                       the starter after lesson NN, with the files the lesson saves
    de-NN+1-start                    the same commit as de-NN-done

The files of each lesson are the folder `de-NN-done/` next to this script: only the files the lesson
adds or replaces. The lesson pages quote them, and the checks of the build compare every quoted block.

Every commit has the same author and date (below), so a rebuild gives the same hashes. The published repository
was built that way; `PUBLISHED` holds the hashes of its commits, and the script stops if a rebuild of a published
lesson gives another one, because the files of a published checkpoint never change (a change would not be a
fast-forward of what learners already cloned).
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
STARTER = HERE.parent / "de-pipeline"
LESSONS = 10
AUTHOR = ("johnha912", "johnha912@users.noreply.github.com")
DATE = "2026-11-24T12:00:00+0000"
# The commits of the published repository, by lesson (the starter commit is key 0). Add a lesson's hash once it is pushed.
PUBLISHED = {
    0: "ed98dbedbf5966caf13110923c46286bb75f87b1",
    1: "6ebbc9ece65776b95503d6fba65307b383bde764",
    2: "b6eb8bf7e23eddb030987df6b2826f1cbc6a482a",
    3: "7af7bf670106158f72239fd5a1f2b535cabdb548",
    4: "eee98d78a11e1ed56dd8700c8691835537250cee",
    5: "b939cb4a99553af143065b5e0036761ea7c591e3",
}
IGNORED = shutil.ignore_patterns(".venv", "__pycache__", ".pytest_cache", "*.pyc")


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


def clear_landing_zones(target):
    for zone in ("raw", "staging", "serving"):
        for path in (target / "data" / zone).iterdir():
            if path.name != ".gitkeep":
                shutil.rmtree(path) if path.is_dir() else path.unlink()


def main(target):
    target = Path(target)
    if target.exists():
        sys.exit(f"{target} exists; choose a folder that does not")
    shutil.copytree(STARTER, target, ignore=IGNORED)
    clear_landing_zones(target)
    git(target, "init", "-b", "main")
    git(target, "add", "-A")
    git(target, "commit", "-m", "Starter for the Data Engineer track")
    keep_published(target, 0)
    git(target, "tag", "de-01-start")
    for number in range(1, LESSONS + 1):
        shutil.copytree(HERE / f"de-{number:02d}-done", target, dirs_exist_ok=True, ignore=IGNORED)
        git(target, "add", "-A")
        git(target, "commit", "-m", f"DE{number} done")
        keep_published(target, number)
        git(target, "tag", f"de-{number:02d}-done")
        git(target, "tag", f"de-{number + 1:02d}-start")
    print(f"Built {target} with tags de-01-start to de-{LESSONS + 1:02d}-start and de-01-done to de-{LESSONS:02d}-done.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])

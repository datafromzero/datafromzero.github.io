"""Build the Git history of the starter, with the checkpoint tags of the lessons.

    python3 starters/de-pipeline-checkpoints/make_history.py TARGET_DIR

TARGET_DIR must not exist. It becomes a repository whose `main` is the state after the last lesson,
with these tags (the lessons say "check out de-03-start to catch up"):

    de-01-start                      the starter as the learner first clones it
    de-NN-done                       the starter after lesson NN, with the files the lesson saves
    de-NN+1-start                    the same commit as de-NN-done

The files of each lesson are the folder `de-0N-done/` next to this script: only the files the lesson
adds or replaces. The lesson pages quote them, and the checks of the build compare every quoted block.
"""

import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
STARTER = HERE.parent / "de-pipeline"
LESSONS = 5
IGNORED = shutil.ignore_patterns(".venv", "__pycache__", ".pytest_cache", "*.pyc")


def git(target, *args):
    command = ["git", "-c", "user.name=datafromzero", "-c", "user.email=noreply@example.com", "-c", "commit.gpgsign=false", *args]
    subprocess.run(command, cwd=target, check=True, capture_output=True, text=True)


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
    git(target, "tag", "de-01-start")
    for number in range(1, LESSONS + 1):
        shutil.copytree(HERE / f"de-{number:02d}-done", target, dirs_exist_ok=True, ignore=IGNORED)
        git(target, "add", "-A")
        git(target, "commit", "-m", f"DE{number} done")
        git(target, "tag", f"de-{number:02d}-done")
        git(target, "tag", f"de-{number + 1:02d}-start")
    print(f"Built {target} with tags de-01-start to de-{LESSONS + 1:02d}-start and de-01-done to de-{LESSONS:02d}-done.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])

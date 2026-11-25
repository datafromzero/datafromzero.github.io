"""Check that the code an ML Engineer lesson shows is the code of its checkpoint.

    python3 starters/ml-starter-checkpoints/check_lessons.py

It covers three things, for each lesson that works in the repository (MLE2 and MLE3 so far; MLE1, MLE4 and MLE5 are Colab notebooks):

1. Every fenced `python`, `markdown`, `sql`, `yaml`, `json` or `toml` block outside an `<Exercise>` must equal a file of
   the checkpoints (or the starter) or be a contiguous piece of one. A block that matches nothing is an error and the
   script exits with 1.
2. Blocks inside an `<Exercise>` (the task's code, half-solutions, solutions, flawed code) are matched when they can be
   and listed when they cannot: that list is for a person to read, and it holds exercise code only.
3. Every `bash` block is read for the files it names: `git show mle-NN-done:PATH` needs PATH in that checkpoint,
   `uv run python -m ml_starter.NAME` needs `src/ml_starter/NAME.py` in the starter or a checkpoint up to the lesson's, and
   `uv run python scripts/NAME.py` needs that script.

Shown output (`console` blocks) is compared with a run only by hand, in a clean clone built by `make_history.py`; this script
only refuses the signs of a capture that went wrong (a traceback, or `a//b` from a shell variable that expanded to nothing),
unless the lesson teaches that error on purpose (`TAUGHT`).
"""

import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LESSONS = HERE.parent.parent / "src" / "content" / "docs" / "ml-engineer"
NAMES = [  # (label, checkpoint number, lesson file)
    ("MLE2", 2, "validating-model-data"),
    ("MLE3", 3, "experiment-tracking-and-reproducibility"),
]
FILE_SUFFIXES = {".py", ".md", ".json", ".sql", ".yml", ".sh", ".toml", ".lock"}
FILE_NAMES = {".gitignore"}
CHECKED_LANGUAGES = {"python", "markdown", "sql", "yaml", "json", "toml"}
FENCE = re.compile(r"^(`{3,})(\w+)\n(.*?)^\1$", re.S | re.M)  # a fence of four backticks may hold fences of three
BAD_CONSOLE = re.compile(r"Traceback \(most recent call last\)|(?<![:/\s])//(?![/\s])")
TAUGHT = {}  # signs that a lesson teaches on purpose, by lesson label
EXERCISE = re.compile(r"<Exercise\b.*?</Exercise>", re.S)
GIT_SHOW = re.compile(r"git show (mle-\d\d-done):(\S+)")
MODULE = re.compile(r"uv run python -m ml_starter\.(\w+)")
SCRIPT = re.compile(r"uv run python ([\w/]+\.py)")


def checkpoint_files(number):
    """Text of every file a lesson may quote: its own checkpoint, earlier ones and the starter."""
    folders = [HERE.parent / "ml-starter"] + [HERE / f"mle-{n:02d}-done" for n in range(1, number + 1) if (HERE / f"mle-{n:02d}-done").exists()]
    files = {}
    for folder in folders:
        for path in folder.rglob("*"):
            if path.is_file() and "__pycache__" not in path.parts and ".venv" not in path.parts and (path.suffix in FILE_SUFFIXES or path.name in FILE_NAMES):
                files[path.relative_to(folder).as_posix() + " (" + folder.name + ")"] = path.read_text()
    return files


def check_bash(block, files):
    """Problems of one bash block: a file or module it names that no checkpoint up to this lesson has."""
    paths = {key.split(" (")[0] for key in files}
    problems = []
    for tag, path in GIT_SHOW.findall(block):
        if f"{path} ({tag})" not in files:
            problems.append(f"git show {tag}:{path} names a file that the checkpoint does not have")
    for module in MODULE.findall(block):
        if f"src/ml_starter/{module}.py" not in paths:
            problems.append(f"python -m ml_starter.{module}: no src/ml_starter/{module}.py in the starter or a checkpoint")
    for script in SCRIPT.findall(block):
        if script.startswith("exercises/"):
            continue  # a file the learner writes in an exercise
        if script not in paths:
            problems.append(f"{script}: no such script in the starter or a checkpoint")
    return problems


def check_console(label, block):
    """Problems of one console block: a traceback or `a//b`, neither of which a lesson teaches."""
    problems = []
    for line in block.splitlines():
        match = BAD_CONSOLE.search(line)
        if match and match.group(0) not in TAUGHT.get(label, set()):
            problems.append(f"{label}: ERROR console block shows {match.group(0)!r} (a capture that went wrong?): {line[:90]!r}")
    return problems


def main():
    errors = 0
    for label, number, name in NAMES:
        page = LESSONS / f"{name}.mdx"
        if not page.exists():
            print(f"{label}: no page yet, skipped")
            continue
        text = page.read_text()
        files = checkpoint_files(number)
        spans = [match.span() for match in EXERCISE.finditer(text)]
        matched = in_exercise = bash = 0
        for fence in FENCE.finditer(text):
            language, block = fence.group(2), fence.group(3).rstrip("\n")
            inside = any(start <= fence.start() < end for start, end in spans)
            if language == "console":
                for problem in check_console(label, block):
                    errors += 1
                    print(problem)
                continue
            if language == "bash":
                if any(block == body.rstrip("\n") or block in body for body in files.values()):
                    matched += 1
                    continue
                bash += 1
                for problem in check_bash(block, files):
                    errors += 1
                    print(f"{label}: ERROR {problem}")
                continue
            if language not in CHECKED_LANGUAGES:
                continue
            if any(block == body.rstrip("\n") or block in body for body in files.values()):
                matched += 1
            elif inside:
                in_exercise += 1
                print(f"{label}: exercise code, not a checkpoint file: {block.splitlines()[0][:70]!r}")
            else:
                errors += 1
                print(f"{label}: ERROR outside an exercise and in no checkpoint file or piece: {block.splitlines()[0][:70]!r}")
        print(f"{label}: {matched} blocks match a checkpoint, {in_exercise} exercise blocks do not, {bash} bash blocks read")
    if errors:
        sys.exit(f"{errors} problem(s) found")


if __name__ == "__main__":
    main()

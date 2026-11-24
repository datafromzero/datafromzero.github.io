"""Check that the code a Data Engineer lesson shows is the code of its checkpoint.

    python3 starters/de-pipeline-checkpoints/check_lessons.py

It covers three things, for each of the five lessons:

1. Every fenced `python` or `markdown` block outside an `<Exercise>` must equal a file of the checkpoints (or the
   starter) or be a contiguous piece of one (a replacement the lesson asks for). A block that matches nothing is an
   error and the script exits with 1.
2. Blocks inside an `<Exercise>` (the task's code, half-solutions, solutions, flawed code) are matched when they can be
   and listed when they cannot: that list is for a person to read, and it holds exercise code only.
3. Every `bash` block is read for the files it names: `git show de-NN-done:PATH` needs PATH in that checkpoint,
   `uv run python -m pipeline.NAME` needs `src/pipeline/NAME.py` in the starter or in a checkpoint up to the lesson's,
   and `uv run python scripts/NAME.py` needs that script.

Shown output (`console` blocks) is not checked here: run the commands in a clean clone built by `make_history.py`.
"""

import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LESSONS = HERE.parent.parent / "src" / "content" / "docs" / "data-engineer"
NAMES = {
    1: "role-and-lifecycle",
    2: "ingest-apis-and-files",
    3: "file-formats-and-partitioning",
    4: "incremental-loads-idempotency",
    5: "pipeline-as-testable-code",
}
FENCE = re.compile(r"^```(\w+)\n(.*?)^```$", re.S | re.M)
EXERCISE = re.compile(r"<Exercise\b.*?</Exercise>", re.S)
GIT_SHOW = re.compile(r"git show (de-\d\d-done):(\S+)")
MODULE = re.compile(r"uv run python -m pipeline\.(\w+)")
SCRIPT = re.compile(r"uv run python (scripts/\w+\.py)")


def checkpoint_files(number):
    """Text of every file a lesson may quote: its own checkpoint, earlier ones and the starter."""
    folders = [HERE.parent / "de-pipeline"] + [HERE / f"de-{n:02d}-done" for n in range(1, number + 1)]
    files = {}
    for folder in folders:
        for path in folder.rglob("*"):
            if path.is_file() and "__pycache__" not in path.parts and ".venv" not in path.parts and path.suffix in {".py", ".md"}:
                files[path.relative_to(folder).as_posix() + " (" + folder.name + ")"] = path.read_text()
    return files


def exercise_spans(text):
    return [match.span() for match in EXERCISE.finditer(text)]


def check_bash(number, block, files):
    """Problems of one bash block: a file or module it names that no checkpoint up to this lesson has."""
    paths = {key.split(" (")[0] for key in files}
    problems = []
    for tag, path in GIT_SHOW.findall(block):
        wanted = f"{path} ({tag})"
        if wanted not in files:
            problems.append(f"git show {tag}:{path} names a file that the checkpoint does not have")
    for module in MODULE.findall(block):
        if f"src/pipeline/{module}.py" not in paths:
            problems.append(f"python -m pipeline.{module}: no src/pipeline/{module}.py in the starter or a checkpoint")
    for script in SCRIPT.findall(block):
        if script not in paths:
            problems.append(f"{script}: no such script in the starter or a checkpoint")
    return problems


def main():
    errors = 0
    for number, name in NAMES.items():
        text = (LESSONS / f"{name}.mdx").read_text()
        files = checkpoint_files(number)
        spans = exercise_spans(text)
        matched = in_exercise = bash = 0
        for fence in FENCE.finditer(text):
            language, block = fence.group(1), fence.group(2).rstrip("\n")
            inside = any(start <= fence.start() < end for start, end in spans)
            if language == "bash":
                bash += 1
                for problem in check_bash(number, block, files):
                    errors += 1
                    print(f"DE{number}: ERROR {problem}")
                continue
            if language not in {"python", "markdown"}:
                continue
            if any(block == body.rstrip("\n") or block in body for body in files.values()):
                matched += 1
            elif inside:
                in_exercise += 1
                print(f"DE{number}: exercise code, not a checkpoint file: {block.splitlines()[0][:70]!r}")
            else:
                errors += 1
                print(f"DE{number}: ERROR outside an exercise and in no checkpoint file or piece: {block.splitlines()[0][:70]!r}")
        print(f"DE{number}: {matched} blocks match a checkpoint, {in_exercise} exercise blocks do not, {bash} bash blocks read")
    if errors:
        sys.exit(f"{errors} problem(s) found")


if __name__ == "__main__":
    main()

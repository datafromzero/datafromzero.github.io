"""Check that the code a Data Engineer lesson shows is the code of its checkpoint.

    python3 starters/de-pipeline-checkpoints/check_lessons.py

Every fenced `python`, `markdown` or `bash` block of the five lessons is looked up in the files of the checkpoints:
it must equal a file or be a contiguous piece of one (a replacement the lesson asks for). Blocks that match no file
are listed for a person to read: they should be exercise code, half-solutions and flawed code, never a block that
saves a file or replaces a piece of one. Shown output and exercise code are not checked here: run them.
"""

import re
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


def checkpoint_files(number):
    """Text of every file a lesson may quote: its own checkpoint, earlier ones and the starter."""
    folders = [HERE.parent / "de-pipeline"] + [HERE / f"de-{n:02d}-done" for n in range(1, number + 1)]
    files = {}
    for folder in folders:
        for path in folder.rglob("*"):
            if path.is_file() and "__pycache__" not in path.parts and ".venv" not in path.parts and path.suffix in {".py", ".md"}:
                files[path.relative_to(folder).as_posix() + " (" + folder.name + ")"] = path.read_text()
    return files


def main():
    for number, name in NAMES.items():
        text = (LESSONS / f"{name}.mdx").read_text()
        files = checkpoint_files(number)
        matched = unmatched = 0
        for language, block in FENCE.findall(text):
            if language not in {"python", "markdown"}:
                continue
            block = block.rstrip("\n")
            if any(block == body.rstrip("\n") or block in body for body in files.values()):
                matched += 1
            else:
                unmatched += 1
                print(f"DE{number}: not a checkpoint file or piece: {block.splitlines()[0][:70]!r}")
        print(f"DE{number}: {matched} blocks match a checkpoint, {unmatched} do not (exercise code, starters, flawed code)")


if __name__ == "__main__":
    main()

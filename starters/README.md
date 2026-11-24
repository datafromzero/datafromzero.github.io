# Starters

Starter repositories for the career tracks, built here until the owner creates their public repositories.

| Folder | Becomes | Track |
| --- | --- | --- |
| `de-pipeline/` | `https://github.com/datafromzero/de-pipeline-starter` | Data Engineer |
| `de-pipeline-checkpoints/` | its Git history and the tags the lessons name | Data Engineer |

Both folders are code, not site content: the site build, the spelling check and the links check do not read them
(`cspell.json` and `.markdownlint-cli2.jsonc` ignore `starters/`).

## Publishing `de-pipeline-starter`

TODO(owner): the lessons link to `https://github.com/datafromzero/de-pipeline-starter`, which does not exist yet.
Create the public repository, then publish it before any Data Engineer lesson goes live.

1. Build the history: `python3 starters/de-pipeline-checkpoints/make_history.py ../de-pipeline-starter`.
   It copies `de-pipeline/`, commits it as the first commit and adds one commit and one tag for each lesson
   (`de-01-start`, `de-01-done`, `de-02-start`, and so on).
2. In that folder, set the remote and push everything, tags included:
   `git remote add origin https://github.com/datafromzero/de-pipeline-starter.git`, then `git push -u origin main --tags`.
   The commits carry a placeholder author; rewrite them or set your own `git config` first if you want your name on them.
3. Turn on GitHub Codespaces for the repository if it is not on, and open one to confirm that `uv run pytest -q` passes.

Before the final push, run `python3 starters/de-pipeline-checkpoints/check_lessons.py`: it looks up every code block of
the five lessons in the checkpoint files and lists the blocks that match none (exercise code and half-solutions).

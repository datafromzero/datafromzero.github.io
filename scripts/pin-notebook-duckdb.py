"""Pin DuckDB in every SQL notebook's setup cell (SPEC D39/D40): lessons quote DuckDB 2.0.0 results, so Colab must
run that version. Idempotent: run after adding notebooks (`python3 scripts/pin-notebook-duckdb.py`)."""
import json
import pathlib

PIN = "%pip install -q duckdb==2.0.0  # the version these lessons were checked with\n"
for path in sorted(pathlib.Path("notebooks/sql").glob("*.ipynb")):
    nb = json.loads(path.read_text())
    cell = next(c for c in nb["cells"] if c["cell_type"] == "code")
    src = "".join(cell["source"])
    if src.startswith("%pip install"):
        continue
    assert src.startswith("import duckdb"), f"{path}: unexpected setup cell"
    cell["source"] = (PIN + src).splitlines(keepends=True)
    path.write_text(json.dumps(nb, indent=1, ensure_ascii=False) + "\n")
    print(f"pinned {path}")

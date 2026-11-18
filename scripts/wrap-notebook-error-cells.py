"""Wrap every SQL notebook cell that raises on DuckDB into try/except, so Colab Run all never stops (MISTAKES 2026-11-18).
Run after adding notebooks: `python3 scripts/wrap-notebook-error-cells.py` (needs duckdb). Idempotent."""
import json, glob, duckdb, io, contextlib
script=open('datasets/cafe-sales/v1/cafe-sales.sql').read()
n=0
for path in sorted(glob.glob('notebooks/sql/*.ipynb')):
    nb=json.load(open(path)); con=duckdb.connect(); con.execute(script); changed=False
    ns={'con':con,'duckdb':duckdb}  # one namespace per notebook, as in Colab: later cells see earlier variables
    for c in nb['cells']:
        if c['cell_type']!='code': continue
        src=''.join(c['source'])
        if src.startswith('%pip') or src.lstrip().startswith('try:'): 
            try:
                with contextlib.redirect_stdout(io.StringIO()): exec(src,ns)
            except Exception: pass
            continue
        try:
            with contextlib.redirect_stdout(io.StringIO()): exec(src,ns)
        except Exception:
            body='\n'.join('    '+l if l.strip() else l for l in src.rstrip('\n').split('\n'))
            new='# This cell can show an error (on purpose, or until you finish it); the notebook prints it and keeps going.\ntry:\n'+body+'\nexcept Exception as e:\n    print(e)\n'
            c['source']=new.splitlines(keepends=True); changed=True; n+=1
    if changed:
        open(path,'w').write(json.dumps(nb, indent=1, ensure_ascii=False)+'\n')
print('wrapped',n)

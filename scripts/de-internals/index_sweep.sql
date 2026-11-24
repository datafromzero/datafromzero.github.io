-- Sweep for the index lesson: for tables cut from orders_big of 10 to 100,000 rows, the planner cost of one primary-key lookup as a sequential
-- scan and as the forced index plan. Run it with  psql -d lab -f index_sweep.sql ; the NOTICE lines hold the numbers (n, pages, plan, costs).
\set QUIET on
CREATE OR REPLACE FUNCTION plan_cost(q text) RETURNS text LANGUAGE plpgsql AS $$
DECLARE r text; j json;
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;
  RETURN (j->0->'Plan'->>'Node Type') || ' ' || (j->0->'Plan'->>'Total Cost');
END $$;
DO $$
DECLARE n int; k int; seqc text; idxc text; chosen text; pages int;
BEGIN
  FOREACH n IN ARRAY ARRAY[10,30,100,300,1000,3000,10000,100000] LOOP
    EXECUTE 'DROP TABLE IF EXISTS sweep_t';
    EXECUTE format('CREATE TABLE sweep_t AS SELECT * FROM orders_big WHERE order_id <= %s', n);
    EXECUTE 'ALTER TABLE sweep_t ADD PRIMARY KEY (order_id)';
    EXECUTE 'ANALYZE sweep_t';
    k := (n * 7) / 10;
    SELECT relpages INTO pages FROM pg_class WHERE relname = 'sweep_t';
    chosen := plan_cost(format('SELECT * FROM sweep_t WHERE order_id = %s', k));
    SET LOCAL enable_seqscan = off;
    idxc := plan_cost(format('SELECT * FROM sweep_t WHERE order_id = %s', k));
    SET LOCAL enable_seqscan = on;
    SET LOCAL enable_indexscan = off; SET LOCAL enable_bitmapscan = off;
    seqc := plan_cost(format('SELECT * FROM sweep_t WHERE order_id = %s', k));
    SET LOCAL enable_indexscan = on; SET LOCAL enable_bitmapscan = on;
    RAISE NOTICE 'n=% pages=% chosen=[%] forced_index=[%] forced_seq=[%]', n, pages, chosen, idxc, seqc;
  END LOOP;
END $$;
DROP TABLE sweep_t;

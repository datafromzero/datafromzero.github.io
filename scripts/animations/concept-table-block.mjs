// 3D concept animation (SPEC D41, "3D figures") for file formats and partitions (Data Engineer lesson DE30, unit 2). The table is the lesson's own staged lines,
// five columns (order_item_id, ordered_at, store_id, quantity, discount_usd), drawn as a block of cells at one fixed angle (build-time projection, scripts/lib/project3d.mjs).
// No row counts are written: the number of rows is schematic. The only number is the lesson's own, 1 of 6 monthly files for the May query (unit 2's reveal).
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the table as one block; 3 to 4 stored row by row (CSV): the block comes apart into one slab for each row, and a
// query on quantity reads every slab; 5 to 6 stored column by column (Parquet): one slab for each column, the column quantity lit because the query reads it alone;
// 7 to 8 partitioned by month (the lesson's part column): one slab for each month, and the May slab pulled out and lit, the only one the May query reads.
// Facts: the lesson's units 1 and 2 (the Apache Parquet and DuckDB documentation pages it cites). The figure is the idea, not a measurement.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';
import { camera } from '../lib/project3d.mjs';
import { slab, byDepth } from '../lib/figure3d.mjs';

const COLS = ['order_item_id', 'ordered_at', 'store_id', 'quantity', 'discount_usd'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const ROWS = 12; // schematic: two rows for each month
const W = 1.7; // block width: 5 columns
const H = 1.2; // block height
const D = 0.24; // block depth
const X0 = -W / 2;
const Y0 = -H / 2;
const Z0 = -D / 2;

export default function make({ id = 'blk' } = {}) {
	const a = anim({
		id,
		h: 276,
		loop: { cycle: 8 },
		title: 'One table as a block of cells: row slabs, column slabs and month slabs',
		desc:
			'The staged table of five columns, drawn as one block of cells. Stored row by row, as in a CSV file, it comes apart into one thin slab for each row, and a query on quantity reads every slab. Stored column by column, as in a Parquet file, it is one slab for each column, and only quantity, the one the query needs, is lit. Partitioned by month it is six slabs, January to June, and only May is pulled out and lit, the file the May query reads: 1 of 6.',
		caption: 'The same cells, stored three ways. By row, a query on one column meets every slab. By column, it reads one slab. By month, a query for May reads one file of six.',
		phases: [
			[1, 'The table as a block of cells', { role: 'src', key: 'A table is a grid of cells: a column for each field, a row for each order line.', changes: [['+', '5 columns']] }],
			[3, 'Stored row by row (CSV)', { role: 'flt', key: 'A row store keeps each row together as one slab, so a query on one column meets every slab.', changes: [['+', 'one slab for each row']] }],
			[5, 'Stored column by column (Parquet)', { role: 'out', key: 'A column store keeps each column together, so a query on quantity reads one slab.', changes: [['+', 'one slab for each column'], ['−', '4 columns not read']] }],
			[7, 'Partitioned by month', { role: 'win', key: 'A partition is one folder for each month; a filter on May lets the reader skip the other five.', changes: [['+', 'one slab for each month'], ['−', '5 months skipped']] }],
		],
		counters: [{ label: 'files read', role: 'win', values: [[8, '1 of 6']] }],
	});
	const cam = camera({ a: -0.55, tilt: 0.38, s: 140, cx: 150, cy: 140 });
	const xb = (i) => X0 + (W / COLS.length) * i; // column boundaries
	const rowH = H / ROWS;
	const yb = (j) => Y0 + rowH * j;
	const inner = (n, f) => Array.from({ length: n - 1 }, (_, i) => f(i + 1));
	const xs = inner(COLS.length, xb);
	const ys = inner(ROWS, yb);
	const right = cam.P(X0 + W, 0, Z0 + D)[0];

	// 1 and 2, then 3 and 4: the rows. The block is 12 row slabs side by side; at phase 3 every second slab slides out, so each row is a slab of its own.
	byDepth(cam, Array.from({ length: ROWS }, (_, k) => ({ k, box: { x: X0, y: yb(k), z: Z0, w: W, h: rowH, d: D } }))).forEach(({ k, box }) => {
		const draw = () => slab(a, cam, box, { xs, role: 'src', level: 1 });
		if (k % 2) a.move({ dx: 20, at: 3, fx: { in: 1, hide: 5 } }, draw);
		else a.g({ in: 1, hide: 5 }, draw);
	});
	a.text(right + 30, 78, 'every slab', 'f10 b', { in: 4, hide: 5 });
	a.text(right + 30, 91, 'is read', 'f10 b', { in: 4, hide: 5 });

	// 5 and 6: the columns, one slab each, pulled apart sideways; quantity (4th) is lit at phase 6
	byDepth(cam, COLS.map((c, j) => ({ j, box: { x: xb(j), y: Y0, z: Z0, w: W / COLS.length, h: H, d: D } }))).forEach(({ j, box }) => {
		a.move({ dx: 10 * j, at: 5, fx: { in: 5, hide: 7 } }, () => {
			slab(a, cam, box, { ys, role: 'ord', level: 1, sides: false });
			if (COLS[j] === 'quantity') a.g({ in: 6, hide: 7 }, () => slab(a, cam, box, { ys, role: 'out', level: 2, sides: false }));
		});
	});
	a.text(right + 50, 78, 'quantity', 'f10 b', { in: 6, hide: 7 });
	a.text(right + 50, 91, 'is read', 'f10 b', { in: 6, hide: 7 });

	// 7 and 8: the months, six slabs of two rows pulled apart downward; May (5th) slides out at phase 7 and is lit at phase 8
	byDepth(cam, MONTHS.map((m, k) => ({ k, box: { x: X0, y: yb(2 * k), z: Z0, w: W, h: rowH * 2, d: D } }))).forEach(({ k, box }) => {
		const draw = () => slab(a, cam, box, { xs, role: 'win', level: 1 });
		const may = MONTHS[k] === 'May';
		a.move({ dx: may ? 30 : 0, dy: 10 * k, at: 7, fx: { in: 7 } }, () => {
			draw();
			if (may) a.g({ in: 8 }, () => slab(a, cam, box, { xs, role: 'win', level: 3 }));
		});
	});
	MONTHS.forEach((m, k) => {
		const y = cam.P(X0 + W, yb(2 * k) + rowH, Z0 + D / 2)[1] + 10 * k + 3;
		a.text(right + 56, y, m, 'f10 b', { in: 7 });
	});
	const may = cam.P(X0 + W, yb(8) + rowH, Z0 + D / 2)[1] + 40 + 3;
	a.text(right + 78, may, 'read', 'f10 b', { in: 8 });

	a.text(10, 48, 'order_item_id · ordered_at · store_id · quantity · discount_usd', 'f9 mu');
	return a;
}

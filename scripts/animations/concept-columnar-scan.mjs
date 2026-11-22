// Concept animation (SPEC D41, no real data) for row and column storage (core lesson C35). Metaphor: a report that needs two columns reads whole
// rows from a row store but only two blocks from a column store. Abstract only: a table of four columns A to D and four rows, cells named A1 to D4.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the same 16 cells drawn twice (a row store above, with a block for each row; a column store
// below, with a block for each column); 3 to 4 the cells of columns B and D are shaded in both layouts (what the report needs); 5 to 6 every row block of
// the row store is marked read, with the count 16 cells; 7 to 8 only the B and D blocks of the column store are marked read, with the count 8 cells, and
// the A and C blocks are marked skipped.
// Facts (Apache Parquet documentation, opened 2026-11-22: a column-oriented file format designed for efficient storage and retrieval; DuckDB documentation,
// Parquet overview: filters and projections are pushed into the file scan): the figure is the idea, not a measurement. The lesson measures a real file.
// Counters (D41): needed 8, row store 16, column store 8, each at the phase that draws it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, tint, edge } from '../lib/step-animation.mjs';

const COLS = ['A', 'B', 'C', 'D'];
const NEEDED = ['B', 'D'];
const CW = 40; // cell width
const CH = 18; // cell height

export default function make({ id = 'cs' } = {}) {
	const a = anim({
		id,
		h: 252,
		loop: { cycle: 8 },
		title: 'A column store reads only the columns a report needs',
		desc:
			'The same table of four columns, A to D, and four rows is drawn twice. Above, a row store keeps one block for each row, so each block holds the four cells of one row. Below, a column store keeps one block for each column, so each block holds the four cells of one column. The cells of columns B and D are shaded: they are what the report needs. In the row store all four row blocks are marked read, 16 cells. In the column store only the blocks of B and D are marked read, 8 cells, and the blocks of A and C are marked skipped.',
		caption: 'A row store keeps the cells of a row together, so a report on two columns still reads every row. A column store keeps the cells of a column together, so it reads only those two.',
		phases: [
			[1, 'The same table, stored twice', { role: 'src', key: 'A table can be stored row by row or column by column; the cells are the same.', changes: [['+', '16 cells, two layouts']] }],
			[3, 'The report needs B and D', { role: 'out', key: 'A report usually needs a few columns of the table, and every row of them.', changes: [['+', '8 cells needed']] }],
			[5, 'Row store: every row is read', { role: 'flt', key: 'A row block holds all four cells of a row, so the cells of A and C come along too.', changes: [['+', '16 cells read']] }],
			[7, 'Column store: two blocks are read', { role: 'grp', key: 'A column block holds one column, so the blocks of A and C are never read.', changes: [['+', '8 cells read'], ['−', '2 blocks skipped']] }],
		],
		counters: [
			{ label: 'needed', role: 'out', values: [[3, 8]] },
			{ label: 'row store', role: 'flt', values: [[5, 16]] },
			{ label: 'column', role: 'grp', values: [[7, 8]] },
		],
	});
	a.text(10, 14, 'Row store, column store', 'f11 b');

	const cell = (x, y, name, needed) => {
		a.rect(x, y, CW, CH, tint('src', 1), undefined, 3);
		if (needed) a.rect(x, y, CW, CH, tint('out', 3), { in: 3 }, 3);
		a.text(x + CW / 2, y + 13, name, 'f10', undefined, 'm');
	};

	// row store: a block for each row
	a.text(10, 52, 'Row store: a block for each row', 'f10 b');
	for (let r = 0; r < 4; r++) {
		const y = 60 + (CH + 2) * r;
		a.rect(8, y - 2, CW * 4 + 4, CH + 4, tint('flt', 2), { in: 5 }, 5);
		COLS.forEach((c, i) => cell(10 + CW * i, y, `${c}${r + 1}`, NEEDED.includes(c)));
	}
	a.text(184, 100, 'reads 16 cells', 'f11 b', { in: 5 });

	// column store: a block for each column
	a.text(10, 152, 'Column store: a block for each column', 'f10 b');
	COLS.forEach((c, i) => {
		const x = 10 + (CW + 6) * i;
		const needed = NEEDED.includes(c);
		a.rect(x - 2, 158, CW + 4, (CH + 2) * 4 + 4, tint(needed ? 'grp' : 'ord', needed ? 2 : 1), needed ? { in: 7 } : { in: 7 }, 5);
		for (let r = 0; r < 4; r++) cell(x, 160 + (CH + 2) * r, `${c}${r + 1}`, needed);
		a.text(x + CW / 2, 250, needed ? 'read' : 'skipped', 'f10 b', { in: 7 }, 'm');
	});
	a.text(214, 200, 'reads 8 cells', 'f11 b', { in: 7 });
	return a;
}

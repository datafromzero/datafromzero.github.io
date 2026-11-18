// Concept animations (SPEC D41, no real data), one per join type: `node scripts/make-animation.mjs concept-join:left`
// (variants inner, left, right, full, cross). Two small tables with keys A B C and B C D (labels only). 6 s loop of 8 phases:
// 1 the tables, 2 matching keys light up and pair, 3 the matched rows enter the result, 4 the rows the join also keeps
// (with NULL cells) or drops (a red x) and the kept keys fill the circles, 5 the row count, 6 to 8 hold.
// CROSS has no keys to match: every pairing is drawn and every pairing is a row.
import { anim, tint } from '../lib/step-animation.mjs';

const LEFT = [['A', 'l1'], ['B', 'l2'], ['C', 'l3']];
const RIGHT = [['B', 'r1'], ['C', 'r2'], ['D', 'r3']];
const TEXT = {
	inner: ['INNER JOIN', 'INNER JOIN keeps only the pairs whose keys match. A row with no partner is dropped.'],
	left: ['LEFT JOIN', 'LEFT JOIN keeps every row of the first table. A row with no partner is kept, with NULL in the columns of the second table.'],
	right: ['RIGHT JOIN', 'RIGHT JOIN keeps every row of the second table. A row with no partner is kept, with NULL in the columns of the first table.'],
	full: ['FULL JOIN', 'FULL JOIN keeps every row of both tables. A row with no partner is kept, with NULL in the other table’s columns.'],
	cross: ['CROSS JOIN', 'CROSS JOIN has no keys to match: it pairs every row of the first table with every row of the second.'],
};

export default function make({ id, variant = 'left' } = {}) {
	if (!TEXT[variant]) throw new Error(`concept-join: unknown variant "${variant}" (${Object.keys(TEXT).join(', ')})`);
	const [name, caption] = TEXT[variant];
	const cross = variant === 'cross';
	const keepLeft = variant === 'left' || variant === 'full';
	const keepRight = variant === 'right' || variant === 'full';
	// result rows: [left cell, right cell, phase, role]
	let rows;
	if (cross) {
		rows = LEFT.flatMap(([k, v], i) => RIGHT.map(([k2, v2], j) => [`${k} ${v}`, `${k2} ${v2}`, i * 3 + j < 5 ? 3 : 4, 'src']));
	} else {
		rows = [];
		if (keepLeft) rows.push(['A l1', 'NULL', 4, 'flt']);
		rows.push(['B l2', 'B r1', 3, 'mat'], ['C l3', 'C r2', 3, 'mat']);
		if (keepRight) rows.push(['NULL', 'D r3', 4, 'flt']);
	}
	const H = 24 + 20 * (rows.length + 1);
	const a = anim({
		id: id ?? `jn-${variant}`,
		h: Math.max(cross ? 0 : 196, H + 30),
		loop: { cycle: 6 },
		title: `${name}: matched pairs and kept rows`,
		desc: `Two small tables of labels: the first table has keys A, B and C, the second has keys B, C and D. ${
			cross
				? 'CROSS JOIN draws a line from every row of the first table to every row of the second and returns all 9 pairings.'
				: `Keys B and C match and are paired by lines. ${
						{ inner: 'INNER JOIN returns the 2 matched rows; the rows with keys A and D have no partner and are dropped.', left: 'LEFT JOIN returns the 2 matched rows and the row with key A, with NULL in the second table’s column: 3 rows.', right: 'RIGHT JOIN returns the 2 matched rows and the row with key D, with NULL in the first table’s column: 3 rows.', full: 'FULL JOIN returns the 2 matched rows, the row with key A with NULL on the right and the row with key D with NULL on the left: 4 rows.' }[variant]
					} Two circles in the corner show which keys are kept.`
		}`,
		caption,
	});
	const ty = 24;
	const cy = (i) => ty + 30 + 20 * i; // center of data row i
	// key tints (before text): matching keys light up in phase 2, a key without a partner turns red in phase 4
	if (!cross) {
		for (const i of [1, 2]) {
			a.rect(10, ty + 20 + 20 * i, 28, 20, tint('mat', 3), { in: 2 });
			a.rect(112, ty + 20 + 20 * (i - 1), 28, 20, tint('mat', 3), { in: 2 });
		}
		a.rect(10, ty + 20, 28, 20, tint('flt', 3), { in: 4 });
		a.rect(112, ty + 60, 28, 20, tint('flt', 3), { in: 4 });
	}
	for (const [x, label, t] of [[10, 't1', LEFT], [112, 't2', RIGHT]]) {
		a.grid(x, ty, [28, 36], 4, 20);
		a.text(x + 5, ty + 14, 'key', 'f10 b');
		a.text(x + 33, ty + 14, label, 'f10 b');
		t.forEach(([k, v], i) => {
			a.text(x + 5, cy(i) + 4, k, 'f11 b');
			a.text(x + 33, cy(i) + 4, v, 'f11');
		});
	}
	// the pairs
	const pairs = cross
		? LEFT.flatMap((_, i) => RIGHT.map((__, j) => `M74 ${cy(i)}L112 ${cy(j)}`)).join('')
		: `M74 ${cy(1)}L112 ${cy(0)}M74 ${cy(2)}L112 ${cy(1)}`;
	a.path(pairs, 's-mat', { in: 2, draw: true });
	if (variant === 'inner') {
		a.text(84, cy(0) + 5, '×', 'f14 b', { in: 4 });
		a.text(100, cy(2) + 5, '×', 'f14 b', { in: 4 });
	}
	// result table
	a.g({ in: 3 }, () => a.row(200, ty, [{ w: 75, text: 't1' }, { w: 75, text: 't2' }], { head: true, tint: tint('out', 2), cells: false }));
	rows.forEach(([l, r, p, role], i) => {
		const y = ty + 20 * (i + 1);
		a.row(200, y, [{ w: 75, text: l, c: l === 'NULL' ? 'f11 mu' : 'f11' }, { w: 75, text: r, c: r === 'NULL' ? 'f11 mu' : 'f11' }], { fx: { in: p }, tint: tint(role, 2), cells: false });
	});
	a.grid(200, ty, [75, 75], rows.length + 1, 20, { in: 3 });
	a.text(200, ty + 20 * (rows.length + 1) + 16, `${rows.length} rows`, 'f11 b', { in: 5 });
	// the kept keys, as circles of keys (they count keys, not rows)
	if (!cross) {
		const v = a.venn({ x1: 52, x2: 86, y: 154, r: 28 });
		v.region('O', tint('mat', 3), { in: 3 });
		if (keepLeft) v.region('L', tint('src', 3), { in: 4 });
		if (keepRight) v.region('R', tint('src', 3), { in: 4 });
		v.outline();
		a.text(v.center('L').x, 158, 't1', 'f10 b', undefined, 'm');
		a.text(v.center('R').x, 158, 't2', 'f10 b', undefined, 'm');
	}
	return a;
}

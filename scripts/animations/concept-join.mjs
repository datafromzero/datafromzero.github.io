// Concept animations (SPEC D41, no real data), one per join type: `node scripts/make-animation.mjs concept-join:left`
// (variants inner, left, right, full, cross) and a cycling overview `concept-join:all`. Two small tables of labels, keys A B C and
// B C D. Metaphor: keys shake hands. 8 s loop of 8 phases for inner, left, right and full:
// 1 the tables; 2 the matching keys slide together and shake hands (violet); 3 each pair moves into the result; 4 the rows the join
// also keeps move in (with NULL cells), or are marked red and stay behind; 5 the row count; 6 to 8 hold.
// CROSS has no keys to match: every row meets every row, and every pairing is a result row, three at a time.
// `all` steps through LEFT, RIGHT, INNER and FULL, two phases each, with the type name lit.
// Every variant carries live counters, a Key idea and What changed (D41).
import { anim, tint } from '../lib/step-animation.mjs';

const L = [['A', 'l1'], ['B', 'l2'], ['C', 'l3']];
const R = [['B', 'r1'], ['C', 'r2'], ['D', 'r3']];
const TITLE = {
	inner: 'INNER JOIN · only handshakes get through',
	left: 'LEFT JOIN · every left row gets through',
	right: 'RIGHT JOIN · every right row gets through',
	full: 'FULL JOIN · every row gets through',
	cross: 'CROSS JOIN · everyone meets everyone',
	all: 'Join types · who gets through?',
};
const CAPTION = {
	inner: 'INNER JOIN keeps only the pairs whose keys match. A row with no partner is not kept.',
	left: 'LEFT JOIN keeps every row of the first table. A row with no partner is kept, with NULL in the second table’s columns.',
	right: 'RIGHT JOIN keeps every row of the second table. A row with no partner is kept, with NULL in the first table’s columns.',
	full: 'FULL JOIN keeps every row of both tables. A row with no partner is kept, with NULL in the other table’s columns.',
	cross: 'CROSS JOIN has no keys to match: every row of the first table meets every row of the second.',
	all: 'The four joins differ only in which unpaired rows they keep: LEFT the first table’s, RIGHT the second’s, INNER neither, FULL both.',
};
// Live counts (D41): the rows drawn at each phase, with a Key idea and What changed per step. The four keyed variants share steps 1 to 3
// and differ in what they keep (step 4) and in the closing step.
const PAIRS = [
	[1, 'Two tables, each with keys', { role: 'src', key: 'A join starts from two tables; every row has a key.', changes: [['+', 't1: 3 rows'], ['+', 't2: 3 rows']] }],
	[2, 'Matching keys shake hands', { role: 'mat', key: 'Rows with equal keys are a match; the others have no partner.', changes: [['+', '2 matches: B and C']] }],
	[3, 'The pairs move into the result', { role: 'mat', key: 'Each match becomes one result row, with the columns of both tables.', changes: [['+', '2 result rows'], ['+', 'columns from t1 and t2']] }],
];
const KEPT = {
	inner: { role: 'flt', key: 'INNER JOIN drops the rows with no partner, so only the matched pairs are in the result.', changes: [['−', 'row A (t1) not kept'], ['−', 'row D (t2) not kept']] },
	left: { role: 'src', key: 'LEFT JOIN also keeps the t1 rows with no partner and fills the gap with NULL.', changes: [['+', 'row A, t1 only'], ['+', 'NULL in the t2 column']] },
	right: { role: 'src', key: 'RIGHT JOIN also keeps the t2 rows with no partner and fills the gap with NULL.', changes: [['+', 'row D, t2 only'], ['+', 'NULL in the t1 column']] },
	full: { role: 'src', key: 'FULL JOIN keeps the rows with no partner from both tables, with NULL where the other side is missing.', changes: [['+', 'row A, NULL on the right'], ['+', 'row D, NULL on the left']] },
};
const END = {
	inner: { role: 'out', key: 'The result holds only matched pairs, so it can have fewer rows than either table.', changes: [['~', '2 rows: both matched']] },
	left: { role: 'out', key: 'Every t1 row appears at least once, so the result never has fewer rows than t1.', changes: [['~', '3 rows: 2 matched, 1 kept alone']] },
	right: { role: 'out', key: 'Every t2 row appears at least once, so the result never has fewer rows than t2.', changes: [['~', '3 rows: 2 matched, 1 kept alone']] },
	full: { role: 'out', key: 'Every row of both tables appears at least once, so no row is lost.', changes: [['~', '4 rows: 2 matched, 2 kept alone']] },
};
const PHASE4 = { inner: 'Rows with no partner are not kept', left: 'Left rows with no partner are kept (NULL)', right: 'Right rows with no partner are kept (NULL)', full: 'Rows with no partner are kept (NULL)' };
const live = (variant, rows) => ({
	phases: [...PAIRS, [4, PHASE4[variant], KEPT[variant]], [5, `The result has ${rows} rows`, END[variant]]],
	counters: [
		{ label: 't1', role: 'src', values: [[1, 3]] },
		{ label: 't2', role: 'src', values: [[1, 3]] },
		{ label: 'matches', role: 'mat', values: [[2, 2]] },
		{ label: 'result rows', role: 'out', values: [[3, 2], [4, rows]] },
	],
});
const Y = (i) => 44 + 30 * i; // row i of a source column or of the result
const W = 52;

export default function make({ id, variant = 'left' } = {}) {
	if (!TITLE[variant]) throw new Error(`concept-join: unknown variant "${variant}" (${Object.keys(TITLE).join(', ')})`);
	id ??= `jn-${variant}`;
	if (variant === 'cross') return cross(id);
	if (variant === 'all') return all(id);
	const keepL = variant === 'left' || variant === 'full';
	const keepR = variant === 'right' || variant === 'full';
	const rows = 2 + (keepL ? 1 : 0) + (keepR ? 1 : 0);
	const a = anim({
		id,
		h: 226,
		loop: { cycle: 8 },
		title: `${TITLE[variant]}`,
		desc: `Two small tables of labels: the first has keys A, B and C, the second has keys B, C and D. Keys B and C match: they slide together, shake hands and move into the result as pairs. ${
			{
				inner: 'INNER JOIN keeps only those 2 pairs; the rows with keys A and D have no partner, are marked red and stay behind: 2 rows.',
				left: 'LEFT JOIN also moves the row with key A into the result, with NULL in the second table’s column: 3 rows.',
				right: 'RIGHT JOIN also moves the row with key D into the result, with NULL in the first table’s column: 3 rows.',
				full: 'FULL JOIN also moves the row with key A, with NULL on the right, and the row with key D, with NULL on the left, into the result: 4 rows.',
			}[variant]
		} Two circles in the corner show which keys are kept.`,
		caption: CAPTION[variant],
		tag: { y: 27 },
		...live(variant, rows),
	});
	a.text(10, 14, TITLE[variant], 'f11 b');
	a.text(10, 41, 't1', 'f10 mu');
	a.text(150, 41, 't2', 'f10 mu');
	a.text(220, 41, 'result', 'f10 mu');
	// the circles of kept keys (they count keys, not rows)
	const v = a.venn({ x1: 44, x2: 78, y: 190, r: 26 });
	v.region('O', tint('mat', 3), { in: 3 });
	if (keepL) v.region('L', tint('src', 3), { in: 4 });
	if (keepR) v.region('R', tint('src', 3), { in: 4 });
	v.outline();
	a.text(v.center('L').x, 194, 't1', 'f10 b', undefined, 'm');
	a.text(v.center('R').x, 194, 't2', 'f10 b', undefined, 'm');
	// the seats the rows leave behind
	for (let i = 0; i < 3; i++) {
		a.rect(10, Y(i), W, 24, 'bx dsh', undefined, 6);
		a.rect(150, Y(i + 1), W, 24, 'bx dsh', undefined, 6);
	}
	const mat = [{ role: 'mat', level: 3, fx: { in: 2 } }];
	const red = [{ role: 'flt', level: 3, fx: { in: 4 } }];
	// the two matched pairs: the right key slides to the left one, then the pair moves into the result
	const pairDy = variant === 'inner' || variant === 'right' ? -30 : 0;
	for (const k of [0, 1]) {
		a.move({ dx: 210, dy: pairDy, at: 3 }, () => {
			a.chip(10, Y(k + 1), `${L[k + 1][0]} ${L[k + 1][1]}`, { w: W, flags: mat });
			a.rect(62, Y(k + 1) + 8, 8, 8, tint('mat', 3), { in: 3 }, 2);
			a.move({ dx: -80, at: 2 }, () => a.chip(150, Y(k + 1), `${R[k][0]} ${R[k][1]}`, { w: W, flags: mat }));
			a.rect(6, Y(k + 1) - 4, 120, 32, 's-mat', { in: 3, hide: 4, pulse: true }, 10);
		});
	}
	// the unpaired rows
	if (keepL) {
		a.move({ dx: 210, at: 4 }, () => a.chip(10, Y(0), 'A l1', { w: W }));
		a.chip(280, Y(0), 'NULL', { role: 'ord', level: 2, w: W, fx: { in: 5 } });
	} else a.chip(10, Y(0), 'A l1', { w: W, flags: red });
	if (keepR) {
		const yd = variant === 'full' ? 3 : 2;
		a.move({ dx: 130, dy: (yd - 3) * 30, at: 4 }, () => a.chip(150, Y(3), 'D r3', { w: W }));
		a.chip(220, Y(yd), 'NULL', { role: 'ord', level: 2, w: W, fx: { in: 5 } });
	} else a.chip(150, Y(3), 'D r3', { w: W, flags: red });
	a.text(220, Y(rows - 1) + 40, `${rows} rows`, 'f11 b', { in: 5 });
	return a;
}

function cross(id) {
	const a = anim({
		id,
		h: 250,
		loop: { cycle: 8 },
		title: TITLE.cross,
		desc: 'Two small tables of labels: the first has keys A, B and C, the second has keys B, C and D. Lines join every row of the first table to every row of the second. Every pairing becomes a row of the result, three at a time, 9 rows in all.',
		caption: CAPTION.cross,
		phases: [
			[1, 'Two tables, each with keys', { role: 'src', key: 'A cross join needs no keys: it only needs two tables.', changes: [['+', 't1: 3 rows'], ['+', 't2: 3 rows']] }],
			[2, 'Every row meets every row', { role: 'mat', key: 'Every row of t1 is paired with every row of t2, whatever their keys are.', changes: [['+', '3 × 3 pairs']] }],
			[3, 'Every pairing becomes a result row', { role: 'out', key: 'Each pair becomes one result row, so the rows multiply instead of adding up.', changes: [['+', 'result rows grow 3, 6, 9']] }],
			[6, 'The result has 9 rows', { role: 'out', key: 'The result has as many rows as t1 times t2: every pair, once.', changes: [['~', '3 × 3 = 9 rows']] }],
		],
		counters: [
			{ label: 't1', role: 'src', values: [[1, 3]] },
			{ label: 't2', role: 'src', values: [[1, 3]] },
			{ label: 'pairs', role: 'mat', values: [[2, '3 × 3']] },
			{ label: 'result rows', role: 'out', values: [[3, 3], [4, 6], [5, 9]] },
		],
		tag: { y: 27 },
	});
	a.text(10, 14, TITLE.cross, 'f11 b');
	a.text(10, 41, 't1', 'f10 mu');
	a.text(100, 41, 't2', 'f10 mu');
	a.text(220, 41, 'result', 'f10 mu');
	a.path(L.flatMap((_, i) => R.map((__, j) => `M62 ${Y(i) + 12}L100 ${Y(j) + 12}`)).join(''), 's-mat', { in: 2, draw: true });
	L.forEach(([k, v], i) => a.chip(10, Y(i), `${k} ${v}`, { w: W }));
	R.forEach(([k, v], j) => a.chip(100, Y(j), `${k} ${v}`, { w: W }));
	L.forEach(([k, v], i) =>
		R.forEach(([k2, v2], j) => {
			const y = 46 + 20 * (3 * i + j);
			a.move({ dx: 30, at: 3 + i, fx: { in: 3 + i } }, () => a.chip(190, y, `${k} ${v} · ${k2} ${v2}`, { role: 'mat', level: 2, w: 120, h: 18, c: 'f10' }));
		}),
	);
	a.text(220, 244, '9 rows', 'f11 b', { in: 6 });
	return a;
}

// the overview: LEFT, RIGHT, INNER, FULL, two phases each; the kept keys light up, the unpaired rows that are not kept turn red,
// and the result lists the kept rows
function all(id) {
	const types = [
		{ name: 'LEFT JOIN', note: 'keeps every row of the first table', from: 1, to: 3, keepL: true, keepR: false },
		{ name: 'RIGHT JOIN', note: 'keeps every row of the second table', from: 3, to: 5, keepL: false, keepR: true },
		{ name: 'INNER JOIN', note: 'keeps only the pairs', from: 5, to: 7, keepL: false, keepR: false },
		{ name: 'FULL JOIN', note: 'keeps every row of both tables', from: 7, to: 9, keepL: true, keepR: true },
	];
	const a = anim({
		id,
		h: 228,
		loop: { cycle: 8 },
		title: TITLE.all,
		desc: 'Two small tables of labels: keys A, B and C, and keys B, C and D. Keys B and C match. The animation steps through LEFT JOIN, RIGHT JOIN, INNER JOIN and FULL JOIN, naming each, lighting the rows it keeps and listing its result: LEFT 3 rows, RIGHT 3 rows, INNER 2 rows, FULL 4 rows. Rows with no partner that a join does not keep are marked red.',
		caption: CAPTION.all,
		phases: [
			[1, 'LEFT JOIN: every row of t1 is kept', { role: 'src', key: 'LEFT JOIN keeps every row of t1, matched or not.', changes: [['+', '3 rows: 2 pairs and A']] }],
			[3, 'RIGHT JOIN: every row of t2 is kept', { role: 'src', key: 'RIGHT JOIN keeps every row of t2, matched or not.', changes: [['+', '3 rows: 2 pairs and D']] }],
			[5, 'INNER JOIN: only the pairs are kept', { role: 'mat', key: 'INNER JOIN keeps only the pairs, so A and D are both left out.', changes: [['−', 'A and D left out'], ['~', '2 rows: the pairs']] }],
			[7, 'FULL JOIN: every row of both is kept', { role: 'out', key: 'FULL JOIN keeps every row of both tables, matched or not.', changes: [['+', '4 rows: 2 pairs, A and D']] }],
		],
		counters: [
			{ label: 'result rows', role: 'out', values: [[1, 3], [3, 3], [5, 2], [7, 4]] },
			{ label: 'matched pairs', role: 'mat', values: [[1, 2], [3, 2], [5, 2], [7, 2]] },
			{ label: 'unpaired kept', role: 'src', values: [[1, 1], [3, 1], [5, 0], [7, 2]] },
		],
		tag: { y: 27 },
	});
	a.text(10, 14, TITLE.all, 'f11 b');
	a.text(10, 41, 't1', 'f10 mu');
	a.text(80, 41, 't2', 'f10 mu');
	a.text(180, 41, 'result', 'f10 mu');
	// red layers first (under the chips' text), per type window
	const red = (key) => types.filter((t) => !t[key]).map((t) => ({ role: 'flt', level: 3, fx: { in: t.from, hide: t.to } }));
	const mat = [{ role: 'mat', level: 3 }];
	L.forEach(([k, v], i) => a.chip(10, Y(i), `${k} ${v}`, { w: W, flags: i === 0 ? red('keepL') : mat }));
	R.forEach(([k, v], j) => a.chip(80, Y(j + 1), `${k} ${v}`, { w: W, flags: j === 2 ? red('keepR') : mat }));
	a.path(`M62 ${Y(1) + 12}L80 ${Y(1) + 12}M62 ${Y(2) + 12}L80 ${Y(2) + 12}`, 's-mat');
	// results
	types.forEach((t, i) => {
		const rows = [];
		if (t.keepL) rows.push(['A l1', 'NULL', 'src']);
		rows.push(['B l2', 'B r1', 'mat'], ['C l3', 'C r2', 'mat']);
		if (t.keepR) rows.push(['NULL', 'D r3', 'src']);
		const fx = { in: t.from, ...(i < 3 ? { hide: t.to } : {}) };
		rows.forEach(([l, r, role], j) => {
			const c = (x, label) => a.chip(x, Y(j), label, { role: label === 'NULL' ? 'ord' : role, level: 2, w: W, fx });
			c(180, l);
			c(240, r);
		});
		a.text(300, Y(rows.length - 1) + 16, `${rows.length} rows`, 'f11 b', fx);
	});
	const v = a.venn({ x1: 44, x2: 78, y: 190, r: 26 });
	types.forEach((t, i) => {
		const fx = { in: t.from, ...(i < 3 ? { hide: t.to } : {}) };
		v.region('O', tint('mat', 3), fx);
		if (t.keepL) v.region('L', tint('src', 3), fx);
		if (t.keepR) v.region('R', tint('src', 3), fx);
	});
	v.outline();
	return a;
}

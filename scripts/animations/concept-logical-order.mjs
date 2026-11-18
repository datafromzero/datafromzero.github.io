// Concept animation (SPEC D41, no real data): the logical order of a SQL query. Left: the clauses in the order they are written
// (SELECT first); the number beside each appears when it runs. Right: t1 and t2 combine into one table, then each clause changes
// it. 8 s loop of 8 phases, one per clause: 1 FROM/JOIN/ON, 2 WHERE (two rows are dropped), 3 GROUP BY (the kept rows form
// groups A, B, C), 4 HAVING (group A is dropped), 5 SELECT (the output columns), 6 ORDER BY (a sort number), 7 LIMIT (the rest is
// cut), 8 hold.
import { anim, tint, edge } from '../lib/step-animation.mjs';

const CLAUSES = [
	{ name: 'SELECT', run: 5, role: 'out' },
	{ name: 'FROM/JOIN/ON', run: 1, role: 'src' },
	{ name: 'WHERE', run: 2, role: 'flt' },
	{ name: 'GROUP BY', run: 3, role: 'grp' },
	{ name: 'HAVING', run: 4, role: 'flt' },
	{ name: 'ORDER BY', run: 6, role: 'ord' },
	{ name: 'LIMIT', run: 7, role: 'ord' },
];
const G = ['A', 'A', 'B', 'B', 'B', 'C', 'C']; // group key of rows r1 to r7
const DROPPED = [1, 4]; // WHERE drops r2 and r5
const SHADE = { A: 1, B: 2, C: 4 };
const X = 136;
const RH = 17;

export default function make({ id = 'lo' } = {}) {
	const a = anim({
		id,
		h: 282,
		loop: { cycle: 8 },
		title: 'The order a query runs in, compared with the order it is written in',
		desc:
			'Left, the clauses in written order: SELECT, FROM/JOIN/ON, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, each with the number of the step it runs in: SELECT 5, FROM/JOIN/ON 1, WHERE 2, GROUP BY 3, HAVING 4, ORDER BY 6, LIMIT 7. Right: tables t1 and t2 are combined into one table of seven rows. WHERE drops two rows. GROUP BY makes groups A, B and C from the rest. HAVING drops group A. SELECT picks the output columns, ORDER BY gives the groups a sort number, and LIMIT cuts the group that sorts second.',
		caption: 'The list is the order you write the clauses; the number is the order they run. Each clause works on the result of the one before it.',
	});

	// written order, with the clause that runs in each phase lit
	a.text(10, 14, 'Written order', 'f10 mu');
	CLAUSES.forEach(({ run, role }, i) => a.rect(8, 22 + 24 * i, 116, 22, tint(role, 2), { in: run, hide: run + 1 }));
	CLAUSES.forEach(({ name, run }, i) => {
		a.text(14, 37 + 24 * i, name, 'f10 b mo');
		a.text(120, 37 + 24 * i, run, 'f11 b', { in: run }, 'e');
	});

	// t1 and t2 combine into one table
	for (const [x, t] of [[X, 't1'], [X + 76, 't2']]) {
		a.rect(x, 14, 64, 22, edge('src'), undefined, 4);
		a.text(x + 32, 29, t, 'f11 b', undefined, 'm');
		a.arrow(x + 32, 38, x + 32, 54, 's-src', { in: 1, draw: true });
	}
	const W = [46, 56, 56, 56];
	const cols = (cells, c = 'f11') => W.map((w, i) => ({ w, text: cells[i], c }));
	a.row(X, 56, cols(['row', 't1', 't2', 'g']), { h: RH, head: true, tint: tint('src', 2), cells: false });
	G.forEach((g, i) => {
		const dropped = DROPPED.includes(i);
		a.row(X, 56 + RH * (i + 1), cols([`r${i + 1}`, `a${i + 1}`, `b${i + 1}`, g]), {
			h: RH,
			cells: false,
			tint: dropped ? tint('flt', 3) : tint('grp', SHADE[g]),
			tintFx: { in: dropped ? 2 : 3 },
		});
	});
	a.grid(X, 56, W, 8, RH);

	// after GROUP BY: one row per group
	a.arrow(150, 195, 150, 207, 's-grp', { in: 3, draw: true });
	const GW = [60, 60, 60];
	const gy = 209;
	a.rect(X + 60, gy, 60, RH, tint('out', 3), { in: 5 });
	a.rect(X, gy + RH * 2, 180, RH, tint('ord', 3), { in: 7 });
	a.g({ in: 3 }, () => {
		a.row(X, gy, [{ w: 60, text: 'g' }, { w: 60, text: 'n' }], { h: RH, head: true, tint: tint('src', 2), cells: false });
		[['A', 1], ['B', 2], ['C', 2]].forEach(([g, n], i) => {
			const y = gy + RH * (i + 1);
			if (g === 'A') a.rect(X, y, 120, RH, tint('flt', 3), { in: 4 }); // under the text
			a.row(X, y, [{ w: 60, text: g }, { w: 60, text: n }], { h: RH, cells: false, tint: tint('grp', SHADE[g]), tintFx: g === 'A' ? { hide: 4 } : undefined });
		});
		a.grid(X, gy, GW.slice(0, 2), 4, RH);
	});
	a.g({ in: 6 }, () => {
		a.row(X + 120, gy, [{ w: 60, text: 'sort' }], { h: RH, head: true, tint: tint('ord', 2), cells: false });
		a.text(X + 125, gy + RH * 2 + 12, '2', 'f11 b');
		a.text(X + 125, gy + RH * 3 + 12, '1', 'f11 b');
		a.grid(X + 120, gy, [60], 4, RH);
	});
	a.text(X + 188, gy + RH * 2 + 12, 'cut', 'f10 b', { in: 7 });
	return a;
}

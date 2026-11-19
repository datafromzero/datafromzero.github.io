// Concept animation (SPEC D41, no real data): the logical order of a SQL query. Left: the clauses in the order they are written
// (SELECT first); the number beside each appears when it runs. Right: t1 and t2 combine into one table of seven rows, then each
// clause changes it, and the table shrinks. 8 s loop of 8 phases, one per clause:
// 1 FROM/JOIN/ON; 2 WHERE (two rows slide out, the rest close the gaps); 3 GROUP BY (the kept rows take their group's shade and a
// one-row-per-group table appears); 4 HAVING (group A slides out, the others move up); 5 SELECT (the output is chosen); 6 ORDER BY
// (a sort number appears); 7 LIMIT (the group that sorts second slides out); 8 hold.
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
const KEYS = ['A', 'A', 'B', 'B', 'B', 'C', 'C']; // group key of rows r1 to r7
const DROPPED = [1, 4]; // WHERE drops r2 and r5
const SHADE = { A: 1, B: 2, C: 4 };
const X = 136;
const TY = 84; // top of the first table row
const GY = 252; // top of the first group row

export default function make({ id = 'lo' } = {}) {
	const a = anim({
		id,
		h: 316,
		loop: { cycle: 8 },
		title: 'The order a query runs in, compared with the order it is written in',
		desc:
			'Left, the clauses in written order: SELECT, FROM/JOIN/ON, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, each with the number of the step it runs in: SELECT 5, FROM/JOIN/ON 1, WHERE 2, GROUP BY 3, HAVING 4, ORDER BY 6, LIMIT 7. Right: tables t1 and t2 are combined into one table of seven rows. WHERE drops two rows, which slide out. GROUP BY gives the rest their group shade and makes one row per group: A, B and C. HAVING drops group A. SELECT chooses the output, ORDER BY gives the groups a sort number, and LIMIT drops the group that sorts second.',
		caption: 'The list is the order you write the clauses; the number is the order they run. Each clause works on the table the one before it left.',
		phases: [[1, 'FROM and JOIN build one table'], [2, 'WHERE drops rows'], [3, 'GROUP BY makes groups; HAVING drops one'], [5, 'SELECT picks the output'], [6, 'ORDER BY sorts; LIMIT cuts']],
	});
	a.text(10, 14, 'Written order → run order', 'f11 b');

	// written order, with the clause that runs in each phase lit
	CLAUSES.forEach(({ run, role }, i) => a.rect(8, 42 + 24 * i, 116, 22, tint(role, 2), { in: run, hide: run + 1 }, 6));
	CLAUSES.forEach(({ name, run }, i) => {
		a.text(14, 57 + 24 * i, name, 'f10 b mo');
		a.text(118, 57 + 24 * i, run, 'f11 b', { in: run }, 'e');
	});

	// t1 and t2 combine into one table
	for (const [x, t] of [[X, 't1'], [X + 76, 't2']]) {
		a.rect(x, 40, 64, 22, edge('src'), undefined, 6);
		a.text(x + 32, 55, t, 'f11 b', undefined, 'm');
		a.arrow(x + 32, 64, x + 32, 80, 's-src', { in: 1, draw: true });
	}
	// the table: WHERE drops r2 and r5 (they slide out), the rows below close the gaps; GROUP BY shades what is left
	const row = (i) => {
		const y = TY + 20 * i;
		const dropped = DROPPED.includes(i);
		a.rect(X, y, 214, 18, tint('src', 1), undefined, 4);
		a.rect(X, y, 214, 18, dropped ? tint('flt', 3) : tint('grp', SHADE[KEYS[i]]), { in: dropped ? 2 : 3 }, 4);
		a.text(X + 10, y + 13, `r${i + 1}`, 'f11');
		a.text(X + 56, y + 13, `a${i + 1} · b${i + 1}`, 'f11');
		a.text(X + 192, y + 13, KEYS[i], 'f11 b');
	};
	KEYS.forEach((_, i) => {
		const dropped = DROPPED.includes(i);
		const up = -20 * DROPPED.filter((d) => d < i).length;
		if (dropped) a.move({ dx: 230, at: 2, half: 'a' }, () => row(i));
		else if (up) a.move({ dy: up, at: 2, half: 'b' }, () => row(i));
		else row(i);
	});

	// after GROUP BY: one row per group; HAVING drops A, ORDER BY numbers the rest, LIMIT drops the second
	a.arrow(150, 226, 150, 246, 's-grp', { in: 3, draw: true });
	const grow = (k, n, y, fx) =>
		a.g(fx, () => {
			a.rect(X, y, 140, 18, tint('grp', SHADE[k]), undefined, 4);
			a.rect(X, y, 140, 18, tint(k === 'A' ? 'flt' : 'out', 3), k === 'A' ? { in: 4 } : { in: 5 }, 4);
			a.text(X + 10, y + 13, k, 'f11 b');
			a.text(X + 56, y + 13, `${n} ${n === 1 ? 'row' : 'rows'}`, 'f11');
		});
	a.move({ dx: 230, at: 4, half: 'a', fx: { in: 3 } }, () => grow('A', 1, GY));
	a.move({ dy: -20, at: 4, half: 'b', fx: { in: 3 } }, () => {
		a.move({ dx: 230, at: 7 }, () => {
			grow('B', 2, GY + 20);
			a.chip(X + 148, GY + 20, '2', { role: 'ord', level: 3, w: 40, h: 18, fx: { in: 6 } });
		});
	});
	a.move({ dy: -20, at: 4, half: 'b', fx: { in: 3 } }, () => {
		grow('C', 2, GY + 40);
		a.chip(X + 148, GY + 40, '1', { role: 'ord', level: 3, w: 40, h: 18, fx: { in: 6 } });
	});
	return a;
}

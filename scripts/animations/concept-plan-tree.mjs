// Concept animation (SPEC D41, no real data) for reading a query plan (core lesson C34). Metaphor: a plan is a tree of boxes, and rows flow up
// from the scans at the bottom to the one answer at the top. Abstract only: tables named A and B, boxes named Scan A, Scan B, Filter, Join and
// Aggregate (the operators of relational algebra, drawn as the boxes of a plan; no notation).
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the two Scan boxes; 3 to 4 an arrow up from Scan A to a Filter box; 5 to 6 an arrow up from
// the Filter and one from Scan B to a Join box; 7 to 8 an arrow up to an Aggregate box that says one row per group.
// Facts (DuckDB 2.0 documentation, EXPLAIN page; PostgreSQL 16 documentation, Using EXPLAIN, both opened 2026-11-22): the plan is a tree of operators
// (nodes); the nodes at the bottom are scans that return raw rows; joins, aggregation and sorting are nodes above them. DuckDB moves a simple filter
// into the scan (the lesson's plan shows it inside the scan); the figure draws the Filter as its own box, because that is the vocabulary.
// Counters (D41): boxes 2, 3, 4, 5, each set at the phase that draws the box. Nothing here shows a plan of the lesson's queries.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim, tint, edge } from '../lib/step-animation.mjs';

export default function make({ id = 'pt' } = {}) {
	const a = anim({
		id,
		h: 252,
		loop: { cycle: 8 },
		title: 'A plan is a tree: rows flow up from the scans to the answer',
		desc:
			'A tree of five boxes drawn with the scans at the bottom. Two boxes, Scan A and Scan B, stand at the bottom. An arrow labeled all rows leads up from Scan A to a Filter box. An arrow labeled fewer rows leads up from the Filter to a wide Join box, and an arrow labeled all rows leads up from Scan B to the same Join box. An arrow labeled pairs leads up from the Join to an Aggregate box at the top, which says one row per group.',
		caption: 'A plan is a tree of boxes called operators. The scans at the bottom read the tables, and each box above works on the rows that come up from below.',
		phases: [
			[1, 'Two scans at the bottom', { role: 'src', key: 'The leaves of a plan are scans: they read rows from a table.', changes: [['+', '2 scans']] }],
			[3, 'A filter above a scan', { role: 'flt', key: 'A filter keeps the rows that pass its test, so fewer rows come out than go in.', changes: [['+', '1 filter']] }],
			[5, 'A join takes two inputs', { role: 'mat', key: 'A join has two children: it pairs up their rows by a condition.', changes: [['+', '1 join']] }],
			[7, 'An aggregate at the top', { role: 'grp', key: 'An aggregate turns many rows into one row for each group. Read the tree from the bottom up.', changes: [['+', '1 aggregate']] }],
		],
		counters: [{ label: 'boxes', role: 'src', values: [[1, 2], [3, 3], [5, 4], [7, 5]] }],
	});
	a.text(10, 14, 'Rows flow up the tree', 'f11 b');

	const box = (x, y, w, h, role, name, fx, sub) => {
		a.g(fx, () => {
			a.rect(x, y, w, h, tint(role, 1), undefined, 6);
			a.rect(x, y, w, h, edge(role), undefined, 6);
			a.text(x + w / 2, sub ? y + 15 : y + h / 2 + 4, name, 'f11 b', undefined, 'm');
			if (sub) a.text(x + w / 2, y + 29, sub, 'f10', undefined, 'm');
		});
	};
	box(14, 212, 110, 28, 'src', 'Scan A');
	box(216, 212, 110, 28, 'src', 'Scan B');

	a.arrow(69, 210, 69, 188, 's-flt', { in: 3, draw: true });
	a.text(77, 203, 'all rows', 'f10', { in: 3 });
	box(14, 156, 110, 28, 'flt', 'Filter', { in: 3 });

	a.arrow(69, 154, 69, 132, 's-mat', { in: 5, draw: true });
	a.text(77, 147, 'fewer rows', 'f10', { in: 5 });
	a.arrow(271, 210, 271, 132, 's-mat', { in: 5, draw: true });
	a.text(279, 176, 'all rows', 'f10', { in: 5 });
	box(14, 100, 312, 28, 'mat', 'Join', { in: 5 });

	a.arrow(170, 98, 170, 78, 's-grp', { in: 7, draw: true });
	a.text(178, 91, 'pairs', 'f10', { in: 7 });
	box(14, 40, 312, 36, 'grp', 'Aggregate', { in: 7 }, 'one row per group');
	return a;
}

// Concept animation (SPEC D41, no real data) for what a query is. Metaphor: ask a question, get a table back. 8 s loop of 8 phases:
// 1 a table of four rows; 2 the question box lights up; 3 copies of the rows slide into the box (the table itself stays);
// 4 two rows come out inside the box; 5 they slide out into a new, smaller table; 6 to 8 hold with the row counts.
// Facts: a SELECT never changes the table it reads (DuckDB 2.0.0, concept2/facts2.out: SELECT x FROM t WHERE x > 5 returns 8 and 9, and the table still has all four rows afterwards).
import { anim, tint } from '../lib/step-animation.mjs';

export default function make({ id = 'cq' } = {}) {
	const a = anim({
		id,
		h: 200,
		loop: { cycle: 8 },
		title: 'A query turns a table into a smaller table',
		desc:
			'A table of four rows, Row 1 to Row 4, goes towards a box called your query. Copies of the rows slide into the box; the table itself stays. Two rows, Row 2 and Row 4, come out and slide into a new table on the right. The first table has 4 rows, the new one has 2 rows.',
		caption: 'A query is a question you ask a table. The table stays as it was; the answer comes back as a new table, often smaller.',
	});
	a.text(10, 14, 'Ask a question, get a table back', 'f11 b');
	a.tags(10, 29, [[1, '1 · a table'], [2, '2 · you ask a question'], [3, '3 · its rows go through'], [5, '4 · a new table comes back']]);
	a.badge(10, 38, '4 rows', 'src');
	a.badge(350, 38, '2 rows', 'out', { in: 6 }, 'e');
	const col = (x, level, role, labels, fx) => labels.forEach(([t, y]) => a.chip(x, y, t, { role, level, w: 70, fx }));
	const Y = [66, 96, 126, 156];
	col(10, 2, 'src', Y.map((y, i) => [`Row ${i + 1}`, y]));
	a.box(110, 44, 130, 148, { role: 'out', title: 'your query' });
	a.arrow(84, 118, 108, 118, 's-src', { in: 2, draw: true });
	a.arrow(244, 118, 276, 118, 's-out', { in: 5, draw: true });
	a.rect(106, 40, 138, 156, 's-out', { in: 2, hide: 3, pulse: true }, 10);
	a.rect(106, 40, 138, 156, 's-out', { in: 4, hide: 5, pulse: true }, 10);
	a.ghost(280, 66, 70, 24);
	a.ghost(280, 96, 70, 24);
	a.move({ dx: 130, at: 3, fx: { in: 3, hide: 4 } }, () => Y.forEach((y) => a.rect(10, y, 70, 24, tint('src', 3), undefined, 6)));
	a.move({ dx: 140, at: 5, fx: { in: 4 } }, () => col(140, 3, 'out', [['Row 2', 66], ['Row 4', 96]]));
	return a;
}

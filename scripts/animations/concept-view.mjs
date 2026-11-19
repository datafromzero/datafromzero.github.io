// Concept animation (SPEC D41, no real data) for views. Metaphor: a view is a saved question, not saved answers: ask it again after the
// data changed and the answer is fresh. 8 s loop of 8 phases: 1 a table t with two rows and a view v (a saved query) on it; 2 you ask
// FROM v, and the arrows draw from t through v; 3 the answer is built from t right now (Σ of two rows); 4 a new row arrives in t;
// 5 the view runs again (ring); 6 the answer changes to include the new row; 7 and 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): CREATE VIEW vw AS SELECT SUM(v) s FROM base; with base = 1, 2 SELECT * FROM vw gives 3;
// after INSERT INTO base VALUES (10) the same SELECT gives 13. The view stored the query, not the result.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'vw' } = {}) {
	const a = anim({
		id,
		h: 168,
		loop: { cycle: 8 },
		title: 'A view is a saved question, so its answer is always fresh',
		desc:
			'A table t holds two rows. A view v, a saved query on t, sits next to it. Asking FROM v draws arrows from t through v to an answer: x1 plus x2. A new row, Row 3, arrives in t. The view runs again, and the answer changes to x1 plus x2 plus x3. The view kept the question, not the old answer.',
		caption: 'A view stores a query, not its rows. You use it like a table, and each time you ask it runs on the data as it is now.',
		phases: ['A table and a saved query on it', 'You ask the view, like a table', 'The answer is built from t right now', 'New data arrives in t', 'You ask again: the view runs again', 'The answer includes the new row', 'The view kept the question, not the answer', 'Fresh data, fresh answer'],
	});
	a.text(10, 14, 'A saved question, a fresh answer', 'f11 b');
	a.tags(10, 29, [[1, '1 · a table and a saved query'], [2, '2 · you ask the view'], [3, '3 · answer built from t now'], [4, '4 · new data arrives in t'], [5, '5 · ask again: it runs again'], [6, '6 · the answer is fresh'], [7, '7 · it kept the question']]);
	a.text(10, 54, 'table t', 'f10 b');
	a.chip(10, 62, 'Row 1', { role: 'src', level: 2, w: 70 });
	a.chip(10, 92, 'Row 2', { role: 'src', level: 2, w: 70 });
	a.ghost(10, 122, 70, 24);
	a.chip(10, 122, 'Row 3', { role: 'src', level: 3, w: 70, fx: { in: 4 } });
	a.rect(6, 118, 78, 32, 's-out', { in: 4, hide: 5, pulse: true }, 8);
	a.box(120, 62, 110, 62, { role: 'mat', title: 'view v' });
	a.text(130, 108, 'a saved query', 'f10');
	a.rect(116, 58, 118, 70, 's-mat', { in: 5, hide: 6, pulse: true }, 10);
	a.arrow(84, 93, 116, 93, 's-src', { in: 2, draw: true });
	a.arrow(234, 93, 262, 93, 's-out', { in: 2, draw: true });
	a.text(266, 74, 'FROM v', 'f10 b mo');
	a.chip(266, 82, 'x1 + x2', { role: 'out', level: 3, w: 84, fx: { in: 3, hide: 6 } });
	a.chip(266, 82, 'x1 + x2 + x3', { role: 'out', level: 4, w: 84, fx: { in: 6 } });
	return a;
}

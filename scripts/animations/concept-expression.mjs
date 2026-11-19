// Concept animation (SPEC D41, no real data) for expressions. Metaphor: two cells go in, a new cell comes out, on every row.
// 8 s loop of 8 phases: 1 two columns A and B; 2 to 4 on each row in turn copies of its A and B cells slide into the new column
// and 3 to 5 the computed cell "A × B" replaces them; 6 to 8 hold, every row has a new value and A and B are unchanged.
// Facts (DuckDB 2.0.0, concept2/facts.out): an expression such as 2*3 gives 6 per row and leaves its source columns as they were.
import { anim, tint } from '../lib/step-animation.mjs';

const Y = (i) => 62 + 32 * i;

export default function make({ id = 'ex' } = {}) {
	const a = anim({
		id,
		h: 168,
		loop: { cycle: 8 },
		title: 'An expression builds a new column from old ones, row by row',
		desc:
			'A table with columns A and B and three rows, a1 b1 to a3 b3. For each row in turn, copies of its A and B cells slide to the right, and a new cell in a new column called A times B appears: a1 times b1, a2 times b2, a3 times b3. The original columns stay unchanged.',
		caption: 'An expression such as A × B is worked out separately on every row and shows up as a new column. The columns it used stay as they were.',
	});
	a.text(10, 14, 'Two cells in, a new cell out', 'f11 b');
	a.tags(10, 29, [[1, '1 · two columns, A and B'], [2, '2 · the formula runs on each row'], [6, '3 · every row has a new value']]);
	a.text(34, 54, 'A', 'f10 b', undefined, 'm');
	a.text(94, 54, 'B', 'f10 b', undefined, 'm');
	a.text(268, 54, 'A × B', 'f10 b', { in: 2 }, 'm');
	[0, 1, 2].forEach((i) => {
		const y = Y(i);
		a.chip(10, y, `a${i + 1}`, { role: 'src', level: 2, w: 48 });
		a.chip(70, y, `b${i + 1}`, { role: 'src', level: 2, w: 48 });
		a.ghost(210, y, 116, 24);
		a.move({ dx: 200, at: 2 + i, fx: { in: 2 + i, hide: 3 + i } }, () => {
			a.rect(10, y, 48, 24, tint('out', 3), undefined, 6);
			a.rect(70, y, 48, 24, tint('out', 3), undefined, 6);
		});
		a.chip(210, y, `a${i + 1} × b${i + 1}`, { role: 'out', level: 3, w: 116, fx: { in: 3 + i } });
	});
	return a;
}

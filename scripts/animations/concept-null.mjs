// Concept animation (SPEC D41, no real data) for NULL. Metaphor: a ? is "no value here", not a value you can compare with.
// Two stacked panels, 8 s loop of 8 phases. Top, asking about the ?: 1 three cells x1, ?, x3; 2 and 3 the test `= NULL` answers
// ? for every row (the ? never equals anything, not even itself); 4 and 5 `IS NULL` answers no, yes, no. Bottom, SUM: 6 and 7 x1 and
// x3 flow into the sum while the ? is skipped; 8 the sum is x1 + x3.
// Facts (DuckDB 2.0.0, concept2/facts.out): over 10, NULL, 30: `v = NULL` gives NULL on every row, `v IS NULL` gives false, true,
// false; `SUM(v)` = 40 (the NULL is skipped), `COUNT(*)` = 3, `COUNT(v)` = 2.
import { anim, tint } from '../lib/step-animation.mjs';

const V = ['x1', '?', 'x3'];
const H = 150; // top of the second panel

export default function make({ id = 'nu' } = {}) {
	const a = anim({
		id,
		h: 286,
		loop: { cycle: 8 },
		title: 'A ? means no value: ask with IS NULL, and SUM skips it',
		desc:
			'Top panel: three rows hold x1, a question mark meaning no value, and x3. The test equals NULL answers a question mark, unknown, for every row, so it never says yes. The test IS NULL answers no, yes, no. Bottom panel: SUM adds x1 and x3 through arrows into a result x1 plus x3, and the row with the question mark is skipped.',
		caption: 'A ? (NULL) is no value, so = NULL can only answer ? . IS NULL gives a clear yes or no. Aggregates such as SUM skip the ?.',
	});
	a.text(10, 14, 'Asking about a ?', 'f11 b');
	a.tags(10, 29, [[1, '1 · a ? is "no value"'], [2, '2 · = NULL: the answer is always ?'], [4, '3 · IS NULL: a clear yes or no']]);
	const ry = (y0, i) => y0 + 52 + 28 * i;
	V.forEach((v, i) => a.chip(10, ry(0, i), v, { role: 'src', level: v === '?' ? 3 : 2, w: 60 }));
	a.text(135, 46, 'v = NULL', 'f10 b mo', { in: 2 }, 'm');
	a.text(235, 46, 'v IS NULL', 'f10 b mo', { in: 4 }, 'm');
	V.forEach((_, i) => {
		a.chip(100, ry(0, i), '?', { role: 'ord', level: 3, w: 70, fx: { in: 2 } });
		a.chip(200, ry(0, i), i === 1 ? 'yes' : 'no', { role: 'out', level: i === 1 ? 4 : 2, w: 70, fx: { in: 4 } });
	});
	a.rect(96, 52, 78, 86, 's-ord', { in: 2, hide: 4, pulse: true }, 8);
	a.rect(196, 52, 78, 86, 's-out', { in: 4, hide: 6, pulse: true }, 8);

	a.text(10, H + 14, 'SUM(v) skips the ?', 'f11 b');
	a.tags(10, H + 29, [[6, 'SUM adds only the values it can see']]);
	V.forEach((v, i) => a.chip(10, ry(H, i), v, { role: 'src', level: v === '?' ? 3 : 2, w: 60 }));
	a.text(80, ry(H, 1) + 16, 'skipped', 'f10 b', { in: 6 });
	a.arrow(74, ry(H, 0) + 12, 266, H + 92, 's-out', { in: 6, draw: true });
	a.arrow(74, ry(H, 2) + 12, 266, H + 92, 's-out', { in: 7, draw: true });
	a.ghost(270, H + 80, 78, 24);
	a.chip(270, H + 80, 'Σ = x1 + x3', { role: 'out', level: 3, w: 78, fx: { in: 8 } });
	return a;
}

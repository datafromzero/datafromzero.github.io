// Concept animation (SPEC D41, no real data) for the set operators. Metaphor: two lists of keys as two circles; each operator lights up
// its own part, and its result list appears. Set 1 holds keys A, B, C; set 2 holds B, C, D (B and C are in both).
// 8 s loop of 8 phases: 1 the two sets; 2 UNION lights everything and 3 its list A B C D appears; 4 INTERSECT lights the overlap and 5 its
// list B C; 6 EXCEPT lights what is only in set 1 and 7 its list A; 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): UNION gives A, B, C, D (repeats removed; UNION ALL would give B and C twice);
// INTERSECT gives B, C; set 1 EXCEPT set 2 gives A (set 2 EXCEPT set 1 would give D, so the order matters).
import { anim, tint } from '../lib/step-animation.mjs';

export default function make({ id = 'so' } = {}) {
	const a = anim({
		id,
		h: 176,
		loop: { cycle: 8 },
		title: 'Set operators combine two lists: UNION, INTERSECT, EXCEPT',
		desc:
			'Two overlapping circles: set 1 holds the keys A, B and C, set 2 holds B, C and D; B and C sit in the overlap. UNION lights both circles and lists A, B, C, D. INTERSECT lights only the overlap and lists B, C. EXCEPT lights the part of set 1 that is outside set 2 and lists A.',
		caption: 'UNION keeps every key once, INTERSECT keeps the keys in both lists, and EXCEPT keeps the keys of the first list that are not in the second.',
		phases: ['Two sets of keys', 'UNION lights everything', 'UNION: every key once', 'INTERSECT lights the overlap', 'INTERSECT: keys in both', 'EXCEPT lights the first set only', 'EXCEPT: in the first, not the second', 'Three operators, three results'],
	});
	a.text(10, 14, 'Two lists, three ways to combine', 'f11 b');
	a.tags(10, 29, [[1, '1 · two sets of keys'], [2, '2 · UNION lights everything'], [3, '3 · UNION: every key once'], [4, '4 · INTERSECT lights the overlap'], [5, '5 · INTERSECT: keys in both'], [6, '6 · EXCEPT: first set only'], [7, '7 · EXCEPT: in 1, not in 2']]);
	const v = a.venn({ x1: 100, x2: 170, y: 104, r: 56 });
	for (const k of ['L', 'O', 'R']) v.region(k, tint('out', 3), { in: 2, hide: 4 });
	v.region('O', tint('out', 3), { in: 4, hide: 6 });
	v.region('L', tint('out', 3), { in: 6 });
	v.outline();
	a.text(79, 52, 'set 1', 'f10 b', undefined, 'm');
	a.text(191, 52, 'set 2', 'f10 b', undefined, 'm');
	[['A', 79], ['B C', 135], ['D', 191]].forEach(([t, x]) => a.text(x, 108, t, 'f11 b', undefined, 'm'));
	[['UNION · A B C D', 70, 3], ['INTERSECT · B C', 104, 5], ['EXCEPT · A', 138, 7]].forEach(([t, y, p]) => a.chip(240, y - 24, t, { role: 'out', level: 3, w: 110, fx: { in: p } }));
	return a;
}

// Concept animation (SPEC D41, no real data) for designing a star schema from business questions. Metaphor: the questions name the pieces.
// 8 s loop of 8 phases: 1 three question rows (Q1 total m by X, Q2 total m by Y, Q3 count e by X and Z); 2 the fact box appears
// with its measures m and e inside it; 3, 4 and 5 the dimension boxes X, Y and Z arrive, one per phase, and 4, 5 and 6 draw the link to each;
// 7 a badge names the grain (one row per e, the finest thing a question counts); 8 hold.
// Facts: a design method, not engine output (Kimball Group: the four decisions are the business process, the grain, the dimensions and the
// facts). The lesson's own cafe-sales run is in unit 1; this figure shows no result that a Predict of the lesson asks for.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const QUESTIONS = [
	[44, 'Q1 · total of m, by X'],
	[72, 'Q2 · total of m, by Y'],
	[100, 'Q3 · count of e, by X and Z'],
];

export default function make({ id = 'qs' } = {}) {
	const a = anim({
		id,
		h: 262,
		loop: { cycle: 8 },
		title: 'The questions name the pieces of a star schema',
		desc:
			'Three questions in rows: Q1 total of m by X, Q2 total of m by Y and Q3 count of e by X and Z. A fact table appears below them and takes the numbers the questions ask for, m and e. Three dimension tables X, Y and Z slide in around it, each joined to the fact table by a key. A badge names the grain: one row for each e, the finest thing a question counts.',
		caption: 'Write the questions first. The numbers they ask for are the facts, each "by" word is a dimension, and the finest thing they count is the grain.',
		phases: [
			[1, 'Three questions', { role: 'src', key: 'List the questions the business asks before you draw any table.', changes: [['+', '3 questions']] }],
			[2, 'The numbers asked for: the fact table', { role: 'out', key: 'The things the questions add up or count are the facts: they go in one fact table.', changes: [['+', 'fact table'], ['+', 'facts m and e']] }],
			[3, 'Each "by" word is a dimension', { role: 'grp', key: 'Each word after "by" is a way to slice the facts: it becomes a dimension table.', changes: [['+', 'dimensions X, Y and Z'], ['+', 'one key to each']] }],
			[7, 'The finest thing counted sets the grain', { role: 'out', key: 'The finest thing any question counts, here e, is the grain: one fact row for each.', changes: [['+', 'grain: one row for each e']] }],
		],
		counters: [
			{ label: 'questions', role: 'src', values: [[1, 3]] },
			{ label: 'facts', role: 'out', values: [[2, 2]] },
			{ label: 'dims', role: 'grp', values: [[3, 1], [4, 2], [5, 3]] },
			{ label: 'grain', role: 'out', values: [[7, '1 e']] },
		],
	});
	a.text(10, 14, 'The questions name the pieces', 'f11 b');
	QUESTIONS.forEach(([y, label]) => a.chip(10, y, label, { role: 'src', level: 2, w: 200, h: 22 }));
	// the fact table (phases 2 and 3), and the badge that names the grain (phase 7)
	a.box(120, 176, 120, 52, { role: 'out', title: 'fact table', fx: { in: 2 } });
	a.chip(130, 196, 'm  e', { role: 'out', level: 3, w: 100, h: 24, fx: { in: 2 } });
	a.badge(220, 136, 'grain: 1 row per e', 'out', { in: 7 }, 'e');
	// the dimensions slide in one per phase: X on the left, Y on the right, Z below
	[
		['dim X', 10, 176, 'M90 202H120', 3, 20, 0],
		['dim Y', 270, 176, 'M240 202H270', 4, -20, 0],
		['dim Z', 130, 238, 'M180 228V238', 5, 0, -10],
	].forEach(([title, x, y, link, at, dx, dy]) => {
		const w = title === 'dim Z' ? 100 : 80;
		const h = title === 'dim Z' ? 20 : 52;
		a.move({ dx: -dx, dy: -dy, at, fx: { in: at } }, () => a.box(x + dx, y + dy, w, h, { role: 'grp', title }));
		a.path(link, 's-grp', { in: at + 1, draw: true });
	});
	return a;
}

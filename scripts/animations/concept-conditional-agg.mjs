// Concept animation (SPEC D41, no real data) for conditional aggregation. Metaphor: one pass over the rows fills several counters.
// 8 s loop of 8 phases: 1 five rows with keys A, B, A, C, A and three counters at 0; 2 to 6 one row per phase sends a dot to the counter
// whose condition it meets (the counter then ticks up); 7 and 8 hold: A 3, B 1, C 1, all from a single pass.
// Facts (DuckDB 2.0.0, concept2/facts.out): over keys A, B, A, C, A, `SUM(CASE WHEN k = 'A' THEN 1 ELSE 0 END)` is 3 and
// `COUNT(*) FILTER (WHERE k = 'B')` is 1, in one SELECT over the table.
import { anim, tint } from '../lib/step-animation.mjs';

const KEYS = ['A', 'B', 'A', 'C', 'A'];
const CX = { A: 80, B: 180, C: 280 }; // counter centers
const RX = (i) => 10 + 70 * i; // row chip x (centers are multiples of 10)
const SEEN = { A: [3, 5, 7], B: [4], C: [6] }; // phase at which each tally appears

export default function make({ id = 'ca2' } = {}) {
	const a = anim({
		id,
		h: 190,
		loop: { cycle: 8 },
		title: 'One pass over the rows fills several counters at once',
		desc:
			'Five rows with keys A, B, A, C and A sit in a line. Below them are three counters: key equals A, key equals B and key equals C, all starting at 0. One row after another sends a dot down to the counter whose condition it meets, and that counter ticks up. At the end counter A holds 3, counter B holds 1 and counter C holds 1, all filled in a single pass.',
		caption: 'Conditional aggregation reads the rows once and keeps several counters. Each row ticks only the counter whose condition it meets.',
		phases: [[1, 'Five rows, three counters at 0'], [2, 'Rows 1 and 2 tick counters A and B'], [4, 'Rows 3 and 4 tick A and C'], [6, 'Row 5 ticks A'], [7, 'One pass filled all three counters']],
	});
	a.text(10, 14, 'One pass, several counters', 'f11 b');
	KEYS.forEach((k, i) => {
		a.chip(RX(i), 46, `Row ${i + 1} · ${k}`, { role: 'src', level: 2, w: 60 });
		a.rect(RX(i) - 3, 43, 66, 30, 's-out', { in: 2 + i, hide: 3 + i, pulse: true }, 8);
		a.move({ dy: 80, dx: CX[k] - (RX(i) + 30), at: 2 + i, fx: { in: 2 + i, hide: 3 + i } }, () => a.circle(RX(i) + 30, 70, 6, tint('out', 4)));
	});
	Object.entries(CX).forEach(([k, cx]) => {
		a.rect(cx - 40, 118, 80, 62, 'bx', undefined, 8);
		a.text(cx, 134, `key = ${k}`, 'f10 b mo', undefined, 'm');
		const seen = SEEN[k];
		a.chip(cx - 18, 146, '0', { role: 'out', level: 1, w: 36, h: 24, fx: { hide: seen[0] } });
		seen.forEach((p, j) => a.chip(cx - 18, 146, String(j + 1), { role: 'out', level: 3, w: 36, h: 24, fx: { in: p, ...(seen[j + 1] ? { hide: seen[j + 1] } : {}) } }));
	});
	return a;
}

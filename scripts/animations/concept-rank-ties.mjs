// Concept animation (SPEC D41, no real data) for ROW_NUMBER, RANK and DENSE_RANK on tied values. Metaphor: the same podium, three
// ways to number it. Rows sorted by score 9, 8, 8, 7 (the middle two tie). 8 s loop of 8 phases: 1 the rows; 2 to 3 ROW_NUMBER numbers
// 1, 2, 3, 4 (two rows at a time); 4 to 5 RANK gives 1, 2, 2, 4 (skips 3); 6 to 7 DENSE_RANK gives 1, 2, 2, 3 (no gap); 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out), scores 90, 80, 80, 70 with ORDER BY score DESC: row_number 1,2,3,4; rank 1,2,2,4;
// dense_rank 1,2,2,3. ROW_NUMBER gives tied rows an arbitrary order unless the ORDER BY has a tie-breaker (here: the name).
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const SCORE = [9, 8, 8, 7];
const COLS = [
	['ROW_NUMBER', 140, [1, 2, 3, 4], 'never repeats', 2],
	['RANK', 235, [1, 2, 2, 4], 'skips 3 after the tie', 4],
	['DENSE_RANK', 310, [1, 2, 2, 3], 'no gap', 6],
]; // name, center x, numbers, note, phase it starts
const Y = (i) => 58 + 30 * i;

export default function make({ id = 'rt' } = {}) {
	const a = anim({
		id,
		h: 206,
		loop: { cycle: 8 },
		title: 'Three ways to number rows that tie',
		desc:
			'Four rows sorted by score from high to low: 9, 8, 8 and 7; the two rows with 8 tie. ROW_NUMBER numbers them 1, 2, 3, 4 and never repeats. RANK gives 1, 2, 2, 4: the tied rows share 2 and the next number skips 3. DENSE_RANK gives 1, 2, 2, 3: the tied rows share 2 and no number is skipped.',
		caption: 'ROW_NUMBER never repeats a number. RANK gives tied rows the same number and then skips ahead. DENSE_RANK gives tied rows the same number and skips nothing.',
		phases: [
			[1, 'Rows sorted by score; two tie', { role: 'src', key: 'Two rows have the same score. They are tied: sorting cannot tell them apart.', changes: [['+', '4 rows sorted by score'], ['+', '2 tied rows']] }],
			[2, 'ROW_NUMBER: 1, 2, 3, 4, no repeats', { role: 'win', key: 'ROW_NUMBER gives every row its own number, so tied rows get different numbers.', changes: [['+', 'numbers 1 to 4, none repeated']] }],
			[4, 'RANK: 1, 2, 2, 4, skips 3', { role: 'win', key: 'RANK gives tied rows the same number, then skips ahead by the size of the tie.', changes: [['+', '2 and 2 for the tied rows'], ['~', 'number 3 skipped']] }],
			[6, 'DENSE_RANK: 1, 2, 2, 3, no gap', { role: 'win', key: 'DENSE_RANK gives tied rows the same number and never skips one.', changes: [['+', '2 and 2 for the tied rows'], ['~', 'no gap: 1, 2, 2, 3']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 4]] },
			{ label: 'tied', role: 'src', values: [[1, 2]] },
			{ label: 'distinct numbers', role: 'win', values: [[3, 4], [5, 3], [7, 3]] },
			{ label: 'last number', role: 'win', values: [[3, 4], [5, 4], [7, 3]] },
		],
	});
	a.text(10, 14, 'Same rows, three numberings', 'f11 b');
	SCORE.forEach((s, i) => a.chip(10, Y(i), `Row ${i + 1} · ${s}`, { role: 'src', level: 2, w: 82 }));
	a.rect(6, Y(1) - 4, 90, 62, 's-win dsh', undefined, 8);
	COLS.forEach(([name, cx, nums, note, p]) => {
		a.text(cx, 50, name, 'f10 b mo', { in: p }, 'm');
		nums.forEach((n, i) => {
			const odd = n !== i + 1 && (name === 'RANK' ? i === 3 : name === 'DENSE_RANK' && i === 3);
			a.chip(cx - 20, Y(i), String(n), { role: 'win', level: odd ? 4 : 2, w: 40, fx: { in: p + (i > 1 ? 1 : 0) } });
		});
		a.text(cx, Y(3) + 42, note, 'f10', { in: p + 1 }, 'm');
	});
	return a;
}

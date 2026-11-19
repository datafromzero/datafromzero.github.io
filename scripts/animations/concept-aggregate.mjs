// Concept animation (SPEC D41, no real data) for aggregate functions. Metaphor: many rows go in, one number comes out.
// 8 s loop of 8 phases: 1 four rows with a value each; 2 to 5 one row per phase slides into the box (and is gone), COUNT ticks up
// by one and SUM adds that row's value; 6 to 8 hold: COUNT is 4, SUM is the total of x1 to x4, and a ring marks the two answers.
// Facts (DuckDB 2.0.0, concept2/facts.out): over 10, NULL, 30 COUNT(*) is 3 and SUM is 40; an aggregate over many rows returns one row.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const Y = (i) => 70 + 30 * i;
const SUM = ['Σ = x1', 'Σ = x1+x2', 'Σ = x1+x2+x3', 'Σ = x1+x2+x3+x4'];

export default function make({ id = 'ag' } = {}) {
	const a = anim({
		id,
		h: 200,
		loop: { cycle: 8 },
		title: 'An aggregate turns many rows into one number',
		desc:
			'Four rows, Row 1 to Row 4, each hold a value x1 to x4. One after another they slide into a box and are gone. Two counters grow with each row: COUNT goes 1, 2, 3, 4, and SUM goes x1, then x1 plus x2, then x1 plus x2 plus x3, then x1 plus x2 plus x3 plus x4. In the end the four rows have become two numbers.',
		caption: 'An aggregate such as COUNT or SUM reads many rows and gives back one number. The rows themselves are not in the answer.',
		phases: [
			[1, 'Four rows, each with a value', { role: 'src', key: 'A table has many rows; an aggregate will read all of them.', changes: [['+', '4 rows, each with a value']] }],
			[2, 'Rows go in one at a time', { role: 'out', key: 'COUNT adds 1 for every row it reads, and SUM adds that row’s value.', changes: [['−', 'rows go into the box one by one'], ['~', 'COUNT and SUM grow with each row']] }],
			[6, 'One number each: COUNT and SUM', { role: 'out', key: 'Without GROUP BY, all the rows become one row: here it holds a COUNT and a SUM.', changes: [['−', '4 rows folded into 1 row'], ['+', '2 numbers: COUNT and SUM']] }],
		],
		counters: [
			{ label: 'rows', role: 'src', values: [[1, 4]] },
			{ label: 'COUNT', role: 'out', values: [[2, 1], [3, 2], [4, 3], [5, 4]] },
			{ label: 'result rows', role: 'out', values: [[6, 1]] },
		],
	});
	a.text(10, 14, 'Many rows go in, one number comes out', 'f11 b');
	a.box(110, 44, 120, 148, { role: 'out', title: 'aggregate' });
	a.text(252, 66, 'COUNT(*)', 'f10 b mo');
	a.text(252, 120, 'SUM(x)', 'f10 b mo');
	[0, 1, 2, 3].forEach((i) => {
		a.ghost(10, Y(i), 70, 24);
		a.move({ dx: 100, at: 2 + i, fx: { hide: 3 + i } }, () => a.chip(10, Y(i), `Row ${i + 1} · x${i + 1}`, { role: 'src', level: 2, w: 70 }));
		const last = i === 3;
		a.chip(252, 72, String(i + 1), { role: 'out', level: 3, w: 98, fx: { in: 3 + i - 1, ...(last ? {} : { hide: 3 + i }) } });
		a.chip(252, 126, SUM[i], { role: 'out', level: 3, w: 98, fx: { in: 3 + i - 1, ...(last ? {} : { hide: 3 + i }) } });
	});
	a.rect(248, 68, 106, 32, 's-out', { in: 6, hide: 7, pulse: true }, 8);
	a.rect(248, 122, 106, 32, 's-out', { in: 6, hide: 7, pulse: true }, 8);
	return a;
}

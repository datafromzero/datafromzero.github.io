// Concept animation (SPEC D41, no real data) for cohort tables. Metaphor: users grouped by the month they started; each row is read
// across, and later months fill in as a triangle. Rows Start 1, 2, 3 (cohorts); columns month 0, 1, 2 (months since the start).
// 8 s loop of 8 phases: 1 the empty grid (dashed); 2 month 0 fills for every cohort; 3 month 1 slides out of month 0 for cohorts 1 and 2;
// 4 month 2 slides out for cohort 1; 5 the dashed corner is marked "not yet"; 6 to 8 hold, a triangle. Darker means more users.
// Facts: not SQL output; cohort 3 started last, so it has had no month 1 or 2 yet, and cohort 2 has had no month 2. That is why the
// table is a triangle, not a rectangle.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const X = (j) => 90 + 80 * j;
const Y = (i) => 68 + 34 * i;

export default function make({ id = 'co' } = {}) {
	const a = anim({
		id,
		h: 196,
		loop: { cycle: 8 },
		title: 'A cohort table: groups by start month, a triangle of later months',
		desc:
			'A grid with three rows, the cohorts Start 1, Start 2 and Start 3, and three columns, month 0, month 1 and month 2. Month 0 fills for every cohort. Month 1 fills for Start 1 and Start 2, and month 2 fills only for Start 1, each new cell sliding out of the cell before it. The three cells in the lower right corner stay empty and are marked not yet, so the filled cells form a triangle. Darker cells mean more users.',
		caption: 'Each row is a cohort: the users who started in the same month. Reading across shows how that group changes month after month. Later cohorts have fewer months so far, which makes the triangle.',
		phases: [
			[1, 'Cohorts by start month', { role: 'grp', key: 'A cohort is a group of users who started in the same month.', changes: [['+', '3 cohorts: Start 1, 2, 3']] }],
			[2, 'Month 0: everyone in the cohort', { role: 'out', key: 'Month 0 is the start: every cohort has its users counted.', changes: [['+', 'month 0 for all 3 cohorts']] }],
			[3, 'Month 1: who is still here', { role: 'out', key: 'Month 1 shows who is still here a month later, so only cohorts a month old have it.', changes: [['+', 'month 1 for Start 1 and Start 2']] }],
			[4, 'Month 2, for the oldest cohort', { role: 'out', key: 'The oldest cohort has the most history, so it has the most months.', changes: [['+', 'month 2 for Start 1 only']] }],
			[5, 'The empty corner has not happened yet', { role: 'flt', key: 'Cells that have not happened yet stay empty, so the table is a triangle, not a rectangle.', changes: [['+', '3 empty cells: not yet']] }],
		],
		counters: [
			{ label: 'cohorts', role: 'grp', values: [[1, 3]] },
			{ label: 'cells filled', role: 'out', values: [[2, 3], [3, 5], [4, 6]] },
			{ label: 'not yet', role: 'flt', values: [[5, 3]] },
		],
	});
	a.text(10, 14, 'Groups by start month', 'f11 b');
	[0, 1, 2].forEach((j) => a.text(X(j) + 36, 58, `month ${j}`, 'f10 b mo', undefined, 'm'));
	[0, 1, 2].forEach((i) => {
		a.chip(10, Y(i), `Start ${i + 1}`, { role: 'grp', level: 2 + i, w: 70, h: 28 });
		[0, 1, 2].forEach((j) => {
			a.rect(X(j), Y(i), 72, 28, 'bx dsh', undefined, 6);
			if (i + j > 2) a.text(X(j) + 36, Y(i) + 18, 'not yet', 'f10 mu', { in: 5 }, 'm');
		});
	});
	[0, 1, 2].forEach((i) => a.rect(X(0), Y(i), 72, 28, tint('out', 4), { in: 2 }, 6));
	[0, 1].forEach((i) => a.move({ dx: 80, at: 3, fx: { in: 3 } }, () => a.rect(X(0), Y(i), 72, 28, tint('out', 3), undefined, 6)));
	a.move({ dx: 160, at: 4, fx: { in: 4 } }, () => a.rect(X(0), Y(0), 72, 28, tint('out', 2), undefined, 6));
	return a;
}

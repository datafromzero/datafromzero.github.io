// Concept animation (SPEC D41, no real data) for DATE_TRUNC. Metaphor: a timestamp snaps down to the start of its month.
// Three lanes, each a calendar line with ticks at the start of March, April and May; each lane has one timestamp (a dot).
// 8 s loop of 8 phases: 1 three timestamps; 2, 3 and 4 the dots slide left, one lane per phase, to the first of their month; the
// result label appears the phase after; 6 t1 and t2 ended on the same value. The dot never moves right: the cut is always down.
// Facts (DuckDB 2.0.0, concept2/facts.out and facts2.out): date_trunc('month', timestamp '2024-03-17 14:05:00') = 2024-03-01 00:00:00; the last
// day of a month (Mar 29 23:59) also goes to the first of its own month, never to the next one.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const LANES = [
	['t1', 'Mar 17 14:05', 170, 100, 'Mar 1 00:00'],
	['t2', 'Mar 29 23:59', 210, 100, 'Mar 1 00:00'],
	['t3', 'Apr 20 09:30', 300, 230, 'Apr 1 00:00'],
]; // label, timestamp, dot x, tick x it snaps to, result
const Y = (i) => 80 + 50 * i;

export default function make({ id = 'dt' } = {}) {
	const a = anim({
		id,
		h: 210,
		loop: { cycle: 8 },
		title: 'DATE_TRUNC snaps a timestamp down to the start of its month',
		desc:
			'Three calendar lines with ticks at the first of March, April and May. Timestamp t1, March 17 at 14:05, t2, March 29 at 23:59, and t3, April 20 at 09:30, are dots on their lines. One after another each dot slides left to the tick at the start of its own month and gets a new label: March 1 at 00:00 for t1 and t2, April 1 at 00:00 for t3. t1 and t2 end on the same value.',
		caption: 'DATE_TRUNC(\'month\', t) moves every timestamp back to the first moment of its month. Timestamps of the same month end up equal, so they can be grouped.',
		phases: [
			[1, 'Three timestamps on the calendar', { role: 'src', key: 'A timestamp has a day and a time of day. To group by month, that detail gets in the way.', changes: [['+', '3 timestamps']] }],
			[2, 't1 snaps down to Mar 1', { role: 'out', key: 'DATE_TRUNC with month cuts a timestamp back to the first moment of its month.', changes: [['~', 't1: Mar 17 to Mar 1']] }],
			[3, 't2 snaps down too', { role: 'out', key: 'The last day of a month also goes back to its own month, never forward to the next.', changes: [['~', 't2: Mar 29 to Mar 1']] }],
			[4, 't3 snaps down to Apr 1', { role: 'out', key: 'Each timestamp snaps to the start of its own month, so April stays in April.', changes: [['~', 't3: Apr 20 to Apr 1']] }],
			[6, 't1 and t2 are now equal', { role: 'mat', key: 'Timestamps from the same month now match, so GROUP BY can put them together.', changes: [['−', '3 distinct values become 2']] }],
		],
		counters: [
			{ label: 'timestamps', role: 'src', values: [[1, 3]] },
			{ label: 'snapped', role: 'out', values: [[2, 1], [3, 2], [4, 3]] },
			{ label: 'distinct values', role: 'mat', values: [[1, 3], [6, 2]] },
		],
	});
	a.text(10, 14, 'Snap down to the start of the month', 'f11 b');
	[['Mar 1', 100, 'm'], ['Apr 1', 230, 'm'], ['May 1', 350, 'e']].forEach(([t, x, al]) => a.text(x, 54, t, 'f10 b', undefined, al));
	let d = '';
	LANES.forEach((_, i) => {
		const y = Y(i);
		d += `M100 ${y}h250M100 ${y - 5}v10M230 ${y - 5}v10M350 ${y - 5}v10`;
	});
	a.path(d);
	LANES.forEach(([t, ts, x, tick, res], i) => {
		const y = Y(i);
		a.text(10, y - 4, t, 'f10 b');
		a.text(10, y + 10, ts, 'f10 mo');
		a.circle(x, y, 7, 'bx dsh');
		a.move({ dx: tick - x, at: 2 + i }, () => a.circle(x, y, 7, tint('out', 3)));
		a.text(tick + 10, y - 10, res, 'f10 mo b', { in: 3 + i });
	});
	return a;
}

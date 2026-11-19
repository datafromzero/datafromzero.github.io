// Concept animation (SPEC D41, no real data) for transactions. Two stacked panels with the same start, 8 s loop of 8 phases:
// 1 a table with one row; 2 BEGIN: change 1 waits (dashed: not final); 3 change 2 waits; 4 the stamp COMMIT (top) or ROLLBACK (bottom);
// 5 top: both changes slide into the table together; bottom: both are undone together; 6 top: they are solid rows; 7 and 8 hold.
// Facts (DuckDB 2.0.0, concept2/facts.out): on a table with row 1, BEGIN; INSERT 2; INSERT 3; ROLLBACK; leaves only row 1, and the same
// with COMMIT leaves rows 1, 2, 3. Outside an explicit transaction ROLLBACK is an error in DuckDB ("cannot rollback - no transaction is
// active"), so ROLLBACK only makes sense after BEGIN.
import { anim } from '../lib/step-animation.mjs';

const H = 160; // top of the second panel

export default function make({ id = 'tx' } = {}) {
	const a = anim({
		id,
		h: 306,
		loop: { cycle: 8 },
		title: 'A transaction lands all its changes together, or none',
		desc:
			'Two panels, each with a table that holds one row. After BEGIN, two changes wait outside the table as dashed boxes, because they are not final yet. In the top panel the stamp COMMIT slides both changes into the table together, and they become solid rows. In the bottom panel the stamp ROLLBACK undoes both together and the table still holds only its first row.',
		caption: 'Between BEGIN and COMMIT, several changes wait together and then land together. ROLLBACK undoes all of them. ROLLBACK only means something after BEGIN.',
		phases: ['A table with one row', 'BEGIN: change 1 waits, not final', 'Change 2 waits too', 'COMMIT on top, ROLLBACK below', 'Top: all land together. Bottom: all undone together', 'Top: the changes are now rows', 'Nothing in between: all or nothing', 'All or nothing'],
	});
	[
		[0, 'BEGIN … COMMIT: all land together', [[1, '1 · a table'], [2, '2 · BEGIN: changes wait'], [4, '3 · COMMIT'], [5, '4 · all land together']], 'COMMIT'],
		[H, 'BEGIN … ROLLBACK: all undone together', [[1, '1 · a table'], [2, '2 · BEGIN: changes wait'], [4, '3 · ROLLBACK'], [5, '4 · all undone together']], 'ROLLBACK'],
	].forEach(([y0, title, tags, stamp], panel) => {
		a.text(10, y0 + 14, title, 'f11 b');
		a.tags(10, y0 + 29, tags);
		a.text(10, y0 + 60, 'BEGIN', 'f10 b mo', { in: 2 });
		a.box(170, y0 + 44, 180, 98, { role: 'out', title: 'table' });
		a.chip(180, y0 + 62, 'Row 1', { role: 'src', level: 2, w: 100, h: 22 });
		[88, 114].forEach((dy) => a.ghost(180, y0 + dy, 100, 22));
		a.chip(96, y0 + 48, stamp, { role: 'ord', level: 3, w: 68, h: 22, fx: { in: 4 } });
		[0, 1].forEach((i) => {
			const y = y0 + 88 + 26 * i;
			const pending = () => {
				a.rect(10, y, 80, 22, 'bx dsh', undefined, 6);
				a.text(50, y + 15, `change ${i + 1}`, 'f11', undefined, 'm');
			};
			if (!panel) {
				a.move({ dx: 170, at: 5, fx: { in: 2 + i, hide: 6 } }, pending);
				a.chip(180, y, `Row ${i + 2}`, { role: 'src', level: 3, w: 100, h: 22, fx: { in: 6 } });
			} else a.g({ in: 2 + i, hide: 5 }, pending);
		});
		if (panel) a.text(10, y0 + 108, 'undone', 'f10 b f-flt', { in: 5 });
	});
	return a;
}

// Concept animation (SPEC D41, no real data) for indexes. Two stacked panels, 8 s loop of 8 phases. The same six rows, and the engine
// is looking for the rows with key K (r2 and r5). Top, a full scan: 1 to 6 a frame moves over the rows one by one, and each row it has read
// turns darker; 7 all six were read. Bottom, an index: 1 the index knows K is in r2 and r5; 2 arrows jump straight to those two rows;
// 3 only they are read, while the scan above is still crawling. 8 hold.
// Facts: an index lets the engine find matching rows without reading every row, but the engine decides whether using it pays off
// (DuckDB's docs give a selectivity guideline, not a rule, and the lesson run showed the engine using an index on a 355-row filter; see
// MISTAKES), so the picture says "can jump", not "always jumps".
import { anim } from '../lib/step-animation.mjs';

const LABEL = ['r1', 'r2 K', 'r3', 'r4', 'r5 K', 'r6'];
const CX = (i) => 10 + 50 * i;
const P2 = 120; // top of the second panel

export default function make({ id = 'ix' } = {}) {
	const a = anim({
		id,
		h: 272,
		loop: { cycle: 8 },
		title: 'A full scan reads every row; an index can jump to the matching rows',
		desc:
			'Six rows r1 to r6; r2 and r5 hold the key K. Top: a full scan moves a frame over the rows one at a time, and each row it has read turns darker, until all six are read. Bottom: an index says K is in r2 and r5, arrows jump straight to those two rows, and only they are read, before the scan above has finished.',
		caption: 'A full scan reads every row to find the matches. An index is a lookup list that can jump straight to them. The engine decides when using an index is worth it.',
		phases: [[1, 'Scan starts at row 1; index knows K'], [2, 'Index jumps to r2 and r5; scan reads on'], [3, 'Index done: 2 rows read; scan reads on'], [7, 'Scan done: 6 rows read']],
	});
	a.text(10, 14, 'Full scan: read every row', 'f11 b');
	LABEL.forEach((t, i) => {
		a.chip(CX(i), 56, t, { role: 'src', level: 2, w: 44, flags: [{ role: 'src', level: 4, fx: i > 1 ? { in: i + 2 } : i ? { in: 3 } : undefined }] });
	});
	a.move({ dx: 50, at: 2 }, () => a.move({ dx: 50, at: 3 }, () => a.move({ dx: 50, at: 4 }, () => a.move({ dx: 50, at: 5 }, () => a.move({ dx: 50, at: 6 }, () => a.rect(7, 52, 50, 32, 's-flt', undefined, 7))))));
	a.text(10, 104, 'read 6 rows', 'f11 b', { in: 7 });

	a.text(10, P2 + 14, 'Index: jump to the matching rows', 'f11 b');
	a.chip(10, P2 + 46, 'index: K → r2, r5', { role: 'mat', level: 3, w: 130, h: 24 });
	LABEL.forEach((t, i) => a.chip(CX(i), P2 + 96, t, { role: 'src', level: 2, w: 44, flags: t.length > 2 ? [{ role: 'out', level: 4, fx: { in: 3 } }] : [] }));
	a.arrow(82, P2 + 72, 82, P2 + 94, 's-mat', { in: 2, draw: true });
	a.arrow(130, P2 + 72, 232, P2 + 94, 's-mat', { in: 2, draw: true });
	a.text(10, P2 + 150, 'read 2 rows', 'f11 b', { in: 3 });
	return a;
}

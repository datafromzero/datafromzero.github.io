// Concept animation (SPEC D41, no real data): the three kinds of CTE, built up one after another in a 7 s loop of 8 phases:
// 1 standalone (a CTE used inside MAIN), 2 and 3 chained (CTE 1 inside CTE 2, CTE 2 inside MAIN), 4 to 7 recursive (a CTE that
// refers to itself, round 1, round 2, until a round is empty, then used in MAIN), 8 hold.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'ck' } = {}) {
	const a = anim({
		id,
		h: 248,
		loop: { cycle: 7 },
		title: 'Three kinds of CTE: standalone, chained and recursive',
		desc:
			'Three rows. Standalone: a box CTE sends its result by an arrow into a box MAIN, which uses it. Chained: CTE 1 feeds CTE 2, which uses it, and CTE 2 feeds MAIN, which uses it. Recursive: a CTE box with an arrow looping back to itself, labeled round 1, round 2 and until empty, then an arrow feeds MAIN, which uses the CTE.',
		caption: 'Standalone: MAIN uses a CTE. Chained: CTE 2 uses CTE 1, and MAIN uses CTE 2. Recursive: a CTE refers to itself, round after round, until a round adds no rows.',
	});
	const cte = (x, y, name, fx, chip) =>
		a.box(x, y, 100, 44, { role: 'src', title: name, fx }, chip ? () => a.badge(x + 10, y + 22, chip, 'src') : undefined);
	const main = (x, y, w, chip, fx, chipFx) => a.box(x, y, w, 44, { role: 'out', title: 'MAIN', fx }, () => a.badge(x + 10, y + 22, chip, 'src', chipFx));

	// standalone
	a.text(10, 14, 'Standalone', 'f11 b');
	cte(10, 20, 'CTE');
	a.arrow(114, 42, 186, 42, 's-src', { in: 1, draw: true });
	main(190, 20, 160, 'CTE', undefined, { in: 2 });

	// chained
	a.text(10, 86, 'Chained', 'f11 b', { in: 2 });
	cte(10, 94, 'CTE 1', { in: 2 });
	a.arrow(112, 116, 128, 116, 's-src', { in: 2, draw: true });
	cte(130, 94, 'CTE 2', { in: 2 }, 'CTE 1');
	a.arrow(232, 116, 248, 116, 's-src', { in: 3, draw: true });
	main(250, 94, 100, 'CTE 2', { in: 3 });

	// recursive
	a.text(10, 160, 'Recursive', 'f11 b', { in: 4 });
	cte(10, 196, 'CTE', { in: 4 });
	a.path('M90 196C90 170 30 170 30 196M25 188L30 196L36 188', 's-win', { in: 5, draw: true });
	a.text(100, 190, 'round 1', 'f10 b', { in: 5, hide: 6 });
	a.text(100, 190, 'round 2', 'f10 b', { in: 6, hide: 7 });
	a.text(100, 190, 'until empty', 'f10 b', { in: 7 });
	a.arrow(114, 218, 186, 218, 's-src', { in: 7, draw: true });
	main(190, 196, 160, 'CTE', { in: 7 });
	return a;
}

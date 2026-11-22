// Concept animation (SPEC D41, no real data) for code, settings and secrets (core lesson C28). Metaphor: three places for three kinds of thing; the first
// two live in Git, the secret stays outside it, and the program reads all three. Abstract only: boxes named code, settings file and secret, a dashed
// frame labeled in Git and a box named program. Nothing shows what happens when a secret is committed or missing, so it never gives away the Predicts of
// units 3 and 4.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the box code; 3 to 4 the box settings file; 5 to 6 the box secret, a dashed frame around code
// and settings labeled in Git, and the words not in Git beside the secret; 7 to 8 arrows from the three boxes into the box program.
// Facts: only the rule of 12factor.net/config (config strictly separate from code; the codebase could be open sourced without credentials), which the
// lesson cites, and the files of the cafe-report repository.
// Counters (D41): places 1, 2, 3; in Git 2; program reads 3; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'cl' } = {}) {
	const a = anim({
		id,
		h: 252,
		loop: { cycle: 8 },
		title: 'Code and settings live in Git; a secret stays outside it; the program reads all three',
		desc:
			'Three boxes stacked on the left: code, settings file and secret. A dashed frame labeled in Git surrounds code and settings file; the secret sits outside it, labeled not in Git. Three arrows lead from the boxes into a box on the right named program.',
		caption: 'Code and a settings file go into Git. A secret stays out of it and reaches the program from the environment.',
		phases: [
			[1, 'Code: the same for every run', { role: 'src', key: 'Code is written once and does not change from one run to the next.', changes: [['+', 'code']] }],
			[3, 'Settings: change between runs', { role: 'grp', key: 'Settings are the values that differ between runs or machines, kept in a file.', changes: [['+', 'a settings file']] }],
			[5, 'A secret stays out of Git', { role: 'flt', key: 'A secret is a value that must not be seen by everyone who can read the repository.', changes: [['+', 'a secret'], ['+', 'a frame: in Git']] }],
			[7, 'The program reads all three', { role: 'out', key: 'At run time the program takes its code from the repository and its settings and secret from outside it.', changes: [['+', 'program'], ['+', '3 arrows']] }],
		],
		counters: [
			{ label: 'places', role: 'src', values: [[1, 1], [3, 2], [5, 3]] },
			{ label: 'in Git', role: 'grp', values: [[5, 2]] },
			{ label: 'reads', role: 'out', values: [[7, 3]] },
		],
	});
	a.text(10, 14, 'Three places for three kinds of thing', 'f11 b');
	a.rect(4, 42, 172, 114, 'bx dsh', { in: 5 }, 6);
	a.text(170, 56, 'in Git', 'f10 b mu', { in: 5 }, 'e');
	a.box(12, 64, 130, 40, { role: 'src', title: 'code' });
	a.box(12, 110, 130, 40, { role: 'grp', title: 'settings file', fx: { in: 3 } });
	a.box(12, 180, 130, 40, { role: 'flt', title: 'secret', fx: { in: 5 } });
	a.text(12, 238, 'not in Git', 'f10 b mu', { in: 6 });

	a.box(240, 110, 110, 60, { role: 'out', title: 'program', fx: { in: 7 } });
	a.arrow(142, 84, 238, 124, 's-src', { in: 7, draw: true });
	a.arrow(142, 130, 238, 140, 's-grp', { in: 7, draw: true });
	a.arrow(142, 200, 238, 156, 's-flt', { in: 7, draw: true });
	return a;
}

// Concept animation (SPEC D41, no real data) for cleaning text. Metaphor: a chain of small clean-ups, one function at a time.
// The · stands for a space. 8 s loop of 8 phases: 1 the messy text in its chip; 2 the chip slides down to TRIM and 3 its text is
// "Iced··Tea"; 4 it slides to REPLACE and 5 the double space becomes one; 6 it slides to LOWER and 7 the text is "iced·tea"; 8 hold.
// Each step the chip leaves behind a dimmed copy of the text it had, so the whole chain shows at the end.
// Facts (DuckDB 2.0.0, concept2/facts.out): TRIM('  Iced  Tea ') = 'Iced  Tea' (only the ends), REPLACE(…, '  ', ' ') = 'Iced Tea',
// LOWER(…) = 'iced tea'.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, tint } from '../lib/step-animation.mjs';

const T = ['··Iced··Tea·', 'Iced··Tea', 'Iced·Tea', 'iced·tea'];
const Y = (i) => 58 + 40 * i;
const NOTES = ['raw text · is a space', 'TRIM · cuts spaces at both ends', 'REPLACE · two spaces become one', 'LOWER · small letters only'];

export default function make({ id = 'tc' } = {}) {
	const a = anim({
		id,
		h: 212,
		loop: { cycle: 8 },
		title: 'A chain of small clean-ups turns messy text into clean text',
		desc:
			'A chip holds the messy text with a middle dot for every space: two spaces, Iced, two spaces, Tea, one space. It slides down to TRIM, which cuts the spaces at both ends; down to REPLACE, which turns the double space in the middle into one; and down to LOWER, which makes every letter small. The text ends as iced, one space, tea. Each step leaves a dimmed copy of the text it had.',
		caption: 'Clean text in small steps, one function each: TRIM removes the spaces at the ends, REPLACE fixes the middle, LOWER makes the letters the same case.',
		phases: [
			[1, 'Messy text, · is a space', { role: 'src', key: 'Real text is often messy: extra spaces and mixed capitals make equal values look different.', changes: [['+', 'raw text: 12 characters']] }],
			[2, 'TRIM cuts the spaces at the ends', { role: 'out', key: 'TRIM removes spaces only at the two ends, not in the middle.', changes: [['−', '3 spaces cut from the ends']] }],
			[4, 'REPLACE turns two spaces into one', { role: 'out', key: 'REPLACE swaps one piece of text for another: here two spaces become one.', changes: [['−', '1 space less: 8 characters']] }],
			[6, 'LOWER makes small letters', { role: 'out', key: 'LOWER changes every letter to a small letter, so Iced and iced match.', changes: [['~', 'I and T become i and t']] }],
		],
		counters: [
			{ label: 'spaces', role: 'src', values: [[1, 5], [3, 2], [5, 1]] },
			{ label: 'length', role: 'out', values: [[1, 12], [3, 9], [5, 8], [7, 8]] },
			{ label: 'capitals', role: 'win', values: [[1, 2], [7, 0]] },
		],
	});
	a.text(10, 14, 'A chain of small clean-ups', 'f11 b');
	T.forEach((_, i) => a.rect(10, Y(i), 100, 26, 'bx dsh', undefined, 6));
	NOTES.forEach((n, i) => a.text(126, Y(i) + 17, n, 'f11', i ? { in: 2 * i + 1 } : undefined));
	[0, 1, 2].forEach((i) => a.text(60, Y(i) + 17, T[i], 'f11 mo mu', { in: 2 * i + 3 }, 'm'));
	a.move({ dy: 40, at: 2 }, () =>
		a.move({ dy: 40, at: 4 }, () =>
			a.move({ dy: 40, at: 6 }, () => {
				a.rect(10, Y(0), 100, 26, tint('src', 2), undefined, 6);
				T.forEach((t, i) => a.text(60, Y(0) + 17, t, 'f11 mo', { ...(i ? { in: 2 * i + 1 } : {}), ...(i < 3 ? { hide: 2 * i + 3 } : {}) }, 'm'));
			}),
		),
	);
	return a;
}

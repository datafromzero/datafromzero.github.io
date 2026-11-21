// Concept animation (SPEC D41, no real data) for @dataclass (core lesson C29). Metaphor: you list the fields; the decorator writes the boring
// methods. Abstract only: a class Row with fields a and b, and three chips named init, repr and eq (the double underscores of __init__ are left
// out of the figure: MDX reads __x__ as bold, and the generator does not escape underscores). Nothing shows what a printed or
// compared record looks like, so it never gives away the Predict of unit 4.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 the lines class Row, a: int and b: str; 3 to 4 the line @dataclass above them; 5 to 6 an
// arrow to a box named it writes and the chip init; 7 to 8 the chips repr and eq.
// Facts (docs.python.org/3/library/dataclasses.html, opened 2026-11-21): the decorator adds generated special methods such as __init__() and
// __repr__(); the parameters init, repr and eq default to true, so __init__(), __repr__() and __eq__() are generated.
// Counters (D41): fields 2; decorator 1; methods 1, 3; each appears with its step.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'dc' } = {}) {
	const a = anim({
		id,
		h: 190,
		loop: { cycle: 8 },
		title: 'A dataclass writes the methods you would otherwise type for every record',
		desc:
			'A box named you write holds four lines of code: the decorator @dataclass, class Row, and the fields a: int and b: str. An arrow leads to a box named it writes with three chips: init, repr and eq, the special methods that Python adds.',
		caption: 'You list the fields of a record and add @dataclass; Python writes the init, repr and eq methods for you.',
		phases: [
			[1, 'You list the fields', { role: 'src', key: 'A record is a class with a name and a list of fields, each with a type.', changes: [['+', 'class Row'], ['+', '2 fields']] }],
			[3, 'One line above: @dataclass', { role: 'grp', key: 'The decorator @dataclass above the class asks Python to write the standard methods.', changes: [['+', '@dataclass']] }],
			[5, 'It writes init', { role: 'out', key: 'The init method takes one argument for each field and stores it.', changes: [['+', 'init']] }],
			[7, 'And repr and eq', { role: 'out', key: 'The repr method gives the text shown when you print the record, and eq is what == uses.', changes: [['+', 'repr'], ['+', 'eq']] }],
		],
		counters: [
			{ label: 'fields', role: 'src', values: [[1, 2]] },
			{ label: 'decorator', role: 'grp', values: [[3, 1]] },
			{ label: 'methods', role: 'out', values: [[5, 1], [7, 3]] },
		],
	});
	a.text(10, 14, 'You list fields, Python writes the rest', 'f11 b');
	a.box(10, 44, 150, 126, { role: 'src', title: 'you write' });
	a.text(22, 84, '@dataclass', 'f11 b mo', { in: 3 });
	a.text(22, 108, 'class Row:', 'f11 mo');
	a.text(34, 130, 'a: int', 'f11 mo');
	a.text(34, 152, 'b: str', 'f11 mo');
	a.arrow(160, 100, 196, 100, 's-out', { in: 5, draw: true });
	a.box(198, 44, 152, 126, { role: 'out', title: 'it writes', fx: { in: 5 } });
	a.chip(214, 76, 'init', { role: 'out', level: 3, w: 120, c: 'f11 mo', fx: { in: 5 } });
	a.chip(214, 106, 'repr', { role: 'out', level: 3, w: 120, c: 'f11 mo', fx: { in: 7 } });
	a.chip(214, 136, 'eq', { role: 'out', level: 3, w: 120, c: 'f11 mo', fx: { in: 7 } });
	return a;
}

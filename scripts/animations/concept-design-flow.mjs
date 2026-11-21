// Concept animation (SPEC D41, no real data) for the table design workflow. Metaphor: the same facts pass through three stages, words, boxes
// and lines, then keys and rules, and a test row tries to break them. 8 s loop of 8 phases: 1 two plain sentences ("each A has many B", "each B
// has one A"); 2 and 3 two boxes A and B with a line between them (a bar pair at A: exactly one, a circle and a foot at B: zero or many);
// 4 a key column in each box (PK in A, PK and FK in B) and the FK names the PK; 5 and 6 the rules the database checks (a key is unique and
// never empty; an FK must name an existing A); 7 a test row whose FK names an A that does not exist is refused; 8 holds.
// Facts (DuckDB 2.0.0, as in sql/designing-tables-workflow): a primary key rejects a repeated value, a foreign key rejects a value that the
// parent does not hold ("Violates foreign key constraint because key ... does not exist in the referenced table"). No real numbers: A and B
// are placeholders and the counters count what is drawn.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'df' } = {}) {
	const a = anim({
		id,
		h: 252,
		loop: { cycle: 8 },
		title: 'A design passes from words to boxes to rules to a test',
		desc:
			'Two plain sentences say each A has many B and each B has one A. They become two boxes, A and B, with a line between them: exactly one at A, zero or many at B. Each box gets a key column: a primary key in A, a primary key and a foreign key in B, and the foreign key names the primary key. Two rules appear: a key is unique and never empty, and a foreign key must name an existing A. A test row whose foreign key names an A that does not exist tries the foreign key rule.',
		caption: 'Say the facts in words, draw boxes and lines, give each table its keys, add the rules, then try a row that breaks them.',
		phases: [
			[1, 'Words: what must it say?', { role: 'src', key: 'Start from plain sentences about the business: who has how many of what.', changes: [['+', '2 sentences']] }],
			[2, 'Boxes and a line', { role: 'mat', key: 'Each noun becomes a box, and each sentence a line with a mark at both ends.', changes: [['+', '2 boxes'], ['+', '1 line']] }],
			[4, 'Keys: PK in A, PK and FK in B', { role: 'out', key: 'A primary key names each row. The foreign key in B holds the key of an A row.', changes: [['+', '3 key columns']] }],
			[5, 'Rules the database checks', { role: 'grp', key: 'A rule is written once, in the table, and the database applies it to every row.', changes: [['+', '2 rules']] }],
			[7, 'A test row tries a rule', { role: 'flt', key: 'Try rows that should fail, and read what the database answers.', changes: [['+', '1 test row']] }],
		],
		counters: [
			{ label: 'facts', role: 'src', values: [[1, 2]] },
			{ label: 'boxes', role: 'mat', values: [[2, 2]] },
			{ label: 'keys', role: 'out', values: [[4, 3]] },
			{ label: 'rules', role: 'grp', values: [[5, 2]] },
			{ label: 'tests', role: 'flt', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'Words, boxes, keys, rules, test', 'f11 b');
	// 1: the sentences, replaced by the boxes at phase 2
	a.chip(60, 64, 'each A has many B', { role: 'src', level: 2, w: 240, h: 28, fx: { in: 1, hide: 2 } });
	a.chip(60, 104, 'each B has one A', { role: 'src', level: 2, w: 240, h: 28, fx: { in: 1, hide: 2 } });
	// 2: two boxes and the line between them, bar pair at A, circle and foot at B
	a.box(30, 60, 120, 112, { role: 'mat', title: 'A', fx: { in: 2 } });
	a.box(210, 60, 120, 112, { role: 'mat', title: 'B', fx: { in: 2 } });
	a.path('M150 85H161M155 79V91M160 79V91M161 85H190M197 85H210M200 85L210 79M200 85L210 91', 'ln', { in: 2, draw: true });
	a.circle(193.5, 85, 3.5, 'ln', { in: 2 });
	a.text(156, 74, '1', 'f10 b mo', { in: 2 });
	a.text(206, 74, '0..*', 'f10 b mo', { in: 2 }, 'e');
	// 4: key columns, and the FK names the PK
	a.chip(40, 96, 'PK a', { role: 'out', level: 3, w: 100, h: 22, fx: { in: 4 } });
	a.chip(220, 96, 'PK b', { role: 'out', level: 3, w: 100, h: 22, fx: { in: 4 } });
	a.chip(220, 126, 'FK a', { role: 'src', level: 3, w: 100, h: 22, fx: { in: 4 } });
	a.arrow(218, 137, 142, 107, 's-mat dsh', { in: 4, draw: true });
	// 5 and 6: the rules, under the boxes
	a.chip(30, 184, 'key: unique, not empty', { role: 'grp', level: 2, w: 120, h: 24, c: 'f10', fx: { in: 5 } });
	a.chip(210, 184, 'FK: must exist in A', { role: 'grp', level: 2, w: 120, h: 24, c: 'f10', fx: { in: 5 } });
	// 7: a test row that breaks the foreign key rule
	a.chip(210, 218, 'row: FK = a9', { role: 'flt', level: 3, w: 120, h: 24, c: 'f10', fx: { in: 7 } });
	a.text(200, 234, 'what does it say?', 'f10 b f-flt', { in: 7 }, 'e');
	return a;
}

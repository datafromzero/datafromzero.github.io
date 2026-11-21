// Concept animation (SPEC D41, no real data) for designing a star schema from business questions. Metaphor: the questions name the pieces.
// 8 s loop of 8 phases: 1 three question rows (Q1 total of m by X, Q2 count of e by X and Y, Q3 m of each item by Z); 2 the fact box appears
// with its measures m and e inside it; 3, 4 and 5 the dimension boxes X, Y and Z arrive, one per phase, and 4, 5 and 6 draw the link to each,
// from the PK row of the dimension to a new FK row of the fact table, with crow's foot ends (exactly one at the dimension, zero or many at the
// fact table) and the verb "describes" (LESSON-STANDARD "Entity-relationship diagrams"); 7 a badge names the grain (one row per item, the finest detail any question needs); 8 hold.
// Facts: a design method, not engine output (Kimball Group: the four decisions are the business process, the grain, the dimensions and the
// facts). The lesson's own cafe-sales run is in unit 1; this figure shows no result that a Predict of the lesson asks for.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, edge } from '../lib/step-animation.mjs';

const QUESTIONS = [
	[44, 'Q1 · total of m, by X'],
	[72, 'Q2 · count of e, by X and Y'],
	[100, 'Q3 · m of each item, by Z'],
];
const FX = 135; // fact table x, width, top
const FW = 90;
const FY = 160;

export default function make({ id = 'qs' } = {}) {
	const a = anim({
		id,
		h: 300,
		loop: { cycle: 8 },
		title: 'The questions name the pieces of a star schema',
		desc:
			'Three questions in rows: Q1 total of m by X, Q2 count of e by X and Y and Q3 m of each item by Z. A fact table appears below them and takes the numbers the questions ask for, m and e. Three dimension tables X, Y and Z slide in around it. Each dimension has a primary key row, and the fact table gets a foreign key row for each. A line labeled describes joins each key row to its foreign key row and ends in crow\'s foot symbols: each dimension row describes zero or many fact rows, and each fact row belongs to exactly one dimension row (two bars at the dimension end, a circle and a crow\'s foot at the fact table end). A badge names the grain: one row for each item, the finest detail any question needs.',
		caption: 'Write the questions first. The numbers they ask for are the facts, each "by" word is a dimension, and the finest detail they need is the grain.',
		phases: [
			[1, 'Three questions', { role: 'src', key: 'List the questions the business asks before you draw any table.', changes: [['+', '3 questions']] }],
			[2, 'The numbers asked for: the fact table', { role: 'out', key: 'The things the questions add up or count are the facts: they go in one fact table.', changes: [['+', 'fact table'], ['+', 'facts m and e']] }],
			[3, 'Each "by" word is a dimension', { role: 'grp', key: 'Each word after "by" is a way to slice the facts: it becomes a dimension table.', changes: [['+', 'dimensions X, Y and Z'], ['+', 'one key to each']] }],
			[7, 'The finest detail needed sets the grain', { role: 'out', key: 'The finest detail any question needs, here one item, is the grain: one fact row for each.', changes: [['+', 'grain: one row for each item']] }],
		],
		counters: [
			{ label: 'questions', role: 'src', values: [[1, 3]] },
			{ label: 'facts', role: 'out', values: [[2, 2]] },
			{ label: 'dims', role: 'grp', values: [[3, 1], [4, 2], [5, 3]] },
			{ label: 'grain', role: 'out', values: [[7, '1 item']] },
		],
	});
	a.text(10, 14, 'The questions name the pieces', 'f11 b');
	QUESTIONS.forEach(([y, label]) => a.chip(10, y, label, { role: 'src', level: 2, w: 200, h: 22 }));
	// the fact table (phase 2): a title row, one FK row for each dimension (each appears with its link) and the measures m and e
	a.g({ in: 2 }, () => {
		a.rect(FX, FY, FW, 128, edge('out'), undefined, 6);
		a.text(FX + 8, FY + 15, 'fact table', 'f11 b');
		a.path(`M${FX} ${FY + 22}h${FW}`, 'bx');
		a.chip(FX + 10, FY + 100, 'm  e', { role: 'out', level: 3, w: 70, h: 22 });
	});
	a.badge(220, 136, 'grain: 1 row per item', 'out', { in: 7 }, 'e');
	// the dimensions slide in one per phase: X and Z on the left, Y on the right
	[
		['dim X', 'x', 10, 195, 3, 20],
		['dim Y', 'y', 280, 221, 4, -20],
		['dim Z', 'z', 10, 247, 5, 20],
	].forEach(([title, k, x, cy, at, dx]) => {
		const y = cy - 35; // title row 22, then the 26 px PK row centered on cy
		a.move({ dx, at, fx: { in: at } }, () => {
			a.rect(x - dx, y, 70, 48, edge('grp'), undefined, 6);
			a.text(x - dx + 8, y + 15, title, 'f11 b');
			a.path(`M${x - dx} ${y + 22}h70`, 'bx');
			a.text(x - dx + 8, cy + 4, `PK ${k}`, 'f10 b mo');
		});
		a.text(FX + 8, cy + 4, `FK ${k}`, 'f10 b mo', { in: at + 1 });
		a.link(x < FX ? [[x + 70, cy], [FX, cy]] : [[x, cy], [FX + FW, cy]], '1', '0..*', { verb: 'describes' }, { in: at + 1, draw: true });
	});
	return a;
}

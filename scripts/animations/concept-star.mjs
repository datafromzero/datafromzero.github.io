// Concept animation (SPEC D41, no real data) for the star schema. Metaphor: a fact table in the middle, dimension tables around it,
// each joined by one key. 8 s loop of 8 phases: 1 the fact table alone; 2, 3, 4 and 5 the dimension tables A, B, C and D slide in from
// outside, one per phase; 3, 4, 5 and 6 the link to each one draws the phase after it arrives, from the PK row of the dimension to its FK
// row in the fact table, with crow's foot ends (exactly one at the dimension, zero or many at the fact table) and the verb "describes" read from
// the dimension to the fact table (LESSON-STANDARD "Entity-relationship diagrams"), and the FK row of the fact table appears with it; 7 a ring marks the star; 8 hold.
// Facts: a modeling pattern, not engine output: the fact table holds one row per event with a key to each dimension, and a query joins the
// fact table to the dimensions it needs, one join per dimension.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim, edge } from '../lib/step-animation.mjs';

const FX = 140; // fact table: x, width, top
const FW = 80;
const FY = 40;
const DIMS = [
	// name, final x, row center y (the fact row it links to), move dx
	['dim A', 4, 76, 100],
	['dim B', 276, 104, -100],
	['dim C', 4, 132, 100],
	['dim D', 276, 160, -100],
];

export default function make({ id = 'st' } = {}) {
	const a = anim({
		id,
		h: 216,
		loop: { cycle: 8 },
		title: 'A star schema: one fact table, dimension tables around it',
		desc:
			'A fact table sits in the middle. Four dimension tables, dim A, dim B, dim C and dim D, slide in one after another from the edges. Each dimension has a primary key row, PK, and the fact table has a matching foreign key row, FK, for each: ka, kb, kc and kd. A line labeled describes joins each PK row to its FK row and ends in crow\'s foot symbols: each dimension row describes zero or many fact rows, and each fact row belongs to exactly one dimension row (two bars at the dimension end, a circle and a crow\'s foot at the fact table end). The picture is a star.',
		caption: 'In a star schema the fact table holds the events, with a key to each dimension. A query joins the fact table to the dimension tables it needs, one join per key.',
		phases: [
			[1, 'The fact table: one row per event', { role: 'out', key: 'A fact table has one row per event, such as a sale.', changes: [['+', 'fact table: many rows']] }],
			[2, 'Dimension tables arrive one by one', { role: 'src', key: 'Dimension tables describe the things in the events, such as products or stores.', changes: [['+', '4 dimension tables']] }],
			[6, 'A key links each one to the fact table', { role: 'mat', key: 'The fact table stores one key for each dimension, so a join can link them.', changes: [['+', '4 keys: ka, kb, kc, kd']] }],
			[7, 'A star: one join per key', { role: 'out', key: 'To use a dimension in a query, join the fact table to it on that key: one join per dimension.', changes: [['~', 'a star: 1 fact table, 4 dimensions']] }],
		],
		counters: [
			{ label: 'fact', role: 'out', values: [[1, 1]] },
			{ label: 'dims', role: 'src', values: [[2, 1], [3, 2], [4, 3], [5, 4]] },
			{ label: 'keys', role: 'mat', values: [[3, 1], [4, 2], [5, 3], [6, 4]] },
			{ label: 'joins', role: 'out', values: [[7, 4]] },
		],
	});
	a.text(10, 14, 'A fact table with dimensions around it', 'f11 b');
	// the fact table: a title row, one FK row for each dimension (28 px, each appears with its link) and a note
	a.rect(FX, FY, FW, 156, edge('out'), undefined, 6);
	a.text(FX + 8, FY + 15, 'fact table', 'f11 b');
	a.path(`M${FX} ${FY + 22}h${FW}`, 'bx');
	DIMS.forEach(([, , cy], i) => a.text(FX + 8, cy + 4, `FK k${'abcd'[i]}`, 'f10 b mo', { in: 3 + i }));
	a.text(FX + 8, FY + 190 - 40, 'many rows', 'f10');
	DIMS.forEach(([t, x, cy, dx], i) => {
		const y = cy - 36; // title row 22, then the 28 px PK row centered on cy
		a.move({ dx, at: 2 + i, fx: { in: 2 + i } }, () => {
			a.rect(x - dx, y, 80, 50, edge('src'), undefined, 6);
			a.text(x - dx + 8, y + 15, t, 'f11 b');
			a.path(`M${x - dx} ${y + 22}h80`, 'bx');
			a.text(x - dx + 8, cy + 4, `PK k${'abcd'[i]}`, 'f10 b mo');
		});
		const left = x < FX;
		a.link(left ? [[x + 80, cy], [FX, cy]] : [[x, cy], [FX + FW, cy]], '1', '0..*', { verb: 'describes' }, { in: 3 + i, draw: true });
	});
	a.rect(136, 36, 88, 164, 's-out', { in: 7, hide: 8, pulse: true }, 8);
	return a;
}

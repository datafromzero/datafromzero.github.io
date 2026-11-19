// Concept animation (SPEC D41, no real data). Metaphor: a CTE is a named scratch table you plug into the next step. Three scenes
// are on the page from the start and take turns moving, 8 s loop of 8 phases:
// 1 standalone: the CTE card slides into MAIN; 2 and 3 chained: the CTE 1 card slides into CTE 2, then CTE 2 (with CTE 1 inside)
// slides into MAIN; 4 and 5 recursive: a loop arrow draws and two new rows slide into the CTE that feeds itself; 6 it slides into
// MAIN; 7 and 8 hold. A soft ring pulses where something has just landed.
import { anim, edge, tint } from '../lib/step-animation.mjs';

export default function make({ id = 'ck' } = {}) {
	const a = anim({
		id,
		h: 318,
		loop: { cycle: 8 },
		title: 'Three kinds of CTE: standalone, chained and recursive',
		desc:
			'Three scenes. Standalone: a card named CTE slides into a slot inside the box MAIN. Chained: a card named CTE 1 slides into a slot inside the box CTE 2, and then the box CTE 2, with CTE 1 inside it, slides into a slot inside MAIN. Recursive: a card named CTE with an arrow looping back to itself receives two new rows, one after the other, and then slides into MAIN.',
		caption: 'A CTE is a named scratch table. Standalone: MAIN uses it. Chained: CTE 2 uses CTE 1, and MAIN uses CTE 2. Recursive: a CTE feeds itself new rows until a round adds none.',
		phases: [[1, 'Standalone: name it, plug it in'], [2, 'Chained: tables feed tables'], [4, 'Recursive: a table feeds itself']],
		tag: { x: 350, y: 14, align: 'e' },
	});
	const bars = (x, y) => {
		a.rect(x, y, 54, 6, tint('src', 3), undefined, 3);
		a.rect(x, y + 10, 38, 6, tint('src', 3), undefined, 3);
	};
	const card = (x, y, name) => {
		a.rect(x, y, 70, 44, edge('src'), undefined, 6);
		a.text(x + 8, y + 16, name, 'f11 b');
		bars(x + 8, y + 24);
	};
	const slot = (x, y, w = 70, h = 44) => a.rect(x, y, w, h, 'bx dsh', undefined, 6);
	// the title sits where no card passes: low in a wide box, high in the tall one
	const main = (x, y, w, h, low = true) => {
		a.rect(x, y, w, h, edge('out'), undefined, 8);
		a.text(x + 10, low ? y + h - 6 : y + 16, 'MAIN', 'f11 b');
	};
	const ring = (x, y, w, h, role, at) => a.rect(x - 4, y - 4, w + 8, h + 8, edge(role), { in: at, hide: at + 1, pulse: true }, 10);

	// standalone
	a.text(10, 14, 'Standalone', 'f11 b');
	main(140, 24, 210, 60);
	slot(260, 32);
	a.move({ dx: 250, at: 1 }, () => card(10, 32, 'CTE'));
	ring(260, 32, 70, 44, 'out', 2);

	// chained
	const y2 = 100;
	a.text(10, y2 + 4, 'Chained', 'f11 b');
	main(210, y2 + 14, 140, 100, false);
	slot(240, y2 + 40, 90, 70);
	a.move({ dx: 140, dy: 10, at: 3 }, () => {
		a.rect(100, y2 + 30, 90, 70, edge('src'), undefined, 6);
		a.text(108, y2 + 46, 'CTE 2', 'f11 b');
		slot(110, y2 + 52);
		a.move({ dx: 100, at: 2 }, () => card(10, y2 + 52, 'CTE 1'));
		ring(110, y2 + 52, 70, 44, 'src', 3);
	});
	ring(240, y2 + 40, 90, 70, 'out', 4);

	// recursive: the card feeds itself two new rows, then plugs into MAIN
	const y3 = 232;
	a.text(10, y3 + 4, 'Recursive', 'f11 b');
	main(140, y3 + 14, 210, 70);
	slot(260, y3 + 26, 70, 52);
	a.move({ dx: 250, at: 6 }, () => {
		a.rect(10, y3 + 26, 70, 52, edge('src'), undefined, 6);
		a.text(18, y3 + 42, 'CTE', 'f11 b');
		a.rect(18, y3 + 50, 54, 6, tint('src', 3), undefined, 3);
		a.rect(18, y3 + 60, 54, 6, 'bx dsh', undefined, 3);
		a.rect(18, y3 + 70, 54, 6, 'bx dsh', undefined, 3);
		a.path(`M66 ${y3 + 26}C66 ${y3 + 4} 24 ${y3 + 4} 24 ${y3 + 22}M19 ${y3 + 15}L24 ${y3 + 23}L30 ${y3 + 15}`, 's-win', { in: 4, draw: true });
		a.move({ dx: -90, at: 4, fx: { in: 4 } }, () => a.rect(108, y3 + 60, 54, 6, tint('win', 3), undefined, 3));
		a.move({ dx: -90, dy: 10, at: 5, fx: { in: 5 } }, () => a.rect(108, y3 + 60, 54, 6, tint('win', 3), undefined, 3));
	});
	ring(260, y3 + 26, 70, 52, 'out', 7);
	return a;
}

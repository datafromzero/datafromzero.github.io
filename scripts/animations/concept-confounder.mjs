// Concept animation (SPEC D41, no real data) for study design, lesson C1. Metaphor: a gap between two groups, then a third thing that
// is tied to both the groups and the result and can explain the gap by itself. Generic words only (group, result, a third thing): the
// lesson's Predict about the stores is answered by data in the reveal, not here.
// 8 s loop of 8 phases: 1 two boxes, group (with groups A and B) and result, joined by a dashed arrow; 2 the result differs
// between A and B (hi and lo) and a ring marks the result box; 3 hold; 4 a third box appears; 5 an arrow is drawn from it to the group
// box; 6 an arrow is drawn from it to the result box; 7 and 8 a closing line: it can explain the gap by itself.
// Live counters and Key idea (D41): each counter shows the boxes or arrows drawn at that phase and appears with it.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'cfd' } = {}) {
	const a = anim({
		id,
		h: 232,
		loop: { cycle: 8 },
		title: 'A third thing tied to both a group and a result can explain a gap between the groups',
		desc:
			'Two boxes, group and result, joined by a dashed arrow. The group box holds two groups, A and B. The result box then shows a high result for A and a low result for B: a gap. A third box, a third thing, appears below, with an arrow to the group box and an arrow to the result box: it is tied to both, so it can explain the gap by itself.',
		caption: 'A confounder is a third thing tied to both the groups and the result, so that it can explain a gap between the groups by itself.',
		phases: [
			[1, 'A group and a result', { role: 'src', key: 'A comparison starts with a group and a result.', changes: [['+', '2 boxes, 1 question mark']] }],
			[2, 'The groups differ in the result', { role: 'out', key: 'Group A has a high result and group B a low one: there is a gap.', changes: [['+', 'a gap between A and B']] }],
			[4, 'A third thing is tied to both', { role: 'mat', key: 'A third thing linked to both the group and the result can produce the gap without any help from the group.', changes: [['+', '1 box, 2 arrows']] }],
			[7, 'It can explain the gap by itself', { role: 'mat', key: 'A gap between groups is not evidence of cause until the third things are looked for.', changes: [['~', 'the arrow “cause?” is not settled']] }],
		],
		counters: [
			{ label: 'boxes', role: 'src', values: [[1, 2], [4, 3]] },
			{ label: 'arrows', role: 'mat', values: [[1, 1], [5, 2], [6, 3]] },
		],
	});
	a.text(10, 14, 'A gap between groups, and a third thing', 'f11 b');
	// the group and result boxes, each with its small chips
	a.box(10, 52, 100, 48, { role: 'grp', title: 'group' });
	a.chip(60, 70, 'A', { role: 'grp', level: 2, w: 20, h: 22, c: 'f10 b' });
	a.chip(84, 70, 'B', { role: 'grp', level: 2, w: 20, h: 22, c: 'f10 b' });
	a.box(250, 52, 100, 48, { role: 'src', title: 'result' });
	a.chip(296, 70, 'hi', { role: 'out', level: 3, w: 24, h: 22, c: 'f10 b', fx: { in: 2 } });
	a.chip(324, 70, 'lo', { role: 'out', level: 1, w: 24, h: 22, c: 'f10 b', fx: { in: 2 } });
	a.rect(247, 49, 106, 54, 's-out', { in: 2, hide: 3, pulse: true }, 8);
	// the dashed arrow between them and its label, which changes with the phase
	a.arrow(114, 82, 246, 82, 'ln dsh');
	a.tags(180, 74, [[1, 'cause?'], [2, 'a gap'], [4, 'a gap, but why?']], 'f10 b', 'm');
	// the third thing and its two arrows, drawn one after the other
	a.box(110, 150, 140, 48, { role: 'mat', title: 'a third thing', fx: { in: 4 } });
	a.arrow(150, 148, 78, 104, 's-mat', { in: 5, draw: true });
	a.arrow(210, 148, 282, 104, 's-mat', { in: 6, draw: true });
	a.text(180, 220, 'tied to both, it can explain the gap', 'f10', { in: 7 }, 'm');
	return a;
}

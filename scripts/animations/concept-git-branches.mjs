// Concept animation (SPEC D41, no real data) for branches and pull requests (core lesson C30). Metaphor: a branch is a second line of commits that
// leaves main and comes back through a pull request. Abstract only: commits c1 to c4, a merge commit m, the labels main and feature.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 main holds commits c1 and c2; 3 to 4 a branch leaves c2 and gets c3 and c4 while main
// stays on c2; 5 to 6 a pull request box asks to merge feature into main; 7 to 8 the merge commit m joins c2 and c4 and the label main moves to it.
// Facts (Pro Git, "Branches in a nutshell" and "Basic branching and merging"; GitHub Docs, "About pull requests" and "About pull request merges"):
// a branch is a movable pointer to a commit; a commit moves only the branch you are on; a pull request is a proposal to merge a branch; the merge
// button's default adds a merge commit that has two parents. Nothing here shows a conflict or what a review says, so no Predict of the lesson is answered.
// Counters (D41): main, feature (commits), open PR; each set at the phase that draws it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

const MAIN = 60; // y of the main line
const BR = 140; // y of the branch line

export default function make({ id = 'gbr' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'A branch leaves main and comes back through a pull request',
		desc:
			'Commits c1 and c2 on a line labeled main. A second line labeled feature leaves c2 and gets commits c3 and c4, while main stays on c2. A box labeled pull request asks to merge feature into main. A merge commit m then joins c2 and c4, and the label main moves to m.',
		caption: 'A branch is a second line of commits. A pull request asks main to take it, and the merge commit joins the two lines.',
		phases: [
			[1, 'main holds two commits', { role: 'src', key: 'A branch is a label on a commit; main is one of them.', changes: [['+', '2 commits on main']] }],
			[3, 'feature gets its own commits', { role: 'grp', key: 'The branch can grow commits of its own.', changes: [['+', 'branch feature'], ['+', '2 commits on feature']] }],
			[5, 'A pull request asks to merge', { role: 'mat', key: 'A pull request is a proposal to merge a branch; nothing has moved yet.', changes: [['+', '1 open pull request']] }],
			[7, 'The merge commit joins both', { role: 'out', key: 'The merge commit has two parents, and main now holds the work of feature.', changes: [['+', 'merge commit m'], ['~', 'main moves to m']] }],
		],
		counters: [
			{ label: 'on main', role: 'src', values: [[1, 2], [7, 3]] },
			{ label: 'feature', role: 'grp', values: [[1, 0], [3, 2]] },
			{ label: 'open PR', role: 'mat', values: [[1, 0], [5, 1], [7, 0]] },
		],
	});
	a.text(10, 14, 'Branch, ask, merge', 'f11 b');

	a.chip(10, MAIN, 'c1', { role: 'src', level: 2, w: 44 });
	a.arrow(54, MAIN + 12, 80, MAIN + 12, 's-src', {});
	a.chip(80, MAIN, 'c2', { role: 'src', level: 2, w: 44 });
	a.text(102, MAIN - 8, 'main', 'f10 b', { in: 1, hide: 7 }, 'm');

	// the branch leaves c2 and gets c3 and c4
	a.path(`M102 ${MAIN + 24}L102 ${BR + 12}L146 ${BR + 12}`, 's-grp', { in: 3, draw: true });
	a.chip(146, BR, 'c3', { role: 'grp', level: 3, w: 44, fx: { in: 3 } });
	a.arrow(190, BR + 12, 214, BR + 12, 's-grp', { in: 4, draw: true });
	a.chip(214, BR, 'c4', { role: 'grp', level: 3, w: 44, fx: { in: 4 } });
	a.text(236, BR + 40, 'feature', 'f10 b', { in: 4 }, 'm');

	// the pull request asks to merge feature into main
	a.box(262, 96, 88, 40, { role: 'mat', title: 'pull request', fx: { in: 5 } });
	a.arrow(258, BR + 12, 262, BR - 4, 's-mat', { in: 5, draw: true });

	// the merge commit joins the two lines
	a.arrow(124, MAIN + 12, 214, MAIN + 12, 's-out', { in: 7, draw: true });
	a.chip(214, MAIN, 'm', { role: 'out', level: 3, w: 44, fx: { in: 7 } });
	a.path(`M236 ${BR - 2}L236 ${MAIN + 28}`, 's-out', { in: 7, draw: true });
	a.text(236, MAIN - 8, 'main', 'f10 b', { in: 7 }, 'm');
	return a;
}

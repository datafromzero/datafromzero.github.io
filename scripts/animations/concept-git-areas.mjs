// Concept animation (SPEC D41, no real data) for saving a history with Git (core lesson C23). Metaphor: a commit is a snapshot you assemble in
// a staging area before it joins the history. Abstract only: files a.py and b.py, commits named commit 1 and commit 2.
// 8 s loop of 8 phases in four steps of two phases: 1 to 2 three boxes (folder, staging, history) with a.py and b.py in the folder and commit 1 in the
// history; 3 to 4 b.py turns red and is labeled edited; 5 to 6 an arrow labeled git add draws from the folder to the staging box and a b.py chip appears
// there; 7 to 8 an arrow labeled git commit draws from staging to history, a commit 2 chip appears there, and at phase 8 the staged chip and the edited
// flag go away (the folder and the history agree again).
// Facts (Pro Git, "What is Git?" and "Recording changes"): the three sections of a project are the working tree, the staging area and the Git directory;
// `git add` stages a file exactly as it is when the command runs. Nothing here shows what `git status` or `git diff` print, so no Predict of the lesson is answered.
// Counters (D41): edited, staged and commits, each set at the phase that draws it.
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'gta' } = {}) {
	const a = anim({
		id,
		h: 236,
		loop: { cycle: 8 },
		title: 'A commit is a snapshot you assemble',
		desc:
			'Three boxes in a row: your folder, the staging area and the history. The folder holds two files, a.py and b.py. The history holds one commit, commit 1. The file b.py turns red and is labeled edited. An arrow labeled git add runs from the folder to the staging box, and a b.py chip appears in staging. An arrow labeled git commit runs from staging to the history, and a chip commit 2 appears beside commit 1. The staged chip and the edited label then go away.',
		caption: 'Edit in the folder, stage with git add, then git commit turns what is staged into a new commit in the history.',
		phases: [
			[1, 'Folder, staging and history', { role: 'src', key: 'Files live in three places: your folder, the staging area and the history of commits.', changes: [['+', '3 places'], ['+', '1 commit']] }],
			[3, 'b.py is edited in the folder', { role: 'flt', key: 'An edit changes the file in your folder; the staging area and the history stay as they were.', changes: [['~', 'b.py edited']] }],
			[5, 'git add stages a copy of b.py', { role: 'grp', key: 'git add puts the file, as it is now, into the staging area: the next snapshot.', changes: [['+', '1 file staged']] }],
			[7, 'git commit saves the snapshot', { role: 'out', key: 'git commit turns what is staged into a new commit at the end of the history.', changes: [['+', 'commit 2'], ['−', 'nothing left staged']] }],
		],
		counters: [
			{ label: 'edited', role: 'flt', values: [[3, 1], [8, 0]] },
			{ label: 'staged', role: 'grp', values: [[5, 1], [8, 0]] },
			{ label: 'commits', role: 'out', values: [[1, 1], [7, 2]] },
		],
	});
	a.text(10, 14, 'Edit, stage, commit', 'f11 b');

	a.box(10, 50, 90, 146, { role: 'src', title: 'folder' });
	a.box(135, 50, 90, 146, { role: 'grp', title: 'staging' });
	a.box(260, 50, 90, 146, { role: 'out', title: 'history' });

	a.chip(17, 78, 'a.py', { role: 'src', level: 2, w: 76 });
	a.chip(17, 110, 'b.py', { role: 'src', level: 2, w: 76, flags: [{ role: 'flt', level: 3, fx: { in: 3, hide: 8 } }] });
	a.text(55, 152, 'edited', 'f10 b', { in: 3, hide: 8 }, 'm');

	a.chip(142, 110, 'b.py', { role: 'grp', level: 3, w: 76, fx: { in: 5, hide: 8 } });

	a.chip(267, 78, 'commit 1', { role: 'out', level: 2, w: 76 });
	a.chip(267, 110, 'commit 2', { role: 'out', level: 3, w: 76, fx: { in: 7 } });

	a.arrow(100, 123, 135, 123, 's-grp', { in: 5, draw: true });
	a.text(117, 220, 'git add', 'f10 b', { in: 5 }, 'm');
	a.arrow(225, 123, 260, 123, 's-out', { in: 7, draw: true });
	a.text(242, 220, 'git commit', 'f10 b', { in: 7 }, 'm');
	return a;
}

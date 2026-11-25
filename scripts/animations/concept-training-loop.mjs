// Concept animation (SPEC D41, no real data) for the training loop of a neural network (ML Engineer lesson MLE5). Metaphor: one trip round a ring of four stations,
// forward pass, loss, backward pass, update, and then again with the next batch. Abstract only: four boxes with a short plain line each and arrows between them. It shows
// no loss value, no learning rate and nothing about the size of a step, so it never gives away the Predict of unit 3 (which learning rate ends lowest).
// 8 s loop of 8 phases in five steps: 1 and 2 the forward pass box; 3 and 4 the loss box and an arrow into it; 5 and 6 the backward pass box and its arrow; 7 the update box
// and its arrow; 8 the arrow from update back to the forward pass and the label next batch.
// Facts: the loop of the lesson's unit 3 Idea and its code (forward pass, loss, loss.backward(), optimizer.step(), optimizer.zero_grad() before each backward pass), as the
// PyTorch quickstart and optimization tutorial pages say it.
// Counters (D41): batch 1 then 2 (step 5), loss 1 (step 2), updates 1 (step 4).
// The step label is drawn by the generator at the top left (up to about 150 px wide); nothing else is drawn there.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'trl' } = {}) {
	const a = anim({
		id,
		h: 256,
		loop: { cycle: 8 },
		title: 'The training loop: forward pass, loss, backward pass, update, then the next batch',
		desc:
			'Four boxes stand in a ring, joined by arrows that run clockwise. The first, forward pass, says a batch goes in and chances come out. An arrow leads to the second, loss, which says the chances and what happened become one number. An arrow leads down to the third, backward pass, which says a slope for every learnable number. An arrow leads left to the fourth, update, which says each number moves against its slope. A last arrow leads up from update to the first box and a label says next batch.',
		caption: 'Forward pass, loss, backward pass, update, and then again with the next batch.',
		phases: [
			[1, 'A batch goes forward', { role: 'src', key: 'Forward pass: a batch of people goes through the network and out come chances.', changes: [['+', 'chances for the batch']] }],
			[3, 'The loss scores the chances', { role: 'flt', key: 'The loss turns the chances and what happened into one number.', changes: [['+', '1 loss']] }],
			[5, 'Backward: a slope for each number', { role: 'win', key: 'Backward pass: the slope of the loss for every learnable number.', changes: [['+', 'a slope for each number']] }],
			[7, 'Update: the numbers move', { role: 'out', key: 'Update: every number moves a little against its slope.', changes: [['~', 'the numbers change']] }],
			[8, 'Again with the next batch', { role: 'src', key: 'Clear the old slopes (zero_grad), then the next batch goes forward.', changes: [['~', 'next batch']] }],
		],
		counters: [
			{ label: 'batch', role: 'src', values: [[1, 1], [8, 2]] },
			{ label: 'loss', role: 'flt', values: [[3, 1]] },
			{ label: 'updates', role: 'out', values: [[7, 1]] },
		],
	});
	a.text(10, 14, 'One trip round the ring', 'f11 b');

	const station = (x, y, role, title, lines, at) =>
		a.box(x, y, 140, 64, { role, title, fx: at > 1 ? { in: at } : undefined }, () => lines.forEach((l, i) => a.text(x + 10, y + 36 + i * 13, l, 'f10 mu')));
	station(20, 56, 'src', '1 forward pass', ['a batch goes in,', 'chances come out'], 1);
	station(200, 56, 'flt', '2 loss', ['chances and what', 'happened: one number'], 3);
	station(200, 160, 'win', '3 backward pass', ['a slope for every', 'learnable number'], 5);
	station(20, 160, 'out', '4 update', ['each number moves', 'against its slope'], 7);
	a.arrow(160, 88, 198, 88, 's-src', { in: 3, draw: true });
	a.arrow(270, 120, 270, 158, 's-flt', { in: 5, draw: true });
	a.arrow(198, 192, 162, 192, 's-win', { in: 7, draw: true });
	a.arrow(90, 160, 90, 122, 's-out', { in: 8, draw: true });
	a.text(100, 144, 'next batch', 'f10 b', { in: 8 });
	return a;
}

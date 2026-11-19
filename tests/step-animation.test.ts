// Live counts and Key idea of the lesson figures (SPEC D41): the generator adds them only when a spec gives them, builds the
// counter states per step or phase, and refuses a spec that would spoil a step or break the markup.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anim } from '../scripts/lib/step-animation.mjs';
import gbh from '../scripts/animations/sql-group-by-having.mjs';
import gb from '../scripts/animations/concept-group-by.mjs';
import cte from '../scripts/animations/concept-cte-kinds.mjs';

const steps = (extra: object[] = []) =>
	[1, 2, 3].map((n, i) => ({ role: 'src', clause: `S${n}`, text: `Step ${n}.`, ...(extra[i] ?? {}) }));

test('a spec without counts, key ideas or changes renders no strip, panel or print copy', () => {
	const plain = anim({ id: 't', h: 40, title: 't', desc: 'd', steps: steps() }).build().markup;
	assert.doesNotMatch(plain, /sa-cn|sa-now|sa-px/);
	assert.doesNotMatch(cte().build().markup, /sa-cn|sa-now|sa-px/);
});

test('stepper: a counter is "—" before its step, lit at the steps that set it, and has one state per run of equal steps', () => {
	const m = anim({
		id: 't', h: 40, title: 't', desc: 'd',
		steps: steps([
			{ counts: [{ label: 'rows', value: 10 }], key: 'One.', changes: [['+', 'a']] },
			{ counts: [{ label: 'groups', value: 3 }], key: 'Two.', changes: [['-', 'b'], ['~', 'c']] },
			{ key: 'Three.' },
		]),
	}).build().markup;
	assert.match(m, /<span class="sa-n c-src"><i class="v1 hl"><small>rows<\/small><b>10<\/b><\/i><i class="v2 v3"><small>rows<\/small><b>10<\/b><\/i><\/span>/);
	assert.match(m, /<i class="v1"><small>groups<\/small><b>—<\/b><\/i><i class="v2 hl"><small>groups<\/small><b>3<\/b><\/i><i class="v3">/);
	assert.match(m, /<div class="z2 c-src"><b>Key idea<\/b> Two\.<span class="sa-chs"><span class="sa-ch mi"><span class="sr">Removed: <\/span>b<\/span>/); // "-" becomes a minus sign
	assert.equal((m.match(/class="sa-px"/g) ?? []).length, 3); // the print copy of every step
});

test('stepper: the real pilots carry their counters, and step 1 shows inputs only', () => {
	const m = gbh().build().markup;
	assert.match(m, /aria-label="Row counts at this step"/);
	const first = m.match(/<div class="z1 [^"]*">([\s\S]*?)<\/div>/)![1];
	assert.doesNotMatch(first, /groups|HAVING|3/);
	assert.match(m, /<small>after HAVING<\/small><b>—<\/b>/);
});

test('concept: counters follow the phases through the loop classes and stay lit to the end of their step', () => {
	const m = gb().build().markup;
	assert.match(m, /<div class="sa-cn" aria-hidden="true">/);
	// groups ticks 1, 2, 3 in phases 2, 3, 4 (step 2 covers phases 2 to 4, so each is lit until phase 4 ends)
	assert.match(m, /<i class="w1 d2 tmp hl"><small>groups<\/small><b>1<\/b>/);
	assert.match(m, /<i class="w1 d4 tmp hl"><small>groups<\/small><b>3<\/b>/);
	assert.match(m, /<i class="w4 d5"><small>groups<\/small><b>3<\/b>/); // plain from phase 5 to the end
	assert.match(m, /<div class="sa-now" aria-hidden="true">/);
});

test('the generator refuses a missing key idea, a long one, an unknown sign and too many chips', () => {
	const make = (extra: object[]) => () => anim({ id: 't', h: 40, title: 't', desc: 'd', steps: steps(extra) });
	assert.throws(make([{ key: 'One.' }, {}, {}]), /needs a key idea/);
	assert.throws(make([{ key: 'x'.repeat(111) }, { key: 'b' }, { key: 'c' }]), /over 110/);
	assert.throws(make([{ key: 'a', changes: [['*', 'x']] }, { key: 'b' }, { key: 'c' }]), /changes are/);
	assert.throws(make([{ key: 'a', changes: [['+', '1'], ['+', '2'], ['+', '3'], ['+', '4']] }, { key: 'b' }, { key: 'c' }]), /more than 3/);
});

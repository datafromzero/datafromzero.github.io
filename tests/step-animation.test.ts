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
	assert.doesNotMatch(plain, /sa-cn|sa-now/);
	// concept-cte-kinds has a Key idea but no strip: counting adds nothing there
	const ck = cte().build().markup;
	assert.match(ck, /class="sa-now"/);
	assert.doesNotMatch(ck, /sa-cn/);
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
	// the label is written once; each state is only its value
	assert.match(m, /<span class="sa-n c-src"><small>rows<\/small><span><i class="v1 hl">10<\/i><i class="v2 v3">10<\/i><\/span><\/span>/);
	assert.match(m, /<small>groups<\/small><span><i class="v1">—<\/i><i class="v2 hl">3<\/i><i class="v3">3<\/i><\/span>/);
	assert.match(m, /<div class="z2 c-src">Two\.<span class="sa-chs"><span class="sa-ch mi">b<\/span><span class="sa-ch ch">c<\/span><\/span><\/div>/); // "-" becomes a minus sign
	assert.equal((m.match(/<small>rows<\/small>/g) ?? []).length, 1);
	assert.doesNotMatch(m, /sa-px|Key idea|class="sr">(Added|Removed|Changed)/); // the words come from the stylesheet
});

test('stepper: the real pilots carry their counters, and step 1 shows inputs only', () => {
	const m = gbh().build().markup;
	assert.match(m, /aria-label="Row counts at this step"/);
	const first = m.match(/<div class="z1 [^"]*">([\s\S]*?)<\/div>/)![1];
	assert.doesNotMatch(first, /groups|HAVING|3/);
	assert.match(m, /<small>after HAVING<\/small><span><i class="v1 v2 v3 v4">—<\/i>/);
});

test('concept: counters follow the phases through the loop classes and stay lit to the end of their step', () => {
	const m = gb().build().markup;
	assert.match(m, /<div class="sa-cn" aria-hidden="true">/);
	// groups ticks 1, 2, 3 in phases 2, 3, 4 (step 2 covers phases 2 to 4, so each is lit until phase 4 ends)
	assert.match(m, /<i class="w1 d2 tmp hl">1<\/i>/);
	assert.match(m, /<i class="w1 d4 tmp hl">3<\/i>/);
	assert.match(m, /<i class="w4 d5">3<\/i>/); // plain from phase 5 to the end
	assert.match(m, /<div class="sa-now" aria-hidden="true">/);
});

test('the generator refuses a missing key idea, a long one, an unknown sign and too many chips', () => {
	const make = (extra: object[]) => () => anim({ id: 't', h: 40, title: 't', desc: 'd', steps: steps(extra) });
	assert.throws(make([{ key: 'One.' }, {}, {}]), /needs a key idea/);
	assert.throws(make([{ key: 'x'.repeat(111) }, { key: 'b' }, { key: 'c' }]), /over 110/);
	assert.throws(make([{ key: 'a', changes: [['*', 'x']] }, { key: 'b' }, { key: 'c' }]), /changes are/);
	assert.throws(make([{ key: 'a', changes: [['+', '1'], ['+', '2'], ['+', '3'], ['+', '4']] }, { key: 'b' }, { key: 'c' }]), /more than 3/);
});

test('every concept figure and stepper with a Key idea builds, writes each counter label once and stays small', async () => {
	const { readdirSync } = await import('node:fs');
	const dir = new URL('../scripts/animations/', import.meta.url);
	const names = readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4));
	let withNow = 0;
	for (const name of names) {
		const { default: make } = await import(new URL(`${name}.mjs`, dir).href);
		for (const variant of name === 'concept-join' ? ['inner', 'left', 'right', 'full', 'cross', 'all'] : [undefined]) {
			const m = make({ variant }).build().markup as string;
			if (!/class="sa-now/.test(m)) continue;
			withNow++;
			assert.ok(m.length < 15000, `${name} ${variant ?? ''}: ${m.length} bytes of markup`);
			const counters = m.match(/<span class="sa-n /g)?.length ?? 0;
			assert.ok(counters <= 5, `${name}: ${counters} counters`);
			assert.equal((m.match(/<small>/g) ?? []).length, counters, `${name}: a counter label is written once`);
		}
	}
	assert.ok(withNow >= 40, `only ${withNow} figures carry the live strip or Key idea`);
});

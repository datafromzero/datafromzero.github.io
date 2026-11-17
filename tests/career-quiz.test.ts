import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { CAREERS, parseWeights, rank, type Weights } from '../src/lib/career-quiz-score.ts';
import { QUESTIONS, encodeWeights } from '../src/lib/career-quiz.ts';

/** The option of question `q` (0-based) whose 2 points go to `career`. */
const twoFor = (q: number, career: string): Weights => QUESTIONS[q].options.find((o) => o.weights[career as 'DA'] === 2)!.weights;

describe('career quiz scoring (issue #32 §6)', () => {
	test('a clear winner: every answer picks the Data Scientist option', () => {
		const answers = QUESTIONS.map((_, q) => twoFor(q, 'DS'));
		const r = rank(answers);
		assert.deepEqual(r.top, ['DS']);
		assert.equal(r.order[0].total, 20); // ten 2-point answers
		assert.equal(r.order[0].twos, 10);
		// the same options give their 1 point to ML six times and to DA three times
		assert.deepEqual(r.second, ['ML']);
		assert.deepEqual(r.order.map((t) => t.total), [20, 6, 3, 0]);
	});

	test('a tie on total points goes to the career with more 2-point answers', () => {
		// DA: 2 + 2 = 4 points from two 2-point answers; DE: 1 + 1 + 2 = 4 points from one 2-point answer
		const answers: Weights[] = [{ DA: 2, DE: 1 }, { DA: 2, DE: 1 }, { DE: 2 }];
		const r = rank(answers);
		assert.equal(r.order[0].total, r.order[1].total);
		assert.deepEqual(r.top, ['DA']);
		assert.deepEqual(r.second, ['DE']);
	});

	test('still tied after the 2-point answers: an honest tie shows both, never a coin flip', () => {
		const answers: Weights[] = [{ DS: 2, DA: 1 }, { DA: 2, DS: 1 }, { ML: 2 }];
		const r = rank(answers);
		assert.deepEqual(r.top, ['DA', 'DS']);
		assert.deepEqual(r.second, ['ML']);
	});

	test('all four tied: everything is the suggestion and there is no runner-up', () => {
		const r = rank([]);
		assert.deepEqual(r.top, [...CAREERS]);
		assert.deepEqual(r.second, []);
	});

	test('the form encoding round-trips', () => {
		for (const q of QUESTIONS) for (const o of q.options) assert.deepEqual(parseWeights(encodeWeights(o.weights)), o.weights);
		assert.equal(encodeWeights({ DA: 1, DE: 2 }), 'DE2 DA1');
	});
});

describe('career quiz questions (issue #32 §5)', () => {
	test('ten questions, four options each, exactly one 2-point option per career', () => {
		assert.equal(QUESTIONS.length, 10);
		for (const q of QUESTIONS) {
			assert.equal(q.options.length, 4);
			for (const c of CAREERS) assert.equal(q.options.filter((o) => o.weights[c] === 2).length, 1, `${q.text} / ${c}`);
		}
	});

	test('balance check: 20 points from 2-point answers each; with every 1-point answer, DA 26, DE 29, DS 29, ML 28', () => {
		const max = Object.fromEntries(CAREERS.map((c) => [c, QUESTIONS.reduce((s, q) => s + q.options.reduce((t, o) => t + (o.weights[c] ?? 0), 0), 0)]));
		assert.deepEqual(max, { DA: 26, DE: 29, DS: 29, ML: 28 });
	});
});

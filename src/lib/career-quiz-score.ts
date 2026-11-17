/**
 * Scoring for the career quiz (/career-quiz/, SPEC D33), exactly as researched in GitHub issue #32 §6:
 * each answer gives 2 points to the career it fits best and 1 point to a close second; the highest total is
 * the suggested direction and the second-highest the runner-up. A tie on total points goes to the career with
 * more 2-point answers; if they are still tied, both are shown as equal (an honest tie, never a coin flip).
 * Results are a ranking, never percentages. Pure and dependency-free: the page script and the unit test
 * (tests/career-quiz.test.ts) import it.
 */
export const CAREERS = ['DA', 'DE', 'DS', 'ML'] as const;
export type Career = (typeof CAREERS)[number];
/** One answer's points, e.g. { DE: 2, DA: 1 }. */
export type Weights = Partial<Record<Career, number>>;

export interface Tally {
	career: Career;
	total: number;
	/** How many answers gave this career 2 points (the tie-breaker). */
	twos: number;
}
export interface Ranking {
	/** Every career, best first: total points, then 2-point answers, then the fixed order DA, DE, DS, ML. */
	order: Tally[];
	/** The suggested direction: one career, or several when they are still tied after the tie-breaker. */
	top: Career[];
	/** The runner-up group after `top` (several when tied with each other); empty when all four tie. */
	second: Career[];
}

/** "DE2 DA1" (the form's encoding of an option's weights) to { DE: 2, DA: 1 }. */
export function parseWeights(code: string): Weights {
	const w: Weights = {};
	for (const part of code.trim().split(/\s+/)) {
		const career = part.slice(0, 2) as Career;
		if ((CAREERS as readonly string[]).includes(career)) w[career] = Number(part.slice(2));
	}
	return w;
}

export function rank(answers: Weights[]): Ranking {
	const order: Tally[] = CAREERS.map((career) => ({ career, total: 0, twos: 0 }));
	for (const a of answers) {
		for (const t of order) {
			const p = a[t.career] ?? 0;
			t.total += p;
			if (p === 2) t.twos++;
		}
	}
	// Array.prototype.sort is stable: equal careers keep the fixed order.
	order.sort((x, y) => y.total - x.total || y.twos - x.twos);
	const same = (x: Tally, y: Tally) => x.total === y.total && x.twos === y.twos;
	const top = order.filter((t) => same(t, order[0]));
	const rest = order.slice(top.length);
	const second = rest.length ? rest.filter((t) => same(t, rest[0])) : [];
	return { order, top: top.map((t) => t.career), second: second.map((t) => t.career) };
}

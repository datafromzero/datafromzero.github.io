// The part of the placement-test button (SPEC D67) that needs no page: which lessons a test covers. Kept out of
// src/lib/progress.ts so the progress script, which every /start/ and stage page loads, does not carry it.
import type { OrderItem } from './progress';

/**
 * The lesson ids for the codes a placement test covers (`data-covers="S3 S4 S8"`), in the order given. A code the order does
 * not know (a lesson not published) is skipped; so is a repeat.
 */
export function coveredIds(order: readonly OrderItem[], covers: string): string[] {
	const byCode = new Map(order.map((x) => [x.c, x.id]));
	const out = new Set<string>();
	for (const c of covers.split(/\s+/)) {
		const id = byCode.get(c);
		if (id) out.add(id);
	}
	return [...out];
}

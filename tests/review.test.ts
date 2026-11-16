import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isStale } from '../scripts/review-report.ts';

test('older than 18 months is stale, newer is not', () => {
	const now = new Date('2026-11-16T00:00:00Z');
	assert.equal(isStale(new Date('2025-05-15'), now, 18), true);
	assert.equal(isStale(new Date('2025-05-16'), now, 18), false);
	assert.equal(isStale(new Date('2026-11-01'), now, 18), false);
});

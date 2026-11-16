// Give the main thread back between chunks of setup work (scheduler.yield, with a timeout fallback).
export function yieldToMain(): Promise<void> {
	const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
	return s?.yield ? s.yield() : new Promise((resolve) => setTimeout(resolve, 0));
}

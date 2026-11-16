// Scheduling helper for setup work. The rule: none of our tasks runs inside a frame the reader is
// scrolling through, so each heavy step starts right after a frame has been presented.

/**
 * Resolves in the first task after the next frame's rendering: requestAnimationFrame runs before the
 * frame's style, layout and paint, and the timeout fires after them. A step started here gets a fresh
 * frame budget. (scheduler.yield() alone resumes before the next render, so a chain of yields still adds
 * up to one long animation frame.)
 */
export function afterNextFrame(): Promise<void> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => setTimeout(resolve, 0));
	});
}

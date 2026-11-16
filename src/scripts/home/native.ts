// True where CSS scroll-driven animations run the progress bar and rail fill (see home.css).
// Elsewhere the GSAP ScrollTrigger scrubs take over.
export const nativeScrollTimeline: boolean =
	typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');

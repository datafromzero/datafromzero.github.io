// Hero caption: `Excel → SQL → Python → DA · DE · DS` decodes once when the CSS intro is over.
// ScrambleText rewrites the element's text while it runs, so assistive tech gets the real text from a
// visually hidden copy for exactly that long, and the visible text is aria-hidden meanwhile.
import { gsap } from '../gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

/** The intro (design/README.md §4) is finished about here; the CSS fallback shows the caption a little later. */
const AT_MS = 3000;
/** After this the CSS fallback may already be showing the caption. */
const LATE_MS = 3400;

export function init(cap: HTMLElement): () => void {
	const box = cap.parentElement as HTMLElement; // .cap
	const text = cap.textContent ?? '';
	let sr: HTMLElement | undefined;
	let tween: gsap.core.Tween | undefined;

	const done = () => {
		sr?.remove();
		cap.removeAttribute('aria-hidden');
		cap.textContent = text;
		gsap.set(box, { clearProps: 'opacity,transform' });
	};
	const go = () => {
		if (performance.now() > LATE_MS) return; // a late timer: the caption is already showing
		// the CSS entrance would show the caption now: this takes over in the same frame
		box.classList.add('is-decoding');
		sr = document.createElement('span');
		sr.className = 'sr';
		sr.textContent = text;
		box.append(sr);
		cap.setAttribute('aria-hidden', 'true');
		gsap.set(box, { opacity: 0, y: 10 });
		tween = gsap.to(cap, {
			duration: 1.5,
			ease: 'none',
			scrambleText: { text, chars: 'upperCase', speed: 0.6, revealDelay: 0.2, tweenLength: false },
			onComplete: done,
		});
		gsap.to(box, { opacity: 1, y: 0, duration: 0.7, ease: 'dfz' });
	};

	// Too late: the CSS fallback has already shown the caption, so it is not hidden and decoded a second time.
	if (performance.now() > LATE_MS) return () => {};
	const timer = setTimeout(go, Math.max(0, AT_MS - performance.now()));
	return () => {
		clearTimeout(timer);
		tween?.kill();
		gsap.killTweensOf(box);
		if (sr) done();
		box.classList.remove('is-decoding');
	};
}

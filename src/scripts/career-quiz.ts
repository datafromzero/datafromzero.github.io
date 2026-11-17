// The career quiz (/career-quiz/, SPEC D33): the one script on that page besides the taskbar's. Owner-approved
// exception: under 4 KB gzipped, vanilla, no library, no GSAP. It scores on submit (the browser's own required
// check makes sure every question has an answer), writes the result into a polite live region and moves focus
// to its heading. Nothing is stored (no localStorage, no cookies) and nothing is sent: the form never submits.
import { parseWeights, rank, type Career } from '../lib/career-quiz-score.ts';

interface Copy {
	names: Record<Career, string>;
	why: Record<Career, string>;
	themes: Record<Career, string>;
	heading: string;
	headingTie: string;
	and: string;
	because: string;
	second: string;
}

const form = document.querySelector<HTMLFormElement>('#cq-form');
const result = document.querySelector<HTMLElement>('.cq-result');

if (form && result) {
	const copy = JSON.parse(form.dataset.copy ?? '{}') as Copy;
	const heading = result.querySelector('h2')!;
	const why = result.querySelector<HTMLElement>('.cq-why')!;
	const because = result.querySelector<HTMLElement>('.cq-because')!;
	const second = result.querySelector<HTMLElement>('.cq-second')!;
	const list = (cs: Career[], of: Record<Career, string>) => cs.map((c) => of[c]).join(copy.and);

	form.querySelector<HTMLElement>('.cq-actions')!.hidden = false;
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const answers = Array.from(form.querySelectorAll<HTMLInputElement>('input:checked'), (i) => parseWeights(i.dataset.w ?? ''));
		const { top, second: next } = rank(answers);
		heading.textContent = (top.length > 1 ? copy.headingTie : copy.heading) + list(top, copy.names);
		why.textContent = top.map((c) => copy.why[c]).join(' ');
		because.textContent = copy.because.replace('{}', list(top, copy.themes));
		second.hidden = !next.length;
		second.textContent = copy.second.replace('{}', list(next, copy.names));
		result.hidden = false;
		// the result's top in view, below Starlight's header (its scroll-margin), and focus on its heading
		heading.focus({ preventScroll: true });
		result.scrollIntoView({ block: 'start' });
	});
	result.querySelector('.cq-reset')?.addEventListener('click', () => {
		form.reset();
		result.hidden = true;
		form.querySelector('input')?.focus();
	});
}

/**
 * Content of the career quiz (/career-quiz/, SPEC D33), word for word from the research in GitHub issue #32:
 * the ten questions with their options and weights (§5), the result copy, reason themes and shared-core line (§7),
 * the start-screen disclaimer (§8) and the O*NET database credit (§2, with our site name). If the wording of a
 * question changes, re-check it against §8 of the issue: no jargon, no obviously "smart" option, no career
 * reduced to a stereotype. Results are a ranking, never percentages; the copy never uses the words perfect,
 * optimal, test result or match score.
 */
import type { Career, Weights } from './career-quiz-score.ts';

export interface QuizOption {
	text: string;
	weights: Weights;
}
export interface QuizQuestion {
	text: string;
	options: QuizOption[];
}

export const CAREER_NAMES: Record<Career, string> = {
	DA: 'Data Analyst',
	DE: 'Data Engineer',
	DS: 'Data Scientist',
	ML: 'ML/AI Engineer',
};

/** §7: one sentence per career. */
export const RESULT_COPY: Record<Career, string> = {
	DA: 'You like turning numbers into clear answers other people can act on — that is the daily work of a Data Analyst.',
	DE: 'You like building the tidy, reliable systems that keep data flowing — that is the daily work of a Data Engineer.',
	DS: 'You like open questions, patterns, and testing whether an idea really holds up — that is the daily work of a Data Scientist.',
	ML: 'You like building smart tools that other people can use — that is the daily work of an ML/AI Engineer.',
};

/** §7: reason themes, used to build the "because…" line. */
export const REASON_THEMES: Record<Career, string> = {
	DA: 'clear answers, explained to people',
	DE: 'tidy, reliable systems that just work',
	DS: 'open questions and testing ideas',
	ML: 'building tools people use',
};

/** §7: shown on every result. */
export const SHARED_CORE =
	'All four careers start with the same core on this roadmap — Excel, then SQL, then Python — so this picks a direction, not a locked door. Switching later is normal, and most of what you learn carries over.';

/** §8: the start screen. */
export const DISCLAIMER =
	'This quiz suggests a direction based on what you enjoy. It is not a test, it measures no ability, and it saves nothing.';

/** §6: the rule, simple enough to print on the page. */
export const RULE =
	'Each answer gives 2 points to the career it fits best and 1 point to a close second. Add up the points for each career. The highest total is your suggested direction; the second-highest is shown as your runner-up.';
export const TIE_RULE =
	// §6 says "show both as equal matches": "matches" is left out, since the page never speaks of a match.
	'If two careers tie on total points, the one with more 2-point answers wins. If they are still tied, both are shown as equal: for a suggestion tool, an honest tie is better than a fake coin flip.';

/** §2: the prescribed credit for the O*NET database (modified-information version), with our site name. */
export const ONET_CREDIT = {
	before:
		'This page includes information from the O*NET 31.0 Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the ',
	license: 'CC BY 4.0',
	licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
	after:
		' license. O*NET® is a trademark of USDOL/ETA. datafromzero has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these modifications.',
};

/** §2: the validated instrument, for readers who want one. */
export const MINI_IP_URL = 'https://www.mynextmove.org/explore/ip';

/** §5: ten questions, four options each (A–D). 2 = the career the option fits best, 1 = a close second. */
export const QUESTIONS: QuizQuestion[] = [
	{
		text: 'You are helping a small shop make sense of a year of sales records. Which part would you most enjoy?',
		options: [
			{ text: 'Putting the messy records in order, so the numbers can be trusted.', weights: { DE: 2, DA: 1 } },
			{ text: 'Finding the story in the numbers and showing the owner what it means.', weights: { DA: 2, DS: 1 } },
			{ text: 'Testing ideas about what drives sales, and checking whether they hold up.', weights: { DS: 2, ML: 1 } },
			{ text: "Building a small tool that answers the owner's questions automatically.", weights: { ML: 2, DE: 1 } },
		],
	},
	{
		text: 'Which workday sounds better to you?',
		options: [
			{ text: 'A clear checklist: the same reports run every morning, and they have to be right.', weights: { DE: 2, DA: 1 } },
			{ text: 'An open question nobody has answered yet, with no instructions for how to start.', weights: { DS: 2, ML: 1 } },
			{ text: 'A question from a manager in the morning, and a clear answer by the end of the day.', weights: { DA: 2, DS: 1 } },
			{ text: 'A long project building something new that people will use every day.', weights: { ML: 2, DE: 1 } },
		],
	},
	{
		text: 'At work, you would rather spend most of your time…',
		options: [
			{ text: 'Talking with the people who need answers, and learning what they really need.', weights: { DA: 2, DS: 1 } },
			{ text: 'Working on the systems behind the scenes that keep information flowing.', weights: { DE: 2, ML: 1 } },
			{ text: 'Digging into a hard problem on your own until it makes sense.', weights: { DS: 2, ML: 1 } },
			{ text: 'Designing and building something step by step, testing as you go.', weights: { ML: 2, DE: 1 } },
		],
	},
	{
		text: 'Which result would make you proudest at the end of a project?',
		options: [
			{ text: 'A clear chart or report that helps someone make a decision.', weights: { DA: 2, DS: 1 } },
			{ text: 'A data setup that quietly works every day without anyone noticing.', weights: { DE: 2 } },
			{ text: 'A model that predicts something useful, like which customers are likely to leave.', weights: { DS: 2, ML: 1 } },
			{ text: 'An app or tool that people open and use themselves.', weights: { ML: 2, DE: 1 } },
		],
	},
	{
		text: 'How do you feel about working with numbers and patterns?',
		options: [
			{ text: 'I like numbers when they answer a practical question about money, customers, or sales.', weights: { DA: 2 } },
			{
				text: 'I enjoy puzzles about chance and averages — like why a streak of coin flips happens, or how a poll can mislead.',
				weights: { DS: 2 },
			},
			{ text: 'I prefer clear rules and exact steps over guessing; being precisely right matters to me.', weights: { DE: 2 } },
			{ text: 'I like numbers when I can use them to make a machine do something clever.', weights: { ML: 2, DS: 1 } },
		],
	},
	{
		text: 'Where would you rather be in a team?',
		options: [
			{ text: 'Front and center: presenting findings and answering questions about them.', weights: { DA: 2, DS: 1 } },
			{ text: 'Behind the scenes: if I do my job well, nobody has to think about my work at all.', weights: { DE: 2 } },
			{ text: 'Off to the side, running experiments and bringing back what I find.', weights: { DS: 2, DA: 1 } },
			{ text: 'Building the thing the rest of the team will use.', weights: { ML: 2, DE: 1 } },
		],
	},
	{
		text: 'A problem lands on your desk. Which one do you reach for first?',
		options: [
			{ text: 'The numbers in two reports do not match, and someone has to find out why.', weights: { DA: 2, DE: 1 } },
			{
				text: 'Data arrives from five places in five formats, and it all has to come together in one place.',
				weights: { DE: 2, DA: 1 },
			},
			{ text: 'Nobody knows whether the new discount helped or hurt — and the data could answer it.', weights: { DS: 2, DA: 1 } },
			{ text: 'The team keeps answering the same question by hand, and it should answer itself.', weights: { ML: 2, DE: 1 } },
		],
	},
	{
		text: 'Which of these sounds most like you?',
		options: [
			{ text: 'I like making messy information neat and easy for others to use.', weights: { DA: 2, DE: 1 } },
			{ text: 'I like setting things up so they run the same way every time, without surprises.', weights: { DE: 2 } },
			{ text: 'I like asking "what if" and testing whether an idea survives the data.', weights: { DS: 2, DA: 1 } },
			{ text: 'I like taking things apart to see how they work, and putting them back together better.', weights: { ML: 2, DE: 1 } },
		],
	},
	{
		text: 'In a new job, you would most look forward to…',
		options: [
			{ text: 'Learning how the business makes money and what its customers do.', weights: { DA: 2 } },
			{ text: "Learning how the company's systems fit together under the hood.", weights: { DE: 2, ML: 1 } },
			{ text: 'Learning new methods for finding patterns and testing ideas.', weights: { DS: 2, ML: 1 } },
			{ text: 'Learning to build smarter tools with the newest technology.', weights: { ML: 2, DS: 1 } },
		],
	},
	{
		text: 'A result you worked on turns out to be uncertain — the data cannot give a definite answer. How do you feel?',
		options: [
			{ text: 'Fine, as long as I can explain clearly what we know and what we do not.', weights: { DA: 2, DS: 1 } },
			{ text: 'Uncomfortable — I would rather fix the data until the answer is solid.', weights: { DE: 2 } },
			{ text: 'Interested — uncertain questions are where the interesting findings hide.', weights: { DS: 2, ML: 1 } },
			{ text: 'Fine — I would build the tool so it shows how sure it is, and let people decide.', weights: { ML: 2, DS: 1 } },
		],
	},
];

/** The form's encoding of an option's weights, best career first: { DE: 2, DA: 1 } → "DE2 DA1". */
export const encodeWeights = (w: Weights): string =>
	Object.entries(w)
		.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
		.map(([k, v]) => `${k}${v}`)
		.join(' ');

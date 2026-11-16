// SPEC D27: prefetch only, never prerender. Prerender would run page code (and later analytics)
// before the reader visits. The JSON is not executable, so lesson pages gain no JavaScript.
// Chromium only; other browsers simply navigate normally.
export const SPECULATION_RULES = JSON.stringify({
	prefetch: [
		{
			source: 'document',
			where: {
				and: [
					{ href_matches: '/*' }, // same origin only
					{ not: { href_matches: '/*.*' } }, // files (csv, zip, pdf, xml, ...), never pages
					{ not: { selector_matches: '[download], [target=_blank], [rel~=external], [href^="#"]' } },
				],
			},
			eagerness: 'moderate',
		},
	],
});

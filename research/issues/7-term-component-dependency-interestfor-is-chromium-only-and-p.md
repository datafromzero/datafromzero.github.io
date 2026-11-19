# #7 Research: Term component dependency: interestfor is Chromium-only and popover="hint" is missing from stable Safari - fallback required

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/7 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#7](https://github.com/datafromzero/datafromzero.github.io/issues/7) (closed), opened 2026-11-16

**Type:** tooling

**Summary:** The Term (glossary) component is being built on two features: the interestfor attribute and popover="hint". Checked on 2026-11-15, neither is safe to rely on alone. interestfor is Chromium-only and still experimental, with WebKit opposed. popover="hint" ships in Chrome/Edge and Firefox but not in any stable Safari. A feature-detect plus polyfill/fallback path is required, or the component will not work for Safari readers (19.57% of Vietnam all-platform views and 27.25% of Vietnam mobile views, October 2026).

**Evidence:**
- interestfor (interest invokers): the web-features dataset lists Chrome 149 and Edge 149 as first supported versions, Firefox not supported (Mozilla bug 1984699), Safari not supported. Source: https://web-platform-dx.github.io/web-features-explorer/features/interest-invokers/ (accessed 2026-11-15). Chromium's Intent to Ship targeted milestone 142 and records that WebKit expressed opposition to the interest behavior: https://groups.google.com/a/chromium.org/g/blink-dev/c/bX1G_yDt6W4 (accessed 2026-11-15). The 142 vs 149 first-version disagreement between these two sources is unresolved; both agree only Chromium ships it.
- Chrome's own developer guidance (updated 2026-11-09) still calls interest invokers experimental and instructs developers to feature-detect interestForElement on HTMLButtonElement.prototype and load the interestfor polyfill when native support is missing: https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/interest-triggered-action-previews (accessed 2026-11-15)
- popover="hint": Chrome/Edge partial 133-150, fully supported from 151; Firefox partial 149-152, supported from 153; Safari not supported through 27.2, support only in the 27.3 / Technology Preview line (desktop and iOS). Sources: https://caniuse.com/mdn-api_htmlelement_popover_hint and https://web-platform-dx.github.io/web-features-explorer/missing-only-in/safari/ (accessed 2026-11-15)

**Affected:** / (Term component on the homepage; the glossary reference page is not built yet)

**Suggested action:** Feature-detect interestForElement and ship the interestfor polyfill as Chrome's guidance prescribes. Make terms fully usable with plain click/tap and a regular popover where popover="hint" is unsupported, so Safari readers get the definitions without the hover/hint behavior.

**Confidence:** high for popover="hint"; medium for interestfor (first shipped version disputed between sources, Chromium-only status not in dispute)

**Checks:**
- [x] Source URLs open and support each claim (accessed 2026-11-15)
- [x] Facts restated in our own words; nothing copied from a competitor
- [x] Affected pages limited to routes in the live sitemap, or stage routes

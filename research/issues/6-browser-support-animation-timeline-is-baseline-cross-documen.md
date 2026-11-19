# #6 Research: Browser support: animation-timeline is Baseline, cross-document View Transitions blocked by Firefox, Speculation Rules Chromium-only

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/6 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#6](https://github.com/datafromzero/datafromzero.github.io/issues/6) (closed), opened 2026-11-16

**Type:** tooling

**Summary:** Support status for three platform features the site build is considering, checked against caniuse, the web-features dataset and vendor release notes on 2026-11-15. animation-timeline is now Baseline across all three engines. Cross-document View Transitions work in Chrome/Edge and Safari but not Firefox. Speculation Rules are Chromium-only in stable releases, so they can only ever act as a progressive enhancement.

**Evidence:**
- animation-timeline (scroll-driven animations): Chrome/Edge from 115, Safari from 26.0, Firefox from 159 (shipped 27 Oct 2026; previously behind a preference). Sources: https://caniuse.com/mdn-css_properties_animation-timeline and https://www.firefox.com/en-US/firefox/159.0/releasenotes/ (accessed 2026-11-15)
- Cross-document View Transitions (@view-transition): Chrome/Edge 126, Safari 18.2; Firefox and Firefox for Android not supported (Mozilla bug 1860854); the feature is an Interop 2026 focus area and Baseline has been blocked by Firefox since Dec 2024. Source: https://web-platform-dx.github.io/web-features-explorer/features/cross-document-view-transitions/ (accessed 2026-11-15). The same-document API is much wider (Firefox from 144, https://caniuse.com/view-transitions), so the gap is specific to the cross-document opt-in.
- Speculation Rules: Chrome/Edge partial 105-108, supported from 109; Safari not supported in any stable release through 27.2 (support only in the 27.3 / Technology Preview line); Firefox not supported through 162 (partial only in pre-release 163). Source: https://caniuse.com/mdn-html_elements_script_type_speculationrules (accessed 2026-11-15)

**Affected:** / (site-wide navigation and motion layer)

**Suggested action:** Use animation-timeline freely as an enhancement. Keep plain navigation as the Firefox path for page transitions (no dependency on cross-document View Transitions). Speculation Rules may be included since unsupported browsers ignore them, but expect the benefit only for Chromium readers (68.68% of Vietnam all-platform views, October 2026 - see the Vietnam audience research issue).

**Confidence:** high

**Checks:**
- [x] Source URLs open and support each claim (accessed 2026-11-15)
- [x] Facts restated in our own words; nothing copied from a competitor
- [x] Affected pages limited to routes in the live sitemap, or stage routes

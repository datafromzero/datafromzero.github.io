# #8 Research: Vietnam audience: Chrome 62.76% vs Safari 27.25% of mobile views (StatCounter, October 2026)

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/8 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#8](https://github.com/datafromzero/datafromzero.github.io/issues/8) (closed), opened 2026-11-16

**Type:** tooling

**Summary:** StatCounter Global Stats for Vietnam, October 2026 (the most recent month), read from the live tables on 2026-11-15. Mobile is 60.03% of page views. On mobile, Chrome holds 62.76% and Safari 27.25%. By mobile OS, Android is 61.71% and iOS 38.27%, so well over a third of mobile readers are on iOS devices even though Safari itself is about a quarter. This is the audience split behind the browser-support decisions in the companion research issues.

**Evidence:**
- Platform share, Vietnam, October 2026: Mobile 60.03%, Desktop 38.34%, Tablet 1.6%. Source: https://gs.statcounter.com/platform-market-share/vietnam (accessed 2026-11-15)
- Browser share, all platforms, Vietnam, October 2026: Chrome 68.68%, Safari 19.57%, Coc Coc 4.62%, UC Browser 1.97%, Samsung Internet 1.76%, Edge 1.55%. Source: https://gs.statcounter.com/browser-market-share/all/viet-nam (accessed 2026-11-15)
- Browser share, mobile only, Vietnam, October 2026: Chrome 62.76%, Safari 27.25%, Coc Coc 3.98%, UC Browser 2.87%, Samsung Internet 2.4%, Opera 0.38%. Source: https://gs.statcounter.com/browser-market-share/mobile/viet-nam (accessed 2026-11-15)
- Mobile OS share, Vietnam, October 2026: Android 61.71%, iOS 38.27%. Source: https://gs.statcounter.com/os-market-share/mobile/viet-nam (accessed 2026-11-15)

**Affected:** / (site-wide build and testing decisions)

**Suggested action:** Treat Safari/iOS as a first-class target, not an afterthought: roughly 27% of mobile views are Safari and 38% are iOS devices. No Chrome-only feature ships without a working fallback, and Safari on iOS belongs in the earliest test pass for new components.

**Confidence:** high

**Checks:**
- [x] Source URLs open and support each claim (accessed 2026-11-15)
- [x] Facts restated in our own words; nothing copied from a competitor
- [x] Affected pages limited to routes in the live sitemap, or stage routes

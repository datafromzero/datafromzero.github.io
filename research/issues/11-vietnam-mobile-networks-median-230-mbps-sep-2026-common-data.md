# #11 Research: Vietnam mobile networks: median 230 Mbps (Sep 2026), common data packages cap at 1-2 GB per day - prefetch guidance

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/11 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#11](https://github.com/datafromzero/datafromzero.github.io/issues/11) (closed), opened 2026-11-16

**Type:** tooling

**Summary:** Vietnam mobile conditions for tuning prefetch, checked on 2026-11-15. Raw throughput is high and data is cheap per megabyte, so bytes are not the constraint. The real constraints are the daily high-speed caps on common low-cost packages (1-2 GB per day) and latency per network round trip, which makes request count matter more than kilobytes.

**Evidence:**
- Speeds: Ookla Speedtest Global Index, Vietnam, September 2026 (the latest month-labelled figures, corroborated by GSMA): median mobile download 230.31 Mbps, upload 41.74 Mbps, latency 19 ms; Vietnam ranked 8th globally for mobile. The live country page's newer rolling view already shows higher figures (365.87 Mbps), so speeds are rising. Sources: https://develop.speedtest.net/global-index/vietnam#mobile and https://www.gsma.com/newsroom/press-release/viet-nam-receives-the-gsma-government-leadership-award-2026-2/ (accessed 2026-11-15). GSMA also reports 40,000+ 5G base stations covering about 92% of the population.
- Prices: Viettel SD100, 100,000 VND per 30 days, 2 GB/day high-speed (about 60 GB/month), mass-market: https://www.vietteldata.vn/ (accessed 2026-11-15). Viettel ST90K, 90,000 VND, 30 GB/month: https://Quantrimang.com/cong-nghe/dang-ky-goi-data-sieu-toc-st-viettel-174713 (accessed 2026-11-15). VinaPhone BIG90, 90,000 VND/month, 30 GB; BIG120, 120,000 VND/month, 60 GB: https://vnvinaphone.vn/4g-vina/ (accessed 2026-11-15). Package prices were read on carrier-focused portals rather than the carriers' own domains, hence medium confidence on prices.
- Implied cost: the packages above work out to roughly 1,667-3,000 VND per GB, so 1 MB of page weight costs a reader roughly 1.7-3 VND and about 0.035 s of transfer at the September median speed. A 5 MB page is about 0.25-0.5% of a 1-2 GB daily high-speed cap.

**Affected:** / (site-wide prefetch and page-weight policy)

**Suggested action:** Prefetch likely next pages selectively; bytes are cheap but every prefetched page spends requests against latency and counts toward daily caps. Avoid aggressive prerender on mobile data. Keep per-page request counts low; that, not raw kilobytes, is what Vietnamese readers feel.

**Confidence:** high for speeds; medium for prices

**Checks:**
- [x] Source URLs open and support each claim (accessed 2026-11-15)
- [x] Facts restated in our own words; nothing copied from a competitor
- [x] Affected pages limited to routes in the live sitemap, or stage routes

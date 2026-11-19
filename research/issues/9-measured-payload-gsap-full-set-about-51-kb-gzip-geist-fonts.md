# #9 Research: Measured payload: GSAP full set about 51 KB gzip; Geist fonts about 51 KB including Vietnamese subsets

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/9 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#9](https://github.com/datafromzero/datafromzero.github.io/issues/9) (closed), opened 2026-11-16

**Type:** tooling

**Summary:** Real delivered sizes, measured on 2026-11-15 from the actual files served by the jsDelivr CDN and Google Fonts (not published estimates). The full GSAP set the homepage plan uses (core + ScrollTrigger + SplitText + DrawSVG) is about 51 KB gzipped. A minimal Geist + Geist Mono setup is about 51 KB total, and both fonts do support Vietnamese through a dedicated subset that only downloads on pages rendering Vietnamese text.

**Evidence:**
- GSAP, measured from https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ and @3.15.1/dist/ (accessed 2026-11-15), gzip -9: core 28,114 B (3.13.0) / 28,415 B (3.15.1); ScrollTrigger 17,841 / 18,034 B; SplitText 3,449 / 3,657 B; DrawSVGPlugin 2,210 / 2,211 B. Totals: 51,614 B (3.13.0) and 52,317 B (3.15.1).
- Geist Vietnamese support: the Google Fonts CSS API serves a dedicated vietnamese subset for both Geist and Geist Mono whose unicode-range includes U+1EA0-1EF9 (precomposed Vietnamese vowels/tones) and U+20AB (dong sign). Sources: https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&display=swap and https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400&display=swap (accessed 2026-11-15)
- Font file sizes, measured by downloading the served woff2 files from fonts.gstatic.com (accessed 2026-11-15): Geist Sans is served as one variable file per subset covering weights 100-900: vietnamese 8,004 B, latin 29,400 B. Geist Mono at weight 400 (static): vietnamese 3,852 B, latin 9,864 B. Geist Mono variable pair, if multiple weights are needed: 7,696 B / 23,128 B. woff2 does not shrink further under gzip, so these byte counts are the delivered sizes.
- Minimal set total: 51,120 B for Geist Sans variable + Geist Mono 400, vietnamese + latin subsets (4 files). English pages download only the latin files: 39,264 B. The vietnamese files (+11,856 B) download only where Vietnamese text renders.

**Affected:** / (homepage asset budget)

**Suggested action:** Budget about 102 KB combined worst case for animation library plus fonts on the homepage. Keep the current plan of loading GSAP after first render so it stays off the critical path, and rely on subset-on-demand loading so the English root never pays for the Vietnamese font files.

**Confidence:** high

**Checks:**
- [x] Source URLs open and support each claim (accessed 2026-11-15)
- [x] Facts restated in our own words; nothing copied from a competitor
- [x] Affected pages limited to routes in the live sitemap, or stage routes

# #10 Research: Motion technique patterns from GSAP documentation and Webflow (techniques and sources)

<!-- Copied from https://github.com/datafromzero/datafromzero.github.io/issues/10 by scripts/sync-research-issues.mjs; edit the issue, not this file. -->

- Issue: [#10](https://github.com/datafromzero/datafromzero.github.io/issues/10) (closed), opened 2026-11-16

**Type:** tooling

**Summary:** Ten motion techniques collected on 2026-11-15 for the homepage designer's consideration. Techniques and mechanisms only; no designs were taken. Note: the GSAP showcase page itself is a video gallery with no technique documentation, so the GSAP techniques below come from GSAP's official documentation and resources pages, and one technique from an official Webflow University lesson.

**Evidence:**
1. Scroll-pinned horizontal section: ScrollTrigger pins a section while a tween translates an inner track along x, scrub tying progress to scroll. https://gsap.com/docs/v3/Plugins/ScrollTrigger/
2. Inner animations in a horizontal scroller: child ScrollTriggers take the horizontal tween as their containerAnimation so reveals fire on horizontal position. Same source as 1.
3. Pinned multi-step timeline with snap-to-labels: a scrubbed pinned timeline whose steps are labels, with snap settling on the nearest step. Same source as 1.
4. Play-once section reveals: ScrollTrigger once: true kills the trigger after first play; toggleClass can hand the reveal to pure CSS. Same source as 1.
5. Scroll-progress readout: ScrollTrigger.create with onUpdate exposing self.progress to drive any element's scaleX or width. Same source as 1.
6. Masked line-by-line text reveal: SplitText with type and mask set to lines, lines rising from yPercent 100 with stagger; autoSplit re-splits after font load or resize, and split children are aria-hidden with an aria-label on the element. https://gsap.com/docs/v3/Plugins/SplitText/
7. SVG path drawing itself on scroll: DrawSVGPlugin animates the visible stroke segment; combined with a scrubbed ScrollTrigger the path draws in proportion to scroll. A Firefox path-length quirk is documented, fixable by overshooting to about 102%. https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
8. Layout-change transitions: Flip.getState records positions, the DOM changes, Flip.from animates elements to the new layout, with onEnter/onLeave for appearing/disappearing items. https://gsap.com/docs/v3/Plugins/Flip/
9. Reduced-motion branching: gsap.matchMedia runs setup only while a media query matches and auto-reverts otherwise; the documented pattern keeps-but-simplifies functional motion and removes decorative motion for prefers-reduced-motion readers. https://gsap.com/resources/getting-started/accessibility/
10. Seamless infinite marquee with off-screen pause: two identical groups in a flex row, a linear -100% width loop, and ScrollTrigger trigger actions pausing the loop while off-screen. https://university.webflow.com/videos/infinite-marquee-animation-on-scroll
(All sources accessed 2026-11-15)

**Affected:** / (homepage motion design)

**Suggested action:** Designer picks from this list per section. Technique 9 (reduced-motion branching) should gate whichever of the others are adopted. Technique 7 fits the roadmap route line literally; technique 4 matches the CSS-first, per-section-on-approach plan already in place.

**Confidence:** high

**Checks:**
- [x] Source URLs open and support each claim (accessed 2026-11-15)
- [x] Facts restated in our own words; nothing copied from a competitor
- [x] Affected pages limited to routes in the live sitemap, or stage routes

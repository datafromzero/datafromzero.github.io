#!/usr/bin/env node
// Manual figure check (not in `npm run check`: it needs a browser). Finds lesson figure labels that run past the box
// they sit in, the mistake the owner saw on a phone (MISTAKES.md, 2026-11-20).
// Usage: npm run build && npx astro preview --port 4422   (in another shell)   then   node scripts/check-figure-text.cjs dist
// Chips that move inside step animations can show up as false positives; look at each hit before changing it.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const root = process.argv[2] ?? "dist"; const pages = [];
for (const st of ['excel','sql','python']) for (const d of fs.readdirSync(path.join(root, st))) { const f = path.join(root, st, d, 'index.html'); if (fs.existsSync(f)) pages.push(`/${st}/${d}/`); }
pages.push('/choose-your-track/'); // the skills chart (SPEC D49)
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 900 } });
  for (const u of pages) {
    await p.goto('http://localhost:4422' + u, { waitUntil: 'load' });
    const hits = await p.evaluate(() => {
      const out = [];
      for (const svg of document.querySelectorAll('.sl-markdown-content svg')) {
        if (svg.closest('.expressive-code') || svg.getBoundingClientRect().width < 100) continue;
        const rects = [...svg.querySelectorAll('rect')].map(r => r.getBoundingClientRect()).filter(r => r.width > 8 && r.height > 8);
        for (const t of svg.querySelectorAll('text')) {
          const tb = t.getBoundingClientRect(); if (!tb.width) continue;
          const cx = (tb.left + tb.right) / 2, cy = (tb.top + tb.bottom) / 2, m = 1.5;
          for (const r of rects) {
            const centerIn = cx > r.left && cx < r.right && cy > r.top && cy < r.bottom;
            const fits = tb.left >= r.left + m && tb.right <= r.right - m && tb.top >= r.top - 2 && tb.bottom <= r.bottom + 2;
            if (centerIn && !fits && tb.width < r.width) { out.push((svg.id || svg.getAttribute('aria-labelledby') || '?') + ': "' + t.textContent.trim().slice(0, 40) + '"'); break; }
          }
        }
      }
      return [...new Set(out)];
    });
    if (hits.length) console.log(u + '\n  ' + hits.join('\n  '));
  }
  await b.close();
})();

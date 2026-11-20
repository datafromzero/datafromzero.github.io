// Manual figure check, part 2: text outside its figure or on other text (390 px and 1280 px). Same usage as check-figure-text.cjs.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const root = process.argv[2]; const pages = [];
for (const st of ['excel','sql','python']) for (const d of fs.readdirSync(path.join(root, st))) { const f = path.join(root, st, d, 'index.html'); if (fs.existsSync(f)) pages.push(`/${st}/${d}/`); }
(async () => {
  const b = await chromium.launch();
  for (const vw of [390, 1280]) {
  const p = await b.newPage({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' });
  for (const u of pages) {
    await p.goto('http://localhost:4422' + u, { waitUntil: 'load' });
    const hits = await p.evaluate(() => {
      const out = [];
      for (const svg of document.querySelectorAll('.sl-markdown-content svg, main svg.csf')) {
        if (svg.closest('.expressive-code') || svg.getBoundingClientRect().width < 100) continue;
        if (svg.closest('[class*="sa-"], .ca, .sa')) continue; // step animations: frames overlap by design
        const sb = svg.getBoundingClientRect();
        const id = svg.getAttribute('aria-labelledby') || '?';
        const texts = [...svg.querySelectorAll('text')].filter(t => getComputedStyle(t).display !== 'none' && getComputedStyle(t).visibility !== 'hidden' && t.getBoundingClientRect().width > 0 && t.textContent.trim());
        for (const t of texts) { const r = t.getBoundingClientRect();
          if (r.left < sb.left - 1 || r.right > sb.right + 1) out.push(`${id}: outside the figure: "${t.textContent.trim().slice(0,30)}"`); }
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i].getBoundingClientRect(), c = texts[j].getBoundingClientRect();
          const ox = Math.min(a.right, c.right) - Math.max(a.left, c.left), oy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
          if (ox > 2 && oy > Math.min(a.height, c.height) * 0.35) out.push(`${id}: overlap "${texts[i].textContent.trim().slice(0,25)}" × "${texts[j].textContent.trim().slice(0,25)}"`);
        }
      }
      return [...new Set(out)];
    });
    if (hits.length) console.log(vw + ' ' + u + '\n  ' + hits.slice(0, 8).join('\n  '));
  }
  await p.close(); }
  await b.close();
})();

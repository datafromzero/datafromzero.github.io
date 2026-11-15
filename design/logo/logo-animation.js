/**
 * Logo intro animation (GSAP 3.13+, no plugins needed).
 * Usage: playLogo(document.querySelector('svg.logo'))
 * Requires the SVG to contain: circle.disc, path.void, g.bands > path
 * Adds a thin "trace" ring automatically. Returns the GSAP timeline.
 */
import { gsap } from 'gsap';

export function playLogo(svg, { color = 'currentColor' } = {}) {
  if (!svg || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  let trace = svg.querySelector('.trace');
  if (!trace) {
    trace = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    Object.entries({ class: 'trace', cx: 50, cy: 50, r: 46, fill: 'none',
      stroke: color, 'stroke-width': 1.2, transform: 'rotate(-90 50 50)' })
      .forEach(([k, v]) => trace.setAttribute(k, v));
    svg.insertBefore(trace, svg.firstChild);
  }
  const T = trace.getTotalLength();
  trace.style.strokeDasharray = T;

  const disc = svg.querySelector('.disc');
  const voidShape = svg.querySelector('.void');
  const bands = [...svg.querySelectorAll('.bands path')];
  bands.forEach(p => (p.style.strokeDasharray = p.getTotalLength()));
  gsap.set([disc, voidShape], { svgOrigin: '50 50' });

  return gsap.timeline()
    // 1. a thin line of light traces the circle
    .fromTo(trace, { strokeDashoffset: T, opacity: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
    // 2. the disc of light fills in
    .fromTo(disc, { scale: 0 }, { scale: 1, duration: 1, ease: 'expo.out' }, '-=.15')
    .to(trace, { opacity: 0, duration: .3 }, '<.3')
    // 3. the void (the database) opens at the centre
    .fromTo(voidShape, { scaleY: 0, scaleX: .7 }, { scaleY: 1, scaleX: 1, duration: 1, ease: 'expo.out' }, '-=.7')
    // 4. its three layers are traced
    .fromTo(bands, { strokeDashoffset: (i, el) => el.getTotalLength(), opacity: 0 },
                   { strokeDashoffset: 0, opacity: 1, duration: .6, stagger: .12, ease: 'power2.out' }, '-=.35');
}

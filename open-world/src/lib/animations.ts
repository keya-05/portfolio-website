import { gsap } from './gsap';

/**
 * Shared stat-bar reveal: fills [data-stat-fill] from 0 and counts up
 * [data-stat-value] once `trigger` scrolls into view. Call inside useGSAP
 * so the ScrollTriggers are reverted with the component.
 */
export function revealStatBars(scope: Element, trigger: Element) {
  const q = gsap.utils.selector(scope);
  gsap.from(q('[data-stat-fill]'), {
    scaleX: 0,
    duration: 1.1,
    stagger: 0.08,
    ease: 'power4.out',
    scrollTrigger: { trigger, start: 'top 88%', once: true },
  });
  q('[data-stat-value]').forEach((el, i) => {
    const target = Number(el.dataset.statValue);
    const counter = { v: 0 };
    el.textContent = '0';
    gsap.to(counter, {
      v: target,
      duration: 1.1,
      delay: i * 0.08,
      ease: 'power4.out',
      onUpdate: () => {
        el.textContent = String(Math.round(counter.v));
      },
      scrollTrigger: { trigger, start: 'top 88%', once: true },
    });
  });
}

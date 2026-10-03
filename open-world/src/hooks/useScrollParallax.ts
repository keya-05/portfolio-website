import type { RefObject } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Section-scoped parallax: every [data-speed] element inside `scope` drifts on
 * the y axis while the section crosses the viewport. data-speed="0.3" moves
 * 30% of the viewport height over the section's travel (negative = upwards).
 * ScrollTriggers live in the useGSAP context and are reverted on unmount.
 */
export function useScrollParallax(scope: RefObject<HTMLElement>) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      gsap.utils.toArray<HTMLElement>('[data-speed]', scope.current).forEach((el) => {
        const speed = Number(el.dataset.speed) || 0;
        gsap.fromTo(
          el,
          { y: () => -speed * window.innerHeight * 0.5 },
          {
            y: () => speed * window.innerHeight * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: scope.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}

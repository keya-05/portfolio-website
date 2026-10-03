import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * Lenis owns scroll smoothing; GSAP's ticker drives Lenis' RAF so both
 * share a single frame loop, and every Lenis scroll updates ScrollTrigger.
 */
export function initLenis(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

/** Locks page scroll while overlays are open (works with or without Lenis). */
export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/** Smoothly "drives" to a section, hands focus to its heading, then reports arrival. */
export function scrollToSection(id: string, onArrive?: () => void) {
  const el = document.getElementById(id);
  if (!el) {
    onArrive?.();
    return;
  }
  const arrive = () => {
    const heading = el.querySelector<HTMLElement>('[data-section-heading]');
    heading?.focus({ preventScroll: true });
    onArrive?.();
  };
  if (lenis) {
    lenis.scrollTo(el, {
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      force: true,
      onComplete: arrive,
    });
  } else {
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
    // Let a closing overlay restore its focus first, then move focus to the destination.
    window.setTimeout(arrive, 450);
  }
}

import { useMediaQuery } from './useMediaQuery';

/** True when the OS asks for reduced motion: no camera moves, parallax or glitch. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

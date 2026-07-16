import { useEffect } from 'react';
import { initSmoothScroll, releaseSmoothScroll } from '../lib/scroll';
import { useReducedMotion } from './useReducedMotion';

/** Mounted once at the app shell — Lenis smooth scroll runs site-wide. */
export function useSmoothScroll(): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return; // respect prefers-reduced-motion: no eased scroll hijacking
    initSmoothScroll();
    return () => releaseSmoothScroll();
  }, [reducedMotion]);
}

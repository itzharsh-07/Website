import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let refCount = 0;

/**
 * Singleton Lenis instance wired so GSAP's ticker is the single rAF
 * authority — Lenis runs with autoRaf disabled and is driven by
 * gsap.ticker instead. This is the pattern that avoids the "two
 * independent rAF loops fighting" stutter that a naive Lenis+ScrollTrigger
 * wiring produces.
 */
export function initSmoothScroll(): Lenis {
  refCount++;
  if (lenis) return lenis;

  lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function releaseSmoothScroll(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function getLenis(): Lenis | null {
  return lenis;
}

export { gsap, ScrollTrigger };

import { useRef, type MouseEvent } from 'react';
import { gsap } from '../lib/scroll';
import { useReducedMotion } from './useReducedMotion';

interface TiltHandlers<T extends HTMLElement> {
  ref: React.RefObject<T>;
  onMouseMove: (e: MouseEvent<T>) => void;
  onMouseLeave: () => void;
}

/**
 * Subtle 3D tilt that tracks the cursor position across an element — the
 * card turns slightly toward the mouse rather than just lifting on a flat
 * hover. Respects prefers-reduced-motion by doing nothing.
 */
export function useTiltCard<T extends HTMLElement>(maxTiltDeg = 8): TiltHandlers<T> {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  const onMouseMove = (e: MouseEvent<T>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, {
      rotateX: -relY * maxTiltDeg,
      rotateY: relX * maxTiltDeg,
      scale: 1.025,
      y: -6,
      transformPerspective: 700,
      transformOrigin: 'center',
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  return { ref, onMouseMove, onMouseLeave };
}

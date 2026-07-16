import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/scroll';
import { useReducedMotion } from './useReducedMotion';

interface Options {
  /** How strongly layers react to pointer movement — kept subtle by design. */
  strength?: number;
}

/**
 * Subtle multi-layer tilt/parallax on mouse movement within a container.
 * Elements tagged with [data-parallax-depth] move proportionally to that
 * depth value (small numbers = barely moves, larger = more travel).
 */
export function useCursorParallax(containerRef: RefObject<HTMLElement | null>, { strength = 1 }: Options = {}) {
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || reducedMotion) return;

      const layers = Array.from(container.querySelectorAll<HTMLElement>('[data-parallax-depth]'));
      if (!layers.length) return;

      const onMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        layers.forEach((layer) => {
          const depth = Number(layer.dataset.parallaxDepth) || 0;
          gsap.to(layer, {
            x: relX * depth * 20 * strength,
            y: relY * depth * 14 * strength,
            rotateX: -relY * depth * 2 * strength,
            rotateY: relX * depth * 2 * strength,
            duration: 1.1,
            ease: 'power3.out',
          });
        });
      };

      const onLeave = () => {
        layers.forEach((layer) => {
          gsap.to(layer, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' });
        });
      };

      container.addEventListener('mousemove', onMove);
      container.addEventListener('mouseleave', onLeave);
      return () => {
        container.removeEventListener('mousemove', onMove);
        container.removeEventListener('mouseleave', onLeave);
      };
    },
    { dependencies: [reducedMotion], scope: containerRef }
  );
}

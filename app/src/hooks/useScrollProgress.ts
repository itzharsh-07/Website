import { useEffect, useState, type RefObject } from 'react';
import { ScrollTrigger } from '../lib/scroll';

/**
 * Reports which of several section elements is currently most in view,
 * plus an overall 0-1 scroll progress across the full set — powers the
 * right-edge progress tracker.
 */
export function useScrollProgress(sectionRefs: RefObject<HTMLElement | null>[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const triggers = sectionRefs
      .map((ref, index) => {
        const el = ref.current;
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(index);
          },
        });
      })
      .filter((t): t is ScrollTrigger => t !== null);

    const overall = ScrollTrigger.create({
      trigger: sectionRefs[0]?.current ?? document.body,
      endTrigger: sectionRefs[sectionRefs.length - 1]?.current ?? document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setProgress(self.progress),
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      overall.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activeIndex, progress };
}

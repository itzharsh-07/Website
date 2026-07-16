import { type RefObject } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import styles from './ProgressTracker.module.css';

const STEPS = ['Entrance', 'About', 'Collection', 'Consultation'];

interface Props {
  sectionRefs: RefObject<HTMLElement | null>[];
}

export default function ProgressTracker({ sectionRefs }: Props) {
  const { activeIndex, progress } = useScrollProgress(sectionRefs);

  const scrollTo = (index: number) => {
    sectionRefs[index]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={styles.tracker} aria-label="Page progress">
      <div className={styles.line}>
        <div className={styles.fill} style={{ height: `${progress * 100}%` }} />
      </div>
      <ul>
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              className={`${styles.dot} ${i === activeIndex ? styles.active : ''}`}
              onClick={() => scrollTo(i)}
              aria-current={i === activeIndex}
            >
              <span className={styles.label}>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

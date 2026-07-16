import { useEffect, useRef } from 'react';
import styles from './AboutModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: 'Luxury Villas of Design',
    body: 'Every Lumière piece begins as a private commission mindset — sketched, refined, and built as though it were furnishing a single extraordinary home, then made available to yours.',
  },
  {
    title: 'Architectural Philosophy',
    body: 'We design in dialogue with the room, not the trend cycle: solid materials, honest joinery, and proportions that feel considered in ten years as much as today.',
  },
  {
    title: 'Location & Ateliers',
    body: 'Six ateliers across Italy, Denmark, and the American Southeast — each specializing in a material: leather, marble, walnut, wool.',
  },
  {
    title: 'Amenities & Lifestyle',
    body: 'White-glove delivery, a 10-year limited warranty, and a design concierge team available for private consultations on every collection.',
  },
];

export default function AboutModal({ open, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    closeBtnRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="about-modal-title">
      <div className={styles.panel}>
        <button ref={closeBtnRef} className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <span className="eyebrow">Our Story</span>
        <h2 id="about-modal-title" className={styles.title}>
          Furniture as Architecture
        </h2>
        <div className={styles.grid}>
          {SECTIONS.map((s) => (
            <div key={s.title} className={styles.card}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

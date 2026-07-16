import { forwardRef } from 'react';
import styles from './ConsultationCTA.module.css';

interface Props {
  onOpen: () => void;
}

const ConsultationCTA = forwardRef<HTMLElement, Props>(function ConsultationCTA({ onOpen }, ref) {
  return (
    <section ref={ref} className={styles.section} aria-label="Book your private consultation">
      <div className="container textCenter">
        <span className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-accent-soft)' }}>
          By Private Appointment
        </span>
        <h2 className={styles.title}>Step Into the Showroom</h2>
        <p className={styles.sub}>
          Sit with the materials. Feel the craftsmanship. Our design concierge team is ready to guide you.
        </p>
        <button className={styles.cta} onClick={onOpen}>
          <span className={styles.pulse} aria-hidden="true" />
          Book Your Visit
        </button>
      </div>
    </section>
  );
});

export default ConsultationCTA;

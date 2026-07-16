import { useRef, forwardRef, type MutableRefObject } from 'react';
import { useCursorParallax } from '../../hooks/useCursorParallax';
import styles from './HeroVideo.module.css';

interface Props {
  onExploreCollection: () => void;
  onReserveConsultation: () => void;
}

const HeroVideo = forwardRef<HTMLElement, Props>(function HeroVideo(
  { onExploreCollection, onReserveConsultation },
  ref
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useCursorParallax(sectionRef, { strength: 1 });

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={styles.hero}
      aria-label="Lumière — cinematic introduction"
    >
      <div className={styles.mediaLayer} data-parallax-depth="0.6">
        <video
          ref={videoRef}
          className={styles.video}
          src="/media/hero.mp4"
          poster="/media/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className={styles.scrim} />
      </div>

      <div className={`container ${styles.content}`} data-parallax-depth="1.4">
        <span className="eyebrow" style={{ color: 'var(--color-accent-soft)' }}>
          The 2026 Collection
        </span>
        <h1 className={styles.title}>
          Furniture Crafted for <em>Timeless</em> Living
        </h1>
        <p className={styles.desc}>
          Heirloom-quality sofas, beds, and dining pieces made from the finest materials — designed to be lived
          in for generations.
        </p>
        <div className={styles.actions}>
          <button className="btn btnPrimary" onClick={onExploreCollection}>
            Explore the Collection
          </button>
          <button className="btn btnGhostLight" onClick={onReserveConsultation}>
            Reserve a Private Consultation
          </button>
        </div>
      </div>

      <div className={styles.scrollHint} data-parallax-depth="0.4">
        <span>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
});

export default HeroVideo;

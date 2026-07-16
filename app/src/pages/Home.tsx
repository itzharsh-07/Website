import { useRef, useState } from 'react';
import HeroVideo from '../components/home/HeroVideo';
import AboutModal from '../components/home/AboutModal';
import CollectionShowcase from '../components/home/CollectionShowcase';
import ConsultationCTA from '../components/home/ConsultationCTA';
import ConsultationDrawer from '../components/home/ConsultationDrawer';
import ProgressTracker from '../components/home/ProgressTracker';
import AudioToggle from '../components/home/AudioToggle';

export default function Home() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const collectionRef = useRef<HTMLElement>(null);
  const consultationRef = useRef<HTMLElement>(null);

  return (
    <>
      <HeroVideo
        ref={heroRef}
        onExploreCollection={() => collectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onReserveConsultation={() => setConsultationOpen(true)}
      />

      {/* Anchor section for the About step — the modal itself carries the real content. */}
      <section ref={aboutRef} aria-label="About Lumière" style={{ padding: 'var(--space-8) 0', textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Est. 2002
          </span>
          <h2 className="sectionTitle">Two Decades of Craft</h2>
          <p className="sectionSub" style={{ maxWidth: 560, margin: '12px auto 0' }}>
            Lumière began in a single workshop dedicated to one idea: furniture should be made to outlive trends.
          </p>
          <button className="btn btnOutline" style={{ marginTop: 'var(--space-5)' }} onClick={() => setAboutOpen(true)}>
            Explore Our Story
          </button>
        </div>
      </section>

      <CollectionShowcase ref={collectionRef} />

      <ConsultationCTA ref={consultationRef} onOpen={() => setConsultationOpen(true)} />

      <ProgressTracker sectionRefs={[heroRef, aboutRef, collectionRef, consultationRef]} />
      <AudioToggle />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ConsultationDrawer open={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </>
  );
}

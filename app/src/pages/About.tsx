import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import styles from './About.module.css';

export default function About() {
  useDocumentMeta({
    title: 'Our Story | Aura',
    description: 'For over two decades, Aura has crafted heirloom-quality furniture for discerning homes.',
  });

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <img src="/img/1920/1000/workshop?lock=401" alt="Aura workshop" />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="eyebrow">Est. 2002</span>
          <h1 className={styles.heroTitle}>
            Two Decades of <em>Craft</em>
          </h1>
          <p className={styles.heroDesc}>
            Aura began in a single workshop dedicated to one idea: furniture should be made to outlive trends, and
            to be handed down.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="sectionHead left" style={{ maxWidth: 'none' }}>
            <span className="eyebrow">Our Philosophy</span>
            <h2 className="sectionTitle">Built for the Long Term</h2>
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.9, color: 'var(--color-secondary)' }}>
            Every Aura piece begins as a sketch, refined over months with our in-house design studio and a network
            of master artisans across Italy, Denmark and the American Southeast. We work only in solid woods,
            full-grain leathers, hand-honed marble, and metals cast to last — never veneers, never particleboard. The
            result is furniture that ages with dignity: patinas deepen, leathers soften, and grain grows richer with
            every year of use.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.9, color: 'var(--color-secondary)', marginTop: 'var(--space-4)' }}>
            Today, over 120 artisans contribute to the Aura collection, and more than 58,000 homes around the world
            live with pieces we&rsquo;ve made. We remain, as we always have, a company obsessed with the details no
            one else notices — until they live with them.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-hover)' }}>
        <div className="container">
          <div className="statGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)', textAlign: 'center' }}>
            {[
              ['24', 'Years of Craft'],
              ['58,000', 'Homes Furnished'],
              ['120', 'Master Artisans'],
              ['6', 'Global Ateliers'],
            ].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--color-accent)' }}>
                  {num}
                </div>
                <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-secondary)', marginTop: 6 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <span className="eyebrow">What We Value</span>
            <h2 className="sectionTitle">Our Principles</h2>
          </div>
          <div className={styles.principles}>
            <div className="luxuryCard">
              <h3>Material Integrity</h3>
              <p className="textSecondary">Solid woods, full-grain leathers, and natural stone — sourced responsibly, never substituted.</p>
            </div>
            <div className="luxuryCard">
              <h3>Slow Craftsmanship</h3>
              <p className="textSecondary">Each collection takes 12–18 months from sketch to showroom — we don&rsquo;t rush what&rsquo;s meant to last.</p>
            </div>
            <div className="luxuryCard">
              <h3>Quiet Design</h3>
              <p className="textSecondary">We design for the room, not the trend cycle — pieces that feel as considered in ten years as they do today.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="newsletter" style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8) var(--space-6)', textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: 'var(--color-accent-soft)', justifyContent: 'center' }}>
              Visit Us
            </span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(26px, 3vw, 38px)', marginTop: 8 }}>Step Into a Showroom</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 12 }}>
              Experience the materials and craftsmanship in person at one of our six global ateliers.
            </p>
            <Link to="/contact.html" className="btn btnPrimary" style={{ background: 'var(--color-accent)', color: '#111', marginTop: 'var(--space-4)' }}>
              Find a Showroom
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

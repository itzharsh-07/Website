import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import styles from './FAQ.module.css';

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery arrives in 2–4 weeks; Express delivery arrives in 5–7 business days. Every order includes white-glove delivery as an option at checkout, where our team unpacks and places your furniture for you.',
  },
  {
    q: 'What materials do you use?',
    a: 'We work exclusively in solid hardwoods, full-grain leathers, natural marble and stone, and cast or forged metals — never particleboard, veneer, or bonded leather.',
  },
  { q: 'What is your return policy?', a: 'You may return most items within 30 days of delivery for a full refund, provided they are in original condition. See our Shipping & Returns page for full details.' },
  { q: 'Do you offer a warranty?', a: 'Every Aura piece is covered by a 10-year limited warranty against manufacturing defects in materials and construction.' },
  { q: 'Can I customize fabric or finish?', a: 'Select collections offer alternate finishes and upholstery. Reach out to our design concierge team via the Contact page for custom quotes.' },
  { q: 'Do you ship internationally?', a: 'We currently ship within the United States and Canada. International shipping is available on request for select collections — contact our concierge team for a quote.' },
  { q: 'How do I care for leather and wood pieces?', a: 'Each order ships with a care guide specific to its materials. In general, keep wood pieces out of direct sunlight and condition leather every 6–12 months.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
    []
  );

  useDocumentMeta({
    title: 'Frequently Asked Questions | Aura',
    description: 'Answers to common questions about Aura orders, shipping, materials, warranty and returns.',
    jsonLd,
  });

  return (
    <div>
      <div className="pageBanner">
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'center' }}>
            <Link to="/">Home</Link>
            <span className="breadcrumbSep">/</span>
            <span>FAQ</span>
          </div>
          <h1>Frequently Asked Questions</h1>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 820, paddingBottom: 'var(--space-8)' }}>
        {FAQS.map((f, i) => (
          <div key={f.q} className={`${styles.item} ${openIndex === i ? styles.open : ''}`}>
            <button className={styles.question} onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
              {f.q} <span className={styles.icon}>+</span>
            </button>
            <div className={styles.answer}>
              <p>
                {f.a.includes('Shipping & Returns') ? (
                  <>
                    {f.a.split('Shipping & Returns')[0]}
                    <Link to="/returns.html" style={{ textDecoration: 'underline' }}>
                      Shipping &amp; Returns
                    </Link>
                    {f.a.split('Shipping & Returns')[1]}
                  </>
                ) : (
                  f.a
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

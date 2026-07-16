import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import styles from './Contact.module.css';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useDocumentMeta({
    title: 'Contact Us | Lumière',
    description: 'Reach the Lumière design concierge team — showroom visits, trade inquiries, and customer support.',
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.sendContact(form);
      showToast(res.message, 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="pageBanner">
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'center' }}>
            <Link to="/">Home</Link>
            <span className="breadcrumbSep">/</span>
            <span>Contact</span>
          </div>
          <h1>Get in Touch</h1>
          <p>Our design concierge team responds within one business day.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, marginBottom: 'var(--space-4)' }}>Send a Message</h2>
            <form onSubmit={onSubmit}>
              <div className="fieldRow">
                <div className="field">
                  <label>Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label>Subject</label>
                <input type="text" required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea rows={6} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" className="btn btnPrimary btnBlock" disabled={sending}>
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, marginBottom: 'var(--space-4)' }}>Visit or Call</h2>
            <div className={styles.infoRow}>
              <div className={styles.icon}>✉</div>
              <div>
                <strong>Email</strong>
                <p className="textSecondary">concierge@lumiere.example</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.icon}>☎</div>
              <div>
                <strong>Phone</strong>
                <p className="textSecondary">+1 (800) 555-0142 · Mon–Sat, 9am–7pm ET</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.icon}>⌂</div>
              <div>
                <strong>Flagship Showroom</strong>
                <p className="textSecondary">140 Meridian Avenue, New York, NY 10011</p>
              </div>
            </div>
            <div className={styles.infoRow} style={{ borderBottom: 'none' }}>
              <div className={styles.icon}>✎</div>
              <div>
                <strong>Trade &amp; Design Partners</strong>
                <p className="textSecondary">trade@lumiere.example</p>
              </div>
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginTop: 'var(--space-4)', aspectRatio: '16/9' }}>
              <img
                src="/img/800/450/showroom?lock=402"
                alt="Lumière flagship showroom interior"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

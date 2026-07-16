import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import styles from './ConsultationDrawer.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const initialForm = { name: '', email: '', phone: '', date: '', interest: '', notes: '' };

export default function ConsultationDrawer({ open, onClose }: Props) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setSubmitted(false);
    }
  }, [open]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.sendContact({
        name: form.name,
        email: form.email,
        subject: 'Private Consultation Request',
        message: `Phone: ${form.phone}\nPreferred date: ${form.date}\nInterest: ${form.interest}\nNotes: ${form.notes}`,
      });
      showToast(res.message, 'success');
      setSubmitted(true);
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={`${styles.scrim} ${open ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.drawer} ${open ? styles.open : ''}`} role="dialog" aria-modal="true" aria-label="Reserve a private consultation">
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <span className="eyebrow">By Appointment</span>
        <h2 className={styles.title}>Reserve a Private Consultation</h2>
        <p className="textSecondary" style={{ marginBottom: 'var(--space-5)' }}>
          Meet with our design concierge team to explore materials, finishes, and bespoke options in person.
        </p>

        {submitted ? (
          <div className={styles.success}>
            <p>Thank you — our concierge team will reach out within one business day to confirm your visit.</p>
            <button className="btn btnOutline" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="cd-name">Full Name</label>
              <input id="cd-name" type="text" required value={form.name} onChange={update('name')} />
            </div>
            <div className="fieldRow">
              <div className="field">
                <label htmlFor="cd-email">Email</label>
                <input id="cd-email" type="email" required value={form.email} onChange={update('email')} />
              </div>
              <div className="field">
                <label htmlFor="cd-phone">Phone</label>
                <input id="cd-phone" type="tel" required value={form.phone} onChange={update('phone')} />
              </div>
            </div>
            <div className="fieldRow">
              <div className="field">
                <label htmlFor="cd-date">Preferred Date</label>
                <input id="cd-date" type="date" required value={form.date} onChange={update('date')} />
              </div>
              <div className="field">
                <label htmlFor="cd-interest">Collection Interest</label>
                <input id="cd-interest" type="text" placeholder="e.g. Living Room" value={form.interest} onChange={update('interest')} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="cd-notes">Special Request</label>
              <textarea id="cd-notes" rows={3} value={form.notes} onChange={update('notes')} />
            </div>
            <button type="submit" className="btn btnGold btnBlock" disabled={submitting}>
              {submitting ? 'Sending…' : 'Request Consultation'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

import styles from './Stepper.module.css';

const LABELS = ['Shipping', 'Billing', 'Delivery', 'Payment'];

export default function Stepper({ current }: { current: number }) {
  return (
    <div className={styles.steps}>
      {LABELS.map((label, i) => (
        <div key={label} className={`${styles.step} ${i === current ? styles.active : ''} ${i < current ? styles.done : ''}`}>
          <div className={styles.dot}>{i + 1}</div>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}

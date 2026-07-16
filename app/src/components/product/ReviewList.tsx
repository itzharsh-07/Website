import { starString } from '../../lib/format';
import type { ProductReview } from '../../types/product';
import styles from './ReviewList.module.css';

export default function ReviewList({ reviews }: { reviews: ProductReview[] }) {
  return (
    <div>
      {reviews.map((r, i) => (
        <div key={i} className={`luxuryCard ${styles.review}`}>
          <div className={styles.head}>
            <strong>{r.author}</strong>
            <span className="textSecondary">{r.date}</span>
          </div>
          <div className={styles.stars}>{starString(r.rating)}</div>
          <p className={styles.title}>{r.title}</p>
          <p className="textSecondary">{r.text}</p>
        </div>
      ))}
    </div>
  );
}

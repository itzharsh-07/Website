import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/scroll';
import styles from './OrderConfirmation.module.css';

interface Props {
  orderNumber: string;
  estimatedDelivery: string;
}

export default function OrderConfirmation({ orderNumber, estimatedDelivery }: Props) {
  const circleRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGPolylineElement>(null);

  useEffect(() => {
    if (!circleRef.current) return;
    gsap.from(circleRef.current, { scale: 0, duration: 0.6, ease: 'back.out(2)' });
    if (checkRef.current) {
      gsap.from(checkRef.current, { strokeDashoffset: 48, duration: 0.5, delay: 0.35, ease: 'power2.out' });
    }
  }, []);

  return (
    <div className={styles.wrap}>
      <div ref={circleRef} className={styles.circle}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
          <polyline ref={checkRef} points="4,13 9,18 20,6" style={{ strokeDasharray: 48, strokeDashoffset: 0 }} />
        </svg>
      </div>
      <h2 className="sectionTitle">Thank You for Your Order</h2>
      <p className="textSecondary" style={{ marginTop: 8 }}>
        A confirmation email is on its way to you.
      </p>
      <div className={`luxuryCard ${styles.details}`}>
        <div className={styles.row}>
          <span>Order Number</span>
          <strong>{orderNumber}</strong>
        </div>
        <div className={styles.row}>
          <span>Estimated Delivery</span>
          <strong>{estimatedDelivery}</strong>
        </div>
      </div>
      <Link to="/products.html" className="btn btnPrimary">
        Continue Shopping
      </Link>
    </div>
  );
}

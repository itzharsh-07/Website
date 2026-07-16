import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../lib/format';
import styles from './OrderReview.module.css';

const DELIVERY_FEES: Record<string, number> = { standard: 0, express: 89 };

interface Props {
  delivery: string;
  showItems?: boolean;
}

export default function OrderReview({ delivery, showItems = false }: Props) {
  const { items, getTotals } = useCart();
  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');

  const totals = getTotals(appliedPromo);
  const deliveryFee = DELIVERY_FEES[delivery] ?? 0;
  const grandTotal = totals.total + deliveryFee;

  const applyPromo = () => {
    setAppliedPromo(promoInput);
    const valid = promoInput.trim().toUpperCase() === 'LUMIERE10';
    showToast(valid ? '10% discount applied' : 'Promo code not recognized', valid ? 'success' : 'default');
  };

  return (
    <aside className={`luxuryCard ${styles.card}`}>
      <h3 className={styles.title}>Order Summary</h3>

      {showItems && (
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImageWrap}>
                <img src={item.image} alt={item.name} />
                <span className={styles.itemQtyBadge}>{item.qty}</span>
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                {item.color && <div className={styles.itemMeta}>{item.color}</div>}
              </div>
              <div className={styles.itemPrice}>{formatPrice(item.price * item.qty)}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.promoRow}>
        <input type="text" placeholder="Promo code" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
        <button className="btn btnOutline btnSm" onClick={applyPromo}>
          Apply
        </button>
      </div>

      <div className={styles.row}>
        <span>Subtotal</span>
        <span>{formatPrice(totals.subtotal)}</span>
      </div>
      {totals.discount > 0 && (
        <div className={styles.row} style={{ color: 'var(--color-success)' }}>
          <span>Discount</span>
          <span>-{formatPrice(totals.discount)}</span>
        </div>
      )}
      <div className={styles.row}>
        <span>Shipping</span>
        <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
      </div>
      <div className={styles.row}>
        <span>Delivery Upgrade</span>
        <span>{deliveryFee === 0 ? 'Included' : formatPrice(deliveryFee)}</span>
      </div>
      <div className={styles.row}>
        <span>Tax (est.)</span>
        <span>{formatPrice(totals.tax)}</span>
      </div>
      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span>{formatPrice(grandTotal)}</span>
      </div>
    </aside>
  );
}

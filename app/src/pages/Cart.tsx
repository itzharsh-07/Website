import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, FREE_SHIPPING_THRESHOLD } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../lib/format';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, updateQty, removeItem, getTotals } = useCart();
  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');

  const totals = getTotals(appliedPromo);

  const applyPromo = () => {
    setAppliedPromo(promoInput);
    const valid = promoInput.trim().toUpperCase() === 'LUMIERE10';
    showToast(valid ? '10% discount applied' : 'Promo code not recognized', valid ? 'success' : 'default');
  };

  return (
    <div>
      <div className="pageBanner">
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'center' }}>
            <Link to="/">Home</Link>
            <span className="breadcrumbSep">/</span>
            <span>Cart</span>
          </div>
          <h1>Your Cart</h1>
        </div>
      </div>

      <div className="container">
        {items.length === 0 ? (
          <div className={styles.empty}>
            <h2 className="sectionTitle">Your cart is empty</h2>
            <p className="textSecondary" style={{ margin: '16px 0 32px' }}>
              Discover pieces designed to last a lifetime.
            </p>
            <Link to="/products.html" className="btn btnPrimary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div>
              <div className={styles.itemsCard}>
                <div className={styles.head}>
                  <span />
                  <span>Product</span>
                  <span className={styles.colCenter}>Quantity</span>
                  <span className={styles.colRight}>Total</span>
                  <span />
                </div>
                {items.map((item) => (
                  <div key={`${item.id}-${item.color ?? ''}`} className={styles.row}>
                    <div className={styles.topGroup}>
                      <div className={styles.imageWrap}>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className={styles.info}>
                        <div className={styles.name}>{item.name}</div>
                        {item.color && <div className={styles.meta}>Color: {item.color}</div>}
                        <div className={styles.unitPrice}>{formatPrice(item.price)} each</div>
                      </div>
                      <button className={styles.deleteIcon} onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                        ✕
                      </button>
                    </div>
                    <div className={styles.bottomGroup}>
                      <div className={styles.qty}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                          +
                        </button>
                      </div>
                      <div className={styles.lineTotal}>{formatPrice(item.price * item.qty)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-5)' }}>
                <Link to="/products.html" className="btn btnOutline btnSm">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            <aside className="luxuryCard">
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, marginBottom: 'var(--space-3)' }}>Order Summary</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-4)' }}>
                <input
                  type="text"
                  placeholder="Coupon code (try LUMIERE10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}
                />
                <button className="btn btnOutline btnSm" onClick={applyPromo}>
                  Apply
                </button>
              </div>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className={styles.summaryRow} style={{ color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (est.)</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Grand Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
              <p className="textSecondary" style={{ fontSize: 12, margin: 'var(--space-3) 0' }}>
                Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}. White-glove delivery available at
                checkout.
              </p>
              <Link to="/checkout.html" className="btn btnPrimary btnBlock">
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

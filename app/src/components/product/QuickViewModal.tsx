import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice, starString } from '../../lib/format';
import { toAddableItem } from '../../lib/productAdapters';
import type { Product } from '../../types/product';
import styles from './QuickViewModal.module.css';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { addToCart } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (product) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;
  const p = product;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={p.name}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className={styles.image}>
          <img src={p.images[0]} alt={p.name} />
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{p.category}</span>
          <h3>{p.name}</h3>
          <div className={styles.rating}>
            <span className={styles.stars}>{starString(p.rating)}</span>
            <span>
              {p.rating} ({p.reviewCount} reviews)
            </span>
          </div>
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(p.priceFinal)}</span>
            {p.discount > 0 && <span className={styles.strike}>{formatPrice(p.price)}</span>}
          </div>
          <p className={styles.desc}>{p.shortDescription}</p>
          <div className={styles.actions}>
            <button className="btn btnPrimary" onClick={() => addToCart(toAddableItem(p), 1)}>
              Add to Cart
            </button>
            <Link to={`/product-details.html?slug=${p.slug}`} className="btn btnOutline" onClick={onClose}>
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

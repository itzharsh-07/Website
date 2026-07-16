import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTiltCard } from '../../hooks/useTiltCard';
import { formatPrice, starString } from '../../lib/format';
import { toAddableItem } from '../../lib/productAdapters';
import type { Product } from '../../types/product';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product: p, onQuickView }: Props) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(p.id);
  const tilt = useTiltCard<HTMLElement>();

  return (
    <article ref={tilt.ref} className={styles.card} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
      <div className={styles.media}>
        <Link to={`/product-details.html?slug=${p.slug}`} aria-label={p.name}>
          <img src={p.images[0]} alt={p.name} loading="lazy" />
          {p.images[1] && <img className={styles.imgAlt} src={p.images[1]} alt="" loading="lazy" />}
        </Link>
        <div className={styles.badges}>
          {p.badges.includes('sale') && <span className={`${styles.badge} ${styles.sale}`}>-{p.discount}%</span>}
          {p.badges.includes('new') && <span className={`${styles.badge} ${styles.new}`}>New</span>}
          {p.badges.includes('bestseller') && <span className={`${styles.badge} ${styles.bestseller}`}>Bestseller</span>}
          {p.stock <= 5 && <span className={`${styles.badge} ${styles.stock}`}>Only {p.stock} left</span>}
        </div>
        <div className={styles.quickActions}>
          <button
            className={wishlisted ? styles.active : ''}
            onClick={() => toggleWishlist(p)}
            aria-label="Toggle wishlist"
            title="Wishlist"
          >
            ♥
          </button>
          {onQuickView && (
            <button onClick={() => onQuickView(p)} aria-label="Quick view" title="Quick view">
              ⤢
            </button>
          )}
        </div>
        <button className={styles.addToCartSlide} onClick={() => addToCart(toAddableItem(p), 1)}>
          Add to Cart
        </button>
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{p.category}</span>
        <Link to={`/product-details.html?slug=${p.slug}`}>
          <h3 className={styles.name}>{p.name}</h3>
        </Link>
        <div className={styles.rating}>
          <span className={styles.stars}>{starString(p.rating)}</span>
          <span>
            {p.rating} ({p.reviewCount})
          </span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(p.priceFinal)}</span>
          {p.discount > 0 && <span className={styles.strike}>{formatPrice(p.price)}</span>}
        </div>
      </div>
    </article>
  );
}

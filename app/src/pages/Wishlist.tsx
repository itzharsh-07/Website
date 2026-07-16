import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div>
      <div className="pageBanner">
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'center' }}>
            <Link to="/">Home</Link>
            <span className="breadcrumbSep">/</span>
            <span>Wishlist</span>
          </div>
          <h1>Your Wishlist</h1>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--space-8)' }}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <h2 className="sectionTitle">Your wishlist is empty</h2>
            <p className="textSecondary" style={{ margin: '16px 0 32px' }}>
              Save the pieces you&rsquo;re dreaming about.
            </p>
            <Link to="/products.html" className="btn btnPrimary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div>
            {items.map((item) => (
              <div key={item.id} className={styles.row}>
                <Link to={`/product-details.html?slug=${item.slug}`}>
                  <img src={item.image} alt={item.name} />
                </Link>
                <div>
                  <Link to={`/product-details.html?slug=${item.slug}`} style={{ fontWeight: 600 }}>
                    {item.name}
                  </Link>
                  <div className="textSecondary" style={{ fontSize: 13 }}>
                    {item.category}
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>{formatPrice(item.price)}</div>
                <button
                  className="btn btnPrimary btnSm"
                  onClick={() => {
                    addToCart(item, 1);
                    removeFromWishlist(item.id);
                  }}
                >
                  Move to Cart
                </button>
                <button className="btnIcon" onClick={() => removeFromWishlist(item.id)} aria-label="Remove">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

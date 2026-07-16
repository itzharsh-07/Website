import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchOverlay from './SearchOverlay';
import MobileNav from './MobileNav';
import styles from './Navbar.module.css';

const NAV_LINKS: [string, string][] = [
  ['/', 'Home'],
  ['/products.html', 'Shop'],
  ['/products.html#collections', 'Collections'],
  ['/products.html?sort=newest', 'New Arrivals'],
  ['/products.html?sort=popularity', 'Best Sellers'],
  ['/about.html', 'About'],
  ['/contact.html', 'Contact'],
];

interface Props {
  /** Home renders its own transparent-over-video header state; every other page forces the solid header. */
  forceSolid?: boolean;
}

export default function Navbar({ forceSolid = false }: Props) {
  const [solid, setSolid] = useState(forceSolid);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    if (forceSolid) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [forceSolid]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${solid ? styles.solid : ''}`}>
        <div className={`container ${styles.inner}`}>
          <Link to="/" className={styles.logo} aria-label="Lumière home">
            <svg width="140" height="34" viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#C89B3C" />
                  <stop offset="100%" stopColor="#E4CE9A" />
                </linearGradient>
              </defs>
              <path d="M20 6 L23.5 17.5 L35 20 L23.5 22.5 L20 34 L16.5 22.5 L5 20 L16.5 17.5 Z" fill="url(#navGold)" />
              <text x="44" y="27" fontFamily="'Playfair Display', Georgia, serif" fontSize="22" fill="currentColor">
                Lumière
              </text>
            </svg>
          </Link>

          <nav className={styles.mainNav} aria-label="Main">
            {NAV_LINKS.map(([to, label]) => (
              <Link
                key={label}
                to={to}
                className={`${styles.navLink} ${location.pathname + location.hash === to ? styles.active : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <button className={`${styles.iconBtn} ${styles.searchOnlyDesktop}`} onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
            <Link to="/wishlist.html" className={`${styles.iconBtn} ${styles.badge}`} aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              {wishlistItems.length > 0 && <span className={styles.count}>{wishlistItems.length}</span>}
            </Link>
            <Link to="/cart.html" className={`${styles.iconBtn} ${styles.badge}`} aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              {itemCount > 0 && <span className={styles.count}>{itemCount}</span>}
            </Link>
            <Link to="/login.html" className={styles.iconBtn} aria-label="Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
              </svg>
            </Link>
            <button className={`${styles.iconBtn} ${styles.menuToggle}`} onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

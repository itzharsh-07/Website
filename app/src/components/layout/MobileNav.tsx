import { Link } from 'react-router-dom';
import styles from './MobileNav.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LINKS: [string, string][] = [
  ['/', 'Home'],
  ['/products.html', 'Shop'],
  ['/products.html?sort=newest', 'New Arrivals'],
  ['/products.html?sort=popularity', 'Best Sellers'],
  ['/about.html', 'About'],
  ['/contact.html', 'Contact'],
  ['/wishlist.html', 'Wishlist'],
  ['/cart.html', 'Cart'],
];

export default function MobileNav({ open, onClose }: Props) {
  return (
    <>
      <div className={`${styles.scrim} ${open ? styles.open : ''}`} onClick={onClose} />
      <nav className={`${styles.drawer} ${open ? styles.open : ''}`} aria-label="Mobile">
        <button className={styles.close} onClick={onClose} aria-label="Close menu">
          ✕
        </button>
        {LINKS.map(([to, label]) => (
          <Link key={to} to={to} onClick={onClose}>
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}

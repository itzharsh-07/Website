import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              Lumière
            </Link>
            <p>A premium furniture house crafting timeless, heirloom-quality pieces for considered living.</p>
            <div className={styles.social}>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">IG</span>
                <span className="srOnly">Instagram</span>
              </a>
              <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">PI</span>
                <span className="srOnly">Pinterest</span>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">FB</span>
                <span className="srOnly">Facebook</span>
              </a>
            </div>
          </div>
          <div className={styles.col}>
            <h3>Shop</h3>
            <Link to="/products.html?category=Living%20Room">Living Room</Link>
            <Link to="/products.html?category=Bedroom">Bedroom</Link>
            <Link to="/products.html?category=Dining">Dining</Link>
            <Link to="/products.html?category=Office">Office</Link>
            <Link to="/products.html?category=Outdoor">Outdoor</Link>
          </div>
          <div className={styles.col}>
            <h3>Company</h3>
            <Link to="/about.html">About Us</Link>
            <Link to="/contact.html">Contact</Link>
            <Link to="/faq.html">FAQ</Link>
            <Link to="/admin.html">Trade &amp; Admin</Link>
          </div>
          <div className={styles.col}>
            <h3>Support</h3>
            <Link to="/returns.html">Shipping &amp; Returns</Link>
            <Link to="/faq.html">Help Center</Link>
            <Link to="/privacy-policy.html">Privacy Policy</Link>
            <Link to="/terms.html">Terms of Service</Link>
          </div>
          <div className={styles.col}>
            <h3>Contact</h3>
            <a href="mailto:concierge@lumiere.example">concierge@lumiere.example</a>
            <a href="tel:+18005550142">+1 (800) 555-0142</a>
            <span>140 Meridian Ave, New York, NY</span>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Lumière Furniture Co. All rights reserved.</span>
          <div className={styles.payments}>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

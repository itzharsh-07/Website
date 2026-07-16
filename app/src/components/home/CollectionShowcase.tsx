import { useEffect, useRef, useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/scroll';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { toAddableItem } from '../../lib/productAdapters';
import { useCart } from '../../context/CartContext';
import { useTiltCard } from '../../hooks/useTiltCard';
import type { Product } from '../../types/product';
import styles from './CollectionShowcase.module.css';

function ShowcaseCard({ product: p }: { product: Product }) {
  const { addToCart } = useCart();
  const tilt = useTiltCard<HTMLElement>(6);

  return (
    <article ref={tilt.ref} className={styles.card} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
      <div className={styles.image}>
        <img src={p.images[0]} alt={p.name} loading="lazy" />
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{p.category}</span>
        <h3>{p.name}</h3>
        <ul className={styles.highlights}>
          <li>{p.material}</li>
          <li>
            {p.dimensions.width}&Prime;W × {p.dimensions.depth}&Prime;D
          </li>
          <li>{p.color}</li>
        </ul>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(p.priceFinal)}</span>
          {p.discount > 0 && <span className={styles.strike}>{formatPrice(p.price)}</span>}
        </div>
        <div className={styles.actions}>
          <Link to={`/product-details.html?slug=${p.slug}`} className="btn btnOutline btnSm">
            View Piece
          </Link>
          <button className="btn btnPrimary btnSm" onClick={() => addToCart(toAddableItem(p), 1)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

const CollectionShowcase = forwardRef<HTMLElement>(function CollectionShowcase(_props, ref) {
  const [products, setProducts] = useState<Product[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getProducts({ sort: 'popularity', limit: 6 }).then((data) => setProducts(data.products));
  }, []);

  useGSAP(
    () => {
      const cards = listRef.current?.querySelectorAll<HTMLElement>(`.${styles.card}`);
      if (!cards?.length) return;
      cards.forEach((card, i) => {
        const fromSide = i % 2 === 0 ? -80 : 80;
        gsap.fromTo(
          card,
          { opacity: 0, x: fromSide },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          }
        );
      });
    },
    { dependencies: [products], scope: listRef }
  );

  return (
    <section ref={ref} className={styles.section} aria-label="Featured collection">
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Handpicked</span>
          <h2 className="sectionTitle">The Featured Collection</h2>
          <p className="sectionSub">A curated edit of our most coveted designs this season.</p>
        </div>

        <div ref={listRef} className={styles.list}>
          {products.map((p) => (
            <ShowcaseCard key={p.id} product={p} />
          ))}
        </div>

        <div className="textCenter" style={{ marginTop: 'var(--space-6)' }}>
          <Link to="/products.html" className="btn btnOutline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
});

export default CollectionShowcase;

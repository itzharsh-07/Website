import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { formatPrice, starString } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { toAddableItem } from '../lib/productAdapters';
import ProductGallery from '../components/product/ProductGallery';
import ProductGrid from '../components/product/ProductGrid';
import SpecsTable from '../components/product/SpecsTable';
import ReviewList from '../components/product/ReviewList';
import type { Product } from '../types/product';
import styles from './ProductDetails.module.css';

const RECENTLY_VIEWED_KEY = 'aura_recently_viewed';

interface RecentlyViewedItem {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
}

function pushRecentlyViewed(product: Product): RecentlyViewedItem[] {
  let list: RecentlyViewedItem[] = [];
  try {
    list = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    if (!Array.isArray(list)) list = [];
  } catch {
    list = [];
  }
  list = list.filter((p) => p.slug !== product.slug);
  list.unshift({ id: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.priceFinal });
  list = list.slice(0, 8);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  return list.filter((p) => p.slug !== product.slug);
}

type Tab = 'specs' | 'shipping' | 'reviews';

export default function ProductDetails() {
  const [params] = useSearchParams();
  const slug = params.get('slug');
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('specs');

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setQty(1);
    setTab('specs');
    if (!slug) {
      setNotFound(true);
      return;
    }
    api
      .getProduct(slug)
      .then((data) => {
        setProduct(data.product);
        setRelated(data.related);
        setRecentlyViewed(pushRecentlyViewed(data.product));
        window.scrollTo({ top: 0 });
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  const jsonLd = useMemo(() => {
    if (!product) return undefined;
    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: product.images,
      description: product.description,
      sku: product.sku,
      brand: { '@type': 'Brand', name: 'Aura' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.priceFinal,
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount },
    };
  }, [product]);

  useDocumentMeta({
    title: product ? `${product.name} | Aura` : undefined,
    description: product?.shortDescription,
    jsonLd,
  });

  if (notFound) {
    return (
      <div className="container section">
        <p>Product not found.</p>
        <Link to="/products.html" className="btn btnOutline">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 'var(--header-h)' }}>
        <div className={styles.layout}>
          <div className="skeleton" style={{ aspectRatio: '1/1.05' }} />
          <div className="skeleton" style={{ height: 400 }} />
        </div>
      </div>
    );
  }

  const p = product;
  const wishlisted = isWishlisted(p.id);

  const shareLinks: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(p.name)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(location.href)}&media=${encodeURIComponent(p.images[0])}&description=${encodeURIComponent(p.name)}`,
  };

  return (
    <div>
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumbSep">/</span>
          <Link to="/products.html">Shop</Link>
          <span className="breadcrumbSep">/</span>
          <span>{p.name}</span>
        </div>

        <div className={styles.layout}>
          <ProductGallery images={p.images} productName={p.name} />

          <div>
            <span className="eyebrow" style={{ marginBottom: 0 }}>
              {p.category}
            </span>
            <h1 style={{ fontSize: 32, marginTop: 6 }}>{p.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <span style={{ color: 'var(--color-accent)' }}>{starString(p.rating)}</span>
              <span className="textSecondary">
                {p.rating} · {p.reviewCount} reviews · SKU {p.sku}
              </span>
            </div>
            <div style={{ fontSize: 22, marginTop: 'var(--space-4)', display: 'flex', gap: 10, alignItems: 'baseline' }}>
              <span style={{ fontWeight: 600 }}>{formatPrice(p.priceFinal)}</span>
              {p.discount > 0 && (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'var(--color-secondary)', fontSize: 16 }}>
                    {formatPrice(p.price)}
                  </span>
                  <span style={{ color: 'var(--color-danger)', fontSize: 14, fontWeight: 600 }}>-{p.discount}%</span>
                </>
              )}
            </div>
            <p className="textSecondary" style={{ marginTop: 'var(--space-4)', lineHeight: 1.7 }}>
              {p.description}
            </p>
            <p style={{ fontWeight: 600, marginTop: 'var(--space-3)', color: p.inStock ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {p.inStock ? `In Stock — ${p.stock} available` : 'Out of Stock'}
            </p>

            <div className={styles.qtyRow}>
              <div className={styles.stepper}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>
            <div className={styles.actions}>
              <button className="btn btnPrimary btnBlock" onClick={() => addToCart(toAddableItem(p), qty)} disabled={!p.inStock}>
                Add to Cart
              </button>
              <Link to="/checkout.html" className="btn btnOutline btnBlock" onClick={() => addToCart(toAddableItem(p), qty)}>
                Buy Now
              </Link>
            </div>
            <div className={styles.secondaryRow}>
              <button
                className="btnIcon"
                onClick={() => toggleWishlist(p)}
                aria-label="Add to wishlist"
                style={wishlisted ? { background: 'var(--color-accent)' } : undefined}
              >
                ♥
              </button>
              <div className={`${styles.shareRow} textSecondary`}>
                <span style={{ fontSize: 12 }}>Share:</span>
                {Object.entries(shareLinks).map(([platform, url]) => (
                  <button key={platform} onClick={() => window.open(url, '_blank', 'noopener')}>
                    {platform[0].toUpperCase() + platform.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.tabs} role="tablist">
              <button className={`${styles.tab} ${tab === 'specs' ? styles.active : ''}`} onClick={() => setTab('specs')}>
                Specifications
              </button>
              <button className={`${styles.tab} ${tab === 'shipping' ? styles.active : ''}`} onClick={() => setTab('shipping')}>
                Shipping &amp; Delivery
              </button>
              <button className={`${styles.tab} ${tab === 'reviews' ? styles.active : ''}`} onClick={() => setTab('reviews')}>
                Reviews
              </button>
            </div>
            <div className={styles.tabPanel}>
              {tab === 'specs' && <SpecsTable product={p} />}
              {tab === 'shipping' && (
                <p className="textSecondary" style={{ lineHeight: 1.8 }}>
                  Every Aura piece ships with white-glove delivery available at checkout — our team unpacks, places, and
                  removes all packaging. Standard delivery arrives in 2–4 weeks; expedited options are available at
                  checkout. All items are covered under our 10-year limited warranty.
                </p>
              )}
              {tab === 'reviews' && <ReviewList reviews={p.reviews} />}
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--color-hover)' }}>
        <div className="container">
          <div className="sectionHead left" style={{ maxWidth: 'none' }}>
            <span className="eyebrow">You May Also Like</span>
            <h2 className="sectionTitle">Related Products</h2>
          </div>
          <ProductGrid products={related} />
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sectionHead left" style={{ maxWidth: 'none' }}>
              <span className="eyebrow">Your History</span>
              <h2 className="sectionTitle">Recently Viewed</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
              {recentlyViewed.map((item) => (
                <Link
                  key={item.slug}
                  to={`/product-details.html?slug=${item.slug}`}
                  className="luxuryCard"
                  style={{ display: 'block', padding: 0, overflow: 'hidden' }}
                >
                  <div style={{ aspectRatio: '1/1.1' }}>
                    <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: 'var(--space-4)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>{item.name}</h3>
                    <div style={{ fontWeight: 600, marginTop: 6 }}>{formatPrice(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

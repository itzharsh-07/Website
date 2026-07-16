import ProductCard from './ProductCard';
import type { Product } from '../../types/product';
import styles from './ProductGrid.module.css';

interface Props {
  products: Product[];
  loading?: boolean;
  onQuickView?: (product: Product) => void;
  columns?: 3 | 4;
}

export default function ProductGrid({ products, loading, onQuickView, columns = 4 }: Props) {
  if (loading) {
    return (
      <div className={`${styles.grid} ${columns === 3 ? styles.cols3 : ''}`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.skeletonCard}`} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return <p className={styles.empty}>No products match these filters yet — try widening your search.</p>;
  }

  return (
    <div className={`${styles.grid} ${columns === 3 ? styles.cols3 : ''}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

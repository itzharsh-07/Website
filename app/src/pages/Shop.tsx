import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import ProductGrid from '../components/product/ProductGrid';
import FiltersSidebar, { type FilterState } from '../components/product/FiltersSidebar';
import QuickViewModal from '../components/product/QuickViewModal';
import type { MetaResponse, Product } from '../types/product';
import styles from './Shop.module.css';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filters: FilterState = useMemo(
    () => ({
      category: searchParams.get('category') || '',
      collection: searchParams.get('collection') || '',
      material: searchParams.get('material') || '',
      min: searchParams.get('min') || '',
      max: searchParams.get('max') || '',
    }),
    [searchParams]
  );
  const sort = searchParams.get('sort') || '';
  const query = searchParams.get('q') || '';

  useEffect(() => {
    api.getMeta().then(setMeta);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts({ ...filters, sort: sort as never, q: query })
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [filters, sort, query]);

  const searchDebounce = useRef<ReturnType<typeof setTimeout>>();

  const updateParams = useCallback(
    (next: Partial<FilterState & { sort: string; q: string }>) => {
      const merged = { ...filters, sort, q: query, ...next };
      const params = new URLSearchParams();
      Object.entries(merged).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      setSearchParams(params);
    },
    [filters, sort, query, setSearchParams]
  );

  return (
    <div>
      <div className="pageBanner">
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'center' }}>
            <Link to="/">Home</Link>
            <span className="breadcrumbSep">/</span>
            <span>Shop</span>
          </div>
          <h1>Shop All Furniture</h1>
          <p>Every category, every collection — filtered your way.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <FiltersSidebar
            meta={meta}
            filters={filters}
            onChange={(f) => updateParams(f)}
            onClear={() => setSearchParams(new URLSearchParams())}
          />

          <div>
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <input
                  className={styles.search}
                  type="text"
                  placeholder="Search within results…"
                  defaultValue={query}
                  onChange={(e) => {
                    const value = e.target.value;
                    clearTimeout(searchDebounce.current);
                    searchDebounce.current = setTimeout(() => updateParams({ q: value }), 300);
                  }}
                />
                <span className={styles.resultsCount}>{total} products</span>
              </div>
              <select className={styles.sort} value={sort} onChange={(e) => updateParams({ sort: e.target.value })}>
                <option value="">Sort: Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>

            <ProductGrid products={products} loading={loading} onQuickView={setQuickViewProduct} />
          </div>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import type { Product } from '../../types/product';
import styles from './SearchOverlay.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
    else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.getProducts({ q: query, limit: 6 });
        setResults(data.products);
      } catch {
        setResults([]);
      }
    }, 220);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className={`${styles.overlay} ${open ? styles.open : ''}`} role="dialog" aria-modal="true" aria-label="Search">
      <div className={styles.panel}>
        <div className={styles.inputRow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search sofas, beds, tables…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button onClick={onClose} aria-label="Close search">
            ✕
          </button>
        </div>
        <div className={styles.suggestions}>
          {query && results.length === 0 && (
            <p className={styles.empty}>No results for &ldquo;{query}&rdquo;</p>
          )}
          {results.map((p) => (
            <Link key={p.id} to={`/product-details.html?slug=${p.slug}`} className={styles.suggestion} onClick={onClose}>
              <img src={p.images[0]} alt={p.name} loading="lazy" />
              <span className={styles.name}>{p.name}</span>
              <span className={styles.price}>{formatPrice(p.priceFinal)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

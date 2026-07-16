import { useEffect, useState } from 'react';
import { formatPrice } from '../../lib/format';
import type { MetaResponse } from '../../types/product';
import styles from './FiltersSidebar.module.css';

export interface FilterState {
  category: string;
  collection: string;
  material: string;
  min: string;
  max: string;
}

interface Props {
  meta: MetaResponse | null;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

export default function FiltersSidebar({ meta, filters, onChange, onClear }: Props) {
  const rangeMin = meta ? Math.floor(meta.priceRange.min / 50) * 50 : 0;
  const rangeMax = meta ? Math.ceil(meta.priceRange.max / 50) * 50 : 5000;

  const [localMin, setLocalMin] = useState(filters.min || String(rangeMin));
  const [localMax, setLocalMax] = useState(filters.max || String(rangeMax));

  useEffect(() => {
    if (meta && !filters.min && !filters.max) {
      setLocalMin(String(rangeMin));
      setLocalMax(String(rangeMax));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  if (!meta) return <aside className={styles.sidebar} />;

  const commitPrice = (min: string, max: string) => {
    const clampedMin = Math.min(Number(min), Number(max));
    onChange({ ...filters, min: String(clampedMin), max });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Filters</h3>
        <button className={styles.clear} onClick={onClear}>
          Clear all
        </button>
      </div>

      <div className={styles.group}>
        <h4>Category</h4>
        {meta.categories.map((c) => (
          <label key={c} className={styles.check}>
            <input
              type="radio"
              name="category"
              checked={filters.category === c}
              onChange={() => onChange({ ...filters, category: c })}
            />
            {c}
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <h4>Collection</h4>
        <div className={styles.pills}>
          {meta.collections.map((c) => (
            <button
              key={c}
              className={`tagPill ${filters.collection === c ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, collection: filters.collection === c ? '' : c })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h4>Material</h4>
        {meta.materials.map((m) => (
          <label key={m} className={styles.check}>
            <input
              type="checkbox"
              checked={filters.material === m}
              onChange={() => onChange({ ...filters, material: filters.material === m ? '' : m })}
            />
            {m}
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <h4>Price Range</h4>
        <div className={styles.priceLabels}>
          <span>{formatPrice(Number(localMin))}</span>
          <span>{formatPrice(Number(localMax))}</span>
        </div>
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          onMouseUp={() => commitPrice(localMin, localMax)}
          onTouchEnd={() => commitPrice(localMin, localMax)}
        />
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          onMouseUp={() => commitPrice(localMin, localMax)}
          onTouchEnd={() => commitPrice(localMin, localMax)}
          style={{ marginTop: 8 }}
        />
      </div>
    </aside>
  );
}

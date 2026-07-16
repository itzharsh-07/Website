import { useState } from 'react';
import styles from './ProductGallery.module.css';

interface Props {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className={styles.main}>
        <img src={images[active]} alt={productName} />
      </div>
      <div className={styles.thumbs}>
        {images.map((img, i) => (
          <button
            key={img}
            className={`${styles.thumb} ${i === active ? styles.active : ''}`}
            onClick={() => setActive(i)}
            aria-label={`View ${productName} image ${i + 1}`}
          >
            <img src={img} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

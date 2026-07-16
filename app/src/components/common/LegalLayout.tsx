import type { ReactNode } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import styles from './LegalLayout.module.css';

interface Props {
  title: string;
  subtitle?: string;
  metaTitle: string;
  metaDescription: string;
  children: ReactNode;
}

export default function LegalLayout({ title, subtitle, metaTitle, metaDescription, children }: Props) {
  useDocumentMeta({ title: metaTitle, description: metaDescription });

  return (
    <div>
      <div className="pageBanner">
        <div className="container">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className={`container ${styles.content}`} style={{ maxWidth: 820, paddingBottom: 'var(--space-8)' }}>
        {children}
      </div>
    </div>
  );
}

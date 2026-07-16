import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  /** JSON-LD structured data object(s) to inject as <script type="application/ld+json">. */
  jsonLd?: object | object[];
}

const DEFAULT_TITLE = 'Lumière | Furniture Crafted for Timeless Living';

/** Sets document title/meta description and injects JSON-LD for the current route, cleaning up on unmount. */
export function useDocumentMeta({ title, description, jsonLd }: MetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    let descTag: HTMLMetaElement | null = null;
    let prevDescription: string | null = null;
    if (description) {
      descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      prevDescription = descTag.getAttribute('content');
      descTag.setAttribute('content', description);
    }

    const scripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      entries.forEach((entry) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(entry);
        document.head.appendChild(script);
        scripts.push(script);
      });
    }

    return () => {
      document.title = prevTitle;
      if (descTag && prevDescription !== null) descTag.setAttribute('content', prevDescription);
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, jsonLd]);
}

export { DEFAULT_TITLE };

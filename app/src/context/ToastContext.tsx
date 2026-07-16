import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import styles from './ToastContext.module.css';

interface Toast {
  id: number;
  message: string;
  type: 'default' | 'success';
  visible: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: 'default' | 'success') => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: 'default' | 'success' = 'default') => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, message, type, visible: false }]);
    // flip to visible on next frame so the CSS transform transition runs
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)));
      });
    });
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.type === 'success' ? styles.success : ''} ${t.visible ? styles.visible : ''}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

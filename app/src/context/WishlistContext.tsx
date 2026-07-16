import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { WishlistItem } from '../types/cart';
import type { Product } from '../types/product';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'aura_wishlist';

type Action = { type: 'TOGGLE'; item: WishlistItem } | { type: 'REMOVE'; id: number };

function isWishlistItem(value: unknown): value is WishlistItem {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.slug === 'string' &&
    typeof v.name === 'string' &&
    typeof v.image === 'string' &&
    typeof v.price === 'number'
  );
}

function loadInitialWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWishlistItem);
  } catch {
    return [];
  }
}

function reducer(state: WishlistItem[], action: Action): WishlistItem[] {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.some((i) => i.id === action.item.id);
      return exists ? state.filter((i) => i.id !== action.item.id) : [...state, action.item];
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadInitialWishlist);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      isWishlisted: (id) => items.some((i) => i.id === id),
      toggleWishlist: (product) => {
        const wasWishlisted = items.some((i) => i.id === product.id);
        dispatch({
          type: 'TOGGLE',
          item: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            price: product.priceFinal,
            category: product.category,
          },
        });
        showToast(
          wasWishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
          wasWishlisted ? 'default' : 'success'
        );
      },
      removeFromWishlist: (id) => dispatch({ type: 'REMOVE', id }),
    }),
    [items, showToast]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}

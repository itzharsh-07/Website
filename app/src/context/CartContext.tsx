import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartItem, CartTotals } from '../types/cart';
import { useToast } from './ToastContext';

// Deliberately minimal — decouples the cart from the full Product shape so
// callers with partial data (e.g. a WishlistItem) can add to cart too.
export interface AddableItem {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  color?: string | null;
}

const STORAGE_KEY = 'lumiere_cart';
const SHIPPING_FLAT = 45;
const FREE_SHIPPING_THRESHOLD = 1500;
const TAX_RATE = 0.0725;

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'UPDATE_QTY'; id: number; qty: number }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.slug === 'string' &&
    typeof v.name === 'string' &&
    typeof v.image === 'string' &&
    typeof v.price === 'number' &&
    typeof v.qty === 'number'
  );
}

// Defensive against malformed/legacy localStorage content — a returning
// visitor with stale or corrupted data must never crash the app on mount.
function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.item.id && i.color === action.item.color);
      if (existing) {
        return state.map((i) => (i === existing ? { ...i, qty: i.qty + action.item.qty } : i));
      }
      return [...state, action.item];
    }
    case 'UPDATE_QTY':
      return state.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i));
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addToCart: (item: AddableItem, qty?: number) => void;
  updateQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getTotals: (promoCode?: string) => CartTotals;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadInitialCart);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      addToCart: (item, qty = 1) => {
        dispatch({
          type: 'ADD',
          item: {
            id: item.id,
            slug: item.slug,
            name: item.name,
            image: item.image,
            price: item.price,
            color: item.color ?? null,
            qty,
          },
        });
        showToast(`${item.name} added to cart`, 'success');
      },
      updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      getTotals: (promoCode?: string) => {
        const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
        const discount = promoCode?.toUpperCase() === 'LUMIERE10' ? subtotal * 0.1 : 0;
        const taxable = Math.max(0, subtotal - discount);
        const tax = taxable * TAX_RATE;
        return { subtotal, shipping, discount, tax, total: taxable + tax + shipping };
      },
    }),
    [items, itemCount, showToast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD };

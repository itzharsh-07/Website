// Shapes match the existing localStorage schema (lumiere_cart / lumiere_wishlist)
// exactly, so a visitor's cart/wishlist from the previous vanilla-JS site keeps working.

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string | null;
  qty: number;
}

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

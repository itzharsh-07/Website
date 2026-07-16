import type { Product } from '../types/product';
import type { AddableItem } from '../context/CartContext';

/** Maps a full Product into the minimal shape Cart/Wishlist actually need. */
export function toAddableItem(product: Product): AddableItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    price: product.priceFinal,
    color: product.color ?? null,
  };
}

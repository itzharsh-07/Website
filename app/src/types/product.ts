export interface ProductReview {
  author: string;
  rating: number;
  date: string;
  title: string;
  text: string;
}

export interface ProductColor {
  name: string;
  hex: string | null;
}

export interface ProductDimensions {
  width: number;
  depth: number;
  height: number;
  unit: string;
}

export type ProductBadge = 'sale' | 'new' | 'bestseller';

export interface Product {
  id: number;
  sku: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  collection: string;
  material: string;
  color: string;
  price: number;
  discount: number;
  priceFinal: number;
  images: string[];
  description: string;
  shortDescription: string;
  dimensions: ProductDimensions;
  weight: string;
  warranty: string;
  shippingInfo: string;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  badges: ProductBadge[];
  colors: ProductColor[];
  tags: string[];
}

export interface ProductListResponse {
  total: number;
  products: Product[];
  categories: string[];
  collections: string[];
}

export interface ProductDetailResponse {
  product: Product;
  related: Product[];
}

export interface MetaResponse {
  categories: string[];
  collections: string[];
  materials: string[];
  colors: string[];
  priceRange: { min: number; max: number };
}

export interface ProductQuery {
  category?: string;
  collection?: string;
  material?: string;
  sort?: 'price-low' | 'price-high' | 'popularity' | 'newest' | '';
  q?: string;
  min?: number | string;
  max?: number | string;
  limit?: number;
}

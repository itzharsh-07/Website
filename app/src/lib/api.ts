import type {
  ProductListResponse,
  ProductDetailResponse,
  MetaResponse,
  ProductQuery,
} from '../types/product';

// Every call is a relative URL so it works identically proxied-through-Vite
// in dev and same-origin in production — never hardcode a host/port here.

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

function buildQuery(query: ProductQuery = {}): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  getProducts: (query?: ProductQuery) =>
    getJson<ProductListResponse>(`/api/products${buildQuery(query)}`),

  getProduct: (slug: string) => getJson<ProductDetailResponse>(`/api/products/${slug}`),

  getMeta: () => getJson<MetaResponse>('/api/meta'),

  placeOrder: (payload: { cart: unknown; delivery: string; payment: string }) =>
    postJson<{ success: boolean; orderNumber: string; estimatedDelivery: string }>(
      '/api/orders',
      payload
    ),

  sendContact: (payload: { name: string; email: string; subject?: string; message: string }) =>
    postJson<{ success: boolean; message: string }>('/api/contact', payload),

  subscribeNewsletter: (email: string) =>
    postJson<{ success: boolean; message: string }>('/api/newsletter', { email }),
};

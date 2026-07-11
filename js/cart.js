/**
 * cart.js — localStorage-backed shopping cart, shared across all pages.
 * Cart item shape: { id, slug, name, image, price, color, qty }
 */
(function () {
  'use strict';

  const KEY = 'lumiere_cart';
  const SHIPPING_FLAT = 45;
  const FREE_SHIPPING_THRESHOLD = 1500;
  const TAX_RATE = 0.0725;

  function getCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    updateCartBadge();
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
  }
  function addToCart(product, qty = 1) {
    const cart = getCart();
    const existing = cart.find((i) => i.id === product.id && i.color === (product.color || null));
    if (existing) existing.qty += qty;
    else {
      cart.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images ? product.images[0] : product.image,
        price: product.priceFinal ?? product.price,
        color: product.color || null,
        qty,
      });
    }
    saveCart(cart);
    window.showToast?.(`${product.name} added to cart`, 'success');
  }
  function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
  function removeItem(id) {
    saveCart(getCart().filter((i) => i.id !== id));
  }
  function clearCart() { saveCart([]); }

  function getSubtotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  }
  function getItemCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }
  function getTotals(promo) {
    const subtotal = getSubtotal();
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    let discount = 0;
    if (promo && promo.toUpperCase() === 'LUMIERE10') discount = subtotal * 0.1;
    const taxable = Math.max(0, subtotal - discount);
    const tax = taxable * TAX_RATE;
    const total = taxable + tax + shipping;
    return { subtotal, shipping, discount, tax, total };
  }

  function updateCartBadge() {
    document.querySelectorAll('#cartCount').forEach((el) => { el.textContent = getItemCount(); });
  }

  document.addEventListener('DOMContentLoaded', updateCartBadge);

  window.Cart = { getCart, addToCart, updateQty, removeItem, clearCart, getSubtotal, getItemCount, getTotals, FREE_SHIPPING_THRESHOLD };
})();

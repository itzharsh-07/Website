/**
 * wishlist.js — localStorage-backed wishlist, shared across all pages.
 */
(function () {
  'use strict';

  const KEY = 'lumiere_wishlist';

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function saveWishlist(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    updateWishlistBadge();
    document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { list } }));
  }
  function isWishlisted(id) {
    return getWishlist().some((i) => i.id === id);
  }
  function toggleWishlist(product) {
    const list = getWishlist();
    const idx = list.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      list.splice(idx, 1);
      saveWishlist(list);
      window.showToast?.(`${product.name} removed from wishlist`);
      return false;
    }
    list.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images ? product.images[0] : product.image,
      price: product.priceFinal ?? product.price,
      category: product.category,
    });
    saveWishlist(list);
    window.showToast?.(`${product.name} added to wishlist`, 'success');
    return true;
  }
  function removeFromWishlist(id) {
    saveWishlist(getWishlist().filter((i) => i.id !== id));
  }

  function updateWishlistBadge() {
    document.querySelectorAll('#wishlistCount').forEach((el) => { el.textContent = getWishlist().length; });
  }

  document.addEventListener('DOMContentLoaded', updateWishlistBadge);

  window.Wishlist = { getWishlist, toggleWishlist, isWishlisted, removeFromWishlist };
})();

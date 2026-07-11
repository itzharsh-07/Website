/**
 * app.js — global site behaviour shared by every page:
 * header scroll state, mobile nav, search overlay, toasts,
 * magnetic buttons, newsletter form, footer year, badge counts.
 */
(function () {
  'use strict';

  window.Lumiere = window.Lumiere || {};

  /* ---------------- Loader ---------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loaderScreen');
    if (loader) setTimeout(() => loader.classList.add('is-hidden'), 350);
  });

  /* ---------------- Sticky header ---------------- */
  const header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-solid');
    else if (!header.dataset.forceSolid) header.classList.remove('is-solid');
  }
  if (header) {
    if (header.dataset.forceSolid) header.classList.add('is-solid');
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Mobile nav ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const scrim = document.getElementById('scrim');
  function closeMobileNav() {
    mobileNav?.classList.remove('is-open');
    scrim?.classList.remove('is-open');
  }
  menuToggle?.addEventListener('click', () => {
    mobileNav?.classList.add('is-open');
    scrim?.classList.add('is-open');
  });
  scrim?.addEventListener('click', () => {
    closeMobileNav();
    closeSearch();
  });
  document.getElementById('mobileNavClose')?.addEventListener('click', closeMobileNav);

  /* ---------------- Search overlay ---------------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchSuggestions');
  const searchClose = document.getElementById('searchClose');

  function openSearch() {
    searchOverlay?.classList.add('is-open');
    scrim?.classList.add('is-open');
    setTimeout(() => searchInput?.focus(), 150);
  }
  function closeSearch() {
    searchOverlay?.classList.remove('is-open');
    if (!mobileNav?.classList.contains('is-open')) scrim?.classList.remove('is-open');
  }
  searchToggle?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeMobileNav(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  });

  let searchDebounce;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    const q = e.target.value.trim();
    if (!q) { searchResults.innerHTML = ''; return; }
    searchDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`);
        const data = await res.json();
        renderSearchResults(data.products, q);
      } catch (err) { /* silent — network hiccup */ }
    }, 220);
  });

  function renderSearchResults(products, q) {
    if (!searchResults) return;
    if (!products.length) {
      searchResults.innerHTML = `<p class="text-secondary" style="padding:16px 10px;">No results for "${escapeHtml(q)}"</p>`;
      return;
    }
    searchResults.innerHTML = products
      .map(
        (p) => `
      <a class="search-suggestion" href="product-details.html?slug=${p.slug}">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
        <span class="name">${p.name}</span>
        <span class="price">$${p.priceFinal.toLocaleString()}</span>
      </a>`
      )
      .join('');
  }

  /* ---------------- Toasts ---------------- */
  function ensureToastContainer() {
    let el = document.querySelector('.toast-container');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast-container';
      document.body.appendChild(el);
    }
    return el;
  }
  window.showToast = function showToast(message, type = 'default') {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 350);
    }, 2600);
  };

  /* ---------------- Newsletter ---------------- */
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (!email) return;
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        showToast(data.message || 'Subscribed!', 'success');
        form.reset();
      } catch (err) {
        showToast('Something went wrong. Please try again.');
      }
    });
  });

  /* ---------------- Magnetic buttons ---------------- */
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });

  /* ---------------- Active nav link ---------------- */
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`[data-nav="${page}"]`).forEach((a) => a.classList.add('active'));
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------------- Utility: escape ---------------- */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  window.Lumiere.escapeHtml = escapeHtml;
  window.Lumiere.formatPrice = (n) => `$${Math.round(Number(n)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  window.Lumiere.starString = (rating) => {
    const full = Math.round(rating);
    return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
  };
})();

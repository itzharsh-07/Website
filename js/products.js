/**
 * products.js — product data fetching + rendering for grids, listing/filter page,
 * and the product-details page. Shared card markup + delegated cart/wishlist actions.
 */
(function () {
  'use strict';

  const cache = new Map(); // slug -> product

  function badgeHtml(p) {
    const out = [];
    if (p.badges.includes('sale')) out.push(`<span class="badge badge-sale">-${p.discount}%</span>`);
    if (p.badges.includes('new')) out.push(`<span class="badge badge-new">New</span>`);
    if (p.badges.includes('bestseller')) out.push(`<span class="badge badge-bestseller">Bestseller</span>`);
    if (p.stock <= 5) out.push(`<span class="badge badge-stock">Only ${p.stock} left</span>`);
    return out.join('');
  }

  function priceHtml(p) {
    if (p.discount) {
      return `<span class="price">${Lumiere.formatPrice(p.priceFinal)}</span>
              <span class="price-strike">${Lumiere.formatPrice(p.price)}</span>
              <span class="price-discount">-${p.discount}%</span>`;
    }
    return `<span class="price">${Lumiere.formatPrice(p.priceFinal)}</span>`;
  }

  function productCardHtml(p, index = 0) {
    cache.set(p.slug, p);
    const wishActive = window.Wishlist?.isWishlisted(p.id) ? 'is-active' : '';
    return `
    <article class="product-card reveal" data-product-id="${p.id}" style="transition-delay:${(index % 4) * 40}ms">
      <div class="product-media">
        <a href="product-details.html?slug=${p.slug}" aria-label="${Lumiere.escapeHtml(p.name)}">
          <img src="${p.images[0]}" alt="${Lumiere.escapeHtml(p.name)}" loading="lazy" />
          <img class="img-alt" src="${p.images[1] || p.images[0]}" alt="" loading="lazy" />
        </a>
        <div class="product-badges">${badgeHtml(p)}</div>
        <div class="product-quick-actions">
          <button class="js-wishlist ${wishActive}" data-id="${p.id}" aria-label="Toggle wishlist" title="Wishlist">♥</button>
          <button class="js-quickview" data-slug="${p.slug}" aria-label="Quick view" title="Quick view">⤢</button>
        </div>
        <button class="add-to-cart-slide js-add-cart" data-id="${p.id}">Add to Cart</button>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <a href="product-details.html?slug=${p.slug}"><h3 class="product-name">${p.name}</h3></a>
        <div class="product-rating">
          <span class="stars">${Lumiere.starString(p.rating)}</span>
          <span>${p.rating} (${p.reviewCount})</span>
        </div>
        <div class="product-price-row">${priceHtml(p)}</div>
      </div>
    </article>`;
  }

  function renderGrid(el, products) {
    if (!el) return;
    if (!products.length) {
      el.innerHTML = `<p class="text-secondary" style="grid-column:1/-1;padding:40px 0;">No products match these filters yet — try widening your search.</p>`;
      return;
    }
    el.innerHTML = products.map((p, i) => productCardHtml(p, i)).join('');
    revealCards(el.querySelectorAll('.reveal'));
  }

  // Cards are injected after GSAP's initial ScrollTrigger scan, so they'd
  // otherwise stay stuck at the .reveal class's default opacity:0. Animate
  // them in directly instead of relying on scroll-triggered registration.
  function revealCards(cards) {
    if (!cards || !cards.length) return;
    if (window.gsap) {
      gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 });
    } else {
      cards.forEach((c) => { c.style.opacity = 1; c.style.transform = 'none'; });
    }
  }

  /* ---------------- Delegated card actions (works on every page) ---------------- */
  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.js-wishlist');
    const cartBtn = e.target.closest('.js-add-cart');
    const qvBtn = e.target.closest('.js-quickview');

    if (wishBtn) {
      e.preventDefault();
      const id = Number(wishBtn.dataset.id);
      const product = [...cache.values()].find((p) => p.id === id);
      if (product) {
        const active = window.Wishlist.toggleWishlist(product);
        document.querySelectorAll(`.js-wishlist[data-id="${id}"]`).forEach((b) => b.classList.toggle('is-active', active));
      }
    }
    if (cartBtn) {
      e.preventDefault();
      const id = Number(cartBtn.dataset.id);
      const product = [...cache.values()].find((p) => p.id === id);
      if (product) window.Cart.addToCart(product, 1);
    }
    if (qvBtn) {
      e.preventDefault();
      openQuickView(qvBtn.dataset.slug);
    }
  });

  /* ---------------- Quick view modal ---------------- */
  let qvModal;
  function ensureQuickViewModal() {
    if (qvModal) return qvModal;
    qvModal = document.createElement('div');
    qvModal.className = 'search-overlay';
    qvModal.id = 'quickViewOverlay';
    qvModal.innerHTML = `<div class="search-panel" style="width:min(920px,94vw);padding:0;overflow:hidden;">
      <div id="quickViewBody" style="display:grid;grid-template-columns:1fr 1fr;"></div>
      <button id="quickViewClose" class="btn-icon" style="position:absolute;top:16px;right:16px;">✕</button>
    </div>`;
    document.body.appendChild(qvModal);
    qvModal.addEventListener('click', (e) => { if (e.target === qvModal) closeQuickView(); });
    qvModal.querySelector('#quickViewClose').addEventListener('click', closeQuickView);
    return qvModal;
  }
  function closeQuickView() { qvModal?.classList.remove('is-open'); }
  async function openQuickView(slug) {
    const modal = ensureQuickViewModal();
    const body = modal.querySelector('#quickViewBody');
    body.innerHTML = `<div class="skeleton" style="height:420px;"></div><div style="padding:32px;"><div class="skeleton" style="height:24px;width:60%;margin-bottom:12px;"></div><div class="skeleton" style="height:16px;width:40%;"></div></div>`;
    modal.classList.add('is-open');
    let product = cache.get(slug);
    if (!product) {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      product = data.product;
    }
    body.innerHTML = `
      <div style="position:relative;aspect-ratio:1/1.1;">
        <img src="${product.images[0]}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="padding:40px;">
        <span class="product-cat">${product.category}</span>
        <h3 style="font-family:var(--font-heading);font-size:26px;margin:8px 0;">${product.name}</h3>
        <div class="product-rating" style="margin-bottom:12px;"><span class="stars">${Lumiere.starString(product.rating)}</span><span>${product.rating} (${product.reviewCount} reviews)</span></div>
        <div class="product-price-row" style="margin-bottom:16px;">${priceHtml(product)}</div>
        <p class="text-secondary" style="font-size:14px;margin-bottom:24px;">${product.shortDescription}</p>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary js-add-cart" data-id="${product.id}">Add to Cart</button>
          <a class="btn btn-outline" href="product-details.html?slug=${product.slug}">View Details</a>
        </div>
      </div>`;
  }

  /* ================================================================
     HOME PAGE sections
     ================================================================ */
  async function initHome() {
    const featuredEl = document.getElementById('featuredGrid');
    const newEl = document.getElementById('newArrivalsTrack');
    const bestEl = document.getElementById('bestSellersTrack');
    if (!featuredEl && !newEl && !bestEl) return;

    const [featured, fresh, best] = await Promise.all([
      fetch('/api/products?limit=8').then((r) => r.json()),
      fetch('/api/products?sort=newest&limit=8').then((r) => r.json()),
      fetch('/api/products?sort=popularity&limit=8').then((r) => r.json()),
    ]);
    renderGrid(featuredEl, featured.products);
    renderGrid(newEl, fresh.products);
    renderGrid(bestEl, best.products);
    window.LumiereAnim?.refresh();
  }

  /* ================================================================
     PRODUCTS LISTING PAGE (filters + sort)
     ================================================================ */
  async function initProductsPage() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const params = new URLSearchParams(location.search);
    const state = {
      category: params.get('category') || '',
      collection: params.get('collection') || '',
      material: params.get('material') || '',
      sort: params.get('sort') || '',
      q: params.get('q') || '',
      min: '',
      max: '',
    };

    const meta = await fetch('/api/meta').then((r) => r.json());
    buildFilterUI(meta, state);

    async function refresh() {
      const qs = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => { if (v) qs.set(k, v); });
      grid.innerHTML = Array.from({ length: 8 }).map(() => `<div class="skeleton" style="aspect-ratio:1/1.3;"></div>`).join('');
      const data = await fetch(`/api/products?${qs.toString()}`).then((r) => r.json());
      document.getElementById('resultsCount') && (document.getElementById('resultsCount').textContent = `${data.total} products`);
      renderGrid(grid, data.products);
      window.LumiereAnim?.refresh();
    }

    function buildFilterUI(meta, state) {
      const catWrap = document.getElementById('filterCategory');
      const colWrap = document.getElementById('filterCollection');
      const matWrap = document.getElementById('filterMaterial');
      const sortSel = document.getElementById('sortSelect');
      const priceMin = document.getElementById('priceMin');
      const priceMax = document.getElementById('priceMax');
      const priceMinLabel = document.getElementById('priceMinLabel');
      const priceMaxLabel = document.getElementById('priceMaxLabel');
      const clearBtn = document.getElementById('clearFilters');

      const rangeMin = Math.floor(meta.priceRange.min / 50) * 50;
      const rangeMax = Math.ceil(meta.priceRange.max / 50) * 50;

      if (catWrap) {
        catWrap.innerHTML = meta.categories
          .map((c) => `<label class="filter-check"><input type="radio" name="category" value="${c}" ${state.category === c ? 'checked' : ''}/> ${c}</label>`)
          .join('');
      }
      if (colWrap) {
        colWrap.innerHTML = meta.collections
          .map((c) => `<button class="tag-pill ${state.collection === c ? 'active' : ''}" data-collection="${c}">${c}</button>`)
          .join('');
      }
      if (matWrap) {
        matWrap.innerHTML = meta.materials
          .map((m) => `<label class="filter-check"><input type="checkbox" name="material" value="${m}" ${state.material === m ? 'checked' : ''}/> ${m}</label>`)
          .join('');
      }
      if (priceMin && priceMax) {
        priceMin.min = priceMax.min = rangeMin;
        priceMin.max = priceMax.max = rangeMax;
        priceMin.value = rangeMin;
        priceMax.value = rangeMax;
        priceMinLabel.textContent = Lumiere.formatPrice(rangeMin);
        priceMaxLabel.textContent = Lumiere.formatPrice(rangeMax);
        const onPrice = () => {
          if (Number(priceMin.value) > Number(priceMax.value)) priceMin.value = priceMax.value;
          state.min = priceMin.value; state.max = priceMax.value;
          priceMinLabel.textContent = Lumiere.formatPrice(priceMin.value);
          priceMaxLabel.textContent = Lumiere.formatPrice(priceMax.value);
          refresh();
        };
        priceMin.addEventListener('change', onPrice);
        priceMax.addEventListener('change', onPrice);
      }

      catWrap?.addEventListener('change', (e) => { state.category = e.target.value; refresh(); });
      matWrap?.addEventListener('change', () => {
        const checked = [...matWrap.querySelectorAll('input:checked')].map((i) => i.value);
        state.material = checked[0] || '';
        refresh();
      });
      colWrap?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-collection]');
        if (!btn) return;
        state.collection = state.collection === btn.dataset.collection ? '' : btn.dataset.collection;
        colWrap.querySelectorAll('.tag-pill').forEach((b) => b.classList.toggle('active', b.dataset.collection === state.collection));
        refresh();
      });
      sortSel && (sortSel.value = state.sort);
      sortSel?.addEventListener('change', (e) => { state.sort = e.target.value; refresh(); });
      clearBtn?.addEventListener('click', () => {
        Object.assign(state, { category: '', collection: '', material: '', sort: '', q: '', min: '', max: '' });
        buildFilterUI(meta, state);
        refresh();
      });

      const search = document.getElementById('productSearchInline');
      if (search) {
        search.value = state.q;
        let t;
        search.addEventListener('input', (e) => {
          clearTimeout(t);
          t = setTimeout(() => { state.q = e.target.value; refresh(); }, 300);
        });
      }
    }

    refresh();
  }

  /* ================================================================
     PRODUCT DETAILS PAGE
     ================================================================ */
  function pushRecentlyViewed(product) {
    const KEY = 'lumiere_recently_viewed';
    let list = [];
    try { list = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
    list = list.filter((p) => p.slug !== product.slug);
    list.unshift({ id: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.priceFinal });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 8)));
    return list.filter((p) => p.slug !== product.slug);
  }

  async function initProductDetails() {
    const root = document.getElementById('productDetailsRoot');
    if (!root) return;
    const slug = new URLSearchParams(location.search).get('slug');
    if (!slug) { root.innerHTML = '<p>Product not found.</p>'; return; }

    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) { root.innerHTML = '<p>Product not found.</p>'; return; }
    const { product, related } = await res.json();
    cache.set(product.slug, product);

    document.title = `${product.name} | Lumière`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', product.shortDescription);
    const bc = document.getElementById('breadcrumbCurrent');
    if (bc) bc.textContent = product.name;

    document.getElementById('galleryMain').innerHTML = `<img id="galleryMainImg" src="${product.images[0]}" alt="${product.name}" />`;
    document.getElementById('galleryThumbs').innerHTML = product.images
      .map((img, i) => `<button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-img="${img}"><img src="${img}" alt="${product.name} view ${i + 1}" /></button>`)
      .join('');
    document.getElementById('galleryThumbs').addEventListener('click', (e) => {
      const btn = e.target.closest('.gallery-thumb');
      if (!btn) return;
      document.getElementById('galleryMainImg').src = btn.dataset.img;
      document.querySelectorAll('.gallery-thumb').forEach((b) => b.classList.toggle('active', b === btn));
    });

    document.getElementById('pdCategory').textContent = product.category;
    document.getElementById('pdName').textContent = product.name;
    document.getElementById('pdSku').textContent = product.sku;
    document.getElementById('pdStars').textContent = Lumiere.starString(product.rating);
    document.getElementById('pdRatingText').textContent = `${product.rating} · ${product.reviewCount} reviews`;
    document.getElementById('pdPrice').innerHTML = priceHtml(product);
    document.getElementById('pdDescription').textContent = product.description;
    document.getElementById('pdStock').textContent = product.inStock ? `In Stock — ${product.stock} available` : 'Out of Stock';
    document.getElementById('pdStock').style.color = product.inStock ? 'var(--color-success)' : 'var(--color-danger)';

    const specsEl = document.getElementById('pdSpecs');
    if (specsEl) {
      specsEl.innerHTML = `
        <tr><th>Material</th><td>${product.material}</td></tr>
        <tr><th>Color</th><td>${product.color}</td></tr>
        <tr><th>Dimensions</th><td>${product.dimensions.width}"W x ${product.dimensions.depth}"D x ${product.dimensions.height}"H</td></tr>
        <tr><th>Weight</th><td>${product.weight}</td></tr>
        <tr><th>Warranty</th><td>${product.warranty}</td></tr>
        <tr><th>Shipping</th><td>${product.shippingInfo}</td></tr>
        <tr><th>SKU</th><td>${product.sku}</td></tr>`;
    }
    const reviewsEl = document.getElementById('pdReviews');
    if (reviewsEl) {
      reviewsEl.innerHTML = product.reviews
        .map(
          (r) => `<div class="luxury-card" style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;"><strong>${r.author}</strong><span class="text-secondary">${r.date}</span></div>
            <div class="stars" style="margin:6px 0;">${Lumiere.starString(r.rating)}</div>
            <p style="font-weight:600;margin-bottom:4px;">${r.title}</p>
            <p class="text-secondary">${r.text}</p>
          </div>`
        )
        .join('');
    }

    // quantity selector
    let qty = 1;
    const qtyEl = document.getElementById('pdQty');
    document.getElementById('qtyMinus')?.addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; });
    document.getElementById('qtyPlus')?.addEventListener('click', () => { qty = Math.min(product.stock, qty + 1); qtyEl.textContent = qty; });

    document.getElementById('pdAddCart')?.addEventListener('click', () => window.Cart.addToCart(product, qty));
    document.getElementById('pdBuyNow')?.addEventListener('click', () => { window.Cart.addToCart(product, qty); location.href = 'checkout.html'; });
    const wishBtn = document.getElementById('pdWishlist');
    if (wishBtn) {
      wishBtn.classList.toggle('is-active', window.Wishlist.isWishlisted(product.id));
      wishBtn.addEventListener('click', () => {
        const active = window.Wishlist.toggleWishlist(product);
        wishBtn.classList.toggle('is-active', active);
      });
    }
    document.querySelectorAll('.js-share').forEach((btn) => {
      btn.addEventListener('click', () => {
        const url = encodeURIComponent(location.href);
        const platform = btn.dataset.share;
        const links = {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          twitter: `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(product.name)}`,
          pinterest: `https://pinterest.com/pin/create/button/?url=${url}&media=${encodeURIComponent(product.images[0])}&description=${encodeURIComponent(product.name)}`,
        };
        if (links[platform]) window.open(links[platform], '_blank', 'noopener');
      });
    });

    // tabs
    document.querySelectorAll('.pd-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pd-tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.pd-tab-panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
      });
    });

    // related products
    const relatedEl = document.getElementById('relatedGrid');
    if (relatedEl) renderGrid(relatedEl, related);

    // recently viewed
    const rv = pushRecentlyViewed(product);
    const rvEl = document.getElementById('recentlyViewedGrid');
    if (rvEl) {
      if (!rv.length) { document.getElementById('recentlyViewedSection')?.setAttribute('style', 'display:none'); }
      else rvEl.innerHTML = rv.map((p) => `
        <a class="product-card" href="product-details.html?slug=${p.slug}" style="display:block;">
          <div class="product-media"><img src="${p.image}" alt="${p.name}" loading="lazy" /></div>
          <div class="product-info"><h3 class="product-name">${p.name}</h3><div class="price">${Lumiere.formatPrice(p.price)}</div></div>
        </a>`).join('');
    }

    window.LumiereAnim?.refresh();

    // Product schema.org JSON-LD
    const ld = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: product.images,
      description: product.description,
      sku: product.sku,
      brand: { '@type': 'Brand', name: 'Lumière' },
      offers: {
        '@type': 'Offer',
        url: location.href,
        priceCurrency: 'USD',
        price: product.priceFinal,
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount },
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHome();
    initProductsPage();
    initProductDetails();
  });

  window.LumiereProducts = { productCardHtml, renderGrid, cache };
})();

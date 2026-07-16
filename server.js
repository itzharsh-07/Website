/**
 * Aura — Express server.
 * Serves the static site and a small demo API (products, orders, contact, newsletter).
 */
const express = require('express');
const path = require('path');
const { products, CATEGORIES, COLLECTIONS, productImageDescriptors } = require('./data/products');
const { registerImageRoute, warmCache } = require('./image-cache');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

app.use(express.json());
registerImageRoute(app);

// Hashed build assets (dist/assets/*) are immutable and cached for a year;
// everything else — critically index.html, the SPA shell — must never be
// cached, or a returning visitor can get stuck on a shell that references
// bundle hashes from a previous deploy.
app.use(
  express.static(DIST_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.startsWith(path.join(DIST_DIR, 'assets') + path.sep)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// Site-wide decorative imagery (hero, category cards, gallery, etc.), kept in
// sync with the /img URLs referenced directly in the HTML templates.
const STATIC_IMAGE_DESCRIPTORS = [
  { w: 1200, h: 630, keyword: 'interior', lock: 901 },
  { w: 1920, h: 1200, keyword: 'livingroom', lock: 100 },
  { w: 600, h: 800, keyword: 'livingroom', lock: 201 },
  { w: 600, h: 800, keyword: 'bedroom', lock: 202 },
  { w: 600, h: 800, keyword: 'diningroom', lock: 203 },
  { w: 600, h: 800, keyword: 'homeoffice', lock: 204 },
  { w: 600, h: 800, keyword: 'patio', lock: 205 },
  { w: 600, h: 800, keyword: 'livingroom', lock: 301 },
  { w: 600, h: 500, keyword: 'diningroom', lock: 302 },
  { w: 600, h: 900, keyword: 'bedroom', lock: 303 },
  { w: 600, h: 650, keyword: 'homeoffice', lock: 304 },
  { w: 600, h: 780, keyword: 'patio', lock: 305 },
  { w: 600, h: 560, keyword: 'homedecor', lock: 306 },
  { w: 600, h: 860, keyword: 'sofa', lock: 307 },
  { w: 600, h: 620, keyword: 'bedroom', lock: 308 },
  { w: 1920, h: 1000, keyword: 'workshop', lock: 401 },
  { w: 800, h: 450, keyword: 'showroom', lock: 402 },
];

// Warm the image cache in the background so real visitors rarely hit a cold
// upstream fetch; failures fall back gracefully at request time regardless.
warmCache([...STATIC_IMAGE_DESCRIPTORS, ...productImageDescriptors(products)], 4).then(({ fetchedNow, alreadyWarm, unreachable, total }) => {
  console.log(`Image cache warm: ${alreadyWarm} already cached, ${fetchedNow} fetched now, ${unreachable} unreachable (of ${total})`);
});

// ---------- API: products ----------
app.get('/api/products', (req, res) => {
  const { category, collection, material, sort, q, min, max, limit } = req.query;
  let list = [...products];

  if (category) list = list.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  if (collection) list = list.filter((p) => p.collection.toLowerCase() === String(collection).toLowerCase());
  if (material) list = list.filter((p) => p.material.toLowerCase() === String(material).toLowerCase());
  if (min) list = list.filter((p) => p.priceFinal >= Number(min));
  if (max) list = list.filter((p) => p.priceFinal <= Number(max));
  if (q) {
    const needle = String(q).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.subcategory.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.includes(needle))
    );
  }

  switch (sort) {
    case 'price-low':
      list.sort((a, b) => a.priceFinal - b.priceFinal);
      break;
    case 'price-high':
      list.sort((a, b) => b.priceFinal - a.priceFinal);
      break;
    case 'popularity':
      list.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'newest':
      list.sort((a, b) => b.id - a.id);
      break;
    default:
      break;
  }

  if (limit) list = list.slice(0, Number(limit));

  res.json({ total: list.length, products: list, categories: CATEGORIES, collections: COLLECTIONS });
});

app.get('/api/products/:slug', (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const related = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 4);
  res.json({ product, related });
});

app.get('/api/meta', (req, res) => {
  const materials = [...new Set(products.map((p) => p.material))];
  const colors = [...new Set(products.map((p) => p.color))];
  const priceRange = products.reduce(
    (acc, p) => ({ min: Math.min(acc.min, p.priceFinal), max: Math.max(acc.max, p.priceFinal) }),
    { min: Infinity, max: 0 }
  );
  res.json({ categories: CATEGORIES, collections: COLLECTIONS, materials, colors, priceRange });
});

// ---------- API: demo order / contact / newsletter (no persistence, no real payment) ----------
app.post('/api/orders', (req, res) => {
  const orderNumber = `AUR-${Date.now().toString().slice(-8)}`;
  const eta = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000);
  res.json({
    success: true,
    orderNumber,
    estimatedDelivery: eta.toISOString().slice(0, 10),
  });
});

app.post('/api/contact', (req, res) => {
  res.json({ success: true, message: 'Thank you — our design concierge will respond within one business day.' });
});

app.post('/api/newsletter', (req, res) => {
  res.json({ success: true, message: 'You are on the list. Welcome to Aura.' });
});

// ---------- SEO ----------
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const base = `${req.protocol}://${req.get('host')}`;
  const staticPages = [
    '', 'products.html', 'about.html', 'contact.html', 'faq.html',
    'privacy-policy.html', 'terms.html', 'returns.html', 'wishlist.html', 'cart.html',
  ];
  const urls = staticPages
    .map((p) => `<url><loc>${base}/${p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
    .join('');
  const productUrls = products
    .map((p) => `<url><loc>${base}/product-details.html?slug=${p.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`)
    .join('');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}${productUrls}</urlset>`);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const base = `${req.protocol}://${req.get('host')}`;
  res.send(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml`);
});

// ---------- SPA fallback ----------
// Any remaining GET that isn't a static asset or one of the routes above is
// a client-side route (e.g. /products.html, /product-details.html?slug=...)
// — serve the SPA shell and let React Router take over. Deliberately
// path-less rather than app.get('*', ...): Express 5's stricter
// path-to-regexp rejects a bare '*' wildcard, so this form stays correct
// regardless of Express major version.
app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.accepts('html')) return next();
  res.sendFile(INDEX_HTML, (err) => {
    if (err) next(err);
  });
});

app.listen(PORT, () => {
  console.log(`Aura running at http://localhost:${PORT}`);
});

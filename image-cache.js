/**
 * image-cache.js — server-side proxy/cache for themed product photography.
 * Fetches keyword-matched images from LoremFlickr once, caches them to disk,
 * and permanently caches a reliable placeholder instead if the upstream ever
 * fails — so every request after warmup is an instant local disk read, with
 * no live network calls (and therefore no live-request slowdowns) at all.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const CACHE_DIR = path.join(__dirname, 'cache', 'images');

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function cacheFilePath(w, h, keyword, lock) {
  const safe = String(keyword).replace(/[^a-z0-9,]/gi, '');
  return path.join(CACHE_DIR, `${safe}-${w}x${h}-${lock}.jpg`);
}

async function fetchAndSave(url, filepath, timeoutMs) {
  const res = await fetchWithTimeout(url, timeoutMs);
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fsp.mkdir(CACHE_DIR, { recursive: true });
  await fsp.writeFile(filepath, buf);
}

/** Ensures a cache file exists on disk, trying the themed source once, then
 * permanently caching a generic fallback so this descriptor never triggers
 * a slow live fetch again. */
async function ensureCached(w, h, keyword, lock) {
  const filepath = cacheFilePath(w, h, keyword, lock);
  if (fs.existsSync(filepath)) return filepath;

  const safe = String(keyword).replace(/[^a-z0-9,]/gi, '');
  try {
    await fetchAndSave(`https://loremflickr.com/${w}/${h}/${safe}?lock=${lock}`, filepath, 6000);
  } catch (err) {
    await fetchAndSave(`https://picsum.photos/seed/${safe}-${lock}/${w}/${h}`, filepath, 6000);
  }
  return filepath;
}

function registerImageRoute(app) {
  app.get('/img/:w/:h/:keyword', async (req, res) => {
    const { w, h, keyword } = req.params;
    const lock = req.query.lock || '0';
    try {
      const filepath = await ensureCached(w, h, keyword, lock);
      res.type('image/jpeg');
      res.set('Cache-Control', 'public, max-age=604800, immutable');
      fs.createReadStream(filepath).pipe(res);
    } catch (err) {
      // Both themed and fallback fetch failed (e.g. fully offline) — degrade
      // to a direct redirect so the <img> tag still resolves to something.
      const safe = String(keyword).replace(/[^a-z0-9,]/gi, '');
      res.redirect(`https://picsum.photos/seed/${safe}-${lock}/${w}/${h}`);
    }
  });
}

/**
 * Pre-fetches and caches a list of { w, h, keyword, lock } descriptors at
 * low concurrency so the site's images are warm — and instantly servable
 * from disk — before real traffic arrives.
 */
async function warmCache(descriptors, concurrency = 4) {
  let index = 0;
  let fetchedNow = 0;
  let alreadyWarm = 0;
  let unreachable = 0;

  async function worker() {
    while (index < descriptors.length) {
      const d = descriptors[index++];
      const filepath = cacheFilePath(d.w, d.h, d.keyword, d.lock);
      if (fs.existsSync(filepath)) { alreadyWarm++; continue; }
      try {
        await ensureCached(d.w, d.h, d.keyword, d.lock);
        fetchedNow++;
      } catch (err) {
        unreachable++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, worker);
  await Promise.all(workers);
  return { fetchedNow, alreadyWarm, unreachable, total: descriptors.length };
}

module.exports = { registerImageRoute, warmCache };

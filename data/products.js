/**
 * Lumière product catalogue.
 * Single source of truth, served to the front end via /api/products.
 */

const CATEGORIES = ['Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Decor'];
const COLLECTIONS = ['Modern', 'Classic', 'Luxury', 'Minimal', 'Scandinavian', 'Industrial'];

// Single tags only — LoremFlickr treats comma-separated keywords as an AND
// filter, and compound furniture+room tags frequently have zero matches,
// which reads as a broken upstream. Single well-populated tags resolve reliably.
const SUB_KEYWORDS = {
  Sofas: 'sofa',
  Beds: 'bed',
  'Dining Tables': 'diningtable',
  'Coffee Tables': 'coffeetable',
  'TV Units': 'tvstand',
  Bookshelves: 'bookshelf',
  'Office Chairs': 'officechair',
  'Executive Tables': 'desk',
  Wardrobes: 'wardrobe',
  Mattresses: 'mattress',
  'Outdoor Furniture': 'patio',
  Decor: 'homedecor',
};
const IMG_W = 1200;
const IMG_H = 1400;
const IMG_N = 3;

function img(id, subcategory, n = IMG_N) {
  const keyword = SUB_KEYWORDS[subcategory] || 'furniture';
  const out = [];
  for (let i = 1; i <= n; i++) {
    const lock = id * 11 + i;
    out.push(`/img/${IMG_W}/${IMG_H}/${encodeURIComponent(keyword)}?lock=${lock}`);
  }
  return out;
}

/** Descriptors for every product image, used to pre-warm the server-side image cache. */
function productImageDescriptors(productList) {
  const out = [];
  productList.forEach((p) => {
    const keyword = SUB_KEYWORDS[p.subcategory] || 'furniture';
    for (let i = 1; i <= IMG_N; i++) {
      out.push({ w: IMG_W, h: IMG_H, keyword, lock: p.id * 11 + i });
    }
  });
  return out;
}

function reviews(seed, count) {
  const authors = ['Amelia R.', 'James H.', 'Sophie L.', 'Daniel K.', 'Olivia M.', 'Noah T.', 'Isabella F.', 'Ethan W.', 'Charlotte B.', 'Lucas P.'];
  const titles = ['Exceeded expectations', 'Stunning craftsmanship', 'Worth every penny', 'Elegant and sturdy', 'Exactly as pictured', 'A centerpiece in our home', 'Impeccable quality', 'Beautifully made'];
  const bodies = [
    'The finish is even more refined in person. Delivery was smooth and the assembly team were true professionals.',
    'This piece transformed the whole room. The materials feel substantial and the detailing is genuinely luxurious.',
    'I compared several premium brands before buying and this is by far the best value at this quality level.',
    'Solid construction, gorgeous texture, and it arrived exactly on schedule. Could not be happier.',
    'A true investment piece. It photographs beautifully but is even better to sit with and touch.',
    'The craftsmanship is obvious the moment you unbox it. Every joint and seam is precise.',
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      author: authors[(seed + i) % authors.length],
      rating: 4 + ((seed + i) % 2),
      date: `2026-0${1 + ((seed + i) % 6)}-${10 + ((seed + i * 3) % 18)}`,
      title: titles[(seed + i) % titles.length],
      text: bodies[(seed + i) % bodies.length],
    });
  }
  return out;
}

const RAW = [
  // ---------------- SOFAS ----------------
  { name: 'Aurelia Modular Sofa', cat: 'Living Room', sub: 'Sofas', col: 'Luxury', material: 'Leather', color: 'Cognac', price: 4299, discount: 10, w: 112, d: 38, h: 30, weight: 96, desc: 'A sculptural, low-slung silhouette upholstered in full-grain Italian leather over a kiln-dried hardwood frame. Modular sections allow the Aurelia to adapt from a tight loveseat to a sprawling sectional.' },
  { name: 'Belmond Chesterfield Sofa', cat: 'Living Room', sub: 'Sofas', col: 'Classic', material: 'Leather', color: 'Espresso', price: 3899, discount: 0, w: 88, d: 36, h: 29, weight: 88, desc: 'The Belmond reinterprets the classic Chesterfield with deep button-tufting, rolled arms, and hand-finished nailhead trim for a study-worthy statement piece.' },
  { name: 'Nordholm Linen Sofa', cat: 'Living Room', sub: 'Sofas', col: 'Scandinavian', material: 'Fabric', color: 'Oat', price: 2649, discount: 15, w: 84, d: 34, h: 31, weight: 72, desc: 'Loose linen-blend cushions over a solid oak base give the Nordholm an effortless, lived-in elegance suited to light, airy interiors.' },
  { name: 'Vantage Industrial Sofa', cat: 'Living Room', sub: 'Sofas', col: 'Industrial', material: 'Leather', color: 'Whiskey', price: 3199, discount: 0, w: 90, d: 37, h: 32, weight: 91, desc: 'Exposed blackened-steel legs anchor a distressed leather shell, marrying warehouse-loft edge with genuine comfort.' },
  { name: 'Solstice Minimal Sofa', cat: 'Living Room', sub: 'Sofas', col: 'Minimal', material: 'Fabric', color: 'Chalk', price: 2999, discount: 0, w: 86, d: 35, h: 27, weight: 74, desc: 'Clean, unbroken lines and a low profile make the Solstice a quiet, architectural anchor for minimalist living spaces.' },
  { name: 'Marchetti Curved Sofa', cat: 'Living Room', sub: 'Sofas', col: 'Modern', material: 'Velvet', color: 'Emerald', price: 4599, discount: 20, w: 96, d: 40, h: 30, weight: 99, desc: 'A gently curving silhouette upholstered in jewel-toned velvet, designed as the centerpiece of a refined living room.' },

  // ---------------- BEDS ----------------
  { name: 'Serrano Upholstered Bed', cat: 'Bedroom', sub: 'Beds', col: 'Luxury', material: 'Velvet', color: 'Midnight Blue', price: 2899, discount: 0, w: 65, d: 86, h: 48, weight: 110, desc: 'A dramatic channel-tufted headboard rises above a velvet-wrapped frame, engineered on a reinforced steel platform for a lifetime of quiet nights.' },
  { name: 'Kioto Platform Bed', cat: 'Bedroom', sub: 'Beds', col: 'Minimal', material: 'Wood', color: 'Walnut', price: 1899, discount: 0, w: 64, d: 84, h: 14, weight: 88, desc: 'Low to the ground and finished in book-matched walnut veneer, the Kioto embodies quiet Japanese-inspired restraint.' },
  { name: 'Hearthstone Wood Bed', cat: 'Bedroom', sub: 'Beds', col: 'Classic', material: 'Wood', color: 'Chestnut', price: 2299, discount: 12, w: 66, d: 88, h: 46, weight: 121, desc: 'Solid chestnut construction with hand-carved detailing along the headboard evokes an heirloom built to be passed down.' },
  { name: 'Alden Scandinavian Bed', cat: 'Bedroom', sub: 'Beds', col: 'Scandinavian', material: 'Wood', color: 'Natural Ash', price: 1699, discount: 0, w: 63, d: 83, h: 38, weight: 79, desc: 'Pale ash and a slatted headboard bring soft Nordic warmth to any bedroom, pairing beautifully with linens in muted tones.' },
  { name: 'Foundry Metal Bed', cat: 'Bedroom', sub: 'Beds', col: 'Industrial', material: 'Metal', color: 'Matte Black', price: 1549, discount: 0, w: 64, d: 84, h: 44, weight: 84, desc: 'Powder-coated steel tubing forms a strong geometric frame, an industrial counterpoint to soft bedding.' },
  { name: 'Belmar Canopy Bed', cat: 'Bedroom', sub: 'Beds', col: 'Luxury', material: 'Wood', color: 'Ebony', price: 3599, discount: 0, w: 68, d: 88, h: 84, weight: 142, desc: 'A four-poster silhouette in ebony-stained hardwood, sized to make any primary bedroom feel like a private suite.' },

  // ---------------- DINING TABLES ----------------
  { name: 'Castellan Marble Dining Table', cat: 'Dining', sub: 'Dining Tables', col: 'Luxury', material: 'Marble', color: 'Calacatta White', price: 3899, discount: 0, w: 84, d: 40, h: 30, weight: 158, desc: 'A honed Calacatta marble top rests on a sculpted brass-finished base, engineered for both grandeur and daily use.' },
  { name: 'Amberwood Dining Table', cat: 'Dining', sub: 'Dining Tables', col: 'Classic', material: 'Wood', color: 'Amber Oak', price: 2199, discount: 10, w: 78, d: 38, h: 30, weight: 132, desc: 'Solid amber oak with a hand-rubbed finish, built using traditional mortise-and-tenon joinery for generations of family dinners.' },
  { name: 'Nordvik Extendable Table', cat: 'Dining', sub: 'Dining Tables', col: 'Scandinavian', material: 'Wood', color: 'Light Oak', price: 1999, discount: 0, w: 71, d: 36, h: 29, weight: 98, desc: 'A butterfly extension mechanism lets the Nordvik grow from an intimate six-seater to a twelve-seat gathering table.' },
  { name: 'Ironclad Dining Table', cat: 'Dining', sub: 'Dining Tables', col: 'Industrial', material: 'Metal', color: 'Raw Steel', price: 1799, discount: 0, w: 80, d: 38, h: 30, weight: 145, desc: 'A reclaimed-oak top meets a raw steel trestle base for a table with genuine industrial provenance.' },
  { name: 'Linea Minimal Dining Table', cat: 'Dining', sub: 'Dining Tables', col: 'Minimal', material: 'Wood', color: 'White Oak', price: 2499, discount: 0, w: 82, d: 39, h: 30, weight: 118, desc: 'A single continuous plane of white oak, seamlessly mitered at the edges for an unbroken, sculptural form.' },
  { name: 'Palazzo Round Dining Table', cat: 'Dining', sub: 'Dining Tables', col: 'Luxury', material: 'Marble', color: 'Emperador Brown', price: 3299, discount: 8, w: 54, d: 54, h: 30, weight: 134, desc: 'A round Emperador marble top on a fluted pedestal base creates an intimate, dramatic dining setting.' },

  // ---------------- COFFEE TABLES ----------------
  { name: 'Onyx Coffee Table', cat: 'Living Room', sub: 'Coffee Tables', col: 'Luxury', material: 'Marble', color: 'Nero Marquina', price: 1599, discount: 0, w: 48, d: 24, h: 16, weight: 72, desc: 'Polished Nero Marquina marble atop a brushed brass frame — dense, cool to the touch, quietly dramatic.' },
  { name: 'Driftwood Coffee Table', cat: 'Living Room', sub: 'Coffee Tables', col: 'Scandinavian', material: 'Wood', color: 'Weathered Oak', price: 899, discount: 0, w: 44, d: 24, h: 17, weight: 41, desc: 'Weathered oak with softly rounded edges brings a coastal, sun-bleached warmth to the living room.' },
  { name: 'Foundry Coffee Table', cat: 'Living Room', sub: 'Coffee Tables', col: 'Industrial', material: 'Metal', color: 'Blackened Steel', price: 749, discount: 15, w: 42, d: 22, h: 16, weight: 38, desc: 'A tempered smoked-glass top floats above a geometric blackened-steel base.' },
  { name: 'Halo Round Coffee Table', cat: 'Living Room', sub: 'Coffee Tables', col: 'Minimal', material: 'Wood', color: 'Natural Walnut', price: 1099, discount: 0, w: 36, d: 36, h: 15, weight: 33, desc: 'A perfect circle of solid walnut, its pedestal base cut from a single turned column.' },
  { name: 'Marchetti Nesting Tables', cat: 'Living Room', sub: 'Coffee Tables', col: 'Modern', material: 'Wood', color: 'Smoked Oak', price: 1249, discount: 0, w: 40, d: 24, h: 18, weight: 46, desc: 'A set of two sculptural nesting tables in smoked oak, designed to be arranged and rearranged endlessly.' },

  // ---------------- TV UNITS ----------------
  { name: 'Cassian TV Console', cat: 'Living Room', sub: 'TV Units', col: 'Modern', material: 'Wood', color: 'Charcoal Oak', price: 1899, discount: 0, w: 72, d: 18, h: 22, weight: 89, desc: 'Push-to-open cabinetry in charcoal oak conceals media clutter behind a seamless, handle-free facade.' },
  { name: 'Ridgeline TV Unit', cat: 'Living Room', sub: 'TV Units', col: 'Industrial', material: 'Metal', color: 'Iron Black', price: 1449, discount: 10, w: 68, d: 17, h: 20, weight: 76, desc: 'Blackened steel legs and reclaimed wood shelving give the Ridgeline a rugged, gallery-like presence.' },
  { name: 'Halden Floating TV Unit', cat: 'Living Room', sub: 'TV Units', col: 'Minimal', material: 'Wood', color: 'Pure White', price: 1599, discount: 0, w: 78, d: 16, h: 14, weight: 62, desc: 'Wall-mounted and finished in matte lacquer, the Halden appears to hover, keeping the floor plane uninterrupted.' },
  { name: 'Nordholm TV Console', cat: 'Living Room', sub: 'TV Units', col: 'Scandinavian', material: 'Wood', color: 'Natural Ash', price: 1349, discount: 0, w: 70, d: 18, h: 21, weight: 68, desc: 'Slatted ash doors and tapered legs bring soft Nordic geometry to the media wall.' },

  // ---------------- BOOKSHELVES ----------------
  { name: 'Athenaeum Bookshelf', cat: 'Living Room', sub: 'Bookshelves', col: 'Classic', material: 'Wood', color: 'Mahogany', price: 2199, discount: 0, w: 42, d: 14, h: 84, weight: 104, desc: 'Floor-to-ceiling mahogany shelving with fluted side panels, reminiscent of a private library.' },
  { name: 'Modul Ladder Shelf', cat: 'Living Room', sub: 'Bookshelves', col: 'Minimal', material: 'Wood', color: 'Blonde Oak', price: 899, discount: 0, w: 30, d: 13, h: 72, weight: 38, desc: 'An asymmetric ladder-frame bookshelf in blonde oak, staggered shelves creating quiet visual rhythm.' },
  { name: 'Trestle Industrial Shelf', cat: 'Living Room', sub: 'Bookshelves', col: 'Industrial', material: 'Metal', color: 'Raw Steel', price: 1099, discount: 0, w: 36, d: 14, h: 76, weight: 61, desc: 'Reclaimed pine shelves sit within a raw steel frame bolted with visible industrial hardware.' },
  { name: 'Skagen Open Shelf', cat: 'Living Room', sub: 'Bookshelves', col: 'Scandinavian', material: 'Wood', color: 'Light Ash', price: 949, discount: 5, w: 32, d: 12, h: 68, weight: 34, desc: 'Open-backed ash shelving with rounded corners lets light pass through, keeping small rooms feeling expansive.' },

  // ---------------- OFFICE CHAIRS ----------------
  { name: 'Meridian Executive Chair', cat: 'Office', sub: 'Office Chairs', col: 'Luxury', material: 'Leather', color: 'Saddle Tan', price: 1699, discount: 0, w: 28, d: 30, h: 46, weight: 46, desc: 'Full-grain leather over a die-cast aluminum frame, engineered with a synchronized tilt mechanism for all-day support.' },
  { name: 'Halden Task Chair', cat: 'Office', sub: 'Office Chairs', col: 'Minimal', material: 'Fabric', color: 'Graphite', price: 749, discount: 0, w: 25, d: 24, h: 40, weight: 24, desc: 'A breathable knit back and adjustable lumbar support wrapped in a quietly minimal shell.' },
  { name: 'Foundry Drafting Chair', cat: 'Office', sub: 'Office Chairs', col: 'Industrial', material: 'Leather', color: 'Whiskey', price: 899, discount: 12, w: 24, d: 23, h: 44, weight: 27, desc: 'Height-adjustable and finished in distressed leather over blackened steel, built for the studio as much as the desk.' },
  { name: 'Nordholm Office Chair', cat: 'Office', sub: 'Office Chairs', col: 'Scandinavian', material: 'Wood', color: 'Natural Oak', price: 649, discount: 0, w: 23, d: 22, h: 32, weight: 18, desc: 'A bentwood oak frame and wool-blend seat pad bring warmth to the home office.' },

  // ---------------- EXECUTIVE TABLES ----------------
  { name: 'Sovereign Executive Desk', cat: 'Office', sub: 'Executive Tables', col: 'Luxury', material: 'Wood', color: 'Ebony Walnut', price: 4299, discount: 0, w: 72, d: 36, h: 30, weight: 138, desc: 'A monolithic ebony-walnut desk with integrated cable management and a leather-inset writing surface.' },
  { name: 'Corten Executive Desk', cat: 'Office', sub: 'Executive Tables', col: 'Industrial', material: 'Metal', color: 'Weathered Corten', price: 2599, discount: 0, w: 66, d: 32, h: 30, weight: 112, desc: 'Weathered corten-steel panels flank a solid oak work surface — an industrial desk with real gravitas.' },
  { name: 'Linea Executive Desk', cat: 'Office', sub: 'Executive Tables', col: 'Minimal', material: 'Wood', color: 'White Oak', price: 2199, discount: 8, w: 64, d: 30, h: 29, weight: 96, desc: 'A cantilevered white oak surface appears to float above two slim structural legs.' },

  // ---------------- WARDROBES ----------------
  { name: 'Chambers Wardrobe', cat: 'Bedroom', sub: 'Wardrobes', col: 'Classic', material: 'Wood', color: 'Rich Mahogany', price: 3299, discount: 0, w: 72, d: 24, h: 84, weight: 168, desc: 'Mirrored mahogany doors open to a fully fitted interior of drawers, hanging rails, and shoe racks.' },
  { name: 'Modul Sliding Wardrobe', cat: 'Bedroom', sub: 'Wardrobes', col: 'Minimal', material: 'Wood', color: 'Matte White', price: 2799, discount: 10, w: 80, d: 23, h: 86, weight: 152, desc: 'Soft-close sliding doors in matte lacquer keep the bedroom silhouette clean and uncluttered.' },
  { name: 'Nordholm Wardrobe', cat: 'Bedroom', sub: 'Wardrobes', col: 'Scandinavian', material: 'Wood', color: 'Natural Pine', price: 2399, discount: 0, w: 70, d: 22, h: 80, weight: 134, desc: 'Pine construction with woven rattan door inserts brings texture and warmth to storage.' },

  // ---------------- MATTRESSES ----------------
  { name: 'Cloudrest Hybrid Mattress', cat: 'Bedroom', sub: 'Mattresses', col: 'Luxury', material: 'Fabric', color: 'White', price: 2199, discount: 0, w: 60, d: 80, h: 14, weight: 68, desc: 'Individually wrapped coils layered beneath cooling gel memory foam for hotel-grade support and pressure relief.' },
  { name: 'Aurora Latex Mattress', cat: 'Bedroom', sub: 'Mattresses', col: 'Minimal', material: 'Fabric', color: 'Natural', price: 1899, discount: 0, w: 60, d: 80, h: 12, weight: 61, desc: 'Natural Talalay latex offers responsive, breathable support with a certified organic cotton cover.' },
  { name: 'Nordholm Wool Mattress', cat: 'Bedroom', sub: 'Mattresses', col: 'Scandinavian', material: 'Fabric', color: 'Undyed Wool', price: 1699, discount: 15, w: 60, d: 80, h: 11, weight: 54, desc: 'Layers of undyed wool and natural latex, temperature-regulating for year-round comfort.' },

  // ---------------- OUTDOOR FURNITURE ----------------
  { name: 'Cabana Outdoor Sofa', cat: 'Outdoor', sub: 'Outdoor Furniture', col: 'Modern', material: 'Fabric', color: 'Sand', price: 2999, discount: 0, w: 88, d: 34, h: 28, weight: 82, desc: 'Weather-resistant woven rope over a powder-coated aluminum frame, cushioned in quick-dry outdoor fabric.' },
  { name: 'Terra Teak Dining Set', cat: 'Outdoor', sub: 'Outdoor Furniture', col: 'Classic', material: 'Wood', color: 'Golden Teak', price: 3499, discount: 0, w: 78, d: 40, h: 29, weight: 118, desc: 'Solid grade-A teak, naturally weather resistant, seats eight for al fresco dining under any sky.' },
  { name: 'Dune Lounge Chair', cat: 'Outdoor', sub: 'Outdoor Furniture', col: 'Minimal', material: 'Wood', color: 'Weathered Teak', price: 1199, discount: 0, w: 28, d: 34, h: 30, weight: 24, desc: 'A reclining teak lounge chair with adjustable back positions, built for long coastal afternoons.' },
  { name: 'Ember Fire Pit Table', cat: 'Outdoor', sub: 'Outdoor Furniture', col: 'Industrial', material: 'Metal', color: 'Raw Steel', price: 1599, discount: 0, w: 42, d: 42, h: 16, weight: 88, desc: 'A corten-steel fire pit table doubles as a gathering surface, weathering beautifully over time.' },
  { name: 'Palm Outdoor Sectional', cat: 'Outdoor', sub: 'Outdoor Furniture', col: 'Luxury', material: 'Fabric', color: 'Ivory', price: 4899, discount: 12, w: 110, d: 40, h: 27, weight: 142, desc: 'A generous modular sectional in marine-grade fabric over teak legs, engineered for resort-level lounging.' },

  // ---------------- DECOR ----------------
  { name: 'Solaris Floor Mirror', cat: 'Decor', sub: 'Decor', col: 'Modern', material: 'Metal', color: 'Brushed Brass', price: 899, discount: 0, w: 32, d: 2, h: 70, weight: 28, desc: 'An arched floor mirror in brushed brass, tall enough to anchor an entryway or bedroom corner.' },
  { name: 'Lumen Table Lamp Pair', cat: 'Decor', sub: 'Decor', col: 'Luxury', material: 'Metal', color: 'Antique Gold', price: 649, discount: 0, w: 12, d: 12, h: 26, weight: 9, desc: 'A pair of hand-finished antique gold table lamps with linen shades, cast in solid brass.' },
  { name: 'Terra Ceramic Vase Set', cat: 'Decor', sub: 'Decor', col: 'Minimal', material: 'Ceramic', color: 'Terracotta', price: 249, discount: 0, w: 8, d: 8, h: 16, weight: 4, desc: 'A trio of hand-thrown ceramic vases in varying heights, each subtly unique.' },
  { name: 'Nordholm Wool Throw', cat: 'Decor', sub: 'Decor', col: 'Scandinavian', material: 'Fabric', color: 'Oatmeal', price: 189, discount: 0, w: 50, d: 70, h: 1, weight: 2, desc: 'A generously sized merino wool throw, woven in a subtle herringbone pattern.' },
  { name: 'Foundry Wall Sconce Pair', cat: 'Decor', sub: 'Decor', col: 'Industrial', material: 'Metal', color: 'Matte Black', price: 329, discount: 0, w: 6, d: 9, h: 12, weight: 5, desc: 'A pair of articulating wall sconces in matte black steel with an exposed-bulb aesthetic.' },
  { name: 'Halo Area Rug', cat: 'Decor', sub: 'Decor', col: 'Modern', material: 'Fabric', color: 'Ivory & Grey', price: 1299, discount: 10, w: 96, d: 120, h: 1, weight: 32, desc: 'A hand-knotted wool and viscose rug with a subtly abstract pattern that reads as a quiet gradient from afar.' },
  { name: 'Ridgeline Console Table', cat: 'Living Room', sub: 'Coffee Tables', col: 'Industrial', material: 'Metal', color: 'Blackened Steel', price: 1099, discount: 0, w: 48, d: 16, h: 30, weight: 54, desc: 'A slim entryway console in blackened steel and reclaimed oak, built to hold keys, light, and little else.' },
  { name: 'Aurelia Accent Chair', cat: 'Living Room', sub: 'Sofas', col: 'Luxury', material: 'Velvet', color: 'Blush', price: 1399, discount: 0, w: 30, d: 32, h: 31, weight: 32, desc: 'A curved-back accent chair in blush velvet on a brushed brass swivel base.' },
  { name: 'Belmond Bar Cart', cat: 'Decor', sub: 'Decor', col: 'Classic', material: 'Metal', color: 'Antique Brass', price: 799, discount: 0, w: 30, d: 18, h: 32, weight: 22, desc: 'A two-tier antique brass bar cart with mirrored shelving and glass-topped surfaces.' },
  { name: 'Kioto Side Table', cat: 'Living Room', sub: 'Coffee Tables', col: 'Minimal', material: 'Wood', color: 'Walnut', price: 549, discount: 0, w: 18, d: 18, h: 20, weight: 14, desc: 'A minimal walnut side table with a single sculpted leg, echoing the Kioto bed collection.' },
  { name: 'Alden Bench', cat: 'Bedroom', sub: 'Beds', col: 'Scandinavian', material: 'Wood', color: 'Natural Ash', price: 599, discount: 0, w: 48, d: 16, h: 18, weight: 22, desc: 'An upholstered ash bench designed to sit at the foot of the Alden bed collection.' },
];

const products = RAW.map((p, i) => {
  const id = i + 1;
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const priceFinal = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  const stock = 3 + ((id * 7) % 40);
  const reviewCount = 8 + ((id * 5) % 60);
  const rating = +(3.9 + (((id * 13) % 11) / 10)).toFixed(1);
  return {
    id,
    sku: `LUM-${String(id).padStart(4, '0')}`,
    slug,
    name: p.name,
    category: p.cat,
    subcategory: p.sub,
    collection: p.col,
    material: p.material,
    color: p.color,
    price: p.price,
    discount: p.discount,
    priceFinal: Math.min(priceFinal, p.price),
    images: img(id, p.sub),
    description: p.desc,
    shortDescription: p.desc.split('. ')[0] + '.',
    dimensions: { width: p.w, depth: p.d, height: p.h, unit: 'in' },
    weight: `${p.weight} lb`,
    warranty: '10-Year Limited Warranty',
    shippingInfo: 'White-glove delivery available. Ships in 2-4 weeks.',
    stock,
    inStock: stock > 0,
    rating: Math.min(rating, 5),
    reviewCount,
    reviews: reviews(id, Math.min(4, reviewCount)),
    badges: [
      ...(p.discount ? ['sale'] : []),
      ...(id % 6 === 0 ? ['bestseller'] : []),
      ...(id % 5 === 0 ? ['new'] : []),
    ],
    colors: [{ name: p.color, hex: null }],
    tags: [p.cat, p.sub, p.col, p.material].map((t) => t.toLowerCase()),
  };
});

module.exports = { products, CATEGORIES, COLLECTIONS, productImageDescriptors };

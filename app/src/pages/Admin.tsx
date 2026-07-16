import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';
import { useToast } from '../context/ToastContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { Product } from '../types/product';
import styles from './Admin.module.css';

type View = 'dashboard' | 'products' | 'inventory' | 'orders' | 'customers' | 'coupons' | 'analytics';

const NAV: [View, string][] = [
  ['dashboard', 'Dashboard'],
  ['products', 'Products'],
  ['inventory', 'Inventory'],
  ['orders', 'Orders'],
  ['customers', 'Customers'],
  ['coupons', 'Coupons'],
  ['analytics', 'Sales Analytics'],
];

const DEMO_ORDERS = [
  { id: 'AUR-48213026', customer: 'Amelia Ross', items: 2, total: 6498, status: 'Delivered' },
  { id: 'AUR-48119284', customer: 'James Hall', items: 1, total: 3899, status: 'In Transit' },
  { id: 'AUR-47902211', customer: 'Sophie Lane', items: 3, total: 9812, status: 'Delivered' },
  { id: 'AUR-47844410', customer: 'Daniel Kwan', items: 1, total: 1699, status: 'Processing' },
  { id: 'AUR-47790023', customer: 'Olivia Moss', items: 2, total: 4599, status: 'Delivered' },
];
const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  Delivered: { bg: '#DFF3E6', fg: '#3F7A57' },
  'In Transit': { bg: '#FDF1DA', fg: '#C89B3C' },
  Processing: { bg: '#EFEFEF', fg: '#666666' },
};
const DEMO_CUSTOMERS = [
  { name: 'Amelia Ross', email: 'amelia.r@example.com', orders: 6, ltv: 24980 },
  { name: 'James Hall', email: 'james.h@example.com', orders: 3, ltv: 11420 },
  { name: 'Sophie Lane', email: 'sophie.l@example.com', orders: 9, ltv: 38210 },
  { name: 'Daniel Kwan', email: 'daniel.k@example.com', orders: 1, ltv: 1699 },
];
const DEMO_COUPONS = [
  { code: 'LUMIERE10', discount: '10%', uses: 412, active: true },
  { code: 'WELCOME50', discount: '$50 off', uses: 891, active: true },
  { code: 'SUMMER25', discount: '25%', uses: 203, active: false },
];
const REVENUE_BARS = [
  ['Jan', 52], ['Feb', 61], ['Mar', 58], ['Apr', 74], ['May', 69], ['Jun', 88], ['Jul', 100],
] as const;
const CATEGORY_BARS = [
  ['Living', 90], ['Bedroom', 70], ['Dining', 60], ['Office', 40], ['Outdoor', 55], ['Decor', 30],
] as const;

function StatusPill({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? STATUS_COLOR.Processing;
  return (
    <span className={styles.statusPill} style={{ background: c.bg, color: c.fg }}>
      {status}
    </span>
  );
}

export default function Admin() {
  const [view, setView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const { showToast } = useToast();

  useDocumentMeta({ title: 'Admin Dashboard | Aura' });

  useEffect(() => {
    api.getProducts().then((data) => setProducts(data.products));
  }, []);

  const lowStock = products.filter((p) => p.stock <= 8);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo}>
          Aura
        </Link>
        <nav className={styles.nav}>
          {NAV.map(([key, label]) => (
            <button key={key} className={view === key ? styles.active : ''} onClick={() => setView(key)}>
              {label}
            </button>
          ))}
          <Link to="/" className={styles.backLink}>
            ← Back to Store
          </Link>
        </nav>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <h1>{NAV.find(([k]) => k === view)?.[1]}</h1>
          <button className="btn btnPrimary btnSm" onClick={() => showToast('Add product modal (demo)')}>
            + Add Product
          </button>
        </div>

        {view === 'dashboard' && (
          <>
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.label}>Revenue (30d)</div>
                <div className={styles.value}>$412,860</div>
                <div className={styles.delta}>▲ 12.4% vs last period</div>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.label}>Orders</div>
                <div className={styles.value}>1,284</div>
                <div className={styles.delta}>▲ 6.1%</div>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.label}>Avg. Order Value</div>
                <div className={styles.value}>$3,214</div>
                <div className={styles.delta}>▲ 2.8%</div>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.label}>Conversion Rate</div>
                <div className={styles.value}>3.4%</div>
                <div className={styles.delta}>▲ 0.3pt</div>
              </div>
            </div>
            <div className={styles.panel}>
              <h3>Revenue — Last 7 Months</h3>
              <div className={styles.barChart}>
                {REVENUE_BARS.map(([label, h]) => (
                  <div key={label} className={styles.bar} style={{ height: `${h}%` }}>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.panel}>
              <h3>Recent Orders</h3>
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ORDERS.slice(0, 4).map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{formatPrice(o.total)}</td>
                      <td>
                        <StatusPill status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === 'products' && (
          <div className={styles.panel}>
            <h3>Product Catalogue</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.images[0]} alt="" />
                      {p.name}
                    </td>
                    <td>{p.category}</td>
                    <td>{formatPrice(p.priceFinal)}</td>
                    <td>{p.stock}</td>
                    <td>{p.rating} ★</td>
                    <td>
                      <button className="btn btnOutline btnSm" onClick={() => showToast('Edit product modal (demo)')}>
                        Edit
                      </button>{' '}
                      <button className="btn btnOutline btnSm" onClick={() => showToast('Product removed (demo)', 'success')}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'inventory' && (
          <div className={styles.panel}>
            <h3>Low Stock Alerts</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td style={{ color: p.stock <= 5 ? 'var(--color-danger)' : 'inherit' }}>{p.stock} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'orders' && (
          <div className={styles.panel}>
            <h3>All Orders</h3>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.items}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td>
                      <StatusPill status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'customers' && (
          <div className={styles.panel}>
            <h3>Customers</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Lifetime Value</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_CUSTOMERS.map((c) => (
                  <tr key={c.email}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.orders}</td>
                    <td>{formatPrice(c.ltv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'coupons' && (
          <div className={styles.panel}>
            <h3>Active Coupons</h3>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Uses</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_COUPONS.map((c) => (
                  <tr key={c.code}>
                    <td>{c.code}</td>
                    <td>{c.discount}</td>
                    <td>{c.uses}</td>
                    <td>
                      <StatusPill status={c.active ? 'Delivered' : 'Processing'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'analytics' && (
          <div className={styles.panel}>
            <h3>Top Categories by Revenue</h3>
            <div className={styles.barChart}>
              {CATEGORY_BARS.map(([label, h]) => (
                <div key={label} className={styles.bar} style={{ height: `${h}%` }}>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

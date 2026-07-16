import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import styles from './Account.module.css';

const STORAGE_KEY = 'aura_user';

type AuthTab = 'signin' | 'register' | 'forgot';
type ProfileTab = 'orders' | 'addresses' | 'wishlist';

const DEMO_ORDERS = [
  { id: 'AUR-48213026', date: 'June 2, 2026', items: 2, status: 'Delivered' },
  { id: 'AUR-48119284', date: 'April 18, 2026', items: 1, status: 'In Transit' },
  { id: 'AUR-47902211', date: 'February 3, 2026', items: 3, status: 'Delivered' },
];

function loadUser(): { name: string } | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export default function Account() {
  const [user, setUser] = useState(loadUser);
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const [profileTab, setProfileTab] = useState<ProfileTab>('orders');
  const { showToast } = useToast();

  useDocumentMeta({
    title: 'Account | Aura',
    description: 'Sign in to your Aura account to view orders, saved addresses and your wishlist.',
  });

  const signIn = (name: string) => {
    const u = { name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };
  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const onSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get('email') as string) || '';
    signIn(email.split('@')[0] || 'Friend');
    showToast('Welcome back!', 'success');
  };
  const onRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const first = (new FormData(e.currentTarget).get('firstName') as string) || 'Friend';
    signIn(first);
    showToast('Account created', 'success');
  };
  const onForgot = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Password reset link sent (demo).', 'success');
    e.currentTarget.reset();
  };

  if (user) {
    return (
      <div className="container" style={{ padding: 'var(--space-6) 0 var(--space-9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <span className="eyebrow">Welcome back</span>
            <h1 className="sectionTitle" style={{ fontSize: 30 }}>
              {user.name}
            </h1>
          </div>
          <button className="btn btnOutline btnSm" onClick={signOut}>
            Sign Out
          </button>
        </div>
        <div className={styles.profileTabs}>
          {(['orders', 'addresses', 'wishlist'] as const).map((t) => (
            <button
              key={t}
              className={`${styles.profileTab} ${profileTab === t ? styles.active : ''}`}
              onClick={() => setProfileTab(t)}
            >
              {t === 'orders' ? 'Order History' : t === 'addresses' ? 'Saved Addresses' : 'Wishlist'}
            </button>
          ))}
        </div>
        {profileTab === 'orders' && (
          <div>
            {DEMO_ORDERS.map((o) => (
              <div key={o.id} className={styles.orderCard}>
                <div>
                  <strong>{o.id}</strong>
                  <div className="textSecondary" style={{ fontSize: 13 }}>
                    Placed {o.date} · {o.items} items
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: o.status === 'Delivered' ? 'var(--color-accent)' : '#EFEFEF',
                    color: o.status === 'Delivered' ? '#111' : 'var(--color-secondary)',
                  }}
                >
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}
        {profileTab === 'addresses' && (
          <div>
            <div className={styles.addressCard}>
              <strong>Home</strong>
              <p className="textSecondary">140 Meridian Ave, New York, NY 10011</p>
            </div>
            <div className={styles.addressCard}>
              <strong>Office</strong>
              <p className="textSecondary">88 Harbor Blvd, Suite 400, Austin, TX 78701</p>
            </div>
            <button className="btn btnOutline btnSm">+ Add Address</button>
          </div>
        )}
        {profileTab === 'wishlist' && (
          <div>
            <p className="textSecondary" style={{ marginBottom: 'var(--space-3)' }}>
              View and manage your saved pieces.
            </p>
            <Link to="/wishlist.html" className="btn btnPrimary btnSm">
              Go to Wishlist
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`container ${styles.authWrap}`}>
      <div className="textCenter" style={{ marginBottom: 'var(--space-5)' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          Welcome
        </span>
        <h1 className="sectionTitle">Your Account</h1>
      </div>
      <div className={styles.authTabs}>
        {(['signin', 'register', 'forgot'] as const).map((t) => (
          <button key={t} className={`${styles.authTab} ${authTab === t ? styles.active : ''}`} onClick={() => setAuthTab(t)}>
            {t === 'signin' ? 'Sign In' : t === 'register' ? 'Create Account' : 'Forgot Password'}
          </button>
        ))}
      </div>

      {authTab === 'signin' && (
        <form onSubmit={onSignIn}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit" className="btn btnPrimary btnBlock">
            Sign In
          </button>
          <p className="textSecondary textCenter" style={{ marginTop: 'var(--space-3)', fontSize: 13 }}>
            Demo only — any email/password will sign you in.
          </p>
        </form>
      )}

      {authTab === 'register' && (
        <form onSubmit={onRegister}>
          <div className="fieldRow">
            <div className="field">
              <label>First Name</label>
              <input type="text" name="firstName" required />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input type="text" name="lastName" required />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit" className="btn btnPrimary btnBlock">
            Create Account
          </button>
        </form>
      )}

      {authTab === 'forgot' && (
        <form onSubmit={onForgot}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <button type="submit" className="btn btnPrimary btnBlock">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Returns = lazy(() => import('./pages/Returns'));
const Account = lazy(() => import('./pages/Account'));
const Admin = lazy(() => import('./pages/Admin'));

// Paths intentionally mirror the original static site's URLs/query params
// exactly (see plan) — no link scheme change for a project that already
// has its routing conventions established.
export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products.html', element: <Shop /> },
      { path: '/product-details.html', element: <ProductDetails /> },
      { path: '/cart.html', element: <Cart /> },
      { path: '/checkout.html', element: <Checkout /> },
      { path: '/wishlist.html', element: <Wishlist /> },
      { path: '/about.html', element: <About /> },
      { path: '/contact.html', element: <Contact /> },
      { path: '/faq.html', element: <FAQ /> },
      { path: '/privacy-policy.html', element: <Privacy /> },
      { path: '/terms.html', element: <Terms /> },
      { path: '/returns.html', element: <Returns /> },
      { path: '/login.html', element: <Account /> },
    ],
  },
  // Admin has its own dark-sidebar shell — deliberately outside the
  // storefront Layout (no Navbar/Footer).
  { path: '/admin.html', element: <Admin /> },
];

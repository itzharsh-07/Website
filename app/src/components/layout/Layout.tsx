import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  useSmoothScroll();

  return (
    <>
      <a href="#main" className="skipLink">
        Skip to content
      </a>
      <Navbar forceSolid={!isHome} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

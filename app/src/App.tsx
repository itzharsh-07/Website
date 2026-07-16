import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { routes } from './routes';

function RouteView() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense fallback={null}>
            <RouteView />
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

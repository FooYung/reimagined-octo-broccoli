import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import Layout from './components/Layout.tsx';
import PagePlaceholder from './components/PagePlaceholder.tsx';
import RequireAuth from './components/RequireAuth.tsx';
import RequireAdmin from './components/RequireAdmin.tsx';
import HomePage from './pages/HomePage.tsx';
import CataloguePage from './pages/CataloguePage.tsx';
import ProductDetailPage from './pages/ProductDetailPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import BasketPage from './pages/BasketPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.tsx';
import AccountPage from './pages/AccountPage.tsx';
import OrderDetailPage from './pages/OrderDetailPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <CataloguePage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'basket', element: <BasketPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'checkout/confirmation', element: <OrderConfirmationPage /> },
          { path: 'account', element: <AccountPage /> },
          { path: 'account/orders/:id', element: <OrderDetailPage /> },
        ],
      },
      {
        element: <RequireAdmin />,
        children: [{ path: 'admin', element: <PagePlaceholder title="Admin" /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

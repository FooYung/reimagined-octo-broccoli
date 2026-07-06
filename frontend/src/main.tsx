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
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <PagePlaceholder title="Products" /> },
      { path: 'products/:slug', element: <PagePlaceholder title="Product" /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'basket', element: <PagePlaceholder title="Basket" /> },
          { path: 'checkout', element: <PagePlaceholder title="Checkout" /> },
          { path: 'account', element: <PagePlaceholder title="Account" /> },
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

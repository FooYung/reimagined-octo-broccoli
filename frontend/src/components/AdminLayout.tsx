import { NavLink, Outlet } from 'react-router';

function AdminLayout() {
  const tabClassName = ({ isActive }: { isActive: boolean }) =>
    `rounded px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
      isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div data-testid="admin-page" className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">Admin</h1>
      <nav className="mt-6 flex gap-2 border-b border-slate-200 pb-3">
        <NavLink to="/admin/products" data-testid="admin-nav-products" className={tabClassName}>
          Products
        </NavLink>
        <NavLink to="/admin/categories" data-testid="admin-nav-categories" className={tabClassName}>
          Categories
        </NavLink>
        <NavLink to="/admin/orders" data-testid="admin-nav-orders" className={tabClassName}>
          Orders
        </NavLink>
      </nav>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

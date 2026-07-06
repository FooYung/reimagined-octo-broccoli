import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCategories } from '../api/queries.ts';
import { useCurrentUser, useLogout } from '../api/auth.ts';

function Header() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const logout = useLogout();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/'),
    });
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  }

  return (
    <header>
      <div className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
          <Link
            to="/"
            data-testid="header-logo-link"
            className="rounded text-xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="text-white">Byte</span>
            <span className="text-blue-400">Core</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-lg">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search components..."
              aria-label="Search products"
              data-testid="header-search-input"
              className="w-full rounded-l bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <button
              type="submit"
              data-testid="header-search-submit"
              className="rounded-r bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Search
            </button>
          </form>

          <Link
            to="/basket"
            data-testid="header-basket-link"
            className="flex items-center gap-1 rounded text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Basket
            {/* Hardcoded to 0 until Phase 10 wires this up to the real basket. */}
            <span
              data-testid="header-basket-count"
              className="rounded-full bg-blue-600 px-2 py-0.5 text-xs"
            >
              0
            </span>
          </Link>

          <span className="flex min-w-[5rem] items-center gap-3">
            {!isUserLoading &&
              (user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      data-testid="header-admin-link"
                      className="rounded text-xs font-medium text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/account"
                    data-testid="header-account-link"
                    className="rounded text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {user.name}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    data-testid="header-logout-button"
                    className="rounded text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  data-testid="header-account-link"
                  className="rounded text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Sign in
                </Link>
              ))}
          </span>
        </div>
      </div>

      <nav aria-label="Categories" className="bg-slate-800">
        <div className="mx-auto flex h-11 max-w-6xl items-center gap-4 overflow-x-auto px-4 text-sm text-slate-200">
          {/* Category nav failure must not break the shell, so loading/error both render this empty bar. */}
          {categories?.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              data-testid={`nav-category-link-${category.slug}`}
              className="whitespace-nowrap rounded hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;

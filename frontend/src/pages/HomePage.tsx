import { Link } from 'react-router';
import { useFeaturedProducts } from '../api/queries.ts';
import ProductCard from '../components/ProductCard.tsx';
import ErrorState from '../components/ErrorState.tsx';

function HomePage() {
  const { data, isLoading, isError, refetch } = useFeaturedProducts();

  return (
    <>
      <section
        data-testid="home-hero"
        className="bg-gradient-to-br from-slate-900 to-blue-900 px-4 py-20 text-center text-white"
      >
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span>Byte</span>
          <span className="text-blue-400">Core</span>
        </h1>
        <p className="mt-4 text-lg text-slate-300">Serious hardware for serious builds.</p>
        <Link
          to="/products"
          data-testid="home-hero-cta"
          className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Browse all components
        </Link>
      </section>

      <section data-testid="home-featured" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold text-slate-800">Featured hardware</h2>

        {isLoading && (
          <div
            data-testid="home-featured-loading"
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState message="Couldn't load featured products." onRetry={() => void refetch()} />
        )}

        {data && (
          <div
            data-testid="home-featured-grid"
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;

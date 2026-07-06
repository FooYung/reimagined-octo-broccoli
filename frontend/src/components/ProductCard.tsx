import { Link } from 'react-router';
import type { Product } from '../api/types.ts';
import { formatPrice } from '../lib/format.ts';
import ProductImage from './ProductImage.tsx';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      data-testid={`product-card-${product.slug}`}
      className="block rounded-lg border border-slate-200 p-3 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <ProductImage name={product.name} />
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{product.category.name}</p>
      <p className="mt-1 font-medium text-slate-800">{product.name}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-semibold text-slate-900">{formatPrice(product.pricePence)}</span>
        <span
          data-testid="product-card-stock"
          className={
            inStock
              ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
              : 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700'
          }
        >
          {inStock ? 'In stock' : 'Out of stock'}
        </span>
      </div>
    </Link>
  );
}

export default ProductCard;

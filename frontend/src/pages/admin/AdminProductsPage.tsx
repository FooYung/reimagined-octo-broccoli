import { useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAdminCategories,
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  type CreateProductPayload,
} from '../../api/admin.ts';
import { ApiError } from '../../api/client.ts';
import { formatPrice } from '../../lib/format.ts';
import { productSchema, type ProductFormInput, type ProductFormValues } from '../../lib/validation.ts';
import ErrorState from '../../components/ErrorState.tsx';
import type { Product } from '../../api/types.ts';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  updateProduct: ReturnType<typeof useUpdateProduct>;
  deleteProduct: ReturnType<typeof useDeleteProduct>;
  deletingSlug: string | null;
  setDeletingSlug: (slug: string | null) => void;
}

function ProductRow({
  product,
  onEdit,
  updateProduct,
  deleteProduct,
  deletingSlug,
  setDeletingSlug,
}: ProductRowProps) {
  const { slug } = product;
  const isTogglingThis = updateProduct.isPending && updateProduct.variables?.id === product.id;
  const isDeletingThis = deleteProduct.isPending && deleteProduct.variables === product.id;
  const isConfirming = deletingSlug === slug;

  return (
    <tr data-testid={`admin-product-row-${slug}`} className="border-t border-slate-200">
      <td className="px-3 py-2">{product.name}</td>
      <td className="px-3 py-2">{product.category.name}</td>
      <td className="px-3 py-2">{formatPrice(product.pricePence)}</td>
      <td className="px-3 py-2">{product.stock}</td>
      <td className="px-3 py-2">
        {product.isActive ? (
          <span className="text-green-700">Active</span>
        ) : (
          <span data-testid={`admin-product-inactive-${slug}`} className="text-slate-400">
            Inactive
          </span>
        )}
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {isConfirming ? (
            <>
              <button
                type="button"
                onClick={() => deleteProduct.mutate(product.id, { onSettled: () => setDeletingSlug(null) })}
                disabled={isDeletingThis}
                data-testid={`admin-product-delete-confirm-${slug}`}
                className="rounded border border-red-300 px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setDeletingSlug(null)}
                disabled={isDeletingThis}
                data-testid={`admin-product-delete-cancel-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEdit(product)}
                data-testid={`admin-product-edit-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => updateProduct.mutate({ id: product.id, data: { isActive: !product.isActive } })}
                disabled={isTogglingThis}
                data-testid={`admin-product-toggle-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {product.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                type="button"
                onClick={() => setDeletingSlug(slug)}
                data-testid={`admin-product-delete-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function AdminProductsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminProducts({
    search: search || undefined,
    page,
  });
  const { data: categories } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const currentDefaults: ProductFormValues = editing
    ? {
        name: editing.name,
        description: editing.description,
        pricePounds: editing.pricePence / 100,
        stock: editing.stock,
        categoryId: editing.category.id,
        isActive: editing.isActive,
      }
    : { name: '', description: '', pricePounds: 0, stock: 0, categoryId: 0, isActive: true };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    values: currentDefaults,
  });

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleEdit(product: Product) {
    setEditing(product);
    setIsCreating(false);
  }

  function handleFormCancel() {
    setIsCreating(false);
    setEditing(null);
  }

  function onSubmit(values: ProductFormValues) {
    const payload: CreateProductPayload = {
      name: values.name,
      description: values.description,
      pricePence: Math.round(values.pricePounds * 100),
      stock: values.stock,
      categoryId: values.categoryId,
      isActive: values.isActive,
    };

    if (editing) {
      updateProduct.mutate({ id: editing.id, data: payload }, { onSuccess: () => setEditing(null) });
    } else {
      createProduct.mutate(payload, { onSuccess: () => setIsCreating(false) });
    }
  }

  const formMutation = editing ? updateProduct : createProduct;
  const formError =
    formMutation.isError && formMutation.error instanceof ApiError ? formMutation.error : null;

  const deleteError =
    deleteProduct.isError && deleteProduct.error instanceof ApiError ? deleteProduct.error.message : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex max-w-sm flex-1">
          <label htmlFor="admin-products-search" className="sr-only">
            Search products
          </label>
          <input
            id="admin-products-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search products..."
            data-testid="admin-products-search"
            className="w-full rounded-l border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="rounded-r bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsCreating(true);
            setEditing(null);
          }}
          data-testid="admin-products-new-button"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          New product
        </button>
      </div>

      {deleteError && (
        <div
          data-testid="admin-products-error"
          className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {deleteError}
        </div>
      )}

      {(isCreating || editing) && (
        <div
          data-testid="admin-product-form"
          className="mt-6 rounded-lg border border-slate-200 p-4"
        >
          <h2 className="text-lg font-medium text-slate-800">
            {editing ? 'Edit product' : 'New product'}
          </h2>

          {formError && (
            <div
              data-testid="admin-product-form-error"
              className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              <p>{formError.message}</p>
              {formError.details && formError.details.length > 0 && (
                <ul className="mt-1 list-disc pl-5">
                  {formError.details.map((detail, index) => (
                    <li key={index}>
                      {detail.field}: {detail.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form
            onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            noValidate
            className="mt-4 space-y-4"
          >
            <div>
              <label htmlFor="admin-product-name" className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="admin-product-name"
                type="text"
                data-testid="admin-product-name-input"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'admin-product-name-error' : undefined}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                {...register('name')}
              />
              {errors.name && (
                <p
                  id="admin-product-name-error"
                  data-testid="admin-product-name-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="admin-product-description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="admin-product-description"
                data-testid="admin-product-description-input"
                aria-invalid={errors.description ? 'true' : 'false'}
                aria-describedby={errors.description ? 'admin-product-description-error' : undefined}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                {...register('description')}
              />
              {errors.description && (
                <p
                  id="admin-product-description-error"
                  data-testid="admin-product-description-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="admin-product-price" className="block text-sm font-medium text-slate-700">
                  Price (£)
                </label>
                <input
                  id="admin-product-price"
                  type="number"
                  step="0.01"
                  data-testid="admin-product-price-input"
                  aria-invalid={errors.pricePounds ? 'true' : 'false'}
                  aria-describedby={errors.pricePounds ? 'admin-product-price-error' : undefined}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  {...register('pricePounds')}
                />
                {errors.pricePounds && (
                  <p
                    id="admin-product-price-error"
                    data-testid="admin-product-price-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.pricePounds.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin-product-stock" className="block text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  id="admin-product-stock"
                  type="number"
                  step="1"
                  data-testid="admin-product-stock-input"
                  aria-invalid={errors.stock ? 'true' : 'false'}
                  aria-describedby={errors.stock ? 'admin-product-stock-error' : undefined}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  {...register('stock')}
                />
                {errors.stock && (
                  <p
                    id="admin-product-stock-error"
                    data-testid="admin-product-stock-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="admin-product-category" className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                id="admin-product-category"
                data-testid="admin-product-category-select"
                aria-invalid={errors.categoryId ? 'true' : 'false'}
                aria-describedby={errors.categoryId ? 'admin-product-category-error' : undefined}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                {...register('categoryId')}
              >
                <option value="">Choose a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p
                  id="admin-product-category-error"
                  data-testid="admin-product-category-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="admin-product-active"
                type="checkbox"
                data-testid="admin-product-active-checkbox"
                className="rounded border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                {...register('isActive')}
              />
              <label htmlFor="admin-product-active" className="text-sm font-medium text-slate-700">
                Active
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                data-testid="admin-product-form-submit"
                disabled={formMutation.isPending}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editing ? 'Save changes' : 'Create product'}
              </button>
              <button
                type="button"
                onClick={handleFormCancel}
                data-testid="admin-product-form-cancel"
                className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && (
        <div data-testid="admin-products-loading" className="mt-6 space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-10 animate-pulse rounded bg-slate-200" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load products." onRetry={() => void refetch()} />}

      {data && (
        <div className="mt-6 overflow-x-auto">
          <table data-testid="admin-products-table" className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Stock</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  updateProduct={updateProduct}
                  deleteProduct={deleteProduct}
                  deletingSlug={deletingSlug}
                  setDeletingSlug={setDeletingSlug}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={page <= 1}
            data-testid="admin-products-prev"
            className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span data-testid="admin-products-page-info" className="text-sm text-slate-600">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= data.totalPages}
            data-testid="admin-products-next"
            className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../../api/admin.ts';
import { ApiError } from '../../api/client.ts';
import { categorySchema, type CategoryFormValues } from '../../lib/validation.ts';
import ErrorState from '../../components/ErrorState.tsx';
import type { Category } from '../../api/types.ts';

interface CategoryRowProps {
  category: Category;
  renamingId: number | null;
  setRenamingId: (id: number | null) => void;
  renameValue: string;
  setRenameValue: (value: string) => void;
  updateCategory: ReturnType<typeof useUpdateCategory>;
  deletingId: number | null;
  setDeletingId: (id: number | null) => void;
  deleteCategory: ReturnType<typeof useDeleteCategory>;
}

function CategoryRow({
  category,
  renamingId,
  setRenamingId,
  renameValue,
  setRenameValue,
  updateCategory,
  deletingId,
  setDeletingId,
  deleteCategory,
}: CategoryRowProps) {
  const { slug } = category;
  const isRenaming = renamingId === category.id;
  const isDeleting = deletingId === category.id;
  const isSavingThis = updateCategory.isPending && updateCategory.variables?.id === category.id;
  const isDeletingThis = deleteCategory.isPending && deleteCategory.variables === category.id;

  return (
    <tr data-testid={`admin-category-row-${slug}`} className="border-t border-slate-200">
      <td className="px-3 py-2">
        {isRenaming ? (
          <input
            type="text"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            data-testid={`admin-category-rename-input-${slug}`}
            className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
        ) : (
          category.name
        )}
      </td>
      <td className="px-3 py-2">{slug}</td>
      <td className="px-3 py-2" data-testid={`admin-category-count-${slug}`}>
        {category.productCount}
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {isRenaming ? (
            <>
              <button
                type="button"
                onClick={() =>
                  updateCategory.mutate(
                    { id: category.id, name: renameValue },
                    { onSuccess: () => setRenamingId(null) },
                  )
                }
                disabled={isSavingThis}
                data-testid={`admin-category-rename-save-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setRenamingId(null)}
                data-testid={`admin-category-rename-cancel-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Cancel
              </button>
            </>
          ) : isDeleting ? (
            <>
              <button
                type="button"
                onClick={() =>
                  deleteCategory.mutate(category.id, { onSettled: () => setDeletingId(null) })
                }
                disabled={isDeletingThis}
                data-testid={`admin-category-delete-confirm-${slug}`}
                className="rounded border border-red-300 px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeletingThis}
                data-testid={`admin-category-delete-cancel-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setRenamingId(category.id);
                  setRenameValue(category.name);
                }}
                data-testid={`admin-category-rename-${slug}`}
                className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(category.id)}
                data-testid={`admin-category-delete-${slug}`}
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

function AdminCategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  function onSubmit(values: CategoryFormValues) {
    createCategory.mutate(values, { onSuccess: () => reset() });
  }

  const sharedError = createCategory.isError
    ? createCategory.error
    : updateCategory.isError
      ? updateCategory.error
      : deleteCategory.isError
        ? deleteCategory.error
        : null;
  const serverError = sharedError instanceof ApiError ? sharedError.message : null;

  return (
    <div>
      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
        className="flex items-start gap-3"
      >
        <div>
          <label htmlFor="admin-category-name" className="sr-only">
            Category name
          </label>
          <input
            id="admin-category-name"
            type="text"
            data-testid="admin-category-name-input"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'admin-category-name-error' : undefined}
            placeholder="New category name"
            className="rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            {...register('name')}
          />
          {errors.name && (
            <p
              id="admin-category-name-error"
              data-testid="admin-category-name-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.name.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={createCategory.isPending}
          data-testid="admin-category-create-button"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add category
        </button>
      </form>

      {serverError && (
        <div
          data-testid="admin-categories-error"
          className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {isLoading && (
        <div data-testid="admin-categories-loading" className="mt-6 space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-10 animate-pulse rounded bg-slate-200" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load categories." onRetry={() => void refetch()} />}

      {categories && (
        <div className="mt-6 overflow-x-auto">
          <table data-testid="admin-categories-table" className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Slug</th>
                <th className="px-3 py-2 font-medium">Products</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  renamingId={renamingId}
                  setRenamingId={setRenamingId}
                  renameValue={renameValue}
                  setRenameValue={setRenameValue}
                  updateCategory={updateCategory}
                  deletingId={deletingId}
                  setDeletingId={setDeletingId}
                  deleteCategory={deleteCategory}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCategoriesPage;

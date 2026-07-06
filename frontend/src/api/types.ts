export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  pricePence: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

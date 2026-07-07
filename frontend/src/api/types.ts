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

export interface BasketItem {
  productId: number;
  name: string;
  slug: string;
  pricePence: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  quantity: number;
  lineTotalPence: number;
}

export interface Basket {
  items: BasketItem[];
  totalPence: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  unitPricePence: number;
  quantity: number;
  lineTotalPence: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalPence: number;
  createdAt: string;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingPostcode: string;
  items: OrderItem[];
}

// Shape of each entry in a 400 STOCK_CONFLICT error's `details` — distinct from the
// `{ field, message }` validation-error details above, so callers must check
// `error.code === 'STOCK_CONFLICT'` before treating `details` as this shape.
export interface CheckoutFailureDetail {
  productId: number;
  slug: string;
  name: string;
  reason: string;
}

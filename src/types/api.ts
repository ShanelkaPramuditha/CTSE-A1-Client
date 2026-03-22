// Pagination and search parameters for API requests
export interface PaginationParams {
  limit?: number;
  skip?: number;
}

export interface DateRangeParams {
  from?: Date | undefined | null;
  to?: Date | undefined | null;
}

export interface SearchParams {
  search?: string;
}

export interface DefaultQueryParams extends PaginationParams, SearchParams {}

// Product data returned by the gateway
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  orderedQuantity: number;
  availableStock: number;
}

// Product creation payload
export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

// PaginationApiResponse interface for consistent API responses
export interface PaginationApiResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  hasMore: boolean;
}

// Default values for consistency
export const DEFAULT_PAGINATION = {
  limit: 10,
  skip: 0,
} as const;

export const DEFAULT_DATE_RANGE = {
  from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // Default to one year ago
  to: new Date(), // Default to today
} as const;

export const DEFAULT_SEARCH = {
  search: '',
} as const;

// Default query parameters for API requests
export const DEFAULT_QUERY_PARAMS: Required<DefaultQueryParams> = {
  ...DEFAULT_PAGINATION,
  ...DEFAULT_SEARCH,
} as const;

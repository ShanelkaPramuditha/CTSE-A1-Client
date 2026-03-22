export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  totalOrders?: number;
  orderedQuantity?: number;
  availableStock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidateStockResponse {
  valid: boolean;
  productId: string;
  productName?: string;
  availableStock?: number;
  requestedQuantity: number;
  price?: number;
}

export interface PagedProductsResponse {
  data: Product[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  categories: string[];
}

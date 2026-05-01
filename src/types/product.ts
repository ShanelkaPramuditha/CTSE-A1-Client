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

export interface PagedProductsResponse {
  data: Product[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  categories: string[];
}

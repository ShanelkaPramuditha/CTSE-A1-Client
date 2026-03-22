export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  /** Public URL for product image; omit or empty when none */
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  orderedQuantity: number;
  availableStock: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface ValidateStockPayload {
  productId: string;
  quantity: number;
}

export interface ValidateStockResponse {
  valid: boolean;
  productId: string;
  productName?: string;
  availableStock?: number;
  requestedQuantity: number;
  price?: number;
}

export interface DeleteProductResponse {
  deleted: boolean;
  productId: string;
}

import { apiClient } from '@/lib/api';
import type {
  Product,
  PaginationApiResponse,
  CreateProductPayload,
  PaginationParams,
} from '@/types/api';

export const productService = {
  getProducts: async (skip: number = 0, limit: number = 10): Promise<PaginationApiResponse<Product>> => {
    return apiClient.get('/products', {
      params: { skip, limit },
    });
  },

  getProductById: async (productId: string): Promise<Product> => {
    return apiClient.get(`/products/${productId}`);
  },

  createProduct: async (data: CreateProductPayload): Promise<Product> => {
    return apiClient.post('/products', data);
  },

  validateStock: async (
    productId: string,
    quantity: number,
  ): Promise<{ available: boolean; availableStock: number }> => {
    return apiClient.post('/products/validate-stock', {
      productId,
      quantity,
    });
  },
};

import { apiClient } from '@/lib/api';
import type { PagedProductsResponse, Product } from '@/types/product';

export const productService = {
  getProducts: async (params: {
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<PagedProductsResponse> => {
    const response = await apiClient.get('/products', {
      params,
    });
    return response as PagedProductsResponse;
  },

  getProductById: async (productId: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${productId}`);
    return response as Product;
  },
};

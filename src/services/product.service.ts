import { apiClient } from '@/lib/api';
import type { PagedProductsResponse, Product, ValidateStockResponse } from '@/types/product';

export const productService = {
  getProducts: async (params: {
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<PagedProductsResponse> => {
    const response = await apiClient.get('/products', {
      params,
    });
    return response as unknown as PagedProductsResponse;
  },

  getProductById: async (productId: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${productId}`);
    return response as unknown as Product;
  },

  validateStock: async (payload: {
    productId: string;
    quantity: number;
  }): Promise<ValidateStockResponse> => {
    const response = await apiClient.post('/products/validate-stock', payload);
    return response as unknown as ValidateStockResponse;
  },

  createProduct: async (payload: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
  }): Promise<Product> => {
    const response = await apiClient.post('/products', payload);
    return response as unknown as Product;
  },

  deleteProduct: async (productId: string): Promise<{ success: boolean } | void> => {
    const response = await apiClient.delete(`/products/${productId}`);
    return response as unknown as { success: boolean } | void;
  },
};

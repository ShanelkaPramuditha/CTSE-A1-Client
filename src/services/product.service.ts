import { apiClient } from '@/lib/api';
import {
  toProduct,
  toProductList,
  toDeleteProductResponse,
  toValidateStockResponse,
} from '@/mappers/product.mapper';
import type {
  CreateProductPayload,
  DeleteProductResponse,
  Product,
  ValidateStockPayload,
  ValidateStockResponse,
} from '@/types/product';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<unknown>('/products');
    return toProductList(response);
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<unknown>(`/products/${id}`);
    return toProduct(response);
  },

  createProduct: async (data: CreateProductPayload): Promise<Product> => {
    const response = await apiClient.post<unknown>('/products', data);
    return toProduct(response);
  },

  validateStock: async (data: ValidateStockPayload): Promise<ValidateStockResponse> => {
    const response = await apiClient.post<unknown>('/products/validate-stock', data);
    return toValidateStockResponse(response);
  },

  deleteProduct: async (productId: string): Promise<DeleteProductResponse> => {
    const response = await apiClient.delete<unknown>(`/products/${productId}`);
    return toDeleteProductResponse(response);
  },
};

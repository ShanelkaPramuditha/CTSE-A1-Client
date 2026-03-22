import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type { Product, CreateProductPayload, PaginationApiResponse } from '@/types/api';

export const PRODUCTS_QUERY_KEY = ['products'] as const;
export const PRODUCT_QUERY_KEY = (productId: string) => ['product', productId] as const;

export const useProducts = ({ skip = 0, limit = 10 }: { skip?: number; limit?: number }) => {
  return useQuery<PaginationApiResponse<Product>>({
    queryKey: [...PRODUCTS_QUERY_KEY, skip, limit],
    queryFn: () => productService.getProducts(skip, limit),
    retry: 1,
  });
};

export const useProduct = (productId?: string | null) => {
  return useQuery<Product>({
    queryKey: productId ? PRODUCT_QUERY_KEY(productId) : ['disabled'],
    queryFn: () => {
      if (!productId) throw new Error('Product ID is required');
      return productService.getProductById(productId);
    },
    retry: 1,
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductPayload) => productService.createProduct(data),
    onSuccess: () => {
      // Invalidate products list so it refetches with new product
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};

export const useValidateStock = () => {
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      productService.validateStock(productId, quantity),
  });
};

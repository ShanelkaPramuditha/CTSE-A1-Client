import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type { CreateProductPayload, ValidateStockPayload } from '@/types/product';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.all,
    queryFn: () => productService.getProducts(),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: id.length > 0,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductPayload) => productService.createProduct(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
};

export const useValidateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ValidateStockPayload) => productService.validateStock(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onSuccess: (_data, productId) => {
      void queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      void queryClient.removeQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(productId) });
    },
  });
};

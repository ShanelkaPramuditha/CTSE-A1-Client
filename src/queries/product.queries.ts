import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type { PagedProductsResponse } from '@/types/product';

const PRODUCTS_PAGE_SIZE = 12;

export const useInfiniteProducts = (category?: string) => {
  return useInfiniteQuery<PagedProductsResponse>({
    queryKey: ['products', 'infinite', PRODUCTS_PAGE_SIZE, category ?? 'all'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productService.getProducts({
        limit: PRODUCTS_PAGE_SIZE,
        offset: Number(pageParam) || 0,
        category,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.offset + lastPage.limit;
    },
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof productService.createProduct>[0]) =>
      productService.createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-products']);
      qc.invalidateQueries(['products']);
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onSuccess: () => {
      qc.invalidateQueries(['admin-products']);
      qc.invalidateQueries(['products']);
    },
  });
};

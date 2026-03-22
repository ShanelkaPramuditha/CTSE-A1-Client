import { useInfiniteQuery } from '@tanstack/react-query';
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

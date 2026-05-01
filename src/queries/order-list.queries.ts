import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';

export const ORDER_LIST_QUERY_KEY = ['orders'] as const;

export const useOrders = () => {
  return useQuery({
    queryKey: ORDER_LIST_QUERY_KEY,
    queryFn: () => orderService.getOrders(),
  });
};

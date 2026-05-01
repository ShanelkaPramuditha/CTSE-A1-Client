import { apiClient } from '@/lib/api';
import type { Order } from '@/types/order';

export const orderService = {
  checkout: async (): Promise<Order> => {
    const response = await apiClient.post('/orders/checkout');
    return response as Order;
  },
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response as Order[];
  },
};

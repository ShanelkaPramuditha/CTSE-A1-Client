import { apiClient } from '@/lib/api';
import type { Order } from '@/types/order';
import type { CheckoutSchema } from '@/schemas/order/checkout.schema';

export const orderService = {
  checkout: async (payload: CheckoutSchema): Promise<Order> => {
    const response = await apiClient.post('/orders/checkout', payload);
    return response as Order;
  },
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response as Order[];
  },
};

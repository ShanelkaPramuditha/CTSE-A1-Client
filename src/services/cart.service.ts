import { apiClient } from '@/lib/api';
import { toCart } from '@/mappers/cart.mapper';
import type {
  Cart,
  AddCartItemPayload,
  UpdateCartItemPayload,
  RemoveCartItemPayload,
} from '@/types/cart';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get('/cart');
    return toCart(response);
  },

  addItem: async (data: AddCartItemPayload): Promise<Cart> => {
    const response = await apiClient.post('/cart/items', data);
    return toCart(response);
  },

  updateItem: async (data: UpdateCartItemPayload): Promise<Cart> => {
    const response = await apiClient.patch('/cart/items', data);
    return toCart(response);
  },

  removeItem: async (data: RemoveCartItemPayload): Promise<Cart> => {
    const response = await apiClient.delete('/cart/items', { data });
    return toCart(response);
  },

  clearCart: async (): Promise<Cart> => {
    const response = await apiClient.delete('/cart');
    return toCart(response);
  },
};

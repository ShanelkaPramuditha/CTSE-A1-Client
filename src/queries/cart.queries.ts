import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import type {
  AddCartItemPayload,
  UpdateCartItemPayload,
  RemoveCartItemPayload,
} from '@/types/cart';

export const CART_QUERY_KEY = ['cart'] as const;

export const useCart = (enabled = true) => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCart(),
    retry: false,
    enabled,
  });
};

export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddCartItemPayload) => cartService.addItem(data),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCartItemPayload) => cartService.updateItem(data),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RemoveCartItemPayload) => cartService.removeItem(data),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

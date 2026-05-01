import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { CART_QUERY_KEY } from '@/queries/cart.queries';

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderService.checkout(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

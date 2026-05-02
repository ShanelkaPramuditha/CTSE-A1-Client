import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { CART_QUERY_KEY } from '@/queries/cart.queries';
import type { CheckoutSchema } from '@/schemas/order/checkout.schema';

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutSchema) => orderService.checkout(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

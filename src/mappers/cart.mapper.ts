import type { Cart } from '@/types/cart';
import { cartResponseSchema } from '@/schemas/cart/cart.schema';

export const toCart = (data: unknown): Cart => {
  const parsed = cartResponseSchema.parse(data);

  return {
    _id: parsed._id,
    userId: parsed.userId,
    items: parsed.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    totalAmount: parsed.totalAmount,
  };
};

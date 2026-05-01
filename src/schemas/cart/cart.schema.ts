import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  image: z.string().optional(),
});

export const cartResponseSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  items: z.array(cartItemSchema),
  totalAmount: z.number(),
});

export type CartResponseSchema = z.infer<typeof cartResponseSchema>;
export type CartItemSchema = z.infer<typeof cartItemSchema>;

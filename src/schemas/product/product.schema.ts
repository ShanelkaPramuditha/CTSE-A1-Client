import { z } from 'zod';

export const productDtoSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  category: z.string(),
  imageUrl: z
    .union([z.string().url(), z.literal('')])
    .optional()
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  totalOrders: z.number().optional(),
  orderedQuantity: z.number().optional(),
  availableStock: z.number().optional(),
  __v: z.number().optional(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().trim().min(1, 'Category is required'),
  imageUrl: z
    .string()
    .trim()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Enter a valid image URL',
    }),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

export const validateStockResponseSchema = z.object({
  valid: z.boolean(),
  productId: z.string(),
  productName: z.string().optional(),
  availableStock: z.number().optional(),
  requestedQuantity: z.number(),
  price: z.number().optional(),
});

export const deleteProductResponseSchema = z.object({
  deleted: z.boolean(),
  productId: z.string(),
});

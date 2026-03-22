import { z } from 'zod';

import type { DeleteProductResponse, Product, ValidateStockResponse } from '@/types/product';
import {
  productDtoSchema,
  deleteProductResponseSchema,
  validateStockResponseSchema,
} from '@/schemas/product/product.schema';

function normalizeImageUrl(url: string | null | undefined): string | undefined {
  if (url == null || url.trim() === '') return undefined;
  return url.trim();
}

export const toProduct = (data: unknown): Product => {
  const parsed = productDtoSchema.parse(data);
  return {
    id: parsed._id,
    name: parsed.name,
    description: parsed.description,
    price: parsed.price,
    stock: parsed.stock,
    category: parsed.category,
    imageUrl: normalizeImageUrl(parsed.imageUrl),
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
  };
};

export const toProductList = (data: unknown): Product[] => {
  const list = z.array(productDtoSchema).parse(data);
  return list.map((p) => ({
    id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    category: p.category,
    imageUrl: normalizeImageUrl(p.imageUrl),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
};

export const toValidateStockResponse = (data: unknown): ValidateStockResponse => {
  return validateStockResponseSchema.parse(data);
};

export const toDeleteProductResponse = (data: unknown): DeleteProductResponse => {
  return deleteProductResponseSchema.parse(data);
};

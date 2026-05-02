import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(7, 'Phone is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const cardDetailsSchema = z.object({
  cardHolderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().min(8, 'Card number is required'),
  expiryMonth: z.string().min(1, 'Expiry month is required'),
  expiryYear: z.string().min(2, 'Expiry year is required'),
  cvv: z.string().min(3, 'CVV is required'),
});

export const checkoutSchema = z.discriminatedUnion('paymentMethod', [
  z.object({
    paymentMethod: z.literal('COD'),
    address: shippingAddressSchema,
    card: z.undefined().optional(),
  }),
  z.object({
    paymentMethod: z.literal('CARD'),
    address: shippingAddressSchema,
    card: cardDetailsSchema,
  }),
]);

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
export type PaymentMethod = CheckoutSchema['paymentMethod'];

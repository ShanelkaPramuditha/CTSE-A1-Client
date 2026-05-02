export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentId?: string;
  paymentMethod?: 'COD' | 'CARD';
  shippingAddress?: ShippingAddress;
  createdAt?: string;
  updatedAt?: string;
}

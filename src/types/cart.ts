export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

export interface AddCartItemPayload {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

export interface RemoveCartItemPayload {
  productId: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export type DashboardRange = '7d' | '30d' | '90d' | '365d' | 'all';

export interface UserDashboardStats {
  profile: User;
  integration: {
    orderServiceConnected: boolean;
    paymentServiceConnected: boolean;
  };
  metrics: {
    totalOrders: number;
    totalSpent: number;
    paidOrders: number;
    pendingOrders: number;
    failedOrders: number;
    confirmedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalItemsOrdered: number;
    averageOrderValue: number;
    weeklyAverageOrderValue: number;
    monthlyAverageOrderValue: number;
    weeklyOrderCount: number;
    monthlyOrderCount: number;
    lastOrderDate: string | null;
    successfulPayments: number;
    failedPayments: number;
    successfulPaymentAmount: number;
    failedPaymentAmount: number;
    paymentSuccessRate: number;
  };
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    totalAmount: number;
  }>;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

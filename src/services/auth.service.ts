import { apiClient } from '@/lib/api';
import type { SignInSchema, SignUpSchema } from '@/schemas/auth/auth.schema';
import type { AuthResponse, DashboardRange, User, UserDashboardStats } from '@/types/auth';
import { toAuthResponse, toUser } from '@/mappers/auth.mapper';

export const authService = {
  login: async (data: SignInSchema): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return toAuthResponse(response);
  },

  register: async (data: SignUpSchema): Promise<void> => {
    await apiClient.post('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getProfile: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/users/profile');
      return toUser(response);
    } catch {
      return null;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch('/users/profile', data);
    return toUser(response);
  },

  changePassword: async (data: Record<string, string>): Promise<void> => {
    await apiClient.patch('/users/change-password', data);
  },

  getDashboardStats: async (range: DashboardRange = '30d'): Promise<UserDashboardStats> => {
    return apiClient.get('/users/dashboard-stats', {
      params: { range },
    });
  },
};

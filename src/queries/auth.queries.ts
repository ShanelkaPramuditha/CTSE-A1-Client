import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { SignInSchema, SignUpSchema } from '@/schemas/auth/auth.schema';
import type { User } from '@/types/auth';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/constants/storage';

export const useProfile = () => {
  return useQuery<User | null>({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SignInSchema) => authService.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: SignUpSchema) => authService.register(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      queryClient.setQueryData(['profile'], null);
      queryClient.clear(); // Clear all cached data on logout
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => authService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: Record<string, string>) => authService.changePassword(data),
  });
};

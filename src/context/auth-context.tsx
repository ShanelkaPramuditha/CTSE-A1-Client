import { createContext, useMemo, type ReactNode } from 'react';
import type { User, AuthResponse } from '@/types/auth';
import type { SignInSchema, SignUpSchema } from '@/schemas/auth/auth.schema';
import {
  useProfile,
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
  useChangePassword,
} from '@/queries/auth.queries';

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: SignInSchema) => Promise<AuthResponse>;
  register: (data: SignUpSchema) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  changePassword: (data: Record<string, string>) => Promise<void>;
  refetch: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, refetch } = useProfile();
  const signInMutation = useLogin();
  const signUpMutation = useRegister();
  const signOutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading,
      login: (data) => signInMutation.mutateAsync(data),
      register: (data) => signUpMutation.mutateAsync(data),
      logout: () => signOutMutation.mutateAsync(),
      updateProfile: (data) => updateProfileMutation.mutateAsync(data),
      changePassword: (data) => changePasswordMutation.mutateAsync(data),
      refetch,
    }),
    [
      user,
      isLoading,
      signInMutation,
      signUpMutation,
      signOutMutation,
      updateProfileMutation,
      changePasswordMutation,
      refetch,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

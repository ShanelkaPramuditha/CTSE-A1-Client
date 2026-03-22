import { UserRole } from '@/types/auth';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const userResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.email(),
  avatar: z.string().optional(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: userResponseSchema,
});

export type AuthResponseSchema = z.infer<typeof authResponseSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

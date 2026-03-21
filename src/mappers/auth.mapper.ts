import { UserRole, type User, type AuthResponse } from '@/types/auth';
import { userResponseSchema, authResponseSchema } from '@/schemas/auth/auth.schema';

export const toUser = (data: unknown): User => {
  const parsed = userResponseSchema.parse(data);

  return {
    id: parsed._id,
    name: parsed.name,
    email: parsed.email,
    avatar: parsed.avatar,
    role: (parsed.role as UserRole) || UserRole.USER,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
  };
};

export const toAuthResponse = (data: unknown): AuthResponse => {
  const parsed = authResponseSchema.parse(data);

  return {
    accessToken: parsed.accessToken,
    user: toUser(parsed.user),
  };
};

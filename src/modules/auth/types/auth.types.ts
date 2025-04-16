import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'VENDOR', 'CUSTOMER']).default('CUSTOMER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface TokenPayload {
  userId: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
} 
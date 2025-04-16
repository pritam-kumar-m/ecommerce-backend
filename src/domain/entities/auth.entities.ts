import { Role } from '@prisma/client';
import { Permission } from '../../core/constants/permissions';

export interface TokenPayload {
  userId: string;
  role: Role;
  permissions?: Permission[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
} 
import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { LoginInput, RegisterInput, AuthTokens, TokenPayload } from '../entities/auth.entities';
import { UnauthorizedError, BadRequestError } from '../../core/errors/AppError';
import { appConfig } from '../../core/config/app.config';

export class AuthService {
  private prisma: PrismaClient;
  private tokenBlacklist: Set<string> = new Set();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(data: RegisterInput): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    const { email, password, name, role = 'CUSTOMER' } = data;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as Role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role);

    return { user, tokens };
  }

  async login(data: LoginInput): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    const { email, password } = data;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    // Add token to blacklist
    this.tokenBlacklist.add(refreshToken);
    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    // Check if token is blacklisted
    if (this.tokenBlacklist.has(refreshToken)) {
      throw new UnauthorizedError('Token has been revoked');
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, appConfig.jwtRefreshSecret) as TokenPayload;
      
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Generate new tokens
      return this.generateTokens(user.id, user.role);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  private generateTokens(userId: string, role: Role): AuthTokens {
    const accessToken = jwt.sign(
      { userId, role },
      appConfig.jwtSecret as Secret,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      appConfig.jwtRefreshSecret as Secret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
} 
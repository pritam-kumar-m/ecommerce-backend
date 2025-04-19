import { PrismaClient, User, Role } from '@prisma/client';
import { CreateUserInput, UpdateUserInput, UserFilter } from '../types/auth.types';
import { hash } from 'bcrypt';
import { AppError } from '../../../core/errors/AppError';

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const hashedPassword = await hash(input.password, 10);

    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role || Role.CUSTOMER,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async getUsers(filter: UserFilter): Promise<{ users: User[]; total: number }> {
    const { search, role, page, limit, sortBy, sortOrder } = filter;
    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    // Build sort conditions
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          password: true, // Include password in response
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If updating email, check if new email is already taken
    if (input.email && input.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }
    }

    // If updating password, hash it
    let updateData: any = { ...input };
    if (input.password) {
      updateData.password = await hash(input.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true, // Include password in response
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true, // Include password in response
      },
    });
  }
} 
import { PrismaClient } from '@prisma/client';
import { IRepository } from '../../core/interfaces/repository.interface';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError';

export abstract class PrismaRepository<T> implements IRepository<T> {
  protected prisma: PrismaClient;
  protected modelName: keyof PrismaClient;

  constructor(prisma: PrismaClient, modelName: keyof PrismaClient) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  async findById(id: string): Promise<T | null> {
    try {
      const result = await (this.prisma[this.modelName] as any).findUnique({
        where: { id },
      });
      return result;
    } catch (error: any) {
      this.handlePrismaError(error);
      return null; // This line will never be reached due to the error handling
    }
  }

  async findAll(filter: any = {}): Promise<T[]> {
    try {
      const { skip, take, ...where } = filter;
      return (this.prisma[this.modelName] as any).findMany({
        where,
        skip,
        take,
        orderBy: filter.orderBy,
      });
    } catch (error: any) {
      this.handlePrismaError(error);
      return []; // This line will never be reached due to the error handling
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return (this.prisma[this.modelName] as any).create({
        data,
      });
    } catch (error: any) {
      this.handlePrismaError(error);
      throw error; // This will be caught by the controller
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      return await (this.prisma[this.modelName] as any).update({
        where: { id },
        data,
      });
    } catch (error: any) {
      this.handlePrismaError(error);
      throw error; // This will be caught by the controller
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await (this.prisma[this.modelName] as any).delete({
        where: { id },
      });
    } catch (error: any) {
      this.handlePrismaError(error);
      throw error; // This will be caught by the controller
    }
  }

  async count(filter: any = {}): Promise<number> {
    try {
      const { skip, take, ...where } = filter;
      return (this.prisma[this.modelName] as any).count({
        where,
      });
    } catch (error: any) {
      this.handlePrismaError(error);
      return 0; // This line will never be reached due to the error handling
    }
  }

  protected handlePrismaError(error: any): void {
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      throw new BadRequestError(`Unique constraint violation: ${error.meta?.target?.join(', ')}`);
    }
    
    // Handle foreign key constraint violations
    if (error.code === 'P2003') {
      throw new BadRequestError(`Foreign key constraint violation: ${error.meta?.field_name}`);
    }
    
    // Handle missing required fields
    if (error.message?.includes('Argument') && error.message?.includes('missing')) {
      const missingField = error.message.match(/Argument `([^`]+)` is missing/)?.[1];
      throw new BadRequestError(`Required field missing: ${missingField}`);
    }
    
    // Handle malformed ObjectID errors (MongoDB specific)
    if (error.code === 'P2023' && error.message?.includes('Malformed ObjectID')) {
      throw new BadRequestError(`Invalid ID format: ${error.meta?.message || 'The provided ID is not in the correct format'}`);
    }
    
    // Handle record not found errors
    if (error.code === 'P2025') {
      throw new NotFoundError(`${String(this.modelName)} not found`);
    }
    
    // For any other Prisma errors
    if (error.code?.startsWith('P')) {
      throw new BadRequestError(`Database error: ${error.message}`);
    }
    
    // For any other errors
    throw error;
  }
} 
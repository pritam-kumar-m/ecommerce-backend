import { PrismaClient, Category, Prisma } from '@prisma/client';
import { PrismaRepository } from '../database/PrismaRepository';
import { CategoryFilter } from '../../domain/entities/product.entities';
import { BadRequestError } from '../../core/errors/AppError';

export class CategoryRepository extends PrismaRepository<Category> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    super(prisma, 'category');
    this.prisma = prisma;
  }

  protected handlePrismaError(error: any): never {
    console.error('Prisma error in CategoryRepository:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new BadRequestError(`Unique constraint violation: ${(error.meta?.target as string[])?.join(', ')}`);
        case 'P2025':
          throw new BadRequestError('Record not found');
        default:
          throw new BadRequestError(`Database error: ${error.message}`);
      }
    }
    
    throw new BadRequestError('An unexpected error occurred');
  }

  async findAllWithFilters(filter: CategoryFilter): Promise<{ categories: Category[]; total: number }> {
    try {
      const { page = 1, limit = 10, search } = filter;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: Prisma.CategoryWhereInput = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: search, mode: Prisma.QueryMode.insensitive } }
          ]
        })
      };

      // Check if there are any categories in the database
      const count = await this.prisma.category.count({ where });
      if (count === 0) {
        console.log('No categories found in database');
        return { categories: [], total: 0 };
      }

      const [categories, total] = await Promise.all([
        this.prisma.category.findMany({
          where,
          skip,
          take,
          include: {
            _count: {
              select: { products: true }
            }
          }
        }),
        this.prisma.category.count({ where })
      ]);

      console.log(`Found ${categories.length} categories out of ${total} total`);
      return { categories, total };
    } catch (error) {
      console.error('Error in findAllWithFilters:', error);
      this.handlePrismaError(error);
      return { categories: [], total: 0 }; // This line will never be reached due to the error handling
    }
  }
} 
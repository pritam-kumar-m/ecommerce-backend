import { PrismaClient, Product, Prisma } from '@prisma/client';
import { PrismaRepository } from '../database/PrismaRepository';
import { ProductFilter, CategoryFilter } from '../../domain/entities/product.entities';
import { BadRequestError } from '../../core/errors/AppError';

export class ProductRepository extends PrismaRepository<Product> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    super(prisma, 'product');
    this.prisma = prisma;
  }

  protected handlePrismaError(error: any): never {
    console.error('Prisma error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new BadRequestError('A unique constraint would be violated');
        case 'P2025':
          throw new BadRequestError('Record not found');
        default:
          throw new BadRequestError(`Database error: ${error.message}`);
      }
    }
    throw new BadRequestError('An unexpected error occurred');
  }

  async findBySku(sku: string): Promise<Product | null> {
    try {
      return await this.prisma.product.findUnique({
        where: { sku },
      });
    } catch (error) {
      this.handlePrismaError(error);
      return null;
    }
  }

  async findAllWithFilters(filter: ProductFilter): Promise<{ 
    products: Product[]; 
    total: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalItems: number;
    }
  }> {
    try {
      console.log('Starting findAllWithFilters with filter:', JSON.stringify(filter, null, 2));
      
      const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice, tags, availability, minSalePrice, maxSalePrice } = filter;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.ProductWhereInput = {};

      // Add search condition if provided
      if (search) {
        where.OR = [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { sku: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ];
      }

      // Add category filter if provided
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Add price range filter if provided
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      // Add sale price range filter if provided
      if (minSalePrice !== undefined || maxSalePrice !== undefined) {
        where.sale_price = {};
        if (minSalePrice !== undefined) where.sale_price.gte = minSalePrice;
        if (maxSalePrice !== undefined) where.sale_price.lte = maxSalePrice;
      }

      // Add tags filter if provided
      if (tags && tags.length > 0) {
        where.tags = {
          hasEvery: tags,
        };
      }

      // Add availability filter if provided
      if (availability !== undefined) {
        where.availability = availability;
      }

      console.log('Final where clause:', JSON.stringify(where, null, 2));

      // Check if there are any products in the database
      const totalItems = await this.prisma.product.count({ where });
      if (totalItems === 0) {
        console.log('No products found in database');
        return { 
          products: [], 
          total: 0,
          pagination: {
            currentPage: page,
            totalPages: 0,
            limit,
            totalItems: 0
          }
        };
      }

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          include: {
            category: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.product.count({ where }),
      ]);

      // Filter out products with null SKUs
      const filteredProducts = products.filter(product => product.sku !== null);
      const filteredTotal = filteredProducts.length;
      const totalPages = Math.ceil(filteredTotal / limit);

      console.log(`Found ${filteredProducts.length} products out of ${total} total (after filtering null SKUs)`);
      return { 
        products: filteredProducts, 
        total: filteredTotal,
        pagination: {
          currentPage: page,
          totalPages,
          limit,
          totalItems: filteredTotal
        }
      };
    } catch (error) {
      console.error('Error in findAllWithFilters:', error);
      this.handlePrismaError(error);
      return { 
        products: [], 
        total: 0,
        pagination: {
          currentPage: 1,
          totalPages: 0,
          limit: 10,
          totalItems: 0
        }
      }; // This line will never be reached due to the error handling
    }
  }

  async findCategoriesWithFilters(filter: CategoryFilter): Promise<{ categories: any[]; total: number }> {
    try {
      const { page = 1, limit = 10, search } = filter;
      const skip = (page - 1) * limit;

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
          take: limit,
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
      console.error('Error in findCategoriesWithFilters:', error);
      this.handlePrismaError(error);
      return { categories: [], total: 0 }; // This line will never be reached due to the error handling
    }
  }
} 
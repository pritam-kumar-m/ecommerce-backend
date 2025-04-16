import { PrismaClient, Product, Category } from '@prisma/client';
import { CreateProductInput, UpdateProductInput, ProductFilter, CreateCategoryInput, UpdateCategoryInput } from '../types/product.types';

const prisma = new PrismaClient();

class ProductService {
  // Product CRUD operations
  async createProduct(input: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data: input,
      include: {
        category: true,
      },
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: input,
      include: {
        category: true,
      },
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  async getProducts(filter: ProductFilter): Promise<{ products: Product[]; total: number }> {
    const { categoryId, minPrice, maxPrice, search, page, limit } = filter;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  // Category CRUD operations
  async createCategory(input: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({
      data: input,
    });
  }

  async getCategoryById(id: string, page = 1, limit = 10): Promise<{ category: Category | null; products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [category, products, total] = await Promise.all([
      prisma.category.findUnique({
        where: { id },
      }),
      prisma.product.findMany({
        where: { categoryId: id },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({
        where: { categoryId: id },
      }),
    ]);

    return { category, products, total };
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: input,
    });
  }

  async deleteCategory(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getProductsByCategory(categoryId: string, page = 1, limit = 10): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId },
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({
        where: { categoryId },
      }),
    ]);

    return { products, total };
  }
}

export const productService = new ProductService(); 
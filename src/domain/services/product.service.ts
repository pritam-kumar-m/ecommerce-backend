import { Product } from '@prisma/client';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { ProductFilter, CategoryFilter, ProductCreateInput, ProductUpdateInput } from '../entities/product.entities';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError';
import { IService } from '../../core/interfaces/service.interface';

// Define Category type using type assertion
type Category = any;

export class ProductService implements IService<Product> {
  constructor(
    private repository: ProductRepository,
    private categoryRepository: CategoryRepository
  ) { }

  async getAll(filter: ProductFilter = {}): Promise<{ 
    data: Product[]; 
    total: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalItems: number;
    }
  }> {
    try {
      console.log('ProductService.getAll called with filter:', JSON.stringify(filter, null, 2));
      const result = await this.repository.findAllWithFilters(filter);
      console.log('ProductService.getAll result:', JSON.stringify(result, null, 2));
      return {
        data: result.products,
        total: result.total,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error in ProductService.getAll:', error);
      if (error instanceof Error) {
        throw new BadRequestError(`Failed to fetch products: ${error.message}`);
      }
      throw new BadRequestError('Failed to fetch products');
    }
  }

  async getById(id: string): Promise<Product> {
    try {
      const product = await this.repository.findById(id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError('Failed to fetch product');
    }
  }

  async create(data: ProductCreateInput): Promise<Product> {
    try {
      // Check if SKU already exists
      const existingProduct = await this.repository.findBySku(data.sku);
      if (existingProduct) {
        throw new BadRequestError('Product with this SKU already exists');
      }

      // Validate category exists
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new BadRequestError('Category not found');
      }

      // Validate prices
      if (data.sale_price && data.sale_price > data.price) {
        throw new BadRequestError('Sale price cannot be greater than regular price');
      }

      if (data.cost_price > data.retail_price) {
        throw new BadRequestError('Cost price cannot be greater than retail price');
      }

      return await this.repository.create(data);
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError('Failed to create product');
    }
  }

  async update(id: string, data: ProductUpdateInput): Promise<Product> {
    try {
      const existingProduct = await this.repository.findById(id);
      if (!existingProduct) {
        throw new NotFoundError('Product not found');
      }

      // Check if SKU is being updated and if it already exists
      if (data.sku && data.sku !== existingProduct.sku) {
        const skuExists = await this.repository.findBySku(data.sku);
        if (skuExists) {
          throw new BadRequestError('Product with this SKU already exists');
        }
      }

      // Validate category if being updated
      if (data.categoryId) {
        const category = await this.categoryRepository.findById(data.categoryId);
        if (!category) {
          throw new BadRequestError('Category not found');
        }
      }

      // Validate prices if being updated
      if (data.sale_price && data.price && data.sale_price > data.price) {
        throw new BadRequestError('Sale price cannot be greater than regular price');
      }

      if (data.cost_price && data.retail_price && data.cost_price > data.retail_price) {
        throw new BadRequestError('Cost price cannot be greater than retail price');
      }

      return await this.repository.update(id, data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) throw error;
      throw new BadRequestError('Failed to update product');
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const product = await this.repository.findById(id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      return await this.repository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError('Failed to delete product');
    }
  }

  async getAllCategories(filter: CategoryFilter): Promise<{ categories: Category[]; total: number }> {
    try {
      return await this.categoryRepository.findAllWithFilters(filter);
    } catch (error) {
      throw new BadRequestError('Failed to fetch categories');
    }
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    try {
      return await this.categoryRepository.create(data);
    } catch (error) {
      throw new BadRequestError('Failed to create category');
    }
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const category = await this.categoryRepository.update(id, data);
      if (!category) {
        throw new NotFoundError('Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError('Failed to update category');
    }
  }

  async deleteCategory(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.delete(id);
      if (!category) {
        throw new NotFoundError('Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError('Failed to delete category');
    }
  }
}
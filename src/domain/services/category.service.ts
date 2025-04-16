import { Category } from '@prisma/client';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { CategoryFilter } from '../entities/product.entities';
import { NotFoundError } from '../../core/errors/AppError';
import { IService } from '../../core/interfaces/service.interface';

export class CategoryService implements IService<Category> {
  constructor(private repository: CategoryRepository) { }

  async getAll(filter: CategoryFilter = {}): Promise<{ 
    data: Category[]; 
    total: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalItems: number;
    }
  }> {
    const { page = 1, limit = 10 } = filter;
    const result = await this.repository.findAllWithFilters(filter);
    const totalPages = Math.ceil(result.total / limit);
    
    return {
      data: result.categories,
      total: result.total,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalItems: result.total
      }
    };
  }

  async getById(id: string): Promise<Category> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  async create(data: Partial<Category>): Promise<Category> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.repository.update(id, data);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  async delete(id: string): Promise<Category> {
    const category = await this.repository.delete(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }
} 
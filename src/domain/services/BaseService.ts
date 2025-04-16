import { IRepository } from '../../core/interfaces/repository.interface';
import { IService } from '../../core/interfaces/service.interface';
import { NotFoundError } from '../../core/errors/AppError';

export abstract class BaseService<T> implements IService<T> {
  protected repository: IRepository<T>;

  constructor(repository: IRepository<T>) {
    this.repository = repository;
  }

  async getById(id: string): Promise<T | null> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundError(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async getAll(filter: any = {}): Promise<{ 
    data: T[]; 
    total: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalItems: number;
    }
  }> {
    const { page = 1, limit = 10, ...restFilter } = filter;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.findAll({ ...restFilter, skip, take: limit }),
      this.repository.count(restFilter),
    ]);

    return { 
      data, 
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
        totalItems: total
      }
    };
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<T> {
    return this.repository.delete(id);
  }
} 
import { InventoryRepository } from '../../infrastructure/repositories/inventory.repository';
import { InventoryLevel, InventoryOperation, InventoryFilter, InventoryOperationInput, InventoryLevelInput } from '../entities/inventory.entities';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError';
import { IService } from '../../core/interfaces/service.interface';

export class InventoryService implements IService<InventoryLevel> {
  constructor(private repository: InventoryRepository) {}

  async getAll(filter: InventoryFilter = {}): Promise<{ 
    data: InventoryLevel[]; 
    total: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalItems: number;
    }
  }> {
    try {
      const result = await this.repository.findAllWithFilters(filter);
      const { page = 1, limit = 10 } = filter;
      const totalPages = Math.ceil(result.total / limit);
      
      return {
        data: result.data,
        total: result.total,
        pagination: {
          currentPage: page,
          totalPages,
          limit,
          totalItems: result.total
        }
      };
    } catch (error) {
      console.error('Error in InventoryService.getAll:', error);
      throw new BadRequestError('Failed to fetch inventory levels');
    }
  }

  async getById(id: string): Promise<InventoryLevel> {
    try {
      const inventoryLevel = await this.repository.findById(id);
      if (!inventoryLevel) {
        throw new NotFoundError('Inventory level not found');
      }
      return inventoryLevel;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError('Failed to fetch inventory level');
    }
  }

  async create(data: InventoryLevelInput): Promise<InventoryLevel> {
    try {
      const existingLevel = await this.repository.findByProductId(data.productId);
      if (existingLevel) {
        throw new BadRequestError('Inventory level already exists for this product');
      }

      return await this.repository.create(data);
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError('Failed to create inventory level');
    }
  }

  async update(id: string, data: Partial<InventoryLevelInput>): Promise<InventoryLevel> {
    try {
      const existingLevel = await this.repository.findById(id);
      if (!existingLevel) {
        throw new NotFoundError('Inventory level not found');
      }

      return await this.repository.update(id, data);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError('Failed to update inventory level');
    }
  }

  async delete(id: string): Promise<InventoryLevel> {
    try {
      const existingLevel = await this.repository.findById(id);
      if (!existingLevel) {
        throw new NotFoundError('Inventory level not found');
      }

      return await this.repository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError('Failed to delete inventory level');
    }
  }

  async addStock(data: InventoryOperationInput): Promise<InventoryOperation> {
    try {
      return await this.repository.createOperation({
        ...data,
        type: 'ADD'
      });
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError('Failed to add stock');
    }
  }

  async removeStock(data: InventoryOperationInput): Promise<InventoryOperation> {
    try {
      return await this.repository.createOperation({
        ...data,
        type: 'REMOVE'
      });
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError('Failed to remove stock');
    }
  }

  async getOperations(productId: string): Promise<InventoryOperation[]> {
    try {
      return await this.repository.getOperations(productId);
    } catch (error) {
      throw new BadRequestError('Failed to fetch inventory operations');
    }
  }
} 
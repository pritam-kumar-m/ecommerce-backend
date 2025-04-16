import { PrismaClient, InventoryLevel, InventoryOperation, Prisma } from '@prisma/client';
import { InventoryFilter, InventoryLevelInput, InventoryOperationInput } from '../../domain/entities/inventory.entities';
import { BadRequestError } from '../../core/errors/AppError';
import { logger } from '../../core/logger';

export class InventoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAllWithFilters(filter: InventoryFilter): Promise<{ data: InventoryLevel[]; total: number }> {
    try {
      const { page = 1, limit = 10, search, lowStock, productId } = filter;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.InventoryLevelWhereInput = {
        ...(productId && { productId }),
        ...(search && {
          product: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } }
            ]
          }
        })
      };

      // Fetch inventory levels
      const inventoryLevels = await this.prisma.inventoryLevel.findMany({
        where,
        include: {
          product: true
        },
        skip,
        take: limit,
        orderBy: {
          lastUpdated: 'desc'
        }
      });

      // Filter for low stock if requested
      const filteredLevels = lowStock
        ? inventoryLevels.filter(level => level.quantity <= level.lowStockThreshold)
        : inventoryLevels;

      // Get total count
      const total = await this.prisma.inventoryLevel.count({ where });

      return {
        data: filteredLevels,
        total: lowStock ? filteredLevels.length : total
      };
    } catch (error) {
      logger.error('Error in findAllWithFilters:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<InventoryLevel | null> {
    try {
      return await this.prisma.inventoryLevel.findUnique({
        where: { id },
        include: {
          product: true
        }
      });
    } catch (error) {
      logger.error('Error in findById:', error);
      throw error;
    }
  }

  async findByProductId(productId: string): Promise<InventoryLevel | null> {
    try {
      return await this.prisma.inventoryLevel.findUnique({
        where: { productId },
        include: {
          product: true
        }
      });
    } catch (error) {
      logger.error('Error in findByProductId:', error);
      throw error;
    }
  }

  async create(data: InventoryLevelInput): Promise<InventoryLevel> {
    try {
      return await this.prisma.inventoryLevel.create({
        data: {
          productId: data.productId,
          quantity: data.quantity,
          lowStockThreshold: data.lowStockThreshold,
          lastUpdated: new Date()
        },
        include: {
          product: true
        }
      });
    } catch (error) {
      logger.error('Error in create:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<InventoryLevelInput>): Promise<InventoryLevel> {
    try {
      return await this.prisma.inventoryLevel.update({
        where: { id },
        data: {
          ...(data.productId && { productId: data.productId }),
          ...(data.quantity !== undefined && { quantity: data.quantity }),
          ...(data.lowStockThreshold !== undefined && { lowStockThreshold: data.lowStockThreshold }),
          lastUpdated: new Date()
        },
        include: {
          product: true
        }
      });
    } catch (error) {
      logger.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<InventoryLevel> {
    try {
      return await this.prisma.inventoryLevel.delete({
        where: { id },
        include: {
          product: true
        }
      });
    } catch (error) {
      logger.error('Error in delete:', error);
      throw error;
    }
  }

  async createOperation(data: InventoryOperationInput): Promise<InventoryOperation> {
    try {
      if (data.type !== 'ADD' && data.type !== 'REMOVE') {
        throw new BadRequestError('Invalid operation type. Must be either ADD or REMOVE');
      }

      // Use type assertions to ensure proper typing
      const productId = data.productId as string;
      const quantity = data.quantity as number;
      const type = data.type as 'ADD' | 'REMOVE';
      const reason = data.reason as string;

      return await this.prisma.inventoryOperation.create({
        data: {
          product: { connect: { id: productId } },
          quantity,
          type,
          reason
        }
      });
    } catch (error) {
      logger.error('Error in createOperation:', error);
      throw error;
    }
  }

  async getOperations(productId: string): Promise<InventoryOperation[]> {
    try {
      return await this.prisma.inventoryOperation.findMany({
        where: { productId },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      logger.error('Error in getOperations:', error);
      throw error;
    }
  }
} 
import { PrismaClient, Prisma, OrderStatus } from '@prisma/client';
import { OrderFilter, OrderCreateInput, OrderUpdateInput, Order } from '../../domain/entities/order.entities';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError';
import { logger } from '../../core/logger';
import { BaseRepository } from './base.repository';

export class OrderRepository extends BaseRepository<Order, OrderCreateInput, OrderUpdateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'order');
  }

  async findAllWithFilters(filter: OrderFilter): Promise<{ data: Order[]; total: number }> {
    try {
      const { page = 1, limit = 10, userId, status, startDate, endDate } = filter;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        ...(userId && { userId }),
        ...(status && { status }),
        ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        })
      };

      // Fetch orders
      const orders = await this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Get total count
      const total = await this.prisma.order.count({ where });

      return {
        data: orders as Order[],
        total
      };
    } catch (error) {
      logger.error('Error in findAllWithFilters:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      return await this.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error in findById:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error finding orders by user ID', { userId, error });
      throw error;
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error updating order status', { id, status, error });
      throw error;
    }
  }

  async create(data: OrderCreateInput): Promise<Order> {
    try {
      return await this.prisma.order.create({
        data: {
          userId: data.userId,
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod,
          status: OrderStatus.PENDING,
          paymentStatus: 'PENDING',
          totalAmount: data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error creating order', { data, error });
      throw error;
    }
  }

  async update(id: string, data: OrderUpdateInput): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: {
          status: data.status,
          paymentStatus: data.paymentStatus
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error updating order', { id, data, error });
      throw error;
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      return await this.prisma.order.delete({
        where: { id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } catch (error) {
      // logger.error('Error deleting order', { id, error });
      throw error;
    }
  }
} 
import { OrderRepository } from '../../infrastructure/repositories/order.repository';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import { InventoryRepository } from '../../infrastructure/repositories/inventory.repository';
import { Order, OrderFilter, OrderCreateInput, OrderUpdateInput } from '../entities/order.entities';
import { OrderStatus } from '@prisma/client';
import { BadRequestError, NotFoundError, ForbiddenError, AppError } from '../../core/errors/AppError';
import { IService } from '../../core/interfaces/service.interface';
import { logger } from '../../core/logger';

export class OrderService implements IService<Order> {
  constructor(
    private repository: OrderRepository,
    private productRepository: ProductRepository,
    private inventoryRepository: InventoryRepository
  ) {}

  async getAll(filter: OrderFilter = {}): Promise<{ 
    data: Order[]; 
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
      logger.error('Error finding orders', { filter, error });
      throw error;
    }
  }

  async getById(id: string): Promise<Order> {
    try {
      const order = await this.repository.findById(id);
      if (!order) {
        throw new NotFoundError(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      logger.error('Error finding order by ID', { id, error });
      throw error;
    }
  }

  async getByUserId(userId: string): Promise<Order[]> {
    try {
      return await this.repository.findByUserId(userId);
    } catch (error) {
      logger.error('Error finding orders by user ID', { userId, error });
      throw error;
    }
  }

  async create(data: Partial<Order>): Promise<Order> {
    try {
      // Cast the data to OrderCreateInput for internal use
      const orderData = data as unknown as OrderCreateInput;
      logger.info('Creating order', { userId: orderData.userId });
      
      // Validate products exist and have sufficient inventory
      const orderItems = [];
      let totalAmount = 0;
      
      for (const item of orderData.items) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new AppError(`Product with ID ${item.productId} not found`, 404);
        }

        const inventory = await this.inventoryRepository.findByProductId(item.productId);
        if (!inventory || inventory.quantity < item.quantity) {
          throw new AppError(`Insufficient inventory for product ${product.name}`, 400);
        }
        
        // Calculate price based on product's sale price or regular price
        const price = product.sale_price || product.price;
        const itemTotal = price * item.quantity;
        totalAmount += itemTotal;
        
        // Add to order items with calculated price
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price
        });
      }

      // Create the order with calculated total amount
      const order = await this.repository.create({
        ...orderData,
        items: orderItems,
        totalAmount,
        status: OrderStatus.PENDING
      });

      // Update inventory levels
      for (const item of orderData.items) {
        await this.inventoryRepository.createOperation({
          productId: item.productId,
          quantity: item.quantity,
          type: 'REMOVE',
          reason: `Order ${order.id} created`
        });
      }

      logger.info('Order created successfully', { orderId: order.id });
      return order;
    } catch (error) {
      logger.error('Error creating order', { data, error });
      throw error instanceof AppError ? error : new AppError('Failed to create order', 500);
    }
  }

  async update(id: string, data: OrderUpdateInput, userId?: string, isAdmin: boolean = false): Promise<Order> {
    try {
      const order = await this.repository.findById(id);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      // Check if user is authorized to update this order
      if (!isAdmin && userId && order.userId !== userId) {
        throw new ForbiddenError('You are not authorized to update this order');
      }

      // Only allow updating certain fields based on user role
      const updateData: OrderUpdateInput = {};
      
      if (isAdmin) {
        // Admins can update any field
        Object.assign(updateData, data);
      } else {
        // Regular users can only update limited fields
        if (data.paymentStatus) {
          updateData.paymentStatus = data.paymentStatus;
        }
      }

      return await this.repository.update(id, updateData);
    } catch (error) {
      logger.error('Error updating order', { id, data, error });
      throw error;
    }
  }

  async updateStatus(id: string, newStatus: OrderStatus): Promise<Order> {
    try {
      const existingOrder = await this.getById(id);
      const currentStatus = existingOrder.status as OrderStatus;

      // Validate status transition
      if (currentStatus === OrderStatus.CANCELLED) {
        throw new BadRequestError('Cannot update status of a cancelled order');
      }

      // If cancelling order, restore inventory
      if ((newStatus as string) === OrderStatus.CANCELLED && (currentStatus as string) !== OrderStatus.CANCELLED) {
        for (const item of existingOrder.items) {
          await this.inventoryRepository.createOperation({
            productId: item.productId,
            quantity: item.quantity,
            type: 'ADD',
            reason: `Order ${id} cancelled`
          });
        }
      }

      return await this.repository.updateStatus(id, newStatus);
    } catch (error) {
      logger.error('Error updating order status', { id, newStatus, error });
      throw error;
    }
  }

  async delete(id: string, userId?: string, isAdmin: boolean = false): Promise<Order> {
    try {
      const order = await this.repository.findById(id);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      // Check if user is authorized to delete this order
      if (!isAdmin && userId && order.userId !== userId) {
        throw new ForbiddenError('You are not authorized to delete this order');
      }

      // Prevent deletion of orders that are not in a final state
      if (order.status !== OrderStatus.DELIVERED && 
          order.status !== OrderStatus.CANCELLED) {
        throw new BadRequestError('Can only delete delivered or cancelled orders');
      }

      return await this.repository.delete(id);
    } catch (error) {
      // logger.error('Error deleting order', { id, error });
      throw error;
    }
  }
} 
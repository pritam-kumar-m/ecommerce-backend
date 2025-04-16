import { Request, Response } from 'express';
import { BaseController } from '../../../api/controllers/BaseController';
import { OrderService } from '../../../domain/services/order.service';
import { ResponseHandler } from '../../../core/utils/responseHandler';
import { Order, OrderStatus } from '@prisma/client';
import { logger } from '../../../core/logger';
import { BadRequestError } from '../../../core/errors/AppError';

export class OrderController extends BaseController<Order> {
  constructor(private orderService: OrderService) {
    super(orderService);
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10, status, userId } = req.query;
      const filters = {
        page: Number(page),
        limit: Number(limit), 
        status: status ? status as OrderStatus : undefined,
        userId: userId as string
      };

      const { data: orders, total, pagination } = await this.orderService.getAll(filters);
      
      ResponseHandler.success(res, {
        orders,
        pagination
      });
    } catch (error) {
      logger.error('Error in getAll orders:', error);
      ResponseHandler.error(res, error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getById(id);
      
      if (!order) {
        ResponseHandler.notFound(res, 'Order not found');
        return;
      }

      // Check if user is authorized to view this order
      const userId = req.user?.userId;
      if (userId && order.userId !== userId && req.user?.role !== 'ADMIN') {
        ResponseHandler.forbidden(res, 'You are not authorized to view this order');
        return;
      }

      ResponseHandler.success(res, { order });
    } catch (error) {
      logger.error('Error in getById order:', error);
      ResponseHandler.error(res, error);
    }
  };

  public getByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ResponseHandler.unauthorized(res, 'User not authenticated');
        return;
      }

      const { page = 1, limit = 10 } = req.query;
      
      const filters = {
        page: Number(page),
        limit: Number(limit),
        userId
      };

      const { data: orders, total, pagination } = await this.orderService.getAll(filters);
      
      ResponseHandler.success(res, {
        orders,
        pagination
      });
    } catch (error) {
      logger.error('Error in getByUserId orders:', error);
      ResponseHandler.error(res, error);
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("req.user",req.user)
      const userId = req.user?.userId;
      console.log("userId",userId)
      if (!userId) {
        ResponseHandler.unauthorized(res, 'User not authenticated');
        return;
      }

      const orderData = {
        ...req.body,
        userId
      };
      
      const order = await this.orderService.create(orderData);
      
      ResponseHandler.created(res, { 
        message: 'Order created successfully',
        order 
      });
    } catch (error) {
      logger.error('Error in create order:', error);
      ResponseHandler.error(res, error);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const isAdmin = req.user?.role === 'ADMIN';
      
      const order = await this.orderService.update(id, updateData, req.user?.userId, isAdmin);
      
      if (!order) {
        ResponseHandler.notFound(res, 'Order not found');
        return;
      }

      ResponseHandler.success(res, { 
        message: 'Order updated successfully',
        order 
      });
    } catch (error) {
      logger.error('Error in update order:', error);
      ResponseHandler.error(res, error);
    }
  };

  public updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await this.orderService.updateStatus(id, status);
      
      if (!order) {
        ResponseHandler.notFound(res, 'Order not found');
        return;
      }

      ResponseHandler.success(res, { 
        message: 'Order status updated successfully',
        order 
      });
    } catch (error) {
      logger.error('Error in updateStatus order:', error);
      ResponseHandler.error(res, error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const isAdmin = req.user?.role === 'ADMIN';
      
      const order = await this.orderService.delete(id, req.user?.userId, isAdmin);
      
      ResponseHandler.success(res, { 
        message: 'Order deleted successfully'
      });
    } catch (error) {
      // logger.error('Error in delete order:', error);
      if (error instanceof BadRequestError) {
        ResponseHandler.badRequest(res, error.message);
        return;
      }
      ResponseHandler.error(res, error);
    }
  };
} 
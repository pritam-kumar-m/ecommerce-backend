import { Request, Response } from 'express';
import { InventoryService } from '../../../domain/services/inventory.service';
import { BaseController } from '../../../api/controllers/BaseController';
import { InventoryLevel } from '@prisma/client';
import { ResponseHandler } from '../../../core/utils/responseHandler';
import { inventoryFilterSchema, inventoryLevelSchema } from '../../../domain/entities/inventory.entities';

export class InventoryController extends BaseController<InventoryLevel> {
  constructor(private inventoryService: InventoryService) {
    super(inventoryService);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = inventoryFilterSchema.parse(req.query);
      const result = await this.inventoryService.getAll(filter);
      
      ResponseHandler.success(res, {
        data: result.data,
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          itemsPerPage: result.pagination.limit,
          totalItems: result.pagination.totalItems
        }
      }, 'Inventory levels retrieved successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const inventoryLevel = await this.inventoryService.getById(req.params.id);
      ResponseHandler.success(res, inventoryLevel, 'Inventory level retrieved successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = inventoryLevelSchema.parse(req.body);
      const inventoryLevel = await this.inventoryService.create(validatedData);
      ResponseHandler.success(res, inventoryLevel, 'Inventory level created successfully', 201);
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = inventoryLevelSchema.partial().parse(req.body);
      const inventoryLevel = await this.inventoryService.update(req.params.id, validatedData);
      ResponseHandler.success(res, inventoryLevel, 'Inventory level updated successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const inventoryLevel = await this.inventoryService.delete(req.params.id);
      ResponseHandler.success(res, inventoryLevel, 'Inventory level deleted successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  addStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quantity, reason } = req.body;
      const operation = await this.inventoryService.addStock({
        productId: req.params.id,
        quantity,
        reason
      });
      ResponseHandler.success(res, operation, 'Stock added successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  removeStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quantity, reason } = req.body;
      const operation = await this.inventoryService.removeStock({
        productId: req.params.id,
        quantity,
        reason
      });
      ResponseHandler.success(res, operation, 'Stock removed successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  getOperations = async (req: Request, res: Response): Promise<void> => {
    try {
      const operations = await this.inventoryService.getOperations(req.params.id);
      ResponseHandler.success(res, operations, 'Inventory operations retrieved successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };
} 
import { Request, Response } from 'express';
import { IController } from '../../core/interfaces/controller.interface';
import { IService } from '../../core/interfaces/service.interface';
import { ResponseHandler } from '../../core/utils/responseHandler';

export abstract class BaseController<T> implements IController {
  constructor(protected service: IService<T>) {}

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const entity = await this.service.getById(id);
      ResponseHandler.success(res, entity);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, ...filter } = req.query;
      const { data, total, pagination } = await this.service.getAll({
        ...filter,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      
      ResponseHandler.success(res, {
        data,
        pagination: {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          itemsPerPage: pagination.limit,
          totalItems: pagination.totalItems
        }
      });
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      // Note: Child controllers should override this method to add proper validation
      const entity = await this.service.create(req.body);
      ResponseHandler.created(res, entity);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const entity = await this.service.update(id, req.body);
      ResponseHandler.success(res, entity, 'Updated successfully');
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      ResponseHandler.success(res, null, 'Deleted successfully');
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  }
} 
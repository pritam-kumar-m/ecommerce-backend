import { Request, Response } from 'express';
import { CategoryService } from '../../../domain/services/category.service';
import { BaseController } from '../../../api/controllers/BaseController';
import { Category } from '@prisma/client';
import { ResponseHandler } from '../../../core/utils/responseHandler';
import { createCategorySchema } from '../../../api/validators/product.validator';

export class CategoryController extends BaseController<Category> {
  constructor(service: CategoryService) {
    super(service);
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const filter = req.query;
      const result = await this.service.getAll(filter);
      ResponseHandler.success(res, result);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const category = await this.service.getById(req.params.id);
      ResponseHandler.success(res, category);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await this.service.create(validatedData);
      ResponseHandler.created(res, category);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const category = await this.service.update(req.params.id, req.body);
      ResponseHandler.success(res, category);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const category = await this.service.delete(req.params.id);
      ResponseHandler.success(res, category);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  };
} 
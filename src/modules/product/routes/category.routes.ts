import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { BaseRouter } from '../../../api/routes/BaseRouter';
import { Role } from '@prisma/client';

export class CategoryRoutes extends BaseRouter<any> {
  constructor(controller: CategoryController) {
    super(controller, true, [Role.ADMIN]);
    this.initializeCategoryRoutes();
  }

  private initializeCategoryRoutes(): void {
    // Public routes
    this.router.get('/', this.controller.getAll);
    this.router.get('/:id', this.controller.getById);

    // Protected routes
    this.router.post('/', this.controller.create);
    this.router.put('/:id', this.controller.update);
    this.router.delete('/:id', this.controller.delete);
  }

  public getRouter(): Router {
    return this.router;
  }
} 
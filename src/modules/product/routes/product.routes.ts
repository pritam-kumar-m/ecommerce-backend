import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../../../infrastructure/middleware/authMiddleware';
import { Role } from '@prisma/client';

export class ProductRoutes {
  private router: Router;
  private controller: ProductController;

  constructor(controller: ProductController) {
    this.router = Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.get('/', this.controller.getAll.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));

    // Protected routes
    this.router.use(authenticate);

    // Product management routes
    this.router.post(
      '/',
      authorize([Role.ADMIN, Role.VENDOR]),
      this.controller.create.bind(this.controller)
    );

    this.router.put(
      '/:id',
      authorize([Role.ADMIN, Role.VENDOR]),
      this.controller.update.bind(this.controller)
    );

    this.router.delete(
      '/:id',
      authorize([Role.ADMIN, Role.VENDOR]),
      this.controller.delete.bind(this.controller)
    );

    // Category routes
    this.router.get(
      '/categories',
      authorize([Role.ADMIN, Role.VENDOR]),
      this.controller.getAllCategories.bind(this.controller)
    );

    this.router.post(
      '/categories',
      authorize([Role.ADMIN]),
      this.controller.createCategory.bind(this.controller)
    );

    this.router.put(
      '/categories/:id',
      authorize([Role.ADMIN]),
      this.controller.updateCategory.bind(this.controller)
    );

    this.router.delete(
      '/categories/:id',
      authorize([Role.ADMIN]),
      this.controller.deleteCategory.bind(this.controller)
    );
  }

  getRouter(): Router {
    return this.router;
  }
} 
import { Router } from 'express';
import { BaseRouter } from '../../../api/routes/BaseRouter';
import { OrderController } from '../controllers/order.controller';
import { validate } from '../../../middleware/schemaValidation';
import { createOrderSchema, updateOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';
import { authenticate, authorize } from '../../../middleware/authMiddleware';
import { Role } from '@prisma/client';

export class OrderRoutes extends BaseRouter<any> {
  public router: Router;
  private orderController: OrderController;

  constructor(controller: OrderController) {
    super(controller);
    this.router = Router();
    this.orderController = controller;
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Apply authentication middleware to all routes
    this.router.use(authenticate);

    // Public routes (authenticated users)
    this.router.get('/my-orders', (req, res) => this.orderController.getByUserId(req, res));
    this.router.get('/:id', (req, res) => this.controller.getById(req, res));
    this.router.post('/', 
      validate(createOrderSchema),
      (req, res) => this.controller.create(req, res)
    );

    // Admin routes
    this.router.get('/', authorize(Role.ADMIN), (req, res) => this.controller.getAll(req, res));
    this.router.put('/:id', 
      authorize(Role.ADMIN), 
      validate(updateOrderSchema),
      (req, res) => this.controller.update(req, res)
    );
    this.router.patch('/:id/status', 
      authorize(Role.ADMIN), 
      validate(updateOrderStatusSchema),
      (req, res) => this.orderController.updateStatus(req, res)
    );
    this.router.delete('/:id', authorize(Role.ADMIN), (req, res) => this.controller.delete(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
} 
import { Router } from 'express';
import { BaseController } from '../controllers/BaseController';
import { authenticate, authorize } from '../../infrastructure/middleware/authMiddleware';
import { Role } from '@prisma/client';

export class BaseRouter<T> {
  public router: Router;
  protected controller: BaseController<T>;
  protected requireAuth: boolean;
  protected allowedRoles: Role[];

  constructor(
    controller: BaseController<T>,
    requireAuth: boolean = false,
    allowedRoles: Role[] = []
  ) {
    this.router = Router();
    this.controller = controller;
    this.requireAuth = requireAuth;
    this.allowedRoles = allowedRoles;
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Get all
    this.router.get('/', (req, res) => this.controller.getAll(req, res));

    // Get by ID
    this.router.get('/:id', (req, res) => this.controller.getById(req, res));

    // Create
    if (this.requireAuth) {
      this.router.post(
        '/',
        authenticate,
        ...(this.allowedRoles.length > 0 ? [authorize(this.allowedRoles)] : []),
        (req, res) => this.controller.create(req, res)
      );
    } else {
      this.router.post('/', (req, res) => this.controller.create(req, res));
    }

    // Update
    if (this.requireAuth) {
      this.router.put(
        '/:id',
        authenticate,
        ...(this.allowedRoles.length > 0 ? [authorize(this.allowedRoles)] : []),
        (req, res) => this.controller.update(req, res)
      );
    } else {
      this.router.put('/:id', (req, res) => this.controller.update(req, res));
    }

    // Delete
    if (this.requireAuth) {
      this.router.delete(
        '/:id',
        authenticate,
        ...(this.allowedRoles.length > 0 ? [authorize(this.allowedRoles)] : []),
        (req, res) => this.controller.delete(req, res)
      );
    } else {
      this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
    }
  }
}
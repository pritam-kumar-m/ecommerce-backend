import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../../../infrastructure/middleware/authMiddleware';
import { Role } from '@prisma/client';

export class UserRoutes {
  private router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Protected routes - require authentication
    this.router.use(authenticate);

    // Admin only routes
    this.router.post('/', authorize([Role.ADMIN]), this.userController.createUser.bind(this.userController));
    this.router.get('/', authorize([Role.ADMIN]), this.userController.getUsers.bind(this.userController));
    this.router.delete('/:id', authorize([Role.ADMIN]), this.userController.deleteUser.bind(this.userController));
    
    // Admin and self routes (users can access their own data)
    this.router.get('/:id', this.userController.getUserById.bind(this.userController));
    this.router.put('/:id', this.userController.updateUser.bind(this.userController));
  }

  public getRouter(): Router {
    return this.router;
  }
} 
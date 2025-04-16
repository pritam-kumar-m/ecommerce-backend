import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthBaseRouter } from '../../../api/routes/AuthBaseRouter';
import { Role } from '@prisma/client';

export class AuthRoutes extends AuthBaseRouter<AuthController> {
  constructor(controller: AuthController) {
    super(controller);
    this.initializeAuthRoutes();
  }

  private initializeAuthRoutes(): void {
    // Public routes
    this.router.post('/register', this.controller.register);
    this.router.post('/login', this.controller.login);
    this.router.post('/logout', this.controller.logout);
    this.router.post('/refresh-token', this.controller.refreshToken);
  }

  public getRouter(): Router {
    return this.router;
  }
} 
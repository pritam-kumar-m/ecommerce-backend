import { Request, Response } from 'express';
import { AuthService } from '../../../domain/services/auth.service';
import { AuthBaseController } from '../../../api/controllers/AuthBaseController';
import { LoginInput, RegisterInput } from '../../../domain/entities/auth.entities';

export class AuthController extends AuthBaseController {
  protected authService: AuthService;

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  register = async (req: Request, res: Response) => {
    await this.handleRequest(req, res, async () => {
      const registerData: RegisterInput = req.body;
      return await this.authService.register(registerData);
    });
  };

  login = async (req: Request, res: Response) => {
    await this.handleRequest(req, res, async () => {
      const loginData: LoginInput = req.body;
      return await this.authService.login(loginData);
    });
  };

  logout = async (req: Request, res: Response) => {
    await this.handleRequest(req, res, async () => {
      const refreshToken = req.body.refreshToken;
      return await this.authService.logout(refreshToken);
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    await this.handleRequest(req, res, async () => {
      const refreshToken = req.body.refreshToken;
      return await this.authService.refreshToken(refreshToken);
    });
  };
} 
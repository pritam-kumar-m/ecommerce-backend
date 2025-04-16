import { Request, Response } from 'express';
import { ResponseHandler } from '../../core/utils/responseHandler';

export abstract class AuthBaseController {
  protected abstract authService: any;

  protected handleRequest = async (
    req: Request,
    res: Response,
    action: () => Promise<any>
  ) => {
    try {
      const result = await action();
      ResponseHandler.success(res, result);
    } catch (error) {
      ResponseHandler.error(res, error as Error);
    }
  };
} 
import { Request, Response } from 'express';

export interface IController {
  getById(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
} 
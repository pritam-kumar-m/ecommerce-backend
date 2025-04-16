import { Router } from 'express';
import { AuthBaseController } from '../controllers/AuthBaseController';

export class AuthBaseRouter<T extends AuthBaseController> {
  public router: Router;
  protected controller: T;

  constructor(controller: T) {
    this.router = Router();
    this.controller = controller;
  }
} 
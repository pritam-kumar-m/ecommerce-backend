import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ResponseHandler } from '../../../core/utils/responseHandler';
import { createUserSchema, updateUserSchema, userFilterSchema } from '../types/auth.types';
import { Role } from '@prisma/client';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);
      return ResponseHandler.created(res, user, 'User created successfully');
    } catch (error) {
      return ResponseHandler.error(res, error as Error);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return ResponseHandler.success(res, user, 'User retrieved successfully');
    } catch (error) {
      return ResponseHandler.error(res, error as Error);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const filter = userFilterSchema.parse({
        ...req.query,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10),
        role: req.query.role ? (req.query.role as Role) : undefined,
      });

      const { users, total } = await this.userService.getUsers(filter);
      
      return ResponseHandler.success(res, {
        users,
        pagination: {
          currentPage: filter.page,
          totalPages: Math.ceil(total / filter.limit),
          limit: filter.limit,
          totalItems: total
        }
      }, 'Users retrieved successfully');
    } catch (error) {
      return ResponseHandler.error(res, error as Error);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const user = await this.userService.updateUser(req.params.id, validatedData);
      return ResponseHandler.success(res, user, 'User updated successfully');
    } catch (error) {
      return ResponseHandler.error(res, error as Error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      return ResponseHandler.success(res, user, 'User deleted successfully');
    } catch (error) {
      return ResponseHandler.error(res, error as Error);
    }
  }
} 
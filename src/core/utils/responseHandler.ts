import { Response } from 'express';
import { AppError } from '../errors/AppError';

export class ResponseHandler {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): void {
    this.success(res, data, message, 201);
  }

  static unauthorized(res: Response, message = 'Unauthorized'): void {
    res.status(401).json({
      success: false,
      message,
    });
  }

  static forbidden(res: Response, message = 'Forbidden'): void {
    res.status(403).json({
      success: false,
      message,
    });
  }

  static notFound(res: Response, message = 'Not found'): void {
    res.status(404).json({
      success: false,
      message,
    });
  }

  static badRequest(res: Response, message = 'Bad request'): void {
    res.status(400).json({
      success: false,
      message,
    });
  }

  static error(res: Response, error: Error | AppError): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      // Log unexpected errors
      console.error('Unexpected error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static paginated<T>(
    res: Response, 
    data: T[], 
    total: number, 
    page: number, 
    limit: number, 
    message = 'Success'
  ): void {
    res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        itemsPerPage: limit,
        totalItems: total
      },
    });
  }
} 
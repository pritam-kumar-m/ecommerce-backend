import { Request, Response } from 'express';
import { ProductService } from '../../../domain/services/product.service';
import { BaseController } from '../../../api/controllers/BaseController';
import { Product } from '@prisma/client';
import { ResponseHandler } from '../../../core/utils/responseHandler';
import { productCreateSchema, productUpdateSchema, productFilterSchema } from '../../../api/validators/product.validator';
import { ProductCreateInput } from '../../../domain/entities/product.entities';

export class ProductController extends BaseController<Product> {
  constructor(private productService: ProductService) {
    super(productService);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = productFilterSchema.parse(req.query);
      const result = await this.productService.getAll(filter);
      ResponseHandler.success(res, {
        products: result.data,
        total: result.total,
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          itemsPerPage: result.pagination.limit,
          totalItems: result.pagination.totalItems
        }
      }, 'Products retrieved successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getById(req.params.id);
      ResponseHandler.success(res, product, 'Product retrieved successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = productCreateSchema.parse(req.body);
      
      // Ensure all required fields are present
      const data: ProductCreateInput = {
        name: validatedData.name,
        description: validatedData.description,
        sku: validatedData.sku,
        price: validatedData.price,
        cost_price: validatedData.cost_price,
        retail_price: validatedData.retail_price,
        categoryId: validatedData.categoryId,
        tags: validatedData.tags,
        sale_price: validatedData.sale_price,
        weight: validatedData.weight,
        width: validatedData.width,
        height: validatedData.height,
        depth: validatedData.depth,
        availability: validatedData.availability,
        custom_fields: validatedData.custom_fields,
      };
      
      const product = await this.productService.create(data);
      ResponseHandler.success(res, product, 'Product created successfully', 201);
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = productUpdateSchema.parse(req.body);
      const product = await this.productService.update(req.params.id, validatedData);
      ResponseHandler.success(res, product, 'Product updated successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.delete(req.params.id);
      ResponseHandler.success(res, product, 'Product deleted successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  // Category operations
  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.productService.getAllCategories(req.query);
      ResponseHandler.success(res, result, 'Categories retrieved successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.productService.createCategory(req.body);
      ResponseHandler.success(res, category, 'Category created successfully', 201);
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.productService.updateCategory(req.params.id, req.body);
      ResponseHandler.success(res, category, 'Category updated successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.productService.deleteCategory(req.params.id);
      ResponseHandler.success(res, category, 'Category deleted successfully');
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  };
}
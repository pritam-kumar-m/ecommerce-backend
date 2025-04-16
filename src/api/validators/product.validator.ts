import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sku: z.string().min(1, 'SKU is required'),
  tags: z.array(z.string()).optional(),
  sale_price: z.number().positive('Sale price must be positive').optional(),
  price: z.number().positive('Price must be positive'),
  cost_price: z.number().positive('Cost price must be positive'),
  retail_price: z.number().positive('Retail price must be positive'),
  weight: z.number().positive('Weight must be positive').optional(),
  width: z.number().positive('Width must be positive').optional(),
  height: z.number().positive('Height must be positive').optional(),
  depth: z.number().positive('Depth must be positive').optional(),
  availability: z.boolean().optional(),
  custom_fields: z.record(z.any()).optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productFilterSchema = z.object({
  categoryId: z.string().optional(),
  minPrice: z.string().transform(val => val ? Number(val) : undefined).optional(),
  maxPrice: z.string().transform(val => val ? Number(val) : undefined).optional(),
  search: z.string().optional(),
  page: z.string().transform(val => val ? Number(val) : 1).default('1'),
  limit: z.string().transform(val => val ? Number(val) : 10).default('10'),
  tags: z.array(z.string()).optional(),
  availability: z.string().transform(val => val === 'true').optional(),
  minSalePrice: z.string().transform(val => val ? Number(val) : undefined).optional(),
  maxSalePrice: z.string().transform(val => val ? Number(val) : undefined).optional(),
});

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
}); 
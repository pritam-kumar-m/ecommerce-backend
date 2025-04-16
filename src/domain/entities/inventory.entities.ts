import { z } from 'zod';
import { Product, InventoryOperationType } from '@prisma/client';

export interface InventoryOperation {
  id: string;
  productId: string;
  quantity: number;
  type: InventoryOperationType;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryLevel {
  id: string;
  productId: string;
  quantity: number;
  lowStockThreshold: number;
  lastUpdated: Date;
  product?: Product;
}

export interface InventoryFilter {
  page?: number;
  limit?: number;
  search?: string;
  lowStock?: boolean;
  productId?: string;
}

// Validation Schemas
export const inventoryOperationSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be positive'),
  type: z.enum(['ADD', 'REMOVE'] as [InventoryOperationType, ...InventoryOperationType[]], {
    errorMap: () => ({ message: 'Type must be either ADD or REMOVE' })
  }),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long')
});

export const inventoryLevelSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  lowStockThreshold: z.number().min(0, 'Low stock threshold cannot be negative')
});

export const inventoryFilterSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional(),
  lowStock: z.boolean().optional(),
  productId: z.string().optional()
});

export type InventoryOperationInput = z.infer<typeof inventoryOperationSchema>;
export type InventoryLevelInput = z.infer<typeof inventoryLevelSchema>;
export type InventoryFilterInput = z.infer<typeof inventoryFilterSchema>; 
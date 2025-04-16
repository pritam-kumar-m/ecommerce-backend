import { z } from 'zod';
import { Prisma, OrderStatus } from '@prisma/client';

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderCreateInput {
  userId: string;
  items: OrderItemInput[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount?: number;
  status?: OrderStatus;
}

export interface OrderUpdateInput {
  status?: OrderStatus;
  paymentStatus?: string;
}

export interface OrderFilter {
  page?: number;
  limit?: number;
  userId?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Prisma.JsonValue;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: any; // You can replace 'any' with a proper Product type if available
}

// Validation Schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be positive')
});

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required')
});

export const orderCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1, 'Payment method is required')
});

export const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.string().optional()
});

export const orderFilterSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  userId: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

export type OrderItemInputType = z.infer<typeof orderItemSchema>;
export type OrderCreateInputType = z.infer<typeof orderCreateSchema>;
export type OrderUpdateInputType = z.infer<typeof orderUpdateSchema>;
export type OrderFilterInputType = z.infer<typeof orderFilterSchema>; 
import { z } from 'zod';

// Schema for creating a new order
export const createOrderSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
      price: z.number().min(0, 'Price must be non-negative')
    })).min(1, 'Order must contain at least one item'),
    shippingAddress: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      country: z.string().min(1, 'Country is required'),
      zipCode: z.string().min(1, 'Zip code is required')
    }),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    totalAmount: z.number().min(0, 'Total amount must be non-negative')
  })
});

// Schema for updating an order
export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required')
  }),
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
      price: z.number().min(0, 'Price must be non-negative')
    })).optional(),
    shippingAddress: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      country: z.string().min(1, 'Country is required'),
      zipCode: z.string().min(1, 'Zip code is required')
    }).optional(),
    paymentMethod: z.string().min(1, 'Payment method is required').optional(),
    totalAmount: z.number().min(0, 'Total amount must be non-negative').optional()
  })
});

// Schema for updating order status
export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required')
  }),
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
      errorMap: () => ({ message: 'Invalid order status' })
    })
  })
}); 
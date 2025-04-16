"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
// Schema for creating a new order
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'User ID is required'),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().min(1, 'Product ID is required'),
            quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
            price: zod_1.z.number().min(0, 'Price must be non-negative')
        })).min(1, 'Order must contain at least one item'),
        shippingAddress: zod_1.z.object({
            street: zod_1.z.string().min(1, 'Street is required'),
            city: zod_1.z.string().min(1, 'City is required'),
            state: zod_1.z.string().min(1, 'State is required'),
            country: zod_1.z.string().min(1, 'Country is required'),
            zipCode: zod_1.z.string().min(1, 'Zip code is required')
        }),
        paymentMethod: zod_1.z.string().min(1, 'Payment method is required'),
        totalAmount: zod_1.z.number().min(0, 'Total amount must be non-negative')
    })
});
// Schema for updating an order
exports.updateOrderSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Order ID is required')
    }),
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().min(1, 'Product ID is required'),
            quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
            price: zod_1.z.number().min(0, 'Price must be non-negative')
        })).optional(),
        shippingAddress: zod_1.z.object({
            street: zod_1.z.string().min(1, 'Street is required'),
            city: zod_1.z.string().min(1, 'City is required'),
            state: zod_1.z.string().min(1, 'State is required'),
            country: zod_1.z.string().min(1, 'Country is required'),
            zipCode: zod_1.z.string().min(1, 'Zip code is required')
        }).optional(),
        paymentMethod: zod_1.z.string().min(1, 'Payment method is required').optional(),
        totalAmount: zod_1.z.number().min(0, 'Total amount must be non-negative').optional()
    })
});
// Schema for updating order status
exports.updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Order ID is required')
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
            errorMap: () => ({ message: 'Invalid order status' })
        })
    })
});
//# sourceMappingURL=order.validator.js.map
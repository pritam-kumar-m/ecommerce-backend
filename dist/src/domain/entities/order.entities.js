"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderFilterSchema = exports.orderUpdateSchema = exports.orderCreateSchema = exports.shippingAddressSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Validation Schemas
exports.orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product ID is required'),
    quantity: zod_1.z.number().positive('Quantity must be positive')
});
exports.shippingAddressSchema = zod_1.z.object({
    street: zod_1.z.string().min(1, 'Street address is required'),
    city: zod_1.z.string().min(1, 'City is required'),
    state: zod_1.z.string().min(1, 'State is required'),
    zipCode: zod_1.z.string().min(1, 'Zip code is required'),
    country: zod_1.z.string().min(1, 'Country is required')
});
exports.orderCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    items: zod_1.z.array(exports.orderItemSchema).min(1, 'At least one item is required'),
    shippingAddress: exports.shippingAddressSchema,
    paymentMethod: zod_1.z.string().min(1, 'Payment method is required')
});
exports.orderUpdateSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.OrderStatus).optional(),
    paymentStatus: zod_1.z.string().optional()
});
exports.orderFilterSchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    userId: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.OrderStatus).optional(),
    startDate: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined),
    endDate: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined)
});
//# sourceMappingURL=order.entities.js.map
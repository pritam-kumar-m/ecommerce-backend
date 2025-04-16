"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryFilterSchema = exports.inventoryLevelSchema = exports.inventoryOperationSchema = void 0;
const zod_1 = require("zod");
// Validation Schemas
exports.inventoryOperationSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product ID is required'),
    quantity: zod_1.z.number().positive('Quantity must be positive'),
    type: zod_1.z.enum(['ADD', 'REMOVE'], {
        errorMap: () => ({ message: 'Type must be either ADD or REMOVE' })
    }),
    reason: zod_1.z.string().min(1, 'Reason is required').max(500, 'Reason too long')
});
exports.inventoryLevelSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product ID is required'),
    quantity: zod_1.z.number().min(0, 'Quantity cannot be negative'),
    lowStockThreshold: zod_1.z.number().min(0, 'Low stock threshold cannot be negative')
});
exports.inventoryFilterSchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    search: zod_1.z.string().optional(),
    lowStock: zod_1.z.boolean().optional(),
    productId: zod_1.z.string().optional()
});
//# sourceMappingURL=inventory.entities.js.map
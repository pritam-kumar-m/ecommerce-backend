"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = exports.productFilterSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// Product schemas
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be positive'),
    categoryId: zod_1.z.string().min(1, 'Category ID is required'),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    sale_price: zod_1.z.number().positive().optional(),
    cost_price: zod_1.z.number().positive().optional(),
    retail_price: zod_1.z.number().positive().optional(),
    weight: zod_1.z.number().positive().optional(),
    width: zod_1.z.number().positive().optional(),
    height: zod_1.z.number().positive().optional(),
    depth: zod_1.z.number().positive().optional(),
    availability: zod_1.z.boolean().optional(),
    custom_fields: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.productFilterSchema = zod_1.z.object({
    categoryId: zod_1.z.string().optional(),
    minPrice: zod_1.z.number().optional(),
    maxPrice: zod_1.z.number().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
});
// Category schemas
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
//# sourceMappingURL=product.types.js.map
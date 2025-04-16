"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryFilterSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.productFilterSchema = exports.productUpdateSchema = exports.productCreateSchema = void 0;
const zod_1 = require("zod");
exports.productCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    sku: zod_1.z.string().min(1, 'SKU is required'),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    sale_price: zod_1.z.number().positive('Sale price must be positive').optional(),
    price: zod_1.z.number().positive('Price must be positive'),
    cost_price: zod_1.z.number().positive('Cost price must be positive'),
    retail_price: zod_1.z.number().positive('Retail price must be positive'),
    weight: zod_1.z.number().positive('Weight must be positive').optional(),
    width: zod_1.z.number().positive('Width must be positive').optional(),
    height: zod_1.z.number().positive('Height must be positive').optional(),
    depth: zod_1.z.number().positive('Depth must be positive').optional(),
    availability: zod_1.z.boolean().optional(),
    custom_fields: zod_1.z.record(zod_1.z.any()).optional(),
    categoryId: zod_1.z.string().min(1, 'Category ID is required'),
});
exports.productUpdateSchema = exports.productCreateSchema.partial();
exports.productFilterSchema = zod_1.z.object({
    categoryId: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().transform(val => val ? Number(val) : undefined).optional(),
    maxPrice: zod_1.z.string().transform(val => val ? Number(val) : undefined).optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(val => val ? Number(val) : 1).default('1'),
    limit: zod_1.z.string().transform(val => val ? Number(val) : 10).default('10'),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    availability: zod_1.z.string().transform(val => val === 'true').optional(),
    minSalePrice: zod_1.z.string().transform(val => val ? Number(val) : undefined).optional(),
    maxSalePrice: zod_1.z.string().transform(val => val ? Number(val) : undefined).optional(),
});
// Category schemas
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
exports.categoryFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
});
//# sourceMappingURL=product.validator.js.map
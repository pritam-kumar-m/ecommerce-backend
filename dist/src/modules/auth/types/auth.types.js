"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterSchema = exports.updateUserSchema = exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// User schemas
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
});
exports.userFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
    sortBy: zod_1.z.enum(['name', 'email', 'createdAt']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
//# sourceMappingURL=auth.types.js.map
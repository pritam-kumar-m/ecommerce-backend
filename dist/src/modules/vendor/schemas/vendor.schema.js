"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorSchema = void 0;
const zod_1 = require("zod");
const vendorStatus = zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);
exports.vendorSchema = {
    create: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(10).max(15),
        address: zod_1.z.string().min(5).max(200),
        description: zod_1.z.string().max(500).optional(),
        status: vendorStatus.default('ACTIVE'),
    }),
    update: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).max(15).optional(),
        address: zod_1.z.string().min(5).max(200).optional(),
        description: zod_1.z.string().max(500).optional(),
    }),
    updateStatus: zod_1.z.object({
        status: vendorStatus,
    }),
};
//# sourceMappingURL=vendor.schema.js.map
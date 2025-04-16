"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorSchema = void 0;
const zod_1 = require("zod");
const vendorStatusEnum = zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);
exports.vendorSchema = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(2).max(100),
            email: zod_1.z.string().email(),
            phone: zod_1.z.string().min(10).max(15),
            address: zod_1.z.object({
                street: zod_1.z.string(),
                city: zod_1.z.string(),
                state: zod_1.z.string(),
                zipCode: zod_1.z.string(),
                country: zod_1.z.string()
            }),
            description: zod_1.z.string().optional(),
            status: vendorStatusEnum.default('ACTIVE')
        })
    }),
    getById: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid()
        })
    }),
    update: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid()
        }),
        body: zod_1.z.object({
            name: zod_1.z.string().min(2).max(100).optional(),
            email: zod_1.z.string().email().optional(),
            phone: zod_1.z.string().min(10).max(15).optional(),
            address: zod_1.z.object({
                street: zod_1.z.string(),
                city: zod_1.z.string(),
                state: zod_1.z.string(),
                zipCode: zod_1.z.string(),
                country: zod_1.z.string()
            }).optional(),
            description: zod_1.z.string().optional()
        })
    }),
    delete: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid()
        })
    }),
    updateStatus: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid()
        }),
        body: zod_1.z.object({
            status: vendorStatusEnum
        })
    })
};
//# sourceMappingURL=vendor.schema.js.map
import { z } from 'zod';

const vendorStatus = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

export const vendorSchema = {
  create: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    address: z.string().min(5).max(200),
    description: z.string().max(500).optional(),
    status: vendorStatus.default('ACTIVE'),
  }),

  update: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    address: z.string().min(5).max(200).optional(),
    description: z.string().max(500).optional(),
  }),

  updateStatus: z.object({
    status: vendorStatus,
  }),
}; 
import { z } from 'zod';

const vendorStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

export const vendorSchema = {
  create: z.object({
    body: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      phone: z.string().min(10).max(15),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string()
      }),
      description: z.string().optional(),
      status: vendorStatusEnum.default('ACTIVE')
    })
  }),

  getById: z.object({
    params: z.object({
      id: z.string().uuid()
    })
  }),

  update: z.object({
    params: z.object({
      id: z.string().uuid()
    }),
    body: z.object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(10).max(15).optional(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string()
      }).optional(),
      description: z.string().optional()
    })
  }),

  delete: z.object({
    params: z.object({
      id: z.string().uuid()
    })
  }),

  updateStatus: z.object({
    params: z.object({
      id: z.string().uuid()
    }),
    body: z.object({
      status: vendorStatusEnum
    })
  })
}; 
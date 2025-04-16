import { VendorStatus } from '@prisma/client';

export interface Vendor {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  website?: string;
  status: VendorStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorCreateInput {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  website?: string;
  status?: VendorStatus;
}

export interface VendorUpdateInput {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  website?: string;
  status?: VendorStatus;
} 
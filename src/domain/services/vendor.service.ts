import { VendorRepository } from '../../infrastructure/repositories/vendor.repository';
import { Vendor, VendorCreateInput, VendorUpdateInput } from '../entities/vendor.entities';
import { VendorStatus } from '@prisma/client';
import { logger } from '../../core/logger';

export class VendorService {
  constructor(private repository: VendorRepository) {}

  async createVendor(data: any) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  async getVendorById(id: string) {
    try {
      const vendor = await this.repository.findById(id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return vendor;
    } catch (error) {
      logger.error('Error getting vendor:', error);
      throw error;
    }
  }

  async getAllVendors() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      logger.error('Error getting vendors:', error);
      throw error;
    }
  }

  async updateVendor(id: string, data: any) {
    try {
      const vendor = await this.repository.findById(id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return await this.repository.update(id, data);
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  async deleteVendor(id: string) {
    try {
      const vendor = await this.repository.findById(id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return await this.repository.delete(id);
    } catch (error) {
      logger.error('Error deleting vendor:', error);
      throw error;
    }
  }

  async updateVendorStatus(id: string, status: VendorStatus) {
    try {
      const vendor = await this.repository.findById(id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return await this.repository.updateStatus(id, status);
    } catch (error) {
      logger.error('Error updating vendor status:', error);
      throw error;
    }
  }
} 
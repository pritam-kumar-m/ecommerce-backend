import { Request, Response } from 'express';
import { VendorService } from '../../domain/services/vendor.service';
import { ResponseHandler } from '../../core/utils/responseHandler';
import { VendorStatus } from '@prisma/client';

export class VendorController {
  constructor(private vendorService: VendorService) {}

  async createVendor(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.createVendor(req.body);
      return ResponseHandler.created(res, vendor, 'Vendor created successfully');
    } catch (error) {
      return ResponseHandler.error(res, error as Error);
    }
  }

  async getVendorById(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.getVendorById(req.params.id);
      return ResponseHandler.success(res, vendor, 'Vendor retrieved successfully');
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.error(res, error as Error);
    }
  }

  async getAllVendors(req: Request, res: Response) {
    try {
      const vendors = await this.vendorService.getAllVendors();
      return ResponseHandler.success(res, vendors, 'Vendors retrieved successfully');
    } catch (error) {
      return ResponseHandler.error(res, error as Error);
    }
  }

  async updateVendor(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.updateVendor(req.params.id, req.body);
      return ResponseHandler.success(res, vendor, 'Vendor updated successfully');
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.error(res, error as Error);
    }
  }

  async deleteVendor(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.deleteVendor(req.params.id);
      return ResponseHandler.success(res, vendor, 'Vendor deleted successfully');
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.error(res, error as Error);
    }
  }

  async updateVendorStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!Object.values(VendorStatus).includes(status)) {
        return ResponseHandler.badRequest(res, 'Invalid vendor status');
      }
      const vendor = await this.vendorService.updateVendorStatus(req.params.id, status);
      return ResponseHandler.success(res, vendor, 'Vendor status updated successfully');
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.error(res, error as Error);
    }
  }
} 
import { Request, Response } from 'express';
import { VendorService } from '../../domain/services/vendor.service';
import { ResponseHandler } from '../../core/utils/responseHandler';
import { VendorStatus } from '@prisma/client';

export class VendorController {
  constructor(private vendorService: VendorService) {}

  async createVendor(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.createVendor(req.body);
      return ResponseHandler.created(res, 'Vendor created successfully', vendor);
    } catch (error) {
      return ResponseHandler.serverError(res, 'Error creating vendor');
    }
  }

  async getVendorById(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.getVendorById(req.params.id);
      return ResponseHandler.success(res, 'Vendor retrieved successfully', vendor);
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.serverError(res, 'Error retrieving vendor');
    }
  }

  async getAllVendors(req: Request, res: Response) {
    try {
      const vendors = await this.vendorService.getAllVendors();
      return ResponseHandler.success(res, 'Vendors retrieved successfully', vendors);
    } catch (error) {
      return ResponseHandler.serverError(res, 'Error retrieving vendors');
    }
  }

  async updateVendor(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.updateVendor(req.params.id, req.body);
      return ResponseHandler.success(res, 'Vendor updated successfully', vendor);
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.serverError(res, 'Error updating vendor');
    }
  }

  async deleteVendor(req: Request, res: Response) {
    try {
      const vendor = await this.vendorService.deleteVendor(req.params.id);
      return ResponseHandler.success(res, 'Vendor deleted successfully', vendor);
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.serverError(res, 'Error deleting vendor');
    }
  }

  async updateVendorStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!Object.values(VendorStatus).includes(status)) {
        return ResponseHandler.badRequest(res, 'Invalid vendor status');
      }
      const vendor = await this.vendorService.updateVendorStatus(req.params.id, status);
      return ResponseHandler.success(res, 'Vendor status updated successfully', vendor);
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return ResponseHandler.notFound(res, 'Vendor not found');
      }
      return ResponseHandler.serverError(res, 'Error updating vendor status');
    }
  }
} 
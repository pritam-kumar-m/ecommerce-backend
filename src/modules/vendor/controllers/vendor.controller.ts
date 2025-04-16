import { Request, Response } from 'express';
import { VendorService } from '../../../domain/services/vendor.service';
import { ResponseHandler } from '../../../core/utils/responseHandler';

export class VendorController {
  constructor(private service: VendorService) {}

  async createVendor(req: Request, res: Response) {
    try {
      const vendor = await this.service.createVendor(req.body);
      return ResponseHandler.created(res, vendor, 'Vendor created successfully');
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  async getVendorById(req: Request, res: Response) {
    try {
      const vendor = await this.service.getVendorById(req.params.id);
      return ResponseHandler.success(res, vendor, 'Vendor retrieved successfully');
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  async getAllVendors(req: Request, res: Response) {
    try {
      const vendors = await this.service.getAllVendors();
      return ResponseHandler.success(res, vendors, 'Vendors retrieved successfully');
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  async updateVendor(req: Request, res: Response) {
    try {
      const vendor = await this.service.updateVendor(req.params.id, req.body);
      return ResponseHandler.success(res, vendor, 'Vendor updated successfully');
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  async deleteVendor(req: Request, res: Response) {
    try {
      await this.service.deleteVendor(req.params.id);
      return ResponseHandler.success(res, null, 'Vendor deleted successfully');
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  async updateVendorStatus(req: Request, res: Response) {
    try {
      const vendor = await this.service.updateVendorStatus(req.params.id, req.body.status);
      return ResponseHandler.success(res, vendor, 'Vendor status updated successfully');
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }
} 
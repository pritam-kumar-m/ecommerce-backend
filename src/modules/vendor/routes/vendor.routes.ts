import express from 'express';
import { VendorController } from '../controllers/vendor.controller';
import { VendorService } from '../../../domain/services/vendor.service';
import { VendorRepository } from '../../../infrastructure/repositories/vendor.repository';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../../../middleware/authMiddleware';
import { validate } from '../../../middleware/schemaValidation';
import { vendorSchema } from '../schemas/vendor.schema';

const router = express.Router();
const prisma = new PrismaClient();
const vendorRepository = new VendorRepository(prisma);
const vendorService = new VendorService(vendorRepository);
const vendorController = new VendorController(vendorService);

// Public routes
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);

// Protected routes
router.post('/', authenticate, validate(vendorSchema.create), vendorController.createVendor);
router.put('/:id', authenticate, validate(vendorSchema.update), vendorController.updateVendor);
router.delete('/:id', authenticate, vendorController.deleteVendor);
router.patch('/:id/status', authenticate, validate(vendorSchema.updateStatus), vendorController.updateVendorStatus);

export default router; 

export class VendorRoutes {
  private router: express.Router;
  private controller: VendorController;

  constructor(controller: VendorController) {
    this.router = express.Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.get('/', this.controller.getAllVendors.bind(this.controller));
    this.router.get('/:id', this.controller.getVendorById.bind(this.controller));

    // Protected routes
    this.router.post('/', authenticate, this.controller.createVendor.bind(this.controller));
    this.router.put('/:id', authenticate, this.controller.updateVendor.bind(this.controller));
    this.router.delete('/:id', authenticate, this.controller.deleteVendor.bind(this.controller));
    this.router.patch('/:id/status', authenticate, this.controller.updateVendorStatus.bind(this.controller));
  }

  public getRouter(): express.Router {
    return this.router;
  }
} 
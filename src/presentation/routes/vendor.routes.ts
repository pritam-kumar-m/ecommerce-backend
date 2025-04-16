import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';
import { validate } from '../../middleware/schemaValidation';
import { vendorSchema } from '../../domain/schemas/vendor.schema';
import { auth } from '../../middleware/auth';

// Create a wrapper function that ensures the auth middleware returns void
const authMiddleware = (req: any, res: any, next: any) => {
  auth(req, res, next);
};

export const vendorRouter = (controller: VendorController) => {
  const router = Router();

  // Apply auth middleware to all routes
  router.use(authMiddleware);

  // Create vendor
  router.post(
    '/',
    validate(vendorSchema.create),
    controller.createVendor.bind(controller)
  );

  // Get vendor by ID
  router.get(
    '/:id',
    validate(vendorSchema.getById),
    controller.getVendorById.bind(controller)
  );

  // Get all vendors
  router.get('/', controller.getAllVendors.bind(controller));

  // Update vendor
  router.put(
    '/:id',
    validate(vendorSchema.update),
    controller.updateVendor.bind(controller)
  );

  // Delete vendor
  router.delete(
    '/:id',
    validate(vendorSchema.delete),
    controller.deleteVendor.bind(controller)
  );

  // Update vendor status
  router.patch(
    '/:id/status',
    validate(vendorSchema.updateStatus),
    controller.updateVendorStatus.bind(controller)
  );

  return router;
}; 
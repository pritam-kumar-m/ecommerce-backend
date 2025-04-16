"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRouter = void 0;
const express_1 = require("express");
const schemaValidation_1 = require("../../middleware/schemaValidation");
const vendor_schema_1 = require("../../domain/schemas/vendor.schema");
const auth_1 = require("../../middleware/auth");
// Create a wrapper function that ensures the auth middleware returns void
const authMiddleware = (req, res, next) => {
    (0, auth_1.auth)(req, res, next);
};
const vendorRouter = (controller) => {
    const router = (0, express_1.Router)();
    // Apply auth middleware to all routes
    router.use(authMiddleware);
    // Create vendor
    router.post('/', (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.create), controller.createVendor.bind(controller));
    // Get vendor by ID
    router.get('/:id', (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.getById), controller.getVendorById.bind(controller));
    // Get all vendors
    router.get('/', controller.getAllVendors.bind(controller));
    // Update vendor
    router.put('/:id', (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.update), controller.updateVendor.bind(controller));
    // Delete vendor
    router.delete('/:id', (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.delete), controller.deleteVendor.bind(controller));
    // Update vendor status
    router.patch('/:id/status', (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.updateStatus), controller.updateVendorStatus.bind(controller));
    return router;
};
exports.vendorRouter = vendorRouter;
//# sourceMappingURL=vendor.routes.js.map
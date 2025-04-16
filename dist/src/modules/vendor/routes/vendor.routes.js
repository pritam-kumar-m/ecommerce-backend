"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vendor_controller_1 = require("../controllers/vendor.controller");
const vendor_service_1 = require("../../../domain/services/vendor.service");
const vendor_repository_1 = require("../../../infrastructure/repositories/vendor.repository");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const schemaValidation_1 = require("../../../middleware/schemaValidation");
const vendor_schema_1 = require("../schemas/vendor.schema");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const vendorRepository = new vendor_repository_1.VendorRepository(prisma);
const vendorService = new vendor_service_1.VendorService(vendorRepository);
const vendorController = new vendor_controller_1.VendorController(vendorService);
// Public routes
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
// Protected routes
router.post('/', authMiddleware_1.authenticate, (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.create), vendorController.createVendor);
router.put('/:id', authMiddleware_1.authenticate, (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.update), vendorController.updateVendor);
router.delete('/:id', authMiddleware_1.authenticate, vendorController.deleteVendor);
router.patch('/:id/status', authMiddleware_1.authenticate, (0, schemaValidation_1.validate)(vendor_schema_1.vendorSchema.updateStatus), vendorController.updateVendorStatus);
exports.default = router;
class VendorRoutes {
    constructor(controller) {
        this.router = express_1.default.Router();
        this.controller = controller;
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Public routes
        this.router.get('/', this.controller.getAllVendors.bind(this.controller));
        this.router.get('/:id', this.controller.getVendorById.bind(this.controller));
        // Protected routes
        this.router.post('/', authMiddleware_1.authenticate, this.controller.createVendor.bind(this.controller));
        this.router.put('/:id', authMiddleware_1.authenticate, this.controller.updateVendor.bind(this.controller));
        this.router.delete('/:id', authMiddleware_1.authenticate, this.controller.deleteVendor.bind(this.controller));
        this.router.patch('/:id/status', authMiddleware_1.authenticate, this.controller.updateVendorStatus.bind(this.controller));
    }
    getRouter() {
        return this.router;
    }
}
exports.VendorRoutes = VendorRoutes;
//# sourceMappingURL=vendor.routes.js.map
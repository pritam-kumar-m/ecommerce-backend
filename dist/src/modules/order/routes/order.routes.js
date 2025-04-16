"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const BaseRouter_1 = require("../../../api/routes/BaseRouter");
const schemaValidation_1 = require("../../../middleware/schemaValidation");
const order_validator_1 = require("../validators/order.validator");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const client_1 = require("@prisma/client");
class OrderRoutes extends BaseRouter_1.BaseRouter {
    constructor(controller) {
        super(controller);
        this.router = (0, express_1.Router)();
        this.orderController = controller;
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Apply authentication middleware to all routes
        this.router.use(authMiddleware_1.authenticate);
        // Public routes (authenticated users)
        this.router.get('/my-orders', (req, res) => this.orderController.getByUserId(req, res));
        this.router.get('/:id', (req, res) => this.controller.getById(req, res));
        this.router.post('/', (0, schemaValidation_1.validate)(order_validator_1.createOrderSchema), (req, res) => this.controller.create(req, res));
        // Admin routes
        this.router.get('/', (0, authMiddleware_1.authorize)(client_1.Role.ADMIN), (req, res) => this.controller.getAll(req, res));
        this.router.put('/:id', (0, authMiddleware_1.authorize)(client_1.Role.ADMIN), (0, schemaValidation_1.validate)(order_validator_1.updateOrderSchema), (req, res) => this.controller.update(req, res));
        this.router.patch('/:id/status', (0, authMiddleware_1.authorize)(client_1.Role.ADMIN), (0, schemaValidation_1.validate)(order_validator_1.updateOrderStatusSchema), (req, res) => this.orderController.updateStatus(req, res));
        this.router.delete('/:id', (0, authMiddleware_1.authorize)(client_1.Role.ADMIN), (req, res) => this.controller.delete(req, res));
    }
    getRouter() {
        return this.router;
    }
}
exports.OrderRoutes = OrderRoutes;
//# sourceMappingURL=order.routes.js.map
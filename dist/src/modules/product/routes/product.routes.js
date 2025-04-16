"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../../infrastructure/middleware/authMiddleware");
const client_1 = require("@prisma/client");
class ProductRoutes {
    constructor(controller) {
        this.router = (0, express_1.Router)();
        this.controller = controller;
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Public routes
        this.router.get('/', this.controller.getAll.bind(this.controller));
        this.router.get('/:id', this.controller.getById.bind(this.controller));
        // Protected routes
        this.router.use(authMiddleware_1.authenticate);
        // Product management routes
        this.router.post('/', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN, client_1.Role.VENDOR]), this.controller.create.bind(this.controller));
        this.router.put('/:id', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN, client_1.Role.VENDOR]), this.controller.update.bind(this.controller));
        this.router.delete('/:id', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN, client_1.Role.VENDOR]), this.controller.delete.bind(this.controller));
        // Category routes
        this.router.get('/categories', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN, client_1.Role.VENDOR]), this.controller.getAllCategories.bind(this.controller));
        this.router.post('/categories', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN]), this.controller.createCategory.bind(this.controller));
        this.router.put('/categories/:id', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN]), this.controller.updateCategory.bind(this.controller));
        this.router.delete('/categories/:id', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN]), this.controller.deleteCategory.bind(this.controller));
    }
    getRouter() {
        return this.router;
    }
}
exports.ProductRoutes = ProductRoutes;
//# sourceMappingURL=product.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../infrastructure/middleware/authMiddleware");
class BaseRouter {
    constructor(controller, requireAuth = false, allowedRoles = []) {
        this.router = (0, express_1.Router)();
        this.controller = controller;
        this.requireAuth = requireAuth;
        this.allowedRoles = allowedRoles;
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Get all
        this.router.get('/', (req, res) => this.controller.getAll(req, res));
        // Get by ID
        this.router.get('/:id', (req, res) => this.controller.getById(req, res));
        // Create
        if (this.requireAuth) {
            this.router.post('/', authMiddleware_1.authenticate, ...(this.allowedRoles.length > 0 ? [(0, authMiddleware_1.authorize)(this.allowedRoles)] : []), (req, res) => this.controller.create(req, res));
        }
        else {
            this.router.post('/', (req, res) => this.controller.create(req, res));
        }
        // Update
        if (this.requireAuth) {
            this.router.put('/:id', authMiddleware_1.authenticate, ...(this.allowedRoles.length > 0 ? [(0, authMiddleware_1.authorize)(this.allowedRoles)] : []), (req, res) => this.controller.update(req, res));
        }
        else {
            this.router.put('/:id', (req, res) => this.controller.update(req, res));
        }
        // Delete
        if (this.requireAuth) {
            this.router.delete('/:id', authMiddleware_1.authenticate, ...(this.allowedRoles.length > 0 ? [(0, authMiddleware_1.authorize)(this.allowedRoles)] : []), (req, res) => this.controller.delete(req, res));
        }
        else {
            this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
        }
    }
}
exports.BaseRouter = BaseRouter;
//# sourceMappingURL=BaseRouter.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRoutes = void 0;
const BaseRouter_1 = require("../../../api/routes/BaseRouter");
const client_1 = require("@prisma/client");
class InventoryRoutes extends BaseRouter_1.BaseRouter {
    constructor(controller) {
        super(controller, true, [client_1.Role.ADMIN]);
        this.initializeInventoryRoutes();
    }
    initializeInventoryRoutes() {
        // Public routes
        this.router.get('/', (req, res) => this.controller.getAll(req, res));
        this.router.get('/:id', (req, res) => this.controller.getById(req, res));
        // Protected routes (admin only)
        this.router.post('/', (req, res) => this.controller.create(req, res));
        this.router.put('/:id', (req, res) => this.controller.update(req, res));
        this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
        // Inventory-specific routes
        this.router.post('/:id/add', (req, res) => this.controller.addStock(req, res));
        this.router.post('/:id/remove', (req, res) => this.controller.removeStock(req, res));
        this.router.get('/:id/operations', (req, res) => this.controller.getOperations(req, res));
    }
    getRouter() {
        return this.router;
    }
}
exports.InventoryRoutes = InventoryRoutes;
//# sourceMappingURL=inventory.routes.js.map
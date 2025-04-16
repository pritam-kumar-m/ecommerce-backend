"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const BaseRouter_1 = require("../../../api/routes/BaseRouter");
const client_1 = require("@prisma/client");
class CategoryRoutes extends BaseRouter_1.BaseRouter {
    constructor(controller) {
        super(controller, true, [client_1.Role.ADMIN]);
        this.initializeCategoryRoutes();
    }
    initializeCategoryRoutes() {
        // Public routes
        this.router.get('/', this.controller.getAll);
        this.router.get('/:id', this.controller.getById);
        // Protected routes
        this.router.post('/', this.controller.create);
        this.router.put('/:id', this.controller.update);
        this.router.delete('/:id', this.controller.delete);
    }
    getRouter() {
        return this.router;
    }
}
exports.CategoryRoutes = CategoryRoutes;
//# sourceMappingURL=category.routes.js.map
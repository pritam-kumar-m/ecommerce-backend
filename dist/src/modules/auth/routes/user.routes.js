"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../../infrastructure/middleware/authMiddleware");
const client_1 = require("@prisma/client");
class UserRoutes {
    constructor(userController) {
        this.userController = userController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Protected routes - require authentication
        this.router.use(authMiddleware_1.authenticate);
        // Admin only routes
        this.router.post('/', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN]), this.userController.createUser.bind(this.userController));
        this.router.get('/', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN]), this.userController.getUsers.bind(this.userController));
        this.router.delete('/:id', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN]), this.userController.deleteUser.bind(this.userController));
        // Admin and self routes (users can access their own data)
        this.router.get('/:id', this.userController.getUserById.bind(this.userController));
        this.router.put('/:id', this.userController.updateUser.bind(this.userController));
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=user.routes.js.map
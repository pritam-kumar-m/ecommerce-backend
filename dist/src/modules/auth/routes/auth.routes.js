"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const AuthBaseRouter_1 = require("../../../api/routes/AuthBaseRouter");
class AuthRoutes extends AuthBaseRouter_1.AuthBaseRouter {
    constructor(controller) {
        super(controller);
        this.initializeAuthRoutes();
    }
    initializeAuthRoutes() {
        // Public routes
        this.router.post('/register', this.controller.register);
        this.router.post('/login', this.controller.login);
        this.router.post('/logout', this.controller.logout);
        this.router.post('/refresh-token', this.controller.refreshToken);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.routes.js.map
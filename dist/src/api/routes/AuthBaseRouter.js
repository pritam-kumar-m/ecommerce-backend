"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthBaseRouter = void 0;
const express_1 = require("express");
class AuthBaseRouter {
    constructor(controller) {
        this.router = (0, express_1.Router)();
        this.controller = controller;
    }
}
exports.AuthBaseRouter = AuthBaseRouter;
//# sourceMappingURL=AuthBaseRouter.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthBaseController_1 = require("../../../api/controllers/AuthBaseController");
class AuthController extends AuthBaseController_1.AuthBaseController {
    constructor(authService) {
        super();
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleRequest(req, res, () => __awaiter(this, void 0, void 0, function* () {
                const registerData = req.body;
                return yield this.authService.register(registerData);
            }));
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleRequest(req, res, () => __awaiter(this, void 0, void 0, function* () {
                const loginData = req.body;
                return yield this.authService.login(loginData);
            }));
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleRequest(req, res, () => __awaiter(this, void 0, void 0, function* () {
                const refreshToken = req.body.refreshToken;
                return yield this.authService.logout(refreshToken);
            }));
        });
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleRequest(req, res, () => __awaiter(this, void 0, void 0, function* () {
                const refreshToken = req.body.refreshToken;
                return yield this.authService.refreshToken(refreshToken);
            }));
        });
        this.authService = authService;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
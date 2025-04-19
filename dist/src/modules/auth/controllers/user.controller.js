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
exports.UserController = void 0;
const responseHandler_1 = require("../../../core/utils/responseHandler");
const auth_types_1 = require("../types/auth.types");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = auth_types_1.createUserSchema.parse(req.body);
                const user = yield this.userService.createUser(validatedData);
                return responseHandler_1.ResponseHandler.created(res, user, 'User created successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUserById(req.params.id);
                return responseHandler_1.ResponseHandler.success(res, user, 'User retrieved successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = auth_types_1.userFilterSchema.parse(Object.assign(Object.assign({}, req.query), { page: Number(req.query.page || 1), limit: Number(req.query.limit || 10), role: req.query.role ? req.query.role : undefined }));
                const { users, total } = yield this.userService.getUsers(filter);
                return responseHandler_1.ResponseHandler.success(res, {
                    users,
                    pagination: {
                        currentPage: filter.page,
                        totalPages: Math.ceil(total / filter.limit),
                        limit: filter.limit,
                        totalItems: total
                    }
                }, 'Users retrieved successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = auth_types_1.updateUserSchema.parse(req.body);
                const user = yield this.userService.updateUser(req.params.id, validatedData);
                return responseHandler_1.ResponseHandler.success(res, user, 'User updated successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.deleteUser(req.params.id);
                return responseHandler_1.ResponseHandler.success(res, user, 'User deleted successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
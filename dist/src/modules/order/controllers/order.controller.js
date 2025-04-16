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
exports.OrderController = void 0;
const BaseController_1 = require("../../../api/controllers/BaseController");
const responseHandler_1 = require("../../../core/utils/responseHandler");
const logger_1 = require("../../../core/logger");
const AppError_1 = require("../../../core/errors/AppError");
class OrderController extends BaseController_1.BaseController {
    constructor(orderService) {
        super(orderService);
        this.orderService = orderService;
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, status, userId } = req.query;
                const filters = {
                    page: Number(page),
                    limit: Number(limit),
                    status: status ? status : undefined,
                    userId: userId
                };
                const { data: orders, total, pagination } = yield this.orderService.getAll(filters);
                responseHandler_1.ResponseHandler.success(res, {
                    orders,
                    pagination
                });
            }
            catch (error) {
                logger_1.logger.error('Error in getAll orders:', error);
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id } = req.params;
                const order = yield this.orderService.getById(id);
                if (!order) {
                    responseHandler_1.ResponseHandler.notFound(res, 'Order not found');
                    return;
                }
                // Check if user is authorized to view this order
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (userId && order.userId !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
                    responseHandler_1.ResponseHandler.forbidden(res, 'You are not authorized to view this order');
                    return;
                }
                responseHandler_1.ResponseHandler.success(res, { order });
            }
            catch (error) {
                logger_1.logger.error('Error in getById order:', error);
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.getByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    responseHandler_1.ResponseHandler.unauthorized(res, 'User not authenticated');
                    return;
                }
                const { page = 1, limit = 10 } = req.query;
                const filters = {
                    page: Number(page),
                    limit: Number(limit),
                    userId
                };
                const { data: orders, total, pagination } = yield this.orderService.getAll(filters);
                responseHandler_1.ResponseHandler.success(res, {
                    orders,
                    pagination
                });
            }
            catch (error) {
                logger_1.logger.error('Error in getByUserId orders:', error);
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("req.user", req.user);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                console.log("userId", userId);
                if (!userId) {
                    responseHandler_1.ResponseHandler.unauthorized(res, 'User not authenticated');
                    return;
                }
                const orderData = Object.assign(Object.assign({}, req.body), { userId });
                const order = yield this.orderService.create(orderData);
                responseHandler_1.ResponseHandler.created(res, {
                    message: 'Order created successfully',
                    order
                });
            }
            catch (error) {
                logger_1.logger.error('Error in create order:', error);
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id } = req.params;
                const updateData = req.body;
                const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'ADMIN';
                const order = yield this.orderService.update(id, updateData, (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, isAdmin);
                if (!order) {
                    responseHandler_1.ResponseHandler.notFound(res, 'Order not found');
                    return;
                }
                responseHandler_1.ResponseHandler.success(res, {
                    message: 'Order updated successfully',
                    order
                });
            }
            catch (error) {
                logger_1.logger.error('Error in update order:', error);
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.updateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const order = yield this.orderService.updateStatus(id, status);
                if (!order) {
                    responseHandler_1.ResponseHandler.notFound(res, 'Order not found');
                    return;
                }
                responseHandler_1.ResponseHandler.success(res, {
                    message: 'Order status updated successfully',
                    order
                });
            }
            catch (error) {
                logger_1.logger.error('Error in updateStatus order:', error);
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id } = req.params;
                const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'ADMIN';
                const order = yield this.orderService.delete(id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, isAdmin);
                responseHandler_1.ResponseHandler.success(res, {
                    message: 'Order deleted successfully'
                });
            }
            catch (error) {
                // logger.error('Error in delete order:', error);
                if (error instanceof AppError_1.BadRequestError) {
                    responseHandler_1.ResponseHandler.badRequest(res, error.message);
                    return;
                }
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map
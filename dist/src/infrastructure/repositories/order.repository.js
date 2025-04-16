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
exports.OrderRepository = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../../core/logger");
const base_repository_1 = require("./base.repository");
class OrderRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'order');
    }
    findAllWithFilters(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, userId, status, startDate, endDate } = filter;
                const skip = (page - 1) * limit;
                // Build where clause
                const where = Object.assign(Object.assign(Object.assign({}, (userId && { userId })), (status && { status })), (startDate && endDate && {
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    }
                }));
                // Fetch orders
                const orders = yield this.prisma.order.findMany({
                    where,
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                // Get total count
                const total = yield this.prisma.order.count({ where });
                return {
                    data: orders,
                    total
                };
            }
            catch (error) {
                logger_1.logger.error('Error in findAllWithFilters:', error);
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.findUnique({
                    where: { id },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in findById:', error);
                throw error;
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.findMany({
                    where: { userId },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error finding orders by user ID', { userId, error });
                throw error;
            }
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.update({
                    where: { id },
                    data: { status },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error updating order status', { id, status, error });
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.create({
                    data: {
                        userId: data.userId,
                        shippingAddress: data.shippingAddress,
                        paymentMethod: data.paymentMethod,
                        status: client_1.OrderStatus.PENDING,
                        paymentStatus: 'PENDING',
                        totalAmount: data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                        items: {
                            create: data.items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        }
                    },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error creating order', { data, error });
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.update({
                    where: { id },
                    data: {
                        status: data.status,
                        paymentStatus: data.paymentStatus
                    },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error updating order', { id, data, error });
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.delete({
                    where: { id },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                // logger.error('Error deleting order', { id, error });
                throw error;
            }
        });
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map
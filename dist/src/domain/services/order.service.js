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
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../../core/errors/AppError");
const logger_1 = require("../../core/logger");
class OrderService {
    constructor(repository, productRepository, inventoryRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }
    getAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                const result = yield this.repository.findAllWithFilters(filter);
                const { page = 1, limit = 10 } = filter;
                const totalPages = Math.ceil(result.total / limit);
                return {
                    data: result.data,
                    total: result.total,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        limit,
                        totalItems: result.total
                    }
                };
            }
            catch (error) {
                logger_1.logger.error('Error finding orders', { filter, error });
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.repository.findById(id);
                if (!order) {
                    throw new AppError_1.NotFoundError(`Order with ID ${id} not found`);
                }
                return order;
            }
            catch (error) {
                logger_1.logger.error('Error finding order by ID', { id, error });
                throw error;
            }
        });
    }
    getByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.findByUserId(userId);
            }
            catch (error) {
                logger_1.logger.error('Error finding orders by user ID', { userId, error });
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Cast the data to OrderCreateInput for internal use
                const orderData = data;
                logger_1.logger.info('Creating order', { userId: orderData.userId });
                // Validate products exist and have sufficient inventory
                const orderItems = [];
                let totalAmount = 0;
                for (const item of orderData.items) {
                    const product = yield this.productRepository.findById(item.productId);
                    if (!product) {
                        throw new AppError_1.AppError(`Product with ID ${item.productId} not found`, 404);
                    }
                    const inventory = yield this.inventoryRepository.findByProductId(item.productId);
                    if (!inventory || inventory.quantity < item.quantity) {
                        throw new AppError_1.AppError(`Insufficient inventory for product ${product.name}`, 400);
                    }
                    // Calculate price based on product's sale price or regular price
                    const price = product.sale_price || product.price;
                    const itemTotal = price * item.quantity;
                    totalAmount += itemTotal;
                    // Add to order items with calculated price
                    orderItems.push({
                        productId: item.productId,
                        quantity: item.quantity,
                        price
                    });
                }
                // Create the order with calculated total amount
                const order = yield this.repository.create(Object.assign(Object.assign({}, orderData), { items: orderItems, totalAmount, status: client_1.OrderStatus.PENDING }));
                // Update inventory levels
                for (const item of orderData.items) {
                    yield this.inventoryRepository.createOperation({
                        productId: item.productId,
                        quantity: item.quantity,
                        type: 'REMOVE',
                        reason: `Order ${order.id} created`
                    });
                }
                logger_1.logger.info('Order created successfully', { orderId: order.id });
                return order;
            }
            catch (error) {
                logger_1.logger.error('Error creating order', { data, error });
                throw error instanceof AppError_1.AppError ? error : new AppError_1.AppError('Failed to create order', 500);
            }
        });
    }
    update(id_1, data_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (id, data, userId, isAdmin = false) {
            try {
                const order = yield this.repository.findById(id);
                if (!order) {
                    throw new AppError_1.NotFoundError('Order not found');
                }
                // Check if user is authorized to update this order
                if (!isAdmin && userId && order.userId !== userId) {
                    throw new AppError_1.ForbiddenError('You are not authorized to update this order');
                }
                // Only allow updating certain fields based on user role
                const updateData = {};
                if (isAdmin) {
                    // Admins can update any field
                    Object.assign(updateData, data);
                }
                else {
                    // Regular users can only update limited fields
                    if (data.paymentStatus) {
                        updateData.paymentStatus = data.paymentStatus;
                    }
                }
                return yield this.repository.update(id, updateData);
            }
            catch (error) {
                logger_1.logger.error('Error updating order', { id, data, error });
                throw error;
            }
        });
    }
    updateStatus(id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingOrder = yield this.getById(id);
                const currentStatus = existingOrder.status;
                // Validate status transition
                if (currentStatus === client_1.OrderStatus.CANCELLED) {
                    throw new AppError_1.BadRequestError('Cannot update status of a cancelled order');
                }
                // If cancelling order, restore inventory
                if (newStatus === client_1.OrderStatus.CANCELLED && currentStatus !== client_1.OrderStatus.CANCELLED) {
                    for (const item of existingOrder.items) {
                        yield this.inventoryRepository.createOperation({
                            productId: item.productId,
                            quantity: item.quantity,
                            type: 'ADD',
                            reason: `Order ${id} cancelled`
                        });
                    }
                }
                return yield this.repository.updateStatus(id, newStatus);
            }
            catch (error) {
                logger_1.logger.error('Error updating order status', { id, newStatus, error });
                throw error;
            }
        });
    }
    delete(id_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (id, userId, isAdmin = false) {
            try {
                const order = yield this.repository.findById(id);
                if (!order) {
                    throw new AppError_1.NotFoundError('Order not found');
                }
                // Check if user is authorized to delete this order
                if (!isAdmin && userId && order.userId !== userId) {
                    throw new AppError_1.ForbiddenError('You are not authorized to delete this order');
                }
                // Prevent deletion of orders that are not in a final state
                if (order.status !== client_1.OrderStatus.DELIVERED &&
                    order.status !== client_1.OrderStatus.CANCELLED) {
                    throw new AppError_1.BadRequestError('Can only delete delivered or cancelled orders');
                }
                return yield this.repository.delete(id);
            }
            catch (error) {
                // logger.error('Error deleting order', { id, error });
                throw error;
            }
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map
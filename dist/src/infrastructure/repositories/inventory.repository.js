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
exports.InventoryRepository = void 0;
const AppError_1 = require("../../core/errors/AppError");
const logger_1 = require("../../core/logger");
class InventoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllWithFilters(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search, lowStock, productId } = filter;
                const skip = (page - 1) * limit;
                // Build where clause
                const where = Object.assign(Object.assign({}, (productId && { productId })), (search && {
                    product: {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { sku: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }));
                // Fetch inventory levels
                const inventoryLevels = yield this.prisma.inventoryLevel.findMany({
                    where,
                    include: {
                        product: true
                    },
                    skip,
                    take: limit,
                    orderBy: {
                        lastUpdated: 'desc'
                    }
                });
                // Filter for low stock if requested
                const filteredLevels = lowStock
                    ? inventoryLevels.filter(level => level.quantity <= level.lowStockThreshold)
                    : inventoryLevels;
                // Get total count
                const total = yield this.prisma.inventoryLevel.count({ where });
                return {
                    data: filteredLevels,
                    total: lowStock ? filteredLevels.length : total
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
                return yield this.prisma.inventoryLevel.findUnique({
                    where: { id },
                    include: {
                        product: true
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in findById:', error);
                throw error;
            }
        });
    }
    findByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.inventoryLevel.findUnique({
                    where: { productId },
                    include: {
                        product: true
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in findByProductId:', error);
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.inventoryLevel.create({
                    data: {
                        productId: data.productId,
                        quantity: data.quantity,
                        lowStockThreshold: data.lowStockThreshold,
                        lastUpdated: new Date()
                    },
                    include: {
                        product: true
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in create:', error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.inventoryLevel.update({
                    where: { id },
                    data: Object.assign(Object.assign(Object.assign(Object.assign({}, (data.productId && { productId: data.productId })), (data.quantity !== undefined && { quantity: data.quantity })), (data.lowStockThreshold !== undefined && { lowStockThreshold: data.lowStockThreshold })), { lastUpdated: new Date() }),
                    include: {
                        product: true
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in update:', error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.inventoryLevel.delete({
                    where: { id },
                    include: {
                        product: true
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in delete:', error);
                throw error;
            }
        });
    }
    createOperation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.type !== 'ADD' && data.type !== 'REMOVE') {
                    throw new AppError_1.BadRequestError('Invalid operation type. Must be either ADD or REMOVE');
                }
                // Use type assertions to ensure proper typing
                const productId = data.productId;
                const quantity = data.quantity;
                const type = data.type;
                const reason = data.reason;
                return yield this.prisma.inventoryOperation.create({
                    data: {
                        product: { connect: { id: productId } },
                        quantity,
                        type,
                        reason
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in createOperation:', error);
                throw error;
            }
        });
    }
    getOperations(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.inventoryOperation.findMany({
                    where: { productId },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Error in getOperations:', error);
                throw error;
            }
        });
    }
}
exports.InventoryRepository = InventoryRepository;
//# sourceMappingURL=inventory.repository.js.map
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
exports.InventoryService = void 0;
const AppError_1 = require("../../core/errors/AppError");
class InventoryService {
    constructor(repository) {
        this.repository = repository;
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
                console.error('Error in InventoryService.getAll:', error);
                throw new AppError_1.BadRequestError('Failed to fetch inventory levels');
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inventoryLevel = yield this.repository.findById(id);
                if (!inventoryLevel) {
                    throw new AppError_1.NotFoundError('Inventory level not found');
                }
                return inventoryLevel;
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to fetch inventory level');
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingLevel = yield this.repository.findByProductId(data.productId);
                if (existingLevel) {
                    throw new AppError_1.BadRequestError('Inventory level already exists for this product');
                }
                return yield this.repository.create(data);
            }
            catch (error) {
                if (error instanceof AppError_1.BadRequestError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to create inventory level');
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingLevel = yield this.repository.findById(id);
                if (!existingLevel) {
                    throw new AppError_1.NotFoundError('Inventory level not found');
                }
                return yield this.repository.update(id, data);
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to update inventory level');
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingLevel = yield this.repository.findById(id);
                if (!existingLevel) {
                    throw new AppError_1.NotFoundError('Inventory level not found');
                }
                return yield this.repository.delete(id);
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to delete inventory level');
            }
        });
    }
    addStock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createOperation(Object.assign(Object.assign({}, data), { type: 'ADD' }));
            }
            catch (error) {
                if (error instanceof AppError_1.BadRequestError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to add stock');
            }
        });
    }
    removeStock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createOperation(Object.assign(Object.assign({}, data), { type: 'REMOVE' }));
            }
            catch (error) {
                if (error instanceof AppError_1.BadRequestError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to remove stock');
            }
        });
    }
    getOperations(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getOperations(productId);
            }
            catch (error) {
                throw new AppError_1.BadRequestError('Failed to fetch inventory operations');
            }
        });
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map
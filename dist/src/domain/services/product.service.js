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
exports.ProductService = void 0;
const AppError_1 = require("../../core/errors/AppError");
class ProductService {
    constructor(repository, categoryRepository) {
        this.repository = repository;
        this.categoryRepository = categoryRepository;
    }
    getAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                console.log('ProductService.getAll called with filter:', JSON.stringify(filter, null, 2));
                const result = yield this.repository.findAllWithFilters(filter);
                console.log('ProductService.getAll result:', JSON.stringify(result, null, 2));
                return {
                    data: result.products,
                    total: result.total,
                    pagination: result.pagination
                };
            }
            catch (error) {
                console.error('Error in ProductService.getAll:', error);
                if (error instanceof Error) {
                    throw new AppError_1.BadRequestError(`Failed to fetch products: ${error.message}`);
                }
                throw new AppError_1.BadRequestError('Failed to fetch products');
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.repository.findById(id);
                if (!product) {
                    throw new AppError_1.NotFoundError('Product not found');
                }
                return product;
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to fetch product');
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if SKU already exists
                const existingProduct = yield this.repository.findBySku(data.sku);
                if (existingProduct) {
                    throw new AppError_1.BadRequestError('Product with this SKU already exists');
                }
                // Validate category exists
                const category = yield this.categoryRepository.findById(data.categoryId);
                if (!category) {
                    throw new AppError_1.BadRequestError('Category not found');
                }
                // Validate prices
                if (data.sale_price && data.sale_price > data.price) {
                    throw new AppError_1.BadRequestError('Sale price cannot be greater than regular price');
                }
                if (data.cost_price > data.retail_price) {
                    throw new AppError_1.BadRequestError('Cost price cannot be greater than retail price');
                }
                return yield this.repository.create(data);
            }
            catch (error) {
                if (error instanceof AppError_1.BadRequestError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to create product');
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProduct = yield this.repository.findById(id);
                if (!existingProduct) {
                    throw new AppError_1.NotFoundError('Product not found');
                }
                // Check if SKU is being updated and if it already exists
                if (data.sku && data.sku !== existingProduct.sku) {
                    const skuExists = yield this.repository.findBySku(data.sku);
                    if (skuExists) {
                        throw new AppError_1.BadRequestError('Product with this SKU already exists');
                    }
                }
                // Validate category if being updated
                if (data.categoryId) {
                    const category = yield this.categoryRepository.findById(data.categoryId);
                    if (!category) {
                        throw new AppError_1.BadRequestError('Category not found');
                    }
                }
                // Validate prices if being updated
                if (data.sale_price && data.price && data.sale_price > data.price) {
                    throw new AppError_1.BadRequestError('Sale price cannot be greater than regular price');
                }
                if (data.cost_price && data.retail_price && data.cost_price > data.retail_price) {
                    throw new AppError_1.BadRequestError('Cost price cannot be greater than retail price');
                }
                return yield this.repository.update(id, data);
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError || error instanceof AppError_1.BadRequestError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to update product');
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.repository.findById(id);
                if (!product) {
                    throw new AppError_1.NotFoundError('Product not found');
                }
                return yield this.repository.delete(id);
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to delete product');
            }
        });
    }
    getAllCategories(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.findAllWithFilters(filter);
            }
            catch (error) {
                throw new AppError_1.BadRequestError('Failed to fetch categories');
            }
        });
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.create(data);
            }
            catch (error) {
                throw new AppError_1.BadRequestError('Failed to create category');
            }
        });
    }
    updateCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.categoryRepository.update(id, data);
                if (!category) {
                    throw new AppError_1.NotFoundError('Category not found');
                }
                return category;
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to update category');
            }
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.categoryRepository.delete(id);
                if (!category) {
                    throw new AppError_1.NotFoundError('Category not found');
                }
                return category;
            }
            catch (error) {
                if (error instanceof AppError_1.NotFoundError)
                    throw error;
                throw new AppError_1.BadRequestError('Failed to delete category');
            }
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map
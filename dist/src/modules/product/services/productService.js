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
exports.productService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProductService {
    // Product CRUD operations
    createProduct(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!input.name || !input.price || !input.categoryId) {
                throw new Error('Name, price, and categoryId are required');
            }
            return prisma.product.create({
                data: {
                    name: input.name,
                    description: input.description || '',
                    sku: input.sku || `SKU-${Date.now()}`,
                    price: input.price,
                    cost_price: input.cost_price || input.price * 0.7,
                    retail_price: input.retail_price || input.price,
                    sale_price: input.sale_price,
                    categoryId: input.categoryId,
                    tags: input.tags || [],
                    weight: input.weight,
                    width: input.width,
                    height: input.height,
                    depth: input.depth,
                    availability: (_a = input.availability) !== null && _a !== void 0 ? _a : true,
                    custom_fields: input.custom_fields
                },
                include: {
                    category: true,
                },
            });
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.product.findUnique({
                where: { id },
                include: {
                    category: true,
                },
            });
        });
    }
    updateProduct(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.product.update({
                where: { id },
                data: input,
                include: {
                    category: true,
                },
            });
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.product.delete({
                where: { id },
            });
        });
    }
    getProducts(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId, minPrice, maxPrice, search, page, limit } = filter;
            const skip = (page - 1) * limit;
            // Build filter conditions
            const where = {};
            if (categoryId) {
                where.categoryId = categoryId;
            }
            if (minPrice !== undefined || maxPrice !== undefined) {
                where.price = {};
                if (minPrice !== undefined)
                    where.price.gte = minPrice;
                if (maxPrice !== undefined)
                    where.price.lte = maxPrice;
            }
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
            // Get products with pagination
            const [products, total] = yield Promise.all([
                prisma.product.findMany({
                    where,
                    include: {
                        category: true,
                    },
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.product.count({ where }),
            ]);
            return { products, total };
        });
    }
    // Category CRUD operations
    createCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!input.name) {
                throw new Error('Category name is required');
            }
            return prisma.category.create({
                data: {
                    name: input.name,
                    description: input.description || '',
                },
            });
        });
    }
    getCategoryById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const [category, products, total] = yield Promise.all([
                prisma.category.findUnique({
                    where: { id },
                }),
                prisma.product.findMany({
                    where: { categoryId: id },
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.product.count({
                    where: { categoryId: id },
                }),
            ]);
            return { category, products, total };
        });
    }
    updateCategory(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.update({
                where: { id },
                data: input,
            });
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.delete({
                where: { id },
            });
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.findMany({
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
            });
        });
    }
    getProductsByCategory(categoryId_1) {
        return __awaiter(this, arguments, void 0, function* (categoryId, page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const [products, total] = yield Promise.all([
                prisma.product.findMany({
                    where: { categoryId },
                    include: {
                        category: true,
                    },
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.product.count({
                    where: { categoryId },
                }),
            ]);
            return { products, total };
        });
    }
}
exports.productService = new ProductService();
//# sourceMappingURL=productService.js.map
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
exports.ProductRepository = void 0;
const client_1 = require("@prisma/client");
const PrismaRepository_1 = require("../database/PrismaRepository");
const AppError_1 = require("../../core/errors/AppError");
class ProductRepository extends PrismaRepository_1.PrismaRepository {
    constructor(prisma) {
        super(prisma, 'product');
        this.prisma = prisma;
    }
    handlePrismaError(error) {
        console.error('Prisma error:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    throw new AppError_1.BadRequestError('A unique constraint would be violated');
                case 'P2025':
                    throw new AppError_1.BadRequestError('Record not found');
                default:
                    throw new AppError_1.BadRequestError(`Database error: ${error.message}`);
            }
        }
        throw new AppError_1.BadRequestError('An unexpected error occurred');
    }
    findBySku(sku) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.product.findUnique({
                    where: { sku },
                });
            }
            catch (error) {
                this.handlePrismaError(error);
                return null;
            }
        });
    }
    findAllWithFilters(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Starting findAllWithFilters with filter:', JSON.stringify(filter, null, 2));
                const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice, tags, availability, minSalePrice, maxSalePrice } = filter;
                const skip = (page - 1) * limit;
                // Build where clause
                const where = {};
                // Add search condition if provided
                if (search) {
                    where.OR = [
                        { name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                        { description: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                        { sku: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                    ];
                }
                // Add category filter if provided
                if (categoryId) {
                    where.categoryId = categoryId;
                }
                // Add price range filter if provided
                if (minPrice !== undefined || maxPrice !== undefined) {
                    where.price = {};
                    if (minPrice !== undefined)
                        where.price.gte = minPrice;
                    if (maxPrice !== undefined)
                        where.price.lte = maxPrice;
                }
                // Add sale price range filter if provided
                if (minSalePrice !== undefined || maxSalePrice !== undefined) {
                    where.sale_price = {};
                    if (minSalePrice !== undefined)
                        where.sale_price.gte = minSalePrice;
                    if (maxSalePrice !== undefined)
                        where.sale_price.lte = maxSalePrice;
                }
                // Add tags filter if provided
                if (tags && tags.length > 0) {
                    where.tags = {
                        hasEvery: tags,
                    };
                }
                // Add availability filter if provided
                if (availability !== undefined) {
                    where.availability = availability;
                }
                console.log('Final where clause:', JSON.stringify(where, null, 2));
                // Check if there are any products in the database
                const totalItems = yield this.prisma.product.count({ where });
                if (totalItems === 0) {
                    console.log('No products found in database');
                    return {
                        products: [],
                        total: 0,
                        pagination: {
                            currentPage: page,
                            totalPages: 0,
                            limit,
                            totalItems: 0
                        }
                    };
                }
                const [products, total] = yield Promise.all([
                    this.prisma.product.findMany({
                        where,
                        skip,
                        take: limit,
                        include: {
                            category: true,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    }),
                    this.prisma.product.count({ where }),
                ]);
                // Filter out products with null SKUs
                const filteredProducts = products.filter(product => product.sku !== null);
                const filteredTotal = filteredProducts.length;
                const totalPages = Math.ceil(filteredTotal / limit);
                console.log(`Found ${filteredProducts.length} products out of ${total} total (after filtering null SKUs)`);
                return {
                    products: filteredProducts,
                    total: filteredTotal,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        limit,
                        totalItems: filteredTotal
                    }
                };
            }
            catch (error) {
                console.error('Error in findAllWithFilters:', error);
                this.handlePrismaError(error);
                return {
                    products: [],
                    total: 0,
                    pagination: {
                        currentPage: 1,
                        totalPages: 0,
                        limit: 10,
                        totalItems: 0
                    }
                }; // This line will never be reached due to the error handling
            }
        });
    }
    findCategoriesWithFilters(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search } = filter;
                const skip = (page - 1) * limit;
                const where = Object.assign({}, (search && {
                    OR: [
                        { name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                        { description: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
                    ]
                }));
                // Check if there are any categories in the database
                const count = yield this.prisma.category.count({ where });
                if (count === 0) {
                    console.log('No categories found in database');
                    return { categories: [], total: 0 };
                }
                const [categories, total] = yield Promise.all([
                    this.prisma.category.findMany({
                        where,
                        skip,
                        take: limit,
                        include: {
                            _count: {
                                select: { products: true }
                            }
                        }
                    }),
                    this.prisma.category.count({ where })
                ]);
                console.log(`Found ${categories.length} categories out of ${total} total`);
                return { categories, total };
            }
            catch (error) {
                console.error('Error in findCategoriesWithFilters:', error);
                this.handlePrismaError(error);
                return { categories: [], total: 0 }; // This line will never be reached due to the error handling
            }
        });
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=product.repository.js.map
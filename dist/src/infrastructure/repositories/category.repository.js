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
exports.CategoryRepository = void 0;
const client_1 = require("@prisma/client");
const PrismaRepository_1 = require("../database/PrismaRepository");
const AppError_1 = require("../../core/errors/AppError");
class CategoryRepository extends PrismaRepository_1.PrismaRepository {
    constructor(prisma) {
        super(prisma, 'category');
        this.prisma = prisma;
    }
    handlePrismaError(error) {
        var _a, _b;
        console.error('Prisma error in CategoryRepository:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    throw new AppError_1.BadRequestError(`Unique constraint violation: ${(_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.join(', ')}`);
                case 'P2025':
                    throw new AppError_1.BadRequestError('Record not found');
                default:
                    throw new AppError_1.BadRequestError(`Database error: ${error.message}`);
            }
        }
        throw new AppError_1.BadRequestError('An unexpected error occurred');
    }
    findAllWithFilters(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search } = filter;
                const skip = (Number(page) - 1) * Number(limit);
                const take = Number(limit);
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
                        take,
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
                console.error('Error in findAllWithFilters:', error);
                this.handlePrismaError(error);
                return { categories: [], total: 0 }; // This line will never be reached due to the error handling
            }
        });
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=category.repository.js.map
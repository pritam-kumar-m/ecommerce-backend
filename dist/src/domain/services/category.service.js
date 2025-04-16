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
exports.CategoryService = void 0;
const AppError_1 = require("../../core/errors/AppError");
class CategoryService {
    constructor(repository) {
        this.repository = repository;
    }
    getAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            const { page = 1, limit = 10 } = filter;
            const result = yield this.repository.findAllWithFilters(filter);
            const totalPages = Math.ceil(result.total / limit);
            return {
                data: result.categories,
                total: result.total,
                pagination: {
                    currentPage: page,
                    totalPages,
                    limit,
                    totalItems: result.total
                }
            };
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.repository.findById(id);
            if (!category) {
                throw new AppError_1.NotFoundError('Category not found');
            }
            return category;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.repository.update(id, data);
            if (!category) {
                throw new AppError_1.NotFoundError('Category not found');
            }
            return category;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.repository.delete(id);
            if (!category) {
                throw new AppError_1.NotFoundError('Category not found');
            }
            return category;
        });
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map
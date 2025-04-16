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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const AppError_1 = require("../../core/errors/AppError");
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.repository.findById(id);
            if (!entity) {
                throw new AppError_1.NotFoundError(`Entity with id ${id} not found`);
            }
            return entity;
        });
    }
    getAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            const { page = 1, limit = 10 } = filter, restFilter = __rest(filter, ["page", "limit"]);
            const skip = (page - 1) * limit;
            const [data, total] = yield Promise.all([
                this.repository.findAll(Object.assign(Object.assign({}, restFilter), { skip, take: limit })),
                this.repository.count(restFilter),
            ]);
            return {
                data,
                total,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    limit,
                    totalItems: total
                }
            };
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.update(id, data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.delete(id);
        });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map
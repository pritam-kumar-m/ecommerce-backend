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
exports.PrismaRepository = void 0;
const AppError_1 = require("../../core/errors/AppError");
class PrismaRepository {
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.modelName = modelName;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.prisma[this.modelName].findUnique({
                    where: { id },
                });
                return result;
            }
            catch (error) {
                this.handlePrismaError(error);
                return null; // This line will never be reached due to the error handling
            }
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                const { skip, take } = filter, where = __rest(filter, ["skip", "take"]);
                return this.prisma[this.modelName].findMany({
                    where,
                    skip,
                    take,
                    orderBy: filter.orderBy,
                });
            }
            catch (error) {
                this.handlePrismaError(error);
                return []; // This line will never be reached due to the error handling
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma[this.modelName].create({
                    data,
                });
            }
            catch (error) {
                this.handlePrismaError(error);
                throw error; // This will be caught by the controller
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].update({
                    where: { id },
                    data,
                });
            }
            catch (error) {
                this.handlePrismaError(error);
                throw error; // This will be caught by the controller
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].delete({
                    where: { id },
                });
            }
            catch (error) {
                this.handlePrismaError(error);
                throw error; // This will be caught by the controller
            }
        });
    }
    count() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                const { skip, take } = filter, where = __rest(filter, ["skip", "take"]);
                return this.prisma[this.modelName].count({
                    where,
                });
            }
            catch (error) {
                this.handlePrismaError(error);
                return 0; // This line will never be reached due to the error handling
            }
        });
    }
    handlePrismaError(error) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // Handle Prisma validation errors
        if (error.code === 'P2002') {
            throw new AppError_1.BadRequestError(`Unique constraint violation: ${(_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.join(', ')}`);
        }
        // Handle foreign key constraint violations
        if (error.code === 'P2003') {
            throw new AppError_1.BadRequestError(`Foreign key constraint violation: ${(_c = error.meta) === null || _c === void 0 ? void 0 : _c.field_name}`);
        }
        // Handle missing required fields
        if (((_d = error.message) === null || _d === void 0 ? void 0 : _d.includes('Argument')) && ((_e = error.message) === null || _e === void 0 ? void 0 : _e.includes('missing'))) {
            const missingField = (_f = error.message.match(/Argument `([^`]+)` is missing/)) === null || _f === void 0 ? void 0 : _f[1];
            throw new AppError_1.BadRequestError(`Required field missing: ${missingField}`);
        }
        // Handle malformed ObjectID errors (MongoDB specific)
        if (error.code === 'P2023' && ((_g = error.message) === null || _g === void 0 ? void 0 : _g.includes('Malformed ObjectID'))) {
            throw new AppError_1.BadRequestError(`Invalid ID format: ${((_h = error.meta) === null || _h === void 0 ? void 0 : _h.message) || 'The provided ID is not in the correct format'}`);
        }
        // Handle record not found errors
        if (error.code === 'P2025') {
            throw new AppError_1.NotFoundError(`${String(this.modelName)} not found`);
        }
        // For any other Prisma errors
        if ((_j = error.code) === null || _j === void 0 ? void 0 : _j.startsWith('P')) {
            throw new AppError_1.BadRequestError(`Database error: ${error.message}`);
        }
        // For any other errors
        throw error;
    }
}
exports.PrismaRepository = PrismaRepository;
//# sourceMappingURL=PrismaRepository.js.map
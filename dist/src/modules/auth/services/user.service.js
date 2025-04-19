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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const AppError_1 = require("../../../core/errors/AppError");
class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.prisma.user.findUnique({
                where: { email: input.email },
            });
            if (existingUser) {
                throw new AppError_1.AppError('Email already exists', 400);
            }
            const hashedPassword = yield (0, bcrypt_1.hash)(input.password, 10);
            return this.prisma.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: hashedPassword,
                    role: input.role || client_1.Role.CUSTOMER,
                },
            });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            return user;
        });
    }
    getUsers(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, role, page, limit, sortBy, sortOrder } = filter;
            const skip = (page - 1) * limit;
            // Build where conditions
            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (role) {
                where.role = role;
            }
            // Build sort conditions
            const orderBy = {};
            if (sortBy) {
                orderBy[sortBy] = sortOrder || 'asc';
            }
            else {
                orderBy.createdAt = 'desc';
            }
            // Get users with pagination
            const [users, total] = yield Promise.all([
                this.prisma.user.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                        password: true, // Include password in response
                    },
                }),
                this.prisma.user.count({ where }),
            ]);
            return { users, total };
        });
    }
    updateUser(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            // If updating email, check if new email is already taken
            if (input.email && input.email !== user.email) {
                const existingUser = yield this.prisma.user.findUnique({
                    where: { email: input.email },
                });
                if (existingUser) {
                    throw new AppError_1.AppError('Email already exists', 400);
                }
            }
            // If updating password, hash it
            let updateData = Object.assign({}, input);
            if (input.password) {
                updateData.password = yield (0, bcrypt_1.hash)(input.password, 10);
            }
            return this.prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    password: true, // Include password in response
                },
            });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            return this.prisma.user.delete({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    password: true, // Include password in response
                },
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
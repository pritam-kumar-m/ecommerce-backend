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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../core/errors/AppError");
const app_config_1 = require("../../core/config/app.config");
class AuthService {
    constructor(prisma) {
        this.tokenBlacklist = new Set();
        this.prisma = prisma;
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name, role = 'CUSTOMER' } = data;
            // Check if user already exists
            const existingUser = yield this.prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                throw new AppError_1.BadRequestError('User with this email already exists');
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create user
            const user = yield this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            // Generate tokens
            const tokens = this.generateTokens(user.id, user.role);
            return { user, tokens };
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            // Find user
            const user = yield this.prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                throw new AppError_1.UnauthorizedError('Invalid credentials');
            }
            // Verify password
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new AppError_1.UnauthorizedError('Invalid credentials');
            }
            // Generate tokens
            const tokens = this.generateTokens(user.id, user.role);
            // Return user without password
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return { user: userWithoutPassword, tokens };
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add token to blacklist
            this.tokenBlacklist.add(refreshToken);
            return { message: 'Logged out successfully' };
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if token is blacklisted
            if (this.tokenBlacklist.has(refreshToken)) {
                throw new AppError_1.UnauthorizedError('Token has been revoked');
            }
            try {
                // Verify refresh token
                const decoded = jsonwebtoken_1.default.verify(refreshToken, app_config_1.appConfig.jwtRefreshSecret);
                // Find user
                const user = yield this.prisma.user.findUnique({
                    where: { id: decoded.userId }
                });
                if (!user) {
                    throw new AppError_1.UnauthorizedError('User not found');
                }
                // Generate new tokens
                return this.generateTokens(user.id, user.role);
            }
            catch (error) {
                throw new AppError_1.UnauthorizedError('Invalid refresh token');
            }
        });
    }
    generateTokens(userId, role) {
        const accessToken = jsonwebtoken_1.default.sign({ userId, role }, app_config_1.appConfig.jwtSecret, { expiresIn: '1d' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, app_config_1.appConfig.jwtRefreshSecret, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
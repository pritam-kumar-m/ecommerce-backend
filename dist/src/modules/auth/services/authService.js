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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
        this.JWT_EXPIRES_IN = '15m';
        this.JWT_REFRESH_EXPIRES_IN = '7d';
    }
    register(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield prisma.user.findUnique({
                where: { email: input.email },
            });
            if (existingUser) {
                throw new Error('Email already registered');
            }
            const hashedPassword = yield bcrypt_1.default.hash(input.password, 10);
            const user = yield prisma.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: hashedPassword,
                    role: input.role,
                },
            });
            console.log("user", user);
            return user;
        });
    }
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { email: input.email },
            });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const isValidPassword = yield bcrypt_1.default.compare(input.password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }
            return this.generateTokens(user);
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jsonwebtoken_1.default.verify(refreshToken, this.JWT_REFRESH_SECRET);
                const user = yield prisma.user.findUnique({
                    where: { id: payload.userId },
                });
                if (!user) {
                    throw new Error('User not found');
                }
                return this.generateTokens(user);
            }
            catch (error) {
                throw new Error('Invalid refresh token');
            }
        });
    }
    generateTokens(user) {
        const payload = {
            userId: user.id,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, this.JWT_REFRESH_SECRET, {
            expiresIn: this.JWT_REFRESH_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map
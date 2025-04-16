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
exports.auth = exports.prisma = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("../../lib/util");
const static_json_1 = __importDefault(require("../../static/static.json"));
const commonFunction_1 = require("../modules/services/commonFunction");
const axios_1 = require("axios");
const jwt_decode_1 = require("jwt-decode");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return (0, commonFunction_1.sendErrorResponse)(res, "Token is missing", axios_1.HttpStatusCode.BadRequest);
        }
        const parts = token.split(".");
        if (parts.length !== 3) {
            return (0, commonFunction_1.sendErrorResponse)(res, "Invalid token format", axios_1.HttpStatusCode.BadRequest);
        }
        // Verify the token first
        try {
            const verifyToken = jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET_KEY);
            // If verification succeeds, decode the token
            const decoded = (0, jwt_decode_1.jwtDecode)(token);
            // Find the user in the database
            const userData = yield exports.prisma.user.findFirst({
                where: {
                    id: decoded.sub,
                },
            });
            if (!userData) {
                return (0, commonFunction_1.sendErrorResponse)(res, "User not found", axios_1.HttpStatusCode.Unauthorized);
            }
            // Attach user data to request and continue
            req.userData = userData;
            next();
        }
        catch (verifyError) {
            if (verifyError instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return (0, commonFunction_1.sendErrorResponse)(res, "Token expired", axios_1.HttpStatusCode.Unauthorized);
            }
            else if (verifyError instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return (0, commonFunction_1.sendErrorResponse)(res, "Invalid token", axios_1.HttpStatusCode.Unauthorized);
            }
            else {
                throw verifyError; // Re-throw unexpected errors
            }
        }
    }
    catch (error) {
        console.error("Authentication error:", error);
        // Handle any other errors
        const response = (0, util_1.commonResponse)(static_json_1.default.RESPONSE_SUCCESS.FALSE, null, "Authentication failed", static_json_1.default.RESPONSE_SUCCESS.TRUE);
        return res
            .status(static_json_1.default.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
            .json(response);
    }
});
exports.auth = auth;
//# sourceMappingURL=auth.js.map
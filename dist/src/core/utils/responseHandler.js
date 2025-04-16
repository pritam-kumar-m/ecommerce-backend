"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
const AppError_1 = require("../errors/AppError");
class ResponseHandler {
    static success(res, data, message = 'Success', statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static created(res, data, message = 'Created successfully') {
        this.success(res, data, message, 201);
    }
    static unauthorized(res, message = 'Unauthorized') {
        res.status(401).json({
            success: false,
            message,
        });
    }
    static forbidden(res, message = 'Forbidden') {
        res.status(403).json({
            success: false,
            message,
        });
    }
    static notFound(res, message = 'Not found') {
        res.status(404).json({
            success: false,
            message,
        });
    }
    static badRequest(res, message = 'Bad request') {
        res.status(400).json({
            success: false,
            message,
        });
    }
    static error(res, error) {
        if (error instanceof AppError_1.AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        else {
            // Log unexpected errors
            console.error('Unexpected error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    static paginated(res, data, total, page, limit, message = 'Success') {
        res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                itemsPerPage: limit,
                totalItems: total
            },
        });
    }
}
exports.ResponseHandler = ResponseHandler;
//# sourceMappingURL=responseHandler.js.map
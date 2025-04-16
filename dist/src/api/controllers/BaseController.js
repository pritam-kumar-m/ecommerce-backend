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
exports.BaseController = void 0;
const responseHandler_1 = require("../../core/utils/responseHandler");
class BaseController {
    constructor(service) {
        this.service = service;
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const entity = yield this.service.getById(id);
                responseHandler_1.ResponseHandler.success(res, entity);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.query, { page, limit } = _a, filter = __rest(_a, ["page", "limit"]);
                const { data, total, pagination } = yield this.service.getAll(Object.assign(Object.assign({}, filter), { page: page ? parseInt(page) : 1, limit: limit ? parseInt(limit) : 10 }));
                responseHandler_1.ResponseHandler.success(res, {
                    data,
                    pagination: {
                        currentPage: pagination.currentPage,
                        totalPages: pagination.totalPages,
                        itemsPerPage: pagination.limit,
                        totalItems: pagination.totalItems
                    }
                });
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Note: Child controllers should override this method to add proper validation
                const entity = yield this.service.create(req.body);
                responseHandler_1.ResponseHandler.created(res, entity);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const entity = yield this.service.update(id, req.body);
                responseHandler_1.ResponseHandler.success(res, entity, 'Updated successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.service.delete(id);
                responseHandler_1.ResponseHandler.success(res, null, 'Deleted successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map
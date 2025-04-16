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
exports.CategoryController = void 0;
const BaseController_1 = require("../../../api/controllers/BaseController");
const responseHandler_1 = require("../../../core/utils/responseHandler");
const product_validator_1 = require("../../../api/validators/product.validator");
class CategoryController extends BaseController_1.BaseController {
    constructor(service) {
        super(service);
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = req.query;
                const result = yield this.service.getAll(filter);
                responseHandler_1.ResponseHandler.success(res, result);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.service.getById(req.params.id);
                responseHandler_1.ResponseHandler.success(res, category);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = product_validator_1.createCategorySchema.parse(req.body);
                const category = yield this.service.create(validatedData);
                responseHandler_1.ResponseHandler.created(res, category);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.service.update(req.params.id, req.body);
                responseHandler_1.ResponseHandler.success(res, category);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.service.delete(req.params.id);
                responseHandler_1.ResponseHandler.success(res, category);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map
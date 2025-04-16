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
exports.ProductController = void 0;
const BaseController_1 = require("../../../api/controllers/BaseController");
const responseHandler_1 = require("../../../core/utils/responseHandler");
const product_validator_1 = require("../../../api/validators/product.validator");
class ProductController extends BaseController_1.BaseController {
    constructor(productService) {
        super(productService);
        this.productService = productService;
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = product_validator_1.productFilterSchema.parse(req.query);
                const result = yield this.productService.getAll(filter);
                responseHandler_1.ResponseHandler.success(res, {
                    products: result.data,
                    total: result.total,
                    pagination: {
                        currentPage: result.pagination.currentPage,
                        totalPages: result.pagination.totalPages,
                        itemsPerPage: result.pagination.limit,
                        totalItems: result.pagination.totalItems
                    }
                }, 'Products retrieved successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.productService.getById(req.params.id);
                responseHandler_1.ResponseHandler.success(res, product, 'Product retrieved successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = product_validator_1.productCreateSchema.parse(req.body);
                // Ensure all required fields are present
                const data = {
                    name: validatedData.name,
                    description: validatedData.description,
                    sku: validatedData.sku,
                    price: validatedData.price,
                    cost_price: validatedData.cost_price,
                    retail_price: validatedData.retail_price,
                    categoryId: validatedData.categoryId,
                    tags: validatedData.tags,
                    sale_price: validatedData.sale_price,
                    weight: validatedData.weight,
                    width: validatedData.width,
                    height: validatedData.height,
                    depth: validatedData.depth,
                    availability: validatedData.availability,
                    custom_fields: validatedData.custom_fields,
                };
                const product = yield this.productService.create(data);
                responseHandler_1.ResponseHandler.success(res, product, 'Product created successfully', 201);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = product_validator_1.productUpdateSchema.parse(req.body);
                const product = yield this.productService.update(req.params.id, validatedData);
                responseHandler_1.ResponseHandler.success(res, product, 'Product updated successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.productService.delete(req.params.id);
                responseHandler_1.ResponseHandler.success(res, product, 'Product deleted successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        // Category operations
        this.getAllCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.productService.getAllCategories(req.query);
                responseHandler_1.ResponseHandler.success(res, result, 'Categories retrieved successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.createCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.productService.createCategory(req.body);
                responseHandler_1.ResponseHandler.success(res, category, 'Category created successfully', 201);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.updateCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.productService.updateCategory(req.params.id, req.body);
                responseHandler_1.ResponseHandler.success(res, category, 'Category updated successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.deleteCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.productService.deleteCategory(req.params.id);
                responseHandler_1.ResponseHandler.success(res, category, 'Category deleted successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map
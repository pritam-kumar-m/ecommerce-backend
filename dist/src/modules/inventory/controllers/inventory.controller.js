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
exports.InventoryController = void 0;
const BaseController_1 = require("../../../api/controllers/BaseController");
const responseHandler_1 = require("../../../core/utils/responseHandler");
const inventory_entities_1 = require("../../../domain/entities/inventory.entities");
class InventoryController extends BaseController_1.BaseController {
    constructor(inventoryService) {
        super(inventoryService);
        this.inventoryService = inventoryService;
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = inventory_entities_1.inventoryFilterSchema.parse(req.query);
                const result = yield this.inventoryService.getAll(filter);
                responseHandler_1.ResponseHandler.success(res, {
                    data: result.data,
                    pagination: {
                        currentPage: result.pagination.currentPage,
                        totalPages: result.pagination.totalPages,
                        itemsPerPage: result.pagination.limit,
                        totalItems: result.pagination.totalItems
                    }
                }, 'Inventory levels retrieved successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const inventoryLevel = yield this.inventoryService.getById(req.params.id);
                responseHandler_1.ResponseHandler.success(res, inventoryLevel, 'Inventory level retrieved successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = inventory_entities_1.inventoryLevelSchema.parse(req.body);
                const inventoryLevel = yield this.inventoryService.create(validatedData);
                responseHandler_1.ResponseHandler.success(res, inventoryLevel, 'Inventory level created successfully', 201);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = inventory_entities_1.inventoryLevelSchema.partial().parse(req.body);
                const inventoryLevel = yield this.inventoryService.update(req.params.id, validatedData);
                responseHandler_1.ResponseHandler.success(res, inventoryLevel, 'Inventory level updated successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const inventoryLevel = yield this.inventoryService.delete(req.params.id);
                responseHandler_1.ResponseHandler.success(res, inventoryLevel, 'Inventory level deleted successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.addStock = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { quantity, reason } = req.body;
                const operation = yield this.inventoryService.addStock({
                    productId: req.params.id,
                    quantity,
                    reason
                });
                responseHandler_1.ResponseHandler.success(res, operation, 'Stock added successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.removeStock = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { quantity, reason } = req.body;
                const operation = yield this.inventoryService.removeStock({
                    productId: req.params.id,
                    quantity,
                    reason
                });
                responseHandler_1.ResponseHandler.success(res, operation, 'Stock removed successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
        this.getOperations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const operations = yield this.inventoryService.getOperations(req.params.id);
                responseHandler_1.ResponseHandler.success(res, operations, 'Inventory operations retrieved successfully');
            }
            catch (error) {
                responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
}
exports.InventoryController = InventoryController;
//# sourceMappingURL=inventory.controller.js.map
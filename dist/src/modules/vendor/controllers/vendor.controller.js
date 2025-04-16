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
exports.VendorController = void 0;
const responseHandler_1 = require("../../../core/utils/responseHandler");
class VendorController {
    constructor(service) {
        this.service = service;
    }
    createVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.service.createVendor(req.body);
                return responseHandler_1.ResponseHandler.created(res, vendor, 'Vendor created successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    getVendorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.service.getVendorById(req.params.id);
                return responseHandler_1.ResponseHandler.success(res, vendor, 'Vendor retrieved successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    getAllVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendors = yield this.service.getAllVendors();
                return responseHandler_1.ResponseHandler.success(res, vendors, 'Vendors retrieved successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    updateVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.service.updateVendor(req.params.id, req.body);
                return responseHandler_1.ResponseHandler.success(res, vendor, 'Vendor updated successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    deleteVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteVendor(req.params.id);
                return responseHandler_1.ResponseHandler.success(res, null, 'Vendor deleted successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
    updateVendorStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.service.updateVendorStatus(req.params.id, req.body.status);
                return responseHandler_1.ResponseHandler.success(res, vendor, 'Vendor status updated successfully');
            }
            catch (error) {
                return responseHandler_1.ResponseHandler.error(res, error);
            }
        });
    }
}
exports.VendorController = VendorController;
//# sourceMappingURL=vendor.controller.js.map
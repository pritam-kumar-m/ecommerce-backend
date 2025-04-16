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
exports.VendorService = void 0;
const logger_1 = require("../../core/logger");
class VendorService {
    constructor(repository) {
        this.repository = repository;
    }
    createVendor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.create(data);
            }
            catch (error) {
                logger_1.logger.error('Error creating vendor:', error);
                throw error;
            }
        });
    }
    getVendorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.repository.findById(id);
                if (!vendor) {
                    throw new Error('Vendor not found');
                }
                return vendor;
            }
            catch (error) {
                logger_1.logger.error('Error getting vendor:', error);
                throw error;
            }
        });
    }
    getAllVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.findAll();
            }
            catch (error) {
                logger_1.logger.error('Error getting vendors:', error);
                throw error;
            }
        });
    }
    updateVendor(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.repository.findById(id);
                if (!vendor) {
                    throw new Error('Vendor not found');
                }
                return yield this.repository.update(id, data);
            }
            catch (error) {
                logger_1.logger.error('Error updating vendor:', error);
                throw error;
            }
        });
    }
    deleteVendor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.repository.findById(id);
                if (!vendor) {
                    throw new Error('Vendor not found');
                }
                return yield this.repository.delete(id);
            }
            catch (error) {
                logger_1.logger.error('Error deleting vendor:', error);
                throw error;
            }
        });
    }
    updateVendorStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.repository.findById(id);
                if (!vendor) {
                    throw new Error('Vendor not found');
                }
                return yield this.repository.updateStatus(id, status);
            }
            catch (error) {
                logger_1.logger.error('Error updating vendor status:', error);
                throw error;
            }
        });
    }
}
exports.VendorService = VendorService;
//# sourceMappingURL=vendor.service.js.map
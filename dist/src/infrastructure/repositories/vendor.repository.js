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
exports.VendorRepository = void 0;
const base_repository_1 = require("./base.repository");
class VendorRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'vendor');
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.vendor.create({
                    data
                });
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.vendor.findUnique({
                    where: { id }
                });
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.vendor.findMany();
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.vendor.update({
                    where: { id },
                    data
                });
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.vendor.delete({
                    where: { id }
                });
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.vendor.update({
                    where: { id },
                    data: { status }
                });
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
}
exports.VendorRepository = VendorRepository;
//# sourceMappingURL=vendor.repository.js.map
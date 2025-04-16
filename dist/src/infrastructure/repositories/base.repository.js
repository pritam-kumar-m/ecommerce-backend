"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const logger_1 = require("../../core/logger");
class BaseRepository {
    constructor(prisma, modelName) {
        this.modelName = modelName;
        this.prisma = prisma;
    }
    handleError(error) {
        logger_1.logger.error(`Error in ${this.modelName} repository:`, error);
        throw error;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map
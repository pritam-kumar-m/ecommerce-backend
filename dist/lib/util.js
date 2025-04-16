"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonResponse = void 0;
const commonResponse = (success, data, message, error) => ({
    success: success,
    message: message,
    error: error,
    data: data,
});
exports.commonResponse = commonResponse;
//# sourceMappingURL=util.js.map
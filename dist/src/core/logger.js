"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// Simple logger implementation
exports.logger = {
    info: (message, ...args) => console.log(message, ...args),
    error: (message, ...args) => console.error(message, ...args),
    warn: (message, ...args) => console.warn(message, ...args),
    debug: (message, ...args) => console.debug(message, ...args)
};
//# sourceMappingURL=logger.js.map
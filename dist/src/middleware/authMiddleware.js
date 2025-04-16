"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const auth_1 = require("./auth");
// Create a wrapper function that ensures the auth middleware returns void
const authenticate = (req, res, next) => {
    (0, auth_1.auth)(req, res, () => {
        // After auth middleware runs, set req.user from req.userData
        if (req.userData) {
            req.user = {
                userId: req.userData.id,
                role: req.userData.role
            };
        }
        next();
    });
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authMiddleware.js.map
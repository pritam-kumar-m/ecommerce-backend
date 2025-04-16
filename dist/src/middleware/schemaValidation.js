"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        if (e.errors) {
            // Custom error handling for Zod errors
            const formattedErrors = e.errors.map((error) => ({
                path: error.path.join("."),
                message: `Invalid input for : ${error.message} ${error.path.join(".")}`,
            }));
            res.status(400).json({
                status: "error",
                errors: formattedErrors,
            });
        }
        else {
            // Handle unexpected errors
            res.status(500).json({
                status: "error",
                message: "An unexpected error occurred.",
            });
        }
    }
};
exports.validate = validate;
//# sourceMappingURL=schemaValidation.js.map
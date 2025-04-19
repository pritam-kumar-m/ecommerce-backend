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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const container_1 = require("./core/container");
const db_1 = __importDefault(require("../database/db"));
const errorHandler_1 = require("./infrastructure/middleware/errorHandler");
const app = (0, express_1.default)();
const container = container_1.Container.getInstance();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Ecommerce app is running');
});
// Routes
app.use('/api/products', container.getProductRoutes().getRouter());
app.use('/api/categories', container.getCategoryRoutes().getRouter());
app.use('/api/auth', container.getAuthRoutes().getRouter());
app.use('/api/users', container.getUserRoutes().getRouter());
app.use('/api/inventory', container.getInventoryRoutes().getRouter());
app.use('/api/orders', container.getOrderRoutes().getRouter());
app.use('/api/vendors', container.getVendorRoutes().getRouter());
// Error handling
app.use(errorHandler_1.ErrorHandler);
// Start server
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to database
        yield (0, db_1.default)();
        // Start listening
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=index.js.map
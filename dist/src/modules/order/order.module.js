"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const order_controller_1 = require("./controllers/order.controller");
const order_routes_1 = require("./routes/order.routes");
const order_service_1 = require("../../domain/services/order.service");
const order_repository_1 = require("../../infrastructure/repositories/order.repository");
const product_repository_1 = require("../../infrastructure/repositories/product.repository");
const inventory_repository_1 = require("../../infrastructure/repositories/inventory.repository");
const client_1 = require("@prisma/client");
class OrderModule {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.orderRepository = new order_repository_1.OrderRepository(this.prisma);
        this.productRepository = new product_repository_1.ProductRepository(this.prisma);
        this.inventoryRepository = new inventory_repository_1.InventoryRepository(this.prisma);
        this.orderService = new order_service_1.OrderService(this.orderRepository, this.productRepository, this.inventoryRepository);
        this.orderController = new order_controller_1.OrderController(this.orderService);
        this.orderRoutes = new order_routes_1.OrderRoutes(this.orderController);
    }
    static getInstance() {
        if (!OrderModule.instance) {
            OrderModule.instance = new OrderModule();
        }
        return OrderModule.instance;
    }
    getRoutes() {
        return this.orderRoutes;
    }
}
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map
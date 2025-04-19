"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const client_1 = require("@prisma/client");
const product_repository_1 = require("../infrastructure/repositories/product.repository");
const category_repository_1 = require("../infrastructure/repositories/category.repository");
const product_service_1 = require("../domain/services/product.service");
const category_service_1 = require("../domain/services/category.service");
const auth_service_1 = require("../domain/services/auth.service");
const product_controller_1 = require("../modules/product/controllers/product.controller");
const category_controller_1 = require("../modules/product/controllers/category.controller");
const auth_controller_1 = require("../modules/auth/controllers/auth.controller");
const product_routes_1 = require("../modules/product/routes/product.routes");
const category_routes_1 = require("../modules/product/routes/category.routes");
const auth_routes_1 = require("../modules/auth/routes/auth.routes");
const user_routes_1 = require("../modules/auth/routes/user.routes");
const user_controller_1 = require("../modules/auth/controllers/user.controller");
const user_service_1 = require("../modules/auth/services/user.service");
const inventory_repository_1 = require("../infrastructure/repositories/inventory.repository");
const inventory_service_1 = require("../domain/services/inventory.service");
const inventory_controller_1 = require("../modules/inventory/controllers/inventory.controller");
const inventory_routes_1 = require("../modules/inventory/routes/inventory.routes");
const order_repository_1 = require("../infrastructure/repositories/order.repository");
const order_service_1 = require("../domain/services/order.service");
const order_controller_1 = require("../modules/order/controllers/order.controller");
const order_routes_1 = require("../modules/order/routes/order.routes");
const vendor_repository_1 = require("../infrastructure/repositories/vendor.repository");
const vendor_service_1 = require("../domain/services/vendor.service");
const vendor_controller_1 = require("../modules/vendor/controllers/vendor.controller");
const vendor_routes_1 = require("../modules/vendor/routes/vendor.routes");
class Container {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        // Initialize empty objects
        this.repositories = {};
        this.services = {};
        this.controllers = {};
        this.routes = {};
        this.initializeDependencies();
    }
    static getInstance() {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }
    initializeDependencies() {
        // Initialize repositories
        this.repositories.product = new product_repository_1.ProductRepository(this.prisma);
        this.repositories.category = new category_repository_1.CategoryRepository(this.prisma);
        this.repositories.inventory = new inventory_repository_1.InventoryRepository(this.prisma);
        this.repositories.order = new order_repository_1.OrderRepository(this.prisma);
        this.repositories.vendor = new vendor_repository_1.VendorRepository(this.prisma);
        // Initialize services
        this.services = {
            product: new product_service_1.ProductService(this.repositories.product, this.repositories.category),
            category: new category_service_1.CategoryService(this.repositories.category),
            auth: new auth_service_1.AuthService(this.prisma),
            inventory: new inventory_service_1.InventoryService(this.repositories.inventory),
            order: new order_service_1.OrderService(this.repositories.order, this.repositories.product, this.repositories.inventory),
            vendor: new vendor_service_1.VendorService(this.repositories.vendor),
            user: new user_service_1.UserService(),
        };
        // Initialize controllers
        this.controllers = {
            product: new product_controller_1.ProductController(this.services.product),
            category: new category_controller_1.CategoryController(this.services.category),
            auth: new auth_controller_1.AuthController(this.services.auth),
            inventory: new inventory_controller_1.InventoryController(this.services.inventory),
            order: new order_controller_1.OrderController(this.services.order),
            vendor: new vendor_controller_1.VendorController(this.services.vendor),
            user: new user_controller_1.UserController(this.services.user),
        };
        // Initialize routes
        this.routes = {
            product: new product_routes_1.ProductRoutes(this.controllers.product),
            category: new category_routes_1.CategoryRoutes(this.controllers.category),
            auth: new auth_routes_1.AuthRoutes(this.controllers.auth),
            inventory: new inventory_routes_1.InventoryRoutes(this.controllers.inventory),
            order: new order_routes_1.OrderRoutes(this.controllers.order),
            vendor: new vendor_routes_1.VendorRoutes(this.controllers.vendor),
            user: new user_routes_1.UserRoutes(this.controllers.user),
        };
    }
    getPrisma() {
        return this.prisma;
    }
    getProductRepository() {
        return this.repositories.product;
    }
    getCategoryRepository() {
        return this.repositories.category;
    }
    getProductService() {
        return this.services.product;
    }
    getCategoryService() {
        return this.services.category;
    }
    getAuthService() {
        return this.services.auth;
    }
    getProductController() {
        return this.controllers.product;
    }
    getCategoryController() {
        return this.controllers.category;
    }
    getAuthController() {
        return this.controllers.auth;
    }
    getProductRoutes() {
        return this.routes.product;
    }
    getCategoryRoutes() {
        return this.routes.category;
    }
    getAuthRoutes() {
        return this.routes.auth;
    }
    getInventoryRepository() {
        return this.repositories.inventory;
    }
    getInventoryService() {
        return this.services.inventory;
    }
    getInventoryController() {
        return this.controllers.inventory;
    }
    getInventoryRoutes() {
        return this.routes.inventory;
    }
    getOrderRepository() {
        return this.repositories.order;
    }
    getOrderService() {
        return this.services.order;
    }
    getOrderController() {
        return this.controllers.order;
    }
    getOrderRoutes() {
        return this.routes.order;
    }
    getVendorRoutes() {
        return this.routes.vendor;
    }
    getUserRoutes() {
        return this.routes.user;
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map
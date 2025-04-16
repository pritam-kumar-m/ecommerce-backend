import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../infrastructure/repositories/product.repository';
import { CategoryRepository } from '../infrastructure/repositories/category.repository';
import { ProductService } from '../domain/services/product.service';
import { CategoryService } from '../domain/services/category.service';
import { AuthService } from '../domain/services/auth.service';
import { ProductController } from '../modules/product/controllers/product.controller';
import { CategoryController } from '../modules/product/controllers/category.controller';
import { AuthController } from '../modules/auth/controllers/auth.controller';
import { ProductRoutes } from '../modules/product/routes/product.routes';
import { CategoryRoutes } from '../modules/product/routes/category.routes';
import { AuthRoutes } from '../modules/auth/routes/auth.routes';
import { InventoryRepository } from '../infrastructure/repositories/inventory.repository';
import { InventoryService } from '../domain/services/inventory.service';
import { InventoryController } from '../modules/inventory/controllers/inventory.controller';
import { InventoryRoutes } from '../modules/inventory/routes/inventory.routes';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderService } from '../domain/services/order.service';
import { OrderController } from '../modules/order/controllers/order.controller';
import { OrderRoutes } from '../modules/order/routes/order.routes';
import { VendorRepository } from '../infrastructure/repositories/vendor.repository';
import { VendorService } from '../domain/services/vendor.service';
import { VendorController } from '../modules/vendor/controllers/vendor.controller';
import { VendorRoutes } from '../modules/vendor/routes/vendor.routes';

export class Container {
  private static instance: Container;
  private prisma: PrismaClient;
  private repositories: any = {};
  private services: any = {};
  private controllers: any = {};
  private routes: any = {};

  private constructor() {
    this.prisma = new PrismaClient();
    this.initializeDependencies();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeDependencies(): void {
    // Initialize repositories
    this.repositories.product = new ProductRepository(this.prisma);
    this.repositories.category = new CategoryRepository(this.prisma);
    this.repositories.inventory = new InventoryRepository(this.prisma);
    this.repositories.order = new OrderRepository(this.prisma);
    this.repositories.vendor = new VendorRepository(this.prisma);

    // Initialize services
    this.services.product = new ProductService(
      this.repositories.product,
      this.repositories.category
    );
    this.services.category = new CategoryService(this.repositories.category);
    this.services.auth = new AuthService(this.prisma);
    this.services.inventory = new InventoryService(this.repositories.inventory);
    this.services.order = new OrderService(
      this.repositories.order,
      this.repositories.product,
      this.repositories.inventory
    );
    this.services.vendor = new VendorService(this.repositories.vendor);

    // Initialize controllers
    this.controllers.product = new ProductController(this.services.product);
    this.controllers.category = new CategoryController(this.services.category);
    this.controllers.auth = new AuthController(this.services.auth);
    this.controllers.inventory = new InventoryController(this.services.inventory);
    this.controllers.order = new OrderController(this.services.order);
    this.controllers.vendor = new VendorController(this.services.vendor);

    // Initialize routes
    this.routes.product = new ProductRoutes(this.controllers.product);
    this.routes.category = new CategoryRoutes(this.controllers.category);
    this.routes.auth = new AuthRoutes(this.controllers.auth);
    this.routes.inventory = new InventoryRoutes(this.controllers.inventory);
    this.routes.order = new OrderRoutes(this.controllers.order);
    this.routes.vendor = new VendorRoutes(this.controllers.vendor);
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public getProductRepository(): ProductRepository {
    return this.repositories.product;
  }

  public getCategoryRepository(): CategoryRepository {
    return this.repositories.category;
  }

  public getProductService(): ProductService {
    return this.services.product;
  }

  public getCategoryService(): CategoryService {
    return this.services.category;
  }

  public getAuthService(): AuthService {
    return this.services.auth;
  }

  public getProductController(): ProductController {
    return this.controllers.product;
  }

  public getCategoryController(): CategoryController {
    return this.controllers.category;
  }

  public getAuthController(): AuthController {
    return this.controllers.auth;
  }

  public getProductRoutes(): ProductRoutes {
    return this.routes.product;
  }

  public getCategoryRoutes(): CategoryRoutes {
    return this.routes.category;
  }

  public getAuthRoutes(): AuthRoutes {
    return this.routes.auth;
  }

  public getInventoryRepository(): InventoryRepository {
    return this.repositories.inventory;
  }

  public getInventoryService(): InventoryService {
    return this.services.inventory;
  }

  public getInventoryController(): InventoryController {
    return this.controllers.inventory;
  }

  public getInventoryRoutes(): InventoryRoutes {
    return this.routes.inventory;
  }

  public getOrderRepository(): OrderRepository {
    return this.repositories.order;
  }

  public getOrderService(): OrderService {
    return this.services.order;
  }

  public getOrderController(): OrderController {
    return this.controllers.order;
  }

  public getOrderRoutes(): OrderRoutes {
    return this.routes.order;
  }

  public getVendorRoutes() {
    return this.routes.vendor;
  }
}